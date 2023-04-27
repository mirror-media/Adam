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
 * @param {Object} props
 * @param {PostData} props.postData
 * @returns {JSX.Element}
 */
export default function Story({ postData }) {
  const [storyStyle, setStoryStyle] = useState(null)

  const getRenderUi = () => {
    switch (storyStyle) {
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
  const jsx = getRenderUi()

  //mock for process of changing article type
  useEffect(() => {
    const time1 = setTimeout(() => {
      setStoryStyle('style-normal')
    }, 1000)
    return () => clearTimeout(time1)
  }, [])
  const { title = '' } = postData

  const headJsx = (
    <Head>
      <title>{title}</title>
    </Head>
  )

  return (
    <>
      {headJsx}
      {!storyStyle && <MockLoading>Loading...</MockLoading>}
      <div style={{ display: `${storyStyle ? 'block' : 'none'}` }}>{jsx}</div>
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
