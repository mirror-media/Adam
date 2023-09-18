import Head from 'next/head'
import { GlobalStyles } from '../styles/global-styles'
import { GTM_ID, URL_MIRROR_MEDIA } from '../config'
import { useEffect } from 'react'
import { RedirectUrlContext } from '../context/redirectUrl'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'
import gtag from '../utils/programmable-search/gtag'
import TagManager from 'react-gtm-module'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    gtag.init()
    TagManager.initialize({ gtmId: GTM_ID })
  }, [])

  const getLayout = Component.getLayout || ((page) => page)
  const { redirectUrl } = pageProps

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
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <RedirectUrlContext.Provider value={redirectUrl || URL_MIRROR_MEDIA}>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </RedirectUrlContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
