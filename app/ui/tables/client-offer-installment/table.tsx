"use client";

import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { formatPrice } from "@/app/utils/formatters";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { OmieInstallmentTable, getInstallmentColumns } from "./columns";

type OfferTableProps = {
  installments: OmieInstallmentTable[] | null;
  client: OmieClientModel;
  isInvoiced: boolean;
  className?: string;
};

export function ClientOfferInstallmentTable({
  installments,
  client,
  className,
  isInvoiced,
}: OfferTableProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const condition = (installment: OmieInstallmentTable) =>
    Array.isArray(installment.payment) && installment.payment.length > 0;

  const paymentCreated = {
    active:
      installments?.some((installment) => condition(installment)) ?? false,
    installment:
      installments?.find((installment) => condition(installment)) ?? undefined,
  };

  const data = installments ?? [];

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={data}
        columns={getInstallmentColumns({
          client,
          paymentCreated,
          isInvoiced,
        })}
        className={className}
      />
    );
  }

  return (
    <DataTableMobile
      data={data}
      mobileKeyExtractor={(data) => data.numero_parcela.toString()}
      mobileDisplayValue={(data) => (
        <span className="flex flex-1 space-x-2 truncate">
          <BanknotesIcon
            className="h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span className="flex flex-col truncate text-sm text-gray-500">
            <span className="truncate">{formatPrice(data.valor)}</span>
          </span>
        </span>
      )}
    />
  );
}
