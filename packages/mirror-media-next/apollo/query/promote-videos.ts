import { graphql } from '../__generated__/content'

const fetchPromoteVideos = graphql(`
  query fetchPromoteVideos($take: Int, $orderBy: [PromoteVideoOrderByInput!]) {
    promoteVideos(
      where: {
        state: { equals: "published" }
        OR: [
          { videoLink: { contains: "youtube.com" } }
          { videoLink: { contains: "youtu.be" } }
        ]
      }
      take: $take
      orderBy: $orderBy
    ) {
      id
      videoLink
    }
  }
`)

export { fetchPromoteVideos }
