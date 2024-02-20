"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, AutocompleteResponse } from "@/app/ui/autocomplete";
import { Button } from "@/app/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { enterprises } from "../clients/filter";
import { useDebouncedCallback } from "use-debounce";

export function PaymentTableFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChangeEnterprise = useDebouncedCallback((enterprise: string) => {
    const params = new URLSearchParams(searchParams);
    if (enterprise) {
      params.set("omie_enterprise", enterprise);
    } else {
      params.delete("omie_enterprise");
    }
    replace(`${pathname}?${params.toString()}`);
  });

  return (
    <form className="inline-flex items-center my-4 gap-2">
      <div className="w-64">
        <Autocomplete
          placeholder="Filtrar empresa"
          options={enterprises.map((enterprise) => ({
            label: enterprise.name,
            value: enterprise.id,
          }))}
          onChange={(newValue) => {
            const option = newValue as AutocompleteResponse<string>;
            handleChangeEnterprise(option?.value);
          }}
        />
      </div>
    </form>
  );
}
