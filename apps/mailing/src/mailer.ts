import { Resend } from "resend";
import { config } from "./config.js";
import { uploadZipAndGetLink } from "./storage.js";

const resend = new Resend(config.resend.apiKey);

export interface SendClotureMailParams {
  to: string;
  companyName: string | null;
  fiscalYearLabel: string;
  zipFilename: string;
  zip: Buffer;
  fileCount: number;
  errors: string[];
}

export interface SendClotureMailResult {
  zipBytes: number;
  downloadUrl: string | null;
}

export async function sendClotureMail(
  params: SendClotureMailParams,
): Promise<SendClotureMailResult> {
  const { to, companyName, fiscalYearLabel, zipFilename, zip, fileCount, errors } = params;
  const zipBytes = zip.byteLength;
  const tooLargeToAttach = zipBytes > config.maxAttachmentBytes;

  let downloadUrl: string | null = null;
  if (tooLargeToAttach) {
    downloadUrl = await uploadZipAndGetLink(zipFilename, zip);
  }

  const label = companyName ? `${companyName} - ${fiscalYearLabel}` : fiscalYearLabel;
  const subject = `Cl\u00f4ture ${label}`;
  const html = buildHtml({ companyName, fiscalYearLabel, fileCount, errors, downloadUrl, zipBytes });

  const { error } = await resend.emails.send({
    from: config.resend.from,
    to,
    subject,
    html,
    attachments: downloadUrl
      ? undefined
      : [{ filename: zipFilename, content: zip }],
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }

  return { zipBytes, downloadUrl };
}

function buildHtml(args: {
  companyName: string | null;
  fiscalYearLabel: string;
  fileCount: number;
  errors: string[];
  downloadUrl: string | null;
  zipBytes: number;
}): string {
  const sizeMb = (args.zipBytes / (1024 * 1024)).toFixed(1);
  const linkBlock = args.downloadUrl
    ? `<p>Le dossier (${sizeMb} Mo) \u00e9tant trop volumineux pour une pi\u00e8ce jointe, il est disponible via ce lien (valable 7 jours):</p>
       <p><a href="${args.downloadUrl}">T\u00e9l\u00e9charger le ZIP de cl\u00f4ture</a></p>`
    : `<p>Le dossier complet (${sizeMb} Mo) est en pi\u00e8ce jointe.</p>`;

  const errorBlock =
    args.errors.length > 0
      ? `<p style="color:#b45309">Remarque: ${args.errors.length} \u00e9l\u00e9ment(s) n'ont pas pu \u00eatre r\u00e9cup\u00e9r\u00e9s (voir <code>_rapport_erreurs.txt</code> dans le ZIP).</p>`
      : "";

  const heading = args.companyName
    ? `${args.companyName} - Exercice ${args.fiscalYearLabel}`
    : `Exercice ${args.fiscalYearLabel}`;

  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#111;line-height:1.5">
    <h2>Mail Delivery Cl\u00f4ture - ${heading}</h2>
    <p>Voici l'ensemble des \u00e9l\u00e9ments de cl\u00f4ture r\u00e9cup\u00e9r\u00e9s depuis Pennylane:</p>
    <ul>
      <li>FEC de l'exercice</li>
      <li>Grand Livre (xlsx)</li>
      <li>Justificatifs PDF (factures fournisseurs et clients)</li>
    </ul>
    <p>${args.fileCount} fichier(s) inclus.</p>
    ${linkBlock}
    ${errorBlock}
    <hr/>
    <p style="font-size:12px;color:#666">Envoy\u00e9 automatiquement par le service de mailing AGEC.</p>
  </div>`;
}
