import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DeliveryJob, DeliveryStatus } from "@agec/shared";
import { config, persistenceConfigured } from "./config.js";

export interface CreateJobInput {
  companyId: string;
  companyName: string | null;
  fiscalYearLabel: string;
  periodStart: string;
  periodEnd: string;
  recipient: string;
}

export interface UpdateJobPatch {
  status?: DeliveryStatus;
  error?: string | null;
  zipBytes?: number | null;
  downloadUrl?: string | null;
  sentAt?: string | null;
}

export interface DeliveryStore {
  createJob(input: CreateJobInput): Promise<DeliveryJob>;
  updateJob(id: string, patch: UpdateJobPatch): Promise<DeliveryJob | null>;
  getJob(id: string): Promise<DeliveryJob | null>;
  listJobs(): Promise<DeliveryJob[]>;
}

const TABLE = "delivery_jobs";

class SupabaseStore implements DeliveryStore {
  constructor(private readonly client: SupabaseClient) {}

  async createJob(input: CreateJobInput): Promise<DeliveryJob> {
    const now = new Date().toISOString();
    const row = {
      id: randomUUID(),
      company_id: input.companyId,
      company_name: input.companyName,
      fiscal_year_label: input.fiscalYearLabel,
      period_start: input.periodStart,
      period_end: input.periodEnd,
      recipient: input.recipient,
      status: "pending" as DeliveryStatus,
      error: null,
      zip_bytes: null,
      download_url: null,
      created_at: now,
      updated_at: now,
      sent_at: null,
    };
    const { data, error } = await this.client.from(TABLE).insert(row).select().single();
    if (error) throw new Error(`Supabase insert: ${error.message}`);
    return toJob(data);
  }

  async updateJob(id: string, patch: UpdateJobPatch): Promise<DeliveryJob | null> {
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.status !== undefined) update.status = patch.status;
    if (patch.error !== undefined) update.error = patch.error;
    if (patch.zipBytes !== undefined) update.zip_bytes = patch.zipBytes;
    if (patch.downloadUrl !== undefined) update.download_url = patch.downloadUrl;
    if (patch.sentAt !== undefined) update.sent_at = patch.sentAt;

    const { data, error } = await this.client
      .from(TABLE)
      .update(update)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`Supabase update: ${error.message}`);
    return data ? toJob(data) : null;
  }

  async getJob(id: string): Promise<DeliveryJob | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase select: ${error.message}`);
    return data ? toJob(data) : null;
  }

  async listJobs(): Promise<DeliveryJob[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select()
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(`Supabase list: ${error.message}`);
    return (data ?? []).map(toJob);
  }
}

class InMemoryStore implements DeliveryStore {
  private jobs = new Map<string, DeliveryJob>();

  async createJob(input: CreateJobInput): Promise<DeliveryJob> {
    const now = new Date().toISOString();
    const job: DeliveryJob = {
      id: randomUUID(),
      companyId: input.companyId,
      companyName: input.companyName,
      fiscalYearLabel: input.fiscalYearLabel,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      recipient: input.recipient,
      status: "pending",
      error: null,
      zipBytes: null,
      downloadUrl: null,
      createdAt: now,
      updatedAt: now,
      sentAt: null,
    };
    this.jobs.set(job.id, job);
    return job;
  }

  async updateJob(id: string, patch: UpdateJobPatch): Promise<DeliveryJob | null> {
    const existing = this.jobs.get(id);
    if (!existing) return null;
    const updated: DeliveryJob = {
      ...existing,
      status: patch.status ?? existing.status,
      error: patch.error !== undefined ? patch.error : existing.error,
      zipBytes: patch.zipBytes !== undefined ? patch.zipBytes : existing.zipBytes,
      downloadUrl:
        patch.downloadUrl !== undefined ? patch.downloadUrl : existing.downloadUrl,
      sentAt: patch.sentAt !== undefined ? patch.sentAt : existing.sentAt,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(id, updated);
    return updated;
  }

  async getJob(id: string): Promise<DeliveryJob | null> {
    return this.jobs.get(id) ?? null;
  }

  async listJobs(): Promise<DeliveryJob[]> {
    return [...this.jobs.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
}

function toJob(row: Record<string, unknown>): DeliveryJob {
  return {
    id: String(row.id),
    companyId: (row.company_id as string | null) ?? null,
    companyName: (row.company_name as string | null) ?? null,
    fiscalYearLabel: String(row.fiscal_year_label),
    periodStart: String(row.period_start),
    periodEnd: String(row.period_end),
    recipient: String(row.recipient),
    status: row.status as DeliveryStatus,
    error: (row.error as string | null) ?? null,
    zipBytes: (row.zip_bytes as number | null) ?? null,
    downloadUrl: (row.download_url as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    sentAt: (row.sent_at as string | null) ?? null,
  };
}

export function createStore(): DeliveryStore {
  if (persistenceConfigured()) {
    const client = createClient(config.storage.url!, config.storage.serviceRoleKey!, {
      auth: { persistSession: false },
    });
    console.log("[gateway] persistance: Supabase");
    return new SupabaseStore(client);
  }
  console.warn(
    "[gateway] persistance: m\u00e9moire (SUPABASE_* absent) - les jobs sont perdus au red\u00e9marrage",
  );
  return new InMemoryStore();
}
