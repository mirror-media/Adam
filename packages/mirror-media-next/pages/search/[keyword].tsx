import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'

import { GPT_Placeholder_Aside } from '@/components/ads/gpt/gpt-placeholder'
import CustomHead from '@/components/shared/custom-head'
import { PageShell } from '@/components/shell/page-shell'
import { ENV } from '@/config/index.mjs'
import { SITE_DESCRIPTION } from '@/constants'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { FbPagePlugin } from '@/modules/aside/components/fb-page-plugin'
import { GoogleNewsFollow } from '@/modules/aside/components/google-news-follow'
import { LatestArticles } from '@/modules/aside/components/latest-articles'
import { PopularArticles } from '@/modules/aside/components/popular-articles'
import { getLogTraceObject } from '@/utils'
import type { ShellHeaderData } from '@/utils/api'
import { fetchShellHeaderData } from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'
import { buildSearchDataLayer } from '@/utils/gtm/build-data-layer'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const MisoSearch = dynamic(
  () => import('@/modules/search/components/miso-search'),
  { ssr: false }
)

type SearchPageProps = {
  dataLayer: ReturnType<typeof buildSearchDataLayer>
  headerData: ShellHeaderData
  searchTerms: string
}

export default function SearchPage({
  headerData,
  searchTerms,
}: SearchPageProps) {
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

  return (
    <>
      <CustomHead
        title={`${searchTerms}｜新聞搜尋`}
        description={
          searchTerms
            ? `關於${searchTerms}的搜尋結果，${SITE_DESCRIPTION}`
            : undefined
        }
      />
      <PageShell headerData={headerData}>
        <main className="mx-auto w-full max-w-7xl px-10 pt-20">
          <div className="flex md:gap-10 xl:gap-6.5">
            <div className="mx-auto w-[calc(100%-464px)] max-w-187.5 flex-1 lg:mx-0">
              <MisoSearch searchTerms={searchTerms} />
            </div>

            <aside className="hidden w-full max-w-106 shrink-0 flex-col gap-mm-4xl lg:flex">
              {/* A search has no section, so the latest articles fall back to
                  the news list. */}
              <LatestArticles sectionSlug="" />
              <GPT_Placeholder_Aside
                shouldShowAd={shouldShowAd}
                isLogInProcessFinished={isLogInProcessFinished}
              >
                {shouldShowAd && (
                  <GPTAd
                    adKey="PC_R2"
                    className="mx-auto h-auto w-full"
                    pageKey="other"
                  />
                )}
              </GPT_Placeholder_Aside>
              <PopularArticles />
              <GoogleNewsFollow />
              <FbPagePlugin />
            </aside>
          </div>
        </main>
      </PageShell>
    </>
  )
}

export const getServerSideProps = (async ({ params, req, res }) => {
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

  const searchTerms =
    (Array.isArray(params?.keyword) ? params?.keyword[0] : params?.keyword) ??
    ''

  const globalLogFields: Record<string, unknown> = {
    ...getLogTraceObject(req),
  }

  const headerData = await fetchShellHeaderData({
    includeFlashNews: true,
    logFields: globalLogFields,
  })

  return {
    props: {
      dataLayer: buildSearchDataLayer(searchTerms),
      headerData,
      searchTerms,
    },
  }
}) satisfies GetServerSideProps<SearchPageProps>
