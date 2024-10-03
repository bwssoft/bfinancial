import { Payment } from "@/app/lib/definitions/Payment";
import { BadgeThemes } from "@/app/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

type StatusBadges = {
  [key: string]: {
    label: string;
    color: BadgeThemes;
  };
};

export const detachedShipmentColumns: ColumnDef<Payment>[] = [
  {
    header: "Empresa",
    accessorKey: "omie_metadata",
    cell: (cell) => <span>{cell.row.original.omie_metadata.enterprise}</span>,
  },
  {
    header: "Código Cliente Omie",
    accessorKey: "omie_metadata",
    cell: (cell) => <span>{cell.row.original.omie_metadata.codigo_cliente}</span>,
  },
  {
    header: "Código Pedido Omie",
    accessorKey: "omie_metadata",
    cell: (cell) => <span>{cell.row.original.omie_metadata.codigo_pedido ?? "--"}</span>,
  },
  { header: "Valor", accessorKey: "price", cell: (cell) => `R$${cell.row.original.price}` },
  {
    header: "Criado em",
    accessorKey: "created_at",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
];
