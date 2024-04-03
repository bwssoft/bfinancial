import { ComponentProps } from "react";
import { cn } from "../utils/cn";

interface LabelProps extends ComponentProps<"label"> {}

export function Label({ className, ...rest }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-gray-900 mb-1", className)}
      {...rest}
    />
  );
}
