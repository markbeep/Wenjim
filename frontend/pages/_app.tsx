import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ThemeProvider, { useTheme } from '../context/themeProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const { theme } = useTheme()
  return (
    <ThemeProvider>
      <div data-theme={theme}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}

export default MyApp
