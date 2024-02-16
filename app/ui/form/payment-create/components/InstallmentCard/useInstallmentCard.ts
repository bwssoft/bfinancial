import { OmieOfferInstallment } from "@/app/lib/definitions/OmieOffer";
import { usePaymentCreateForm } from "../../form-provider"

export const useInstallmentCard = () => {

  const { setValue, setCurrentInstallment } = usePaymentCreateForm();

  const onHandleClick = (data: OmieOfferInstallment) => {
    const inputValue = document.querySelector('[name="price"]')
    if(inputValue){
      inputValue.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }
    setValue('price', Number(data.valor))
    setCurrentInstallment(data);
  } 

  return {
    onHandleClick
  }
}