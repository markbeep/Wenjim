"use client";

import "../styles/globals.css";
import ThemeProvider from "../components/themeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import React, { useState } from "react";
import Shell from "./shell";
import PlausibleProvider from "next-plausible";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <head>
        <PlausibleProvider
          domain={process.env.HOST ?? ""}
          customDomain="https://plausible.markc.su"
        />
      </head>
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
