"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";

export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        asChild
        onClick={() => {
          router.back();
        }}
      >
        {children}
      </Button>
    </>
  );
}
