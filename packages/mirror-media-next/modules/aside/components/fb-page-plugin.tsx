import Script from 'next/script'

const FB_SDK_URL =
  'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v25.0'
const FB_PAGE_URL = 'https://www.facebook.com/mirrormediamg'

/**
 * @see https://developers.facebook.com/docs/plugins/page-plugin/
 */
type FbPagePluginProps = {
  width?: number
}

export function FbPagePlugin({ width = 424 }: FbPagePluginProps) {
  return (
    <>
      <Script
        crossOrigin="anonymous"
        src={FB_SDK_URL}
        strategy="lazyOnload"
        nonce="SMSY4ynQ"
      />
      <section className="hidden w-full text-center legacy-md:block">
        {/*
         * TODO: 每個用到 FB plugin 的元件都各自渲染一份 `#fb-root`，同一頁出現兩份就會 id 重複，
         * 之後可思考到 `_document` 統一處理。目前放在 section 內是為了不讓它佔掉 <aside> 的一個 flex item。
         */}
        <div id="fb-root" />
        <div
          className="fb-page"
          data-href={FB_PAGE_URL}
          data-tabs="timeline"
          data-small-header={false}
          data-adapt-container-width={true}
          data-hide-cover={false}
          data-show-facepile={true}
          data-lazy={true}
          data-width={width}
        >
          <blockquote cite={FB_PAGE_URL} className="fb-xfbml-parse-ignore">
            <a href={FB_PAGE_URL}>鏡週刊</a>
          </blockquote>
        </div>
      </section>
    </>
  )
}
