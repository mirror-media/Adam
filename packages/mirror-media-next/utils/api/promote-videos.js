import client from '../../apollo/apollo-client'
import { fetchPromoteVideos } from '../../apollo/query/promote-videos'

/**
 * @param {number} take
 * @param {('asc' | 'desc')} orderDirection
 */
export function fetchPromoteVideosList(take = 6, orderDirection = 'asc') {
  return client.query({
    query: fetchPromoteVideos,
    variables: {
      take,
      orderBy: [{ order: orderDirection }],
    },
  })
}
