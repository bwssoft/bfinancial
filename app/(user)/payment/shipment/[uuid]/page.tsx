import {
  createDueFromPaymentShipping,
  fetchNote,
  fetchPaymentByGroup,
  getCachedClient,
  getCachedOffer,
  getManyTransactionById,
  revalidatePaymentPage,
  sendShippingDueFromForm,
} from "@/app/lib/actions";
import { BackButton } from "@/app/ui/back-button";
import { Button } from "@/app/ui/button";
import { NoteCreateFrom } from "@/app/ui/form/note-create";
import { LabelValue } from "@/app/ui/label-value";
import { generateQR } from "@/app/utils/qrCode";
import { auth } from "@/auth";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { GenerateShare } from "../../[uuid]/generate-share";
import { NoteCard } from "../../[uuid]/note-card";
import { TransactionFeed } from "../../[uuid]/transaction-feed";
import { CurrentTransaction } from "../../[uuid]/current-transaction";
import { NewTransactionForm } from "../../[uuid]/new-transaction-form";

export default async function PaymentDetailsPage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const data = await auth();

  const [comments, payment] = await Promise.all([
    fetchNote(params.uuid),
    fetchPaymentByGroup(params.uuid),
  ]);
  const { transactions } = await getManyTransactionById({
    id: payment?.map((pay) => pay.bpay_metadata.id),
  });

  const hasFinishedTransactions = transactions?.some((el) => el.finish);
  const paymentData = payment[0];

  const currentTransaction = transactions?.[0] ?? null;
  const currentTransactionQrcode = currentTransaction
    ? await generateQR(currentTransaction?.bb.pixCopyPaste as string)
    : undefined;

  const createTemplateMessageBinded = sendShippingDueFromForm.bind(null, {
    pix_copia_e_cola: currentTransaction?.bb.pixCopyPaste!,
    payment_group: paymentData.group,
  });

  const [client, offer] = await Promise.all([
    getCachedClient(
      paymentData.omie_metadata.enterprise,
      paymentData.omie_metadata.codigo_cliente.toString()
    ),
    getCachedOffer(
      paymentData.omie_metadata.enterprise,
      Number(paymentData.omie_metadata.codigo_pedido)
    ),
  ]);

  const revalidatePaymentPageBinded = revalidatePaymentPage.bind(
    null,
    `/payment/shipment/${params.uuid}`
  );

  return (
    <div className="min-h-full">
      <header className="mb-4 flex w-full items-center justify-between">
        <div>
          <BackButton>
            <ArrowLeftIcon className="h-3 w-3" />
            Voltar
          </BackButton>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
            Visualizando um pagamento de frete
          </h1>
        </div>

        <div className="inline-flex items-center gap-2">
          <GenerateShare paymentGroupId={paymentData.group} />

          <form action={revalidatePaymentPageBinded}>
            <Button type="submit">Revalidar</Button>
          </form>

          {!hasFinishedTransactions && (
            <NewTransactionForm
              client={client}
              payment={paymentData}
              action={createDueFromPaymentShipping}
            />
          )}
        </div>
      </header>
      <div className="grid grid-cols-2 w-full gap-6">
        <div className="space-y-6">
          {/* Description list*/}
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white border shadow-sm sm:overflow-hidden sm:rounded-lg">
              <div className="border-b">
                <div className="p-4">
                  <h2 className="text-lg font-medium text-gray-900">Dados</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 p-4 gap-2 gap-y-4">
                <LabelValue
                  label="Nome Fantasia do cliente"
                  value={client.nome_fantasia}
                />
                <LabelValue
                  label="Documento do cliente"
                  value={client.cnpj_cpf}
                />
                <LabelValue
                  label="Número do pedido"
                  value={offer.pedido_venda_produto.cabecalho.numero_pedido}
                />
                <LabelValue
                  label="Valor a ser cobrado"
                  value={`R$${paymentData?.price.toString()}`}
                />
                <LabelValue
                  label="Empresa a ser receber"
                  value={paymentData.omie_metadata.enterprise}
                />
              </div>
            </div>
          </section>

          {/* Comments*/}
          <section aria-labelledby="notes-title">
            <div className="bg-white border shadow-sm sm:overflow-hidden sm:rounded-lg">
              <div className="divide-y divide-gray-200">
                <div className="p-4">
                  <h2
                    id="notes-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Anotações
                  </h2>
                </div>
                <div className="p-4">
                  <ul role="list">
                    {comments.map((comment) => (
                      <NoteCard key={comment.uuid} note={comment} />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex space-x-3">
                  <div className="min-w-0 flex-1">
                    <NoteCreateFrom
                      user={{
                        id: data?.user.uuid!,
                        name: data?.user.name!,
                      }}
                      uuid={params.uuid}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-6">
          <CurrentTransaction
            transaction={currentTransaction}
            qrCodeUrl={currentTransactionQrcode}
            action={createTemplateMessageBinded}
            client={client}
          />

          <div className="bg-white border shadow-sm sm:overflow-hidden sm:rounded-lg">
            <div className="divide-y divide-gray-200">
              <div className="p-4">
                <h2
                  id="notes-title"
                  className="text-lg font-medium text-gray-900"
                >
                  Histórico de pix
                </h2>
              </div>
            </div>
            <div className="border-t text-sm gap-2 inline-flex w-full p-4">
              <TransactionFeed transactions={transactions ?? []} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
