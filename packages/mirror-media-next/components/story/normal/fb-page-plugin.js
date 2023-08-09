import { useEffect, useRef, useState } from 'react'

const FB_SDK_URL = 'https://connect.facebook.net/zh_TW/sdk.js'
const FB_PAGE_URL = 'https://www.facebook.com/mirrormediamg'

/** @typedef {import('../../../type/theme').Theme} Theme */

/**
 * @function
 * Insert div for initializing facebook page plugin.
 */
function insertRootDiv() {
  if (document.getElementById('fb-root')) {
    return
  }
  const fbRoot = document.createElement('div')
  fbRoot.id = 'fb-root'
  document.body.appendChild(fbRoot)
}

/**
 * @async
 * Load script of facebook javascript sdk for initializing facebook page plugin.
 */
async function loadFbSdk() {
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
 * - Settings for facebook page plugin, such as `data-tabs`, `data-width`.
 * - See docs https://developers.facebook.com/docs/plugins/page-plugin/ to get more information
 * @see https://developers.facebook.com/docs/plugins/page-plugin/
 * @typedef {Object} FacebookPagePluginSetting
 * @property {string} [data-href]
 * @property {number} [data-width]
 * @property {number} [data-height ]
 * @property {'timeline' | 'events' | 'messages' } [data-tabs]
 * @property {boolean} [data-hide-cover]
 * @property {boolean} [data-show-facepile]
 * @property {boolean} [data-hide-cta]
 * @property {boolean} [data-small-header]
 * @property {boolean} [data-adapt-container-width]
 * @property {boolean} [data-lazy]
 */

/**
 * @see https://developers.facebook.com/docs/plugins/page-plugin/
 * @param {Object} props
 * @param {FacebookPagePluginSetting} [props.facebookPagePluginSetting]
 * @param {string} [props.className] - Attribute for updating style by styled-component
 * @returns {JSX.Element}
 */
export default function FbPage({
  facebookPagePluginSetting = {},
  className = '',
}) {
  const embedRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isLoaded) {
            insertRootDiv()
            loadFbSdk()
              .then(() => {
                // parse only the part we needed to improve web performance.
                // docs: https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse
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
    <section className={className}>
      <div
        ref={embedRef}
        className="fb-page"
        data-href={FB_PAGE_URL}
        data-tabs="timeline"
        data-small-header={false}
        data-adapt-container-width={true}
        data-hide-cover={false}
        data-show-facepile={true}
        {...facebookPagePluginSetting}
      >
        <blockquote cite={FB_PAGE_URL} className="fb-xfbml-parse-ignore">
          <a href={FB_PAGE_URL}>鏡週刊</a>
        </blockquote>
      </div>
    </section>
  )
}
