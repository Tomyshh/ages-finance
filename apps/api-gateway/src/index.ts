import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PennylaneFirm, type PennylaneClient } from "@agec/pennylane";
import {
  createDeliverySchema,
  deliveryStatusSchema,
  type FiscalYear,
} from "@agec/shared";
import { z } from "zod";
import { config } from "./config.js";
import { createStore } from "./store.js";

const app = new Hono();
const store = createStore();
const firm = new PennylaneFirm({
  apiKey: config.pennylane.apiKey,
  use2026Api: config.pennylane.use2026Api,
});

/** Returns a (memoized) v2 client scoped to a managed company. */
const companyClients = new Map<string, PennylaneClient>();
function dossier(companyId: string): PennylaneClient {
  let client = companyClients.get(companyId);
  if (!client) {
    client = firm.company(companyId);
    companyClients.set(companyId, client);
  }
  return client;
}

app.get("/healthz", (c) => c.json({ ok: true, service: "api-gateway" }));

// ---- Public API (consumed by the dashboard) ----
app.use("/api/*", cors({ origin: config.dashboardOrigin }));
app.use("/api/*", async (c, next) => {
  if (config.publicToken) {
    const auth = c.req.header("authorization");
    if (auth !== `Bearer ${config.publicToken}`) {
      return c.json({ error: "unauthorized" }, 401);
    }
  }
  await next();
});

