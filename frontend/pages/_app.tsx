import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ThemeProvider, { ThemeContext, useTheme } from '../context/themeProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { NotificationsProvider } from '@mantine/notifications'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider position='top-right' autoClose={false}>
          <Component {...pageProps} />

          <ReactQueryDevtools initialIsOpen={false} />
        </NotificationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp
