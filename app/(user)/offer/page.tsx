import { fetchOffers } from "@/app/lib/actions";
import { OfferTable } from "@/app/ui/tables/offers";
import { OmieDefaultParams } from "@/app/lib/definitions/OmieApi";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { Button } from "@/app/ui/button";
import { Pagination } from "@/app/ui/pagination";

interface OfferPageParams {
    searchParams: Omit<OmieDefaultParams, "apenas_importado_api"> & {
        enterprise_id?: string;
        client?: string;
    }
}

export default async function OfferPage({ searchParams }: OfferPageParams) {
    const offers = searchParams.client ? await fetchOffers({
        pagina: searchParams.pagina ?? 1,
        registros_por_pagina: searchParams.registros_por_pagina ?? 10,
        filtrar_por_cliente: parseInt(searchParams.client),
    }) : null;

    return (
        <main className="flex-1 pb-8 min-h-full">
            <PageHeader 
                pageTitle="Propostas"
                description="⚠️ Insira o cliente e a empresa para buscar e exibir as propostas."
            >
                <div className="flex space-x-3 md:ml-4 md:mt-0">
                    <Button variant="outline">Exportar</Button>
                    <Button>Nova proposta</Button>
                </div>
            </PageHeader>
            
            <section>
                <OfferTable offers={offers} />
                <Pagination 
                    className="px-0 sm:px-0"
                    totalRegister={offers?.total_de_registros}
                    totalPage={offers?.total_de_paginas} 
                />
            </section>
        </main>
    );
}
