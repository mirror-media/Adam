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
 * @param {Object} props
 * @param {OGProperties} props.properties
 * @returns
 */
const OpenGraph = ({ properties }) => {
  const {
    locale = 'zh_TW',
    url,
    site_name,
    title,
    type = 'website',
    description,
    image,
    card = 'summary_large_image',
    fbAppId,
    fbPageId,
  } = properties

  return (
    <>
      <meta property="og:locale" content={locale || 'zh_TW'} key="og:locale" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} key="og:type" />
      <meta
        property="og:description"
        content={description || ''}
        key="og:description"
      />
      <meta property="og:site_name" content={site_name} key="og:site_name" />
      {image && (
        <>
          <meta property="og:image" content={image.url} key="og:image" />
          <meta
            property="og:image:secure_url"
            content={image.url.replace('http://', 'https://')}
            key="og:image:secure_url"
          />
          <meta
            property="og:image:width"
            content={image.width}
            key="og:image:width"
          />
          <meta
            property="og:image:height"
            content={image.height}
            key="og:image:height"
          />
          <meta
            property="og:image:type"
            content={image.type}
            key="og:image:type"
          />
          <meta name="twitter:image" content={image.url} key="twitter:image" />
        </>
      )}
      <meta property="fb:app_id" content={fbAppId} />
      <meta property="fb:pages" content={fbPageId} />
      <meta name="twitter:card" content={card} key="twitter:card" />
      <meta name="twitter:url" content={url} key="twitter:url" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description || ''}
        key="twitter:description"
      />
    </>
  )
}

/**
 * @typedef {Object} HeadProps
 * @property {string} [title] - head title used to setup title other title related meta
 * @property {string} [description] - head description used to setup description related meta
 * @property {string} [imageUrl] - image url used to setup image related meta
 */

/**
 * @param {HeadProps} props
 * @returns
 */
export default function CustomHead(props) {
  const router = useRouter()
  const siteInformation = {
    title: props.title ? `${props.title} - ${SITE_TITLE}` : SITE_TITLE,
    description:
      props.description ??
      '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。',
    site_name: SITE_TITLE,
    url: SITE_URL + router.asPath,
    type: 'website',
    image: {
      width: '1200',
      height: '630',
      type: 'images/png',
      url: props.imageUrl ?? `https://${SITE_URL}/images/default-og-img.png`,
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
      <OpenGraph properties={siteInformation} />
      <meta name="application-name" content={siteInformation.title} />
    </Head>
  )
}
