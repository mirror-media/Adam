//TODO: add component to add html head dynamically, not jus write head in every pag
import { useState, useEffect } from 'react'
import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import WineWarning from '../../components/shared/wine-warning'
import AdultOnlyWarning from '../../components/story/shared/adult-only-warning'
import { useMembership } from '../../context/membership'
import {
  fetchPostBySlug,
  fetchPostFullContentBySlug,
} from '../../apollo/query/posts'
import StoryNormalStyle from '../../components/story/normal'
import Layout from '../../components/shared/layout'
import {
  convertDraftToText,
  getResizedUrl,
  getCategoryOfWineSlug,
} from '../../utils'
import { handleStoryPageRedirect } from '../../utils/story'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { fetchHeaderDataInPremiumPageLayout } from '../../utils/api'
import { sendGAEvent } from '../../utils/gtag'
import { setPageCache } from '../../utils/cache-setting'

import FullScreenAds from '../../components/ads/full-screen-ads'
const { hasContentInRawContentBlock } = MirrorMedia

const StoryWideStyle = dynamic(() => import('../../components/story/wide'))
const StoryPhotographyStyle = dynamic(() =>
  import('../../components/story/photography')
)
const StoryPremiumStyle = dynamic(() =>
  import('../../components/story/premium')
)
import Image from 'next/image'
import Skeleton from '../../public/images/skeleton.png'

/**
 * @typedef {import('../../components/story/normal').PostData} PostData
 */
/**
 * @typedef {import('../../components/story/normal').PostContent} PostContent
 */

/**
 * @typedef {'style-normal' | 'style-photography' | 'style-wide' | 'style-premium'} StoryLayoutType
 */

const Loading = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: fixed;

  img {
    margin: 0 auto;
  }
