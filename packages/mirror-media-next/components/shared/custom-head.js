import Head from 'next/head'
import { useRouter } from 'next/router'

import { SITE_URL } from '../../config/index.mjs'
import { FB_APP_ID, FB_PAGE_ID, SITE_TITLE } from '../../constants'

/**
 * @typedef {Object} OGProperties
 * @property {string} [locale]
 * @property {string} url
 * @property {string} title
 * @property {string} [ogTitle]
 * @property {string} type
 * @property {string} description
 * @property {string} [ogDescription]
 * @property {string} site_name
 * @property {Object} [image]
 * @property {string} image.type
 * @property {string} image.url
 * @property {string} image.width
 * @property {string} image.height
 * @property {Object} [ogImage]
 * @property {string} ogImage.type
 * @property {string} ogImage.url
 * @property {string} ogImage.width
 * @property {string} ogImage.height
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
 * @property {string} [ogTitle] - head og:title used to setup og:title meta
 * @property {string} [description] - head description used to setup description related meta
 * @property {string} [ogDescription] - head og:description used to setup og:description meta
 * @property {string} [imageUrl] - image url used to setup image related meta
 * @property {string} [ogImageUrl] - head og:image used to setup og:image meta
 * @property {boolean} [skipCanonical] - flag to indicates whether the canonical should be added here
 * @property {'story' | 'external'} [pageType] - pageType for search result navigation in App
 * @property {string} [pageSlug] - set pageSlug with pageType. This is also for search result navigation in App
 * @property {string} [robotsMetaContent] - content for the robots meta tag, e.g. 'noindex, nofollow', controlling search engine indexing and crawling
 */

/**
 * @param {HeadProps} props
 * @returns
 */
export default function CustomHead({
  skipCanonical = false,
  title,
  ogTitle,
  description,
  ogDescription,
  ogImageUrl,
  imageUrl,
  pageType,
  pageSlug,
  robotsMetaContent,
}) {
  const router = useRouter()
  const canonicalLink = skipCanonical
    ? null
    : createCanonicalLink(router.asPath)
  /** @type {OGProperties} */
  const siteInformation = {
    title: title ? `${title} - ${SITE_TITLE}` : SITE_TITLE,
    ogTitle: ogTitle,
    description:
      description ??
      '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。',
    ogDescription,
    site_name: SITE_TITLE,
    url: SITE_URL + router.asPath,
    type: 'website',
    image: {
      width: '1200',
      height: '630',
      type: 'image/png',
      url: imageUrl ?? `https://${SITE_URL}/images-next/default-og-img.png`,
    },
    ogImage: {
      width: '1200',
      height: '630',
      type: 'image/png',
      url:
        ogImageUrl ||
        imageUrl ||
        `https://${SITE_URL}/images-next/default-og-img.png`,
    },
    card: 'summary_large_image',
    fbAppId: FB_APP_ID,
    fbPageId: FB_PAGE_ID,
  }

  return (
    <Head>
      {pageType && imageUrl && (
        <link
          rel="preload"
          as="image"
          href={imageUrl}
          key="image-preload"
          // eslint-disable-next-line react/no-unknown-property
          fetchpriority="high"
        />
      )}
      <title key="title">{siteInformation.title}</title>
      <meta
        name="description"
        content={siteInformation.description}
        key="description"
      />
      {robotsMetaContent && (
        <meta name="robots" content={robotsMetaContent} key="robots" />
      )}
      <meta name="article-description" content={siteInformation.description} />
      {/* <OpenGraph properties={siteInformation} /> */}
      <meta name="application-name" content={siteInformation.title} />
      {canonicalLink}

      <meta property="og:locale" content="zh_TW" key="og:locale" />
      <meta
        property="og:title"
        content={siteInformation.ogTitle || siteInformation.title}
        key="og:title"
      />
      <meta property="og:url" content={'https://' + siteInformation.url} />
      <meta property="og:type" content={siteInformation.type} key="og:type" />
      <meta
        property="og:description"
        content={
          siteInformation.ogDescription || siteInformation.description || ''
        }
        key="og:description"
      />
      <meta
        property="og:site_name"
        content={siteInformation.site_name}
        key="og:site_name"
      />

      {siteInformation.ogImage && (
        <>
          <meta
            property="og:image"
            content={siteInformation.ogImage.url}
            key="og:image"
          />
          <meta
            property="og:image:secure_url"
            content={siteInformation.ogImage.url.replace('http://', 'https://')}
            key="og:image:secure_url"
          />
          <meta
            property="og:image:width"
            content={siteInformation.ogImage.width}
            key="og:image:width"
          />
          <meta
            property="og:image:height"
            content={siteInformation.ogImage.height}
            key="og:image:height"
          />
          <meta
            property="og:image:type"
            content={siteInformation.ogImage.type}
            key="og:image:type"
          />
          <meta
            name="twitter:image"
            content={siteInformation.ogImage.url}
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
          <meta name="image" content={siteInformation?.image?.url} />
        </>
      )}
    </Head>
  )
}
