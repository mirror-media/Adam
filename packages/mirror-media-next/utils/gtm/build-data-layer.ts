import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { SITE_TITLE } from '@/constants/index'
import type {
  CategoryDataLayer,
  DataLayerPayload,
  NotFoundDataLayer,
  ResolvedDataLayerPayload,
  SearchDataLayer,
  SingleCatDataLayer,
  StoryDataLayer,
} from '@/types/dataLayer'
import { getEventCategoryFromPathname } from '@/utils/gtm/page-type'

dayjs.extend(utc)
dayjs.extend(timezone)

type Named = {
  name?: string | null
  state?: string | null
}

// GraphQL list fields can carry `null` entries (see codegen.ts / the
// schema's nullable list items), so every list here tolerates them the
// same way `writers.map((writer) => writer?.name)` below already does.
type NamedList = (Named | null)[] | null

function firstActiveName(items?: NamedList, itemsInInputOrder?: NamedList) {
  const ordered = (itemsInInputOrder ?? []).filter(
    (item) => item?.state === 'active'
  )
  const fallback = (items ?? []).filter(
    (item) => !item?.state || item.state === 'active'
  )

  return (ordered[0] ?? fallback[0])?.name ?? ''
}

type StorySource = {
  title?: string | null
  slug?: string | null
  publishedDate?: string | null
  writers?: NamedList
  writersInInputOrder?: NamedList
  tags?: NamedList
  sections?: NamedList
  sectionsInInputOrder?: NamedList
  categories?: NamedList
  categoriesInInputOrder?: NamedList
}

type ExternalSource = {
  title?: string | null
  slug?: string | null
  publishedDate?: string | null
  extend_byline?: string | null
  partner?: { name?: string | null } | null
  tags?: NamedList
}

function joinComma(values: Array<string | null | undefined>): string {
  return values.filter((value): value is string => Boolean(value)).join(',')
}

function formatPublicationDate(publishedDate?: string | null): string {
  if (!publishedDate) {
    return ''
  }

  const taipeiTime = dayjs(publishedDate).tz('Asia/Taipei')
  if (!taipeiTime.isValid()) {
    return ''
  }

  return taipeiTime.format('YYYY-MM-DD HH:mm')
}

function buildStoryTitle(title?: string | null): string {
  if (!title) {
    return SITE_TITLE
  }

  return `${title} | ${SITE_TITLE}`
}

export function compactDataLayer(
  fields: ResolvedDataLayerPayload
): Partial<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(fields).filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === 'string' && entry[1] !== ''
    )
  )
}

export function buildSingleCatDataLayer(cat0: string): SingleCatDataLayer {
  return { cat_0: cat0 }
}

export function buildCategoryDataLayer(
  cat0: string,
  cat1: string
): CategoryDataLayer {
  return {
    cat_0: cat0,
    cat_1: cat1,
  }
}

export function buildSearchDataLayer(searchTerm: string): SearchDataLayer {
  return { search_term: searchTerm }
}

export function buildNotFoundDataLayer(path: string): NotFoundDataLayer {
  return {
    page_type: '404',
    error_page_path: path,
  }
}

export function resolvePageDataLayer(
  pathname: string,
  asPath: string,
  pageDataLayer?: DataLayerPayload
): ResolvedDataLayerPayload {
  const eventCategory = getEventCategoryFromPathname(pathname)
  const fields: DataLayerPayload =
    pathname === '/404' ? buildNotFoundDataLayer(asPath) : (pageDataLayer ?? {})

  if (!eventCategory) {
    return fields
  }

  return {
    ...fields,
    event_category: eventCategory,
  }
}

export function buildStoryDataLayer(post: StorySource): StoryDataLayer {
  const writers =
    post.writersInInputOrder && post.writersInInputOrder.length > 0
      ? post.writersInInputOrder
      : (post.writers ?? [])

  return {
    story_title: buildStoryTitle(post.title),
    content_slug: post.slug ?? '',
    publication_date: formatPublicationDate(post.publishedDate),
    content_author:
      joinComma(writers.map((writer) => writer?.name)) || '鏡週刊',
    content_tag: joinComma((post.tags ?? []).map((tag) => tag?.name)),
    cat_0: firstActiveName(post.sections, post.sectionsInInputOrder),
    cat_1: firstActiveName(post.categories, post.categoriesInInputOrder),
  }
}

export function buildExternalDataLayer(
  external: ExternalSource
): StoryDataLayer {
  return {
    story_title: buildStoryTitle(external.title),
    content_slug: external.slug ?? '',
    publication_date: formatPublicationDate(external.publishedDate),
    content_author:
      external.extend_byline || external.partner?.name || '鏡週刊',
    content_tag: joinComma((external.tags ?? []).map((tag) => tag?.name)),
    cat_0: '',
    cat_1: '',
  }
}
