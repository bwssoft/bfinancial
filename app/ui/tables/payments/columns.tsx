import { ColumnDef } from "@tanstack/react-table";

import { Payment } from "@/app/lib/definitions/Payment";
import { Badge, BadgeThemes } from "@/app/ui/badge";

type StatusBadges = {
  [key: string]: {
    label: string;
    color: BadgeThemes;
  }
} 

const statusBadges: StatusBadges = {
  paid: {
    label: 'Pago',
    color: 'green'
  },
  pending: {
    label: 'Pendente',
    color: 'yellow'
  },
  failed: {
    label: 'Falhou',
    color: 'red'
  },
  canceled: {
    label: 'Cancelada',
    color: 'red'
  }
}

export const paymentColumns: ColumnDef<Payment>[] = [
  { header: 'Código do pagamento', accessorKey: 'uuid' },
  { header: 'Registrado por', accessorKey: 'user_uuid' },
  { header: 'Parcelas', id: 'installment', cell: () => <span>0 de 0</span> },
  { header: 'Valor', accessorKey: 'price' },
  { header: 'Status', accessorKey: 'status', cell: ({ row }) => {
    const status = row.original.status;
    const label = statusBadges[status]?.label;
    const theme = statusBadges[status]?.color;
    return <Badge size="sm" label={label} theme={theme} />
  }},
]