import axios from 'axios'

import client from '../../apollo/apollo-client'
import { fetchCategory } from '../../apollo/query/categories'
import { WEEKLY_API_SERVER_YOUTUBE_ENDPOINT } from '../../config/index.mjs'

export function fetchYoutubePlaylistByPlaylistId(
  playlistId: string,
  nextToken = ''
) {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/playlistItems`,
    // use URLSearchParams to add two values for key 'part'
    params: new URLSearchParams([
      ['playlistId', playlistId],
      ['part', 'snippet'],
      ['part', 'status'],
      ['maxResults', '15'],
      ['pageToken', nextToken],
    ]),
  })
}

export function fetchVideoCategory(videoCategorySlug: string) {
  return client.query({
    query: fetchCategory,
    variables: {
      categorySlug: videoCategorySlug,
    },
  })
}
