import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { DueDetachedForm } from "@/app/ui/form/due-detached";

export default function Example({
  searchParams,
}: {
  searchParams: { omie_enterprise: keyof typeof OmieEnterpriseEnum };
}) {
  const { omie_enterprise } = searchParams;
  return (
    <DueDetachedForm omie_enterprise={OmieEnterpriseEnum[omie_enterprise]} />
  );
}
