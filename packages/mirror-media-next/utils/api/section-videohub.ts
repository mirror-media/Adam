import axios from 'axios'

import client from '../../apollo/apollo-client'
import { fetchSectionWithCategory } from '../../apollo/query/sections'
import { WEEKLY_API_SERVER_YOUTUBE_ENDPOINT } from '../../config/index.mjs'

export function fetchYoutubeLatestVideos() {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/search`,
    params: new URLSearchParams([
      ['channelId', 'UCYkldEK001GxR884OZMFnRw'],
      ['part', 'snippet'],
      ['order', 'date'],
      ['maxResults', '50'],
      ['type', 'video'],
    ]),
  })
}

export function fetchYoutubeVideosWithStatistics(ids: string) {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/videos`,
    params: new URLSearchParams([
      ['part', 'snippet'],
      ['part', 'statistics'],
      ['part', 'status'],
      ['id', ids],
    ]),
  })
}

export function fetchVideohubSection() {
  return client.query({
    query: fetchSectionWithCategory,
    variables: {
      where: {
        slug: 'videohub',
      },
    },
  })
}

export function fetchYoutubePlaylistByChannelId(channelId: string) {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/playlistItems`,
    // use URLSearchParams to add two values for key 'part'
    params: new URLSearchParams([
      ['playlistId', channelId],
      ['part', 'snippet'],
      ['part', 'status'],
      ['maxResults', '10'],
      ['pageToken', ''],
    ]),
  })
}
