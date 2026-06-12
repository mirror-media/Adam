import { gql } from '@apollo/client'

import { tag } from '../fragments/tag'

const fetchTag = gql`
  ${tag}
  query fetchTag($where: TagWhereUniqueInput!) {
    tag(where: $where) {
      ...tag
    }
  }
`

export { fetchTag }
