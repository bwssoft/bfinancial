import { OmieOffer } from "@/app/lib/definitions/OmieOffer"
import { ColumnDef } from "@tanstack/react-table";
import { Badge, BadgeThemes } from '@/app/ui/badge';
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";

type OfferStatusBadges = {
  [key: string]: {
    label: string;
    color: BadgeThemes;
  }
} 

const offerStatusBadges: OfferStatusBadges = {
  "60": {
    label: "60",
    color: 'yellow'
  },
  "70": {
    label: 'Concluido',
    color: "green"
  }
}

export type OmieOfferTable = OmieOffer & {
  client?: OmieClientModel;
}

export const clientOfferColumns: ColumnDef<OmieOfferTable>[] = [
  { header: 'Código do pedido', accessorKey: 'cabecalho.codigo_pedido' },
  { header: 'Cliente', accessorKey: "client.nome_fantasia" },
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
  { 
    header: 'Status', 
    accessorKey: 'cabecalho.etapa', 
    cell: ({ row }) => {
      const status = row.original.cabecalho.etapa;
      const label = offerStatusBadges[status]?.label;
      const theme = offerStatusBadges[status]?.color;

      return <Badge size="sm" label={label} theme={theme} />
    }
  },
]
