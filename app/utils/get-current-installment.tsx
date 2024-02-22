import { OmieOfferInstallment } from "../lib/definitions/OmieOffer";

export function getCurrentInstallment(installments: OmieOfferInstallment[]) {
  const currentDate = new Date();

  const isInstallmentDateValid = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const installmentDate = new Date(year, month - 1, day);
    return installmentDate.getTime() >= currentDate.getTime();
  };

  for (const installment of installments) {
    if (isInstallmentDateValid(installment.data_vencimento)) return installment;
  }

  return installments[installments.length - 1];
}