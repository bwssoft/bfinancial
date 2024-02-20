import { fetchClientById, fetchOffers } from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { BackButton } from "@/app/ui/back-button";
import { LabelValue } from "@/app/ui/label-value";
import { ClientOffersTable } from "@/app/ui/tables/client-offers/client-offers";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function ClientPage({
  params,
}: {
  params: {
    query: [OmieEnterpriseEnum, string];
  };
}) {
  const [omie_enterprise, codigo_cliente_omie] = params.query;

  if (!omie_enterprise || !codigo_cliente_omie) {
    throw new Error("Lmao");
  }

  const client = await fetchClientById(omie_enterprise, codigo_cliente_omie);

  if (!client) {
    return (
      <div>
        <h2>no client</h2>
      </div>
    );
  }

  const offers = client
    ? await fetchOffers(omie_enterprise, {
        pagina: 1,
        registros_por_pagina: 20,
        filtrar_por_cliente: client.codigo_cliente_omie,
      })
    : null;

  return (
    <div className="min-h-full">
      <header className="mb-4">
        <BackButton>
          <span className="flex space-x-2 items-center">
            <ArrowLeftIcon className="h-3 w-3" />
            Voltar
          </span>
        </BackButton>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
          Visualizando cliente
        </h1>
      </header>

      <div className="w-full flex flex-col gap-4">
        <section className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="border-b py-3 px-4">
            <h2 className="text-lg font-bold leading-7 text-gray-700">Dados</h2>
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
              omie_enterprise={omie_enterprise as OmieEnterpriseEnum}
              className="border-0 rounded-none"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
