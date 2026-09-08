import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'

import { PageShell } from '@/components/shell/page-shell'
import { ENV } from '@/config/index.mjs'
import { SITE_DESCRIPTION } from '@/constants'
import { ListAsideColumn } from '@/modules/aside/components/list-aside-column'
import { ListPageMain } from '@/modules/list-article/components/list-page-main'
import type { SearchMeta } from '@/modules/search/search-api'
import { fetchSearchMeta } from '@/modules/search/search-api'
import { getLogTraceObject } from '@/utils'
import type { ShellHeaderData } from '@/utils/api'
import { fetchShellHeaderData } from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'
import { buildSearchDataLayer } from '@/utils/gtm/build-data-layer'

const MisoSearch = dynamic(
  () => import('@/modules/search/components/miso-search'),
  { ssr: false }
)

type SearchPageProps = {
  dataLayer: ReturnType<typeof buildSearchDataLayer>
  headerData: ShellHeaderData
  searchMeta: SearchMeta | null
  searchTerms: string
}

/** 拿不到 Miso 的篇數／最新標題時，退回沒有數字的敘述。 */
function buildMetaDescription(
  searchTerms: string,
  searchMeta: SearchMeta | null
) {
  if (!searchTerms) {
    return undefined
  }

  if (!searchMeta) {
    return `關於${searchTerms}的搜尋結果，${SITE_DESCRIPTION}`
  }

  return `搜尋${searchTerms}共找到${searchMeta.total}篇新聞，${SITE_DESCRIPTION}！最新發佈${searchTerms}：${searchMeta.latestTitle}`
}

export default function SearchPage({
  headerData,
  searchMeta,
  searchTerms,
}: SearchPageProps) {
  const metaDescription = buildMetaDescription(searchTerms, searchMeta)

  return (
    <>
      <PageShell
        head={{
          title: `${searchTerms} 新聞搜尋`,
          description: metaDescription,
          ogDescription: metaDescription,
        }}
        headerData={headerData}
      >
        <ListPageMain className="pt-20">
          <div className="flex md:gap-10 xl:gap-6.5">
            <div className="mx-auto w-[calc(100%-464px)] max-w-187.5 flex-1 lg:mx-0">
              <MisoSearch searchTerms={searchTerms} />
            </div>

            <ListAsideColumn pageKey="other" sectionSlug="" />
          </div>
        </ListPageMain>
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

  const [headerData, searchMeta] = await Promise.all([
    fetchShellHeaderData({
      logFields: globalLogFields,
    }),
    fetchSearchMeta(searchTerms),
  ])

  return {
    props: {
      dataLayer: buildSearchDataLayer(searchTerms),
      headerData,
      searchMeta,
      searchTerms,
    },
  }
}) satisfies GetServerSideProps<SearchPageProps>
