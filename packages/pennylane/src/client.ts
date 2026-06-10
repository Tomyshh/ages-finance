import type {
  Address,
  CompanyInfo,
  Customer,
  FiscalYear,
  Supplier,
} from "@agec/shared";
import type { FirmCompany } from "@agec/shared";
import { RateLimiter, sleep } from "./rate-limit.js";

const DEFAULT_BASE_URL = "https://app.pennylane.com/api/external/v2";
const DEFAULT_FIRM_BASE_URL = "https://app.pennylane.com/api/external/firm/v1";

export interface PennylaneClientOptions {
  apiKey: string;
  baseUrl?: string;
  /** Opt-in to the 2026 API behaviour (cursor pagination, new scopes). */
  use2026Api?: boolean;
  maxRequestsPerSecond?: number;
  /** Scope every v2 request to a managed company via the X-Company-Id header. */
  companyId?: string | number;
  /** Share a single RateLimiter across the whole firm portfolio. */
  limiter?: RateLimiter;
}

export class PennylaneError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "PennylaneError";
  }
}

type ExportKind = "fecs" | "general_ledgers";

export interface ExportStatus {
  id: number;
  status: "pending" | "ready" | "error";
  file_url?: string | null;
}

export interface DownloadableFile {
  url: string;
  filename: string;
}

export interface InvoiceDocument {
  kind: "supplier" | "customer";
  id: number;
  reference: string;
  date: string | null;
  files: DownloadableFile[];
}

