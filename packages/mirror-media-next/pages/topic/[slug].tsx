import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import CustomHead from '@/components/shared/custom-head'
import WineWarning from '@/components/shared/wine-warning'
import { PageShell } from '@/components/shell/page-shell'
import SlotAndBanner from '@/components/slot/slot-and-banner'
import { ENV } from '@/config/index.mjs'
import { TopicPageBody } from '@/modules/topic/components/topic-page-body'
import { isWineTopic, loadTopicPage } from '@/modules/topic/topic-data'
import type { TopicPageViewModel } from '@/modules/topic/topic-types'
import { getLogTraceObject } from '@/utils'
import type { ShellHeaderData } from '@/utils/api'
import { fetchShellHeaderData } from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'
import { buildSingleCatDataLayer } from '@/utils/gtm/build-data-layer'
import { logGenericError } from '@/utils/log/shared'

type TopicPageProps = {
  dataLayer: ReturnType<typeof buildSingleCatDataLayer>
  headerData: ShellHeaderData
  viewModel: TopicPageViewModel
}

function TopicPage({ headerData, viewModel }: TopicPageProps) {
  const { layoutKind, seo, slideshowImages, topic } = viewModel

  return (
    <>
      <CustomHead
        description={seo.description ?? undefined}
        imageUrl={seo.imageUrl ?? undefined}
        title={seo.title}
      />
      <Head>
        {seo.pubdate ? (
          <meta
            content={seo.pubdate}
            itemProp="datePublished"
            key="pubdate"
            name="pubdate"
            property="article:published_time"
          />
        ) : null}
        {seo.lastmod ? (
          <meta
            content={seo.lastmod}
            itemProp="dateModified"
            key="lastmod"
            name="lastmod"
            property="article:modified_time"
          />
        ) : null}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }}
          type="application/ld+json"
        />
      </Head>
      <PageShell headerData={headerData}>
        <TopicPageBody
          layoutKind={layoutKind}
          slideshowImages={slideshowImages}
          topic={topic}
        />
        {isWineTopic(topic.slug) ? (
          <WineWarning categories={[{ slug: 'wine' }]} />
        ) : null}
        <SlotAndBanner />
      </PageShell>
    </>
  )
}

export default TopicPage

export const getServerSideProps = (async ({ query, req, res }) => {
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

  const topicSlug = Array.isArray(query.slug) ? query.slug[0] : query.slug
  const globalLogFields: Record<string, unknown> = {
    ...getLogTraceObject(req),
  }

  if (!topicSlug) {
    return { notFound: true }
  }

  const [headerData, viewModel] = await Promise.all([
    fetchShellHeaderData({ logFields: globalLogFields }),
    loadTopicPage(topicSlug).catch((error: unknown) => {
      logGenericError(
        error,
        `Error occurs while getting topics in topic page (topicSlug: ${topicSlug})`,
        globalLogFields
      )
      return null
    }),
  ])

  if (!viewModel) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch topic with topic slug ${topicSlug} return null, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  return {
    props: {
      dataLayer: buildSingleCatDataLayer(viewModel.topic.name || ''),
      headerData,
      viewModel,
    },
  }
}) satisfies GetServerSideProps<TopicPageProps>
