import { fetchClients } from "@/app/lib/actions";

import {
  OmieEnterpriseEnum,
  OmieSearchParams,
} from "@/app/lib/definitions/OmieApi";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { Button } from "@/app/ui/button";
import { ClientsTable } from "@/app/ui/tables/clients/table";
import { Pagination } from "@/app/ui/pagination";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
  canceled: "bg-red-100 text-red-800",
};

export default async function Example({
  searchParams,
}: {
  searchParams: OmieSearchParams & {
    omie_enterprise: OmieEnterpriseEnum;
    client_name: string;
  };
}) {
  const { omie_enterprise, client_name, pagina, registros_por_pagina } =
    searchParams;
  const clients = !omie_enterprise
    ? null
    : await fetchClients(searchParams.omie_enterprise, {
        pagina: pagina ?? 1,
        registros_por_pagina: registros_por_pagina ?? 5,
        clientesFiltro: client_name
          ? { nome_fantasia: client_name }
          : undefined,
      });

  return (
    <>
      <div className="min-h-full">
        <main className="flex-1 pb-8">
          {/* Page header */}
          <PageHeader
            pageTitle="Clientes"
            description="⚠️ Insira a empresa para buscar e exibir os clients."
          >
            {/* <div className="inline-flex items-center gap-2">
              <Button>Exportar</Button>
            </div> */}
          </PageHeader>

          <section>
            <ClientsTable clients={clients} omie_enterprise={omie_enterprise} />
            <Pagination
              className="px-0 sm:px-0 bg-transparent"
              totalRegister={clients?.total_de_registros}
              totalPage={clients?.total_de_paginas}
            />
          </section>
        </main>
      </div>
    </>
  );
}
