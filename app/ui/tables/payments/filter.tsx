"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";
import { Button } from "@/app/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { enterprises } from "../clients/filter";
import { useDebouncedCallback } from "use-debounce";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { fetchClients } from "@/app/lib/actions";

export function PaymentTableFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [client, setClient] = React.useState<OmieClientModel>();
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<
    OmieEnterpriseEnum | undefined
  >((searchParams.get("omie_enterprise") as OmieEnterpriseEnum) ?? undefined);

  const handleChangeEnterprise = useDebouncedCallback((enterprise: string) => {
    const params = new URLSearchParams(searchParams);
    if (enterprise) {
      setEnterprise(enterprise as OmieEnterpriseEnum);
      params.set("omie_enterprise", enterprise);
      params.delete("codigo_cliente_omie");
      setClients([]);
      setClient(undefined);
    } else {
      params.delete("codigo_cliente_omie");
      params.delete("omie_enterprise");
      setEnterprise(undefined);
      setClients([]);
      setClient(undefined);
    }
    replace(`${pathname}?${params.toString()}`);
  });

  const handleChangeClient = (
    option: AutocompleteResponse<OmieClientModel>
  ) => {
    const params = new URLSearchParams(searchParams);
    if (option) {
      setClient(option.value);
      params.set(
        "codigo_cliente_omie",
        String(option.value.codigo_cliente_omie)
      );
    } else {
      params.delete("codigo_cliente_omie");
      setClient(undefined);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchClients = useDebouncedCallback((query: string) => {
    listClients(query);
  }, 500);

  async function listClients(query: string) {
    if (query === "" || !enterprise) return;

    const data = await fetchClients(enterprise, {
      pagina: 1,
      registros_por_pagina: 20,
      clientesFiltro: {
        nome_fantasia: query,
      },
    });

    if (data) {
      setClients(data.clientes_cadastro);
    }
  }

  return (
    <form className="inline-flex items-center my-4 gap-2">
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar empresa"
          options={enterprises.map((enterprise) => ({
            label: enterprise.name,
            value: enterprise.id,
          }))}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            handleChangeEnterprise(option?.value);
          }}
        />
      </div>
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar cliente"
          options={clients.map((client) => ({
            label: client.nome_fantasia,
            value: client,
          }))}
          onInputChange={handleSearchClients}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<OmieClientModel>;
            handleChangeClient(option);
          }}
        />
      </div>
    </form>
  );
}
