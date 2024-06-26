import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { OmieOfferInstallment } from "@/app/lib/definitions/OmieOffer";
import { Payment } from "@/app/lib/definitions/Payment";
import { Badge, BadgeThemes } from "@/app/ui/badge";
import { formatPrice } from "@/app/utils/formatters";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import { ClientOfferActionColumn } from "./action-column";

type InstallmentStatusBadges = {
  [key: string]: {
    label: string;
    color: BadgeThemes;
  };
};

const installmentStatusBadges: InstallmentStatusBadges = {
  PROCESSANDO: {
    label: "Processando",
    color: "yellow",
  },
  DEFERIDO: {
    label: "Paga",
    color: "green",
  },
  PENDENTE: {
    label: "Pendente",
    color: "gray",
  },
};

export type OmieInstallmentTable = OmieOfferInstallment & {
  bpay_transaction?: { finish: boolean; _id: string }[];
  payment?: Payment[];
  omie_enterprise?: OmieEnterpriseEnum;
  codigo_pedido_omie?: string;
  omie_client?: OmieClientModel;
};

export interface GetInstallmentColumnsParams {
  client: OmieClientModel;
  isInvoiced: boolean;
  paymentCreated: {
    active: boolean;
    installment: OmieInstallmentTable | undefined;
  };
}

export function getInstallmentColumns({
  client,
  paymentCreated,
  isInvoiced,
}: GetInstallmentColumnsParams): ColumnDef<OmieInstallmentTable>[] {
  return [
    { header: "Índice", accessorKey: "numero_parcela" },
    { header: "Vencimento", accessorKey: "data_vencimento" },
    {
      header: "Valor",
      accessorKey: "valor",
      cell: ({ row }) => {
        const installment = row.original;
        return (
          <span className="flex flex-1 space-x-2 truncate">
            <BanknotesIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
            <p className="truncate text-gray-500 group-hover:text-gray-900">
              {formatPrice(installment.valor)}
            </p>
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "cabecalho.etapa",
      cell: ({ row }) => {
        const bpay_transaction = row.original.bpay_transaction;
        const status = !bpay_transaction?.length
          ? "PENDENTE"
          : bpay_transaction?.some((transaction) => transaction.finish)
          ? "DEFERIDO"
          : "PROCESSANDO";
        const label = installmentStatusBadges[status]?.label;
        const theme = installmentStatusBadges[status]?.color;
        return <Badge size="sm" label={label} theme={theme} />;
      },
    },
    {
      header: "Ação",
      accessorKey: "cabecalho.etapa",
      cell: ({ row }) => (
        <ClientOfferActionColumn
          data={row.original}
          client={client}
          paymentCreated={paymentCreated}
          isInvoiced={isInvoiced}
        />
      ),
    },
  ];
}
