import React, { useEffect } from 'react'
import { GlobalStyles } from '../styles/global-styles'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo/apollo-client'
import * as gtag from '../utils/gtag'
import TagManager from 'react-gtm-module'
import { GTM_ID } from '../config/index.mjs'
import WholeSiteScript from '../components/whole-site-script'
import Script from 'next/script'

import { MembershipProvider } from '../context/membership'
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
  //Temporarily enable google analytics and google tag manager only in dev and local environment.
  useEffect(() => {
    gtag.init()
    TagManager.initialize({ gtmId: GTM_ID })
  }, [])
  return (
    <>
      <GlobalStyles />
      <MembershipProvider>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            {/* some script may need member type to decide render or not,
           make sure the WholeSiteScript component is placed inside contextProvider or other provider  */}
            <WholeSiteScript />
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </MembershipProvider>
      <Script
        id="comScore"
        dangerouslySetInnerHTML={{
          __html: `var _comscore = _comscore || [];
        _comscore.push({ c1: "2", c2: "24318560" });
        (function() {
        var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
        s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
        el.parentNode.insertBefore(s, el);
        })();`,
        }}
      />
      <noscript
        data-hid="comScoreNoScript"
        dangerouslySetInnerHTML={{
          __html: `<img src="https://sb.scorecardresearch.com/p?c1=2&amp;c2=24318560&amp;cv=3.6.0&amp;cj=1" />`,
        }}
      ></noscript>
    </>
  )
}

export default MyApp
