import { useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { XIcon } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Topics } from '@/utils/api'

import {
  type ShellNavigationItem,
  shellPartnerLinks,
  shellUtilityLinks,
} from './navigation'
import { ShellSearch } from './shell-search'
import { useHorizontalWheelScroll } from './use-horizontal-wheel-scroll'

type MobileMenuProps = {
  navigation: ShellNavigationItem[]
  topics: Topics
}

/**
 * Figma renders the disclosure indicator as a solid triangle that points
 * left when collapsed and down when expanded, so the shell supplies its own
 * icon instead of the primitive's default chevrons.
 */
function AccordionCaret() {
  return (
    <svg
      aria-hidden="true"
      className="ml-auto size-3 shrink-0 -rotate-90 text-mm-neutral-0 transition-transform group-aria-expanded/accordion-trigger:rotate-180"
      data-slot="accordion-trigger-icon"
      fill="currentColor"
      viewBox="0 0 12 12"
    >
      <path d="M6 0.75 11.196 9H0.804z" />
    </svg>
  )
}

function MobileMenu({ navigation, topics }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const visibleTopics = topics.slice(0, 7)
  const topicStripRef = useHorizontalWheelScroll()

  function closeMenu() {
    setOpen(false)
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        aria-label="開啟主選單與搜尋"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        {/* Mirror-specific combined menu + search glyph; not a Lucide icon. */}
        <Image
          alt=""
          aria-hidden="true"
          className="h-6 w-7"
          height={24}
          src="/images-next/shell-menu-search.svg"
          width={28}
        />
      </SheetTrigger>
      <SheetContent
        className="w-full max-w-none gap-0 overflow-hidden border-0 bg-mm-base-600 p-0 data-[side=left]:w-full sm:max-w-none data-[side=left]:sm:max-w-none"
        closeLabel="關閉主選單"
        showCloseButton={false}
        side="left"
      >
        <SheetTitle className="sr-only">主選單</SheetTitle>
        <SheetClose
          render={
            <Button
              aria-label="關閉主選單"
              className="absolute top-mm-3xl right-mm-xl z-10 size-7 rounded-full bg-mm-base-500 p-0 text-mm-neutral-100 hover:bg-mm-base-400 hover:text-mm-neutral-100 md:right-mm-4xl"
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <XIcon aria-hidden="true" className="size-3" />
        </SheetClose>
        <div className="bg-mm-base-700 px-mm-4xl pt-mm-3xl pb-mm-xl md:px-11">
          <Image
            alt="鏡週刊"
            className="h-auto w-20"
            height={34}
            priority
            src="/images-next/weekly-logo-white.svg"
            width={80}
          />
          <ShellSearch className="mt-mm-xl" compact onNavigate={closeMenu} />
          {visibleTopics.length > 0 && (
            <nav
              aria-label="專題推薦"
              ref={topicStripRef}
              className="mt-mm-m flex [scrollbar-width:none] gap-mm-xl overflow-x-auto font-mm-body text-mm-body2 whitespace-nowrap text-mm-neutral-0 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {visibleTopics.map((topic) => (
                <NextLink
                  className="rounded-mm-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-0 focus-visible:outline-solid"
                  href={`/topic/${topic.slug}`}
                  key={topic.id}
                  onClick={closeMenu}
                >
                  {topic.name}
                </NextLink>
              ))}
              <NextLink
                className="rounded-mm-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-0 focus-visible:outline-solid"
                href="/section/topic"
                onClick={closeMenu}
              >
                更多
              </NextLink>
            </nav>
          )}
        </div>

        <nav
          aria-label="主要分類"
          className="min-h-0 flex-1 [scrollbar-color:rgb(0_0_0/0.32)_transparent] overflow-y-auto px-10 py-mm-3xl md:px-11 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {/* Figma insets these rows by 10px, which is off the project's 4px
              grid. It is kept rather than snapped: 12px would add 4px to each
              of the ten rows and shift the menu's vertical rhythm. */}
          <Accordion className="gap-mm-xl">
            {navigation.map((item) =>
              item.categories.length > 0 ? (
                <AccordionItem
                  className="not-last:border-b-0"
                  key={item.slug}
                  value={item.slug}
                >
                  <AccordionTrigger
                    className="items-center rounded-mm-m bg-mm-base-500 p-[10px] text-mm-h5 text-mm-neutral-0 hover:text-mm-neutral-0 focus-visible:outline-mm-neutral-0 focus-visible:outline-solid"
                    icon={<AccordionCaret />}
                  >
                    {item.name}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-wrap gap-x-mm-2xl gap-y-mm-l px-mm-2xl pt-mm-l pb-0 [&_a]:text-mm-body-m [&_a]:text-mm-base-100 [&_a]:no-underline [&_a]:hover:text-mm-neutral-0">
                    <NextLink href={item.href} onClick={closeMenu}>
                      全部
                    </NextLink>
                    {item.categories.map((category) => (
                      <NextLink
                        href={category.href}
                        key={category.slug}
                        onClick={closeMenu}
                      >
                        {category.name}
                      </NextLink>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <NextLink
                  className="flex items-center rounded-mm-m bg-mm-base-500 p-[10px] font-mm-sans text-mm-h5 text-mm-neutral-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-0 focus-visible:outline-solid"
                  href={item.href}
                  key={item.slug}
                  onClick={closeMenu}
                >
                  {item.name}
                </NextLink>
              )
            )}
          </Accordion>
        </nav>

        <nav
          aria-label="其他服務"
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-mm-m bg-mm-base-400 px-mm-xl py-mm-l font-mm-sans text-mm-subtitle text-mm-second-100"
        >
          {shellUtilityLinks.map((link) => (
            <NextLink
              className="rounded-mm-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-0 focus-visible:outline-solid"
              href={link.href}
              key={link.label}
              onClick={closeMenu}
              rel={link.rel}
              target={link.target}
            >
              {link.label}
            </NextLink>
          ))}
        </nav>

        <div className="flex items-center justify-center gap-mm-2xl bg-mm-neutral-0 px-mm-xl py-mm-xl">
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
                className="h-4 w-auto object-contain"
                height={link.height}
                src={link.src}
                width={link.width}
              />
            </NextLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileMenu }
