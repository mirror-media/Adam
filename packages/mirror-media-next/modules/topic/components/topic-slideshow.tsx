import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { useCallback, useState } from 'react'
import NextLink from 'next/link'
import CustomImage from '@readr-media/react-image'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { Swiper as SwiperClass } from 'swiper'
import { Autoplay, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { DEFAULT_OG_IMAGE_URL } from '@/constants'
import { toTopicImageSet } from '@/modules/topic/topic-data'
import type { TopicSlideshowImage } from '@/modules/topic/topic-types'

type TopicSlideshowProps = {
  images: TopicSlideshowImage[]
}

function TopicSlideshow({ images }: TopicSlideshowProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)

  const handlePrevious = useCallback(() => {
    swiper?.slidePrev()
  }, [swiper])

  const handleNext = useCallback(() => {
    swiper?.slideNext()
  }, [swiper])

  if (images.length === 0) {
    return null
  }

  return (
    <div className="leading relative mx-auto w-[87.5%] max-w-[450px] md:w-1/2 md:max-w-[830px] [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden">
      <button
        aria-label="上一張"
        className="absolute top-1/2 left-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center text-mm-base-700 md:left-[-24px]"
        onClick={handlePrevious}
        type="button"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-7" />
      </button>
      <button
        aria-label="下一張"
        className="absolute top-1/2 right-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center text-mm-base-700 md:right-[-24px]"
        onClick={handleNext}
        type="button"
      >
        <ChevronRightIcon aria-hidden="true" className="size-7" />
      </button>
      <Swiper
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        centeredSlides
        loop
        modules={[Autoplay, Navigation]}
        navigation
        onSwiper={setSwiper}
        spaceBetween={100}
        speed={750}
      >
        {images.map((item) => (
          <SwiperSlide key={item.id}>
            {item.topicKeywords?.startsWith('@-') ? (
              <NextLink
                href={item.topicKeywords.slice(2)}
                rel="noreferrer"
                target="_blank"
              >
                <CustomImage
                  alt={item.name ?? ''}
                  defaultImage={DEFAULT_OG_IMAGE_URL}
                  images={toTopicImageSet(item.resized)}
                  imagesWebP={toTopicImageSet(item.resizedWebp)}
                  loadingImage="/images-next/loading@4x.gif"
                  priority
                  rwd={{
                    mobile: '450px',
                    tablet: '850px',
                    desktop: '850px',
                    default: '850px',
                  }}
                />
              </NextLink>
            ) : (
              <CustomImage
                alt={item.name ?? ''}
                defaultImage={DEFAULT_OG_IMAGE_URL}
                images={toTopicImageSet(item.resized)}
                imagesWebP={toTopicImageSet(item.resizedWebp)}
                loadingImage="/images-next/loading@4x.gif"
                priority
                rwd={{
                  mobile: '450px',
                  tablet: '850px',
                  desktop: '850px',
                  default: '850px',
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export { TopicSlideshow }
export type { TopicSlideshowProps }
