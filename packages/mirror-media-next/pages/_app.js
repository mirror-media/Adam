import { GlobalStyles } from '../styles/global-styles'
import Layout from '../components/layout'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Layout />

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
