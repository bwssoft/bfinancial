import {
  fetchClientById,
  fetchPayments,
  getCachedOffer,
  getManyTransactionById,
  revalidateInstallmentOffer,
} from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { BackButton } from "@/app/ui/back-button";
import { Button } from "@/app/ui/button";
import { PageHeader } from "@/app/ui/navigation/page-header";
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

  const installments = offer.pedido_venda_produto.lista_parcelas.parcela.map(
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

  return (
    <div className="min-h-full">
      <main className="flex-1 pb-8">
        {/* Page header */}
        <PageHeader
          pageTitle="Pedido"
          description="Visualizar dados do pedido."
        >
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
        <section>
          {/* TABELA DE PARCELAS */}
          <ClientOfferInstallmentTable installments={installments} />
        </section>
      </main>
    </div>
  );
}
