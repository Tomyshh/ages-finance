import archiver from "archiver";
import { PennylaneError, type PennylaneClient } from "@agec/pennylane";

export interface ClotureArtifacts {
  buffer: Buffer;
  fileCount: number;
  errors: string[];
}

export interface BuildClotureParams {
  client: PennylaneClient;
  periodStart: string;
  periodEnd: string;
  fiscalYearLabel: string;
}

/**
 * Gathers everything the Pennylane API exposes for a fiscal-year closing and
 * assembles a single ZIP buffer:
 *  - FEC export
 *  - General Ledger export (Grand Livre)
 *  - every PDF justificatif of supplier + customer invoices of the period
 */
export async function buildClotureZip(
  params: BuildClotureParams,
): Promise<ClotureArtifacts> {
  const { client, periodStart, periodEnd } = params;
  const errors: string[] = [];
  let fileCount = 0;

  const archive = archiver("zip", { zlib: { level: 9 } });
  const chunks: Buffer[] = [];
  archive.on("data", (chunk: Buffer) => chunks.push(chunk));
  archive.on("warning", (err) => errors.push(`archive: ${err.message}`));

  const done = new Promise<void>((resolve, reject) => {
    archive.on("end", () => resolve());
    archive.on("error", (err) => reject(err));
  });

  // 1. FEC + Grand Livre exports.
  try {
    const fecUrl = await client.exportFec(periodStart, periodEnd);
    const fec = await client.downloadToBuffer({
      url: fecUrl,
      filename: "FEC.txt",
    });
    archive.append(fec, { name: `exports/FEC_${params.fiscalYearLabel}.txt` });
    fileCount++;
  } catch (err) {
    errors.push(`FEC: ${asMessage(err)}`);
  }

  try {
    const glUrl = await client.exportGeneralLedger(periodStart, periodEnd);
    const gl = await client.downloadToBuffer({
      url: glUrl,
      filename: "grand_livre.xlsx",
    });
    archive.append(gl, {
      name: `exports/Grand_Livre_${params.fiscalYearLabel}.xlsx`,
    });
    fileCount++;
  } catch (err) {
    errors.push(`Grand Livre: ${asMessage(err)}`);
  }

  // 2. Justificatifs (PDF) of every invoice of the period.
  try {
    const documents = await client.listInvoiceDocuments(periodStart, periodEnd);
    for (const doc of documents) {
      const folder =
        doc.kind === "supplier"
          ? "justificatifs/fournisseurs"
          : "justificatifs/clients";
      for (const file of doc.files) {
        try {
          const buffer = await client.downloadToBuffer(file);
          archive.append(buffer, { name: `${folder}/${file.filename}` });
          fileCount++;
        } catch (err) {
          errors.push(`Justificatif ${file.filename}: ${asMessage(err)}`);
        }
      }
    }
  } catch (err) {
    errors.push(`Liste des factures: ${asMessage(err)}`);
  }

  if (errors.length > 0) {
    archive.append(
      Buffer.from(
        [
          "Certains \u00e9l\u00e9ments n'ont pas pu \u00eatre r\u00e9cup\u00e9r\u00e9s automatiquement:",
          "",
          ...errors.map((e) => `- ${e}`),
        ].join("\n"),
        "utf8",
      ),
      { name: "_rapport_erreurs.txt" },
    );
  }

  await archive.finalize();
  await done;

  return { buffer: Buffer.concat(chunks), fileCount, errors };
}

function asMessage(err: unknown): string {
  if (err instanceof PennylaneError && err.status === 403) {
    return `${err.message} (scope Pennylane manquant sur le token firm)`;
  }
  return err instanceof Error ? err.message : String(err);
}
