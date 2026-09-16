import client from '../../apollo/apollo-client'
import { fetchCategorySections } from '../../apollo/query/categories'
import { fetchPosts } from '../../apollo/query/posts'

export function fetchPostsByCategorySlug(
  categorySlug: string,
  take: number,
  skip: number
) {
  return client.query({
    query: fetchPosts,
    variables: {
      take,
      skip,
      orderBy: { publishedDate: 'desc' },
      filter: {
        state: { equals: 'published' },
        categories: { some: { slug: { equals: categorySlug } } },
      },
    },
  })
}

export function fetchPremiumPostsByCategorySlug(
  categorySlug: string,
  take: number,
  skip: number
) {
  return client.query({
    query: fetchPosts,
    variables: {
      take,
      skip,
      orderBy: { publishedDate: 'desc' },
      filter: {
        state: { equals: 'published' },
        categories: { some: { slug: { equals: categorySlug } } },
        isMember: { equals: true },
      },
    },
  })
}

export function fetchCategoryByCategorySlug(categorySlug: string) {
  return client.query({
    query: fetchCategorySections,
    variables: {
      categorySlug,
    },
  })
}
