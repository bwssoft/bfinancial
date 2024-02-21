"use client"

import { cn } from "@/app/lib/cn";
import { Button } from "@/app/ui/button";

interface CurrentTransactionProps {
  pixCopyPaste?: string;
}

export function CurrentTransaction({ pixCopyPaste }: CurrentTransactionProps) {

  const handlePixCodeCopy = () => {
    if (pixCopyPaste) {
      navigator.clipboard.writeText(pixCopyPaste);
      alert('Pix copiado com sucesso!')
    }
  }

  if (!pixCopyPaste) return null;

  return (
    <div className={
      cn(
        "bg-white border shadow-sm sm:overflow-hidden sm:rounded-lg",
      )
    }>
      <div className="divide-y divide-gray-200">
        <div className="p-4">
          <h2
            id="notes-title"
            className="text-lg font-medium text-gray-900"
          >
            Pix atual
          </h2>
        </div>
      </div>
      <div className="border-t text-sm gap-2 inline-flex items-center justify-between p-4 w-full">
        <span className="flex-1 truncate">
          {pixCopyPaste}
        </span>
        <Button onClick={handlePixCodeCopy} variant="outline">
          Copiar
        </Button>
      </div>
    </div>
  )
}