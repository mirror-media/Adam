import type { ApolloQueryResult } from '@apollo/client'
import type { AxiosResponse } from 'axios'
import axios from 'axios'

import client from '../../apollo/apollo-client'
import { fetchLatestPublishedExternals } from '../../apollo/query/externals'
import {
  API_TIMEOUT,
  URL_STATIC_DAILY_COLUMN_HEADLINES,
} from '../../config/index.mjs'

// Fetch forum headlines data from JSON URL, fallback to GQL API if JSON fails.
export async function fetchForumHeadlines(): Promise<
  AxiosResponse<unknown> | ApolloQueryResult<unknown>
> {
  try {
    const jsonRes = await axios({
      method: 'get',
      url: URL_STATIC_DAILY_COLUMN_HEADLINES,
      timeout: API_TIMEOUT,
    })
    return jsonRes
  } catch (err) {
    console.error(
      'Failed to fetch JSON of URL_STATIC_DAILY_COLUMN_HEADLINES, falling back to GQL:',
      JSON.stringify(err)
    )
  }

  // Fallback option: use GQL API
  return client.query({
    query: fetchLatestPublishedExternals,
    variables: {
      take: 3,
      partnerSlug: 'dailycolumn',
    },
  })
}
