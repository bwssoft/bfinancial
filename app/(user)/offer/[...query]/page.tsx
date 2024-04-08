import {
  fetchClientById,
  fetchPayments,
  generateOmieInvoice,
  getCachedOffer,
  getManyTransactionById,
  revalidateInstallmentOffer,
} from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Alert } from "@/app/ui/alert";
import { BackButton } from "@/app/ui/back-button";
import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import { LabelValue } from "@/app/ui/label-value";
import { PageHeader } from "@/app/ui/navigation/page-header";
import { Surface, SurfaceHeader } from "@/app/ui/surface";
import { ClientOfferInstallmentTable } from "@/app/ui/tables/client-offer-installment/table";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

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
    fetchClientById(omie_enterprise, codigo_cliente_omie),
    getCachedOffer(omie_enterprise, codigo_pedido_omie),
    fetchPayments({ "omie_metadata.codigo_pedido": codigo_pedido_omie }),
  ]);

  const transactions = await getManyTransactionById({
    id: payments.map((pay) => pay.bpay_metadata.id),
  });

  if (!offer || !client) {
    return (
      <div>
        <h2>no offer</h2>
      </div>
    );
  }

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

  const revalidateInstallment = revalidateInstallmentOffer.bind(
    null,
    `offer/${omie_enterprise}/${codigo_cliente_omie}/${codigo_pedido_omie}`
  );

  const generateOmieInvoiceBinded = generateOmieInvoice.bind(null, {
    codigo_pedido: Number(codigo_pedido_omie),
    codigo_cliente: Number(codigo_cliente_omie),
    omie_enterprise: omie_enterprise,
  });

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
            <form action={generateOmieInvoiceBinded}>
              <Button type="submit">Faturar Pedido</Button>
            </form>
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

        <Alert
          title="Uma das cobranças foi gerada com erro"
          subtitle="Você irá precisar efetuar a cobrança manualmente abaixo."
          variant="error"
          className="text-sm my-4"
        />

        <section className="grid grid-cols-6 gap-2 mt-4">
          <div className="col-span-4 space-y-2">
            <Surface>
              <SurfaceHeader>
                <h1 className="font-medium">Cliente</h1>
              </SurfaceHeader>

              <div className="grid grid-cols-2 gap-4 p-4">
                <LabelValue
                  label="Nome fantasia"
                  value={client?.nome_fantasia}
                />
                <LabelValue label="Razão social" value={client?.razao_social} />
                <LabelValue label="CNPJ/CPF" value={client?.cnpj_cpf} />
                <LabelValue label="CEP" value={client?.cep} />
                <LabelValue label="Email (OMIE)" value={client?.email} />
                <LabelValue
                  label="Telefone 1 (OMIE)"
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
                <h1 className="font-medium">Dados adicionais</h1>
              </SurfaceHeader>

              <div className="grid grid-cols-1 gap-4 p-4">
                <LabelValue label="Empresa" value={omie_enterprise} />
                <LabelValue
                  label="Código pedido OMIE"
                  value={codigo_pedido_omie}
                />
              </div>
            </Surface>
          </div>
        </section>
        <section className="space-y-4 mt-8">
          <h1 className="text-lg font-bold text-gray-900">Parcelas</h1>
          <ClientOfferInstallmentTable
            installments={installments}
            client={client}
          />
        </section>
      </main>
    </div>
  );
}