// ---- Firm portfolio (the AGEC Finances dossiers) ----
app.get("/api/dossiers", async (c) => {
  try {
    const items = await cached("dossiers", () => firm.listCompanies());
    return c.json({ items });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

app.get("/api/stats", async (c) => {
  try {
    const [dossiers, jobs] = await Promise.all([
      cached("dossiers", () => firm.listCompanies()),
      store.listJobs(),
    ]);
    return c.json({
      stats: {
        dossiers: dossiers.length,
        deliveriesSent: jobs.filter((j) => j.status === "sent").length,
        deliveriesTotal: jobs.length,
      },
    });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

// ---- Per-dossier data (company-scoped via X-Company-Id) ----
app.get("/api/dossiers/:companyId/company", async (c) => {
  const id = c.req.param("companyId");
  try {
    const company = await cached(`company:${id}`, () => dossier(id).getCompanyInfo());
    return c.json({ companyId: id, company });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

app.get("/api/dossiers/:companyId/customers", async (c) => {
  const id = c.req.param("companyId");
  try {
    const items = await cached(`customers:${id}`, () => dossier(id).listCustomers());
    return c.json({ items });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

app.get("/api/dossiers/:companyId/suppliers", async (c) => {
  const id = c.req.param("companyId");
  try {
    const items = await cached(`suppliers:${id}`, () => dossier(id).listSuppliers());
    return c.json({ items });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

app.get("/api/dossiers/:companyId/fiscal-years", async (c) => {
  const id = c.req.param("companyId");
  try {
    const items = await cached(`fiscal-years:${id}`, () => dossier(id).listFiscalYears());
    return c.json({ items });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

app.get("/api/dossiers/:companyId/stats", async (c) => {
  const id = c.req.param("companyId");
  try {
    const [customers, suppliers, fiscalYears, jobs] = await Promise.all([
      cached(`customers:${id}`, () => dossier(id).listCustomers()),
      cached(`suppliers:${id}`, () => dossier(id).listSuppliers()),
      cached(`fiscal-years:${id}`, () => dossier(id).listFiscalYears()),
      store.listJobs(),
    ]);
    return c.json({
      stats: {
        customers: customers.length,
        suppliers: suppliers.length,
        fiscalYears: fiscalYears.length,
        deliveriesSent: jobs.filter(
          (j) => j.companyId === id && j.status === "sent",
        ).length,
      },
    });
  } catch (err) {
    return c.json({ error: asMessage(err) }, 502);
  }
});

app.get("/api/deliveries", async (c) => {
  const companyId = c.req.query("companyId");
  const all = await store.listJobs();
  const items = companyId ? all.filter((j) => j.companyId === companyId) : all;
  return c.json({ items });
});

// Direct download of the clôture ZIP (no email). Builds synchronously.
app.get("/api/dossiers/:companyId/cloture", async (c) => {
  const companyId = c.req.param("companyId");
  const fiscalYearId = c.req.query("fiscalYearId");
  const periodStart = c.req.query("periodStart");
  const periodEnd = c.req.query("periodEnd");

  let period: { start: string; end: string; label: string };
  let companyName: string | null;
  try {
    period = await resolvePeriod(companyId, {
      companyId,
      fiscalYearId: fiscalYearId ?? undefined,
      periodStart: periodStart ?? undefined,
      periodEnd: periodEnd ?? undefined,
    });
    companyName = await resolveCompanyName(companyId);
  } catch (err) {
    return c.json({ error: asMessage(err) }, 400);
  }

  const response = await fetch(
    `${config.mailingServiceUrl.replace(/\/$/, "")}/internal/build-cloture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.internalSecret,
      },
      body: JSON.stringify({
        companyId,
        companyName: companyName ?? undefined,
        fiscalYearLabel: period.label,
        periodStart: period.start,
        periodEnd: period.end,
      }),
    },
  );

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    return c.json({ error: `mailing -> ${response.status} ${detail}` }, 502);
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        `attachment; filename="cloture_${companyId}_${period.label}.zip"`,
    },
  });
});

app.post("/api/deliveries", async (c) => {
  const parsed = createDeliverySchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "invalid_payload", details: parsed.error.flatten() }, 400);
  }
  const input = parsed.data;
  const companyId = input.companyId;

  let period: { start: string; end: string; label: string };
  let companyName: string | null = null;
  try {
    period = await resolvePeriod(companyId, input);
    companyName = await resolveCompanyName(companyId);
  } catch (err) {
    return c.json({ error: asMessage(err) }, 400);
  }

  const recipient = input.recipient ?? config.defaultRecipient;
  const job = await store.createJob({
    companyId,
    companyName,
    fiscalYearLabel: period.label,
    periodStart: period.start,
    periodEnd: period.end,
    recipient,
  });

  try {
    await triggerMailing({
      jobId: job.id,
      companyId,
      companyName: companyName ?? undefined,
      fiscalYearLabel: period.label,
      periodStart: period.start,
      periodEnd: period.end,
      recipient,
    });
  } catch (err) {
    const updated = await store.updateJob(job.id, {
      status: "error",
      error: `D\u00e9clenchement mailing impossible: ${asMessage(err)}`,
    });
    return c.json({ job: updated ?? job }, 502);
  }

  return c.json({ job }, 201);
});

// ---- Internal API (callbacks from the mailing service) ----
app.use("/internal/*", async (c, next) => {
  if (c.req.header("x-internal-secret") !== config.internalSecret) {
    return c.json({ error: "unauthorized" }, 401);
  }
  await next();
});

const statusUpdateSchema = z.object({
  status: deliveryStatusSchema,
  zipBytes: z.number().nullable().optional(),
  downloadUrl: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
});

app.post("/internal/deliveries/:jobId/status", async (c) => {
  const jobId = c.req.param("jobId");
  const parsed = statusUpdateSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "invalid_payload", details: parsed.error.flatten() }, 400);
  }
  const patch = parsed.data;
  const updated = await store.updateJob(jobId, {
    status: patch.status,
    zipBytes: patch.zipBytes ?? undefined,
    downloadUrl: patch.downloadUrl ?? undefined,
    error: patch.error ?? undefined,
    sentAt: patch.status === "sent" ? new Date().toISOString() : undefined,
  });
  if (!updated) return c.json({ error: "not_found" }, 404);
  return c.json({ job: updated });
});

async function resolvePeriod(
  companyId: string,
  input: z.infer<typeof createDeliverySchema>,
): Promise<{ start: string; end: string; label: string }> {
  if (input.periodStart && input.periodEnd) {
    return {
      start: input.periodStart,
      end: input.periodEnd,
      label: labelFor(input.periodStart, input.periodEnd),
    };
  }
  if (input.fiscalYearId !== undefined) {
    const fiscalYears = await cached(`fiscal-years:${companyId}`, () =>
      dossier(companyId).listFiscalYears(),
    );
    const match = fiscalYears.find(
      (fy: FiscalYear) => String(fy.id) === String(input.fiscalYearId),
    );
    if (!match) throw new Error(`Exercice ${input.fiscalYearId} introuvable`);
    return { start: match.start, end: match.end, label: match.label };
  }
  throw new Error("fiscalYearId ou (periodStart + periodEnd) requis");
}

async function resolveCompanyName(companyId: string): Promise<string | null> {
  try {
    const dossiers = await cached("dossiers", () => firm.listCompanies());
    return dossiers.find((d) => String(d.id) === companyId)?.name ?? null;
  } catch {
    return null;
  }
}

async function triggerMailing(payload: {
  jobId: string;
  companyId: string;
  companyName?: string;
  fiscalYearLabel: string;
  periodStart: string;
  periodEnd: string;
  recipient: string;
}): Promise<void> {
  const response = await fetch(
    `${config.mailingServiceUrl.replace(/\/$/, "")}/internal/send-cloture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": config.internalSecret,
      },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    throw new Error(`mailing -> ${response.status}`);
  }
}

function labelFor(start: string, end: string): string {
  const s = start.slice(0, 4);
  const e = end.slice(0, 4);
  return s === e ? s : `${s}-${e}`;
}

function asMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// Small in-memory cache to avoid hammering the Pennylane API on every dashboard load.
const CACHE_TTL_MS = 5 * 60_000;
const cache = new Map<string, { expires: number; value: unknown }>();

async function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  const value = await loader();
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`[gateway] service en \u00e9coute sur le port ${info.port}`);
});
