import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import NextLink from 'next/link'

import { cn } from '@/components/cn'
import {
  shellBrandLinkClass,
  shellTextLinkClass,
} from '@/components/shell/link-styles'
import { ENV } from '@/config/index.mjs'
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
  const flashNewsRowRef = useRef<HTMLDivElement | null>(null)
  const stickyOffsetsRef = useRef({ compact: 0, desktop: 0 })
  const logoRowRef = useRef<HTMLDivElement | null>(null)
  const navigation = createShellNavigation(navigationData, sectionPostsData)
  const openFlyoutItem = navigation.find(
    (item) => item.slug === openFlyoutSlug && item.categories.length > 0
  )
  const visibleTopics = topicsData.slice(0, 7)
  const flashNews = flashNewsData ?? []
  const hasFlashNewsRow = flashNews.length > 0 || visibleTopics.length > 0

  // Measured while nothing is fixed or hidden yet: reading the live values once
  // the header sticks would feed that state back into the threshold producing it.
  useLayoutEffect(() => {
    const flashNewsRowHeight = flashNewsRowRef.current?.offsetHeight ?? 0
    const logoRowHeight = logoRowRef.current?.offsetHeight ?? 0

    stickyOffsetsRef.current = {
      compact: flashNewsRowHeight,
      desktop: flashNewsRowHeight + logoRowHeight,
    }
  }, [hasFlashNewsRow])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')

    function updateStickyState() {
      const offsets = stickyOffsetsRef.current
      setShowStickyControls(
        window.scrollY >= (desktop.matches ? offsets.desktop : offsets.compact)
      )
    }

    updateStickyState()
    window.addEventListener('scroll', updateStickyState, { passive: true })
    desktop.addEventListener('change', updateStickyState)
    return () => {
      window.removeEventListener('scroll', updateStickyState)
      desktop.removeEventListener('change', updateStickyState)
    }
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
      className="relative z-(--mm-z-shell-header) bg-mm-neutral-0"
      data-slot="site-header"
    >
      {(flashNews.length > 0 || visibleTopics.length > 0) && (
        <div
          // Must stay in the flow: hiding it here takes its height out of the
          // document and the page jumps under the reader.
          className="flex h-12 items-center bg-mm-base-500 px-mm-2xl text-mm-error-300 lg:px-mm-2xl"
          ref={flashNewsRowRef}
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
                // The row clips its overflow, and each link's hover rules sit
                // just outside its margin box, so the first and last would be
                // cut off. Widen the padding box and take the width back out of
                // the layout again.
                className="-mx-mm-m hidden min-w-0 gap-mm-xl overflow-hidden px-mm-m font-mm-body text-mm-body2 whitespace-nowrap text-mm-neutral-0 lg:flex"
              >
                {visibleTopics.map((topic) => (
                  <NextLink
                    className={shellTextLinkClass}
                    href={`/topic/${topic.slug}`}
                    key={topic.id}
                  >
                    {topic.name}
                  </NextLink>
                ))}
                <NextLink className={shellTextLinkClass} href="/section/topic">
                  更多
                </NextLink>
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
            'fixed inset-x-0 top-0 z-(--mm-z-shell-header) shadow-sm lg:static lg:z-auto lg:shadow-none'
        )}
      >
        <div
          className="mx-auto flex h-15 w-full max-w-7xl items-center justify-between px-mm-2xl"
          ref={logoRowRef}
        >
          <div className="flex items-center gap-mm-4xl">
            <NextLink
              aria-label="回到鏡週刊首頁"
              className={cn('GTM-header-logo', shellBrandLinkClass)}
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

            {ENV !== 'prod' && (
              /* Figma 661:8400 places two ad slots next to the logo. Keep
                 these preview-only placeholders out of production markup.
                 110x50 stands in for GPT `global/RWD_LOGO`, an RWD unit the
                 legacy header serves on every device, so neither box is gated
                 by breakpoint. 120x30 has no unit in `constants/ads.ts` yet;
                 it is placed here on the owner's call, pending its real id. */
              <div className="flex items-center gap-mm-l">
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
            )}
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
                  className={shellBrandLinkClass}
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
            'relative z-(--mm-z-shell-header) flex h-12 w-full items-center border-b border-mm-neutral-200 bg-mm-neutral-0',
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
                className={cn(
                  'GTM-header-logo hidden shrink-0 lg:block',
                  shellBrandLinkClass
                )}
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
              className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-mm-2xl overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] md:justify-between lg:justify-start lg:gap-[clamp(1rem,6.25vw-3rem,2rem)] [&::-webkit-scrollbar]:hidden"
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
          // Must equal what left the flow: two fixed rows on compact, one on desktop.
          className="h-27 lg:h-12"
        />
      )}
    </header>
  )
}

export { SiteHeader }
export type { SiteHeaderProps }
