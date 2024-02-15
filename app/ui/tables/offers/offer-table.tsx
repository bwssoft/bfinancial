"use client"

import React from 'react';
import { useRouter } from 'next/navigation'

import { OmieOffer, OmieListOfferResponse } from "@/app/lib/definitions/OmieOffer"
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";

import { OfferTableFilter } from "./offer-table-filter";
import { orderOfferColumns } from './columns';
import { fetchClientById } from '@/app/lib/actions';

type OfferTableProps = {
  offers: OmieListOfferResponse | null;
  clientId?: string;
}

export function OfferTable({ offers, clientId }: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [client, setClient] = React.useState<OmieClientModel>();

  const onClientChange = React.useCallback((client: OmieClientModel) => setClient(client), []);
  const onOfferChange = React.useCallback(() => client, [offers]);

  const data = offers?.pedido_venda_produto.map((offer) => ({
    ...offer,
    client: onOfferChange(),
  })) ?? [];

  if (clientId && !client) {
    fetchClient();
  }

  async function fetchClient() {
    const data = await fetchClientById(clientId ?? '');
    if (data) onClientChange(data)
  }

  function handleRowPress(data: OmieOffer) {
    router.push(`/offer/${data.cabecalho.codigo_pedido}`)
  }

  if (isDesktop) {
    return (
      <section>
        <div className="inline-flex justify-between w-full items-center">
          <OfferTableFilter 
            client={client} 
            onClientChange={onClientChange} 
          />
        </div>

        <DataTableDesktop
          data={data}
          columns={orderOfferColumns} 
          onRowPress={handleRowPress}
        />
      </section>
    )
  }

  return (
    <DataTableMobile 
      data={data}
      mobileKeyExtractor={(data) => data.cabecalho.codigo_pedido.toString()}
      mobileDisplayValue={(data) => (
        <div className="flex flex-col">
          <small className="text-gray-500">Código do pedido</small>
          {data.cabecalho.codigo_pedido}
        </div>
      )}
      onRowPress={handleRowPress}
    />
  )
}