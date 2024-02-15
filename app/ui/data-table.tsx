"use client"
 
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { ReactNode } from "react";
import { useMediaQuery } from "@/app/hook/use-media-query";
 
interface DataTableDesktopProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowPress?(data: TData): void;
}
 
export function DataTableDesktop<TData, TValue>({
  columns,
  data,
  onRowPress = undefined
}: DataTableDesktopProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
 
  return (
    <div>
      <div className="rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`bg-white ${onRowPress !== undefined && 'hover:bg-gray-100 cursor-pointer'}`}
                  onClick={() => onRowPress && onRowPress(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface DataTableMobileProps<TData> {
  data: TData[];
  mobileKeyExtractor(data: TData): string;
  mobileDisplayValue(data: TData): string | ReactNode;
  onRowPress?(data: TData): void;
}

export function DataTableMobile<TData>({
  data,
  mobileKeyExtractor,
  mobileDisplayValue,
  onRowPress
}: DataTableMobileProps<TData>) {
  return (
    <ul
      role="list"
      className="mt-2 rounded-t-lg divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
    >
      {data.map((row) => (
        <li 
          key={mobileKeyExtractor(row)}
          onClick={() => onRowPress && onRowPress(row)} 
          className="flex justify-between items-center px-3 py-4 bg-white text-sm" 
        >
          {mobileDisplayValue(row)}
          <ChevronRightIcon
            className="h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  )
}

type DataTableProps<TData, TValue> = DataTableDesktopProps<TData, TValue> & DataTableMobileProps<TData>  

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DataTableDesktop {...props} />
  }

  return <DataTableMobile {...props} />
} 
