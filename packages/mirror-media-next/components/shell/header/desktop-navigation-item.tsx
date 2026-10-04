import NextLink from 'next/link'

import { cn } from '@/components/cn'

import {
  navLinkClassName,
  navLinkRuleAlways,
  navLinkRuleOnHover,
} from './nav-link'
import type { ShellNavigationItem } from './navigation'

type DesktopNavigationItemProps = {
  active: boolean
  expanded: boolean
  item: ShellNavigationItem
  onOpen: (slug: string) => void
}

/**
 * A category entry in the desktop row. It is always a link; the flyout it
 * controls is rendered once by the header, so this only reports which category
 * should be shown. PM's contract is mouseover, and focus is handled too so the
 * panel is reachable from the keyboard.
 */
function DesktopNavigationItem({
  active,
  expanded,
  item,
  onOpen,
}: DesktopNavigationItemProps) {
  const hasFlyout = item.categories.length > 0

  return (
    <NextLink
      aria-controls={
        hasFlyout && expanded ? 'site-header-navigation-flyout' : undefined
      }
      aria-expanded={hasFlyout ? expanded : undefined}
      aria-haspopup={hasFlyout ? 'true' : undefined}
      className={cn(
        navLinkClassName,
        active || expanded ? navLinkRuleAlways : navLinkRuleOnHover
      )}
      data-navigation-slug={item.slug}
      data-slot="desktop-navigation-trigger"
      href={item.href}
      onFocus={() => onOpen(item.slug)}
      onMouseEnter={() => onOpen(item.slug)}
    >
      {item.name}
    </NextLink>
  )
}

export { DesktopNavigationItem }
