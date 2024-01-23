"use client"

import { OmieOffer, OmieListOfferResponse } from "@/app/lib/definitions/OmieOffer"
import { DataTableDesktop, DataTableMobile } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";

import { useRouter } from 'next/navigation'
import { useMediaQuery } from "@/app/hook/use-media-query";

type OfferTableProps = {
  offers: OmieListOfferResponse;
}

const orderOfferColumns: ColumnDef<OmieOffer>[] = [
  { header: 'Código do pedido', accessorKey: 'cabecalho.codigo_pedido' },
  { header: 'Empresa', accessorKey: 'cabecalho.codigo_empresa' },
  { header: 'Cliente', accessorKey: 'cabecalho.codigo_cliente' },
  { header: 'Status', accessorKey: 'cabecalho.etapa' },
]

export function OfferTable({ offers }: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)")

  function handleRowPress(data: OmieOffer) {
    router.push(`/offer/${data.cabecalho.codigo_pedido}`)
  }

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={offers.pedido_venda_produto}
        columns={orderOfferColumns} 
        onRowPress={handleRowPress}
      />
    )
  }

  return (
    <DataTableMobile 
      data={offers.pedido_venda_produto}
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