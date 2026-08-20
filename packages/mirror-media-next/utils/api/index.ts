import type { ApolloQueryResult } from '@apollo/client'
import errors from '@twreporter/errors'
import type { AxiosRequestConfig } from 'axios'

import type { FetchAnnouncementsQuery } from '../../apollo/__generated__/content/graphql'
import client from '../../apollo/apollo-client.js'
import { fetchAnnouncements } from '../../apollo/query/announcements'
import type { Topic } from '../../apollo/query/topics'
import axiosInstance from '../../axios/index.js'
import {
  URL_STATIC_HEADER_HEADERS,
  URL_STATIC_MENU_SECTIONS,
  URL_STATIC_POST_FLASH_NEWS,
  URL_STATIC_PREMIUM_SECTIONS,
  URL_STATIC_TOPICS,
} from '../../config/index.mjs'
import type { AnnouncementScopeValue } from '../../constants/announcement'
import { DEFAULT_ANNOUNCEMENT_SCOPE } from '../../constants/announcement'

export type Category = {
  id: string
  slug: string
  name: string
  isMemberOnly: boolean
}

export type Topics = Topic[]

export type CategoryInHeadersDataSection = {
  id: string
  slug: string
  name: string
  isMemberOnly: boolean
}

export type HeadersDataSection = {
  order: number
  type: 'section'
  slug: string
  name: string
  categories: CategoryInHeadersDataSection[]
  /**
   * Optional shell-only enrichment from `menu_sections_latest.json`.
   * V3 header consumers ignore this field, while the V4 layout adapter
   * uses it without issuing a second request from the browser.
   */
  posts?: ShellSectionPost[]
}

export type HeadersDataCategory = {
  order: number
  type: 'category'
  slug: string
  name: string
  isMemberOnly: boolean
  sections: string[]
}

export type postsInColumnSection = {
  type: 'external' | 'story'
  id: string
  title: string
  slug: string
  publishedDate: string
  heroImage?: string | null
  og_image?: string | null
  apiData?: unknown[]
  apiDataBrief?: Record<string, unknown>[]
  thumb?: string
  content?: string
  brief?: string
}

export type ColumnSectionResponse = {
  section: {
    items: postsInColumnSection[]
    counts: {
      posts: number
      externals: number
    }
  }
}

export type HeadersData = (HeadersDataSection | HeadersDataCategory)[]

export type ShellFlashNews = {
  id: string
  slug: string
  title: string
}

/**
 * A section's two latest posts, used by the desktop navigation flyout.
 *
 * `heroImage` is null for posts that have no artwork, and `post_url` is an
 * absolute link into the environment that produced the file, so the shell
 * builds its own href from `slug` rather than following it across
 * environments.
 */
export type ShellSectionPost = {
  heroImage: string | null
  id: string
  publishedDate: string
  slug: string
  title: string
}

export type ShellSectionPosts = Record<string, ShellSectionPost[]>

export type AnnouncementQueryResult = ApolloQueryResult<FetchAnnouncementsQuery>

type HeadersStaticJsonResponse = {
  headers?: HeadersData
}

type TopicsStaticJsonResponse = {
  topics?: Topics
}

type FlashNewsStaticJsonResponse = {
  posts?: ShellFlashNews[]
}

type MenuSectionsStaticJsonResponse = {
  sections?: {
    slug?: string
    posts?: ShellSectionPost[]
  }[]
}

type PremiumSectionsStaticJsonResponse = {
  sections?: HeadersData
}

// Fetches static JSON by URL. Tries local GCS FUSE first, then falls back to HTTP via axios.
const fetchStaticJsonByUrl = async <T>(
  requestUrl: string,
  requestConfig?: AxiosRequestConfig
): Promise<{ data: T }> => {
  if (typeof window === 'undefined') {
    const mod = await import('../server-side-only/fetch-static-json')
    const res = await mod.fetchStaticJsonOnServer(requestUrl, requestConfig)
    return res as { data: T }
  }

  const axiosRes = await axiosInstance(requestUrl, requestConfig)
  return { data: axiosRes?.data as T }
}

const errorLogger = (errorMessage: unknown): never => {
  const helpers = errors.helpers as typeof errors.helpers & {
    annotateAxiosError: (error: unknown) => Error
  }
  const annotatingAxiosError = helpers.annotateAxiosError(errorMessage)
  //WORKAROUND: print error in here. Should print in place where fetch function used, such as category/[slug]
  console.log(
    JSON.stringify({
      severity: 'WARNING',
      message: errors.helpers.printAll(
        annotatingAxiosError,
        {
          withStack: true,
          withPayload: true,
        },
        0,
        0
      ),
    })
  )

  throw annotatingAxiosError
}

