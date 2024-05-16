//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import { Fragment } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { useEffect, useState, useRef, useCallback } from 'react'
import {
  getSectionNameGql,
  getSectionSlugGql,
  getArticleHref,
} from '../../../utils'
import Image from '@readr-media/react-image'
import { useDisplayAd } from '../../../hooks/useDisplayAd'
import { needInsertPopInAdAfter, getPopInId } from '../../../utils/ad'

const PopInAdInHotList = dynamic(
  () => import('../../../components/ads/pop-in/pop-in-ad-in-hot-list'),
  {
    ssr: false,
  }
)

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/** @typedef {import('../../../apollo/fragments/post').AsideListingPost} ArticleData */

/** @typedef {ArticleData & {sectionsWithOrdered: ArticleData["sectionsInInputOrder"]} } ArticleDataContainSectionsWithOrdered */

const Wrapper = styled.section`
  margin: 20px auto 0;

  ${({ theme }) => theme.breakpoint.md} {
    width: 618px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
  }
`
const Heading = styled.section`
  width: 100%;
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 0;
    background-color: ${
      /**
       * @param {Object} props
       * @param {Theme} props.theme
       */
      ({ theme }) => theme.color.brandColor.darkBlue
    };
    border: 1px solid #dedede;
    padding: 8px 0 8px 20px;
  }
  .title {
    color: ${({ theme, color }) => theme.color.brandColor[color]};
    font-size: 21px;
    line-height: 1.5;

    width: fit-content;
    margin: 0 auto;
    ${({ theme }) => theme.breakpoint.md} {
      margin: 0 auto 0 0;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      font-size: 18px;
      color: #fff;
    }
  }
`
const HeadingLoading = styled(Heading)`
  border: none;

  .title {
    background-color: #efefef;
    color: #efefef;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    background-color: #efefef;
  }
`

const articleHeightMobile = 256 //px
const articleHeightTablet = 177 //px
const articleHeightDesktop = 80 //px
const articleWrapperGap = 21 //px

const ArticleWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${`${articleWrapperGap}px`};

  min-height: ${
    /**
     *
     * @param {Object} param
     * @param {number} param.renderAmount
     * @param {boolean} param.isLoaded
     */
    ({ renderAmount }) =>
      `calc(${
        renderAmount * articleHeightMobile
      }px + ${articleWrapperGap}px * ${renderAmount - 1}) `
  };
  ${({ theme }) => theme.breakpoint.md} {
    min-height: ${({ renderAmount }) =>
      `calc(${
        renderAmount * articleHeightTablet
      }px + ${articleWrapperGap}px * ${renderAmount - 1}) `};
  }
  ${({ theme }) => theme.breakpoint.xl} {
    border: ${({ isLoaded }) => (isLoaded ? '1px solid #dedede' : 'none')};
    background-color: ${({ isLoaded }) => (isLoaded ? 'unset' : '#efefef')};

    padding: 20.5px 20px;
    width: 100%;
    min-height: ${({ renderAmount }) =>
      // 20.5px is padding-top and padding-bottom of articleWrapper
      `calc(20.5px + 20.5px + ${
        renderAmount * articleHeightDesktop
      }px + ${articleWrapperGap}px * ${renderAmount - 1}) `};
    height: fit-content;
  }
