"use client"

import { useMediaQuery } from "@/app/utils/use-media-query";
import { useRouter } from "next/navigation";
import { DataTableDesktop, DataTableMobile } from "../data-table";

import { Payment } from "@/app/lib/definitions/Payment";
import { ColumnDef } from "@tanstack/react-table";

type OfferTableProps = {
  payments: Payment[];
}

const columns: ColumnDef<Payment>[] = [
  { header: 'Código do pagamento', accessorKey: 'uuid' },
  { header: 'Registrado por', accessorKey: 'user_uuid' },
  { header: 'Valor', accessorKey: 'price' },
  { header: 'Status', accessorKey: 'status' },
]

export function PaymentTable({ payments }: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)")

  function handleRowPress(data: Payment) {
    router.push(`/payment/${data.uuid}}`)
  }

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={payments}
        columns={columns} 
        onRowPress={handleRowPress}
      />
    )
  }

  return (
    <DataTableMobile 
      data={payments}
      mobileKeyExtractor={(data) => data.uuid}
      mobileDisplayValue={(data) => (
        <div className="flex flex-col">
          <ul>
            <li className="flex items-center gap-2">
              <span className="text-gray-500">Código do pagamento</span>
              <span>{data.uuid}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-500">Registrado por</span>
              <span>{data.user_uuid}</span>
            </li>
          </ul>
        </div>
      )}
      onRowPress={handleRowPress}
    />
  )
}