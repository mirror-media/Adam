import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper'
import TopicListArticles from './topic-list-articles'
import CustomImage from '@readr-media/react-image'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { useCallback, useState } from 'react'
import { parseUrl } from '../../../utils/topic'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const Container = styled.main`
  margin: 0 auto;
  background: #eee;

  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.customCss
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    padding: 0;
  }

  // custom css from cms, mainly used class name .topic, .topic-title, .leading
  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.customCss
     */
    ({ customCss }) => customCss
  }
`

const Topic = styled.div`
  display: block;
  background-repeat: no-repeat;
  height: auto;
  padding-top: 66.66%;
  background-position: 50%;
  background-size: cover;
  background-image: ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.backgroundUrl
     */
    ({ backgroundUrl }) =>
      backgroundUrl ? `url(${backgroundUrl}) !important` : 'unset'
  };

  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.backgroundUrl
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    height: 600px;
    padding-top: 0;
  }
`
const TopicTitle = styled.div`
  background-repeat: no-repeat;
`
const TopicLeading = styled.div`
  width: 87.5%;
  max-width: 450px;
  margin: 0 auto;
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
  .swiper-slide {
    img {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 50%;
    max-width: 830px;
  }
`
const CustomSwiperPrev = styled.div`
  position: absolute;
  top: 50%;
  width: 12px;
  height: 28px;
  margin-top: calc(0px - (28px / 2));
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #204f74;
  left: 8px;
  ${({ theme }) => theme.breakpoint.md} {
    left: -24px;
  }

  &:after {
    content: 'prev';
    font-family: swiper-icons;
    font-size: 28px;
    text-transform: none !important;
    letter-spacing: 0;
    font-variant: initial;
    line-height: 1;
  }
`

const CustomSwiperNext = styled.div`
  position: absolute;
  top: 50%;
  width: 12px;
  height: 28px;
  margin-top: calc(0px - (28px / 2));
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #204f74;
  right: 8px;
  ${({ theme }) => theme.breakpoint.md} {
    right: -24px;
  }

  &:after {
    content: 'next';
    font-family: swiper-icons;
    font-size: 28px;
    text-transform: none !important;
    letter-spacing: 0;
    font-variant: initial;
    line-height: 1;
  }
`

/**
 * @typedef {import('../../../apollo/fragments/photo').Photo & {
 *  id: string;
 *  name: string;
 *  imageFile: {
 *    width: number;
 *    height: number;
 *  }
 *  resized: {
 *    original: string;
 *    w480: string;
 *    w800: string;
 *    w1200: string;
 *    w1600: string;
 *    w2400: string;
 *  }
 * }} Photo
 * @typedef {import('./topic-list-articles').Article} Article
 * @typedef {import('../../../apollo/fragments/topic').Topic & {
 *  id: string;
 *  slug: string;
 *  name: string;
 *  brief: import('../../../type/draft-js').Draft;
 *  heroImage: Photo;
 *  heroUrl: string;
 *  leading: string;
 *  type: string;
 *  style: string;
 *  posts: Article[];
 * }} Topic
 *
 * @typedef {import('../../../apollo/fragments/photo').SlideshowImage} SlideshowImage
 */

/**
 * @param {Object} props
 * @param {Topic} props.topic
 * @param {number} props.renderPageSize
 * @param {SlideshowImage[]} props.slideshowImages
 * @returns {React.ReactElement}
 */
export default function TopicList({ topic, renderPageSize, slideshowImages }) {
  const [swiperRef, setSwiperRef] = useState(null)
  const { postsCount, posts, slug, style, featuredPostsCount } = topic
  const backgroundUrl = parseUrl(topic.style)
    ? ''
    : topic.og_image?.resized?.original || topic.heroImage?.resized?.original

  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev()
  }, [swiperRef])

  const handleNext = useCallback(() => {
    swiperRef?.slideNext()
  }, [swiperRef])

  return (
    <>
      <Container customCss={style}>
        <Topic
          className="topic"
          as={topic?.heroUrl ? 'a' : 'div'}
          backgroundUrl={backgroundUrl}
          href={topic?.heroUrl}
          target={topic?.heroUrl ? '_blank' : null}
        >
          <TopicTitle className="topic-title" />
          <TopicLeading className="leading">
            {!!slideshowImages.length && (
              <>
                <CustomSwiperPrev onClick={handlePrevious} />
                <CustomSwiperNext onClick={handleNext} />
                <Swiper
                  onSwiper={setSwiperRef}
                  spaceBetween={100}
                  centeredSlides={true}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  loop={true}
                  speed={750}
                  navigation={true}
                  modules={[Autoplay, Navigation]}
                >
                  {slideshowImages.map((item) => (
                    <SwiperSlide key={item.id}>
                      <CustomImage
                        images={item?.resized}
                        imagesWebP={item?.resizedWebp}
                        loadingImage={'/images-next/loading@4x.gif'}
                        defaultImage={'/images-next/default-og-img.png'}
                        rwd={{
                          mobile: '450px',
                          tablet: '850px',
                          desktop: '850px',
                          default: '850px',
                        }}
                        priority={true}
                        alt={item.name}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </TopicLeading>
        </Topic>
        <TopicListArticles
          topicSlug={slug}
          initialPosts={posts}
          postsCount={postsCount}
          featuredPostsCount={featuredPostsCount}
          renderPageSize={renderPageSize}
          dfp={topic.dfp}
        />
      </Container>
    </>
  )
}
