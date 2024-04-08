"use client";

import { useToast } from "@/app/hook/use-toast";
import { createPaymentFromOfferPage } from "@/app/lib/actions";
import Link from "next/link";
import { Button } from "../../button";
import { OmieInstallmentTable } from "./columns";
import { differenceInSeconds } from 'date-fns'
interface ClientOfferColumn {
  data: OmieInstallmentTable;
}

export function ClientOfferActionColumn({ data }: ClientOfferColumn) {
  const { toast } = useToast();
  const installment = data;

  const bpay_transaction = data.bpay_transaction;
  if (bpay_transaction?.length) {
    return (
      <Link href={`/payment/${installment.payment?.[0].group}`}>
        <Button size="sm" variant="outline">
          Ver transação
        </Button>
      </Link>
    );
  }

  async function handleAction(form: FormData) {
    try {
      const [day, month, year] = data.data_vencimento.split('/')


      const createPaymentFromOfferPageBinded = createPaymentFromOfferPage.bind(
        form,
        installment.omie_enterprise!,
        installment.codigo_pedido_omie!,
        installment.omie_client!,
        installment,
      );

      const expirationDate = new Date()

      expirationDate.setDate(Number(day))
      expirationDate.setMonth(Number(month))
      expirationDate.setMonth(Number(year))
      
      await createPaymentFromOfferPageBinded(differenceInSeconds(expirationDate, new Date()));

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
      <Button type="submit" size="sm">
        Cobrar
      </Button>
    </form>
  );
}
