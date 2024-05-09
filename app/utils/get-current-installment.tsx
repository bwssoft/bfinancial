import { OmieOffer, OmieOfferInstallment } from "../lib/definitions/OmieOffer";
import { Payment } from "../lib/definitions/Payment";

export function getCurrentInstallment(payment: Payment, offer: OmieOffer): OmieOfferInstallment {
  if (!payment.omie_metadata.numero_parcela || !payment.omie_metadata.data_vencimento) {
    return formatOfferInstallment(offer?.lista_parcelas.parcela);
  }

  return {
    data_vencimento: payment.omie_metadata.data_vencimento,
    numero_parcela: payment.omie_metadata.numero_parcela,
    percentual: 0,
    quantidade_dias: 0,
    valor: payment.price,
  };
}

function formatOfferInstallment(installments: OmieOfferInstallment[]) {
  const currentDate = new Date();

  const isInstallmentDateValid = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const installmentDate = new Date(year, month - 1, day);
    return installmentDate.getTime() >= currentDate.getTime();
  };

  for (const installment of installments) {
    if (isInstallmentDateValid(installment.data_vencimento)) return installment;
  }

  return installments[installments.length - 1];
}
