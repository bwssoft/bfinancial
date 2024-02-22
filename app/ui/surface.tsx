import { ComponentProps } from "react";
import { cn } from "../lib/cn";

interface SurfaceProps extends ComponentProps<"section"> {}

function Surface({ className, ...rest }: SurfaceProps) {
  return (
    <section
      className={cn(
        "bg-white border shadow-sm sm:overflow-hidden sm:rounded-lg",
        className
      )}
      {...rest}
    />
  );
}

interface SurfaceHeaderProps extends ComponentProps<"div"> {}

function SurfaceHeader({ className, ...rest }: SurfaceHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-b-gray-200 p-4",
        className
      )}
      {...rest}
    />
  );
}

interface SurfaceFooterProps extends ComponentProps<"div"> {}

function SurfaceFooter({ className, ...rest }: SurfaceFooterProps) {
  return (
    <div
      className={cn(
        "border-t border-t-gray-200 bg-gray-50",
        className
      )}
      {...rest}
    />
  );
}

export { Surface, SurfaceHeader, SurfaceFooter };
