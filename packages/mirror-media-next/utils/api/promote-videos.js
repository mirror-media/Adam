import axios from 'axios'

import client from '../../apollo/apollo-client'
import { fetchPromoteVideos } from '../../apollo/query/promote-videos'
import { API_TIMEOUT, URL_STATIC_PROMOTE_VIDEOS } from '../../config/index.mjs'

/**
 * Fetch promote videos data from JSON URL, fallback to GQL API if JSON fails.
 */
export async function fetchPromoteVideosList() {
  try {
    const jsonRes = await axios({
      method: 'get',
      url: URL_STATIC_PROMOTE_VIDEOS,
      timeout: API_TIMEOUT,
    })
    return jsonRes
  } catch (err) {
    console.error(
      'Failed to fetch JSON of URL_STATIC_PROMOTE_VIDEOS, falling back to GQL:',
      JSON.stringify(err)
    )
  }

  // Fallback option: use GQL API
  return client.query({
    query: fetchPromoteVideos,
    variables: {
      take: 6,
      orderBy: [{ order: 'asc' }],
    },
  })
}
