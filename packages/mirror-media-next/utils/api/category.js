import client from '../../apollo/apollo-client'
import { fetchCategorySections } from '../../apollo/query/categroies'
import { fetchPosts } from '../../apollo/query/posts'
import axios from 'axios'
import {
  API_TIMEOUT,
  URL_STATIC_NEWS_CATEGORY_POSTS,
} from '../../config/index.mjs'

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

export async function fetchNewsCategoryPostsJSON(page = 1, take = 24) {
  const POSTS_PER_JSON = 120
  const TAKE_PER_JSON = POSTS_PER_JSON / take
  const jsonFileOrder = Math.ceil(page / TAKE_PER_JSON)
  const jsonUrl = `${URL_STATIC_NEWS_CATEGORY_POSTS}_${jsonFileOrder}.json`

  try {
    const response = await axios({
      method: 'get',
      url: jsonUrl,
      timeout: API_TIMEOUT,
    })

    const jsonIndex = (page - 1) % TAKE_PER_JSON
    const startIndex = jsonIndex * take
    const endIndex = startIndex + take
    const postItems = response.data.posts.items.slice(startIndex, endIndex)

    return {
      data: {
        posts: {
          items: jsonFileOrder <= 4 ? postItems : [],
          counts:
            response.data.posts.counts.posts +
            response.data.posts.counts.externals,
        },
      },
    }
  } catch (err) {
    console.error(
      'Failed to fetch JSON of URL_STATIC_NEWS_CATEGORY_POSTS',
      JSON.stringify(err)
    )
  }
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
