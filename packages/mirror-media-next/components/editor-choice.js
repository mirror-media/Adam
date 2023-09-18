//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import { Swiper, SwiperSlide } from 'swiper/react'

import { Autoplay, Pagination, Navigation } from 'swiper'
import CustomImage from '@readr-media/react-image'
import styled from 'styled-components'
import Link from 'next/link'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

/**
 * @typedef {import('../type/theme').Theme} Theme
 */

/**
 * Since the title of article not only should displayed under its picture, but also should have the feature of swiper,
 * such as navigation, scrollable, change title when pagination.
 * Out solution is creating a larger container `SlideShow` to wrap the swiper, and setup swiper 'overflow' setting to show vertical content,
 * then adjust position of title to make it show under the picture.
 * So title is the element belong to swiper and have feature of it, but showing position is outside of swiper.
 * Height of container is (height of picture + margin between picture and title + height of title)
 * The position of the title is offset (margin between picture and title + height of title) from the bottom of the picture
 */
const SlideShow = styled.div`
  ${({ theme }) => theme.breakpoint.xl} {
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
  }
`
const List = styled.div`
  font-size: 20px;
  padding: 20px 0 8px;
  h2 {
    line-height: 1.4;
    color: #054f77;
    margin: 0 auto 12px;
    text-align: center;
  }
`

const ListItemLabel = styled.div`
  background-color: ${
    /**
     * @param {Object} props
     * @param {String} props.sectionSlug
     * @param {Theme} [props.theme]
     */
    ({ sectionSlug, theme }) =>
      sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : theme.color.brandColor.darkBlue
  };
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  padding: 2px 10px 1px;
  height: 24px;
  display: flex;
  align-items: center;
`

const ListItem = styled.a`
  margin: 0 auto;
  max-width: 320px;
  display: block;
  position: relative;

  .title {
    width: 100%;
    height: fit-content;
    margin: 16px 0;
    padding: 0 12px;
    line-height: 1.3;
    color: #054f77;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  ${ListItemLabel} {
    position: absolute;
    top: 0;
    left: 0;
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 460px;
    max-width: 460px;
  }
`

const EditorChoiceContainer = styled.section`
  ${SlideShow} {
    display: none;
    ${({ theme }) => theme.breakpoint.xl} {
      display: block;
    }
  }
  ${List} {
    display: block;
    ${({ theme }) => theme.breakpoint.xl} {
      display: none;
    }
  }
`

/**
 * @typedef {Object} FormattedEditorChoiceItem
 * @property {string} articleHref
 * @property {string} sectionSlug
 * @property {string} sectionName
 * /


/**
 * @typedef {Pick<import('../apollo/fragments/post').Post, 'slug' | 'title' | 'style'| 'publishedDate' | 'sections'| 'heroImage' >} EditorChoiceRawData
 */

/**
 * @typedef { EditorChoiceRawData & FormattedEditorChoiceItem } EditorChoiceItem
 */
/**
 * @typedef { EditorChoiceItem[] } EditorChoice
 */

/**
 *
 * @param {EditorChoiceItem['heroImage']} heroImage
 * @param {EditorChoiceItem['title']} title
 * @returns {JSX.Element}
 */
const editorChoiceImageJsx = (heroImage, title) => {
  return (
    <CustomImage
      images={heroImage?.resized}
      imagesWebP={heroImage?.resizedWebp}
      defaultImage="/images-next/default-og-img.png"
      loadingImage="/images-next/loading.gif"
      rwd={{
        mobile: '320px',
        tablet: '460px',
        desktop: '1024px',
        default: '1024px',
      }}
      priority={true}
      alt={title}
    />
  )
}

/**
 * @param {Object} props
 * @param {EditorChoice} props.editorChoice
 * @returns {React.ReactElement}
 */
export default function EditorChoice({ editorChoice = [] }) {
  const shouldShowEditorChoice = editorChoice.length !== 0

  return (
    <>
      {shouldShowEditorChoice ? (
        <EditorChoiceContainer>
          <List>
            <h2>編輯精選</h2>
            {editorChoice.map((item) => (
              <ListItem
                key={item.slug}
                href={item.articleHref}
                target="_blank"
                rel="noreferrer noopenner"
                className="GTM-editorchoice-list"
              >
                <ListItemLabel sectionSlug={item.sectionSlug}>
                  {item.sectionName}
                </ListItemLabel>
                {editorChoiceImageJsx(item.heroImage, item.title)}
                <p className="title">{item.title}</p>
              </ListItem>
            ))}
          </List>
          <SlideShow>
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
                  <Link
                    className="GTM-editorchoice-list"
                    href={item.articleHref}
                    target="_blank"
                    rel="noreferrer noopenner"
                  >
                    {editorChoiceImageJsx(item.heroImage, item.title)}
                    <p className="title">{item.title}</p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </SlideShow>
        </EditorChoiceContainer>
      ) : null}
    </>
  )
}
