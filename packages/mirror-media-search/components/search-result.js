import { useCallback, useRef } from 'react'
import styled from 'styled-components'

import { mediaSize, maxWidth, minWidth } from '../styles/media'
import { sectionColors } from '../styles/sections-color'
import useSearchArticles from '../hooks/useSearchArticles'
import useWindowDimensions from '../hooks/useWindowDimensions'
import LazyLoadImage from './shared/lazy-load-image.js'
import Loader from './shared/loader'

const SearchResultWrapper = styled.div`
  position: relative;
  margin: 30px 0;
  flex: 1;
  @media ${minWidth.md} {
    margin: 28px auto 39px;
    width: 656px;
  }
  @media ${minWidth.xxl} {
    margin: 42px auto 39px;
    width: 1020px;
  }
`

const SearchTitle = styled.h1`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 1.3em;
  line-height: 1.15;
  @media ${maxWidth.md} {
    margin: 0 20px;
  }
  @media ${minWidth.md} and ${maxWidth.xxl} {
    left: -20px;
    width: calc(100% + 56px);
  }
  &::after {
    content: '';
    margin: 0 0 0 26.46px;
    display: inline-block;
    flex: 1 1 auto;
    height: 4px;
    background: linear-gradient(90deg, #000 30%, #fff);
    @media ${minWidth.md} {
      margin-left: 28.46px;
    }
    @media ${minWidth.xxl} {
      margin-left: 14px;
    }
  }
`

const SearchArticles = styled.div`
  margin-top: 20px;
  display: grid;
  row-gap: 20px;
  grid-template-columns: 1fr;
  @media ${minWidth.md} {
    flex-direction: row;
    margin-top: 41px;
    grid-template-columns: repeat(2, 1fr);
    gap: 31px 40px;
  }
  @media ${minWidth.xxl} {
    margin-top: 32px;
    grid-template-columns: repeat(3, 1fr);
    gap: 35px 48px;
  }
`

const SearchArticleWraper = styled.a`
  position: relative;
  height: 317px;

  @media ${minWidth.md} {
    width: 308px;
    height: 308px;
  }
`

const SearchArticleImg = styled(LazyLoadImage)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const SearchArticle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 18px;
`
const SearchArticleCategory = styled.span`
  display: inline-block;
  padding: 8px 13px 9px 16px;
  line-height: 100%;
  font-weight: 500;
  color: #fff;
  ${({ color }) => color && `background-color: ${color};`}
`
const SearchArticleTitle = styled.div`
  line-height: 30px;
  font-weight: 300;
  height: 80px;
  padding: 10px;
  color: #fff;
  background-color: rgba(5, 79, 119, 0.7);
`

export default function SearchResult({ searchResult }) {
  const { width } = useWindowDimensions()
  const { articles, loadMore, isLoading, hasMore } =
    useSearchArticles(searchResult)
  const searchTerms = searchResult?.queries?.request[0].searchTerms ?? ''

  const observer = useRef()
  // use callback ref to re-observe when last article is changed
  const lastArticleRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore()
          }
        },
        {
          rootMargin: '20px',
          threshold: 0,
        }
      )
      if (node) observer.current.observe(node)
    },
    [hasMore, loadMore]
  )

  /*
    show divisible articles in different width
      >=1440 : 3 per line
      >=768 && <1440: 2 per line
      <768: 1 per line
  */
  let displayingArticles = []
  if (articles) {
    const divider = width >= mediaSize.xxl ? 3 : width >= mediaSize.md ? 2 : 1
    const end =
      articles.length % divider === 0
        ? articles.length
        : -articles.length % divider
    displayingArticles = hasMore ? articles.slice(0, end) : articles
  }

  return (
    <SearchResultWrapper>
      <SearchTitle>&#8220; {searchTerms} &#8221;</SearchTitle>
      <SearchArticles>
        {displayingArticles.map((article, index) => {
          const lastOne = index === displayingArticles.length - 1
          return (
            <SearchArticleWraper
              key={article.title}
              href={article.link}
              alt={article.title}
              target="_blank"
              rel="noreferrer"
              imageSrc={article.pagemap.cse_image[0].src}
              ref={lastOne ? lastArticleRef : null}
            >
              <SearchArticleImg
                src={article.pagemap.cse_image[0].src}
                alt={article.title}
              />
              <SearchArticle>
                <SearchArticleCategory
                  color={
                    sectionColors[
                      article.pagemap?.metatags[0]['section-name'] ?? 'member'
                    ]
                  }
                >
                  {article.pagemap?.metatags[0]['article:section'] ??
                    '會員專區'}
                </SearchArticleCategory>
                <SearchArticleTitle>{article.title}</SearchArticleTitle>
              </SearchArticle>
            </SearchArticleWraper>
          )
        })}
      </SearchArticles>
      {isLoading && <Loader />}
    </SearchResultWrapper>
  )
}
