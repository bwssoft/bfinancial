import { Text, TextProps } from "@react-email/components";

interface HeadingProps extends TextProps {
  as?: "h1" | "h2" | "h3";
}

export function Heading({ as = "h1", ...rest }: HeadingProps) {
  const variants = {
    h1: "scroll-m-20 text-4xl font-bold tracking-tight",
    h2: "mt-12 scroll-m-20 border-b border-transparent border-b-gray-300 border-solid pb-2 text-2xl font-semibold tracking-tight first:mt-0",
    h3: "mt-8 scroll-m-20 text-xl font-semibold tracking-tigh",
  };

  return <Text className={variants[as]} {...rest} />;
}
