import Head from 'next/head'
import { SITE_URL } from '../../../config/index.mjs'

/**
 * @typedef {Object} Section
 * @property {string} slug
 * @property {string} name
 */

/**
 *
 * @param {Object} props
 * @param {string} props.slug
 * @param {Section} props.section
 * @param {boolean} props.shouldCreateAmpHtmlLink
 * @returns
 */
export default function StoryHead({
  slug = '',
  section = { name: '', slug: '' },
  shouldCreateAmpHtmlLink = true,
}) {
  const nonAmpUrl = `https://${SITE_URL}/story/${slug}`
  const ampUrl = `https://${SITE_URL}/story/amp/${slug}`
  return (
    <Head>
      <link rel="canonical" href={nonAmpUrl} key="canonical" />
      {shouldCreateAmpHtmlLink && (
        <link rel="amphtml" href={ampUrl} key="amphtml" />
      )}
      <meta property="dable:item_id" content={slug} key="dable:item_id" />
      <meta property="og:slug" content={slug} key="og:slug" />
      {section?.name && (
        <meta
          property="section:name"
          content={section.name}
          key="section:name"
        />
      )}
      {section?.slug && (
        <meta
          property="section:slug"
          content={section.slug}
          key={'section:slug'}
        />
      )}
    </Head>
  )
}