const fetchHeaderDataInDefaultPageLayout = async () => {
  let sectionsData: HeadersData = []
  let topicsData: Topics = []
  let sectionPostsData: ShellSectionPosts = {}

  try {
    const responses = await Promise.allSettled([
      fetchStaticJsonByUrl<HeadersStaticJsonResponse>(
        URL_STATIC_HEADER_HEADERS
      ),
      fetchStaticJsonByUrl<TopicsStaticJsonResponse>(URL_STATIC_TOPICS),
      fetchShellSectionPosts({ onError: 'empty' }),
    ])

    const sectionsResult =
      responses[0].status === 'fulfilled' ? responses[0].value.data : undefined
    sectionsData = Array.isArray(sectionsResult?.headers)
      ? sectionsResult.headers
      : []

    const topicsResult =
      responses[1].status === 'fulfilled' ? responses[1].value.data : undefined
    topicsData = Array.isArray(topicsResult?.topics) ? topicsResult.topics : []

    sectionPostsData =
      responses[2].status === 'fulfilled' ? responses[2].value : {}
    sectionsData = sectionsData.map((item) =>
      item.type === 'section'
        ? { ...item, posts: sectionPostsData[item.slug] ?? [] }
        : item
    )

    return { sectionsData, topicsData }
  } catch (err) {
    errorLogger(err)
  }
}

/**
 * The header sections file the legacy header also reads. It is the canonical
 * one for navigation: it carries all ten sections in the order the design
 * shows, each with its own categories. The plain sections file is a smaller,
 * differently ordered set and is not interchangeable with it.
 *
 * Category entries are dropped; the shell's top level is sections only.
 */
const fetchShellNavigationData = async (): Promise<HeadersDataSection[]> => {
  try {
    const response = await fetchStaticJsonByUrl<HeadersStaticJsonResponse>(
      URL_STATIC_HEADER_HEADERS
    )
    const headers = Array.isArray(response.data.headers)
      ? response.data.headers
      : []

    // Order is applied by createShellNavigation, not here.
    return headers.filter(
      (header): header is HeadersDataSection => header.type === 'section'
    )
  } catch (err) {
    return errorLogger(err)
  }
}

const fetchShellFlashNews = async (): Promise<ShellFlashNews[]> => {
  try {
    const response = await fetchStaticJsonByUrl<FlashNewsStaticJsonResponse>(
      URL_STATIC_POST_FLASH_NEWS
    )

    return Array.isArray(response.data.posts) ? response.data.posts : []
  } catch (err) {
    return errorLogger(err)
  }
}

/**
 * The two latest posts per section, keyed by slug. It uses the same slugs as
 * the header sections file, so the navigation joins on them directly.
 */
type FetchShellSectionPostsOptions = {
  onError?: 'empty' | 'throw'
}

const fetchShellSectionPosts = async ({
  onError = 'throw',
}: FetchShellSectionPostsOptions = {}): Promise<ShellSectionPosts> => {
  try {
    const response = await fetchStaticJsonByUrl<MenuSectionsStaticJsonResponse>(
      URL_STATIC_MENU_SECTIONS
    )
    const sections = Array.isArray(response.data.sections)
      ? response.data.sections
      : []

    return Object.fromEntries(
      sections
        .filter((section) => section.slug && Array.isArray(section.posts))
        .map((section) => [section.slug as string, section.posts ?? []])
    )
  } catch (err) {
    if (onError === 'empty') {
      return {}
    }

    return errorLogger(err)
  }
}

const fetchShellTopicsData = async (): Promise<Topics> => {
  try {
    const response =
      await fetchStaticJsonByUrl<TopicsStaticJsonResponse>(URL_STATIC_TOPICS)

    return Array.isArray(response.data.topics) ? response.data.topics : []
  } catch (err) {
    return errorLogger(err)
  }
}

const fetchHeaderDataInPremiumPageLayout = async () => {
  let sectionsData: HeadersData = []
  try {
    const response =
      await fetchStaticJsonByUrl<PremiumSectionsStaticJsonResponse>(
        URL_STATIC_PREMIUM_SECTIONS
      )
    sectionsData = Array.isArray(response.data.sections)
      ? response.data.sections
      : []
    return { sectionsData }
  } catch (err) {
    errorLogger(err)
  }
}

// Fetch announcements filtered by input scope array.
const fetchAnnouncementsByScope = (scope?: AnnouncementScopeValue[]) => {
  const queryScope = Array.isArray(scope) ? [...scope] : []

  if (queryScope.includes(DEFAULT_ANNOUNCEMENT_SCOPE) === false) {
    queryScope.unshift(DEFAULT_ANNOUNCEMENT_SCOPE)
  }

  return client.query({
    query: fetchAnnouncements,
    variables: {
      scope: queryScope,
    },
  })
}

export {
  fetchAnnouncementsByScope,
  fetchHeaderDataInDefaultPageLayout,
  fetchHeaderDataInPremiumPageLayout,
  fetchShellFlashNews,
  fetchShellNavigationData,
  fetchShellSectionPosts,
  fetchShellTopicsData,
  fetchStaticJsonByUrl,
}
