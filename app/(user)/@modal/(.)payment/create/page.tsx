import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { DueDetachedForm } from "@/app/ui/form/due-detached";
import { Modal } from "@/app/ui/modal";

export default function Example({
  searchParams,
}: {
  searchParams: { omie_enterprise: keyof typeof OmieEnterpriseEnum };
}) {
  const { omie_enterprise } = searchParams;
  return (
    <Modal title="Cobrar Frete">
      <DueDetachedForm omie_enterprise={OmieEnterpriseEnum[omie_enterprise]} />
    </Modal>
  );
}
