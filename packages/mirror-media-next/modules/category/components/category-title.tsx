import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'
import { color } from '@/styles/theme/color'

export type CategoryTitleProps = {
  isPremium?: boolean
  name: string
  sectionSlug?: string
}

/**
 * The category headline. It owns which colour a section gets and how the
 * member-only variant is decorated, so the route only says which category it
 * is showing.
 */
export function CategoryTitle({
  isPremium = false,
  name,
  sectionSlug,
}: CategoryTitleProps) {
  // Section colours have no mm-* token yet, so they stay data-driven from the
  // legacy palette instead of a Tailwind class per section.
  const sectionColor =
    color.sectionsColor[sectionSlug as keyof typeof color.sectionsColor] ??
    color.brandColor.lightBlue

  return (
    <Typography
      as="h1"
      className={cn(
        'text-[16px] leading-[1.15] font-medium',
        isPremium
          ? cn(
              'mx-mm-xl my-mm-xl',
              'legacy-md:mx-0 legacy-md:mt-mm-2xl legacy-md:mb-mm-3xl legacy-md:flex legacy-md:items-center legacy-md:text-[28px] legacy-md:font-semibold',
              // The rules flanking the member-only title.
              "legacy-md:before:mr-[30px] legacy-md:before:h-mm-sx legacy-md:before:grow legacy-md:before:bg-black legacy-md:before:content-['']",
              "legacy-md:after:ml-[40px] legacy-md:after:h-mm-sx legacy-md:after:grow legacy-md:after:bg-black legacy-md:after:content-['']",
              'legacy-xl:mt-mm-3xl legacy-xl:mb-7'
            )
          : cn(
              'mt-mm-2xl mb-mm-xl ml-mm-xl',
              'legacy-md:mx-0 legacy-md:mt-mm-2xl legacy-md:mb-mm-3xl legacy-md:text-[20.8px] legacy-md:font-semibold',
              'legacy-xl:mt-mm-3xl legacy-xl:mb-7 legacy-xl:text-[28px]'
            )
      )}
      style={{ color: sectionColor }}
      variant="subtitle"
    >
      {name}
    </Typography>
  )
}
