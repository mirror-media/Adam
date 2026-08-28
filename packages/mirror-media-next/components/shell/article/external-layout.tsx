import { useMemo } from 'react'
import Image from 'next/image'
import NextImage from 'next/image'
import { CircleDollarSignIcon } from 'lucide-react'

import ExternalArticleContent from '@/components/external/external-article-content'
import { Badge, Link, Typography } from '@/components/ui'
import { SITE_URL } from '@/config/index.mjs'
import type {
  ExternalPost,
  ExternalRelatedStory,
} from '@/modules/external/external-types'
import { getCreditsHtml, getExternalSectionTitle } from '@/utils/external'

import { CopyLinkButton } from './copy-link-button'
import { IconLink } from './icon-link'
import { PublicDate } from './public-date'
import { ThemeElement } from './theme-element'

type ExternalLayoutProps = Pick<
  ExternalPost,
  | 'title'
  | 'thumb'
  | 'thumbCaption'
  | 'brief'
  | 'content'
  | 'publishedDate'
  | 'updatedAt'
  | 'extend_byline'
  | 'partner'
  | 'tags'
  | 'tags_algo'
  | 'slug'
> & {
  allRelatedStories?: ExternalRelatedStory[]
  renderAside?: (summary: string[]) => React.ReactNode
  renderDable?: () => React.ReactNode
  renderNextUp?: () => React.ReactNode
}

const actionList = [
  {
    resource: '/images/sns-line.svg',
    label: '加入',
    href: 'https://lin.ee/dkD1s4q',
  },
  {
    resource: '/images/sns-ig.svg',
    label: '追蹤',
    href: 'https://www.instagram.com/mirror_media/',
  },
  {
    resource: '/images/yt.svg',
    label: '訂閱',
    href: 'https://www.youtube.com/channel/UCYkldEK001GxR884OZMFnRw?sub_confirmation=1',
  },
  {
    resource: '/images/sns-mm.png',
    label: '下載',
    href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/?utm_source=magzine&utm_campaign=mm_app_download&utm_medium=qrcode',
  },
] as const

