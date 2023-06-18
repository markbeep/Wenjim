"use client";

import "../styles/globals.css";
import ThemeProvider from "../components/themeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
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
            <Notifications position="top-right" autoClose={8_000} />
            <NavigationProgress />
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
