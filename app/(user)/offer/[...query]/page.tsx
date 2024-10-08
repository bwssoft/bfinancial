import {
  getCachedClient,
  fetchPayments,
  generateOmieInvoice,
  getCachedOffer,
  getManyTransactionById,
  revalidateInstallmentOffer,
  fetchAuditByOmieCode,
} from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Alert } from "@/app/ui/alert";
import { BackButton } from "@/app/ui/back-button";
import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import { LabelValue } from "@/app/ui/label-value";
import { DueShipmentModal } from "@/app/ui/modal/due-shipment";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { Surface, SurfaceHeader } from "@/app/ui/surface";
import { ClientOfferInstallmentTable } from "@/app/ui/tables/client-offer-installment/table";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default async function Example({
  params,
}: {
  params: {
    query: [OmieEnterpriseEnum, string, string];
  };
}) {
  const [omie_enterprise, codigo_cliente_omie, codigo_pedido_omie] =
    params.query;

  if (!omie_enterprise || !codigo_cliente_omie || !codigo_pedido_omie) {
    throw new Error("Lmao");
  }

  const [client, offer, payments] = await Promise.all([
    getCachedClient(omie_enterprise, codigo_cliente_omie),
    getCachedOffer(omie_enterprise, Number(codigo_pedido_omie)),
    fetchPayments({ "omie_metadata.codigo_pedido": codigo_pedido_omie }),
  ]);

  if (!offer || !client) {
    return (
      <div>
        <h2>no offer</h2>
      </div>
    );
  }

  const transactions = await getManyTransactionById({
    id: payments.map((pay) => pay.bpay_metadata.id),
  });

  if (!transactions.status) {
    return (
      <div>
        <h2>no offer</h2>
      </div>
    );
  }

  const audit = await fetchAuditByOmieCode(codigo_pedido_omie);

  const installments = offer.pedido_venda_produto.lista_parcelas?.parcela.map(
    (installent) => {
      const payment = payments.filter(
        (payment) =>
          payment.omie_metadata.numero_parcela === installent.numero_parcela
      );

      const transactions_id = payment.map(
        (payment) => payment.bpay_metadata.id
      );

      const bpay_transaction =
        transactions.status && transactions.transactions
          ? transactions?.transactions.filter((transaction) =>
              transactions_id.includes(transaction._id)
            )
          : undefined;

      return {
        ...installent,
        bpay_transaction, // ### fazer request no micro serviço bpay para ter acesso a essas trasanções
        payment,
        omie_enterprise,
        codigo_pedido_omie,
        omie_client: client,
      };
    }
  );

  const shipping = transactions?.transactions
    ?.filter((transaction) => {
      const payment = payments.filter(
        (payment) => String(payment.group) === String(codigo_pedido_omie)
      );

      const transactions_id = payment.map(
        (payment) => payment.bpay_metadata.id
      );

      return transactions_id.includes(transaction._id);
    })
    .map((transaction) => {
      const payment = payments.filter(
        (payment) => String(payment.group) === String(codigo_pedido_omie)
      );
      return {
        ...transaction,
        payment,
      };
    });

  const revalidateInstallment = revalidateInstallmentOffer.bind(
    null,
    `offer/${omie_enterprise}/${codigo_cliente_omie}/${codigo_pedido_omie}`
  );

  // const generateOmieInvoiceBinded = generateOmieInvoice.bind(null, {
  //   codigo_pedido: Number(codigo_pedido_omie),
  //   codigo_cliente: Number(codigo_cliente_omie),
  //   omie_enterprise: omie_enterprise,
  // });

  const openModal = () => {
    return `/offer/${omie_enterprise}/${codigo_cliente_omie}/${codigo_pedido_omie}?modalIsOpen=true`;
  };

  return (
    <div className="min-h-full">
      <main className="flex-1 pb-8 container">
        {/* Page header */}
        <PageHeader
          pageTitle="Pedido"
          description="Visualizar dados do pedido."
        >
          {offer.pedido_venda_produto.cabecalho.etapa === "60" ? (
            <Badge label="Pedido Faturado" theme="green" />
          ) : (
            // <form action={generateOmieInvoiceBinded}>
            //   <Button type="submit">Faturar Pedido</Button>
            // </form>
            <></>
          )}
          <BackButton>
            <span className="flex space-x-2 items-center">
              <ArrowLeftIcon className="h-3 w-3" />
              Voltar
            </span>
          </BackButton>
          <div className="flex space-x-3 md:ml-4 md:mt-0">
            <form action={revalidateInstallment}>
              <Button type="submit">Revalidar</Button>
            </form>
          </div>
        </PageHeader>

        {audit && (
          <Alert
            title="Uma das cobranças foi gerada com erro"
            subtitle="Você irá precisar efetuar a cobrança manualmente abaixo."
            variant="error"
            className="text-sm my-4"
          />
        )}

        <section className="grid grid-cols-6 gap-2 mt-4">
          <div className="col-span-4 space-y-2">
            <Surface>
              <SurfaceHeader>
                <h1 className="font-medium">Cliente Omie</h1>
              </SurfaceHeader>

              <div className="grid grid-cols-2 gap-4 p-4">
                <LabelValue
                  label="Nome fantasia"
                  value={client?.nome_fantasia}
                />
                <LabelValue label="Razão social" value={client?.razao_social} />
                <LabelValue label="CNPJ/CPF" value={client?.cnpj_cpf} />
                <LabelValue label="CEP" value={client?.cep} />
                <LabelValue label="Email" value={client?.email} />
                <LabelValue
                  label="Telefone 1"
                  value={
                    client?.telefone1_ddd
                      ? `(${client?.telefone1_ddd}) ${client?.telefone1_numero}`
                      : undefined
                  }
                />
              </div>
            </Surface>
          </div>
          <div className="col-span-2">
            <Surface>
              <SurfaceHeader>
                <h1 className="font-medium">Dados Empresa Omie</h1>
              </SurfaceHeader>

              <div className="grid grid-cols-2 gap-4 p-4">
                <LabelValue label="Empresa" value={omie_enterprise} />
                <LabelValue
                  label="Número do pedido"
                  value={offer.pedido_venda_produto.cabecalho.numero_pedido}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4">
                <LabelValue label="Código pedido" value={codigo_pedido_omie} />
                <LabelValue
                  label="Código cliente"
                  value={codigo_cliente_omie}
                />
              </div>
            </Surface>
            <Surface className="mt-2">
              <SurfaceHeader>
                <h1 className="font-medium">Cobrança do Frete</h1>
              </SurfaceHeader>

              <div className="grid grid-cols-1 gap-4 p-4">
                {shipping?.length ? (
                  <div className="flex justify-between">
                    {shipping.some((el) => el.finish === true) ? (
                      <Badge size="sm" label={"Paga"} theme={"green"} />
                    ) : (
                      <Badge size="sm" label={"Processando"} theme={"yellow"} />
                    )}
                    <Link
                      href={`/payment/shipment/${shipping?.[0].payment?.[0].group}`}
                    >
                      <Button size="sm" variant="outline">
                        Ver transação
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link href={openModal()}>
                    <Button type="button">Abrir modal</Button>
                  </Link>
                )}
              </div>
            </Surface>
          </div>
        </section>
        <section className="space-y-4 mt-8">
          <h1 className="text-lg font-bold text-gray-900">Parcelas</h1>
          <ClientOfferInstallmentTable
            installments={installments}
            client={client}
            isInvoiced={offer.pedido_venda_produto.cabecalho.etapa === "60"}
          />
        </section>
      </main>
      <DueShipmentModal
        client={client}
        codigo_cliente_omie={codigo_cliente_omie}
        codigo_pedido_omie={codigo_pedido_omie}
        omie_enterprise={OmieEnterpriseEnum[omie_enterprise]}
      />
    </div>
  );
}
