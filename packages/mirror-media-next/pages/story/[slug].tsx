//TODO: add component to add html head dynamically, not jus write head in every pag
import { useMemo } from 'react'
import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import MirrorMedia from '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia'
import ReadrImage from '@readr-media/react-image'

import FullScreenAds from '@/components/ads/full-screen-ads'
import GptAd from '@/components/ads/gpt/gpt-ad'
import GPTFloatingAd from '@/components/ads/gpt/gpt-floating-ad'
import GPTMbStAd from '@/components/ads/gpt/gpt-mb-st-ad'
import {
  GPT_Placeholder,
  GPT_Placeholder_Aside,
} from '@/components/ads/gpt/gpt-placeholder'
import { cn } from '@/components/cn'
import Layout from '@/components/shared/layout'
import UserBehaviorLogger from '@/components/shared/user-behavior-logger'
import WineWarning from '@/components/shared/wine-warning'
import ArticleQuestions from '@/components/shell/article/article-questions'
import { ArticleSummary } from '@/components/shell/article/post-summary'
import { ThemeElement } from '@/components/shell/article/theme-element'
import FbPagePlugin from '@/components/story/normal/fb-page-plugin'
import { generateJsonLdsData } from '@/components/story/shared/json-lds-data'
import JsonLdsScript from '@/components/story/shared/json-lds-script'
import StoryHead from '@/components/story/shared/story-head'
import { Link, Typography } from '@/components/ui'
import { ENV } from '@/config/index.mjs'
import { useDisplayAd } from '@/hooks/useDisplayAd'
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
  getActiveOrderSection,
  getCategoryOfWineSlug,
  getLogTraceObject,
  getResizedUrl,
} from '@/utils'
import { getSectionGPTPageKey } from '@/utils/ad'
import { setPageCache } from '@/utils/cache-setting'
import { buildStoryDataLayer } from '@/utils/gtm/build-data-layer'
import { logGqlError } from '@/utils/log/shared'
import { handleStoryPageRedirect } from '@/utils/story'
import {
  getInitialRelatedStories,
  serializeStoryPostDataForClient,
} from '@/utils/story-page-props.mjs'

const { hasContentInRawContentBlock } = MirrorMedia

const classNameForGTM = 'GTM-story-page-view'

const AdultOnlyWarning = dynamic(
  () => import('@/components/story/shared/adult-only-warning')
)
const StoryWideStyle = dynamic(() => import('@/components/story/wide'), {
  loading: () => (
    <div className="fixed mx-auto my-0 h-full w-full">
      <NextImage
        src={Skeleton}
        alt="loading..."
        width={20}
        height={20}
        className="mx-auto my-0"
      />
    </div>
  ),
})
const StoryPhotographyStyle = dynamic(
  () => import('@/components/story/photography'),
  {
    loading: () => (
      <div className="fixed mx-auto my-0 h-full w-full">
        <NextImage
          src={Skeleton}
          alt="loading..."
          width={20}
          height={20}
          className="mx-auto my-0"
        />
      </div>
    ),
  }
)
const PostLayout = dynamic(
  () => import('@/components/shell/article/post-layout'),
  {
    loading: () => (
      <div className="fixed mx-auto my-0 h-full w-full">
        <NextImage
          src={Skeleton}
          alt="loading..."
          width={20}
          height={20}
          className="mx-auto my-0"
        />
      </div>
    ),
  }
)
const MisoPageView = dynamic(() => import('@/components/miso-pageview'), {
  ssr: false,
})

const DableAd = dynamic(() => import('@/components/common/dable-ad'), {
  ssr: false,
})

