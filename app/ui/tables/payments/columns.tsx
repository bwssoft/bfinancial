import { ColumnDef } from "@tanstack/react-table";
import { Badge, BadgeThemes } from "@/app/ui/badge";
import { Payment } from "@/app/lib/definitions";

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
  { header: "Código do pagamento", accessorKey: "uuid" },
  { header: "Registrado por", accessorKey: "user_uuid" },
  { header: "Parcelas", id: "installment", cell: () => <span>0 de 0</span> },
  { header: "Valor", accessorKey: "price" },
];
