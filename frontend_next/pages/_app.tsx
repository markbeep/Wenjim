import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ThemeProvider, { useTheme } from '../context/themeProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const { theme } = useTheme()
  return (
    <ThemeProvider>
      {/* <html data-theme={theme}> */}
      <Component {...pageProps} />
      {/* </html> */}
    </ThemeProvider>
  )
}

export default MyApp
