//TODO : this component would rerender twice (once at `handleClickPrev` or `handleClickNext`, once at `handleTransitionEnd`),
//need to refactor to solve this performance issue.
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import styled from 'styled-components'

const FlashNewsWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  height: 31px;
  font-size: 16px;
  line-height: 20px;
  background: #f4f4f4;
  font-weight: 600;
  color: #054f77;
`
const ArrowWrapper = styled.div`
  width: 12px;
  margin: 0 8px 0 7px;
  user-select: none;
`
const Arrow = styled.span`
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
  &.prev::before {
    border-width: 0 5.2px 9px 5.2px;
    border-color: transparent transparent #054f77 transparent;
  }
  &.next::before {
    border-width: 9px 5.2px 0 5.2px;
    border-color: #054f77 transparent transparent transparent;
  }
`
const FlashNewsList = styled.div`
  height: 100%;
  ${({ shouldTransition }) =>
    shouldTransition ? 'transition: transform 0.35s ease;' : null}
  ${({ move }) => `transform: translateY(${move * 100}%)`}
`
const FlashNew = styled.a`
  display: block;
  padding: 5px 0 6px;
`

export default function FlashNews({ flashNews = [] }) {
  const [pageForSlide, setPageForSlide] = useState(0)
  const [shouldTransition, setShouldTransition] = useState(false)
  const [move, setMove] = useState(-1)
  const getDisplayedArticle = (pageForSlide, flashNews) => {
    const len = flashNews.length
    const curIdxPositive = (pageForSlide % len) + len
    return [
      flashNews[(curIdxPositive - 1) % len],
      flashNews[curIdxPositive % len],
      flashNews[(curIdxPositive + 1) % len],
    ]
  }
  const displayedArticle = useMemo(
    () => getDisplayedArticle(pageForSlide, flashNews),
    [pageForSlide, flashNews]
  )

  const handleClickPrev = () => {
    if (shouldTransition) {
      return
    }
    setShouldTransition(true)
    setMove((prevState) => prevState + 1)
  }
  const handleClickNext = useCallback(() => {
    if (shouldTransition) {
      return
    }
    setShouldTransition(true)
    setMove((prevState) => prevState - 1)
  }, [shouldTransition])
  const handleTransitionEnd = () => {
    setShouldTransition(false)
    if (move === -2) {
      setMove(-1)
      setPageForSlide((prevState) => prevState + 1)
    } else if (move === 0) {
      setMove(-1)
      setPageForSlide((prevState) => prevState - 1)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClickNext()
    }, 3000)
    return () => clearTimeout(timer)
  }, [handleClickNext])
  return (
    <FlashNewsWrapper>
      <ArrowWrapper className="arrows">
        <Arrow className="prev" onClick={handleClickPrev} />
        <Arrow className="next" onClick={handleClickNext} />
      </ArrowWrapper>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <FlashNewsList
        shouldTransition={shouldTransition}
        move={move}
        onTransitionEnd={handleTransitionEnd}
      >
        {displayedArticle.map((item) => (
          <FlashNew href={item.href} key={item.href}>
            <span>快訊｜</span>
            {item.title}
          </FlashNew>
        ))}
      </FlashNewsList>
    </FlashNewsWrapper>
  )
}
