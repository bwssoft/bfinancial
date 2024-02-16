"use client"

import React from 'react';
import { useRouter } from 'next/navigation'

import { OmieOffer, OmieListOfferResponse } from "@/app/lib/definitions/OmieOffer"
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";

import { clientOfferColumns } from './columns';

type OfferTableProps = {
  offers: OmieListOfferResponse | null;
  client: OmieClientModel | null;
  className?: string;
}

export function ClientOffersTable({ offers, client, className }: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const data = offers?.pedido_venda_produto.map((offer) => ({
    ...offer,
    client,
  })) ?? [];

  function handleRowPress(data: OmieOffer) {
    router.push(`/offer/${data.cabecalho.codigo_pedido}`)
  }

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={data}
        columns={clientOfferColumns} 
        onRowPress={handleRowPress}
        className={className}
      />
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