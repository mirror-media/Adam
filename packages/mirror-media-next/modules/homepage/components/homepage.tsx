'use client'

import dynamic from 'next/dynamic'

import type { HomepageViewModel } from '../homepage-types'

import { CategoryLatestGrid } from './category-latest-grid'
import { EditorChoiceCarousel } from './editor-choice-carousel'
import { HeadlineList } from './headline-list'
import { HomepageAd } from './homepage-ad'
import { MoreNews } from './more-news'
import { PromoVideoCarousel } from './promo-video-carousel'

const FullScreenAds = dynamic(
  () => import('@/components/ads/full-screen-ads'),
  { ssr: false }
)

type HomepageProps = {
  data: HomepageViewModel
}

const singleColumnContentClass =
  'mx-auto w-[calc(100%-32px)] md:w-[704px] xl:mx-0 xl:w-full'

function Homepage({ data }: HomepageProps) {
  return (
    <main className="w-full bg-mm-neutral-0 pb-mm-5xl text-mm-neutral-900 xl:pb-mm-6xl">
      <HomepageAd placement="top" wrapperClassName="py-mm-5xl" />

      <div className="grid w-full grid-cols-1 gap-y-mm-5xl md:grid-cols-2 md:gap-x-mm-5xl xl:mx-auto xl:max-w-[1200px] xl:grid-cols-[728px_448px] xl:gap-x-mm-3xl xl:gap-y-0">
        <div className="contents xl:order-0 xl:flex xl:min-w-0 xl:flex-col xl:gap-mm-3xl">
          <div className="order-1 col-span-full w-full xl:order-0">
            <EditorChoiceCarousel articles={data.editorChoices} />
          </div>

          <div className="order-3 col-span-full xl:order-0">
            <HomepageAd placement="secondary" />
          </div>

          <div className="order-4 col-span-full w-full xl:order-0">
            <PromoVideoCarousel videos={data.promoVideos} />
          </div>

          <div
            className={`${singleColumnContentClass} order-7 col-span-full xl:order-0`}
          >
            <CategoryLatestGrid categories={data.categories} />
          </div>

          <div
            className={`${singleColumnContentClass} order-10 col-span-full xl:order-0`}
          >
            <MoreNews
              excludedKeys={data.latestNews.map((article) => article.key)}
              initialArticles={data.moreNews}
              initialHasMore={data.hasMoreNews}
            />
          </div>
        </div>

        <aside
          aria-label="首頁新聞排行榜"
          className="contents xl:order-0 xl:flex xl:min-w-0 xl:flex-col xl:gap-mm-5xl"
        >
          <HeadlineList
            articles={data.latestNews}
            className="order-2 col-span-full mx-auto w-[calc(100%-32px)] md:col-span-1 md:mx-0 md:w-[332px] md:justify-self-end xl:order-0 xl:w-full xl:justify-self-auto"
            title="最新新聞"
            titleId="homepage-latest-news-title"
          />
          <HeadlineList
            articles={data.popularNews}
            className="order-5 col-span-full mx-auto w-[calc(100%-32px)] md:order-2 md:col-span-1 md:mx-0 md:w-[332px] md:justify-self-start xl:order-0 xl:w-full xl:justify-self-auto"
            title="熱門新聞"
            titleId="homepage-popular-news-title"
          />
          <HeadlineList
            articles={data.forumNews}
            className={`${singleColumnContentClass} order-9 col-span-full md:order-8 xl:order-0`}
            title="論壇新聞"
            titleId="homepage-forum-news-title"
          />
        </aside>
      </div>

      <FullScreenAds />
    </main>
  )
}

export { Homepage }
