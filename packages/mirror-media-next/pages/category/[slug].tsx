import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'

import type { ListingPost } from '@/apollo/fragments/post'
import FullScreenAds from '@/components/ads/full-screen-ads'
import GPTMbStAd from '@/components/ads/gpt/gpt-mb-st-ad'
import { GPT_Placeholder } from '@/components/ads/gpt/gpt-placeholder'
import CategoryArticles from '@/components/category/category-articles'
import CustomHead from '@/components/shared/custom-head'
import WineWarning from '@/components/shared/wine-warning'
import { PageShell } from '@/components/shell/page-shell'
import { Typography } from '@/components/ui/typography'
import { ENV, SITE_URL } from '@/config/index.mjs'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import {
  fetchNewsCategoryInfo,
  fetchNewsCategoryPostsJSON,
  toCategorySummary,
} from '@/modules/category/category-data'
import type { CategorySummary } from '@/modules/category/category-types'
import { getCategoryOfWineSlug, getLogTraceObject } from '@/utils'
import { getSectionGPTPageKey } from '@/utils/ad'
import type { ShellHeaderData } from '@/utils/api'
import { fetchShellHeaderData } from '@/utils/api'
import {
  fetchCategoryByCategorySlug,
  fetchPostsByCategorySlug,
  fetchPremiumPostsByCategorySlug,
} from '@/utils/api/category'
import { setPageCache } from '@/utils/cache-setting'
import { getPostsAndPostscountFromGqlData } from '@/utils/data-process'
import { buildCategoryDataLayer } from '@/utils/gtm/build-data-layer'
import { logGqlError } from '@/utils/log/shared'
import { processSettledResult } from '@/utils/response-processor'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const RENDER_PAGE_SIZE = 12

type CategoryPageProps = {
  category: CategorySummary
  dataLayer: ReturnType<typeof buildCategoryDataLayer>
  headerData: ShellHeaderData
  isNewsCategory: boolean
  isPremium: boolean
  posts: ListingPost[]
  postsCount: number
}

