import Router from 'next/router'
import React, { useState } from 'react'
import 'react-medium-image-zoom/dist/styles.css'
import { ThemeProvider } from 'styled-components'
import '../styles.css'
import Navigation from '../components/Navigation'
import { darkTheme, lightTheme } from '../constants/Theme'
import * as gtag from '../lib/gtag'

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

export const DarkModeContext = React.createContext({
  theme: undefined,
  toggleDarkMode: undefined,
})

export default ({ Component, pageProps }) => {
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
            <main className="w-full sm:w-3/4 sm:-mt-1 ml-0 sm:ml-1/4">
              <Component {...pageProps} className="w-full sm:w-3/4 sm:-mt-1 ml-0 sm:ml-1/4" />
            </main>
          </div>
        </DarkModeContext.Provider>
      </>
    </ThemeProvider>
  )
}
