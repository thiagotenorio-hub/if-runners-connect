import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IF RUNNERS Connect",
  description: "Sistema web do projeto IF RUNNERS do IFPE Campus Garanhuns"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
