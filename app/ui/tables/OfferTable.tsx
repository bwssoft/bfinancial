"use client"

import { OmieOffer, OmieListOfferResponse } from "@/app/lib/definitions/OmieOffer"
import { DataTableDesktop, DataTableMobile } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";

import { useRouter } from 'next/navigation'
import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";

type OfferTableProps = {
  offers: OmieListOfferResponse | null;
}

const orderOfferColumns: ColumnDef<OmieOffer>[] = [
  { header: 'Código do pedido', accessorKey: 'cabecalho.codigo_pedido' },
  { header: 'Empresa', accessorKey: 'cabecalho.codigo_empresa' },
  { header: 'Cliente', accessorKey: 'cabecalho.codigo_cliente' },
  { header: 'Parcela', cell: ({ row }) => {
    const offer = row.original;    

    if (offer.cabecalho.qtde_parcelas === 0) {
      return <span>A vista</span>
    }

    const lastInstallment = offer.lista_parcelas.parcela[offer.lista_parcelas.parcela.length - 1]
    
    return (
      <span>{lastInstallment.numero_parcela} de {offer.cabecalho.qtde_parcelas}</span>
    ) 
  }},
  { header: 'Status', accessorKey: 'cabecalho.etapa' },
]

export function OfferTable({ offers,  }: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const data = offers?.pedido_venda_produto ?? [];

  function handleRowPress(data: OmieOffer) {
    router.push(`/offer/${data.cabecalho.codigo_pedido}`)
  }

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={data}
        columns={orderOfferColumns} 
        onRowPress={handleRowPress}
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