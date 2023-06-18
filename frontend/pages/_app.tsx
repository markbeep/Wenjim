import "../styles/globals.css";
import type { AppProps } from "next/app";
import ThemeProvider from "../context/themeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import React, { useState } from "react";
import Shell from "../components/shell";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications position="top-right" autoClose={8_000} />
        <NavigationProgress />
        <Shell>
          <Head>
            <title>Wenjim | ASVZ Data & Graphs</title>
          </Head>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Shell>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
