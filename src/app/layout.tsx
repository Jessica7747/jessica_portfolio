import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jessica Liu — Product Designer",
  description:
    "Portfolio of Jessica Gexi Liu, product designer previously at Apple, Google Genkit, and Amazon Web Services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
