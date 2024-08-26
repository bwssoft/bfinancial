"use client";

import { useMediaQuery } from "@/app/hook/use-media-query";
import { useRouter } from "next/navigation";
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { paymentColumns } from "./columns";
import { PaymentTableFilter } from "./filter";
import { Payment } from "@/app/lib/definitions/Payment";

type OfferTableProps = {
  payments: Payment[];
};

export function PaymentTable({ payments }: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleRowPress(data: Payment) {
    router.push(`/payment/${data.group}`);
  }

  if (isDesktop) {
    return (
      <section>
        <div className="inline-flex justify-between w-full items-center">
          <PaymentTableFilter />
        </div>
        <DataTableDesktop
          data={payments}
          columns={paymentColumns}
          onRowPress={handleRowPress}
        />
      </section>
    );
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
  );
}
