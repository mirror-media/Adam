import { SITE_URL } from '../../../config/index.mjs'
import { SITE_TITLE, SITE_DESCRIPTION } from '../../../constants/index'
import {
  changeUtcToGmtTimeStamp,
  extractArticleBody,
} from '../../../utils/story'

/**
 * @typedef {import('../../../apollo/fragments/post').Post } PostData
 */

/**
 *
 * @param {PostData} postData
 * @param {'/story/' | '/story/amp/'} currentPage
 * @returns {Object[]}
 */
export const generateJsonLdsData = (postData, currentPage) => {
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
    isMember = false,
    tags = [],
    trimmedContent = null,
    content = null,
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
    datePublished: changeUtcToGmtTimeStamp(publishedDate),
    dateModified: changeUtcToGmtTimeStamp(updatedAt),
    author: hasWriter
      ? writersWithOrdered.map((writer) => ({
          '@type': 'Person',
          name: writer.name,
          url: `${SITE_URL}/author/${writer.id}/`,
        }))
      : {
          '@type': 'Organization',
          name: SITE_TITLE,
          url: SITE_URL,
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
    isAccessibleForFree: 'True',
    keywords: tags?.map((tag) => tag.name),
    articleBody: isMember
      ? extractArticleBody(trimmedContent)
      : extractArticleBody(content),
  }
  if (isMember) {
    jsonLdNewsArticle.hasPart = {
      '@type': 'WebPageElement',
      isAccessibleForFree: 'False',
      cssSelector: '.paywall',
    }
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
        item: `https://${SITE_URL}`,
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
