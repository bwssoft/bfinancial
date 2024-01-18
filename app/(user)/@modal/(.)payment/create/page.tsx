import { PaymentCreateForm } from "@/app/ui/form/payment-create/payment-create";
import { Modal } from "@/app/ui/modal";

export default function Example() {
  return (
    <Modal
      panelContainerClassname="!h-full !justify-end"
      panelClassName="w-full lg:max-w-6xl !h-full"
      title="Crie um pagamento"
    >
      <PaymentCreateForm />
    </Modal>
  );
}
