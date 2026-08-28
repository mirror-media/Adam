//TODO: add component to add html head dynamically, not jus write head in every pag
import { useMemo } from 'react'
import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import MirrorMedia from '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia'
import styled from 'styled-components'

import FullScreenAds from '@/components/ads/full-screen-ads'
import Layout from '@/components/shared/layout'
import UserBehaviorLogger from '@/components/shared/user-behavior-logger'
import WineWarning from '@/components/shared/wine-warning'
import StoryNormalStyle from '@/components/story/normal'
import AdultOnlyWarning from '@/components/story/shared/adult-only-warning'
import { generateJsonLdsData } from '@/components/story/shared/json-lds-data'
import JsonLdsScript from '@/components/story/shared/json-lds-script'
import StoryHead from '@/components/story/shared/story-head'
import {
  ENV,
  // TEST_GPT_AD_FEATURE_TOGGLE,
} from '@/config/index.mjs'
import {
  fetchStoryHeaderAndFlashNewsData,
  fetchStoryPost,
  getStoryLayoutType,
} from '@/modules/story/story-data'
import type {
  PostContent,
  RelatedStory,
  StoryFlashNewsData,
  StoryHeaderData,
  StoryLayoutType,
  StoryPost,
} from '@/modules/story/story-types'
import { useLoadMoreRelatedStories } from '@/modules/story/use-load-more-related-stories'
import Skeleton from '@/public/images-next/skeleton.png'
import type { StoryDataLayer } from '@/types/dataLayer'
import {
  convertDraftToText,
  getCategoryOfWineSlug,
  getLogTraceObject,
  getResizedUrl,
} from '@/utils'
import { setPageCache } from '@/utils/cache-setting'
import { buildStoryDataLayer } from '@/utils/gtm/build-data-layer'
import { logGqlError } from '@/utils/log/shared'
import { handleStoryPageRedirect } from '@/utils/story'
import {
  getInitialRelatedStories,
  serializeStoryPostDataForClient,
} from '@/utils/story-page-props.mjs'

const { hasContentInRawContentBlock } = MirrorMedia

const StoryWideStyle = dynamic(() => import('@/components/story/wide'))
const StoryPhotographyStyle = dynamic(
  () => import('@/components/story/photography')
)
const MisoPageView = dynamic(() => import('@/components/miso-pageview'), {
  ssr: false,
})
// import DevGptAd from '../../components/story/dev-gpt-ad'

type StoryPageProps = {
  postData: StoryPost
  initialRelatedStories: RelatedStory[]
  headerData: StoryHeaderData
  flashNewsData: StoryFlashNewsData
  storyLayoutType: StoryLayoutType
  jsonLdData: object[]
  dataLayer: StoryDataLayer
}

const Loading = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: fixed;

  img {
    margin: 0 auto;
  }
