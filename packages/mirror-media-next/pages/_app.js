import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from 'styled-components'

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
              <PromoteTopic />
            </ThemeProvider>
          </Provider>
        </ApolloProvider>
      </MembershipProvider>
    </>
  )
}

export default MyApp
