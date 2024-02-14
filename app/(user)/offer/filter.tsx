"use client"

import React from 'react';
import { usePathname, useRouter } from 'next/navigation'

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete"

import { fetchClients } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { useDebouncedCallback } from 'use-debounce';

const enterprises = [
  { id: 'wfc', name: 'WFC Technology' },
  { id: 'bws', name: 'BWS IoT' },
]

export function OfferFilter() {
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);

  const [client, setClient] = React.useState<string>();
  const [enterprise, setEnterprise] = React.useState<string>();

  const pathname = usePathname();
  const router = useRouter();

  const onAction = () => {
    router.push(`${pathname}?enterprise_id=${enterprise}&client=${client}`)
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
            value: client.codigo_cliente_omie
          }))}
          onInputChange={handleClientsSearch}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            setClient(option.value)
          }}
        />
      </div>

      <Button type="submit">
        Buscar
      </Button>
    </form>
  )
}