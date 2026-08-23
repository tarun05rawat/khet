import type { Metadata } from "next";
import { Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import { FieldSignalsProvider } from "@/components/field-signals/provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "khet",
  description: "Agent-assisted farm operations planning for small growers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} ${geistMono.variable} antialiased`}>
        <FieldSignalsProvider>{children}</FieldSignalsProvider>
      </body>
    </html>
  );
}
