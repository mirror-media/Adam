type PodcastEnclosure = {
  file_size: number
  mime_type: string
  url: string
}

type Podcast = {
  author: string
  description: string
  duration: string
  enclosures: PodcastEnclosure[]
  guid: string
  heroImage: string
  link: string
  published: string
  title: string
}

export type { Podcast, PodcastEnclosure }
