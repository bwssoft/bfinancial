import * as React from "react";

import { cn } from "@/app/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label className="text-sm font-medium text-gray-900 mb-1">{label}</label>}

        <input
          type={type}
          className={cn(
            "w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
