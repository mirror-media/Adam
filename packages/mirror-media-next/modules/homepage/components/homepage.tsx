import { useLayoutEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

import { HOMEPAGE_DESKTOP_MEDIA_QUERY } from '../homepage-constants'
import type { HomepageViewModel } from '../homepage-types'

import { CategoryLatestGrid } from './category-latest-grid'
import { EditorChoiceCarousel } from './editor-choice-carousel'
import { GoogleNewsFollow } from './google-news-follow'
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

type DetachedSidebarSnapshot = {
  bottom: number
  columnHeight: number
  hasObservedGrowth: boolean
  height: number
}

const singleColumnContentClass =
  'mx-auto w-[calc(100%-32px)] md:w-[704px] xl:mx-0 xl:w-full'
// 48px fixed shell navigation row + 16px gap; same gap above the viewport floor.
const sidebarPinnedTop = 64
const sidebarBottomGap = 16

// Desktop sidebar positioning. Flow mode keeps the natural height and parks
// the bottom on the viewport floor. Window mode clips the same content without
// exposing a nested scroll surface; its programmatic offset follows page
// scrolling only. Load more briefly detaches the painted window across the
// grid-height commit, then safely hands position back to native sticky.
function Homepage({ data }: HomepageProps) {
  const sidebarColumnRef = useRef<HTMLDivElement | null>(null)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const detachSidebarForContentGrowthRef = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    const column = sidebarColumnRef.current
    const sidebar = sidebarRef.current
    if (!column || !sidebar) return

    const desktop = window.matchMedia(HOMEPAGE_DESKTOP_MEDIA_QUERY)
    let frame = 0
    let isPinned = false
    let pinnedHeight = 0
    let prevViewportHeight = window.innerHeight
    let prevWindowScrollY = window.scrollY
    let detachedSidebar: DetachedSidebarSnapshot | null = null
    let shouldSyncPinnedHeight = false

    function clearDetachedPosition() {
      if (!sidebar) return
      sidebar.style.position = ''
      sidebar.style.left = ''
      sidebar.style.width = ''
      detachedSidebar = null
    }

    function update(syncPinnedHeight = false) {
      // Re-narrowed: the outer guard does not reach the hoisted declaration.
      if (!column || !sidebar) return

      const viewportHeight = window.innerHeight
      const viewportChanged = viewportHeight !== prevViewportHeight
      prevViewportHeight = viewportHeight
      const pageOffset = window.scrollY
      const previousPageOffset = prevWindowScrollY
      const pageScrollDelta = Math.abs(previousPageOffset - pageOffset)
      const upwardPageDelta = Math.max(0, previousPageOffset - pageOffset)
      prevWindowScrollY = pageOffset

      if (!desktop.matches) {
        clearDetachedPosition()
        isPinned = false
        sidebar.style.top = ''
        sidebar.style.height = ''
        column.style.minHeight = ''
        return
      }

      const flowHeight = sidebar.scrollHeight
      const windowHeight = viewportHeight - sidebarPinnedTop - sidebarBottomGap
      const flowTop = viewportHeight - sidebarBottomGap - flowHeight

      // Window mode must not shrink the grid row.
      const nextMinHeight = `${flowHeight}px`
      if (column.style.minHeight !== nextMinHeight) {
        column.style.minHeight = nextMinHeight
      }

      if (flowHeight <= windowHeight) {
        clearDetachedPosition()
        isPinned = false
        sidebar.style.top = ''
        sidebar.style.height = ''
        return
      }

      const columnRect = column.getBoundingClientRect()
      const columnTop = columnRect.top

      if (detachedSidebar) {
        if (columnRect.height > detachedSidebar.columnHeight + 0.5) {
          detachedSidebar.hasObservedGrowth = true
        }

        const canReattachWithoutPush =
          detachedSidebar.hasObservedGrowth &&
          columnRect.bottom >= detachedSidebar.bottom - 0.5
        if (canReattachWithoutPush) {
          pinnedHeight = detachedSidebar.height
          clearDetachedPosition()
          sidebar.style.top = `${sidebarPinnedTop}px`
          sidebar.style.height = `${pinnedHeight}px`
        } else {
          const bound = Math.max(0, sidebarPinnedTop - columnTop)
          if (sidebar.scrollTop > bound && upwardPageDelta > 0) {
            const step =
              previousPageOffset > 0
                ? upwardPageDelta *
                  Math.max(1, sidebar.scrollTop / previousPageOffset)
                : sidebar.scrollTop
            sidebar.scrollTop = Math.max(bound, sidebar.scrollTop - step)
          }

          if (columnTop >= sidebarPinnedTop && sidebar.scrollTop <= 0) {
            clearDetachedPosition()
            isPinned = false
            sidebar.style.top = `${flowTop}px`
            sidebar.style.height = ''
          }
          return
        }
      }

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
          sidebar.style.top = `${sidebarPinnedTop}px`
          sidebar.style.height = `${pinnedHeight}px`
          sidebar.scrollTop = sidebar.scrollHeight
        }
        return
      }

      const targetHeight = Math.max(
        0,
        Math.min(windowHeight, columnRect.bottom - sidebarPinnedTop)
      )
      if (syncPinnedHeight || viewportChanged) {
        pinnedHeight = targetHeight
        sidebar.style.height = `${pinnedHeight}px`
      } else if (targetHeight > pinnedHeight) {
        const availableScrollBelow = Math.max(
          0,
          sidebar.scrollHeight - sidebar.clientHeight - sidebar.scrollTop
        )
        const heightGrowth = Math.min(
          pageScrollDelta,
          targetHeight - pinnedHeight,
          availableScrollBelow
        )
        if (heightGrowth > 0) {
          pinnedHeight += heightGrowth
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
        return
      }

      if (sidebar.scrollTop > bound && upwardPageDelta > 0) {
        const step =
          previousPageOffset > 0
            ? upwardPageDelta *
              Math.max(1, sidebar.scrollTop / previousPageOffset)
            : sidebar.scrollTop
        sidebar.scrollTop = Math.max(bound, sidebar.scrollTop - step)
      }
    }

    function requestUpdate(syncPinnedHeight = false) {
      if (syncPinnedHeight) shouldSyncPinnedHeight = true
      if (frame !== 0) return

      frame = window.requestAnimationFrame(() => {
        frame = 0
        const shouldSync = shouldSyncPinnedHeight
        shouldSyncPinnedHeight = false
        update(shouldSync)
      })
    }

    const resizeObserver = new ResizeObserver(() => update())
    resizeObserver.observe(column)
    resizeObserver.observe(sidebar)
    function handleSidebarScroll() {
      // Programmatic scroll updates can complete the sticky release.
      if (sidebar && sidebar.scrollTop <= 0) requestUpdate()
    }

    const handleWindowScroll = () => requestUpdate()
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    sidebar.addEventListener('scroll', handleSidebarScroll, { passive: true })
    const handleViewportResize = () => {
      if (detachedSidebar) {
        clearDetachedPosition()
        isPinned = false
        sidebar.style.top = ''
        sidebar.style.height = ''
      }
      requestUpdate(true)
    }
    window.addEventListener('resize', handleViewportResize)
    desktop.addEventListener('change', handleViewportResize)
    detachSidebarForContentGrowthRef.current = () => {
      if (!desktop.matches || !isPinned || !column || !sidebar) return
      if (detachedSidebar) return

      const columnRect = column.getBoundingClientRect()
      const sidebarRect = sidebar.getBoundingClientRect()
      if (columnRect.bottom > sidebarRect.bottom + 0.5) return

      const hiddenTop = Math.max(0, sidebarPinnedTop - sidebarRect.top)
      const detachedHeight = sidebarRect.height - hiddenTop
      if (detachedHeight <= 0) return

      const previousScrollTop = sidebar.scrollTop
      detachedSidebar = {
        bottom: sidebarRect.bottom,
        columnHeight: columnRect.height,
        hasObservedGrowth: false,
        height: detachedHeight,
      }
      sidebar.style.position = 'fixed'
      sidebar.style.top = `${sidebarRect.top + hiddenTop}px`
      sidebar.style.left = `${sidebarRect.left}px`
      sidebar.style.width = `${sidebarRect.width}px`
      sidebar.style.height = `${detachedHeight}px`
      sidebar.scrollTop = previousScrollTop + hiddenTop
    }

    update()

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      detachSidebarForContentGrowthRef.current = () => {}
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleWindowScroll)
      sidebar.removeEventListener('scroll', handleSidebarScroll)
      window.removeEventListener('resize', handleViewportResize)
      desktop.removeEventListener('change', handleViewportResize)
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
              onBeforeAppend={() => detachSidebarForContentGrowthRef.current()}
            />
          </div>
        </div>

        <div
          className="contents xl:order-0 xl:block xl:min-w-0"
          ref={sidebarColumnRef}
        >
          <aside
            aria-label="首頁側欄"
            className="contents xl:sticky xl:flex xl:w-full xl:min-w-0 xl:flex-col xl:gap-mm-5xl xl:overflow-hidden"
            ref={sidebarRef}
          >
            <HeadlineList
              articles={data.latestNews}
              className="order-2 col-span-full mx-auto w-[calc(100%-32px)] md:col-span-1 md:mx-0 md:w-[332px] md:justify-self-end xl:order-0 xl:w-full xl:justify-self-auto"
              title="最新新聞"
              titleId="homepage-latest-news-title"
              trackingClassName="GTM-homepage-latest-list"
            />
            <HeadlineList
              articles={data.popularNews}
              className="order-5 col-span-full mx-auto w-[calc(100%-32px)] md:order-2 md:col-span-1 md:mx-0 md:w-[332px] md:justify-self-start xl:order-2 xl:w-full xl:justify-self-auto"
              title="熱門新聞"
              titleId="homepage-popular-news-title"
              withPopInAds
            />
            <GoogleNewsFollow className="order-6 col-span-full mx-auto md:order-5 xl:order-1" />
            <HeadlineList
              articles={data.forumNews}
              className={`${singleColumnContentClass} order-9 col-span-full md:order-8 xl:order-3`}
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
