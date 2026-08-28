'use client'

import { useLayoutEffect, useRef } from 'react'
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
const desktopMediaQuery = '(min-width: 1280px)'
// 48px fixed shell navigation row + 16px gap; same gap above the viewport floor.
const sidebarPinnedTop = 64
const sidebarBottomGap = 16

// Desktop sidebar scrolling. Position is native sticky in both modes: flow
// mode (natural height, negative top parks the bottom on the viewport floor)
// and window mode (top 64px, viewport-bound height, own scrollbar). JS swaps
// modes only while the box is parked and both modes paint the same pixels,
// and walks the thumb back to zero as the page returns to the anchor. Inline
// top/height are inert below xl, where the aside is display: contents.
function Homepage({ data }: HomepageProps) {
  const sidebarColumnRef = useRef<HTMLDivElement | null>(null)
  const sidebarRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const column = sidebarColumnRef.current
    const sidebar = sidebarRef.current
    if (!column || !sidebar) return

    const desktop = window.matchMedia(desktopMediaQuery)
    let frame = 0
    let isPinned = false
    let pinnedHeight = 0
    let prevColumnTop = 0
    let prevSidebarTop = 0

    function update() {
      // Re-narrowed: the outer guard does not reach the hoisted declaration.
      if (!column || !sidebar) return

      if (!desktop.matches) {
        isPinned = false
        sidebar.style.top = ''
        sidebar.style.height = ''
        sidebar.style.removeProperty('scrollbar-color')
        sidebar.style.removeProperty('--homepage-sidebar-thumb')
        column.style.minHeight = ''
        return
      }

      const flowHeight = sidebar.scrollHeight
      const windowHeight =
        window.innerHeight - sidebarPinnedTop - sidebarBottomGap
      const flowTop = window.innerHeight - sidebarBottomGap - flowHeight

      // Window mode must not shrink the grid row.
      const nextMinHeight = `${flowHeight}px`
      if (column.style.minHeight !== nextMinHeight) {
        column.style.minHeight = nextMinHeight
      }

      if (flowHeight <= windowHeight) {
        isPinned = false
        sidebar.style.top = ''
        sidebar.style.height = ''
        sidebar.style.removeProperty('scrollbar-color')
        sidebar.style.removeProperty('--homepage-sidebar-thumb')
        return
      }

      const columnRect = column.getBoundingClientRect()
      const columnTop = columnRect.top
      const columnDelta = columnTop - prevColumnTop
      prevColumnTop = columnTop

      if (!isPinned) {
        const nextTop = `${flowTop}px`
        if (sidebar.style.top !== nextTop) sidebar.style.top = nextTop
        if (sidebar.style.height !== '') sidebar.style.height = ''

        if (columnTop <= flowTop) {
          isPinned = true
          pinnedHeight = Math.max(
            0,
            Math.min(windowHeight, columnRect.bottom - sidebarPinnedTop)
          )
          prevSidebarTop = sidebarPinnedTop
          sidebar.style.top = `${sidebarPinnedTop}px`
          sidebar.style.height = `${pinnedHeight}px`
          sidebar.style.setProperty(
            'scrollbar-color',
            'rgb(0 0 0 / 0.15) transparent'
          )
          sidebar.style.setProperty(
            '--homepage-sidebar-thumb',
            'rgb(0 0 0 / 0.15)'
          )
          sidebar.scrollTop = sidebar.scrollHeight
        }
        return
      }

      // The grid bottom pushes the pinned window up natively at the footer, so
      // scroll tracking there stays on the compositor with no per-frame JS
      // writes. When the grid grows under a pushed window while the page is
      // still ("看更多"), the relaxing push would snap the box down: cancel it
      // in the same frame by shrinking the window from its top edge and
      // advancing scrollTop — the bottom edge and every visible row stay put —
      // then let the height grow back with page scrolling, capped so regrowth
      // never re-pushes on its own.
      const sidebarTop = sidebar.getBoundingClientRect().top
      const pushRelax = sidebarTop - prevSidebarTop
      prevSidebarTop = sidebarTop
      if (Math.abs(columnDelta) < 0.5 && pushRelax > 0.5) {
        pinnedHeight = Math.max(0, pinnedHeight - pushRelax)
        sidebar.style.height = `${pinnedHeight}px`
        sidebar.scrollTop += pushRelax
      } else {
        const targetHeight = Math.max(
          0,
          Math.min(windowHeight, columnRect.bottom - sidebarPinnedTop)
        )
        if (targetHeight > pinnedHeight) {
          pinnedHeight = Math.min(
            targetHeight,
            pinnedHeight + Math.abs(columnDelta)
          )
          sidebar.style.height = `${pinnedHeight}px`
        }
      }

      // Release only once the thumb reaches zero. If the reader scrolled the
      // sidebar ahead of the page, the window rides the flow (native sticky)
      // while the thumb keeps walking, sped up just enough to finish before
      // the page tops out.
      const bound = Math.max(0, sidebarPinnedTop - columnTop)
      if (bound <= 0 && sidebar.scrollTop <= 0) {
        isPinned = false
        sidebar.style.top = `${flowTop}px`
        sidebar.style.height = ''
        sidebar.style.removeProperty('scrollbar-color')
        sidebar.style.removeProperty('--homepage-sidebar-thumb')
        return
      }

      const upwardDelta = Math.max(0, columnDelta)
      if (sidebar.scrollTop > bound && upwardDelta > 0) {
        const pageOffset = window.scrollY
        const step =
          pageOffset > 0
            ? upwardDelta * Math.max(1, sidebar.scrollTop / pageOffset)
            : sidebar.scrollTop
        sidebar.scrollTop = Math.max(bound, sidebar.scrollTop - step)
      }
    }

    function requestUpdate() {
      if (frame !== 0) return

      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    const resizeObserver = new ResizeObserver(requestUpdate)
    resizeObserver.observe(column)
    resizeObserver.observe(sidebar)
    function handleSidebarScroll() {
      // Only the release check cares about direct sidebar scrolling.
      if (sidebar && sidebar.scrollTop <= 0) requestUpdate()
    }

    window.addEventListener('scroll', requestUpdate, { passive: true })
    sidebar.addEventListener('scroll', handleSidebarScroll, { passive: true })
    window.addEventListener('resize', requestUpdate)
    desktop.addEventListener('change', requestUpdate)
    update()

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      sidebar.removeEventListener('scroll', handleSidebarScroll)
      window.removeEventListener('resize', requestUpdate)
      desktop.removeEventListener('change', requestUpdate)
    }
  }, [])

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

        <div
          className="contents xl:order-0 xl:block xl:min-w-0"
          ref={sidebarColumnRef}
        >
          <aside
            aria-label="首頁新聞排行榜"
            className="contents xl:sticky xl:flex xl:w-full xl:min-w-0 xl:[scrollbar-width:thin] xl:[scrollbar-color:transparent_transparent] xl:[scrollbar-gutter:stable] xl:flex-col xl:gap-mm-5xl xl:overflow-x-hidden xl:overflow-y-scroll xl:overscroll-contain xl:pr-mm-m xl:[&::-webkit-scrollbar]:w-1 xl:[&::-webkit-scrollbar-thumb]:rounded-full xl:[&::-webkit-scrollbar-thumb]:[background-color:var(--homepage-sidebar-thumb,transparent)] xl:[&::-webkit-scrollbar-track]:bg-transparent"
            ref={sidebarRef}
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
      </div>

      <FullScreenAds />
    </main>
  )
}

export { Homepage }
