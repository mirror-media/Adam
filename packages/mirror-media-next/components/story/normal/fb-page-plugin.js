//See Doc: https://developers.facebook.com/docs/plugins/page-plugin/

//TODO: refactor to a custom hook for loading facebook page plugin in different component
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const FB_SDK_URL = 'https://connect.facebook.net/zh_TW/sdk.js'
const FB_PAGE_URL = 'https://www.facebook.com/mirrormediamg'

/** @typedef {import('../../../type/theme').Theme} Theme */

const Wrapper = styled.div`
  display: none;
  text-align: center;
  height: 500px;
  ${
    /**
     * @param {Object} param
     * @param {Theme} param.theme
     */
    ({ theme }) => theme.breakpoint.md
  } {
    display: block;
  }
`

function insertRootDiv() {
  if (document.getElementById('fb-root')) {
    return
  }
  const fbRoot = document.createElement('div')
  fbRoot.id = 'fb-root'
  document.body.appendChild(fbRoot)
}

async function loadFbSdkNew() {
  if (window.FB) return

  await new Promise((resolve, reject) => {
    const fbSdkScript = document.createElement('script')

    const loadHandler = () => {
      resolve()
      fbSdkScript.removeEventListener('load', loadHandler)
    }
    const errorHandler = (e) => {
      reject(e?.target?.src)
      fbSdkScript.removeEventListener('error', errorHandler)
    }

    fbSdkScript.src = FB_SDK_URL
    fbSdkScript.addEventListener('load', loadHandler)
    fbSdkScript.addEventListener('error', errorHandler)
    document.body.appendChild(fbSdkScript)
  })
  window.FB.init({
    xfbml: true,
    version: 'v16.0',
  })
}

/**
 * @see https://developers.facebook.com/docs/plugins/page-plugin/
 * @param {Object} props
 * @param {Object} [props.facebookPagePluginSetting]
 * - Settings for facebook page plugin, such as `data-tabs`, `data-width`,
 * - see docs https://developers.facebook.com/docs/plugins/page-plugin/ to get more information
 * @returns {JSX.Element}
 */
export default function FbPage({ facebookPagePluginSetting = {} }) {
  const embedRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isLoaded) {
            insertRootDiv()
            loadFbSdkNew()
              .then(() => {
                //parse only the part needed to improve performance
                window.FB.XFBML.parse(embedRef.current)
              })
              .catch((src) => {
                console.warn(`Unable to load facebook SDK script ${src}`)
              })
            setIsLoaded(true)
            observer.unobserve(embedRef.current)
          }
        }
      })
    }
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    })
    observer.observe(embedRef.current)

    return () => observer.disconnect()
  }, [isLoaded])
  return (
    <Wrapper ref={embedRef}>
      <div
        className="fb-page"
        data-href={FB_PAGE_URL}
        data-tabs="timeline"
        data-width=""
        data-height=""
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
        {...facebookPagePluginSetting}
      >
        <blockquote cite={FB_PAGE_URL} className="fb-xfbml-parse-ignore">
          <a href={FB_PAGE_URL}>鏡週刊</a>
        </blockquote>
      </div>
    </Wrapper>
  )
}
