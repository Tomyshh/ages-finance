import type { DeliveryStatus } from "@agec/shared";
import { config } from "./config.js";

export interface DeliveryResultUpdate {
  status: DeliveryStatus;
  zipBytes?: number | null;
  downloadUrl?: string | null;
  error?: string | null;
}

/**
 * Reports the outcome of a delivery back to the api-gateway, which owns the
 * persistence of delivery jobs. No-op when the gateway URL is not configured.
 */
export async function reportDeliveryStatus(
  jobId: string,
  update: DeliveryResultUpdate,
): Promise<void> {
  if (!config.gatewayUrl) {
    console.warn(`[mailing] API_GATEWAY_URL absent, statut non report\u00e9 pour ${jobId}`);
    return;
  }

  try {
    const response = await fetch(
      `${config.gatewayUrl.replace(/\/$/, "")}/internal/deliveries/${jobId}/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": config.internalSecret,
        },
        body: JSON.stringify(update),
      },
    );
    if (!response.ok) {
      console.error(
        `[mailing] callback gateway \u00e9chou\u00e9 (${response.status}) pour ${jobId}`,
      );
    }
  } catch (err) {
    console.error(`[mailing] callback gateway erreur pour ${jobId}:`, err);
  }
}
