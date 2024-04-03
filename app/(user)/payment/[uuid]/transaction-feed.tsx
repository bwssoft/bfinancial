"use client";

import { cn } from "@/app/utils/cn";
import { BPayTransaction } from "@/app/lib/definitions/BPayTransaction";
import { Button } from "@/app/ui/button";
import {
  XMarkIcon,
  MinusIcon,
  CalendarIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { ReactNode } from "react";
interface TransactionFeedProps {
  transactions: BPayTransaction[];
}

interface TransactionStatus {
  text: string;
  icon: any;
  iconBackground: string;
}

const transactionStatus = {
  0: {
    text: "Transação liquidada",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  1: {
    text: "Transação expirou",
    icon: XMarkIcon,
    iconBackground: "bg-gray-500",
  },
  2: {
    text: "Transação pendente",
    icon: MinusIcon,
    iconBackground: "bg-yellow-500",
  },
  3: {
    text: "Processando transação",
    icon: MinusIcon,
    iconBackground: "bg-yellow-500",
  },
  4: {
    text: "Cancelada",
    icon: XMarkIcon,
    iconBackground: "bg-red-500",
  },
  5: {
    text: "Cartorio",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  6: {
    text: "Agendada para",
    icon: CalendarIcon,
    iconBackground: "bg-blue-500",
  },
  7: {
    text: "Creditada",
    icon: MinusIcon,
    iconBackground: "bg-gray-500",
  },
  8: {
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
  const localeConfig:Intl.DateTimeFormatOptions = {
    day:'2-digit',
    month:'2-digit',
    year:'numeric',
    hour:'2-digit',
    minute:'2-digit'
  }
  function convertExpiration(tra:BPayTransaction){
    const expiresIn = new Date(tra.createdAt) 
    expiresIn.setDate(expiresIn.getDate()+1)
    
    return expiresIn.toLocaleDateString('pt-BR',localeConfig)
  }

  return (
    <ul role="list" className="-mb-8 w-full">
      {transactions.map((transaction, index) => {
        const status = transaction.status;

        let badge: TransactionStatus;

        if (transaction.finish) {
          badge = {
            text: "Pagamento efetuado",
            icon: CheckIcon,
            iconBackground: "bg-green-500",
          };
        } else {
          badge = {
            text: transactionStatus?.[status]?.text,
            icon: transactionStatus?.[status]?.icon ?? MinusIcon,
            iconBackground:
              transactionStatus?.[status]?.iconBackground ?? "bg-gray-500",
          };
        }

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
                      {badge.text}

                      {status === 2 && !transaction.finish && (
                        <>
                        <Button
                          onClick={() => handlePixCodeCopy(transaction)}
                          size="sm"
                          variant="outline"
                          >
                          Copiar código
                        </Button>
                        
                        <Button
                          size="sm"
                          variant='secondary'
                          disabled
                        >
                          {`Expira em ${convertExpiration(transaction)}`}
                        </Button>
                        </>
                        
                      )}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time
                      dateTime={
                        new Date(transaction.createdAt)?.toLocaleDateString('pt-BR',localeConfig) ?? new Date().toLocaleDateString('pt-BR',localeConfig)
                      }
                    >
                      {new Date(transaction.createdAt)?.toLocaleDateString('pt-BR',localeConfig)}
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
