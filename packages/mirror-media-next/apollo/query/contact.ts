import { graphql } from '../__generated__/content'

const fetchContact = graphql(`
  query fetchContact($where: ContactWhereUniqueInput!) {
    contact(where: $where) {
      ...contact
    }
  }
`)

export { fetchContact }
