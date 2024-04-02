"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";

import { fetchClients } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { useDebouncedCallback } from "use-debounce";

import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { formatSearchParams } from "@/app/utils/format-search-params";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "../../input";
import { enterprises } from "../clients/filter";

interface OfferFilterProps {
  client?: OmieClientModel;
  onClientChange: (client: OmieClientModel) => void;
}

export function OfferTableFilter({ client, onClientChange }: OfferFilterProps) {
  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<OmieEnterpriseEnum>();
  const [orderBy, setOrderBy] = React.useState<string>();
  const [orderStep, setOrderStep] = React.useState<string>();
  const [orderId, setOrderId] = React.useState<string>();

  const pathname = usePathname();
  const router = useRouter();

  const onAction = () => {
    const params = formatSearchParams({
      omie_enterprise: enterprise,
      codigo_cliente_omie: client?.codigo_cliente_omie,
      ordenar_por: orderBy,
      etapa: orderStep,
      codigo_pedido: orderId,
    });
    router.push(`${pathname}?${params}`);
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
      <Input
        placeholder="Código do pedido"
        className="w-64"
        onChange={(e) => setOrderId(e.target.value)}
      />

      <div className="w-52">
        <Autocomplete
          placeholder="Ordenar por"
          options={[
            { label: "Data de emissão", value: "DATA_EMISSAO" },
            { label: "Data de inclusão", value: "DATA_INCLUSAO" },
            { label: "Data de alteração", value: "DATA_ALTERACAO" },
            { label: "Data de vencimento", value: "DATA_VENCIMENTO" },
            { label: "Data de pagamento", value: "DATA_PAGAMENTO" },
          ]}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            setOrderBy(option.value);
          }}
        />
      </div>

      <div className="w-52">
        <Autocomplete
          placeholder="Etapa"
          options={[
            { label: "Proposta / Orçamento", value: "10" },
            { label: "Separar estoque", value: "20" },
            { label: "Faturar", value: "50" },
            { label: "Faturado", value: "60" },
            { label: "Entrega", value: "70" },
            { label: "Pedido / Aprovação Financeira", value: "80" },
          ]}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            setOrderStep(option.value);
          }}
        />
      </div>

      <div className="w-52">
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
      <div className="w-52">
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
