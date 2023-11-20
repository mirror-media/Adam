import Script from 'next/script'

const FB_SDK_URL =
  'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v18.0'
const FB_PAGE_URL = 'https://www.facebook.com/mirrormediamg'

/** @typedef {import('../../../type/theme').Theme} Theme */

/**
 * - Settings for facebook page plugin, such as `data-tabs`, `data-width`.
 * - See docs https://developers.facebook.com/docs/plugins/page-plugin/ to get more information
 * @see https://developers.facebook.com/docs/plugins/page-plugin/
 * @typedef {Object} FacebookPagePluginSetting
 * @property {string} [data-href]
 * @property {number} [data-width]
 * @property {number} [data-height]
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
  return (
    <>
      <div id="fb-root"></div>
      <Script
        crossOrigin="anonymous"
        src={FB_SDK_URL}
        strategy="lazyOnload"
        nonce="SMSY4ynQ"
      ></Script>
      <section className={className}>
        <div
          className="fb-page"
          data-href={FB_PAGE_URL}
          data-tabs="timeline"
          data-small-header={false}
          data-adapt-container-width={true}
          data-hide-cover={false}
          data-show-facepile={true}
          data-lazy={true}
          {...facebookPagePluginSetting}
        >
          <blockquote cite={FB_PAGE_URL} className="fb-xfbml-parse-ignore">
            <a href={FB_PAGE_URL}>鏡週刊</a>
          </blockquote>
        </div>
      </section>
    </>
  )
}
