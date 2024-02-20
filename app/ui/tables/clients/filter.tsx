"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";
import { Button } from "@/app/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Input } from "../../input";
import { useDebouncedCallback } from "use-debounce";

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
  const [enterprise, setEnterprise] = React.useState<string>();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearchClient = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("client_name", term);
    } else {
      params.delete("client_name");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const onAction = () => {
    const params = new URLSearchParams(searchParams);
    if (enterprise) {
      params.set("omie_enterprise", enterprise);
    } else {
      params.delete("omie_enterprise");
    }
    replace(`${pathname}?${params.toString()}`);
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
          onChange={(e) => handleSearchClient(e.target.value)}
        />
      </div>

      <Button type="submit">
        <MagnifyingGlassIcon className="h-4 w-4" />
        Buscar
      </Button>
    </form>
  );
}
