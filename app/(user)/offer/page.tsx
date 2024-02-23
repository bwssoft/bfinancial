import { fetchOffers } from "@/app/lib/actions";
import { OfferTable } from "@/app/ui/tables/offers";
import {
  OmieDefaultParams,
  OmieEnterpriseEnum,
} from "@/app/lib/definitions/OmieApi";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { Button } from "@/app/ui/button";
import { Pagination } from "@/app/ui/pagination";

interface OfferPageParams {
  searchParams: Omit<OmieDefaultParams, "apenas_importado_api"> & {
    omie_enterprise?: OmieEnterpriseEnum;
    codigo_cliente_omie?: string;
  };
}

export default async function OfferPage({ searchParams }: OfferPageParams) {
  const { omie_enterprise, pagina, registros_por_pagina, codigo_cliente_omie } =
    searchParams;
  const offers = !omie_enterprise
    ? null
    : await fetchOffers(omie_enterprise, {
        pagina: pagina ?? 1,
        registros_por_pagina: registros_por_pagina ?? 5,
        filtrar_por_cliente: codigo_cliente_omie
          ? parseInt(codigo_cliente_omie)
          : undefined,
      });

  return (
    <main className="flex-1 pb-8 min-h-full">
      <PageHeader
        pageTitle="Propostas"
        description="⚠️ Insira o cliente e a empresa para buscar e exibir as propostas."
      >
        {/* <div className="flex space-x-3 md:ml-4 md:mt-0">
          <Button variant="outline">Exportar</Button>
          <Button>Nova proposta</Button>
        </div> */}
      </PageHeader>

      <section>
        <OfferTable
          offers={offers}
          codigo_cliente_omie={codigo_cliente_omie}
          omie_enterprise={omie_enterprise}
        />
        <Pagination
          className="px-0 sm:px-0 bg-transparent"
          totalRegister={offers?.total_de_registros}
          totalPage={offers?.total_de_paginas}
        />
      </section>
    </main>
  );
}
