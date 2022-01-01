import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useState } from 'react'
import 'react-medium-image-zoom/dist/styles.css'
import { ThemeProvider } from 'styled-components'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'
import { darkTheme, lightTheme } from '../constants/Theme'
import * as gtag from '../lib/gtag'
import '../styles.css'

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

export const DarkModeContext = React.createContext({
  theme: undefined,
  toggleDarkMode: undefined,
})

const Breadcrumbs = ({ route }: { route: string }) => {
  if (route === '/[slug]')
    return (
      <p className="fs-12 mb-2 opacity-80">
        <Link href={'/'} prefetch={false}>
          <span className="mr-2 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer">
            トップ
          </span>
        </Link>
        <span className="mr-2">/</span>
        <Link href={'/posts'} prefetch={false}>
          <span className="mr-2 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer">
            記事一覧
          </span>
        </Link>
      </p>
    )

  return null
}

const App = ({ Component, pageProps }) => {
  const router = useRouter()

  let defaultTheme
  if (process.browser) {
    defaultTheme = window.localStorage.getItem('35d_theme') || 'LIGHT'
  }
  const [theme, setTheme] = useState(defaultTheme)

  const toggleDarkMode = () => {
    if (process.browser) {
      window.localStorage.setItem('35d_theme', theme === 'LIGHT' ? 'DARK' : 'LIGHT')
    }
    theme === 'LIGHT' ? setTheme('DARK') : setTheme('LIGHT')
  }

  return (
    <ThemeProvider theme={theme === 'LIGHT' ? lightTheme : darkTheme}>
      <>
        <DarkModeContext.Provider value={{ theme, toggleDarkMode }}>
          <div className="w-full max-w-3xl mx-auto flex flex-wrap items-start overflow-hidden">
            <Navigation />
            <main className="w-full sm:w-3/4 ml-0 sm:ml-1/4 min-h-screen">
              <Breadcrumbs route={router.route} />
              <Component {...pageProps} className="w-full sm:w-3/4 sm:-mt-1 ml-0 sm:ml-1/4" />
            </main>
            <Footer />
          </div>
        </DarkModeContext.Provider>
      </>
    </ThemeProvider>
  )
}

export default App
