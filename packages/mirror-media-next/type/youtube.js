export default {}

/**
 * @typedef {Object} YoutubeRawSearchedVideo
 * @property {string} kind
 * @property {string} etag
 * @property {Object} id
 * @property {string} id.kind
 * @property {string} id.videoId
 * @property {Object} snippet
 * @property {string} snippet.publishedAt
 * @property {string} snippet.channelId
 * @property {string} snippet.title
 * @property {string} snippet.description
 * @property {Object} snippet.thumbnails
 * @property {Object} snippet.thumbnails.default
 * @property {string} snippet.thumbnails.default.url
 * @property {number} snippet.thumbnails.default.width
 * @property {number} snippet.thumbnails.default.height
 * @property {Object} snippet.thumbnails.medium
 * @property {string} snippet.thumbnails.medium.url
 * @property {number} snippet.thumbnails.medium.width
 * @property {number} snippet.thumbnails.medium.height
 * @property {Object} snippet.thumbnails.high
 * @property {string} snippet.thumbnails.high.url
 * @property {number} snippet.thumbnails.high.width
 * @property {number} snippet.thumbnails.high.height
 * @property {string} snippet.channelTitle
 * @property {string} snippet.liveBroadcastContent
 * @property {string} snippet.publishTime
 */

/**
 * @typedef {Object} YoutubeRawPlaylistVideo
 * @property {string} kind
 * @property {string} etag
 * @property {string} id
 * @property {Object} snippet
 * @property {string} snippet.publishedAt
 * @property {string} snippet.channelId
 * @property {string} snippet.title
 * @property {string} snippet.description
 * @property {Object} snippet.thumbnails
 * @property {Object} snippet.thumbnails.default
 * @property {string} snippet.thumbnails.default.url
 * @property {number} snippet.thumbnails.default.width
 * @property {number} snippet.thumbnails.default.height
 * @property {Object} snippet.thumbnails.medium
 * @property {string} snippet.thumbnails.medium.url
 * @property {number} snippet.thumbnails.medium.width
 * @property {number} snippet.thumbnails.medium.height
 * @property {Object} snippet.thumbnails.high
 * @property {string} snippet.thumbnails.high.url
 * @property {number} snippet.thumbnails.high.width
 * @property {number} snippet.thumbnails.high.height
 * @property {Object} snippet.thumbnails.standard
 * @property {string} snippet.thumbnails.standard.url
 * @property {number} snippet.thumbnails.standard.width
 * @property {number} snippet.thumbnails.standard.height
 * @property {Object} snippet.resourceId
 * @property {string} snippet.resourceId.kind
 * @property {string} snippet.resourceId.videoId
 * @property {Object} status
 * @property {string} status.privacyStatus
 */

/**
 * @typedef {Object} YoutubeRawVideo
 * @property {string} kind
 * @property {string} etag
 * @property {string} id
 * @property {Object} snippet
 * @property {string} snippet.publishedAt - format: 2021-08-24T22:00:16Z
 * @property {string} snippet.channelId
 * @property {string} snippet.title
 * @property {string} snippet.description
 * @property {Object} snippet.thumbnails
 * @property {Object} snippet.thumbnails.default
 * @property {string} snippet.thumbnails.default.url
 * @property {number} snippet.thumbnails.default.width
 * @property {number} snippet.thumbnails.default.height
 * @property {Object} snippet.thumbnails.medium
 * @property {string} snippet.thumbnails.medium.url
 * @property {number} snippet.thumbnails.medium.width
 * @property {number} snippet.thumbnails.medium.height
 * @property {Object} snippet.thumbnails.high
 * @property {string} snippet.thumbnails.high.url
 * @property {number} snippet.thumbnails.high.width
 * @property {number} snippet.thumbnails.high.height
 * @property {Object} snippet.thumbnails.standard
 * @property {string} snippet.thumbnails.standard.url
 * @property {number} snippet.thumbnails.standard.width
 * @property {number} snippet.thumbnails.standard.height
 * @property {Object} snippet.thumbnails.maxres
 * @property {string} snippet.thumbnails.maxres.url
 * @property {number} snippet.thumbnails.maxres.width
 * @property {number} snippet.thumbnails.maxres.height
 * @property {string} snippet.channelTitle
 * @property {string[]} snippet.tags
 * @property {string} snippet.categoryId
 * @property {string} snippet.liveBroadcastContent
 * @property {Object} status
 * @property {string} status.uploadStatus
 * @property {string} status.privacyStatus
 * @property {string} status.license
 * @property {boolean} status.embeddable
 * @property {boolean} status.publicStatsViewable
 * @property {boolean} status.madeForKids
 *
 */

/**
 * @typedef {Object} YoutubeVideo
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} thumbnail
 * @property {string} publishedAt - format: 2021-08-24T22:00:16Z
 * @property {string} channelId
 */
