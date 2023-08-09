import client from '../../apollo/apollo-client'
import { fetchCategorySections } from '../../apollo/query/categroies'
import { fetchPosts } from '../../apollo/query/posts'

export function fetchPostsByCategorySlug(categorySlug, take, skip) {
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

export function fetchPremiumPostsByCategorySlug(categorySlug, take, skip) {
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

export function fetchCategoryByCategorySlug(categorySlug) {
  return client.query({
    query: fetchCategorySections,
    variables: {
      categorySlug,
    },
  })
}
