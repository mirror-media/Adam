import Image from 'next/legacy/image'

import type { ListingPost } from '@/apollo/fragments/post'
import { fetchNewsCategoryPostsJSON } from '@/modules/category/category-data'
import type { CategorySummary } from '@/modules/category/category-types'
import { ArticleList } from '@/modules/list-article/components/article-list'
import LoadingPage from '@/public/images-next/loading_page.gif'
import {
  fetchPostsByCategorySlug,
  fetchPremiumPostsByCategorySlug,
} from '@/utils/api/category'

import InfiniteScrollList from '../infinite-scroll-list'

type CategoryArticlesProps = {
  category: CategorySummary
  isNewsCategory: boolean
  isPremium: boolean
  posts: ListingPost[]
  postsCount: number
  renderPageSize: number
}

export default function CategoryArticles({
  category,
  isNewsCategory,
  isPremium,
  posts,
  postsCount,
  renderPageSize,
}: CategoryArticlesProps) {
  const fetchPageSize = renderPageSize * 2

  async function fetchPostsFromPage(page: number) {
    if (!category?.slug) {
      return
    }

    const take = fetchPageSize
    const skip = (page - 1) * take

    try {
      if (isPremium) {
        const { data } = await fetchPremiumPostsByCategorySlug(
          category.slug,
          take,
          skip
        )
        return (data.posts ?? []) as unknown as ListingPost[]
      }

      if (isNewsCategory) {
        const { items } = await fetchNewsCategoryPostsJSON(page, take)
        return items
      }

      const { data } = await fetchPostsByCategorySlug(category.slug, take, skip)
      return (data.posts ?? []) as unknown as ListingPost[]
    } catch (error) {
      // [to-do]: use beacon api to log error on gcs
      console.error(error)
      return
    }
  }

  const loader = (
    <div
      key={0}
      className="mx-auto mt-mm-2xl pb-mm-2xl text-center legacy-xl:mt-16 legacy-xl:pb-16"
    >
      <Image src={LoadingPage} alt="loading page" />
    </div>
  )

  return (
    <InfiniteScrollList
      initialList={posts}
      renderAmount={renderPageSize}
      fetchCount={Math.ceil(postsCount / fetchPageSize)}
      fetchListInPage={fetchPostsFromPage}
      loader={loader}
    >
      {(renderList) => (
        <ArticleList
          // `InfiniteScrollList` declares its render list as `Object[]`, a
          // JSDoc type in untyped JavaScript. Correcting it is a separate
          // change.
          renderList={renderList as ListingPost[]}
          section={category.sections[0]}
        />
      )}
    </InfiniteScrollList>
  )
}
