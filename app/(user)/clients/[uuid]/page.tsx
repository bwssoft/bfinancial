import { fetchClientById, fetchOffers } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { LabelValue } from "@/app/ui/label-value";
import { ClientOffersTable } from "@/app/ui/tables/client-offers/client-offers";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function ClientPage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  if (!params.uuid) {
    throw new Error('Lmao');
  }

  const client = await fetchClientById(params.uuid);
  
  const offers = client ? await fetchOffers({
    pagina: 1,
    registros_por_pagina: 100,
    filtrar_por_cliente: client.codigo_cliente_omie,
  }) : null;
 
  return (
    <div className="min-h-full">
      <header className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients">
            <ArrowLeftIcon className="h-3 w-3" />
            Retornar para a listagem de clientes
          </Link>
        </Button>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
          Visualizando cliente
        </h1>
      </header>

      <div className="w-full flex flex-col gap-4">
        <section className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="border-b py-3 px-4">
            <h2 className="text-lg font-bold leading-7 text-gray-700">
              Dados
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4">
            <LabelValue label="Nome fantasia" value={client?.nome_fantasia} />
            <LabelValue label="Razão social" value={client?.razao_social} />
            <LabelValue label="CNPJ / CPF" value={client?.cnpj_cpf} />
            <LabelValue label="CEP" value={client?.cep} />
            <LabelValue label="E-mail" value={client?.email} />
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="border-b py-3 px-4">
            <h2 className="text-lg font-bold leading-7 text-gray-700">
              Propostas
            </h2>
          </div>
          <div>
            <ClientOffersTable 
              offers={offers} 
              client={client} 
              className="border-0 rounded-none"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
