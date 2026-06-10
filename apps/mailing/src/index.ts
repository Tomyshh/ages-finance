import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { z } from "zod";
import { PennylaneFirm } from "@agec/pennylane";
import { sendClotureSchema } from "@agec/shared";
import { config } from "./config.js";
import { buildClotureZip } from "./cloture.js";
import { sendClotureMail } from "./mailer.js";
import { reportDeliveryStatus } from "./gateway-callback.js";

const app = new Hono();

const firm = new PennylaneFirm({
  apiKey: config.pennylane.apiKey,
  use2026Api: config.pennylane.use2026Api,
});

app.get("/healthz", (c) => c.json({ ok: true, service: "mailing" }));

app.use("/internal/*", async (c, next) => {
  if (c.req.header("x-internal-secret") !== config.internalSecret) {
    return c.json({ error: "unauthorized" }, 401);
  }
  await next();
});

app.post("/internal/send-cloture", async (c) => {
  const parsed = sendClotureSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "invalid_payload", details: parsed.error.flatten() }, 400);
  }

  const job = parsed.data;
  // Acknowledge immediately; the heavy work runs in the background.
  void processCloture(job).catch((err) => {
    console.error(`[mailing] traitement \u00e9chou\u00e9 pour ${job.jobId}:`, err);
  });

  return c.json({ accepted: true, jobId: job.jobId }, 202);
});

const buildClotureRequestSchema = z.object({
  companyId: z.string(),
  companyName: z.string().optional(),
  fiscalYearLabel: z.string(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** Builds the clôture ZIP synchronously and streams it back (direct download). */
app.post("/internal/build-cloture", async (c) => {
  const parsed = buildClotureRequestSchema.safeParse(
    await c.req.json().catch(() => null),
  );
  if (!parsed.success) {
    return c.json({ error: "invalid_payload", details: parsed.error.flatten() }, 400);
  }

  const req = parsed.data;
  try {
    const artifacts = await buildClotureZip({
      client: firm.company(req.companyId),
      periodStart: req.periodStart,
      periodEnd: req.periodEnd,
      fiscalYearLabel: req.fiscalYearLabel,
    });

    const filename = `cloture_${sanitize(req.companyName ?? req.companyId)}_${sanitize(
      req.fiscalYearLabel,
    )}.zip`;

    return new Response(new Uint8Array(artifacts.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Cloture-File-Count": String(artifacts.fileCount),
        "X-Cloture-Error-Count": String(artifacts.errors.length),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[mailing] build cl\u00f4ture \u00e9chou\u00e9 (${req.companyId}): ${message}`);
    return c.json({ error: message }, 502);
  }
});

async function processCloture(job: ReturnType<typeof sendClotureSchema.parse>): Promise<void> {
  await reportDeliveryStatus(job.jobId, { status: "processing" });

  try {
    const artifacts = await buildClotureZip({
      client: firm.company(job.companyId),
      periodStart: job.periodStart,
      periodEnd: job.periodEnd,
      fiscalYearLabel: job.fiscalYearLabel,
    });

    const zipFilename = `cloture_${sanitize(job.companyName ?? job.companyId)}_${sanitize(
      job.fiscalYearLabel,
    )}.zip`;

    const result = await sendClotureMail({
      to: job.recipient,
      companyName: job.companyName ?? null,
      fiscalYearLabel: job.fiscalYearLabel,
      zipFilename,
      zip: artifacts.buffer,
      fileCount: artifacts.fileCount,
      errors: artifacts.errors,
    });

    await reportDeliveryStatus(job.jobId, {
      status: "sent",
      zipBytes: result.zipBytes,
      downloadUrl: result.downloadUrl,
      error: artifacts.errors.length > 0 ? artifacts.errors.join("; ") : null,
    });
    console.log(`[mailing] cl\u00f4ture envoy\u00e9e pour ${job.jobId} -> ${job.recipient}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await reportDeliveryStatus(job.jobId, { status: "error", error: message });
    console.error(`[mailing] \u00e9chec cl\u00f4ture ${job.jobId}: ${message}`);
  }
}

function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "_").slice(0, 60) || "dossier";
}

serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`[mailing] service en \u00e9coute sur le port ${info.port}`);
});
