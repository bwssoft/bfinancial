"use client"
import { fetchClients } from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { formatSearchParams } from "@/app/utils/format-search-params";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { AutocompleteResponse } from "../../autocomplete";

export function useDetachedShipment() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [client, setClient] = React.useState<OmieClientModel>()
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<
    OmieEnterpriseEnum | undefined
  >((searchParams.get("omie_enterprise") as OmieEnterpriseEnum) ?? undefined);

  const handleChangeEnterprise = (option: AutocompleteResponse<string>) => {
    const params = formatSearchParams({
      omie_enterprise: option?.value,
    });
    setEnterprise(option?.value as OmieEnterpriseEnum);
    setClient(undefined);
    setClients([]);
    router.push(`${pathname}?${params}`);
  }

  const handleChangeClient = (client: OmieClientModel) => {
    setClient(client);
  }

  const handleSearchClients = listClients

  async function listClients(query: string) {
    if (query === "" || !enterprise) return;

    const data = await fetchClients(enterprise, {
      pagina: 1,
      registros_por_pagina: 10000,
      clientesFiltro: {
        cnpj_cpf: query,
      },
    });
    console.log("🚀 ~ listClients ~ data:", query, enterprise, data)

    if (data) {
      setClients(data.clientes_cadastro);
    }
  }

  return {
    handleChangeEnterprise,
    handleChangeClient,
    handleSearchClients,
    clients,
    client,
    enterprise
  }

}