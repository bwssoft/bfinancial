import { fetchPayments } from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Payment } from "@/app/lib/definitions/Payment";
import { Button } from "@/app/ui/button";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { DetachedShipmentTable } from "@/app/ui/tables/detached-shipment/detached-shipment";
import { Filter } from "mongodb";
import Link from "next/link";

interface DetachedShipmentPageParams {
  searchParams: {
    omie_enterprise?: OmieEnterpriseEnum;
    codigo_cliente_omie?: string;
  };
}

export default async function DetachedShipmentPage({ searchParams }: DetachedShipmentPageParams) {
  const { omie_enterprise, codigo_cliente_omie } = searchParams;

  const formatFetchPaymentParams = () => {
    const query: Filter<Payment> = {};
    if (omie_enterprise) {
      query["omie_metadata.enterprise"] = omie_enterprise;
    }

    if (codigo_cliente_omie) {
      query["omie_metadata.codigo_cliente"] = codigo_cliente_omie;
    }

    return query;
  };

  const detachedShipments = await fetchPayments({
    is_detached: true,
    ...formatFetchPaymentParams(),
  });

  return (
    <main className="flex-1 pb-8 min-h-full">
      <PageHeader
        pageTitle="Cobrança frete avulso"
        description="Visualize todas as cobranças de frete avulsos realizadas"
      >
        <Button asChild>
          <Link href={`/payment/form/detached-shipment/create`}>Nova cobrança de frete avulso</Link>
        </Button>
      </PageHeader>

      <section>
        <DetachedShipmentTable detachedShipments={detachedShipments} />
      </section>
    </main>
  );
}
