import { gql } from '@apollo/client'
import { simpleTopic, topic } from '../fragments/topic'

const fetchTopics = gql`
  ${simpleTopic}
  query (
    $take: Int
    $skip: Int
    $orderBy: [TopicOrderByInput!]!
    $filter: TopicWhereInput!
  ) {
    topicsCount(where: $filter)
    topics(take: $take, skip: $skip, orderBy: $orderBy, where: $filter) {
      ...simpleTopic
    }
  }
`

const fetchTopic = gql`
  ${topic}
  query (
    $topicFilter: TopicWhereInput!
    $postsFilter: PostWhereInput!
    $postsOrderBy: [PostOrderByInput!]!
    $postsTake: Int
    $postsSkip: Int!
  ) {
    topics(where: $topicFilter) {
      ...topic
    }
  }
`

export { fetchTopics, fetchTopic }