type StoryPageProps = {
  postData: StoryPost
  initialRelatedStories: RelatedStory[]
  headerData: StoryHeaderData
  flashNewsData: StoryFlashNewsData
  storyLayoutType: StoryLayoutType
  jsonLdData: object[]
  dataLayer: StoryDataLayer
}

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

  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd(
    hiddenAdvertised ?? false
  )

  const allRelatedStories = useLoadMoreRelatedStories(
    slug ?? '',
    initialRelatedStories
  )
  const [firstRelativeStory, ...restOfRelativeStories] = allRelatedStories

  const writersInString = useMemo(() => {
    return (writers ?? [])
      .map((writer) => {
        return writer?.name ?? ''
      })
      .join(',')
  }, [writers])

  const nonNullCategories = (categories ?? []).filter(
    (category): category is NonNullable<typeof category> => category != null
  )
  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const noCategoryOfWineSlug =
    getCategoryOfWineSlug(nonNullCategories).length === 0

  // Ads are keyed by the story's own section (matching StoryNormalStyle),
  // not by any partner concept — Post has no `partner` field.
  const sectionsWithOrdered = getActiveOrderSection(
    postData.sections,
    postData.sectionsInInputOrder
  )
  const [section] = sectionsWithOrdered
  const pageKeyForGptAd = getSectionGPTPageKey(section?.slug ?? '')

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
        header={{
          type: 'default-with-flash-news',
          data: {
            sectionsData: headerData.sectionsData,
            topicsData: headerData.topicsData,
            flashNewsData: flashNewsData,
          },
        }}
        footer={{ type: 'default' }}
      >
        <MisoPageView productIds={`story_${slug ?? ''}`} />
        <UserBehaviorLogger writers={writersInString} />
        {shouldShowAd && (
          <GPT_Placeholder
            shouldShowAd={shouldShowAd}
            isLogInProcessFinished={isLogInProcessFinished}
          >
            <GptAd
              pageKey={pageKeyForGptAd}
              adKey="HD"
              className="h-auto w-full"
            />
          </GPT_Placeholder>
        )}
        {storyLayoutType === 'style-normal' && (
          <>
            <PostLayout
              {...postData}
              relativeStory={firstRelativeStory}
              renderAdInContent={() => (
                <GptAd
                  pageKey={pageKeyForGptAd}
                  adKey="PC_AT1"
                  className="h-auto w-full"
                />
              )}
              renderAside={(summary) => (
                <>
                  <GPT_Placeholder_Aside
                    shouldShowAd={shouldShowAd}
                    isLogInProcessFinished={isLogInProcessFinished}
                  >
                    <GptAd
                      pageKey={pageKeyForGptAd}
                      adKey="PC_R1"
                      className="hidden xl:mx-auto xl:block xl:h-auto xl:w-full"
                    />
                  </GPT_Placeholder_Aside>
                  {summary && Array.isArray(summary) && summary.length > 0 && (
                    <ArticleSummary items={summary} />
                  )}
                  <GPT_Placeholder_Aside
                    shouldShowAd={shouldShowAd}
                    isLogInProcessFinished={isLogInProcessFinished}
                  >
                    <GptAd
                      pageKey={pageKeyForGptAd}
                      adKey="PC_R2"
                      className="hidden xl:mx-auto xl:my-5 xl:block xl:h-auto xl:w-full"
                    />
                  </GPT_Placeholder_Aside>
                  <ArticleQuestions
                    auto_faq={postData.auto_faq}
                    faqs_algo={postData.faqs_algo}
                  />
                  <div className="flex justify-center">
                    <Link href="https://google.com/preferences/source?q=mirrormedia.mg">
                      <NextImage
                        width={320}
                        height={100}
                        src="/images-next/story/gnews-gif.gif"
                        alt="google-news"
                      />
                    </Link>
                  </div>
                  <FbPagePlugin
                    facebookPagePluginSetting={{ 'data-width': 424 }}
                  />
                </>
              )}
              renderNextUp={() => (
                <>
                  <ThemeElement
                    as="span"
                    theme="accent"
                    className="inline rounded-md rounded-b-none bg-mm-second-700 px-3 pt-1 text-mm-neutral-100"
                  >
                    <Typography
                      as="span"
                      variant="subtitle"
                      className="text-mm-neutral-100"
                    >
                      延伸閱讀
                    </Typography>
                  </ThemeElement>
                  <ThemeElement
                    as="ul"
                    theme="post"
                    className="rounded-lg rounded-tl-none p-2.5 md:grid md:grid-cols-2"
                  >
                    {restOfRelativeStories.map((postItem) => (
                      <li
                        key={postItem.slug}
                        className={cn(
                          'border-b border-b-black py-4 last:border-0 md:odd:pr-6',
                          {
                            'md:nth-last-[-n+2]:border-b-0':
                              restOfRelativeStories.length % 2 === 0,
                            'md:last:border-b-0':
                              restOfRelativeStories.length % 2 === 1,
                          }
                        )}
                      >
                        <Link
                          href={`/story/${postItem.slug}?from=referral_bottom`}
                          className="grid grid-cols-[90px_1fr] items-center gap-x-4 md:grid-cols-[96px_1fr]"
                        >
                          <div className="relative">
                            <picture className="relative block aspect-4/3">
                              <ReadrImage
                                className="object-cover"
                                images={{
                                  original:
                                    postItem.heroImage?.resizedWebp?.original ??
                                    '/images-next/default-og-img.png',
                                }}
                                loadingImage="/images-next/loading.gif"
                                defaultImage="/images-next/default-og-img.png"
                                alt={postItem.title ?? ''}
                                loading="lazy"
                              />
                            </picture>
                          </div>
                          <Typography
                            as="div"
                            variant="h6"
                            className="line-clamp-3 text-mm-base-700"
                          >
                            {postItem.title}
                          </Typography>
                        </Link>
                      </li>
                    ))}
                  </ThemeElement>
                </>
              )}
              renderDable={() => (
                <>
                  {shouldShowAd && (
                    <>
                      <div className="hidden xl:flex xl:min-h-62.5 xl:w-full xl:items-center xl:justify-between xl:pb-4">
                        <GptAd
                          adKey="PC_E1"
                          pageKey={pageKeyForGptAd}
                          className="hidden h-auto w-full xl:m-0 xl:block"
                        />
                        <GptAd
                          adKey="PC_E2"
                          pageKey={pageKeyForGptAd}
                          className="hidden h-auto w-full xl:m-0 xl:block"
                        />
                      </div>
                      <DableAd breakpoint="xl" className="mx-2 md:mx-0" />
                    </>
                  )}
                </>
              )}
            />

            {shouldShowAd && (
              <GptAd
                pageKey={pageKeyForGptAd}
                adKey="MB_AT3"
                className="mx-[-20px] block h-auto w-full min-[336px]:mx-auto xl:hidden"
              />
            )}
            {shouldShowAd && (
              <GptAd
                pageKey={pageKeyForGptAd}
                adKey="MB_E1"
                className="mx-auto my-6 block h-auto w-full xl:hidden"
              />
            )}
            {shouldShowAd && section?.slug === 'carandwatch' && (
              <GPTFloatingAd pageKey={pageKeyForGptAd} />
            )}
          </>
        )}
        {storyLayoutType === 'style-photography' && (
          <StoryPhotographyStyle
            postData={postData}
            postContent={postContent}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )}
        {storyLayoutType === 'style-wide' && (
          <StoryWideStyle
            postData={postData}
            postContent={postContent}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )}

        <WineWarning categories={nonNullCategories} />
        {isAdult && <AdultOnlyWarning isAdult={true} />}
        {noCategoryOfWineSlug && (
          <FullScreenAds hiddenAdvertised={hiddenAdvertised ?? false} />
        )}
        {shouldShowAd && (
          <GptAd
            pageKey={pageKeyForGptAd}
            adKey="FT"
            className="mx-auto my-5"
          />
        )}
        {shouldShowAd && noCategoryOfWineSlug && (
          <GPTMbStAd
            pageKey={pageKeyForGptAd}
            className="fixed right-0 bottom-0 left-0 z-2000 mx-auto block h-auto w-full xl:hidden"
          />
        )}
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
     * If post style is 'projects' or '', redirect to certain route.
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
