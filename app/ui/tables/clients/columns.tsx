import { ColumnDef } from "@tanstack/react-table";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import Link from "next/link";
import { Router } from "next/router";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";

export const columns: ColumnDef<
  OmieClientModel & { omie_enterprise: OmieEnterpriseEnum }
>[] = [
  {
    header: "Docummento",
    accessorKey: "cnpj_cpf",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <Link
          href={`/clients/${client.omie_enterprise}/${client.codigo_cliente_omie}`}
          className="flex flex-1 space-x-2 truncate"
        >
          <p className="truncate text-gray-500 group-hover:text-gray-900">
            {client.cnpj_cpf}
          </p>
        </Link>
      );
    },
  },
  { header: "Nome Fantasia", accessorKey: "nome_fantasia" },
  // { header: "Razão Social", accessorKey: "razao_social" },
  { header: "Contato", accessorKey: "contato" },
  { header: "E-mail", accessorKey: "email" },
];
