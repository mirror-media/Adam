import { useEffect, useState } from 'react'
import Image from '@readr-media/react-image'
import dayjs from 'dayjs'
import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import type { PopularNewsApiPost } from '@/apollo/fragments/post'
import { cn } from '@/components/cn'
import { Link, Typography } from '@/components/ui'
import useMediaQuery from '@/hooks/use-media-query'

type PopularNewsItemProps = {
  items: PopularNewsApiPost[]
}

export function PopularNewsItem({ items }: PopularNewsItemProps) {
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedSnap, setSelectedSnap] = useState(0)

  const goTo = (index: number) => emblaApi?.scrollTo(index)
  const setupSnaps = (emblaApi: EmblaCarouselType) =>
    setScrollSnaps(emblaApi.scrollSnapList())
  const setActiveSnap = (emblaApi: EmblaCarouselType) =>
    setSelectedSnap(emblaApi.selectedScrollSnap())

  useEffect(() => {
    if (!emblaApi) return

    setupSnaps(emblaApi)
    setActiveSnap(emblaApi)

    emblaApi.on('reInit', setupSnaps)
    emblaApi.on('reInit', setActiveSnap)
    emblaApi.on('select', setActiveSnap)
  }, [emblaApi])

  if (isDesktop) {
    return (
      <div className="grid grid-cols-3 gap-x-13 gap-y-7 py-11">
        {items.map((item, index) => (
          <div key={index}>
            <Link
              href={`/story/${item.slug}?from=idlepage`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="space-y-3">
                <picture className="relative block aspect-4/3 w-full">
                  <Image
                    images={item?.heroImage?.resized}
                    alt={item.title}
                    loadingImage="/images-next/loading.gif"
                    defaultImage="/images-next/default-og-img.png"
                  />
                </picture>
                <Typography
                  variant="subtitle"
                  className="line-clamp-3 max-h-mm-6xl min-h-mm-6xl text-mm-base-700"
                >
                  {item.title}
                </Typography>
                <Typography variant="caption-l" className="text-mm-neutral-400">
                  {dayjs(item.publishedDate).format('YYYY.MM.DD HH:mm')}
                </Typography>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="embla_viewport overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex touch-pan-y touch-pinch-zoom">
        {items.map((item, index) => (
          <div
            key={index}
            className="embla__slide min-w-0 shrink-0 grow-0 basis-full"
          >
            <Link
              href={`/story/${item.slug}?from=idlepage`}
              target="_blank"
              rel="noreferrer"
              className="GTM-idle-window-click-popular-list flex"
            >
              <div className="space-y-2">
                <picture className="relative block aspect-4/3 w-full">
                  <Image
                    images={item?.heroImage?.resized}
                    alt={item.title}
                    loadingImage="/images-next/loading.gif"
                    defaultImage="/images-next/default-og-img.png"
                  />
                </picture>
                <Typography
                  variant="subtitle"
                  className="line-clamp-3 text-mm-base-700"
                >
                  {item.title}
                </Typography>
                <Typography variant="caption-l" className="text-mm-neutral-400">
                  {dayjs(item.publishedDate).format('YYYY.MM.DD HH:mm')}
                </Typography>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-x-1 py-3">
        {scrollSnaps.map((_, index) => (
          <button
            className={cn('aspect-square w-2 rounded-full bg-mm-neutral-300', {
              'bg-mm-base-300': index === selectedSnap,
            })}
            key={index}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
