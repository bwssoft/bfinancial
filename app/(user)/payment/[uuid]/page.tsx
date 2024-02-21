import {
  fetchNote,
  fetchPaymentById,
  getManyTransactionById,
} from "@/app/lib/actions";
import { NoteCreateFrom } from "@/app/ui/form/note-create";
import { NoteCard } from "./note-card";
import { LabelValue } from "@/app/ui/label-value";
import { TransactionFeed } from "./transaction-feed";
import { BackButton } from "@/app/ui/back-button";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { CurrentTransaction } from "./current-transaction";

const user = {
  name: "Whitney Francis",
  email: "whitney@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
};

export default async function PaymentDetailsPage({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const [comments, payment] = await Promise.all([
    fetchNote(params.uuid),
    fetchPaymentById(params.uuid),
  ]);

  const { transactions } = await getManyTransactionById({
    id: [payment?.bpay_transaction_id ?? ""],
  });

  const currentTransaction = transactions?.[0] ?? null;

  return (
    <div className="min-h-full">
      <header className="mb-4">
        <BackButton>
          <ArrowLeftIcon className="h-3 w-3" />
          Voltar
        </BackButton>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
          Visualizando um pagamento
        </h1>
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
                <LabelValue label="Protocolo" value={payment?.uuid} />
                <LabelValue
                  label="Valor total"
                  value={`R$${payment?.price.toString()}`}
                />
                <LabelValue
                  label="(OMIE) Cód. cliente"
                  value={payment?.omie_metadata.codigo_cliente?.toString()}
                />
                <LabelValue
                  label="(OMIE) Cód. pediddo"
                  value={payment?.omie_metadata.codigo_pedido?.toString()}
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
                        id: user.name,
                        imageUrl: user.imageUrl,
                        name: user.name,
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
          <CurrentTransaction transaction={currentTransaction} />

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
