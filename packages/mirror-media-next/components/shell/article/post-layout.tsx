import { ReactNode, useMemo } from 'react'
import NextImage from 'next/image'
import { CircleDollarSignIcon } from 'lucide-react'

import { Badge, Link, Typography } from '@/components/ui'
import { SITE_URL } from '@/config/index.mjs'
import { RelatedStory, StoryPost } from '@/modules/story/story-types'

import { Blocks } from './blocks'
import { IconLink } from './icon-link'
import NextResponsiveImage from './next-responsive-image'
import { PublicDate } from './public-date'
import { RelativePostLink } from './relative-post-link'
import { type ElementVariantProps, ThemeElement } from './theme-element'

type PostLayoutProps = Pick<
  StoryPost,
  | 'categories'
  | 'title'
  | 'subtitle'
  | 'isAdvertised'
  | 'publishedDate'
  | 'updatedAt'
  | 'heroImage'
  | 'heroCaption'
  | 'photographers'
  | 'camera_man'
  | 'designers'
  | 'engineers'
  | 'vocals'
  | 'extend_byline'
  | 'writers'
  | 'brief'
  | 'content'
  | 'tags'
  | 'relatedsOne'
  | 'relatedsTwo'
  | 'slug'
  | 'sections'
> & {
  relativeStory: RelatedStory
  renderAside?: (summary: string[]) => React.ReactNode
  renderDable?: () => React.ReactNode
  renderNextUp?: () => React.ReactNode
  renderAdInContent?: () => React.ReactNode
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

export default function PostLayout(props: PostLayoutProps) {
  const {
    categories,
    sections,
    title,
    isAdvertised,
    publishedDate,
    updatedAt,
    heroImage,
    heroCaption,
    photographers,
    camera_man,
    designers,
    engineers,
    vocals,
    extend_byline,
    writers,
    brief,
    content,
    tags,
    relatedsOne,
    relatedsTwo,
    slug,
    relativeStory,
    renderAdInContent,
    renderAside,
    renderNextUp,
    renderDable,
  } = props

  const theme: ElementVariantProps['theme'] = isAdvertised
    ? 'marketing'
    : 'post'

  const canonicalUrl = `${SITE_URL}/story/${slug}`
  const mainCategory = sections?.[0]
  const subCategories = categories?.[0]

  const summary = useMemo(() => {
    return content.blocks
      .filter((text) =>
        [
          'header-two',
          'header-three',
          'header-four',
          'header-five',
          'header-six',
        ].includes(text.type)
      )
      .map((block) => block?.text)
      .filter((text) => !!text)
  }, [content])

  return (
    <div className="grid max-w-7xl pt-4 md:grid-cols-12 xl:mx-auto xl:gap-x-14">
      <article className="col-span-full grid grid-cols-subgrid gap-x-0 gap-y-7 md:mx-6 xl:col-span-8 xl:mr-0 xl:ml-10 2xl:ml-0">
        {!isAdvertised && categories && Array.isArray(categories) && (
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

            <span className="text-mm-base-500">／</span>
            <Link
              className="text-sm font-bold text-mm-base-500"
              href={`/category/${mainCategory?.slug ?? 'news'}`}
              target="_blank"
            >
              <Typography
                as="span"
                variant="subtitle"
                className="text-mm-base-500"
              >
                {mainCategory?.name || '最新'}
              </Typography>
            </Link>

            {subCategories && (
              <>
                <span className="text-mm-base-500">／</span>
                <Link
                  className="text-sm font-bold text-mm-base-500"
                  href={`/category/${subCategories?.slug}`}
                  target="_blank"
                >
                  <Typography
                    as="span"
                    variant="subtitle"
                    className="text-mm-base-500"
                  >
                    {subCategories?.name}
                  </Typography>
                </Link>
              </>
            )}
          </div>
        )}

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
        <div className="order-4 col-span-full mr-2 flex justify-end gap-x-3 md:col-start-7 xl:col-start-6">
          <IconLink
            href="https://google.com/preferences/source?q=mirrormedia.mg"
            className="GTM-click-preferred-source flex h-7 items-center rounded-full border px-1.5 py-1 md:gap-1 md:px-2.5"
          >
            <NextImage
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
            className="GTM-share-facebook"
          />
          <IconLink
            href={`https://social-plugins.line.me/lineit/share?url=${canonicalUrl}`}
            src="/images/line-logo.svg"
            alt="line-logo"
            rel="noopener noreferrer"
            target="_blank"
            className="GTM-share-line"
          />
          <IconLink
            href={`https://www.threads.com/intent/post?url=${encodeURIComponent(
              canonicalUrl
            )}`}
            className="GTM-share-threads rounded-full bg-black"
            rel="noopener noreferrer"
            target="_blank"
          >
            <NextImage
              width={28}
              height={28}
              src="/images/threads-logo.svg"
              alt="threads-logo"
              className="scale-70 transform invert-100"
            />
          </IconLink>
          <IconLink
            href={canonicalUrl}
            src="/images/link-logo.svg"
            alt="link-logo"
            className="GTM-share-link"
          />
        </div>
        <figure className="order-5 col-span-full">
          <picture className="relative block aspect-3/2">
            <NextResponsiveImage
              fill
              className="aspect-4/3 object-cover"
              placeholder="blur"
              blurDataURL="/images-next/loading.gif"
              src={
                typeof heroImage?.resized?.original === 'string'
                  ? heroImage?.resized?.original?.replace(
                      /\.(jpg|png)$/i,
                      '.webP'
                    )
                  : '/images-next/default-og-img.png'
              }
              sizes="(max-width: 768px) 50vw, 30vw"
              srcSet={[480, 800]}
              alt={heroCaption ?? title ?? ''}
              priority
              fallback={
                typeof heroImage?.resized?.original === 'string'
                  ? heroImage?.resized?.original
                  : '/images-next/default-og-img.png'
              }
              errorImage="/images-next/default-og-img.png"
            />
          </picture>
          {heroCaption && (
            <Typography
              as="figcaption"
              variant="caption-l"
              className="pt-2 text-center text-mm-neutral-500 md:text-start"
            >
              {heroCaption}
            </Typography>
          )}
        </figure>
        <section className="order-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-9 pb-5 md:order-2 md:col-span-3 md:col-end-0 md:justify-start md:py-0 lg:py-0">
          {writers && Array.isArray(writers) && writers.length > 0 && (
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              文｜{writers.map((writer) => writer?.name).join(' ')}
            </Typography>
          )}
          {photographers &&
            Array.isArray(photographers) &&
            photographers.length > 0 && (
              <Typography as="span" variant="subtitle" className="line-clamp-1">
                攝影｜
                {photographers
                  ?.map((photographer) => photographer?.name ?? '')
                  .join(' ')}
              </Typography>
            )}
          {camera_man && Array.isArray(camera_man) && camera_man.length > 0 && (
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              影音｜{camera_man.map((person) => person?.name ?? '').join(' ')}
            </Typography>
          )}
          {designers && Array.isArray(designers) && designers.length > 0 && (
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              設計｜{designers.map((person) => person?.name ?? '').join(' ')}
            </Typography>
          )}
          {engineers && Array.isArray(engineers) && engineers.length > 0 && (
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              工程｜{engineers.map((person) => person?.name ?? '').join(' ')}
            </Typography>
          )}
          {vocals && Array.isArray(vocals) && vocals.length > 0 && (
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              主播｜{vocals.map((person) => person?.name ?? '').join(' ')}
            </Typography>
          )}
          {!!extend_byline && (
            <Typography as="span" variant="subtitle" className="line-clamp-1">
              協力｜{extend_byline}
            </Typography>
          )}
        </section>
        <ThemeElement
          className="order-7 col-span-full mx-2 rounded-md px-2.5 py-4 md:mx-0"
          as="blockquote"
          theme={theme}
        >
          {brief.blocks.map((block, index) => (
            <Typography
              key={`brief-${index}`}
              as="p"
              variant="body-l"
              className="text-mm-neutral-600"
            >
              {block?.text}
            </Typography>
          ))}
        </ThemeElement>
        <div className="order-8 col-span-full flex flex-col gap-y-7 md:gap-y-8">
          <Blocks
            className="mx-2 scroll-m-20 md:mx-0"
            contents={content}
            renderPostInContent={(block, paragraphCount) => {
              if (!block?.text) return null

              if (paragraphCount === 2 && relativeStory) {
                return (
                  <>
                    <Typography
                      key={`content-${paragraphCount}`}
                      as="p"
                      variant="body-l"
                      className="mx-2 scroll-m-20 md:mx-0"
                    >
                      {block?.text}
                    </Typography>
                    <div className="mx-2 scroll-m-20 md:mx-0">
                      <ThemeElement className="inline rounded-md rounded-b-none bg-mm-second-700 px-3 pt-1 text-mm-neutral-100">
                        <Typography
                          as="span"
                          variant="subtitle"
                          className="text-mm-neutral-100"
                        >
                          延伸閱讀
                        </Typography>
                      </ThemeElement>
                      <Link
                        href={`/story/${relativeStory.slug}?from=referral_contents`}
                      >
                        <ThemeElement
                          className="rounded-md rounded-tl-none p-2 text-lg font-bold text-mm-neutral-700 decoration-mm-neutral-700"
                          as="div"
                          theme="post"
                        >
                          {relativeStory.title}
                        </ThemeElement>
                      </Link>
                    </div>
                  </>
                )
              }

              if (paragraphCount === 3) {
                return (
                  <>
                    <Typography
                      key={`content-${paragraphCount}`}
                      as="p"
                      variant="body-l"
                      className="mx-2 scroll-m-20 md:mx-0"
                    >
                      {block?.text}
                    </Typography>
                    {renderAdInContent?.()}
                  </>
                )
              }

              if (paragraphCount === 4) {
                return (
                  <RelativePosts
                    relatedsOne={relatedsOne}
                    relatedsTwo={relatedsTwo}
                    className="mx-2 scroll-m-20 md:mx-0"
                  >
                    {block?.text}
                  </RelativePosts>
                )
              }

              return (
                <Typography
                  key={`content-${paragraphCount}`}
                  as="p"
                  variant="body-l"
                  className="mx-2 scroll-m-20 md:mx-0"
                >
                  {block?.text}
                </Typography>
              )
            }}
          />
        </div>
        <div className="order-9 col-span-full mx-8 flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
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
                  <NextImage
                    width={32}
                    height={32}
                    src={item.resource}
                    alt={item.label}
                    loading="lazy"
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

function RelativePosts({
  children,
  className,
  relatedsOne,
  relatedsTwo,
}: {
  children: ReactNode
  className?: string
  relatedsOne: StoryPost['relatedsOne']
  relatedsTwo: StoryPost['relatedsTwo']
}) {
  if (relatedsOne && relatedsTwo) {
    return (
      <>
        <Typography as="p" variant="body-l" className={className}>
          {children}
        </Typography>
        <RelativePostLink
          className="flex bg-mm-base-700"
          type="prev"
          href={`/story/${relatedsOne?.slug}`}
        >
          上一篇
        </RelativePostLink>
        <RelativePostLink
          className="flex bg-mm-base-700"
          type="next"
          href={`/story/${relatedsTwo?.slug}`}
        >
          下一篇
        </RelativePostLink>
      </>
    )
  }
  if (relatedsOne) {
    return (
      <>
        <Typography as="p" variant="body-l" className={className}>
          {children}
        </Typography>
        <RelativePostLink
          type="prev"
          className="flex bg-mm-base-700"
          href={`/story/${relatedsOne?.slug}`}
        >
          上一篇
        </RelativePostLink>
      </>
    )
  }
  if (relatedsTwo) {
    return (
      <>
        <Typography as="p" variant="body-l" className={className}>
          {children}
        </Typography>
        <RelativePostLink
          type="next"
          className="flex bg-mm-base-700"
          href={`/story/${relatedsTwo?.slug}`}
        >
          下一篇
        </RelativePostLink>
      </>
    )
  }

  return (
    <Typography as="p" variant="body-l" className={className}>
      {children}
    </Typography>
  )
}
