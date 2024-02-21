"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";
import { Button } from "@/app/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Input } from "../../input";
import { formatSearchParams } from "@/app/utils/format-search-params";

export const enterprises: {
  id: OmieEnterpriseEnum;
  name: string;
}[] = [
  { id: OmieEnterpriseEnum.WFC, name: "WFC Technology" },
  { id: OmieEnterpriseEnum.BWS, name: "BWS IoT" },
  { id: OmieEnterpriseEnum.MGC, name: "MGC" },
  { id: OmieEnterpriseEnum.ICB, name: "ICB" },
  { id: OmieEnterpriseEnum.ICBFILIAL, name: "ICB Filial" },
];

export function ClientTableFilter() {
  const [client, setClient] = React.useState<string>();
  const [enterprise, setEnterprise] = React.useState<string>();

  const pathname = usePathname();
  const router = useRouter();

  const onAction = () => {
    const params = formatSearchParams({
      omie_enterprise: enterprise,
      client_name: client
    })
    router.push(`${pathname}?${params}`)
  };

  return (
    <form action={onAction} className="inline-flex items-center my-4 gap-2">
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar empresa"
          options={enterprises.map((enterprise) => ({
            label: enterprise.name,
            value: enterprise.id,
          }))}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            setEnterprise(option?.value);
          }}
        />
      </div>
      <div className="w-64">
        <Input
          placeholder="Pesquise pelo nome do cliente"
          onChange={(e) => setClient(e.target.value)}
        />
      </div>

      <Button type="submit">
        <MagnifyingGlassIcon className="h-4 w-4" />
        Buscar
      </Button>
    </form>
  );
}
