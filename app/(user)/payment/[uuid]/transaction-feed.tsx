"use client";

import { cn } from "@/app/lib/cn";
import { BPayTransaction } from "@/app/lib/definitions/BPayTransaction";
import { Button } from "@/app/ui/button";
import { XMarkIcon, MinusIcon, CalendarIcon } from "@heroicons/react/20/solid";

interface TransactionFeedProps {
  transactions: BPayTransaction[];
}

const transactionStatus = {
  LIQUIDADO: {
    text: "Transação liquidada",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  VENCIDO: {
    text: "Transação expirou",
    icon: XMarkIcon,
    iconBackground: "bg-gray-500",
  },
  PENDENTE: {
    text: "Transação pendente",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  PROCESSANDO: {
    text: "Processando transação",
    icon: MinusIcon,
    iconBackground: "bg-yellow-500",
  },
  CANCELADO: {
    text: "Cancelada",
    icon: XMarkIcon,
    iconBackground: "bg-red-500",
  },
  CARTORIO: {
    text: "Cartorio",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  AGENDADO: {
    text: "Agendada para",
    icon: CalendarIcon,
    iconBackground: "bg-blue-500",
  },
  CREDITADO: {
    text: "Creditada",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  "PARCIALMENTE CREDITADO": {
    text: "Parcialmente creditada",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
};

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  const handlePixCodeCopy = (transaction: BPayTransaction) => {
    navigator.clipboard.writeText(transaction?.bb?.pixCopyPaste);
    alert("Pix copiado com sucesso!");
  };

  return (
    <ul role="list" className="-mb-8 w-full">
      {transactions.map((transaction, index) => {
        const status = transaction.status;

        const badge = {
          icon: transactionStatus?.[status]?.icon ?? MinusIcon,
          iconBackground:
            transactionStatus?.[status]?.iconBackground ?? "bg-gray-500",
        };

        const description =
          transactionStatus?.[status]?.text ?? "Status não identificado";

        return (
          <li key={transaction._id}>
            <div className="relative pb-8">
              {index !== transactions.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      badge.iconBackground,
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                    )}
                  >
                    <badge.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-between space-x-4"
                  )}
                >
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {description}

                      {status === "PENDENTE" && (
                        <Button
                          onClick={() => handlePixCodeCopy(transaction)}
                          size="sm"
                          variant="outline"
                        >
                          Copiar código
                        </Button>
                      )}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time
                      dateTime={
                        transaction.createdAt?.toISOString() ?? new Date()
                      }
                    >
                      {transaction.createdAt?.toISOString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
