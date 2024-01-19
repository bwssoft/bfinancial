import { BanknotesIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { TableFooter } from "@/app/ui/table-footer";
import { fetchPayments } from "@/app/lib/actions";
import { Table } from "@/app/ui/table";
import { formatPriceFromCents, formatShortDate } from "@/app/utils/formatters";
import Link from "next/link";
import { Breadcrumbs } from "@/app/ui/breadcrumbs";
import { PaymentTable } from "@/app/ui/tables/PaymentTable";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
  canceled: "bg-red-100 text-red-800",
};

export default async function Example() {
  const payments = await fetchPayments();

  return (
    <>
      <div className="min-h-full">
        <main className="flex-1 pb-8">
          <Breadcrumbs
            linkRoot="/"
            breadcrumbs={[
              {
                name: "Pagamentos",
                href: "/payment",
              },
            ]}
          />
          {/* Page header */}
          <div className="mt-8 bg-white shadow">
            <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="min-w-0 flex-1">
                  {/* Profile */}
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                        Pagamentos
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Exportar
                  </button>
                  <Link
                    href={`/payment/create`}
                    className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                  >
                    Novo Pagamento
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PaymentTable 
              payments={payments}
            />
          </div>
        </main>
      </div>
    </>
  );
}
