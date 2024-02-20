import { fetchPayments } from "@/app/lib/actions";
import Link from "next/link";
import { PaymentTable } from "@/app/ui/tables/payments";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";

export default async function Example({
  searchParams,
}: {
  searchParams: { omie_enterprise: OmieEnterpriseEnum };
}) {
  const { omie_enterprise } = searchParams;
  const payments = !omie_enterprise
    ? []
    : await fetchPayments({ "omie_metadata.enterprise": omie_enterprise });

  return (
    <>
      <main className="flex-1 pb-8 min-h-full">
        {/* Page header */}
        <PageHeader
          pageTitle="Pagamentos"
          description="⚠️ Insira a empresa para buscar e exibir os pagamentos."
        >
          <div className="flex space-x-3 md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Exportar
            </button>
            <Link
              href={`/payment/create`}
              className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Novo Pagamento
            </Link>
          </div>
        </PageHeader>

        <section>
          <PaymentTable payments={payments} />
        </section>
      </main>
    </>
  );
}
