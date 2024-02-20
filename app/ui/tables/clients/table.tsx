"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientResponse } from "@/app/lib/definitions/OmieClient";
import { columns } from "./columns";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ClientTableFilter } from "./filter";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";

type ClientTableProps = {
  clients: OmieClientResponse | null;
  className?: string;
  omie_enterprise: OmieEnterpriseEnum;
};

export function ClientsTable({
  clients,
  className,
  omie_enterprise,
}: ClientTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data =
    clients?.clientes_cadastro.map((client) => ({
      ...client,
      omie_enterprise,
    })) ?? [];

  if (isDesktop) {
    return (
      <section>
        <div className="inline-flex justify-between w-full items-center">
          <ClientTableFilter />
        </div>
        <DataTableDesktop data={data} columns={columns} className={className} />
      </section>
    );
  }

  return (
    <DataTableMobile
      data={data}
      mobileKeyExtractor={(data) => data.codigo_cliente_omie.toString()}
      mobileDisplayValue={(data) => (
        <Link
          href={`/clients/${omie_enterprise}/${data.codigo_cliente_omie}`}
          className="block bg-white px-4 py-4 hover:bg-gray-50"
        >
          <span className="flex items-center space-x-4">
            <span className="flex flex-1 space-x-2 truncate">
              <BanknotesIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <span className="flex flex-col truncate text-sm text-gray-500">
                <span className="truncate">{data.razao_social}</span>
              </span>
            </span>
            <ChevronRightIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Link>
      )}
    />
  );
}
