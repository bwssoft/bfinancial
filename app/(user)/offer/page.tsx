import { fetchOffers } from "@/app/lib/actions";
import { OfferTable } from "@/app/ui/tables/OfferTable";
import { Pagination } from "@/app/ui/pagination";
import { OmieDefaultParams } from "@/app/lib/definitions/OmieApi";

const statusStyles = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-gray-100 text-gray-800",
    canceled: "bg-red-100 text-red-800",
};

interface OfferPageParams {
    searchParams: Omit<OmieDefaultParams, "apenas_importado_api">
}

export default async function OfferPage({ searchParams }: OfferPageParams) {
    const offers = await fetchOffers(searchParams);

    return (
        <div className="min-h-full">
            <main className="flex-1 pb-8">
                <div className="flex justify-between bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                        Propostas
                    </h1>

                    <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Exportar
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                        >
                            Nova Proposta
                        </button>
                    </div>
                </div>

                <div className="mt-8 rounded-lg shadow">
                    <OfferTable offers={offers} />
                    <Pagination 
                        totalRegister={offers.total_de_registros}
                        totalPage={offers.total_de_paginas} 
                    />
                </div>
            </main>
        </div>
    );
}
