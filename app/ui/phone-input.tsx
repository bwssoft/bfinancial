import * as React from "react";

import { cn } from "@/app/utils/cn";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  value?: string;
  onChange?: (data: { masked: string; unmasked: string }) => void;
}

type PhoneFormat = {
  placeholder: string;
  prefix: string;
  regex: RegExp;
  format: (phoneNumber: string) => string;
  fullFormat: (phoneNumber: string) => string;
  length: number;
};

export type CountryCodes = "BR" | "US" | "CN" | "ES" | "UK";

const phoneFormats: { [countryCode in CountryCodes]: PhoneFormat } = {
  BR: {
    placeholder: "(XX) XXXXX-XXXX",
    regex: /(\d{2})(\d{5})(\d{4})/,
    fullFormat: (phoneNumber: string) =>
      phoneNumber
        .replace(/(\d{2})(\d)/, "+$1 $2")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2"),
    format: (phoneNumber: string) =>
      phoneNumber.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2"),
    prefix: "+55",
    length: 19,
  },
  US: {
    placeholder: "(XXX) XXX-XXXX",
    regex: /(\d{3})(\d{3})(\d{4})/,
    fullFormat: (phoneNumber: string) =>
      phoneNumber
        .replace(/(\d{1})(\d)/, "+$1 $2")
        .replace(/(\d{3})(\d)/, "($1) $2")
        .replace(/(\d{3})(\d)/, "$1-$2"),
    format: (phoneNumber: string) =>
      phoneNumber.replace(/(\d{3})(\d)/, "($1) $2").replace(/(\d{3})(\d)/, "$1-$2"),
    prefix: "+1",
    length: 17,
  },
  CN: {
    placeholder: "XXXX XXXX XXXX",
    regex: /(\d{4})(\d{4})(\d{4})/,
    fullFormat: (phoneNumber: string) =>
      phoneNumber
        .replace(/(\d{2})(\d)/, "+$1 $2")
        .replace(/(\d{4})(\d)/, "$1 $2")
        .replace(/(\d{4})(\d)/, "$1 $2"),
    format: (phoneNumber: string) =>
      phoneNumber.replace(/(\d{4})(\d)/, "$1 $2").replace(/(\d{4})(\d)/, "$1 $2"),
    prefix: "+86",
    length: 18,
  },
  ES: {
    placeholder: "XXX XXX XXX",
    regex: /(\d{3})(\d{3})(\d{3})/,
    fullFormat: (phoneNumber: string) =>
      phoneNumber
        .replace(/(\d{2})(\d)/, "+$1 $2")
        .replace(/(\d{3})(\d)/, "$1 $2")
        .replace(/(\d{3})(\d)/, "$1 $2"),
    format: (phoneNumber: string) =>
      phoneNumber.replace(/(\d{3})(\d)/, "$1 $2").replace(/(\d{3})(\d)/, "$1 $2"),
    prefix: "+34",
    length: 15,
  },
  UK: {
    placeholder: "XXXX XXX XXXX",
    regex: /(\d{4})(\d{3})(\d{4})/,
    fullFormat: (phoneNumber: string) =>
      phoneNumber
        .replace(/(\d{2})(\d)/, "+$1 $2")
        .replace(/(\d{4})(\d)/, "$1 $2")
        .replace(/(\d{3})(\d)/, "$1 $2"),
    format: (phoneNumber: string) =>
      phoneNumber.replace(/(\d{4})(\d)/, "$1 $2").replace(/(\d{3})(\d)/, "$1 $2"),
    prefix: "+44",
    length: 17,
  },
};

const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, onChange, value, ...props }, ref) => {
    const [phone, setPhone] = React.useState<string>(value ? formatPhoneNumber(value) : "+55 ");

    function formatPhoneNumber(phoneNumber: string) {
      const formatData = phoneFormats.BR;

      // Retirando os caracteres especiais pois senao estaremos reaplicando o regex em
      // uma string que ja esta com a mascara aplicada
      const barePhoneNumber = phoneNumber
        .replace(`${formatData.prefix}`, "")
        .replace(/[^0-9]/g, "");

      return `${formatData.prefix} ${formatData.format(barePhoneNumber)}`;
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      setPhone(formattedPhoneNumber);

      onChange?.({
        masked: formattedPhoneNumber,
        unmasked: e.target.value,
      });
    }

    React.useEffect(() => {
      if (value) {
        const formattedValue = formatPhoneNumber(value);
        setPhone(formattedValue);
      } else {
        setPhone("+55 ");
      }
    }, [value]);

    return (
      <div className="flex flex-col">
        {label && <label className="text-sm font-medium text-gray-900 mb-1">{label}</label>}

        <input
          type={type}
          className={cn(
            "w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            className
          )}
          maxLength={phoneFormats.BR.length}
          onChange={handleOnChange}
          ref={ref}
          value={phone}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
