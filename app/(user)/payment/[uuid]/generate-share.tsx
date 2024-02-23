"use client";

import { generatePayShareLink } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { ShareIcon } from "@heroicons/react/20/solid";

interface GenerateShareProps {
  paymentGroupId: string;
}

export function GenerateShare({ paymentGroupId }: GenerateShareProps) {
  const onAction = async () => {
    const binded = generatePayShareLink.bind(null, { paymentGroupId });
    const url = await binded();
    navigator.clipboard.writeText(url);
    alert("Link de compartilhamento copiado com sucesso!");
  };

  return (
    <form action={onAction}>
      <Button type="submit" variant="ghost">
        <ShareIcon className="w-4 h-4" />
        Compartilhar
      </Button>
    </form>
  );
}
