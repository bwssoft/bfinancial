import { getCachedClient, getCachedOffer } from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { DueDetachedForm } from "@/app/ui/form/due-detached";
import { Modal } from "@/app/ui/modal";

export default async function Example({
  searchParams,
}: {
  searchParams: {
    omie_enterprise: keyof typeof OmieEnterpriseEnum;
    codigo_pedido_omie: string;
    codigo_cliente_omie: string;
  };
}) {
  const { omie_enterprise, codigo_cliente_omie, codigo_pedido_omie } =
    searchParams;

  if (!omie_enterprise || !codigo_cliente_omie || !codigo_pedido_omie) {
    throw new Error("Lmao");
  }

  const [offer, client] = await Promise.all([
    getCachedOffer(
      OmieEnterpriseEnum[omie_enterprise],
      Number(codigo_pedido_omie)
    ),
    getCachedClient(OmieEnterpriseEnum[omie_enterprise], codigo_cliente_omie),
  ]);

  if (!offer || !client) {
    return (
      <Modal title="Cobrar Frete">
        <div>Faltam dados</div>
      </Modal>
    );
  }

  return (
    <Modal title="Cobrar Frete">
      <DueDetachedForm
        contact_phone={`${client.telefone1_ddd}${client.telefone1_numero}`}
        contact_email={client.email}
        omie_enterprise={OmieEnterpriseEnum[omie_enterprise]}
        cnpj_cpf={client.cnpj_cpf}
        codigo_cliente_omie={codigo_cliente_omie}
        codigo_pedido_omie={codigo_pedido_omie}
        nome_fantasia={client.nome_fantasia}
      />
    </Modal>
  );
}
