"use client";

import type React from "react";
import "@/app/globals.css";
import { Inter, Work_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AccountSidebar } from "@/components/Sidebar"; // Import the sidebar
import { SidebarProvider } from "@/components/ui/sidebar"; // Import the provider
import { useIsExpanded } from "@/lib/atom";

const inter = Work_Sans({ subsets: ["latin"] });

export default function DashboardLayout({
  // Renamed for clarity
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isExpanded, setIsExpanded] = useIsExpanded();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SidebarProvider>
            <div className="absolute top-0 left-0 h-full">
              <AccountSidebar />
              <main
                className={` bg-gray-50 dark:bg-gray-900 ${
                  isExpanded ? "ml-64" : "ml-20"
                }`}
              >
                {" "}
                {/* Ensure main content takes remaining space */}
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
