import { gql } from '@apollo/client'
import { promoteVideo } from '../fragments/promote-video.js'

const fetchPromoteVideos = gql`
  ${promoteVideo}
  query ($take: Int, $orderBy: [PromoteVideoOrderByInput!]) {
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
      ...promoteVideo
    }
  }
`

export { fetchPromoteVideos }
