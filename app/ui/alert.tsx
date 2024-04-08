import { cn } from "@/app/utils/cn";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

const alertVariants = cva("flex border w-full items-center rounded-md shadow", {
  variants: {
    borderless: {
      true: "ring-0 ring-transparent",
      false: "ring-1 ring-inset",
    },
    variant: {
      info: "border-blue-100 bg-blue-50 text-blue-700 ring-blue-300",
      warning: "border-yellow-100 bg-yellow-50 text-yellow-700 ring-yellow-300",
      error: "border-red-100 bg-red-50 text-red-700 ring-red-300",
      success: "border-green-100 bg-green-50 text-green-700 ring-green-300",
    },
    size: {
      sm: "text-sm gap-3 py-3 px-4",
      base: "text-md gap-4 p-4",
      xs: "text-xs gap-3 py-2 px-3",
    },
  },
  defaultVariants: {
    size: "base",
    variant: "info",
  },
});

type AlertVariantProps = VariantProps<typeof alertVariants>;

interface Props extends AlertVariantProps, ComponentProps<"div"> {
  title: string;
  subtitle?: string;
}

export function Alert({
  title,
  subtitle,
  variant = "info",
  size = "base",
  className,
  borderless = true,
  children,
}: Props) {
  const iconSize = {
    sm: "h-5 w-5",
    xs: "h-4 w-4",
    base: "h-5 w-5",
  };

  const sizeClassname = size ? iconSize[size] : iconSize["base"];

  const icon = {
    info: <InformationCircleIcon className={sizeClassname} />,
    warning: <ExclamationTriangleIcon className={sizeClassname} />,
    success: <CheckCircleIcon className={sizeClassname} />,
    error: <XCircleIcon className={sizeClassname} />,
  };

  return (
    <div
      className={cn(
        alertVariants({
          className,
          variant,
          size,
          borderless,
        })
      )}
    >
      <div className="mt-0.5">{icon[variant ?? "info"]}</div>

      <div className="flex flex-col flex-1">
        <span className="font-medium leading-5 text-sm">{title}</span>
        {subtitle && <p className="text-sm">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}
