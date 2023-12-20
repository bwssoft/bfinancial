import { BanknotesIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { TableFooter } from "@/app/ui/table-footer";
import Link from "next/link";
import { Table } from "@/app/ui/table";
import { fetchOffers } from "@/app/lib/actions";
import { formatPriceFromCents, formatShortDate } from "@/app/utils/formatters";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
  canceled: "bg-red-100 text-red-800",
};

export default async function Example() {
  const offers = await fetchOffers();

  return (
    <>
      <div className="min-h-full">
        <main className="flex-1 pb-8">
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="min-w-0 flex-1">
                  {/* Profile */}
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                        Propostas
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
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                  >
                    Nova Proposta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {/* Activity list (smallest breakpoint only) */}
            <div className="shadow sm:hidden">
              <Table.Mobile
                data={offers}
                lineRender={(d) => (
                  <>
                    <Link
                      href={`/offer/${d.id}`}
                      className="block bg-white px-4 py-4 hover:bg-gray-50"
                    >
                      <span className="flex items-center space-x-4">
                        <span className="flex flex-1 space-x-2 truncate">
                          <BanknotesIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="flex flex-col truncate text-sm text-gray-500">
                            <span className="truncate">{d.client.name}</span>
                            <span>
                              <span className="font-medium text-gray-900">
                                {formatPriceFromCents(d.price)}
                              </span>{" "}
                              BRL
                            </span>
                            <time dateTime={d.created_at.toString()}>
                              {formatShortDate(d.created_at)}
                            </time>
                          </span>
                        </span>
                        <ChevronRightIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </>
                )}
                keyExtractor={(d) => d.id}
              />
              <TableFooter.Mobile />
            </div>

            {/* Activity table (small breakpoint and up) */}
            <div className="hidden sm:block">
              <div className="w-full">
                <div className="mt-2 flex flex-col">
                  <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                    <Table.Desktop
                      header={
                        <thead>
                          <tr>
                            <th
                              className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Cliente
                            </th>
                            <th
                              className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Preço
                            </th>
                            <th
                              className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                              scope="col"
                            >
                              Status
                            </th>
                            <th
                              className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Data
                            </th>
                          </tr>
                        </thead>
                      }
                      lineRender={(d) => (
                        <>
                          <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            <div className="flex">
                              <Link
                                href={`/offer/${d.id}`}
                                className="group inline-flex space-x-2 truncate text-sm"
                              >
                                <BanknotesIcon
                                  className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                <p className="truncate text-gray-500 group-hover:text-gray-900">
                                  {d.client.name}
                                </p>
                              </Link>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                            <span className="font-medium text-gray-900">
                              {formatPriceFromCents(d.price)}
                            </span>
                            BRL
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                            <span
                              className={clsx(
                                statusStyles[
                                  d.status as keyof typeof statusStyles
                                ],
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                              )}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                            <time dateTime={d.created_at.toString()}>
                              {formatShortDate(d.created_at)}
                            </time>
                          </td>
                        </>
                      )}
                      data={offers}
                      keyExtractor={(d) => d.id}
                    />
                    <TableFooter.Desktop />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
