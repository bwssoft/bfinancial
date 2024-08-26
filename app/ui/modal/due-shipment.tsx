"use client";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { DueShipmentForm } from "../form/due-shipment";
import { Modal } from "../modal";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { useSearchParams } from "next/navigation";

export function DueShipmentModal(params: {
  client: OmieClientModel;
  omie_enterprise: OmieEnterpriseEnum;
  codigo_cliente_omie: string;
  codigo_pedido_omie: string;
}) {
  const { client, omie_enterprise, codigo_cliente_omie, codigo_pedido_omie } =
    params;

  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modalIsOpen") === "true" ? true : false;

  const closeModal = () => {
    return `/offer/${omie_enterprise}/${codigo_cliente_omie}/${codigo_pedido_omie}?modalIsOpen=false`;
  };

  return isOpen ? (
    <Modal title="Cobrar Frete" onClose={closeModal}>
      <DueShipmentForm
        contact_phone={`${client.telefone1_ddd}${client.telefone1_numero}`}
        contact_email={client.email}
        omie_enterprise={omie_enterprise}
        cnpj_cpf={client.cnpj_cpf}
        codigo_cliente_omie={codigo_cliente_omie}
        codigo_pedido_omie={codigo_pedido_omie}
        nome_fantasia={client.nome_fantasia}
      />
    </Modal>
  ) : (
    <></>
  );
}
