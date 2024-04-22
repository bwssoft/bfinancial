"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";

import { fetchClients } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { useDebouncedCallback } from "use-debounce";

import { format, subDays } from "date-fns";

import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Badge } from "@/app/ui/badge";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/app/ui/toggle-group";
import { formatSearchParams } from "@/app/utils/format-search-params";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { enterprises } from "../clients/filter";

interface OfferFilterProps {
  client?: OmieClientModel;
  onClientChange: (client: OmieClientModel | undefined) => void;
}

export function OfferTableFilter({ client, onClientChange }: OfferFilterProps) {
  const searchParams = useSearchParams();

  const [clients, setClients] = React.useState<OmieClientModel[]>([]);
  const [enterprise, setEnterprise] = React.useState<
    OmieEnterpriseEnum | undefined
  >((searchParams.get("omie_enterprise") as OmieEnterpriseEnum) ?? undefined);

  const [orderStep, setOrderStep] = React.useState<string | undefined>(
    searchParams.get("etapa") ?? undefined
  );

  const [period, setPeriod] = React.useState<string | undefined>(
    searchParams.get("periodo") ?? undefined
  );
  const [offerNumber, setOfferNumber] = React.useState<string | undefined>(
    searchParams.get("numero_pedido") ?? undefined
  );

  const pathname = usePathname();
  const router = useRouter();

  const onAction = () => {
    const params = formatSearchParams({
      omie_enterprise: enterprise,
      codigo_cliente_omie: client?.codigo_cliente_omie,
      etapa: orderStep,
      periodo: period,
      numero_pedido: offerNumber,
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

  function formatPeriod(value: string) {
    const pastDays = parseInt(value);
    const date = subDays(new Date(), pastDays);
    if (value) {
      setPeriod(format(date, "dd/MM/yyyy"));
    } else {
      setPeriod(undefined);
    }
  }

  return (
    <div className="inline-flex flex-col gap-2 my-4 w-full">
      <div className="inline-flex items-end gap-1">
        <div className="w-72">
          <Autocomplete
            label="Selecionar empresa"
            options={enterprises.map((enterprise) => ({
              label: enterprise.name,
              value: enterprise.id,
            }))}
            onChange={(newValue) => {
              const option = newValue as AutocompleteResponse<string>;
              const params = formatSearchParams({
                omie_enterprise: option?.value,
              });
              setEnterprise(option?.value as OmieEnterpriseEnum);
              onClientChange(undefined);
              setClients([]);
              router.push(`${pathname}?${params}`);
            }}
          />
        </div>

        <div className="flex flex-col">
          <Label>Periodo de tempo</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            onValueChange={formatPeriod}
          >
            <ToggleGroupItem value="15" className="w-24">
              15 dias
            </ToggleGroupItem>
            <ToggleGroupItem value="30" className="w-24">
              30 dias
            </ToggleGroupItem>
            <ToggleGroupItem value="60" className="w-24">
              2 meses
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <form action={onAction}>
          <Button type="submit">
            <MagnifyingGlassIcon className="h-4 w-4" />
            Buscar
          </Button>
        </form>

        <Popover>
          <PopoverTrigger type="button" asChild>
            <Button type="button" variant="outline">
              Ver mais filtros
              <ChevronDownIcon className="transition-transform duration-200 h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form
              action={onAction}
              className="grid grid-flow-row gap-4 rounded-md"
            >
              <Input
                label="Número do pedido"
                placeholder="Número do pedido"
                defaultValue={searchParams.get("numero_pedido") ?? undefined}
                onChange={(e) => setOfferNumber(e.target.value)}
              />

              <Autocomplete
                label="Etapa do pedido"
                placeholder="Etapa"
                defaultValue={searchParams.get("etapa")}
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

              <Autocomplete
                label="Cliente"
                placeholder="Filtrar cliente"
                options={clients?.map((client) => ({
                  label: client.nome_fantasia,
                  value: client,
                }))}
                onInputChange={handleClientsSearch}
                onChange={(newValue) => {
                  const option =
                    newValue as AutocompleteResponse<OmieClientModel>;
                  onClientChange(option.value);
                }}
              />

              <Button type="submit">Adicionar filtros</Button>
            </form>
          </PopoverContent>
        </Popover>
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

        {searchParams.get("periodo") && (
          <Badge
            label="Periodo de tempo"
            isRemoved
            onClick={() => {
              setPeriod(undefined);
              onAction();
            }}
          />
        )}

        {searchParams.get("numero_pedido") && (
          <Badge
            label="Número pedido"
            isRemoved
            onClick={() => {
              setOfferNumber(undefined);
              onAction();
            }}
          />
        )}

        {searchParams.get("etapa") && (
          <Badge
            label="Etapa"
            isRemoved
            onClick={() => {
              setOrderStep(undefined);
              onAction();
            }}
          />
        )}
      </div>
    </div>
  );
}
