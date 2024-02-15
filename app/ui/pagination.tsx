"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "../lib/cn";

type PaginationDesktopProps = {
  totalPage?: number;
  totalRegister?: number;
  className?: string;
}

type PaginationActions = "previous" | "next";

type PaginationActionFunction = {
  [key in PaginationActions]: () => void;
};

export function Pagination({ 
  totalPage = 0, 
  totalRegister = 0, 
  className 
}: PaginationDesktopProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("pagina") || 1);

  const handleSearch = useDebouncedCallback((page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pagina", page);
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const paginationActions: PaginationActionFunction = {
    next: () => {
      const maxPage = totalPage;
      if (currentPage === maxPage) {
        return handleSearch("1");
      }

      handleSearch((currentPage + 1).toString())
    },
    previous: () => {
      if (currentPage === 1) {
        return handleSearch(totalPage?.toString() || "1")
      }

      handleSearch((currentPage - 1).toString());
    }
  }

  function handlePaginationPress(action: PaginationActions) {
    paginationActions[action]();
  }

  return (
    <nav
      className={
        cn("flex items-center rounded-b-lg justify-between border-gray-200 bg-white px-4 py-3 sm:px-6", className)
      }
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Pagina <span className="font-medium">{currentPage}</span> de{" "}
          <span className="font-medium">{totalPage}</span>
          <span className="text-xs ml-5 text-gray-400">
            {totalRegister} resultados
          </span>
        </p>
      </div>
      <div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
        <button
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
          onClick={() => handlePaginationPress("previous")}
        >
          Anterior
        </button>
        <button
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
          onClick={() => handlePaginationPress("next")}
        >
          Próximo
        </button>
      </div>
    </nav>
  )
}