export class PennylaneClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly use2026Api: boolean;
  private readonly limiter: RateLimiter;
  private readonly companyId?: string;

  constructor(options: PennylaneClientOptions) {
    if (!options.apiKey) throw new Error("PennylaneClient: apiKey requis");
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.use2026Api = options.use2026Api ?? true;
    this.limiter =
      options.limiter ?? new RateLimiter(options.maxRequestsPerSecond ?? 5, 1000);
    this.companyId =
      options.companyId !== undefined ? String(options.companyId) : undefined;
  }

  private async request<T>(
    path: string,
    init: RequestInit & { query?: Record<string, string | number | undefined> } = {},
    attempt = 0,
  ): Promise<T> {
    const { query, ...rest } = init;
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    await this.limiter.acquire();

    const headers = new Headers(rest.headers);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set("Accept", "application/json");
    if (this.companyId) headers.set("X-Company-Id", this.companyId);
    if (this.use2026Api) headers.set("X-Use-2026-API-Changes", "true");
    if (rest.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, { ...rest, headers });

    if (response.status === 429 && attempt < 5) {
      const retryAfter = Number(response.headers.get("Retry-After")) || 1;
      await sleep(retryAfter * 1000);
      return this.request<T>(path, init, attempt + 1);
    }

    if (!response.ok) {
      const body = await safeJson(response);
      throw new PennylaneError(
        `Pennylane ${rest.method ?? "GET"} ${path} -> ${response.status}`,
        response.status,
        body,
      );
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  getMe(): Promise<unknown> {
    return this.request("/me");
  }

  async getCompanyInfo(): Promise<CompanyInfo> {
    const me = await this.request<RawMe>("/me");
    return {
      id: me.company?.id ?? null,
      name: me.company?.name ?? "\u2014",
      regNo: me.company?.reg_no ?? null,
      user: me.user
        ? {
            firstName: me.user.first_name ?? "",
            lastName: me.user.last_name ?? "",
            email: me.user.email ?? "",
          }
        : null,
      scopes: me.scopes ?? [],
    };
  }

  async listCustomers(): Promise<Customer[]> {
    const result: Customer[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.request<{
        items: RawCustomer[];
        next_cursor?: string | null;
        has_more?: boolean;
      }>("/customers", { query: { limit: 100, cursor } });

      for (const c of page.items ?? []) {
        result.push({
          id: c.id,
          type: c.customer_type === "individual" ? "individual" : "company",
          name: c.name ?? joinName(c.first_name, c.last_name) ?? `Client ${c.id}`,
          email: firstEmail(c.emails),
          phone: c.phone || null,
          regNo: c.reg_no || null,
          vatNumber: c.vat_number || null,
          reference: c.reference || c.external_reference || null,
          address: mapAddress(c.billing_address),
          createdAt: c.created_at ?? null,
        });
      }
      cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  async listSuppliers(): Promise<Supplier[]> {
    const result: Supplier[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.request<{
        items: RawSupplier[];
        next_cursor?: string | null;
        has_more?: boolean;
      }>("/suppliers", { query: { limit: 100, cursor } });

      for (const s of page.items ?? []) {
        result.push({
          id: s.id,
          name: s.name ?? `Fournisseur ${s.id}`,
          email: firstEmail(s.emails),
          regNo: s.reg_no || null,
          vatNumber: s.vat_number || null,
          iban: s.iban || null,
          address: mapAddress(s.postal_address),
          createdAt: s.created_at ?? null,
        });
      }
      cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  async listFiscalYears(): Promise<FiscalYear[]> {
    const result: FiscalYear[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.request<{
        items: Array<{ id: number; start: string; finish: string; status: string }>;
        next_cursor?: string | null;
        has_more?: boolean;
      }>("/fiscal_years", {
        query: { limit: 100, sort: "-start", cursor },
      });

      for (const fy of page.items ?? []) {
        result.push({
          id: fy.id,
          start: fy.start,
          end: fy.finish,
          label: labelForPeriod(fy.start, fy.finish),
        });
      }
      cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return result;
  }

  private createExport(
    kind: ExportKind,
    periodStart: string,
    periodEnd: string,
  ): Promise<ExportStatus> {
    return this.request<ExportStatus>(`/exports/${kind}`, {
      method: "POST",
      body: JSON.stringify({ period_start: periodStart, period_end: periodEnd }),
    });
  }

  private getExport(kind: ExportKind, id: number): Promise<ExportStatus> {
    return this.request<ExportStatus>(`/exports/${kind}/${id}`);
  }

  /** Creates an export and polls until it is ready, returning the signed file URL. */
  private async runExport(
    kind: ExportKind,
    periodStart: string,
    periodEnd: string,
    { timeoutMs = 5 * 60_000, intervalMs = 3_000 } = {},
  ): Promise<string> {
    const created = await this.createExport(kind, periodStart, periodEnd);
    const deadline = Date.now() + timeoutMs;

    let current = created;
    while (current.status !== "ready") {
      if (current.status === "error") {
        throw new Error(`Export ${kind} ${created.id} en erreur c\u00f4t\u00e9 Pennylane`);
      }
      if (Date.now() > deadline) {
        throw new Error(`Export ${kind} ${created.id}: d\u00e9lai d\u00e9pass\u00e9`);
      }
      await sleep(intervalMs);
      current = await this.getExport(kind, created.id);
    }

    if (!current.file_url) {
      throw new Error(`Export ${kind} ${created.id} pr\u00eat mais sans file_url`);
    }
    return current.file_url;
  }

  exportFec(periodStart: string, periodEnd: string): Promise<string> {
    return this.runExport("fecs", periodStart, periodEnd);
  }

  exportGeneralLedger(periodStart: string, periodEnd: string): Promise<string> {
    return this.runExport("general_ledgers", periodStart, periodEnd);
  }

  /**
   * Lists supplier + customer invoices of the period and collects every
   * downloadable PDF (source document + appendices) attached to them.
   */
  async listInvoiceDocuments(
    periodStart: string,
    periodEnd: string,
  ): Promise<InvoiceDocument[]> {
    const dateFilter = JSON.stringify([
      { field: "date", operator: "gteq", value: periodStart },
      { field: "date", operator: "lteq", value: periodEnd },
    ]);

    const supplier = await this.collectInvoices("supplier", "/supplier_invoices", dateFilter);
    const customer = await this.collectInvoices("customer", "/customer_invoices", dateFilter);
    return [...supplier, ...customer];
  }

  private async collectInvoices(
    kind: "supplier" | "customer",
    path: string,
    filter: string,
  ): Promise<InvoiceDocument[]> {
    const docs: InvoiceDocument[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.request<{
        items: RawInvoice[];
        next_cursor?: string | null;
        has_more?: boolean;
      }>(path, { query: { filter, limit: 100, cursor } });

      for (const invoice of page.items ?? []) {
        const reference =
          invoice.invoice_number ?? invoice.label ?? `${kind}-${invoice.id}`;
        const files: DownloadableFile[] = [];

        const mainUrl = invoice.file_url ?? invoice.download_url ?? null;
        if (mainUrl) {
          files.push({ url: mainUrl, filename: `${sanitize(reference)}.pdf` });
        }

        // Customer invoices expose appendices via a dedicated endpoint.
        if (kind === "customer") {
          const appendices = await this.listCustomerInvoiceAppendices(invoice.id);
          appendices.forEach((url, index) => {
            files.push({
              url,
              filename: `${sanitize(reference)}_annexe_${index + 1}.pdf`,
            });
          });
        }

        if (files.length > 0) {
          docs.push({ kind, id: invoice.id, reference, date: invoice.date ?? null, files });
        }
      }

      cursor = page.has_more ? (page.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return docs;
  }

  private async listCustomerInvoiceAppendices(invoiceId: number): Promise<string[]> {
    try {
      const page = await this.request<{ items: Array<{ url?: string; file_url?: string }> }>(
        `/customer_invoices/${invoiceId}/appendices`,
      );
      return (page.items ?? [])
        .map((item) => item.file_url ?? item.url)
        .filter((url): url is string => Boolean(url));
    } catch {
      return [];
    }
  }

  /** Downloads a (usually signed) file URL into a Buffer. */
  async downloadToBuffer(file: DownloadableFile): Promise<Buffer> {
    let response = await fetch(file.url);
    if ((response.status === 401 || response.status === 403) && file.url.startsWith(this.baseUrl)) {
      response = await fetch(file.url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
    }
    if (!response.ok) {
      throw new Error(`T\u00e9l\u00e9chargement \u00e9chou\u00e9 (${response.status}) pour ${file.filename}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

export interface PennylaneFirmOptions {
  apiKey: string;
  /** v2 base URL used for company-scoped calls. */
  baseUrl?: string;
  /** Firm base URL used to list the portfolio of companies. */
  firmBaseUrl?: string;
  use2026Api?: boolean;
  maxRequestsPerSecond?: number;
}

/**
 * Entry point for the Pennylane Firm API. Lists the accounting firm's
 * portfolio of client companies (dossiers) and hands out company-scoped
 * {@link PennylaneClient} instances. All clients share a single RateLimiter so
 * the global 5 req/s budget is respected across the whole portfolio.
 */
export class PennylaneFirm {
  private readonly apiKey: string;
  private readonly v2BaseUrl: string;
  private readonly firmBaseUrl: string;
  private readonly use2026Api: boolean;
  private readonly limiter: RateLimiter;

  constructor(options: PennylaneFirmOptions) {
    if (!options.apiKey) throw new Error("PennylaneFirm: apiKey requis");
    this.apiKey = options.apiKey;
    this.v2BaseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.firmBaseUrl = (options.firmBaseUrl ?? DEFAULT_FIRM_BASE_URL).replace(/\/$/, "");
    this.use2026Api = options.use2026Api ?? true;
    this.limiter = new RateLimiter(options.maxRequestsPerSecond ?? 5, 1000);
  }

  /** Returns a v2 client scoped to a single managed company. */
  company(companyId: string | number): PennylaneClient {
    return new PennylaneClient({
      apiKey: this.apiKey,
      baseUrl: this.v2BaseUrl,
      use2026Api: this.use2026Api,
      companyId,
      limiter: this.limiter,
    });
  }

  /** Lists every client company (dossier) managed by the firm. */
  async listCompanies(): Promise<FirmCompany[]> {
    const result: FirmCompany[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const body = await this.firmRequest<RawFirmCompaniesPage>("/companies", {
        page,
        per_page: 100,
      });
      for (const raw of body.items ?? []) {
        result.push(mapFirmCompany(raw));
      }
      totalPages = body.total_pages ?? page;
      page += 1;
    } while (page <= totalPages);

    return result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  private async firmRequest<T>(
    path: string,
    query?: Record<string, string | number | undefined>,
    attempt = 0,
  ): Promise<T> {
    const url = new URL(`${this.firmBaseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    await this.limiter.acquire();

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set("Accept", "application/json");
    if (this.use2026Api) headers.set("X-Use-2026-API-Changes", "true");

    const response = await fetch(url, { headers });

    if (response.status === 429 && attempt < 5) {
      const retryAfter = Number(response.headers.get("Retry-After")) || 1;
      await sleep(retryAfter * 1000);
      return this.firmRequest<T>(path, query, attempt + 1);
    }

    if (!response.ok) {
      throw new PennylaneError(
        `Pennylane GET (firm) ${path} -> ${response.status}`,
        response.status,
        await safeJson(response),
      );
    }

    return (await response.json()) as T;
  }
}

interface RawFirmCompany {
  id: number;
  name?: string;
  billing_company_name?: string;
  siren?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  activity_code?: string;
  external_id?: string;
  client_code?: string;
}

interface RawFirmCompaniesPage {
  total_pages?: number;
  current_page?: number;
  per_page?: number;
  total_items?: number;
  items?: RawFirmCompany[];
}

function blankToNull(value?: string): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function mapFirmCompany(raw: RawFirmCompany): FirmCompany {
  return {
    id: raw.id,
    name: raw.name ?? raw.billing_company_name ?? `Dossier ${raw.id}`,
    billingName: blankToNull(raw.billing_company_name),
    siren: blankToNull(raw.siren),
    address: blankToNull(raw.address),
    postalCode: blankToNull(raw.postal_code),
    city: blankToNull(raw.city),
    activityCode: blankToNull(raw.activity_code),
    externalId: blankToNull(raw.external_id),
    clientCode: blankToNull(raw.client_code),
  };
}

interface RawInvoice {
  id: number;
  invoice_number?: string;
  label?: string;
  date?: string;
  file_url?: string;
  download_url?: string;
}

interface RawAddress {
  address?: string;
  postal_code?: string;
  city?: string;
  country_alpha2?: string;
}

interface RawCustomer {
  id: number;
  customer_type?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  emails?: string[];
  phone?: string;
  reg_no?: string;
  vat_number?: string;
  reference?: string;
  external_reference?: string;
  billing_address?: RawAddress;
  created_at?: string;
}

interface RawSupplier {
  id: number;
  name?: string;
  emails?: string[];
  reg_no?: string;
  vat_number?: string;
  iban?: string;
  postal_address?: RawAddress;
  created_at?: string;
}

interface RawMe {
  user?: { first_name?: string; last_name?: string; email?: string };
  company?: { id?: number; name?: string; reg_no?: string };
  scopes?: string[];
}

function joinName(first?: string, last?: string): string | null {
  const joined = [first, last].filter(Boolean).join(" ").trim();
  return joined.length > 0 ? joined : null;
}

function firstEmail(emails?: string[]): string | null {
  if (!emails || emails.length === 0) return null;
  return emails.find((e) => e && e.trim().length > 0) ?? null;
}

function mapAddress(raw?: RawAddress): Address | null {
  if (!raw) return null;
  const hasContent = [raw.address, raw.postal_code, raw.city, raw.country_alpha2].some(
    (v) => v && v.trim().length > 0,
  );
  if (!hasContent) return null;
  return {
    address: raw.address ?? "",
    postalCode: raw.postal_code ?? "",
    city: raw.city ?? "",
    country: raw.country_alpha2 ?? "",
  };
}

function labelForPeriod(start: string, end: string): string {
  const startYear = start.slice(0, 4);
  const endYear = end.slice(0, 4);
  return startYear === endYear ? startYear : `${startYear}-${endYear}`;
}

function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "_").slice(0, 80) || "document";
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
