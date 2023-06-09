//TODO: add component to add html head dynamically, not jus write head in every pag

import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import WineWarning from '../../components/story/shared/wine-warning'
import AdultOnlyWarning from '../../components/story/shared/adult-only-warning'

import { fetchPostBySlug } from '../../apollo/query/posts'
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
    style = 'article',
    isMember = false,
    isAdult = false,
    categories = [],
  } = postData

  const renderStoryLayout = () => {
    if (style === 'wide') {
      return <StoryWideStyle postData={postData} />
    } else if (style === 'photography') {
      return <StoryPhotographyStyle postData={postData} />
    } else if (style === 'article' && isMember === true) {
      return <StoryPremiumStyle postData={postData} />
    }
    return <StoryNormalStyle postData={postData} />
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

    //redirect to specific slug or external url
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
