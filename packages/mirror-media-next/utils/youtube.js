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

/**
 * @param {import("../type/youtube").YoutubeRawVideo[]} videos
 * @returns {import("../type/youtube").YoutubeVideo[]}
 */
function simplifyYoutubeVideo(videos) {
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

/**
 * Extracts the YouTube video ID from a given URL.
 * @param {string} url
 * @returns {string} The extracted video ID, or an empty string if not found.
 */

const extractYouTubeId = (url) => {
  const match = url?.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )

  return match ? match[1] : ''
}

export {
  extractYouTubeId,
  simplifyYoutubePlaylistVideo,
  simplifyYoutubeSearchedVideo,
  simplifyYoutubeVideo,
}
