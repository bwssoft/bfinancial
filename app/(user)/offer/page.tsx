import { fetchOfferById, fetchOffers } from "@/app/lib/actions";
import { OmieDefaultParams, OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { OmieListOfferResponse } from "@/app/lib/definitions/OmieOffer";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { Pagination } from "@/app/ui/pagination";
import { OfferTable } from "@/app/ui/tables/offers";

interface OfferPageParams {
  searchParams: Omit<OmieDefaultParams, "apenas_importado_api"> & {
    omie_enterprise?: OmieEnterpriseEnum;
    codigo_cliente_omie?: string;
    ordenar_por?: string[];
    etapa?: string;
    codigo_pedido?: string;
  };
}

export default async function OfferPage({ searchParams }: OfferPageParams) {
  const {
    ordenar_por,
    omie_enterprise,
    pagina,
    registros_por_pagina,
    codigo_cliente_omie,
    etapa,
    codigo_pedido,
  } = searchParams;

  async function formatOffers(): Promise<OmieListOfferResponse | null> {
    if (!omie_enterprise) {
      return null;
    }

    if (codigo_pedido) {
      const offer = await fetchOfferById(omie_enterprise, parseInt(codigo_pedido));

      if (offer?.pedido_venda_produto) {
        return {
          pagina: 1,
          pedido_venda_produto: [offer?.pedido_venda_produto],
          registros: 1,
          total_de_paginas: 1,
          total_de_registros: 1,
        };
      }

      return null;
    }

    return await fetchOffers(omie_enterprise, {
      pagina: pagina ?? 1,
      registros_por_pagina: registros_por_pagina ?? 5,
      // filtrar_por_cliente: parseInt(codigo_cliente_omie),
      ordenar_por,
      etapa,
    });
  }

  const offers = await formatOffers();

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
