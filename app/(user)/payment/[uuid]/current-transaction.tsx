"use client";

import { useToast } from "@/app/hook/use-toast";
import { BPayTransaction } from "@/app/lib/definitions/BPayTransaction";
import { Button } from "@/app/ui/button";
import { cn } from "@/app/utils/cn";

interface CurrentTransactionProps {
  transaction: BPayTransaction | null;
  qrCodeUrl: string | undefined;
  action: (formData: FormData) => Promise<void>;
}

export function CurrentTransaction({ transaction, qrCodeUrl, action }: CurrentTransactionProps) {
  const { toast } = useToast();

  const handlePixCodeCopy = () => {
    if (transaction) {
      navigator.clipboard.writeText(transaction?.bb?.pixCopyPaste);
      alert("Pix copiado com sucesso!");
    }
  };

  async function handleAction(formData: FormData) {
    try {
      await action(formData);

      toast({
        title: "Sucesso!",
        description: "Cobrança enviada com sucesso!",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "error",
      });
    }
  }

  if (!transaction || transaction.finish) return null;

  return (
    <div className={cn("bg-white border shadow-sm sm:overflow-hidden sm:rounded-lg")}>
      <div className="divide-y divide-gray-200">
        <div className="p-4">
          <h2 id="notes-title" className="text-lg font-medium text-gray-900">
            Pix atual
          </h2>
        </div>
      </div>
      <div className="border-t gap-4 flex flex-col items-center justify-center p-4 w-full">
        <img src={qrCodeUrl} className="border p-2 rounded-sm" />
        <Button asChild>
          <a href={qrCodeUrl} download target="_blank">
            Baixar QRCode
          </a>
        </Button>
      </div>
      <div className="border-t gap-2 inline-flex items-center justify-between p-4 w-full">
        <Button className="w-full" onClick={handlePixCodeCopy} variant="outline">
          Copiar Código
        </Button>
        <form action={handleAction}>
          <Button className="w-full" type="submit" variant="outline">
            Enviar cobrança
          </Button>
        </form>
      </div>
      <div className="border-t gap-2 inline-flex p-4 w-full">
        <span className="truncate text-sm">{transaction?.bb?.pixCopyPaste}</span>
      </div>
    </div>
  );
}
