import { z } from 'zod'

import { MISO_ENDPOINTS } from '@/config/index.mjs'
import { buildMisoUrl, misoFetch } from '@/utils/miso'
import { monitorZodSafeParse } from '@/utils/zod-monitor'

/**
 * miso api 的回應中位數 822ms、最慢量到 1754ms，用 prod 的 API_TIMEOUT（1500）會有約一成的關鍵字取不到值。
 */
const TIMEOUT = 3000

export type SearchMeta = {
  latestTitle: string
  total: number
}

/** 只描述用得到的欄位，Miso 還會回 snippet、facet_counts 等。 */
const misoSearchSchema = z.object({
  data: z.object({
    products: z.array(z.object({ title: z.string() })),
    total: z.number(),
  }),
})

/**
 * 搜尋頁 meta description 用：某個關鍵字的總篇數，以及最新發佈那篇的標題。
 */
export async function fetchSearchMeta(
  keyword: string
): Promise<SearchMeta | null> {
  if (!keyword) {
    return null
  }

  try {
    const response = await misoFetch(
      buildMisoUrl(MISO_ENDPOINTS.search),
      {
        q: keyword,
        // 跟 miso-search.tsx 的 useApi 一致，只搜 story。
        fq: 'product_id:/mirrormedia_story_.+/',
        fl: ['title'],
        rows: 1,
        /**
         * 跟 widget 排序選單的「由新到舊」送出同樣的東西，這頁的第一篇才會跟這裡取到的一致。
         */
        order_by: 'published_at',
        anonymous_id: 'mirrormedia_search_meta',
      },
      AbortSignal.timeout(TIMEOUT)
    )

    if (!response.ok) {
      console.log(
        JSON.stringify({
          severity: 'NOTICE',
          message: `Miso search API responded ${response.status}`,
          debugPayload: { keyword },
        })
      )
      return null
    }

    const result = monitorZodSafeParse(
      misoSearchSchema,
      await response.json(),
      {
        boundary: 'miso:ask/search',
        schemaName: 'misoSearchSchema',
      }
    )

    if (!result.success) {
      return null
    }

    const { products, total } = result.data.data
    const latestTitle = products.at(0)?.title

    if (total <= 0 || !latestTitle) {
      return null
    }

    return { latestTitle, total }
  } catch (error) {
    console.error(error)
    return null
  }
}
