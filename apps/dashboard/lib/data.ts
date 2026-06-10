import type {
  CompanyInfo,
  CrmStats,
  Customer,
  DeliveryJob,
  FirmCompany,
  FirmStats,
  FiscalYear,
  Supplier,
} from "@agec/shared";
import { gatewayFetch } from "@/lib/gateway";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await gatewayFetch(path);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// ---- Firm level ----
export function getDossiers(): Promise<{ items: FirmCompany[] }> {
  return getJson<{ items: FirmCompany[] }>("/api/dossiers", { items: [] });
}

export function getFirmStats(): Promise<{ stats: FirmStats | null }> {
  return getJson<{ stats: FirmStats | null }>("/api/stats", { stats: null });
}

// ---- Per-dossier ----
export function getDossierCompany(
  companyId: string,
): Promise<{ company: CompanyInfo | null }> {
  return getJson<{ company: CompanyInfo | null }>(
    `/api/dossiers/${companyId}/company`,
    { company: null },
  );
}

export function getDossierStats(companyId: string): Promise<{ stats: CrmStats | null }> {
  return getJson<{ stats: CrmStats | null }>(`/api/dossiers/${companyId}/stats`, {
    stats: null,
  });
}

export function getDossierCustomers(companyId: string): Promise<{ items: Customer[] }> {
  return getJson<{ items: Customer[] }>(`/api/dossiers/${companyId}/customers`, {
    items: [],
  });
}

export function getDossierSuppliers(companyId: string): Promise<{ items: Supplier[] }> {
  return getJson<{ items: Supplier[] }>(`/api/dossiers/${companyId}/suppliers`, {
    items: [],
  });
}

export function getDossierFiscalYears(
  companyId: string,
): Promise<{ items: FiscalYear[] }> {
  return getJson<{ items: FiscalYear[] }>(`/api/dossiers/${companyId}/fiscal-years`, {
    items: [],
  });
}

// ---- Deliveries (optionally scoped to a dossier) ----
export function getDeliveries(companyId?: string): Promise<{ items: DeliveryJob[] }> {
  const qs = companyId ? `?companyId=${encodeURIComponent(companyId)}` : "";
  return getJson<{ items: DeliveryJob[] }>(`/api/deliveries${qs}`, { items: [] });
}
