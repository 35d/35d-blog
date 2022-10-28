import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import React from 'react'
import 'react-medium-image-zoom/dist/styles.css'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'
import * as gtag from '../lib/gtag'
import '../styles.css'

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

// TODO: コンポーネントとして切り出し
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
