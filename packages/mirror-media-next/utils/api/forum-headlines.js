import axios from 'axios'

import client from '../../apollo/apollo-client'
import {
  API_TIMEOUT,
  URL_STATIC_DAILY_COLUMN_HEADLINES,
} from '../../config/index.mjs'
import { fetchLatestPublishedExternals } from '../../apollo/query/externals'

/**
 * Fetch promote videos data from JSON URL, fallback to GQL API if JSON fails.
 */
export async function fetchForumHeadlines() {
  const jsonData = await axios({
    method: 'get',
    url: URL_STATIC_DAILY_COLUMN_HEADLINES,
    timeout: API_TIMEOUT,
  }).catch((err) => {
    console.error('Failed to fetch JSON, falling back to GQL:', err)
    return null
  })

  if (jsonData) return jsonData

  // Fallback option: use GQL API
  return client.query({
    query: fetchLatestPublishedExternals,
    variables: {
      take: 3,
      partnerSlug: 'dailycolumn',
    },
  })
}
