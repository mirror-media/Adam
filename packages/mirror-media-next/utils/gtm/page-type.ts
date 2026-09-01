import {
  type EventCategory,
  PAGE_TYPE_TO_EVENT_CATEGORY,
  type PageType,
} from '@/types/dataLayer'

/**
 * 用 Next.js `router.pathname`（如 /story/[slug]）對出 PageType。
 * 未列在規格的路徑回傳 undefined，不猜測 event_category。
 */
export function getPageTypeFromPathname(
  pathname: string
): PageType | undefined {
  if (pathname === '/404') {
    return '404'
  }

  if (pathname === '/' || pathname === '') {
    return 'index'
  }

  if (pathname.startsWith('/story/') || pathname.startsWith('/external/')) {
    return 'story'
  }

  // 精選專區與專題內頁同一套 topic_event；其餘 /section/ 才是 cate_event
  if (pathname === '/section/topic' || pathname.startsWith('/topic/')) {
    return 'topic'
  }

  if (
    pathname.startsWith('/section/') ||
    pathname.startsWith('/category/') ||
    pathname.startsWith('/premiumsection/')
  ) {
    return 'category'
  }

  if (pathname.startsWith('/tag/')) {
    return 'tag'
  }

  if (pathname.startsWith('/search/')) {
    return 'search'
  }

  if (pathname.startsWith('/author/') || pathname.startsWith('/externals/')) {
    return 'author'
  }

  return undefined
}

export function getEventCategoryFromPathname(
  pathname: string
): EventCategory | undefined {
  const pageType = getPageTypeFromPathname(pathname)
  return pageType ? PAGE_TYPE_TO_EVENT_CATEGORY[pageType] : undefined
}
