"use client";
import { useToast } from "@/app/hook/use-toast";
import { Button } from "@/app/ui/button";

interface NewTransactionFormProps {
  action: (params: FormData) => Promise<void>;
}

export function NewTransactionForm({ action }: NewTransactionFormProps) {
  const { toast } = useToast();

  async function handleAction(form: FormData) {
    try {
      await action(form);

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

  return (
    <form action={handleAction}>
      <Button type="submit">Efetuar nova cobrança</Button>
    </form>
  );
}
