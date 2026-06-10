import { z } from "zod";

/** Lifecycle of a "Mail Delivery Clôture" job. */
export const deliveryStatusSchema = z.enum([
  "pending",
  "processing",
  "sent",
  "error",
]);
export type DeliveryStatus = z.infer<typeof deliveryStatusSchema>;

/** Payload sent from the dashboard to the api-gateway. */
export const createDeliverySchema = z.object({
  companyId: z.union([z.number().int(), z.string()]).transform((v) => String(v)),
  fiscalYearId: z.union([z.number().int(), z.string()]).optional(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  recipient: z.string().email().optional(),
});
export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;

/** Internal payload sent from the api-gateway to the mailing service. */
export const sendClotureSchema = z.object({
  jobId: z.string(),
  companyId: z.string(),
  companyName: z.string().optional(),
  fiscalYearLabel: z.string(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recipient: z.string().email(),
});
export type SendClotureInput = z.infer<typeof sendClotureSchema>;

/** A client company (dossier) managed by the accounting firm. */
export interface FirmCompany {
  id: number;
  name: string;
  billingName: string | null;
  siren: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  activityCode: string | null;
  externalId: string | null;
  clientCode: string | null;
}

export interface DeliveryJob {
  id: string;
  companyId: string | null;
  companyName: string | null;
  fiscalYearLabel: string;
  periodStart: string;
  periodEnd: string;
  recipient: string;
  status: DeliveryStatus;
  error: string | null;
  zipBytes: number | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
}

export interface FiscalYear {
  id: number;
  start: string;
  end: string;
  label: string;
}

export interface Address {
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Customer {
  id: number;
  type: "company" | "individual";
  name: string;
  email: string | null;
  phone: string | null;
  regNo: string | null;
  vatNumber: string | null;
  reference: string | null;
  address: Address | null;
  createdAt: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  regNo: string | null;
  vatNumber: string | null;
  iban: string | null;
  address: Address | null;
  createdAt: string | null;
}

export interface CompanyInfo {
  id: number | null;
  name: string;
  regNo: string | null;
  user: { firstName: string; lastName: string; email: string } | null;
  scopes: string[];
}

export interface CrmStats {
  customers: number;
  suppliers: number;
  fiscalYears: number;
  deliveriesSent: number;
}

/** Firm-level aggregate stats (the AGEC Finances portfolio). */
export interface FirmStats {
  dossiers: number;
  deliveriesSent: number;
  deliveriesTotal: number;
}
