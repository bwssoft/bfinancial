"use client"

import { Button } from "@/app/ui/button"
import { Input } from "@/app/ui/input"

interface CopyQrCodeProps {
  pixCode?: string
}

export function CopyQrCode({pixCode}: CopyQrCodeProps) {
  const onAction = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode); 
      alert("Pix copiado com sucesso!");
    }
  }

  return (
    <form action={onAction} className="inline-flex p-4 border rounded-md items-center w-full gap-2">
      <Input 
        readOnly
        defaultValue={pixCode}
      />
      <Button type="submit" variant="outline">
        Copiar código
      </Button>
    </form>
  )
}