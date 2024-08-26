import { PageHeader } from "@/app/ui/navigation/page-header";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { DueDetachedShipmentForm } from "@/app/ui/form/due-detached-shipment";

export default async function Example({
  searchParams,
}: {
  searchParams: { omie_enterprise: OmieEnterpriseEnum };
}) {
  return (
    <>
      <main className="flex-1 pb-8 min-h-full">
        {/* Page header */}
        <PageHeader
          pageTitle="Frete"
          description="⚠️ Insira a empresa e o cliente para poder criar o qr-code do frete."
        ></PageHeader>

        <section>
          <DueDetachedShipmentForm />
        </section>
      </main>
    </>
  );
}
