import {
  createDueFromPayment,
  fetchNote,
  fetchPaymentByGroup,
  getManyTransactionById,
  revalidatePaymentPage,
  sendDue,
  generatePayShareLink,
} from "@/app/lib/actions";
import { NoteCreateFrom } from "@/app/ui/form/note-create";
import { NoteCard } from "./note-card";
import { LabelValue } from "@/app/ui/label-value";
import { TransactionFeed } from "./transaction-feed";
import { BackButton } from "@/app/ui/back-button";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { CurrentTransaction } from "./current-transaction";
import { generateQR } from "@/app/utils/qrCode";
import { Button } from "@/app/ui/button";
import { auth } from "@/auth";
import { ShareIcon } from "@heroicons/react/24/outline";
import { GenerateShare } from "./generate-share";

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

  const createTemplateMessageBinded = sendDue.bind(null, {
    telefone: "5527999697185",
    numero_parcela: paymentData?.omie_metadata?.numero_parcela.toString(),
    data_vencimento: paymentData?.omie_metadata?.data_vencimento.toString(),
    pix_copia_e_cola: currentTransaction?.bb.pixCopyPaste!,
  });

  const createDueFromPaymentBinded = createDueFromPayment.bind(null, {
    payment: paymentData,
  });

  const revalidatePaymentPageBinded = revalidatePaymentPage.bind(
    null,
    `/payment/${params.uuid}`
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
            Visualizando um pagamento
          </h1>
        </div>

        <div className="inline-flex items-center gap-2">
          <GenerateShare paymentGroupId={paymentData.group} />

          <form action={revalidatePaymentPageBinded}>
            <Button>Revalidar</Button>
          </form>

          {!hasFinishedTransactions && (
            <form action={createDueFromPaymentBinded}>
              <Button>Efetuar nova cobrança</Button>
            </form>
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
                {/* <LabelValue label="Protocolo" value={currentPayment?.uuid} /> */}
                <LabelValue
                  label="Valor total"
                  value={`R$${paymentData?.price.toString()}`}
                />
                <LabelValue
                  label="(OMIE) Cód. cliente"
                  value={paymentData?.omie_metadata.codigo_cliente?.toString()}
                />
                <LabelValue
                  label="(OMIE) Cód. pediddo"
                  value={paymentData?.omie_metadata.codigo_pedido?.toString()}
                />
                <LabelValue
                  label="(OMIE) N. parcela"
                  value={paymentData?.omie_metadata.numero_parcela?.toString()}
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
