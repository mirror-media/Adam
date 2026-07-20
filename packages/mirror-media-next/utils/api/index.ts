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

export type AnnouncementQueryResult = ApolloQueryResult<FetchAnnouncementsQuery>

type HeadersStaticJsonResponse = {
  headers?: HeadersData
}

type TopicsStaticJsonResponse = {
  topics?: Topics
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

  try {
    const responses = await Promise.allSettled([
      fetchStaticJsonByUrl<HeadersStaticJsonResponse>(
        URL_STATIC_HEADER_HEADERS
      ),
      fetchStaticJsonByUrl<TopicsStaticJsonResponse>(URL_STATIC_TOPICS),
    ])

    const sectionsResult =
      responses[0].status === 'fulfilled' ? responses[0].value.data : undefined
    sectionsData = Array.isArray(sectionsResult?.headers)
      ? sectionsResult.headers
      : []

    const topicsResult =
      responses[1].status === 'fulfilled' ? responses[1].value.data : undefined
    topicsData = Array.isArray(topicsResult?.topics) ? topicsResult.topics : []

    return { sectionsData, topicsData }
  } catch (err) {
    errorLogger(err)
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
  fetchStaticJsonByUrl,
}
