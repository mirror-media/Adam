import Link from 'next/link'

import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'

import type { HomepageCategory } from '../homepage-types'

import { ArticleImage } from './article-image'
import { homepageCardHoverClass } from './homepage-card-styles'

type CategoryLatestGridProps = {
  categories: HomepageCategory[]
}

function CategoryLatestGrid({ categories }: CategoryLatestGridProps) {
  const visibleCategories = categories.filter(
    (category) => category.articles.length > 0
  )

  if (!visibleCategories.length) return null

  return (
    <section aria-label="分類最新">
      <div className="grid grid-cols-1 gap-mm-2xl md:grid-cols-2 md:gap-x-mm-5xl md:gap-y-mm-3xl">
        {visibleCategories.map((category) => {
          const [featuredArticle, ...otherArticles] = category.articles

          return (
            <article
              className={cn(
                'flex min-h-[340px] flex-col',
                homepageCardHoverClass
              )}
              key={category.slug}
            >
              <Typography
                as="h2"
                className="w-fit rounded-mm-xs bg-mm-base-600 px-mm-l py-[3px] text-mm-second-100"
                variant="subtitle"
              >
                {category.name}
              </Typography>

              <div className="mt-mm-xl flex flex-1 flex-col gap-mm-4xl">
                {featuredArticle && (
                  <Link
                    className="group grid grid-cols-[108px_minmax(0,1fr)] gap-mm-3xl"
                    href={featuredArticle.href}
                  >
                    <span className="relative block h-[77px] w-[108px] overflow-hidden bg-mm-neutral-100">
                      <ArticleImage
                        alt=""
                        sizes="108px"
                        src={featuredArticle.imageUrl}
                      />
                    </span>
                    <Typography
                      as="h3"
                      className="line-clamp-2 text-mm-neutral-700 group-hover:underline"
                      variant="h5"
                    >
                      {featuredArticle.title}
                    </Typography>
                  </Link>
                )}

                {otherArticles.slice(0, 2).map((article) => (
                  <Link
                    className="group block"
                    href={article.href}
                    key={article.key}
                  >
                    <Typography
                      as="h3"
                      className="line-clamp-2 text-mm-neutral-700 group-hover:underline"
                      variant="h5"
                    >
                      {article.title}
                    </Typography>
                  </Link>
                ))}
              </div>

              <div className="mt-mm-4xl flex items-center justify-between">
                <span className="h-px w-1/2 bg-mm-neutral-500" />
                <Link
                  className="rounded-mm-xs font-mm-sans text-mm-h5 text-mm-neutral-800 underline underline-offset-2 outline-none hover:text-mm-second-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-900 focus-visible:outline-solid"
                  href={category.href}
                >
                  看更多
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export { CategoryLatestGrid }
