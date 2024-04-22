"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  OmieOffer,
  OmieListOfferResponse,
} from "@/app/lib/definitions/OmieOffer";
import { DataTableDesktop, DataTableMobile } from "@/app/ui/data-table";
import { useMediaQuery } from "@/app/hook/use-media-query";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";

import { clientOfferColumns } from "./columns";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";

type OfferTableProps = {
  offers: OmieListOfferResponse | null;
  client: OmieClientModel | null;
  omie_enterprise: OmieEnterpriseEnum | null;
  className?: string;
};

export function ClientOffersTable({
  offers,
  client,
  className,
  omie_enterprise,
}: OfferTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const data =
    offers?.pedido_venda_produto.map((offer) => ({
      ...offer,
      client,
    })) ?? [];

  function handleRowPress(data: OmieOffer) {
    router.push(
      `/offer/${omie_enterprise}/${client?.codigo_cliente_omie}/${data.cabecalho.codigo_pedido}`
    );
  }

  if (isDesktop) {
    return (
      <DataTableDesktop
        data={data}
        columns={clientOfferColumns}
        onRowPress={handleRowPress}
        className={className}
      />
    );
  }

  return (
    <DataTableMobile
      data={data}
      mobileKeyExtractor={(data) => data.cabecalho.codigo_pedido.toString()}
      mobileDisplayValue={(data) => (
        <div className="flex flex-col">
          <small className="text-gray-500">Número do pedido</small>
          {data.cabecalho.numero_pedido}
        </div>
      )}
      onRowPress={handleRowPress}
    />
  );
}
