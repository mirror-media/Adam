import styled from 'styled-components'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

// force page index start from 1 to prevent counting miscalculation
const INITIAL_PAGE = 1

const Test = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  background-color: pink;
  color: black;
  z-index: 9999;
`
export default function InfiniteScrollList({
  initialList = [],
  renderAmount,
  fetchListInPage,
  children,
  fetchCount: initialFetchCount,
  loader,
}) {
  /**
   * Our goal is not immediately but progressively fetch data and render it,
   * In this component, we set a state variable `dataList` for storing the list we fetched from our API server or JSON file.
   * We use a state variable `renderCount` to calculate another variable `renderList`.
   * `renderList` is a list we want to render, which is a part of `dataList` and it sizes is decided by`renderCount`.
   */

  /**
   * When user scroll to the bottom of component, if there has data which is not fetch yet (determined by `hasUnFetchedData`),
   * it will trigger function `handleMore`, fetch data (if needed) and render data.
   * If all data has fetched and rendered,`handleMore` will not execute.
   */

  const [dataList, setDataList] = useState([...initialList])
  const [fetchCount, setFetchCount] = useState(initialFetchCount)

  /**
   * The number of fetches that is send currently. State will possibly change when executing function `handleLoadMore`
   */
  const [fetchPage, setFetchPage] = useState(INITIAL_PAGE)

  const [renderCount, setRenderCount] = useState(renderAmount)

  const renderList = dataList.slice(0, renderCount)
  const [isLoading, setIsLoading] = useState(false)

  const hasUnFetchedData = useMemo(
    () => !(renderCount >= dataList.length && fetchPage >= fetchCount),
    [dataList.length, renderCount, fetchPage, fetchCount]
  )
  const isNotEnoughToRender =
    fetchPage < fetchCount && dataList.length - renderCount <= renderAmount

  /**
   * This function will execute when user scroll to the bottom of latest news
   * In this condition, this function will return and not execute anything:
   * 1. When `isLoading` is true, which means we are fetching new json file. we need this boolean to prevent infinite execute this function.
   *
   * If `isNotEnoughToRender` is true, which means `dataList` is not enough to render, so need to execute `fetchListInPage()` to get more item.
   * For example, if amount of dataList is 50, renderCount is 40, and renderAmount is 20,
   * which means should render more 20 item, but dataList only has 10 item which is not render yet, so we need to fetch data and push it to `dataList` for enough render.
   */
  const handleLoadMore = useCallback(() => {
    if (isLoading) {
      return
    }

    if (isNotEnoughToRender) {
      const newPage = fetchPage + 1
      setIsLoading(true)
      fetchListInPage(newPage).then((newList) => {
        if (newList && Array.isArray(newList)) {
          setDataList((oldList) => [...oldList, ...newList])
          if (newList.length < 10) {
            setFetchCount(newPage)
          }
        } else {
          setFetchCount(newPage)
        }
        setFetchPage(newPage)
        setIsLoading(false)
      })
    }
    setRenderCount((pre) => (pre += renderAmount))
  }, [fetchListInPage, fetchPage, renderAmount, isLoading, isNotEnoughToRender])
  const loaderRef = useRef(null)
  useEffect(() => {
    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (hasUnFetchedData) {
            handleLoadMore()
          } else {
            observer.unobserve(entry.target)
          }
        }
      })
    }
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    })
    observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [hasUnFetchedData, handleLoadMore])

  return (
    <div>
      <Test>
        <p>資料顯示狀態</p>
        <ul>
          <li>一次無限滾動應顯示 {renderAmount} 筆</li>
          <li>目前取得的資料共 {dataList.length} 筆</li>
          <li>目前顯示的資料共 {renderList.length} 筆</li>
          <li>
            {isNotEnoughToRender
              ? '取得的資料不足以顯示，需另外發request'
              : '取得的資料足以顯示，不需要發request'}
          </li>
          <li>最終應顯示 {renderCount} 筆</li>
        </ul>
        --
        <p>發request狀態</p>
        <ul>
          <li>目前已發request {fetchPage} 次</li>
          <li>最終應發request {fetchCount} 次</li>
        </ul>
        --
        <p>loading狀態</p>
        <ul>
          <li>正在發request中：{isLoading ? '是' : '否'}</li>
          <li>
            {hasUnFetchedData
              ? '仍有資料未被取得，開啟無限滾動功能'
              : '所有資料皆已被取得且顯示，關閉無限滾動功能'}
          </li>
          <li></li>
        </ul>
      </Test>
      {children(renderList)}

      <div ref={loaderRef}>{hasUnFetchedData && loader}</div>
    </div>
  )
}
