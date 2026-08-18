import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import NextLink from 'next/link'

import { cn } from '@/components/cn'
import type {
  HeadersDataSection,
  ShellFlashNews,
  ShellSectionPosts,
  Topics,
} from '@/utils/api'

import { FlashNews } from './flash-news'
import { navLinkClassName, navLinkRuleOnHover } from './nav-link'
import {
  createShellNavigation,
  shellPartnerLinks,
  shellUtilityLinks,
} from './navigation'
import { ShellSearch } from './shell-search'
import { useHorizontalWheelScroll } from './use-horizontal-wheel-scroll'

const DesktopNavigationItem = dynamic(() =>
  import('./desktop-navigation-item').then(
    (module) => module.DesktopNavigationItem
  )
)
const MemberMenu = dynamic(() =>
  import('./member-menu').then((module) => module.MemberMenu)
)
const DesktopNavigationFlyout = dynamic(() =>
  import('./desktop-navigation-flyout').then(
    (module) => module.DesktopNavigationFlyout
  )
)
const MobileMenu = dynamic(() =>
  import('./mobile-menu').then((module) => module.MobileMenu)
)

type SiteHeaderProps = {
  activeNavigationSlug?: string
  flashNewsData?: ShellFlashNews[]
  navigationData: HeadersDataSection[]
  sectionPostsData?: ShellSectionPosts
  topicsData: Topics
}