export function ExternalLayout(props: ExternalLayoutProps) {
  const {
    title,
    thumb,
    thumbCaption,
    brief,
    content,
    publishedDate,
    updatedAt,
    extend_byline,
    partner,
    tags,
    tags_algo,
    slug,
    allRelatedStories = [],
    renderAside,
    renderDable,
    renderNextUp,
  } = props

  const canonicalUrl = `${SITE_URL}/external/${slug}`

  const sectionTitle = getExternalSectionTitle(partner)
  const displayTags = [...(tags ?? []), ...(tags_algo ?? [])]
  const credits = extend_byline ?? ''

  const updatedContent = useMemo(() => {
    return (content ?? '').replace(
      /<img\b[^>]*style="[^"]*?width:\s*(\d+)px;[^"]*?height:\s*(\d+)px;[^"]*?"[^>]*>/g,
      (match, width, height) => {
        const aspectRatio = (parseInt(width) / parseInt(height)).toFixed(2)
        return match.replace(
          /style="[^"]*?"/,
          `style="width: 100%; aspect-ratio: ${aspectRatio} / 1;"`
        )
      }
    )
  }, [content])

  const summary = useMemo(() => {
    const headingRegex = /<h[2-6][^>]*>([\s\S]*?)<\/h[2-6]>/gi
    return [...(content ?? '').matchAll(headingRegex)]
      .map((match) => match[1].replace(/<[^>]+>/g, '').trim())
      .filter((text) => !!text)
  }, [content])

  return (
    <div className="grid max-w-7xl pt-4 md:grid-cols-12 xl:mx-auto xl:gap-x-14">
      <article className="relative col-span-full grid grid-cols-subgrid gap-x-0 gap-y-7 md:mx-6 xl:col-span-8 xl:mr-0 xl:ml-10 2xl:ml-0">
        <div className="order-1 col-span-full flex items-center justify-center md:col-span-3 md:justify-start lg:col-span-2">
          <Link href="/">
            <Typography
              as="span"
              variant="subtitle"
              className="text-mm-base-500"
            >
              首頁
            </Typography>
          </Link>
          {sectionTitle && (
            <>
              <span className="text-mm-base-500">／</span>
              <Typography
                as="span"
                variant="subtitle"
                className="text-mm-base-700"
              >
                {sectionTitle}
              </Typography>
            </>
          )}
        </div>

        <Typography
          as="h1"
          variant="h1"
          className="order-2 col-span-full md:order-3"
        >
          {title}
        </Typography>
        <PublicDate
          className="order-3 col-span-full ml-2 md:col-span-6 xl:col-span-5"
          publishedDate={publishedDate}
          updatedAt={updatedAt}
        />
        <div className="sticky top-27 z-1 order-4 col-span-full flex justify-end gap-x-3 bg-white p-2 md:static md:col-start-7 md:py-0 xl:col-start-6">
          <IconLink
            href="https://google.com/preferences/source?q=mirrormedia.mg"
            className="flex h-7 items-center rounded-full border px-1.5 py-1 md:gap-1 md:px-2.5"
          >
            <Image
              width={14}
              height={14}
              src="/images/google-logo.svg"
              alt="google-logo"
            />
            <ThemeElement
              as="span"
              className="GTM-click-preferred-source hidden w-13 text-[0.5rem] font-medium md:block"
            >
              加入為Google 偏好來源
            </ThemeElement>
          </IconLink>
          <IconLink
            href={`https://www.facebook.com/share.php?u=${canonicalUrl}`}
            src="/images/fb-logo.svg"
            alt="facebook-logo"
            rel="noopener noreferrer"
            target="_blank"
          />
          <IconLink
            href={`https://social-plugins.line.me/lineit/share?url=${canonicalUrl}`}
            src="/images/line-logo.svg"
            alt="line-logo"
            rel="noopener noreferrer"
            target="_blank"
          />
          <IconLink
            href={`https://www.threads.com/intent/post?url=${encodeURIComponent(
              canonicalUrl
            )}`}
            className="rounded-full bg-black"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              width={28}
              height={28}
              src="/images/threads-logo.svg"
              alt="threads-logo"
              className="scale-70 transform invert-100"
            />
          </IconLink>
          <CopyLinkButton
            renderContent={() => (
              <ThemeElement
                as="span"
                theme="accent"
                className="rounded-lg px-4 py-2 text-mm-neutral-100 md:text-xl"
              >
                已複製連結
              </ThemeElement>
            )}
          >
            <NextImage
              width={28}
              height={28}
              src="/images/link-logo.svg"
              alt="link-logo"
            />
          </CopyLinkButton>
        </div>
        {partner?.showThumb && thumb && (
          <figure className="order-5 col-span-full">
            <picture className="relative block aspect-3/2">
              <Image
                fill
                src={thumb}
                alt={thumbCaption ?? title ?? ''}
                fetchPriority="high"
              />
            </picture>
            {thumbCaption && (
              <Typography
                as="figcaption"
                variant="caption-l"
                className="pt-2 text-center text-mm-neutral-500 md:text-start"
              >
                {thumbCaption}
              </Typography>
            )}
          </figure>
        )}
        {credits.length > 0 && (
          <section className="order-6 flex items-center justify-center pt-9 pb-5 md:order-2 md:col-span-3 md:justify-start md:py-0 lg:py-0">
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              文｜
              {partner?.slug ? (
                <Link
                  className="text-mm-base-700 underline"
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`/externals/${partner.slug}`}
                >
                  {getCreditsHtml(credits)}
                </Link>
              ) : (
                getCreditsHtml(credits)
              )}
            </Typography>
          </section>
        )}
        {partner?.showBrief && brief && (
          <ThemeElement
            className="order-7 col-span-full mx-2 rounded-md px-2.5 py-4 md:mx-0"
            as="blockquote"
            theme="post"
          >
            <div dangerouslySetInnerHTML={{ __html: brief }} />
          </ThemeElement>
        )}
        <div className="order-8 col-span-full flex flex-col gap-y-7 md:gap-y-8">
          <ExternalArticleContent
            content={updatedContent}
            allRelatedStories={allRelatedStories}
          />
        </div>
        <div className="order-9 col-span-full mx-8 flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <Link
              key={`tag-${tag?.name ?? index}`}
              href={`/tag/${tag?.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              <Badge>{tag?.name}</Badge>
            </Link>
          ))}
        </div>
        {renderNextUp && (
          <section className="order-10 col-span-full mx-2 md:mx-0">
            {renderNextUp()}
          </section>
        )}
        <div className="order-11 col-span-full grid gap-y-5 md:grid-cols-12">
          <div className="flex items-center justify-center gap-x-3 md:col-span-4 md:justify-start">
            <Link
              href="/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-x-1 rounded-full border-mm-base-700 bg-mm-base-700 px-3 py-2 hover:bg-mm-base-600"
            >
              <CircleDollarSignIcon className="size-4 text-mm-neutral-0" />
              <Typography
                as="span"
                className="text-sm leading-none font-normal text-mm-neutral-0"
              >
                贊助本文
              </Typography>
            </Link>
            <Link
              href="/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Typography
                as="span"
                className="items-center gap-x-1 rounded-full border-mm-second-700 bg-mm-second-700 px-3 py-2 text-sm leading-[1.125] font-normal text-mm-neutral-0 hover:bg-mm-second-600"
              >
                加入訂閱會員
              </Typography>
            </Link>
          </div>
          <ul className="flex justify-around space-x-3 md:col-span-6 md:col-start-7 md:space-x-4 xl:col-span-6 xl:col-start-8">
            {actionList.map((item) => (
              <li key={item.label}>
                <IconLink
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-x-2"
                >
                  <Image
                    width={32}
                    height={32}
                    src={item.resource}
                    alt={item.label}
                  />
                  <Typography
                    as="span"
                    variant="subtitle"
                    className="text-mm-base-700"
                  >
                    {item.label}
                  </Typography>
                </IconLink>
              </li>
            ))}
          </ul>
        </div>
        <ThemeElement
          as="section"
          theme="accent"
          className="order-12 col-span-full rounded-lg p-8 pb-10 text-lg"
        >
          鏡週刊掌握趨勢，領先一步：
          從國際大事到生活小確幸，我們確保您不錯過任何一個重要瞬間，誠摯邀請您
          <Link
            href="https://www.mirrormedia.mg/login?destination=https%3A%2F%2Fwww.mirrormedia.mg%2Fmagazine"
            className="text-lg text-mm-second-200 underline"
          >
            立即加入閱讀
          </Link>
          。
        </ThemeElement>
        <div className="order-13 col-span-full">{renderDable?.()}</div>
      </article>

      <aside className="hidden gap-y-4 md:mr-6 xl:col-span-4 xl:mr-10 xl:block xl:space-y-6 2xl:mr-0">
        {renderAside?.(summary)}
      </aside>
    </div>
  )
}