`

export default function Story({
  postData,
  initialRelatedStories = [],
  headerData,
  flashNewsData,
  storyLayoutType,
  jsonLdData,
}: StoryPageProps) {
  const {
    title,
    slug,
    isAdult,
    categories,
    content,
    hiddenAdvertised,
    writers,
  } = postData
  const postContent: PostContent = {
    type: 'fullContent',
    data: content ?? { blocks: [], entityMap: {} },
    isLoaded: true,
  }

  const allRelatedStories = useLoadMoreRelatedStories(
    slug ?? '',
    initialRelatedStories
  )

  const writersInString = useMemo(() => {
    return (writers ?? [])
      .map((writer) => {
        return writer?.name ?? ''
      })
      .join(',')
  }, [writers])

  const renderStoryLayout = () => {
    /**
     * Because GA is currently unable to send custom event, we use gtm className to collect custom page-view.
     */
    const classNameForGTM = 'GTM-story-page-view'
    switch (storyLayoutType) {
      case 'style-normal':
        return (
          <StoryNormalStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
            flashNewsData={flashNewsData}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
      case 'style-wide':
        return (
          <StoryWideStyle
            postData={postData}
            postContent={postContent}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
      case 'style-photography':
        return (
          <StoryPhotographyStyle
            postData={postData}
            postContent={postContent}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
      default:
        return (
          <StoryNormalStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
            flashNewsData={flashNewsData}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
    }
  }
  const storyLayoutJsx = renderStoryLayout()
  const nonNullCategories = (categories ?? []).filter(
    (category): category is NonNullable<typeof category> => category != null
  )
  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const noCategoryOfWineSlug =
    getCategoryOfWineSlug(nonNullCategories).length === 0

  return (
    <>
      <StoryHead postData={postData} />
      <Layout
        head={{
          title: `${title ?? ''}`,
          ogTitle: postData.og_title ?? undefined,
          description:
            convertDraftToText(postData.brief) ||
            convertDraftToText(postData.content),
          ogDescription: postData.og_description ?? undefined,
          imageUrl:
            getResizedUrl(postData.heroImage?.resized) ||
            getResizedUrl(postData.og_image?.resized),
          ogImageUrl:
            getResizedUrl(postData.og_image?.resized) ||
            getResizedUrl(postData.heroImage?.resized),
          skipCanonical: true,
          pageType: 'story',
          pageSlug: slug ?? '',
        }}
        header={{ type: 'empty' }}
        footer={{ type: 'empty' }}
      >
        <MisoPageView productIds={`story_${slug ?? ''}`} />
        <UserBehaviorLogger writers={writersInString} />
        {!storyLayoutJsx && (
          <Loading>
            <Image src={Skeleton} alt="loading..."></Image>
          </Loading>
        )}
        {storyLayoutJsx}
        <WineWarning categories={nonNullCategories} />
        <AdultOnlyWarning isAdult={isAdult ?? false} />
        {noCategoryOfWineSlug && (
          <FullScreenAds hiddenAdvertised={hiddenAdvertised ?? false} />
        )}
        {/* {TEST_GPT_AD_FEATURE_TOGGLE === 'on' && <DevGptAd />} */}
      </Layout>
      <JsonLdsScript jsonLdData={jsonLdData}></JsonLdsScript>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  StoryPageProps,
  { slug: string }
> = async ({ params, req, res }) => {
  if (ENV === 'prod') {
    setPageCache(
      res,
      {
        cachePolicy: 'max-age',
        cacheTime: 300,
        sharedCacheTime: 300,
        staleWhileRevalidate: 3600,
      },
      req.url
    )
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  if (!params?.slug) {
    return { notFound: true }
  }
  const { slug } = params
  const globalLogFields: Record<string, unknown> = { ...getLogTraceObject(req) }

  try {
    const postData = await fetchStoryPost(slug)

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

    // Check if the post data has content in the brief or content fields
    const shouldCheckHasContent =
      style === 'article' || style === 'wide' || style === 'photography'

    if (shouldCheckHasContent) {
      const hasBrief = hasContentInRawContentBlock(postData.brief)
      const hasFullContent = hasContentInRawContentBlock(postData.content)

      // If none of the fields have content, return notFound as true
      if (!hasBrief && !hasFullContent) {
        return { notFound: true }
      }
    }

    if (postData.redirect) {
      const redirectResult = handleStoryPageRedirect(postData.redirect)
      if (redirectResult) {
        return redirectResult
      }
    }

    const storyLayoutType = getStoryLayoutType(style)
    let headerData: StoryHeaderData = { sectionsData: [], topicsData: [] }
    let flashNewsData: StoryFlashNewsData = []
    const shouldFetchDefaultHeaderData = storyLayoutType === 'style-normal'
    if (shouldFetchDefaultHeaderData) {
      const result = await fetchStoryHeaderAndFlashNewsData(
        slug,
        globalLogFields
      )
      headerData = result.headerData
      flashNewsData = result.flashNewsData
    }

    const jsonLdData = generateJsonLdsData(postData, '/story/')
    const initialRelatedStories = getInitialRelatedStories(postData)
    const clientStoryPost = serializeStoryPostDataForClient(postData)

    return {
      props: {
        postData: clientStoryPost,
        initialRelatedStories,
        flashNewsData,
        headerData,
        storyLayoutType,
        jsonLdData,
        dataLayer: buildStoryDataLayer(postData),
      },
    }
  } catch (err) {
    logGqlError(
      err instanceof Error ? err : new Error(String(err)),
      `Error occurs while getting data in story page (slug: ${slug})`,
      globalLogFields
    )
    throw new Error(
      `Error occurs while getting data in story page (slug: ${slug})`
    )
  }
}
