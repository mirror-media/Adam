//TODOs:
// 1. add loading UI
import Link from 'next/link'
import styled from 'styled-components'
import { useEffect, useState, useRef, useCallback } from 'react'
import {
  getSectionNameGql,
  getSectionTitleGql,
  getArticleHref,
} from '../../../utils'
import Image from '@readr-media/react-image'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/** @typedef {import('../../../apollo/query/posts').ResultOfFetchListingPosts} ArticleData */

const Wrapper = styled.section`
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 618px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
  }
`
const Heading = styled.h2`
  text-align: center;
  color: ${({ theme, color }) => theme.color.brandColor[color]};
  font-size: 21px;
  line-height: 1.5;
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    text-align: left;
  }
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
    font-size: 18px;
    color: #fff;
    padding: 8px 0 8px 20px;
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
    border: 1px solid #dedede;
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

const Label = styled.div`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: fit-content;
    height: 25px;
    padding: 0 8px;
    text-align: center;
    color: white;
    font-size: 14px;
    line-height: 25px;
    font-weight: 400;
    background-color: ${
      /**
       * @param {Object} props
       * @param {string} props.sectionTitle
       * @param {Theme} [props.theme]
       */
      ({ sectionTitle, theme }) =>
        sectionTitle && theme.color.sectionsColor[sectionTitle]
          ? theme.color.sectionsColor[sectionTitle]
          : theme.color.brandColor.lightBlue
    };
  }
`
const Title = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
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

const Loading = styled.div`
  height: 500px;
  margin: auto;
  width: 100%;
  background-color: pink;
`

/**
 *
 * @param {Object} props
 * @param {string} props.heading - heading of this components, showing user what kind of news is
 * @param {boolean} props.shouldReverseOrder
 * - control the css layout of article.
 * - If is true, image of article should display at right, title and label should display at left.
 * - If is false, image of article should display at left, title and label should display at right.
 * optional, default value is `false`.
 * @param {()=>Promise<ArticleData[] | []>} props.fetchArticle
 * - A Promise base function for fetching article.
 * - If fulfilled, it will return a array of object, which item is a article.
 * - If rejected, it will return an empty array
 * @param {number} [props.renderAmount]
 * - a number of article we want to render, it will determine the height of `ArticleWrapper` to prevent Cumulative Layout Shift (CLS) problem after article is loaded.
 * @returns {JSX.Element}
 */
export default function AsideArticleList({
  heading = '',
  shouldReverseOrder = false,
  fetchArticle,
  renderAmount = 6,
}) {
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
  const newsJsx = item.map((item) => {
    const sectionName = getSectionNameGql(item.sections, undefined)
    const sectionTitle = getSectionTitleGql(item.sections, undefined)
    const articleHref = getArticleHref(item.slug, item.style, undefined)
    return (
      <li key={item.id}>
        <Article shouldReverseOrder={shouldReverseOrder}>
          <Link href={articleHref} target="_blank" className="article-image">
            <Image
              images={item?.heroImage?.resized}
              alt={item.title}
              loadingImage={'/images/loading.gif'}
              defaultImage={'/images/default-og-img.png'}
              rwd={{ mobile: '276px', tablet: '266px', desktop: '120px' }}
            />
          </Link>

          <figcaption className="article-title">
            <Label sectionTitle={sectionTitle}>{sectionName}</Label>
            <Link href={articleHref} target="_blank">
              <Title color={heading === '熱門文章' ? 'darkBlue' : 'gray'}>
                {item.title}
              </Title>
            </Link>
          </figcaption>
        </Article>
      </li>
    )
  })

  return (
    <Wrapper>
      <Heading color={heading === '熱門文章' ? 'darkBlue' : 'gray'}>
        {heading}
      </Heading>
      <ArticleWrapper renderAmount={renderAmount} ref={wrapperRef}>
        {isLoaded ? newsJsx : <Loading>Loading...</Loading>}
      </ArticleWrapper>
    </Wrapper>
  )
}
