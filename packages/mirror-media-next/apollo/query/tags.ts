import { graphql } from '../__generated__/content'

const fetchTag = graphql(`
  query fetchTag($where: TagWhereUniqueInput!) {
    tag(where: $where) {
      ...tag
    }
  }
`)

export { fetchTag }
