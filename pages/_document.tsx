import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <script
            data-ad-client="ca-pub-6440039437376764"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
        </Head>
        <body
          className="p-[5%] pt-10 sm:pt-40 bg-gray-200 dark:bg-gray-800 font-normal text-gray-700 dark:text-gray-300 antialiased leading-relaxed sm:leading-relaxed transition-colors text-sm sm:text-base
        
        "
        >
          <div className="w-full max-w-3xl mx-auto flex flex-wrap items-start">
            <Main />
            <NextScript />
          </div>
        </body>
      </Html>
    )
  }
}

export default MyDocument
