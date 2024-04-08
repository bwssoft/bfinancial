"use client";

import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { OmieOfferInstallment } from "@/app/lib/definitions/OmieOffer";
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { formatPrice } from "@/app/utils/formatters";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { getInstallmentColumns } from "./columns";

type OfferTableProps = {
  installments: OmieOfferInstallment[] | null;
  client: OmieClientModel;
  className?: string;
};

export function ClientOfferInstallmentTable({ installments, client, className }: OfferTableProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data = installments ?? [];

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={data}
        columns={getInstallmentColumns({ client })}
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
          <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <span className="flex flex-col truncate text-sm text-gray-500">
            <span className="truncate">{formatPrice(data.valor)}</span>
          </span>
        </span>
      )}
    />
  );
}