export default function CategoryPage({
  category,
  headerData,
  isNewsCategory,
  isPremium,
  posts,
  postsCount,
}: CategoryPageProps) {
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const isNotWineCategory = getCategoryOfWineSlug([category]).length === 0

  //The type of GPT ad to display depends on which category the section belongs to.
  //If category not have related-section, use `other` ad units
  const sectionSlug = category.sections[0]?.slug ?? ''
  const GptPageKey = getSectionGPTPageKey(isPremium ? 'member' : sectionSlug)

  const postJsonData = posts.slice(3).map((post, index) => {
    return {
      '@type': 'ListItem',
      position: index + 1 + '',
      item: {
        '@type': 'NewsArticle',
        url: `https://${SITE_URL}/story/${post.slug}`,
        headline: post.title,
        image: post.heroImage?.resized?.w1200 || '',
        dateCreated: post.publishedDate,
      },
    }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: '5',
    itemListElement: postJsonData,
  }

  return (
    <>
      <CustomHead title={`${category.name}分類報導`} />
      <PageShell
        headerData={{ ...headerData, activeNavigationSlug: sectionSlug }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="mx-auto w-full max-w-7xl px-10">
          <GPT_Placeholder
            shouldShowAd={shouldShowAd}
            isLogInProcessFinished={isLogInProcessFinished}
          >
            {shouldShowAd && (
              <GPTAd
                adKey="HD"
                className="h-auto w-full"
                pageKey={GptPageKey}
              />
            )}
          </GPT_Placeholder>

          <Typography
            as="h1"
            variant="h3"
            className="mt-mm-2xl mb-mm-xl ml-mm-xl text-mm-base-700 legacy-md:mx-0 legacy-md:mb-mm-3xl legacy-xl:mt-mm-3xl legacy-xl:mb-mm-l"
          >
            {category.name}
          </Typography>

          <div className="flex xl:gap-6.5">
            <div className="w-full max-w-187.5">
              <CategoryArticles
                postsCount={postsCount}
                posts={posts}
                category={category}
                renderPageSize={RENDER_PAGE_SIZE}
                isPremium={isPremium}
                isNewsCategory={isNewsCategory}
              />
            </div>

            <aside className="w-full max-w-106 shrink-0" />
          </div>

          {shouldShowAd && isNotWineCategory ? (
            // Above the shell header (--mm-z-shell-header, 1000) and below its
            // overlays, matching the legacy Z_INDEX.coverHeader this ad used.
            <GPTMbStAd
              className="fixed inset-x-0 bottom-0 z-[2000] mx-auto h-auto max-h-[50px] w-full max-w-[320px] legacy-xl:hidden"
              pageKey={GptPageKey}
            />
          ) : null}
          <WineWarning categories={[category]} />
          {isNotWineCategory && <FullScreenAds />}
        </main>
      </PageShell>
    </>
  )
}

export const getServerSideProps = (async ({ query, req, res }) => {
  if (ENV === 'prod') {
    setPageCache(
      res,
      {
        cachePolicy: 'max-age',
        cacheTime: 600,
        sharedCacheTime: 600,
        staleWhileRevalidate: 3600,
      },
      req.url
    )
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const categorySlug =
    (Array.isArray(query.slug) ? query.slug[0] : query.slug) ?? ''

  const globalLogFields: Record<string, unknown> = {
    ...getLogTraceObject(req),
  }

  // default category, if request failed fallback to isMemberOnly = false
  let category: CategorySummary = {
    id: '',
    isMemberOnly: false,
    name: '',
    sections: [],
    slug: categorySlug,
    state: 'inactive',
  }

  const isNewsCategory = categorySlug === 'news'

  if (isNewsCategory) {
    try {
      category = (await fetchNewsCategoryInfo()) ?? category
    } catch (error) {
      console.error('Error fetching news category:', error)
    }
  } else {
    try {
      const { data } = await fetchCategoryByCategorySlug(categorySlug)
      category = toCategorySummary(data.category) ?? category
    } catch (error) {
      logGqlError(
        error instanceof Error ? error : new Error(String(error)),
        `Error occurs while getting category data in category page (${categorySlug})`,
        globalLogFields
      )
    }
  }

  // handle category state, if `inactive` -> redirect to 404
  if (category.state === 'inactive') {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `categorySlug '${categorySlug}' is inactive, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  const isPremium = category.isMemberOnly

  // A premium category is served from GraphQL even when it is the news
  // category, so this branch comes first.
  async function fetchCategoryPosts(): Promise<[number, ListingPost[]]> {
    if (isPremium) {
      const [postsResponse] = await Promise.allSettled([
        fetchPremiumPostsByCategorySlug(categorySlug, RENDER_PAGE_SIZE * 2, 0),
      ])

      return processSettledResult(
        postsResponse,
        getPostsAndPostscountFromGqlData<ListingPost>,
        `Error occurs while getting premium post data in category page (categorySlug: ${categorySlug})`,
        globalLogFields
      )
    }

    if (isNewsCategory) {
      const { items, counts } = await fetchNewsCategoryPostsJSON()

      return [counts, items]
    }

    const [postsResponse] = await Promise.allSettled([
      fetchPostsByCategorySlug(categorySlug, RENDER_PAGE_SIZE * 2, 0),
    ])

    return processSettledResult(
      postsResponse,
      getPostsAndPostscountFromGqlData<ListingPost>,
      `Error occurs while getting post data in category page (categorySlug: ${categorySlug})`,
      globalLogFields
    )
  }

  const [headerData, [postsCount, posts]] = await Promise.all([
    fetchShellHeaderData({
      includeFlashNews: true,
      logFields: globalLogFields,
    }),
    fetchCategoryPosts(),
  ])

  // handle fetch post data
  if (posts.length === 0) {
    // fetchPost return empty array -> wrong authorId -> 404
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch post of categorySlug ${categorySlug} return empty posts, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  return {
    props: {
      category,
      dataLayer: buildCategoryDataLayer(
        category.sections[0]?.name ?? '',
        category.name
      ),
      headerData,
      isNewsCategory,
      isPremium,
      posts,
      postsCount,
    },
  }
}) satisfies GetServerSideProps<CategoryPageProps>
