//TODO: add component to add html head dynamically, not jus write head in every pag
import { useState, useEffect } from 'react'
import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import WineWarning from '../../components/story/shared/wine-warning'
import AdultOnlyWarning from '../../components/story/shared/adult-only-warning'
import { useMembership } from '../../context/membership'
import {
  fetchPostBySlug,
  fetchPostFullContentBySlug,
} from '../../apollo/query/posts'
import StoryNormalStyle from '../../components/story/normal'
import Layout from '../../components/shared/layout'
import { convertDraftToText, getResizedUrl } from '../../utils/index'
import { handleStoryPageRedirect } from '../../utils/story'

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
 * @param {Object} props
 * @param {PostData} props.postData
 * @returns {JSX.Element}
 */
export default function Story({ postData }) {
  const {
    title = '',
    slug = '',
    style = 'article',
    isMember = false,
    isAdult = false,
    categories = [],
    content = null,
    trimmedContent = null,
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
  const [postContent, setPostContent] = useState(content ?? trimmedContent)

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
          setPostContent(fullContent)
        }
      }
      updatePostContent()
    }
  }, [isLoggedIn, content, accessToken, slug])

  const renderStoryLayout = () => {
    if (style === 'wide') {
      return <StoryWideStyle postData={postData} postContent={postContent} />
    } else if (style === 'photography') {
      return (
        <StoryPhotographyStyle postData={postData} postContent={postContent} />
      )
    } else if (style === 'article' && isMember === true) {
      return <StoryPremiumStyle postData={postData} postContent={postContent} />
    }
    return <StoryNormalStyle postData={postData} postContent={postContent} />
  }
  const storyLayout = renderStoryLayout()

  //mock for process of changing article type

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
        {!storyLayout && (
          <Loading>
            <Image src={Skeleton} alt="loading..."></Image>
          </Loading>
        )}
        {storyLayout}
        <WineWarning categories={categories} />
        <AdultOnlyWarning isAdult={isAdult} />
      </>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req }) {
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

    const redirect = postData?.redirect
    handleStoryPageRedirect(redirect)

    return {
      props: {
        postData,
      },
    }
  } catch (err) {
    const { graphQLErrors, clientErrors, networkError } = err
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting story page data'
    )

    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
        ...globalLogFields,
      })
    )
    return { notFound: true }
  }
}
