import { ColumnDef } from "@tanstack/react-table";
import { Badge, BadgeThemes } from "@/app/ui/badge";
import { Payment } from "@/app/lib/definitions/Payment";

type StatusBadges = {
  [key: string]: {
    label: string;
    color: BadgeThemes;
  };
};

const statusBadges: StatusBadges = {
  paid: {
    label: "Pago",
    color: "green",
  },
  pending: {
    label: "Pendente",
    color: "yellow",
  },
  failed: {
    label: "Falhou",
    color: "red",
  },
  canceled: {
    label: "Cancelada",
    color: "red",
  },
};

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    header: "Empresa",
    accessorKey: "omie_metadata",
    cell: (cell) => <span>{cell.row.original.omie_metadata.enterprise}</span>,
  },
  {
    header: "Código Cliente Omie",
    accessorKey: "omie_metadata",
    cell: (cell) => (
      <span>{cell.row.original.omie_metadata.codigo_cliente}</span>
    ),
  },
  {
    header: "Código Pedido Omie",
    accessorKey: "omie_metadata",
    cell: (cell) => (
      <span>{cell.row.original.omie_metadata.codigo_pedido ?? "--"}</span>
    ),
  },
  { header: "Valor", accessorKey: "price" },
];
