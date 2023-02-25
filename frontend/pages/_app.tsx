import "../styles/globals.css";
import type { AppProps } from "next/app";
import ThemeProvider from "../context/themeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NotificationsProvider } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import React, { useEffect, useState } from "react";
import Shell from "../components/shell";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider position="top-right" autoClose={8_000}>
          <NavigationProgress />
          <Shell>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </Shell>
        </NotificationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
