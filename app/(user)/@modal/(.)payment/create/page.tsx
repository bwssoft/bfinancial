import { PaymentCreateFormProvider } from "@/app/ui/form/payment-create/form-provider";
import { Modal } from "@/app/ui/modal";

export default function Example() {
  return (
    <Modal
      panelContainerClassname="!h-full !justify-end"
      panelClassName="w-full lg:max-w-6xl !h-full"
      title="Crie um pagamento"
    >
      <PaymentCreateFormProvider />
    </Modal>
  );
}
