import Link from 'next/link'

import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'

import type { HomepageArticle } from '../homepage-types'

import { ArticleImage } from './article-image'
import { homepageCardHoverClass } from './homepage-card-styles'
import { SectionTitle } from './section-title'

type HeadlineListProps = {
  articles: HomepageArticle[]
  className?: string
  title: string
  titleId: string
}

function HeadlineList({
  articles,
  className,
  title,
  titleId,
}: HeadlineListProps) {
  if (!articles.length) return null

  return (
    <section aria-labelledby={titleId} className={className}>
      <SectionTitle id={titleId}>{title}</SectionTitle>
      <ol className="mt-mm-xl xl:mt-mm-l">
        {articles.slice(0, 8).map((article) => (
          <li
            className="border-t border-mm-neutral-300 py-mm-m"
            key={article.key}
          >
            <Link
              className={cn(
                'group grid min-h-16 grid-cols-[96px_minmax(0,1fr)] items-center gap-mm-m xl:gap-mm-l',
                homepageCardHoverClass
              )}
              href={article.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="relative block h-16 w-24 overflow-hidden bg-mm-neutral-100">
                <ArticleImage alt="" sizes="96px" src={article.imageUrl} />
              </span>
              <Typography
                as="h3"
                className="line-clamp-2 text-mm-neutral-700 group-hover:underline"
                variant="body-l"
              >
                {article.title}
              </Typography>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { HeadlineList }
