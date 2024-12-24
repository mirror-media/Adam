/**
 * @param {import("../type/youtube").YoutubeRawSearchedVideo[]} videos
 * @returns {import("../type/youtube").YoutubeVideo[]}
 */
function simplifyYoutubeSearchedVideo(videos) {
  return videos.map((video) => ({
    id: video.id.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    channelId: video.snippet.channelId,
  }))
}

/**
 * @param {import("../type/youtube").YoutubeRawPlaylistVideo[]} videos
 * @returns {import("../type/youtube").YoutubeVideo[]}
 */
function simplifyYoutubePlaylistVideo(videos) {
  return videos.map((video) => ({
    id: video.snippet.resourceId.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    channelId: video.snippet.channelId,
  }))
}

export { simplifyYoutubeSearchedVideo, simplifyYoutubePlaylistVideo }

/**
 * @param {import("../type/youtube").YoutubeRawVideo[]} videos
 * @returns {import("../type/youtube").YoutubeVideo[]}
 */
export function simplifyYoutubeVideo(videos) {
  return (
    videos
      .filter((video) => video)
      .map((video) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt,
        channelId: video.snippet.channelId,
      })) ?? []
  )
}
