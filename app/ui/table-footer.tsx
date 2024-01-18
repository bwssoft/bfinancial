"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Mobile({
    totalPage,
    totalRegister,
}: {
    totalPage?: number;
    totalRegister?: number;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentPage = Number(searchParams.get("pagina") || 1);

    const handleSearch = useDebouncedCallback((page: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("pagina", page);
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const functionPaginate: IFunctionPaginate = {
        Next: () => {
            const maxPage = totalPage;

            if (currentPage === maxPage) {
                handleSearch("1");
                return;
            }

            handleSearch((currentPage + 1).toString());
        },
        Before: () => {
            if (currentPage === 1) {
                handleSearch(totalPage?.toString() || "1");
                return;
            }

            handleSearch((currentPage - 1).toString());
        },
    };

    const onHandlePage = (action: ActionHandlePage) => {
        functionPaginate[action]();
    };

    return (
        <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
            aria-label="Pagination"
        >
            <div className="flex flex-1 justify-between">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Anterior
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Próximo
                </a>
            </div>
        </nav>
    );
}

type ActionHandlePage = "Next" | "Before";

type IFunctionPaginate = {
    [key in ActionHandlePage]: () => void;
};

export function Desktop({
    totalPage,
    totalRegister,
}: {
    totalPage?: number;
    totalRegister?: number;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentPage = Number(searchParams.get("pagina") || 1);

    const handleSearch = useDebouncedCallback((page: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("pagina", page);
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const functionPaginate: IFunctionPaginate = {
        Next: () => {
            const maxPage = totalPage;

            if (currentPage === maxPage) {
                handleSearch("1");
                return;
            }

            handleSearch((currentPage + 1).toString());
        },
        Before: () => {
            if (currentPage === 1) {
                handleSearch(totalPage?.toString() || "1");
                return;
            }

            handleSearch((currentPage - 1).toString());
        },
    };

    const onHandlePage = (action: ActionHandlePage) => {
        functionPaginate[action]();
    };

    return (
        <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
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
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    onClick={() => onHandlePage("Before")}
                >
                    Anterior{" "}
                </a>
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    onClick={() => onHandlePage("Next")}
                >
                    Próximo{" "}
                </a>
            </div>
        </nav>
    );
}

export const TableFooter = {
    Mobile,
    Desktop,
};
