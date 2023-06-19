"use client";

import "../styles/globals.css";
import ThemeProvider from "../components/themeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import React, { useState } from "react";
import Shell from "./shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Shell>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </Shell>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
