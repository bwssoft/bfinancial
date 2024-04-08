"use client";
import { useToast } from "@/app/hook/use-toast";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Payment } from "@/app/lib/definitions/Payment";
import { Button } from "@/app/ui/button";
import { DueCreateForm } from "@/app/ui/form/due-create/due-create";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/ui/popover";

interface NewTransactionFormProps {
  client: OmieClientModel | null;
  payment: Payment;
  action: (params: { payment: Payment }, form: FormData) => Promise<void>;
}

export function NewTransactionForm({ client, payment, action }: NewTransactionFormProps) {
  const { toast } = useToast();

  async function handleAction(form: FormData) {
    try {
      const createDueFromPaymentBinded = action.bind(null, {
        payment,
      });

      await createDueFromPaymentBinded(form);

      toast({
        title: "Sucesso!",
        description: "Nova cobrança efetuada com sucesso!",
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

  if (!client) return null;

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button type="button">Efetuar nova cobrança</Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 space-y-4 mx-4">
          <DueCreateForm client={client} action={handleAction} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
