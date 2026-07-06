import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import isPropValid from '@emotion/is-prop-valid'
import { StyleSheetManager, ThemeProvider } from 'styled-components'

import client from '../apollo/apollo-client'
import UserBehaviorLogger from '../components/shared/user-behavior-logger'
import WholeSiteScript from '../components/whole-site-script'
import { GTM_ID } from '../config/index.mjs'
import { MembershipProvider } from '../context/membership'
import store from '../store'
import { GlobalStyles } from '../styles/global-styles'
import { theme } from '../styles/theme'

const PromoteTopic = dynamic(() => import('../components/promote-topic'), {
  ssr: false,
})

// styled-components v6 forwards every prop to the DOM (v5 filtered automatically),
// leaking style-only props and triggering React "unknown prop" warnings. Restore v5
// filtering globally during the v6 migration, until components move to transient ($) props.
const shouldForwardProp = (propName, target) =>
  typeof target === 'string' ? isPropValid(propName) : true

const styleSheetManagerProps = {
  shouldForwardProp,
  // Preserve v5 automatic vendor prefixing until browser support policy is revised.
  enableVendorPrefixes: true,
}

/**
 *
 * @param {Object} props
 * @param {React.ElementType} props.Component
 * @param {Object} props.pageProps
 * @param {Object[]} props.sectionsData
 * @param {Object[]} props.topicsData
 * @returns {React.ReactElement}
 */
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { pathname } = router
  const isStoryPage = pathname.startsWith('/story/')

  //Temporarily enable google tag manager only in dev and local environment.
  useEffect(() => {
    import('react-gtm-module').then(({ default: TagManager }) => {
      TagManager.initialize({ gtmId: GTM_ID })
    })
  }, [])

  // The service worker is bundled into public/sw.js by the `build:sw` script
  // (esbuild) and registered manually here, replacing the auto-registration
  // that the removed next-pwa dependency used to inject at build time.
  // Skipped outside production to keep next-pwa's old semantics: `pnpm dev`
  // does not generate sw.js, and an active worker would interfere with
  // local development.
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return
    }

    const swUrl = `${router.basePath || ''}/sw.js`
    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error('Failed to register service worker.', error)
    })
  }, [router.basePath])

  return (
    <>
      <GlobalStyles />
      <MembershipProvider>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <StyleSheetManager {...styleSheetManagerProps}>
              <ThemeProvider theme={theme}>
                {/* some script may need member type to decide render or not,
           make sure the WholeSiteScript component is placed inside contextProvider or other provider  */}
                <WholeSiteScript />
                {/* Since user behavior log need member info, make sure the
            UserBehaviorLogger component is placed inside contextProvider or
            other provider */}
                {/* Story page has its own UserBehaviorLogger.
            In order to avoiding send log repeatedly, make sure not add UserBehaviorLogger components here when at story page. */}
                {!isStoryPage && <UserBehaviorLogger />}
                <Component {...pageProps} />
                <PromoteTopic />
              </ThemeProvider>
            </StyleSheetManager>
          </Provider>
        </ApolloProvider>
      </MembershipProvider>
    </>
  )
}

export default MyApp
