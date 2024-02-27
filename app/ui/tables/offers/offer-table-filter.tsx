"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";

import { fetchClients } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { useDebouncedCallback } from "use-debounce";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { enterprises } from "../clients/filter";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";

interface OfferFilterProps {
  client?: OmieClientModel;
  onClientChange: (client: OmieClientModel) => void;
}

export function OfferTableFilter({ client, onClientChange }: OfferFilterProps) {
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<OmieEnterpriseEnum>();

  const pathname = usePathname();
  const router = useRouter();

  const onAction = () => {
    router.push(
      `${pathname}?omie_enterprise=${enterprise}&codigo_cliente_omie=${client?.codigo_cliente_omie}`
    );
  };

  const handleClientsSearch = useDebouncedCallback((query: string) => {
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
            setEnterprise(option?.value as OmieEnterpriseEnum);
          }}
        />
      </div>
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar cliente"
          options={clients?.map((client) => ({
            label: client.nome_fantasia,
            value: client,
          }))}
          onInputChange={handleClientsSearch}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<OmieClientModel>;
            onClientChange(option.value);
          }}
        />
      </div>

      <Button type="submit">
        <MagnifyingGlassIcon className="h-4 w-4" />
        Buscar
      </Button>
    </form>
  );
}
