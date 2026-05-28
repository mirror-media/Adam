import React, { useEffect } from 'react'
import { GlobalStyles } from '../styles/global-styles'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo/apollo-client'
import { GTM_ID } from '../config/index.mjs'
import WholeSiteScript from '../components/whole-site-script'
import UserBehaviorLogger from '../components/shared/user-behavior-logger'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { MembershipProvider } from '../context/membership'
import { Provider } from 'react-redux'
import store from '../store'

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

  // PromoteTopic is loaded as a client-only dynamic component from _app, so it
  // also runs through AMP routes. Next.js can emit client-only fallback markers
  // such as `<template data-dgst="DYNAMIC_SERVER_USAGE">` during AMP SSR, which
  // invalidates AMP pages.
  const isAmpPage =
    pathname.startsWith('/story/amp/') || pathname.startsWith('/external/amp/')

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
              {!isAmpPage && <PromoteTopic />}
            </ThemeProvider>
          </Provider>
        </ApolloProvider>
      </MembershipProvider>
    </>
  )
}

export default MyApp
