import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import ThemeProvider from "../context/themeProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NotificationsProvider } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import React, { useState } from "react";
import Shell from "../components/shell";
import Script from "next/script";
import getConfig from "next/config";
import App from "next/app";
import Head from "next/head";

const { publicRuntimeConfig } = getConfig();

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider position="top-right" autoClose={8_000}>
          <NavigationProgress />
          <Shell>
            <Head>
              <title>Wenjim | ASVZ Data & Graphs</title>
            </Head>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.GOOGLE_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${publicRuntimeConfig.GOOGLE_ID}', {
                  'cookie_flags': 'SameSite=None;Secure'
                });
              `}
            </Script>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </Shell>
        </NotificationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  return { ...appProps };
};

export default MyApp;
