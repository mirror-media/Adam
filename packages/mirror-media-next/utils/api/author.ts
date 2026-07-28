import client from '../../apollo/apollo-client'
import { fetchContact } from '../../apollo/query/contact'
import { fetchPosts } from '../../apollo/query/posts'

export function fetchPostsByAuthorId(
  authorId: string,
  take: number,
  skip: number
) {
  return client.query({
    query: fetchPosts,
    variables: {
      take: take,
      skip: skip,
      orderBy: { publishedDate: 'desc' },
      filter: {
        state: { equals: 'published' },
        OR: [
          { writers: { some: { id: { equals: authorId } } } },
          { photographers: { some: { id: { equals: authorId } } } },
        ],
      },
    },
  })
}

export function fetchAuthorByAuthorId(authorId: string) {
  return client.query({
    query: fetchContact,
    variables: {
      where: { id: authorId },
    },
  })
}