`

/**
 *
 * @param {import('../../components/story/normal').PostData['style']} articleStyle
 * @param {import('../../components/story/normal').PostData['isMember']} isMemberOnlyArticle
 * @returns {StoryLayoutType }
 */
const getStoryLayoutType = (articleStyle, isMemberOnlyArticle) => {
  if (articleStyle === 'wide') {
    return 'style-wide'
  } else if (articleStyle === 'photography') {
    return 'style-photography'
  } else if (articleStyle === 'article' && isMemberOnlyArticle === true) {
    return 'style-premium'
  }
  return 'style-normal'
}

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @param {any} props.headerData
 * @param {StoryLayoutType} props.storyLayoutType
 * @returns {JSX.Element}
 */
export default function Story({ postData, headerData, storyLayoutType }) {
  const {
    title = '',
    slug = '',
    isAdult = false,
    categories = [],
    isMember = false,
    content = null,
    trimmedContent = null,
    hiddenAdvertised = false,
  } = postData
  /**
   * The logic for rendering the article content:
   * We use the state `postContent` to manage the content should render in the story page.
   * In most cases, the story page can retrieve the full content of the article.
   * However, if the article is exclusive to members, it is required to get full content by using user's access token, but it is impossible to acquire it at server side.
   * Before the full content is obtained, the truncated content `trimmedContent` will be used as the displayed data.
   * If it didn't obtain the full content, and the user is logged in, story page will try to get the full content again by using the user's access token as the request payload.
   * If successful, the full content will be displayed; if not, the truncated content will still be shown.
   */

  const { isLoggedIn, accessToken } = useMembership()
  /** @type { [PostContent, import('react').Dispatch<PostContent> ]} */

  const [postContent, setPostContent] = useState(
    content
      ? { type: 'fullContent', data: content }
      : { type: 'trimmedContent', data: trimmedContent }
  )

  useEffect(() => {
    if (!content && isLoggedIn) {
      const getFullContent = async () => {
        try {
          const result = await client.query({
            query: fetchPostFullContentBySlug,
            variables: { slug },
            context: {
              headers: {
                authorization: accessToken ? `Bearer ${accessToken}` : '',
              },
            },
          })
          const fullContent = result?.data?.post?.content ?? null
          return fullContent
        } catch (err) {
          //TODO: send error log to our GCP log viewer
          console.error(err)
          return null
        }
      }
      const updatePostContent = async () => {
        const fullContent = await getFullContent()
        if (fullContent) {
          setPostContent({ type: 'fullContent', data: fullContent })
        }
      }
      updatePostContent()
    }
  }, [isLoggedIn, content, accessToken, slug])

  //Send custom event to Google Analytics
  //Which event should be send is based on whether is member-only article.
  useEffect(() => {
    if (isMember) {
      sendGAEvent('premium_page_view')
    } else {
      sendGAEvent('story_page_view')
    }
  }, [isMember])

  const renderStoryLayout = () => {
    switch (storyLayoutType) {
      case 'style-normal':
        return (
          <StoryNormalStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
          />
        )
      case 'style-premium':
        return (
          <StoryPremiumStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
          />
        )
      case 'style-wide':
        return <StoryWideStyle postData={postData} postContent={postContent} />
      case 'style-photography':
        return (
          <StoryPhotographyStyle
            postData={postData}
            postContent={postContent}
          />
        )
      default:
        return (
          <StoryNormalStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
          />
        )
    }
  }
  const storyLayoutJsx = renderStoryLayout()
  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const noCategoryOfWineSlug = getCategoryOfWineSlug(categories).length === 0

  return (
    <Layout
      head={{
        title: `${title}`,
        description:
          convertDraftToText(postData.brief) ||
          convertDraftToText(postData.content),
        imageUrl:
          getResizedUrl(postData.og_image?.resized) ||
          getResizedUrl(postData.heroImage?.resized),
      }}
      header={{ type: 'empty' }}
      footer={{ type: 'empty' }}
    >
      <>
        {!storyLayoutJsx && (
          <Loading>
            <Image src={Skeleton} alt="loading..."></Image>
          </Loading>
        )}
        {storyLayoutJsx}
        <WineWarning categories={categories} />
        <AdultOnlyWarning isAdult={isAdult} />
        {noCategoryOfWineSlug && (
          <FullScreenAds hiddenAdvertised={hiddenAdvertised} />
        )}
      </>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 300 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const { slug } = params
  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }
  try {
    const result = await client.query({
      query: fetchPostBySlug,
      variables: { slug },
    })
    /**
     * @type {PostData}
     */
    const postData = result?.data?.post

    if (!postData) {
      return { notFound: true }
    }
    const { style } = postData
    /**
     * If post style is 'projects' or 'campaign', redirect to certain route.
     *
     * There is no `/projects` or `/campaign` pages in mirror-media-next, when user enter path `/projects/_slug` or `/campaign`,
     * Load balancer hosted by Google Cloud Platform will help us to get page content of project or campaign page.
     * The content of certain page is placed at Google Cloud Storage.
     */
    if (style === 'projects' || style === 'campaign') {
      return {
        redirect: {
          destination: `/${style}/${slug} `,
          permanent: false,
        },
      }
    }

    // Check if the post data has content in the brief, trimmedContent, or content fields
    const shouldCheckHasContent =
      style === 'article' || style === 'wide' || style === 'photography'

    if (shouldCheckHasContent) {
      const hasBrief = hasContentInRawContentBlock(postData.brief)

      const hasTrimmedContent = hasContentInRawContentBlock(
        postData.trimmedContent
      )
      const hasFullContent = hasContentInRawContentBlock(postData.content)

      // If none of the fields have content, return notFound as true
      if (!hasBrief && !hasTrimmedContent && !hasFullContent) {
        return { notFound: true }
      }
    }

    const redirect = postData?.redirect
    if (redirect) {
      return handleStoryPageRedirect(redirect)
    }
    const storyLayoutType = getStoryLayoutType(
      postData?.style,
      postData?.isMember
    )
    let headerData = null
    const shouldFetchDefaultHeaderData = storyLayoutType === 'style-normal'
    const shouldFetchPremiumHeaderData = storyLayoutType === 'style-premium'
    if (shouldFetchDefaultHeaderData) {
      try {
        headerData = await fetchHeaderDataInDefaultPageLayout()
      } catch (err) {
        headerData = { sectionsData: [], topicsData: [] }
        const errorMessage = errors.helpers.printAll(
          err,
          {
            withStack: true,
            withPayload: false,
          },
          0,
          0
        )
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errorMessage,
            ...globalLogFields,
          })
        )
      }
    } else if (shouldFetchPremiumHeaderData) {
      try {
        headerData = await fetchHeaderDataInPremiumPageLayout()
      } catch (err) {
        headerData = { sectionsData: [] }
        const errorMessage = errors.helpers.printAll(
          err,
          {
            withStack: true,
            withPayload: false,
          },
          0,
          0
        )
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errorMessage,
            ...globalLogFields,
          })
        )
      }
    }

    return {
      props: {
        postData,
        headerData,
        storyLayoutType,
      },
    }
  } catch (err) {
    const { graphQLErrors, clientErrors, networkError } = err
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting story page data'
    )

    const errorMessage = errors.helpers.printAll(
      annotatingError,
      {
        withStack: true,
        withPayload: true,
      },
      0,
      0
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errorMessage,
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
        ...globalLogFields,
      })
    )
    throw new Error(errorMessage)
  }
}
