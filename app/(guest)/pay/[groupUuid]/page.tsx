/* eslint-disable @next/next/no-img-element */
import { fetchPaymentByGroup, getManyTransactionById } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { LabelValue } from "@/app/ui/label-value";
import { Surface, SurfaceFooter, SurfaceHeader } from "@/app/ui/surface";
import { generateQR } from "@/app/utils/qrCode";
import { CopyQrCode } from "./copy-qrcode";

interface PageProps {
  params: {
    groupUuid: string;
  };
}

const pixLogoSrc =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/2560px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png";

export default async function PayPage({ params }: PageProps) {
  const payments = await fetchPaymentByGroup(params.groupUuid);

  const { transactions } = await getManyTransactionById({
    id: payments?.map((pay) => pay.bpay_transaction_id),
  });

  const payment = payments?.[0] ?? null;
  const transaction = transactions?.[0] ?? null;
  const qrCodeSrc = transaction ? await generateQR(transaction?.bb.pixCopyPaste) : undefined;

  if (!payment || !transaction) {
    throw new Error("pay-404");
  }

  if (transaction.finish) {
    throw new Error("pay-200");
  }

  return (
    <main className="flex flex-col items-center gap-6">
      <header className="flex justify-center bg-white border-b shadow-sm py-4 w-full">
        <img className="h-10" src={pixLogoSrc} alt="Pix logo" />
      </header>

      <div className="container grid grid-cols-2 gap-6">
        <div>
          <Surface>
            <SurfaceHeader>
              <h1 className="text-lg font-medium">Finalize o pagamento com pix</h1>
            </SurfaceHeader>

            <div className="p-4 text-sm space-y-4">
              <div className="w-full inline-flex items-center justify-center">
                <img
                  src={qrCodeSrc}
                  className="w-[18.125rem] h-[18.125rem] border p-2 rounded-sm"
                  alt="QR code pix"
                />
              </div>

              <div className="flex justify-center">
                <Button asChild>
                  <a href={qrCodeSrc} download target="_blank">
                    Baixar QRCode
                  </a>
                </Button>
              </div>

              <CopyQrCode pixCode={transaction?.bb?.pixCopyPaste} />

              <ol className="list-decimal pl-[1.2em]">
                <li>Acesse o aplicativo do seu banco</li>
                <li>Escolha pagar com pix copia e cola</li>
                <li>Copie e cole o codigo e confirme o pagamento</li>
              </ol>
            </div>
          </Surface>
        </div>
        <div>
          <Surface>
            <SurfaceHeader>
              <h1 className="text-lg font-medium">Resumo do pagamento</h1>
            </SurfaceHeader>

            <div className="p-4 space-y-4">
              <LabelValue
                label="Parcela"
                value={payment?.omie_metadata.numero_parcela?.toString()}
                type="inline"
              />
              <LabelValue label="Vencimento" value="22/02/2024" type="inline" />
            </div>

            <SurfaceFooter className="p-4">
              <LabelValue
                className="text-lg"
                label="Total"
                value={`R$${payment?.price.toString()}`}
                type="inline"
              />
            </SurfaceFooter>
          </Surface>
        </div>
      </div>
    </main>
  );
}
