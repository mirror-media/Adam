import React, { useEffect } from 'react'
import { GlobalStyles } from '../styles/global-styles'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo/apollo-client'
import TagManager from 'react-gtm-module'
import { GTM_ID } from '../config/index.mjs'
import WholeSiteScript from '../components/whole-site-script'
import UserBehaviorLogger from '../components/shared/user-behavior-logger'
import { useRouter } from 'next/router'

import { MembershipProvider } from '../context/membership'
import { Provider } from 'react-redux'
import store from '../store'
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
    TagManager.initialize({ gtmId: GTM_ID })
  }, [])
  return (
    <>
      <GlobalStyles />
      <MembershipProvider>
        <ApolloProvider client={client}>
          <Provider store={store}>
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
            </ThemeProvider>
          </Provider>
        </ApolloProvider>
      </MembershipProvider>
    </>
  )
}

export default MyApp
