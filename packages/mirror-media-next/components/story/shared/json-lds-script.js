import { SITE_URL } from '../../../config/index.mjs'
import { SITE_TITLE, SITE_DESCRIPTION } from '../../../constants/index'
import Script from 'next/script'

/**
 * @typedef {import('../../../apollo/fragments/post').Post } PostData
 */

/**
 *
 * @param {PostData} postData
 * @param {'/story/' | '/story/amp/'} currentPage
 * @returns {Object[]}
 */
const generateJsonLdsData = (postData, currentPage) => {
  const {
    title = '',
    slug = '',
    publishedDate = '',
    sections = [],
    sectionsInInputOrder = [],
    writers = [],
    writersInInputOrder = [],
    updatedAt = '',
    og_description = '',
    brief = { blocks: [], entityMap: {} },
  } = postData

  const writersWithOrdered =
    writersInInputOrder && writersInInputOrder.length
      ? writersInInputOrder
      : writers
  const sectionWithOrdered =
    sectionsInInputOrder && sectionsInInputOrder.length
      ? sectionsInInputOrder
      : sections

  const hasWriter = writersWithOrdered && writersWithOrdered.length
  const hasSection = writersWithOrdered && sectionWithOrdered.length
  const authorName = hasWriter ? writersWithOrdered[0].name : '鏡週刊'
  const description = og_description || brief?.blocks?.[0]?.text || ''
  const pageUrl = `https://${SITE_URL}${currentPage}${slug}`
  const logoUrl = `https://${SITE_URL}/images-next/logo.png`
  const imageUrl =
    postData.og_image?.resized?.original ||
    postData.heroImage?.resized?.original ||
    `https://${SITE_URL}/images-next/default-og-img.png`
  //first NewArticle
  const jsonLdNewsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: title,
    image: imageUrl,
    datePublished: publishedDate,
    dateModified: updatedAt,
    author: {
      '@type': hasWriter ? 'Person' : 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    description,
    url: pageUrl,
    thumbnailUrl: imageUrl,
    articleSection: hasSection ? sectionWithOrdered[0].name : undefined,
  }
  //second Person
  const jsonLdPerson = hasWriter
    ? {
        '@context': 'http://schema.org/',
        '@type': 'Person',
        name: authorName,
        url: `${SITE_URL}/author/${writers[0].id}/`,
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

  //third BreadcrumbList
  const jsonLdBreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: getBreadcrumbListElement(),
  }

  return [jsonLdNewsArticle, jsonLdPerson, jsonLdBreadcrumbList].filter(
    (jsonLd) => jsonLd
  )

  function getBreadcrumbListElement() {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_TITLE,
        item: SITE_URL,
      },
    ]

    if (hasSection) {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: sectionWithOrdered[0].name,
        item: `https://${SITE_URL}/section/${sectionWithOrdered[0].slug}`,
      })
    }

    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: title,
      item: pageUrl,
    })

    return items
  }
}

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @param {'/story/' | '/story/amp/'} props.currentPage
 */
export default function JsonLdsScript({ postData, currentPage = '/story/' }) {
  const jsonLdsData = generateJsonLdsData(postData, currentPage)

  const structuredDataScript = jsonLdsData.map((jsonLd) => {
    // `next/script` is unable to use in amp page
    return currentPage === '/story/amp/' ? (
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

  return structuredDataScript
}
