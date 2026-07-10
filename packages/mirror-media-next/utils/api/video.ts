import axios from 'axios'

import { WEEKLY_API_SERVER_YOUTUBE_ENDPOINT } from '../../config/index.mjs'

export function fetchYoutubeVideoByVideoId(videoId: string) {
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

export function fetchYoutubeLatestVideosByChannelId(channelId: string) {
  return axios({
    method: 'get',
    url: `${WEEKLY_API_SERVER_YOUTUBE_ENDPOINT}/search`,
    // use URLSearchParams to add two values for key 'part'
    params: new URLSearchParams([
      ['channelId', channelId],
      ['part', 'snippet'],
      ['order', 'date'],
      ['maxResults', '6'],
    ]),
  })
}
