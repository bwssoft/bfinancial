import { BanknotesIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { TableFooter } from "@/app/ui/table-footer";
import Link from "next/link";
import { Table } from "@/app/ui/table";
import { fetchClients } from "@/app/lib/actions";
import { formatPriceFromCents, formatShortDate } from "@/app/utils/formatters";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
  canceled: "bg-red-100 text-red-800",
};

export default async function Example() {
  const clients = await fetchClients();

  return (
    <>
      <div className="min-h-full">
        
      </div>
    </>
  );
}
