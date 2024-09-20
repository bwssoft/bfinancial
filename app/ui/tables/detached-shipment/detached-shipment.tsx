"use client";
import { useMediaQuery } from "@/app/hook/use-media-query";
import { Payment } from "@/app/lib/definitions/Payment";
import { useRouter } from "next/navigation";
import { DataTableDesktop } from "../../data-table";
import { detachedShipmentColumns } from "./columns";
import { DetachedShipmentFilter } from "./detached-shipment-filter";

interface DetachedShipmentTableProps {
  detachedShipments: Payment[];
}

export function DetachedShipmentTable({ detachedShipments }: DetachedShipmentTableProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleRowPress(data: Payment) {
    router.push(`/payment/detached-shipment/${data.group}`);
  }

  if (isDesktop) {
    return (
      <section>
        <div className="inline-flex justify-between w-full items-center">
          <DetachedShipmentFilter />
        </div>
        <DataTableDesktop
          data={detachedShipments}
          columns={detachedShipmentColumns}
          onRowPress={handleRowPress}
        />
      </section>
    );
  }

  return <span></span>;
}
