import type { GetServerSideProps } from 'next'

import { PageShell } from '@/components/shell/page-shell'
import { ENV } from '@/config/index.mjs'
import { Homepage } from '@/modules/homepage/components/homepage'
import { fetchHomepageData } from '@/modules/homepage/homepage-data'
import type { HomepagePageProps } from '@/modules/homepage/homepage-types'
import { getLogTraceObject } from '@/utils'
import { fetchShellHeaderData } from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'

export default function HomePage({
  headerData,
  homepageData,
}: HomepagePageProps) {
  return (
    <>
      <PageShell headerData={headerData} pauseCarouselTickerOnIdle>
        <Homepage data={homepageData} />
      </PageShell>
    </>
  )
}

export const getServerSideProps = (async ({ req, res }) => {
  if (ENV === 'prod') {
    setPageCache(
      res,
      {
        cachePolicy: 'max-age',
        cacheTime: 180,
        sharedCacheTime: 180,
        staleWhileRevalidate: 3600,
      },
      req.url
    )
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields: Record<string, unknown> = {
    ...getLogTraceObject(req),
  }
  const [headerData, homepageData] = await Promise.all([
    fetchShellHeaderData({ logFields: globalLogFields }),
    fetchHomepageData(globalLogFields),
  ])

  return {
    props: {
      headerData,
      homepageData,
    },
  }
}) satisfies GetServerSideProps<HomepagePageProps>
