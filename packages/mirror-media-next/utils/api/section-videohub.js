import axios from 'axios'
import { WEEKLY_API_SERVER_YOUTUBE_ENDPOINT } from '../../config/index.mjs'
import client from '../../apollo/apollo-client'
import { fetchSectionWithCategory } from '../../apollo/query/sections'

/**
 * fetch latest 50 videos in Mirror Media channel
 */
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

/**
 * fetch youtube videos' statistics info
 * @param {string} ids
 */
export function fetchYoutubeVideosWithStatistics(ids) {
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

/**
 * fetch section data for videohub
 */
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

export function fetchYoutubePlaylistByChannelId(channelId) {
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
