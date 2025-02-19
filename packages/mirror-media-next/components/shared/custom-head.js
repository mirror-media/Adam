import Head from 'next/head'

import { FB_APP_ID, FB_PAGE_ID, SITE_TITLE } from '../../constants'
import { SITE_URL } from '../../config/index.mjs'
import { useRouter } from 'next/router'

/**
 * @typedef {Object} OGProperties
 * @property {string} [locale]
 * @property {string} url
 * @property {string} title
 * @property {string} type
 * @property {string} description
 * @property {string} site_name
 * @property {Object} [image]
 * @property {string} image.type
 * @property {string} image.url
 * @property {string} image.width
 * @property {string} image.height
 * @property {string} card
 * @property {string} fbAppId
 * @property {string} fbPageId
 */

/**
 * Create canonical link based on router.asPath
 * Since '/story' page and '/story/amp' page has special logic on creating canonical link,
 * we decide not handle canonical link on these page.
 * @param {string} routerAsPath
 * @return {null | React.ReactNode}
 */
const createCanonicalLink = (routerAsPath) => {
  const url = new URL(routerAsPath, 'https://' + SITE_URL)
  url.search = '' //remove query params in url

  return <link rel="canonical" href={url.toString()} key="canonical" />
}

/**
 * @typedef {Object} HeadProps
 * @property {string} [title] - head title used to setup title other title related meta
 * @property {string} [description] - head description used to setup description related meta
 * @property {string} [imageUrl] - image url used to setup image related meta
 * @property {boolean} [skipCanonical] - flag to indicates whether the canonical should be added here
 * @property {'story' | 'external'} [pageType] - pageType for search result navigation in App
 * @property {string} [pageSlug] - set pageSlug with pageType. This is also for search result navigation in App
 */

/**
 * @param {HeadProps} props
 * @returns
 */
export default function CustomHead({
  skipCanonical = false,
  title,
  description,
  imageUrl,
  pageType,
  pageSlug,
}) {
  const router = useRouter()
  const canonicalLink = skipCanonical ? (
    <></>
  ) : (
    createCanonicalLink(router.asPath)
  )
  /** @type {OGProperties} */
  const siteInformation = {
    title: title ? `${title} - ${SITE_TITLE}` : SITE_TITLE,
    description:
      description ??
      '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。',
    site_name: SITE_TITLE,
    url: SITE_URL + router.asPath,
    type: 'website',
    image: {
      width: '1200',
      height: '630',
      type: 'image/png',
      url: imageUrl ?? `https://${SITE_URL}/images-next/default-og-img.png`,
    },
    card: 'summary_large_image',
    fbAppId: FB_APP_ID,
    fbPageId: FB_PAGE_ID,
  }

  return (
    <Head>
      <title key="title">{siteInformation.title}</title>
      <meta
        name="description"
        content={siteInformation.description}
        key="description"
      />
      <meta name="article-description" content={siteInformation.description} />
      {/* <OpenGraph properties={siteInformation} /> */}
      <meta name="application-name" content={siteInformation.title} />
      {canonicalLink}

      <meta property="og:locale" content="zh_TW" key="og:locale" />
      <meta
        property="og:title"
        content={siteInformation.title}
        key="og:title"
      />
      <meta property="og:url" content={'https://' + siteInformation.url} />
      <meta property="og:type" content={siteInformation.type} key="og:type" />
      <meta
        property="og:description"
        content={siteInformation.description || ''}
        key="og:description"
      />
      <meta
        property="og:site_name"
        content={siteInformation.site_name}
        key="og:site_name"
      />

      {siteInformation.image && (
        <>
          <meta
            property="og:image"
            content={siteInformation.image.url}
            key="og:image"
          />
          <meta
            property="og:image:secure_url"
            content={siteInformation.image.url.replace('http://', 'https://')}
            key="og:image:secure_url"
          />
          <meta
            property="og:image:width"
            content={siteInformation.image.width}
            key="og:image:width"
          />
          <meta
            property="og:image:height"
            content={siteInformation.image.height}
            key="og:image:height"
          />
          <meta
            property="og:image:type"
            content={siteInformation.image.type}
            key="og:image:type"
          />
          <meta
            name="twitter:image"
            content={siteInformation.image.url}
            key="twitter:image"
          />
        </>
      )}
      <meta property="fb:app_id" content={siteInformation.fbAppId} />
      <meta property="fb:pages" content={siteInformation.fbPageId} />
      <meta
        name="twitter:card"
        content={siteInformation.card}
        key="twitter:card"
      />
      <meta
        name="twitter:url"
        content={siteInformation.url}
        key="twitter:url"
      />
      <meta
        name="twitter:title"
        content={siteInformation.title}
        key="twitter:title"
      />
      <meta
        name="twitter:description"
        content={siteInformation.description || ''}
        key="twitter:description"
      />
      {pageType && (
        <>
          {/* These metatags are for search result usage */}
          <meta name="page-type" content={pageType} />
          <meta name="page-slug" content={pageSlug} />
          <meta name="page-image" content={siteInformation?.image?.url} />
        </>
      )}
    </Head>
  )
}
