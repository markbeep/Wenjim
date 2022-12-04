import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ThemeProvider from '../context/themeProvider'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { NotificationsProvider } from '@mantine/notifications'
import Shell from '../components/shell'
import { NavigationProgress } from '@mantine/nprogress'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider position='top-right' autoClose={8_000}>
          <NavigationProgress />
          <Shell>
            <Component {...pageProps} />
          </Shell>
          <ReactQueryDevtools initialIsOpen={false} />
        </NotificationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp
