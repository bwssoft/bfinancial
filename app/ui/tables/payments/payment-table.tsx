"use client"

import { useMediaQuery } from "@/app/hook/use-media-query";
import { useRouter } from "next/navigation";
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";

import { Payment } from "@/app/lib/definitions/Payment";
import { paymentColumns } from './columns'

type OfferTableProps = {
  payments: Payment[];
}

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
        columns={paymentColumns} 
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
          <ul className="space-y-2">
            <li className="flex flex-col">
              <span className="text-gray-500">Código do pagamento</span>
              <span>{data.uuid}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-gray-500">Registrado por</span>
              <span className="truncate">{data.user_uuid}</span>
            </li>
          </ul>
        </div>
      )}
      onRowPress={handleRowPress}
    />
  )
}