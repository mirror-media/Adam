import { URL_STATIC_POST_EXTERNAL } from '@/config/index.mjs'
import { fetchStaticJsonByUrl } from '@/utils/api'

import {
  HOMEPAGE_LATEST_NEWS_FILE_COUNT,
  HOMEPAGE_MORE_NEWS_BATCH_SIZE,
} from './homepage-constants'
import { parsePostExternal } from './homepage-static-json.schema'
import type { HomepageArticle } from './homepage-types'

type HomepageLoadMoreResult = {
  articles: HomepageArticle[]
  hasMore: boolean
  nextFileNumber: number
}

async function fetchMoreHomepageNews(
  existingKeys: string[],
  startFileNumber: number
): Promise<HomepageLoadMoreResult> {
  const existingKeySet = new Set(existingKeys)
  const availableArticles: HomepageArticle[] = []
  let fileNumber = startFileNumber

  while (fileNumber <= HOMEPAGE_LATEST_NEWS_FILE_COUNT) {
    const serialNumber = String(fileNumber).padStart(2, '0')
    const response = await fetchStaticJsonByUrl<unknown>(
      `${URL_STATIC_POST_EXTERNAL}${serialNumber}.json`,
      { timeout: 5000 }
    )

    // The legacy loader only consumes files with a top-level `latest` field.
    if (Array.isArray(response.data)) {
      fileNumber += 1
      continue
    }

    const parsed = parsePostExternal(
      response.data,
      `gcs-static-json:post_external${serialNumber}`
    )

    if (!parsed) {
      fileNumber += 1
      continue
    }

    parsed.latest.forEach((article) => {
      if (existingKeySet.has(article.key)) return

      existingKeySet.add(article.key)
      availableArticles.push(article)
    })

    if (availableArticles.length > HOMEPAGE_MORE_NEWS_BATCH_SIZE) {
      return {
        articles: availableArticles.slice(0, HOMEPAGE_MORE_NEWS_BATCH_SIZE),
        hasMore: true,
        nextFileNumber: fileNumber,
      }
    }

    fileNumber += 1
  }

  return {
    articles: availableArticles.slice(0, HOMEPAGE_MORE_NEWS_BATCH_SIZE),
    hasMore: false,
    nextFileNumber: HOMEPAGE_LATEST_NEWS_FILE_COUNT + 1,
  }
}

export { fetchMoreHomepageNews }
