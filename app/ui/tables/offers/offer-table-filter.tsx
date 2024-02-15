"use client"

import React from 'react';
import { usePathname, useRouter } from 'next/navigation'

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete"

import { fetchClients } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";


const enterprises = [
  { id: 'wfc', name: 'WFC Technology' },
  { id: 'bws', name: 'BWS IoT' },
]

interface OfferFilterProps {
  client?: OmieClientModel;
  onClientChange: (client: OmieClientModel) => void;
}

export function OfferTableFilter({ client, onClientChange }: OfferFilterProps) {
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<string>();

  const pathname = usePathname();
  const router = useRouter();

  const onAction = () => {
    router.push(`${pathname}?enterprise_id=${enterprise}&client=${client?.codigo_cliente_omie}`)
  }

  const handleClientsSearch = useDebouncedCallback((query: string) => {
    listClients(query);
  }, 500)

  async function listClients(query: string) {
    if (query === "") return;

    const data = await fetchClients({
      pagina: 1,
      registros_por_pagina: 100,
      clientesFiltro: {
        nome_fantasia: query,
      },
    });

    setClients(data.clientes_cadastro);
  }

  return (
    <form action={onAction} className="inline-flex items-center my-4 gap-2">
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar empresa"
          options={enterprises.map((enterprise) => ({
              label: enterprise.name,
              value: enterprise.id
          }))}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            setEnterprise(option?.value)
          }}
        />
      </div>
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar cliente"
          options={clients?.map((client) => ({
            label: client.nome_fantasia,
            value: client
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
  )
}