function SiteHeader({
  activeNavigationSlug,
  flashNewsData,
  navigationData,
  sectionPostsData,
  topicsData,
}: SiteHeaderProps) {
  const [showStickyControls, setShowStickyControls] = useState(false)
  const categoryStripRef = useHorizontalWheelScroll()
  const [openFlyoutSlug, setOpenFlyoutSlug] = useState<string | null>(null)
  const navigationRegionRef = useRef<HTMLDivElement | null>(null)
  const navigation = createShellNavigation(navigationData, sectionPostsData)
  const openFlyoutItem = navigation.find(
    (item) => item.slug === openFlyoutSlug && item.categories.length > 0
  )
  const visibleTopics = topicsData.slice(0, 7)
  const flashNews = flashNewsData ?? []

  useEffect(() => {
    function updateStickyState() {
      // The flash news row (48) plus the logo row (60): the point where both
      // have scrolled away. Keep in step with those two heights.
      setShowStickyControls(window.scrollY >= 108)
    }

    updateStickyState()
    window.addEventListener('scroll', updateStickyState, { passive: true })
    return () => window.removeEventListener('scroll', updateStickyState)
  }, [])

  useEffect(() => {
    if (!openFlyoutSlug) {
      return
    }
    const activeFlyoutSlug = openFlyoutSlug

    function closeOnFocusOutside(event: FocusEvent) {
      const target = event.target
      const focusedTrigger =
        target instanceof Element &&
        target.matches('[data-slot="desktop-navigation-trigger"]')
      const focusedInsideFlyout = navigationRegionRef.current
        ?.querySelector('[data-slot="navigation-flyout"]')
        ?.contains(target as Node)

      if (!focusedTrigger && !focusedInsideFlyout) {
        setOpenFlyoutSlug(null)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return
      }

      event.preventDefault()
      const trigger = [
        ...(navigationRegionRef.current?.querySelectorAll<HTMLAnchorElement>(
          '[data-slot="desktop-navigation-trigger"]'
        ) ?? []),
      ].find((element) => element.dataset.navigationSlug === activeFlyoutSlug)

      // Focus first: the trigger's focus handler reopens the flyout, then the
      // state updates below close it in the same event.
      trigger?.focus()
      setOpenFlyoutSlug(null)
    }

    function closeOnNavigation(event: MouseEvent) {
      const target = event.target
      if (
        target instanceof Element &&
        navigationRegionRef.current?.contains(target) &&
        target.closest('a')
      ) {
        setOpenFlyoutSlug(null)
      }
    }

    document.addEventListener('focusin', closeOnFocusOutside)
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('click', closeOnNavigation)
    return () => {
      document.removeEventListener('focusin', closeOnFocusOutside)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('click', closeOnNavigation)
    }
  }, [openFlyoutSlug])

  function openFlyoutFromPointerOrFocus(slug: string) {
    setOpenFlyoutSlug(slug)
  }

  return (
    <header
      className="relative z-[1000] bg-mm-neutral-0"
      data-slot="site-header"
    >
      {(flashNews.length > 0 || visibleTopics.length > 0) && (
        <div
          className={cn(
            'flex h-12 items-center bg-mm-base-500 px-mm-2xl text-mm-error-300 lg:px-mm-2xl',
            // Compact shell drops the flash news row once the header sticks.
            showStickyControls && 'hidden lg:flex'
          )}
        >
          <div className="mx-auto flex w-full max-w-310 min-w-0 items-center justify-between gap-mm-xl">
            {flashNews.length > 0 ? (
              <FlashNews items={flashNews} />
            ) : (
              <span aria-hidden="true" />
            )}
            {visibleTopics.length > 0 && (
              <nav
                aria-label="專題推薦"
                className="hidden min-w-0 gap-mm-xl overflow-hidden font-mm-body text-mm-body2 whitespace-nowrap text-mm-neutral-0 lg:flex"
              >
                {visibleTopics.map((topic) => (
                  <NextLink href={`/topic/${topic.slug}`} key={topic.id}>
                    {topic.name}
                  </NextLink>
                ))}
                <NextLink href="/section/topic">更多</NextLink>
              </nav>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          'bg-mm-neutral-0',
          // Compact shell (<lg) sticks logo row + category row together;
          // desktop keeps only the category row fixed, see below.
          showStickyControls &&
            'fixed inset-x-0 top-0 z-[1000] shadow-sm lg:static lg:z-auto lg:shadow-none'
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-15 w-full max-w-7xl items-center justify-between px-mm-2xl',
            // Desktop sticky is a single row, so the logo row scrolls away.
            showStickyControls && 'lg:hidden'
          )}
        >
          <div className="flex items-center gap-mm-4xl">
            <NextLink
              aria-label="回到鏡週刊首頁"
              className="GTM-header-logo rounded-mm-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500"
              href="/"
            >
              <Image
                alt="鏡週刊 Mirror Media"
                // The asset's intrinsic size is 108x46; Figma's 107x45.235 is a
                // placement artefact, so render it unscaled.
                className="h-auto w-27"
                height={46}
                priority
                src="/images-next/mirror-media-logo.svg"
                width={108}
              />
            </NextLink>

            {/* Figma 661:8400 places two ad slots next to the logo. These are
                sized placeholders only; the real ad integration is out of scope
                for this round. */}
            <div className="hidden items-center gap-mm-l lg:flex">
              <div
                className="flex h-[50px] w-[110px] items-center justify-center bg-mm-error-100 font-mm-sans text-mm-caption-s text-mm-neutral-800"
                data-slot="header-ad-slot"
              >
                110×50
              </div>
              <div
                className="flex h-[30px] w-30 items-center justify-center bg-mm-error-100 font-mm-sans text-mm-caption-s text-mm-neutral-800"
                data-slot="header-ad-slot"
              >
                120×30
              </div>
            </div>
          </div>

          <div className="flex items-center gap-mm-l lg:hidden">
            <MemberMenu />
            <MobileMenu navigation={navigation} topics={topicsData} />
          </div>

          <div className="hidden min-w-0 items-center gap-mm-2xl lg:flex">
            <nav
              aria-label="合作品牌"
              // Figma 661:8400 gives this row a shared 28px height with the
              // lockups centred at their own sizes.
              className="flex h-7 items-center gap-mm-2xl"
            >
              {shellPartnerLinks.map((link) => (
                <NextLink
                  aria-label={link.label}
                  href={link.href}
                  key={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt=""
                    className="w-auto object-contain"
                    height={link.height}
                    src={link.src}
                    // Each lockup keeps its own design height; without this the
                    // optimiser's output size would drive the rendered box.
                    style={{ height: link.height }}
                    width={link.width}
                  />
                </NextLink>
              ))}
            </nav>
            <ShellSearch className="w-55" />
            <MemberMenu />
          </div>
        </div>

        <div
          className={cn(
            'relative z-[1000] flex h-12 w-full items-center border-b border-mm-neutral-200 bg-mm-neutral-0',
            showStickyControls && 'lg:fixed lg:inset-x-0 lg:top-0'
          )}
          onMouseLeave={() => {
            setOpenFlyoutSlug(null)
          }}
          ref={navigationRegionRef}
        >
          <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-mm-xl px-mm-2xl">
            {/* Only rendered while stuck: a zero-width placeholder would still
                contribute the flex gap and push the category row out of the
                20px column shared by the flash news bar and the logo. */}
            {showStickyControls && (
              <NextLink
                aria-label="回到鏡週刊首頁"
                className="GTM-header-logo hidden shrink-0 rounded-mm-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500 lg:block"
                href="/"
              >
                <Image
                  alt="鏡週刊 Mirror Media"
                  className="h-auto w-14"
                  height={24}
                  src="/images-next/mirror-media-logo.svg"
                  width={56}
                />
              </NextLink>
            )}
            <nav
              aria-label="主要分類"
              ref={categoryStripRef}
              className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-mm-2xl overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] lg:gap-[clamp(1rem,6.25vw-3rem,2rem)] [&::-webkit-scrollbar]:hidden"
            >
              {navigation.map((item) => (
                <div className="lg:hidden" key={`compact-${item.slug}`}>
                  <NextLink
                    className={cn(
                      'rounded-mm-xs font-mm-sans text-mm-h5 text-mm-neutral-800 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500',
                      activeNavigationSlug === item.slug &&
                        'text-mm-base-500 md:text-mm-neutral-800 md:underline md:underline-offset-4'
                    )}
                    href={item.href}
                  >
                    {item.name}
                  </NextLink>
                </div>
              ))}
              {navigation.map((item) => (
                <div className="hidden lg:block" key={`desktop-${item.slug}`}>
                  <DesktopNavigationItem
                    active={activeNavigationSlug === item.slug}
                    expanded={openFlyoutSlug === item.slug}
                    item={item}
                    onOpen={openFlyoutFromPointerOrFocus}
                  />
                </div>
              ))}
            </nav>
            <nav
              aria-label="其他服務"
              className="hidden shrink-0 items-center gap-mm-4xl lg:flex"
            >
              {shellUtilityLinks.map((link) => (
                <NextLink
                  className={cn(navLinkClassName, navLinkRuleOnHover)}
                  href={link.href}
                  key={link.label}
                  onFocus={() => setOpenFlyoutSlug(null)}
                  onMouseEnter={() => setOpenFlyoutSlug(null)}
                  rel={link.rel}
                  target={link.target}
                >
                  {link.label}
                </NextLink>
              ))}
            </nav>
          </div>

          {openFlyoutItem && <DesktopNavigationFlyout item={openFlyoutItem} />}
        </div>
      </div>

      {showStickyControls && (
        <div
          aria-hidden="true"
          // Compact shell fixes two rows (60 + 48); desktop fixes only the 48px row.
          className="h-27 lg:h-12"
        />
      )}
    </header>
  )
}

export { SiteHeader }
export type { SiteHeaderProps }
