//TODO: add component to add html head dynamically, not jus write head in every pag
import { useState, useEffect } from 'react'
import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import styled from 'styled-components'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import { fetchPostBySlug } from '../../apollo/query/posts'
import StoryNormalStyle from '../../components/story/normal'

const StoryWideStyle = dynamic(() => import('../../components/story/wide'))
const StoryPhotographyStyle = dynamic(() =>
  import('../../components/story/photography')
)
const StoryPremiumStyle = dynamic(() =>
  import('../../components/story/premium')
)

/**
 * @typedef {import('../../components/story/normal').PostData} PostData
 */

//Todo: adjust height, make it not to scroll when loading
const MockLoading = styled.div`
  width: 100%;
  height: 100vh;
  background-color: pink;
  text-align: center;
  font-size: 32px;
`
/**
 *
 * @param {'article'| 'wide' | 'projects' | 'photography' | 'script' | 'campaign' | 'readr'} articleType
 * @param {boolean} isMemberArticle
 * @param { 'yearly' | 'monthly' | 'basic' | undefined} [memberType]
 * @return {'style-normal' | 'style-wide' | 'style-photography' | 'style-premium'}
 */
const getStoryLayout = (
  articleType,
  isMemberArticle = false,
  memberType = undefined
) => {
  switch (articleType) {
    case 'wide':
      return 'style-wide'

    case 'photography':
      return 'style-photography'

    case 'article':
      if (
        isMemberArticle ||
        memberType === 'monthly' ||
        memberType === 'yearly'
      ) {
        return 'style-premium'
      }
      return 'style-normal'

    default:
      return 'style-normal'
  }
}

const mockMemberSystem = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve('basic')
    }, 1000)
  )
}

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @returns {JSX.Element}
 */
export default function Story({ postData }) {
  const { title = '', style = 'article', isMember = false } = postData

  const [storyLayout, setStoryLayout] = useState(null)

  const renderStoryLayout = () => {
    switch (storyLayout) {
      case 'style-normal':
        return <StoryNormalStyle postData={postData} />
      case 'style-wide':
        return <StoryWideStyle test={'我是test的字串'} />
      case 'style-photography':
        return <StoryPhotographyStyle />
      case 'style-premium':
        return <StoryPremiumStyle />
      default:
        return <StoryNormalStyle postData={postData} />
    }
  }
  const jsx = renderStoryLayout()

  //mock for process of changing article type
  useEffect(() => {
    async function getMemberType() {
      const memberType = await mockMemberSystem()
      return memberType
    }

    getMemberType()
      .then((res) => {
        const storyLayout = getStoryLayout(style, isMember, res)
        setStoryLayout(storyLayout)
      })
      .catch(() => {
        const storyLayout = getStoryLayout(style, isMember, undefined)
        setStoryLayout(storyLayout)
      })
  }, [style, isMember])

  const headJsx = (
    <Head>
      <title>{title}</title>
    </Head>
  )

  return (
    <>
      {headJsx}
      {!storyLayout && <MockLoading>Loading...</MockLoading>}
      <div style={{ display: `${storyLayout ? 'block' : 'none'}` }}>{jsx}</div>
    </>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params }) {
  const { slug } = params
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
      'Error occurs while getting index page data'
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
      })
    )
    return { notFound: true }
  }
}
