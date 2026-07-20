import type {
  YoutubeRawPlaylistVideo,
  YoutubeRawSearchedVideo,
  YoutubeRawVideo,
  YoutubeVideo,
} from '../type/youtube'

function simplifyYoutubeSearchedVideo(
  videos: YoutubeRawSearchedVideo[]
): YoutubeVideo[] {
  return videos.map((video) => ({
    id: video.id.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    channelId: video.snippet.channelId,
  }))
}

function simplifyYoutubePlaylistVideo(
  videos: YoutubeRawPlaylistVideo[]
): YoutubeVideo[] {
  return videos.map((video) => ({
    id: video.snippet.resourceId.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    channelId: video.snippet.channelId,
  }))
}

function simplifyYoutubeVideo(videos: YoutubeRawVideo[]): YoutubeVideo[] {
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
 */

const extractYouTubeId = (url: string): string => {
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
