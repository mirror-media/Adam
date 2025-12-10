import { IS_ANNIVERSARY_MODAL_ACTIVE } from '../config/index.mjs'
import styled from 'styled-components'
import { Z_INDEX } from '../constants'
import { useState, useEffect } from 'react'

const getCookie = (name) => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// TODO: 周年慶完結後這個元件跟 IS_ANNIVERSARY_PROMO_ACTIVE 一起刪除
const setCookie = (name, value, days = 365) => {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const ModalBackground = styled.div`
  background: rgba(0, 0, 0, 0.6);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${Z_INDEX.top};
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.div`
  background: white;
  display: flex;
  padding: 40px 8px 32px 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  max-width: 280px;
  position: relative;
  ${({ theme }) => theme.breakpoint.md} {
    max-width: 440px;
    padding: 40px 20px 32px 20px;
  }
`

const ModalTitle = styled.p`
  color: #000;
  text-align: center;
  font-family: 'PingFang TC';
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
`

const ModalTime = styled.div`
  color: #e51731;
  text-align: center;
  font-family: 'PingFang TC';
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #054f77;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 2px;
    background: white;
    border-radius: 1px;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover {
    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  &:focus {
    outline: none;
  }
`

export default function AnniversaryModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!IS_ANNIVERSARY_MODAL_ACTIVE) return

    const hasSeenModal = getCookie('anniversary_modal_seen')
    if (!hasSeenModal) {
      setIsModalOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!IS_ANNIVERSARY_MODAL_ACTIVE) return

    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  if (!IS_ANNIVERSARY_MODAL_ACTIVE) return null

  const wordings = {
    title: ['鏡週刊 10 週年慶 🎉', ' 📣 全站文章、獨家新聞全網免費閱讀'],
    time: '活動期間：2025/10/1 — 2025/12/31',
  }

  const handleCloseClick = () => {
    setIsModalOpen(false)
    setCookie('anniversary_modal_seen', 'true', 365)
  }

  const handleContainerClick = (e) => {
    e.stopPropagation()
  }

  if (!isModalOpen) return null

  return (
    <ModalBackground onClick={handleCloseClick}>
      <ModalContainer onClick={handleContainerClick}>
        <CloseButton onClick={handleCloseClick} />
        <ModalTitle>
          {wordings.title.map((title, index) => (
            <p key={index}>{title}</p>
          ))}
        </ModalTitle>
        <ModalTime>{wordings.time}</ModalTime>
      </ModalContainer>
    </ModalBackground>
  )
}
