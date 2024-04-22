import { OmieOffer } from "@/app/lib/definitions/OmieOffer";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, BadgeThemes } from "@/app/ui/badge";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";

type OfferStatusBadges = {
  [key: string]: {
    label: string;
    color: BadgeThemes;
  };
};

const offerStatusBadges: OfferStatusBadges = {
  "10": {
    label: "(10) Proposta/Orçamento",
    color: "gray",
  },
  "20": {
    label: "(20) Separar estoque",
    color: "gray",
  },
  "30": {
    label: "30",
    color: "gray",
  },
  "40": {
    label: "40",
    color: "gray",
  },
  "50": {
    label: "(50) Faturar",
    color: "gray",
  },
  "60": {
    label: "(60) Faturado",
    color: "gray",
  },
  "70": {
    label: "(70) Entrega",
    color: "gray",
  },
  "80": {
    label: "(80) Pedido/Aprovação Financeira",
    color: "gray",
  },
};

export type OmieOfferTable = OmieOffer & {
  client?: OmieClientModel;
};

export const clientOfferColumns: ColumnDef<OmieOfferTable>[] = [
  { header: "Número do pedido", accessorKey: "cabecalho.numero_pedido" },
  {
    header: "Parcela",
    cell: ({ row }) => {
      const offer = row.original;

      if (offer.cabecalho.qtde_parcelas === 0) {
        return <span>À vista</span>;
      }

      return <span>{offer.cabecalho.qtde_parcelas} parcelas</span>;
    },
  },
  {
    header: "Status",
    accessorKey: "cabecalho.etapa",
    cell: ({ row }) => {
      const status = row.original.cabecalho.etapa;
      console.log("status", status);
      const label = offerStatusBadges[status]?.label;
      const theme = offerStatusBadges[status]?.color;

      return <Badge size="sm" label={label} theme={theme} />;
    },
  },
  { header: "Data de previsão", accessorKey: "cabecalho.data_previsao" },
];
