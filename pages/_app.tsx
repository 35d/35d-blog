import Router, { useRouter } from 'next/router'

import React from 'react'
import 'react-medium-image-zoom/dist/styles.css'
import Breadcrumbs from '../components/Breadcrumbs'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'
import * as gtag from '../lib/gtag'
import '../styles.css'

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

const App = ({ Component, pageProps }) => {
  const router = useRouter()

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-wrap items-start overflow-hidden">
      <Navigation />
      <main className="w-full sm:w-3/4 ml-0 sm:ml-1/4 min-h-screen">
        <Breadcrumbs route={router.route} />
        <Component {...pageProps} className="w-full sm:w-3/4 sm:-mt-1 ml-0 sm:ml-1/4" />
      </main>
      <Footer />
    </div>
  )
}

export default App
