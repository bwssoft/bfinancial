'use client';

import { OmieClientResponse } from "@/app/@shared/interfaces/services/@shared";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";


type ActionHandlePage = 'Next' | 'Before';

type IFunctionPaginate = {
  [key in ActionHandlePage]: () => void;
}

export const useClient = (data: OmieClientResponse) => {
  const [currentPage, setCurrentPage] = useState(1);

  const functionPaginate: IFunctionPaginate = {
    Next: () => {
      const maxPage = data.total_de_paginas;

      if(currentPage === maxPage) {
        setCurrentPage(1);
        return;
      }

      const newPage = (currentPage + 1);
      setCurrentPage(newPage);
    },
    Before: () => {

      if(currentPage === 1) {
        setCurrentPage(data.total_de_paginas);
        return;
      }

      const newPage = (currentPage - 1);
      setCurrentPage(newPage);
    }
  }

  const onHandlePage = (action: ActionHandlePage) => {
    functionPaginate[action]();
  }

  return {
    onHandlePage
  }
}