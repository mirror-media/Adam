import Head from 'next/head'
import { GlobalStyles } from '../styles/global-styles'
import Script from 'next/script'
import { initGA, logPageView } from '../utils/programmable-search/analytics'
import { useRouter } from 'next/router'
import { GA_TRACKING_ID } from '../config'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    initGA()
    // `routeChangeComplete` won't run for the first page load unless the query string is
    // hydrated later on, so here we log a page view if this is the first render and
    // there's no query string
    if (!router.asPath.includes('?')) {
      logPageView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
        <title>鏡週刊 Mirror Media</title>
        <meta
          name="description"
          content="鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
