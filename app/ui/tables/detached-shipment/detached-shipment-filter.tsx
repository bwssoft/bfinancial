"use client";

import { fetchClients } from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";
import { formatSearchParams } from "@/app/utils/format-search-params";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Badge } from "../../badge";
import { Button } from "../../button";
import { enterprises } from "../clients/filter";

export function DetachedShipmentFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [client, setClient] = React.useState<OmieClientModel>();
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<OmieEnterpriseEnum | undefined>(
    (searchParams.get("omie_enterprise") as OmieEnterpriseEnum) ?? undefined
  );

  const onAction = () => {
    const params = formatSearchParams({
      omie_enterprise: enterprise,
      codigo_cliente_omie: client?.codigo_cliente_omie,
    });
    router.push(`${pathname}?${params}`);
  };

  const handleSearchClients = useDebouncedCallback((query: string) => {
    console.log("query", query);
    listClients(query);
  }, 500);

  async function listClients(query: string) {
    console.log("🚀 ~ file: detached-shipment-filter.tsx:41 ~ listClients ~ query:", query);
    if (query === "" || !enterprise) return;

    const data = await fetchClients(enterprise, {
      pagina: 1,
      registros_por_pagina: 20,
      clientesFiltro: {
        nome_fantasia: query,
      },
    });

    console.log("🚀 ~ file: detached-shipment-filter.tsx:58 ~ listClients ~ data:", data);

    if (data) {
      setClients(data.clientes_cadastro);
    }
  }

  return (
    <div className="inline-flex flex-col gap-2 my-4 w-full">
      <div className="inline-flex items-end gap-2">
        <div className="w-64">
          <Autocomplete
            label="Filtrar por empresa"
            placeholder="Selecione uma empresa"
            options={enterprises.map((enterprise) => ({
              label: enterprise.name,
              value: enterprise.id,
            }))}
            onChange={(newValue) => {
              const option = newValue as AutocompleteResponse<string>;
              setEnterprise(option.value as any);
            }}
          />
        </div>
        <div className="w-64">
          <Autocomplete
            label="Filtrar por cliente"
            placeholder="Busque um cliente"
            options={clients.map((client) => ({
              label: client.nome_fantasia,
              value: client,
            }))}
            onInputChange={handleSearchClients}
            onChange={(newValue) => {
              const option = newValue as AutocompleteResponse<OmieClientModel>;
              setClient(option.value);
            }}
          />
        </div>

        <form action={onAction}>
          <Button type="submit" className="mb-0.5">
            <MagnifyingGlassIcon className="h-4 w-4" />
            Buscar
          </Button>
        </form>
      </div>
      <div className="inline-flex items-center gap-1">
        {searchParams.get("omie_enterprise") && (
          <Badge
            label="Empresa"
            isRemoved
            onClick={() => {
              setEnterprise(undefined);
              onAction();
            }}
          />
        )}

        {searchParams.get("codigo_cliente_omie") && (
          <Badge
            label="Cliente OMIE"
            isRemoved
            onClick={() => {
              setClient(undefined);
              onAction();
            }}
          />
        )}
      </div>
    </div>
  );
}
