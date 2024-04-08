"use client";

import { useToast } from "@/app/hook/use-toast";
import { createPaymentFromOfferPage } from "@/app/lib/actions";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { Button } from "../../button";
import { DueCreateForm } from "../../form/due-create/due-create";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { OmieInstallmentTable } from "./columns";
interface ClientOfferColumn {
  data: OmieInstallmentTable;
  client: OmieClientModel;
}

export function ClientOfferActionColumn({ data, client }: ClientOfferColumn) {
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
      const [day, month, year] = data.data_vencimento.split("/");

      const expirationDate = new Date();

      expirationDate.setDate(Number(day));
      expirationDate.setMonth(Number(month));
      expirationDate.setMonth(Number(year));

      const createPaymentFromOfferPageBinded = createPaymentFromOfferPage.bind(null, {
        omie_enterprise: installment.omie_enterprise!,
        codigo_pedido_omie: installment.codigo_pedido_omie!,
        omie_client: installment.omie_client!,
        installment,
        expiration: differenceInSeconds(expirationDate, new Date()),
      });

      await createPaymentFromOfferPageBinded(form);

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
    <div>
      <Popover>
        <PopoverTrigger>
          <Button type="button" size="sm">
            Cobrar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 space-y-4">
          <DueCreateForm client={client} action={handleAction} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
