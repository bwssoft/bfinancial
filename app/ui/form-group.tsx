import { cn } from "@/app/utils/cn";
import { ComponentProps } from "react";

export interface FormGroupProps extends ComponentProps<"div"> {}

export function FormGroup({ className, ...rest }: FormGroupProps) {
  return <div className={cn("grid w-full items-center gap-1.5", className)} {...rest} />;
}
