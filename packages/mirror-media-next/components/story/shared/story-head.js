import Head from 'next/head'
import { SITE_URL } from '../../../config/index.mjs'
import { getActiveOrderCategory, getActiveOrderSection } from '../../../utils'
import Script from 'next/script'
// import Script from 'next/script'
/**
 * @typedef {Object} Section
 * @property {string} slug
 * @property {string} name
 */

/**
 * @typedef {import('../../../apollo/fragments/post').Post } PostData
 */

/**
 * @typedef {import('../../../apollo/fragments/category').Category} Category
 */

/**
 * @param {PostData} postData
 */
const generateMetaData = (postData) => {
  const {
    slug = '',
    isAdult = false,
    tags = [],
    publishedDate = '',
    isAdvertised = false,
    sections = [],
    sectionsInInputOrder = [],
    state = 'draft',
    isMember = false,
    categories = [],
    categoriesInInputOrder = [],
    writers = [],
    writersInInputOrder = [],
    topics = null,
  } = postData

  const robots = isAdult ? 'noindex' : 'index'
  const nonAmpUrl = `https://${SITE_URL}/story/${slug}`
  const ampUrl = `https://${SITE_URL}/story/amp/${slug}`
  const shouldCreateAmpHtmlLink = state === 'published' && !isAdvertised
  const tagsNameStr = tags.map((tag) => tag.name).join(', ')
  const sectionsWithOrdered = getActiveOrderSection(
    sections,
    sectionsInInputOrder
  )
  const categoriesWithOrdered = getActiveOrderCategory(
    categories,
    categoriesInInputOrder
  )
  const section = isMember
    ? { name: '會員專區', slug: 'member' }
    : sectionsWithOrdered?.[0]
  const category = categoriesWithOrdered?.[0]
  const topicSlug = topics?.slug ?? ''
  const writersWithOrdered =
    writersInInputOrder && writersInInputOrder.length
      ? writersInInputOrder
      : writers
  const hasWriter = writersWithOrdered && writersWithOrdered.length

  const authorName = hasWriter ? writersWithOrdered?.[0].name : '鏡週刊'
  return {
    slug,
    robots,
    nonAmpUrl,
    ampUrl,
    shouldCreateAmpHtmlLink,
    tagsNameStr,
    section,
    category,
    topicSlug,
    authorName,
    publishedDate,
  }
}

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @returns
 */
export default function StoryHead({ postData }) {
  const {
    slug,
    robots,
    nonAmpUrl,
    ampUrl,
    shouldCreateAmpHtmlLink,
    tagsNameStr,
    section,
    category,
    topicSlug,
    authorName,
    publishedDate,
  } = generateMetaData(postData)

  return (
    <>
      <Head>
        <meta name="robots" content={robots} key="robots" />
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
        {category?.name && (
          <meta
            property="category:name"
            content={category.name}
            key="category:name"
          />
        )}
        <meta name="author" content={authorName} key="author"></meta>
        {topicSlug !== '' && (
          <meta name="topic-id" content={topicSlug} key="topic-id" />
        )}
        {section?.name && (
          <meta
            property="article:section"
            content={section.name}
            key="article:section"
          />
        )}
        <meta
          property="article:author"
          content={authorName}
          key="article:author"
        ></meta>
        <meta
          property="article:published_time"
          content={publishedDate}
          key="article:published_time"
        />
        {tagsNameStr !== '' && (
          <meta
            property="article:tag"
            content={tagsNameStr}
            key="article:tag"
          />
        )}

        {tagsNameStr !== '' && (
          <meta name="keywords" content={tagsNameStr} key="keywords" />
        )}
        {tagsNameStr !== '' && (
          <meta
            name="news_keywords"
            content={tagsNameStr}
            key="news_keywords"
          />
        )}
      </Head>

      <Script
        id="test-google-tag-ad"
        dangerouslySetInnerHTML={{
          __html: `
          window.googletag = window.googletag || {cmd: []};
          googletag.cmd.push(function() {
            googletag.defineOutOfPageSlot('/40175602/test_mirror_m_ros_out_ADBRO', 'div-gpt-ad-1710755205915-0').addService(googletag.pubads());
            googletag.defineOutOfPageSlot('/40175602/test_mirror_pc_ros_out_ADBRO', 'div-gpt-ad-1710755093650-0').addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
        `,
        }}
      />
    </>
  )
}
