import { Inter } from "next/font/google";
import "@/app/assets/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-bt" className="h-full bg-white">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
