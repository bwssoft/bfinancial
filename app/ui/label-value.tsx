import { cva, type VariantProps } from "class-variance-authority"
import { ComponentProps } from "react";
import { cn } from "../lib/cn";

const labelValueStyles = cva(
  "text-sm",
  {
    variants: {
      type: {
        inline: 'flex items-center justify-between',
        column: 'flex flex-col'
      }
    },
    defaultVariants: {
      type: 'column'
    }
  }
)

export interface LabelValueProps extends ComponentProps<'div'>, VariantProps<typeof labelValueStyles> {
  label: string;
  value: string | undefined;
}

export function LabelValue({ label, value, type, className, ...rest }: LabelValueProps) {
  return (
    <div 
      className={
        cn(labelValueStyles({ type, className }))
      }
      {...rest}
    >
      <p className="font-medium text-gray-500">{label}</p>
      <span className="mt-1 text-gray-900">{value ?? '--'}</span>
    </div>
  )
}