import { Swiper, SwiperSlide } from 'swiper/react'

import { Autoplay, Pagination, Navigation } from 'swiper'

import styled from 'styled-components'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

/**
 * Since the title of article must be displayed under its picture, but it must also have the feature of swiper,
 * such as navigation, scrollable, change title when pagination,
 * Out solution is creating a larger container to wrap the swiper, and setup swiper 'overflow' setting to show vertical content,
 * then adjust position of title to make it show under the picture.
 * So title is the element belong to swiper and have feature of it, but showing position is outside of swiper.
 * Height of container is (height of picture + margin between picture and title + height of title)
 * The position of the title is offset (margin between picture and title + height of title) from the bottom of the picture
 */
const Container = styled.div`
  width: 100%;
  margin: 20px auto 40px;
  position: relative;

  //height of picture + margin between picture and title + height of title
  height: calc(576px + 24px + 96px);
  overflow-x: hidden;
  h2 {
    color: #ffffff;
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    //higher then swiper
    z-index: 2;
    filter: drop-shadow(1.6px 0.17px 4px #000000);
  }
  .swiper {
    width: 100%;
    height: 576px;
    overflow: visible;
  }
  .swiper-slide {
    height: 100%;
    text-align: center;
    font-size: 18px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      height: 96px;
      width: 1024px;
      text-align: left;
      color: #054f77;
      font-size: 32px;
      line-height: 1.5;
      margin: 24px auto 0;
      font-weight: 700;
      position: absolute;
      //margin between picture and title + height of title
      bottom: calc(-96px - 24px);

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    a,
    img {
      display: block;
      height: 100%;
      width: 100%;
    }
    img {
      object-fit: cover;
    }
  }
  .swiper-button-prev,
  .swiper-button-next {
    color: #ffffff;
    height: 276px;
    height: 576px;
    top: 0;
    margin-top: 0;
  }
  .swiper-button-prev {
    left: 0;
    padding: 0 30px 0;
  }
  .swiper-button-next {
    right: 0;
    padding: 0 30px 0;
  }
  .swiper-pagination-bullet {
    background-color: #b5b5b5;
    &-active {
      background-color: #ffffff;
    }
  }
`

/**
 *
 * @param {Object} props
 * @param {Object[]} props.editorChoice
 * @returns {React.ReactElement}
 */
export default function EditorChoice({ editorChoice }) {
  return (
    <>
      <Container>
        <h2>編輯精選</h2>
        <Swiper
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
          modules={[Autoplay, Pagination, Navigation]}
        >
          {editorChoice.map((item) => (
            <SwiperSlide key={item.slug}>
              <a
                href={`/story/${item.slug}`}
                target="_blank"
                rel="noreferrer noopenner"
              >
                <img
                  src={item.imgSrcTablet || '/images/default-og-img.png'}
                  alt={item.title}
                ></img>

                <p className="title">{item.title}</p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </>
  )
}
