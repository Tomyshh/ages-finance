import { PageHeader } from "@/components/page-header";
import { DeliveriesHistory } from "@/components/deliveries-history";
import { getDeliveries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CloturesPage() {
  const { items: deliveries } = await getDeliveries();

  return (
    <div>
      <PageHeader
        title="Clôtures"
        description="Historique de toutes les clôtures déclenchées sur l'ensemble des dossiers. Pour lancer une clôture, ouvrez un dossier puis l'onglet Clôtures."
      />
      <DeliveriesHistory initial={deliveries} />
    </div>
  );
}
