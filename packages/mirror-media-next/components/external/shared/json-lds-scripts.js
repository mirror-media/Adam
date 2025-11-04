import Script from 'next/script'
import { memo } from 'react'
import { SITE_URL } from '../../../config/index.mjs'
import { changeUtcToGmtTimeStamp } from '../../../utils/story'
import { SITE_DESCRIPTION, SITE_TITLE } from '../../../constants'

/**
 * @typedef {import('../../../apollo/fragments/external').External} External
 * @typedef {'/external/' | '/external/amp/'} CurrentPage
 */

/**
 *
 * @param {External} external
 * @param {CurrentPage} currentPage
 * @returns {Object[]}
 */
const generateJsonLds = (external, currentPage) => {
  const {
    title,
    slug,
    publishedDate,
    updatedAt,
    brief,
    thumb,
    extend_byline,
    partner,
  } = external

  const pageUrl = `https://${SITE_URL}${currentPage}${slug}`
  const imageUrl = thumb || `https://${SITE_URL}/images-next/default-og-img.png`
  const logoUrl = `https://${SITE_URL}/images-next/logo.png`

  const authorName = partner?.name ? partner.name : extend_byline || ''

  // first NewArticle
  const jsonLdNewsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: title,
    image: imageUrl,
    datePublished: changeUtcToGmtTimeStamp(publishedDate),
    dateModified: changeUtcToGmtTimeStamp(updatedAt),
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    description: brief || '',
    url: pageUrl,
    thumbnailUrl: thumb,
    isAccessibleForFree: 'True',
  }

  // second Person
  const jsonLdPerson = partner?.slug
    ? {
        '@context': 'http://schema.org/',
        '@type': 'Person',
        name: authorName,
        url: `${SITE_URL}//externals/${partner?.slug}`,
        brand: {
          '@type': 'Brand',
          name: SITE_TITLE,
          url: SITE_URL,
          image: logoUrl,
          logo: logoUrl,
          description: SITE_DESCRIPTION,
        },
      }
    : undefined

  // third BreadcrumbList
  const jsonLdBreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_TITLE,
        item: `https://${SITE_URL}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: pageUrl,
      },
    ],
  }

  return [jsonLdNewsArticle, jsonLdPerson, jsonLdBreadcrumbList].filter(
    (jLD) => !!jLD
  )
}

/**
 *
 * @param {Object} props
 * @param {External} props.external
 * @param {CurrentPage} props.currentPage
 * @returns
 */
const JsonLdsScript = ({ external, currentPage = '/external/' }) => {
  const jsonLds = generateJsonLds(external, currentPage)
  return jsonLds.map((jsonLd) => {
    return currentPage === '/external/amp/' ? (
      <script
        id={`json-ld-${jsonLd['@type']}`}
        key={`json-ld-${jsonLd['@type']}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    ) : (
      <Script
        id={`json-ld-${jsonLd['@type']}`}
        key={`json-ld-${jsonLd['@type']}`}
        type="application/ld+json"
      >
        {JSON.stringify(jsonLd)}
      </Script>
    )
  })
}

export default memo(JsonLdsScript)
