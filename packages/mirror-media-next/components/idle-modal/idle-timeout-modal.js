import React, { useState, useEffect, useRef } from 'react'
import { API_TIMEOUT, URL_STATIC_POPULAR_NEWS } from '../../config/index.mjs'
import axios from 'axios'
import { getActiveOrderSection } from '../../utils'
import styled from 'styled-components'
import Image from 'next/image'
import { Z_INDEX } from '../../constants'
import useClickOutside from '../../hooks/useClickOutside'
import { IDLE_MODAL_LINK } from '../../constants'
import { CUSTOMER_SERVICE_INFOS } from '../../constants/footer'
import PopularNewsItem from './popular-news-item'

const Background = styled.section`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: ${Z_INDEX.top};
  }
`

const ModalWrapper = styled.div`
  position: relative;
  width: 880px;
  height: 640px;
  border-radius: 12px;
  border: 1px #000;
  background: #fff;
  padding: 44px 67px 30px 64px;

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    &:hover {
      cursor: pointer;
    }
  }
`

const ModalTop = styled.section`
  display: flex;
  .logo {
    margin-right: 24px;
  }
`

const Hint = styled.span`
  display: block;
  flex: 1;
  padding-bottom: 8px;
  border-bottom: 3px solid #054f77;
  margin-right: 16px;
  color: #054f77;
  font-family: 'PingFang TC';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`

const PopularNewsWrapper = styled.section`
  padding: 40px 0;
  display: grid;
  gap: 24px 28px;
  grid-template-columns: 1fr 1fr;
`

const ModalFooter = styled.section`
  padding-top: 8px;
  border-top: 4px solid #054f77;
`

const LinksWrapper = styled.ul`
  display: flex;
`

const LinkItem = styled.a`
  color: #054f77;
  text-align: center;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang TC';
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  & + & {
    margin-left: 28px;
  }
`

const Info = styled.div`
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.5);
  font-family: 'PingFang TC';
  font-size: 14px;
  line-height: 150%;
  display: flex;
  justify-content: space-between;
`

const InfoTitle = styled.span`
  font-weight: 600;
  margin-right: 5px;
`

/** @typedef {import('../../apollo/fragments/post').AsideListingPost} ArticleData */

/** @typedef {ArticleData & {sectionsWithOrdered: ArticleData["sectionsInInputOrder"]} } ArticleDataContainSectionsWithOrdered */

/**
 * IdleTimeoutModal Component
 * This modal appears after the user has been idle for a specified amount of time.
 */
const IdleTimeoutModal = () => {
  const [isIdle, setIsIdle] = useState(false)
  /**
   * @type {[ArticleDataContainSectionsWithOrdered[], React.Dispatch<ArticleDataContainSectionsWithOrdered[]>]}
   */
  const [popularNews, setPopularNews] = useState([])
  const idleTimeout = 2 * 60 * 1000 // 2 minutes in milliseconds
  const modalRef = useRef(null)
  useClickOutside(modalRef, () => {
    handleClose()
  })

  useEffect(() => {
    let timeout

    const handleActivity = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsIdle(true), idleTimeout)
    }

    // Set timeout on component mount
    timeout = setTimeout(() => setIsIdle(true), idleTimeout)

    // Add event listeners to reset the timer on user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keypress', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('click', handleActivity)

    // Clean up event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keypress', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('click', handleActivity)
    }
  }, [idleTimeout])

  useEffect(() => {
    if (popularNews.length) return
    axios({
      method: 'get',
      url: URL_STATIC_POPULAR_NEWS,
      timeout: API_TIMEOUT,
    })
      .then((res) => {
        if (res && res.data) {
          /**
           * @type {ArticleDataContainSectionsWithOrdered[]}
           */
          const data = res.data
            .map((post) => {
              const sectionsWithOrdered = getActiveOrderSection(
                post.sections,
                post.sectionsInInputOrder
              )
              return { sectionsWithOrdered, ...post }
            })
            .slice(0, 6)
          setPopularNews(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching popular news:', error)
      })
  }, [])

  const handleClose = () => {
    setIsIdle(false)
  }

  return (
    isIdle && (
      <Background>
        <ModalWrapper ref={modalRef}>
          <Image
            src="/images-next/close-modal.svg"
            alt="mirrormedia"
            width={40}
            height={40}
            loading="eager"
            className="close"
            onClick={handleClose}
          />
          <ModalTop>
            <Hint>
              您已閒置2分鐘，請點擊關閉按鈕或空白處，即可回到鏡週刊網站
            </Hint>
            <Image
              src="/images-next/mirror-media-logo.svg"
              alt="mirrormedia"
              width={88}
              height={44}
              loading="eager"
              className="logo"
            />
          </ModalTop>
          <PopularNewsWrapper>
            {popularNews.map((news, index) => {
              return <PopularNewsItem key={index} item={news} />
            })}
          </PopularNewsWrapper>
          <ModalFooter>
            <LinksWrapper>
              {IDLE_MODAL_LINK.map((link, index) => {
                return (
                  <LinkItem
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.title}
                  </LinkItem>
                )
              })}
            </LinksWrapper>
            <Info>
              {CUSTOMER_SERVICE_INFOS.map((item, index) => {
                return (
                  <span key={index}>
                    <InfoTitle>{item.title}</InfoTitle>
                    <span
                      style={
                        item.name === 'customer-service-email'
                          ? { textDecoration: 'underline' }
                          : {}
                      }
                    >
                      {item.description}
                    </span>
                  </span>
                )
              })}
            </Info>
          </ModalFooter>
        </ModalWrapper>
      </Background>
    )
  )
}

export default IdleTimeoutModal