`

const Article = styled.figure`
  display: flex;
  flex-direction: column;
  max-width: 276px;
  margin: 0 auto;
  height: ${`${articleHeightMobile}px`};
  .article-image {
    height: 184px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    height: ${`${articleHeightTablet}px`};
    max-width: 100%;
    justify-content: space-between;
    gap: 28px;
    margin: 0 auto 0 0;
    .article-image {
      height: 100%;
      min-width: 266px;
      max-width: 266px;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    height: ${`${articleHeightDesktop}px`};
    flex-direction: ${
      /**
       * @param {Object} props
       * @param {boolean} props.shouldReverseOrder
       */
      ({ shouldReverseOrder }) => (shouldReverseOrder ? 'row-reverse' : 'row')
    };
    gap: 12px;
    .article-image {
      min-width: 120px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
`
const FigureCaption = styled.figcaption`
  width: 100%;
`
const Label = styled.div`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: fit-content;
    height: 25px;
    padding: ${({ sectionSlug }) => (sectionSlug ? '0 8px' : '0')};
    text-align: center;
    color: white;
    font-size: 14px;
    line-height: 25px;
    font-weight: 600;
    background-color: ${
      /**
       * @param {Object} props
       * @param {string} props.sectionSlug
       * @param {Theme} [props.theme]
       */
      ({ sectionSlug, theme }) =>
        sectionSlug && theme.color.sectionsColor[sectionSlug]
          ? theme.color.sectionsColor[sectionSlug]
          : theme.color.brandColor.lightBlue
    };
  }
`
const Title = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${({ theme, color }) => theme.color.brandColor[color]};
  font-size: 18px;
  line-height: 1.5;
  font-weight: 400;
  margin-top: 16px;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
    line-height: 32px;
    margin-top: 0;
    -webkit-line-clamp: 3;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 8px;
    text-align: left;
    width: 100%;
    font-size: 16px;
    line-height: 1.5;

    font-weight: 600;
    color: ${
      /**
       * @param {Object} props
       * @param {Theme} props.theme
       */
      ({ theme }) => theme.color.brandColor.darkBlue
    };

    -webkit-line-clamp: 2;
  }
`

const ArticleLoading = styled(Article)`
  /* background-color: #efefef; */
  .article-image__loading {
    background-color: #efefef;
  }
`
const TitleLoading = styled(Title)`
  background-color: #efefef;
  color: #efefef;
  //height is same as line-height in Title
  height: 27px;
  ${({ theme }) => theme.breakpoint.md} {
    height: 32px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    height: 24px;
  }
`
/**
 *
 * @param {Object} props
 * @param {'latestNews' | 'popularNews'} props.listType - What kind of list is.
 * @param {boolean} props.shouldReverseOrder
 * - control the css layout of article.
 * - If is true, image of article should display at right, title and label should display at left.
 * - If is false, image of article should display at left, title and label should display at right.
 * optional, default value is `false`.
 * @param {()=> Promise<ArticleDataContainSectionsWithOrdered[]> | Promise<[]>} props.fetchArticle
 * - A Promise base function for fetching article.
 * - If fulfilled, it will return a array of object, which item is a article.
 * - If rejected, it will return an empty array
 * @param {number} [props.renderAmount]
 * - a number of article we want to render, it will determine the height of `ArticleWrapper` to prevent Cumulative Layout Shift (CLS) problem after article is loaded.
 * @param {boolean} [props.hiddenAdvertised] - CMS Posts「google廣告違規」
 * @returns {JSX.Element}
 */
export default function AsideArticleList({
  listType = 'latestNews',
  shouldReverseOrder = false,
  fetchArticle,
  renderAmount = 6,
  hiddenAdvertised = false,
}) {
  const { shouldShowAd } = useDisplayAd(hiddenAdvertised)

  const wrapperRef = useRef(null)
  const [item, setItem] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const handleLoadMore = useCallback(() => {
    fetchArticle().then((articles) => {
      if (articles.length && Array.isArray(articles)) {
        setItem(articles)
        setIsLoaded(true)
      } else {
        setIsLoaded(true)
      }
    })
  }, [fetchArticle])

  const heading = listType === 'latestNews' ? '最新文章' : '熱門文章'
  const headingColor = listType === 'latestNews' ? 'gray' : 'darkBlue'
  const gtmClassName =
    listType === 'latestNews'
      ? 'GTM-story-latest-list'
      : 'GTM-story-popular-list'
  useEffect(() => {
    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (isLoaded) {
            observer.unobserve(entry.target)
          } else {
            handleLoadMore()
          }
        }
      })
    }
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    })
    observer.observe(wrapperRef.current)

    return () => observer.disconnect()
  }, [isLoaded, handleLoadMore])

  const newsJsx = item.map((item, index) => {
    const sectionSlug = getSectionSlugGql(item.sectionsWithOrdered, undefined)
    const sectionName = getSectionNameGql(item.sectionsWithOrdered, undefined)
    const articleHref = getArticleHref(item.slug, item.style, undefined)

    /**
     * Determines whether to show a pop-in ad at a given index.
     * @param {number} index - The index to check for ad insertion.
     * @returns {boolean} True if pop-in ad should be inserted.
     */
    const shouldShowPopInAd = (index) => {
      return Boolean(
        shouldShowAd &&
          listType === 'popularNews' &&
          needInsertPopInAdAfter(index)
      )
    }

    return (
      <Fragment key={`wrapper-${item.id}`}>
        <li key={item.id}>
          {isLoaded ? (
            <Article shouldReverseOrder={shouldReverseOrder}>
              <Link
                href={articleHref}
                target="_blank"
                className={`article-image ${gtmClassName}`}
              >
                <Image
                  images={item?.heroImage?.resized}
                  imagesWebP={item?.heroImage?.resizedWebp}
                  alt={item.title}
                  loadingImage={'/images-next/loading.gif'}
                  defaultImage={'/images-next/default-og-img.png'}
                  rwd={{ mobile: '276px', tablet: '266px', desktop: '120px' }}
                />
              </Link>

              <FigureCaption>
                <Label sectionSlug={sectionSlug}>{sectionName}</Label>
                <Link
                  href={articleHref}
                  target="_blank"
                  className={gtmClassName}
                >
                  <Title color={headingColor}>{item.title}</Title>
                </Link>
              </FigureCaption>
            </Article>
          ) : (
            <ArticleLoading shouldReverseOrder={shouldReverseOrder}>
              <div className="article-image article-image__loading"></div>

              <FigureCaption>
                <TitleLoading />
              </FigureCaption>
            </ArticleLoading>
          )}
        </li>

        {shouldShowPopInAd(index) && (
          <li key={`pop-in-${item.id}`}>
            <PopInAdInHotList popInId={getPopInId(index)} />
          </li>
        )}
      </Fragment>
    )
  })

  return (
    <>
      <Wrapper>
        {isLoaded ? (
          <Heading color={headingColor}>
            <div className="title">{heading}</div>
          </Heading>
        ) : (
          <HeadingLoading>
            <div className="title">{heading}</div>
          </HeadingLoading>
        )}
        <ArticleWrapper
          renderAmount={renderAmount}
          isLoaded={isLoaded}
          ref={wrapperRef}
        >
          {newsJsx}
        </ArticleWrapper>
      </Wrapper>
    </>
  )
}
