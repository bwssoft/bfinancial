import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { OmieOffer, OmieOfferStep } from "@/app/lib/definitions/OmieOffer";
import { Badge, BadgeThemes } from "@/app/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

const offerStatusBadgeColor: { [key: string]: BadgeThemes } = {
  "10": "gray",
  "20": "gray",
  "50": "gray",
  "60": "gray",
  "70": "gray",
  "80": "gray",
};

export type OmieOfferTable = OmieOffer & {
  client?: OmieClientModel;
};

export const orderOfferColumns: ColumnDef<OmieOfferTable>[] = [
  { header: "Número do pedido", accessorKey: "cabecalho.numero_pedido" },
  {
    header: "Parcela",
    cell: ({ row }) => {
      const offer = row.original;

      if (offer.cabecalho.qtde_parcelas === 0) {
        return <span>A vista</span>;
      }

      return <span>{offer.cabecalho.qtde_parcelas} parcela</span>;
    },
  },
  {
    header: "Etapa",
    accessorKey: "cabecalho.etapa",
    cell: ({ row }) => {
      const status = row.original.cabecalho.etapa;
      const label = OmieOfferStep[status];
      const theme = offerStatusBadgeColor[status];
      return <Badge size="sm" label={label} theme={theme} />;
    },
  },
  {
    header: "Criado em",
    cell: ({ row }) => {
      return `${row.original.infoCadastro.dInc} às ${row.original.infoCadastro.hInc}`;
    },
  },
];
