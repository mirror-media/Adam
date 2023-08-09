import axios from 'axios'
import { WEEKLY_API_SERVER_YOUTUBE_ENDPOINT } from '../../config/index.mjs'
import client from '../../apollo/apollo-client'
import { fetchSectionWithCategory } from '../../apollo/query/sections'

/**
 * fetch highest VC video published in latest one week in Mirror Media Channel
 */
export function fetchYoutubeHighestViewCountInOneWeek() {
  const date = new Date()
  // 1 week ago
  date.setDate(date.getDate() - 7)
  const oneWeekAgoTS = date.toISOString()
  return fetchYoutubeHighestViewCountAfterTS(oneWeekAgoTS)
}

/**
 * fetch highest VC video published after [ts] in Mirror Media channel
 * @param {string} ts - ISO timestamp string, ex: 2023-06-13T12:53:54.422Z
 */
function fetchYoutubeHighestViewCountAfterTS(ts) {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/search`,
    params: new URLSearchParams([
      ['channelId', 'UCYkldEK001GxR884OZMFnRw'],
      ['part', 'snippet'],
      ['order', 'viewCount'],
      ['maxResults', '1'],
      ['publishedAfter', ts],
      ['type', 'video'],
    ]),
  })
}

/**
 * fetch video for full data like non-truncated snippet.description
 * @param {string} videoId
 */
export function fetcYoutubeVideoForFullDescription(videoId) {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/videos`,
    // use URLSearchParams to add two values for key 'part'
    params: new URLSearchParams([
      ['id', videoId],
      ['part', 'snippet'],
      ['part', 'status'],
      ['maxResults', '1'],
    ]),
  })
}

/**
 * fetch latest four video in Mirror Media channel
 */
export function fetchYoutubeLatestVideos() {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/search`,
    params: new URLSearchParams([
      ['channelId', 'UCYkldEK001GxR884OZMFnRw'],
      ['part', 'snippet'],
      ['order', 'date'],
      ['maxResults', '4'],
      ['type', 'video'],
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
