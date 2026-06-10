import { PageHeader } from "@/components/page-header";
import { DossiersView } from "@/components/dossiers-view";
import { getDossiers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DossiersPage() {
  const { items } = await getDossiers();
  return (
    <div>
      <PageHeader
        title="Dossiers clients"
        description="Tous les clients gérés par AGEC Finances, synchronisés depuis la Firm API Pennylane. Ouvrez un dossier pour voir ses clients, fournisseurs et exercices."
      />
      <DossiersView dossiers={items} />
    </div>
  );
}
