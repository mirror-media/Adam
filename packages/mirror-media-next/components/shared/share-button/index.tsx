import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import styled, { css } from 'styled-components'

type ShareButtonProps = {
  className?: string
}

const ACTION_SIZE = 32
const ACTION_GAP = 16

const SHARE_LINK_OPTIONS = [
  {
    ariaLabel: '點擊後分享此網站連結至 Facebook',
    iconSrc: '/images-next/video-share-fb.svg',
    shareUrl: 'https://www.facebook.com/share.php?u=',
  },
  {
    ariaLabel: '點擊後分享此網站連結至 LINE',
    iconSrc: '/images-next/video-share-line.svg',
    shareUrl: 'https://social-plugins.line.me/lineit/share?url=',
  },
]

function getActionOffset(index: number) {
  return (index + 1) * (ACTION_SIZE + ACTION_GAP)
}

// Replaces @readr-media/share-button (https://github.com/readr-media/react/tree/main/packages/share-button).
// Among Adam, MirrorTV, and Mirror Daily Web, only Adam uses this package; its `styled-components: ^5.3.5` peer dependency blocked Phase 6's v6 upgrade.
const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  width: ${ACTION_SIZE}px;
  height: ${ACTION_SIZE}px;
`

const actionStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${ACTION_SIZE}px;
  height: ${ACTION_SIZE}px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`

const Trigger = styled.button`
  ${actionStyles}

  &:hover {
    background: transparent;
  }
`

const Menu = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

type AnimatedActionProps = {
  $isOpen: boolean
  $index: number
}

const animatedActionStyles = css<AnimatedActionProps>`
  ${actionStyles}

  position: absolute;
  top: 0;
  right: 0;
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transform: translateY(
    ${({ $isOpen, $index }) => ($isOpen ? `${getActionOffset($index)}px` : '0')}
  );
  transition:
    visibility 0s ${({ $isOpen }) => ($isOpen ? '0s' : '150ms')},
    opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
`

const ShareLink = styled.a<AnimatedActionProps>`
  ${animatedActionStyles}
`

const CopyButton = styled.button<AnimatedActionProps>`
  ${animatedActionStyles}
`

const Icon = styled(Image)`
  width: ${ACTION_SIZE}px;
  height: ${ACTION_SIZE}px;
`

const Toast = styled.p`
  position: fixed;
  z-index: 9999;
  top: 54px;
  left: 50%;
  margin: 0;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(73, 73, 73, 0.8);
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
  transform: translateX(-50%);
`

function getCurrentUrl() {
  return window.location.href
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('Unable to copy the current URL')
  }
}

export default function ShareButton({ className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const hideToastTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const menuId = useId()

  useEffect(() => {
    setShareUrl(encodeURIComponent(getCurrentUrl()))

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(hideToastTimerRef.current)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await copyToClipboard(getCurrentUrl())
      setIsCopied(true)
      setIsOpen(false)
      clearTimeout(hideToastTimerRef.current)
      hideToastTimerRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy story URL', error)
    }
  }

  return (
    <Wrapper className={className} ref={wrapperRef}>
      <Trigger
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label="點擊展開社群分享按鈕"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <Icon
          alt=""
          aria-hidden="true"
          height={ACTION_SIZE}
          src="/images-next/share.svg"
          width={ACTION_SIZE}
        />
      </Trigger>
      <Menu aria-label="社群分享選項" id={menuId} role="group">
        {SHARE_LINK_OPTIONS.map(
          ({ ariaLabel, iconSrc, shareUrl: shareUrlPrefix }, index) => (
            <ShareLink
              aria-label={ariaLabel}
              href={`${shareUrlPrefix}${shareUrl}`}
              key={iconSrc}
              onClick={() => setIsOpen(false)}
              rel="noopener noreferrer"
              target="_blank"
              $index={index}
              $isOpen={isOpen}
            >
              <Icon
                alt=""
                aria-hidden="true"
                height={ACTION_SIZE}
                src={iconSrc}
                width={ACTION_SIZE}
              />
            </ShareLink>
          )
        )}
        <CopyButton
          aria-label="點擊後複製此網站連結至剪貼簿"
          onClick={handleCopy}
          type="button"
          $isOpen={isOpen}
          $index={SHARE_LINK_OPTIONS.length}
        >
          <Icon
            alt=""
            aria-hidden="true"
            height={ACTION_SIZE}
            src="/images-next/video-share-copy-link.svg"
            width={ACTION_SIZE}
          />
        </CopyButton>
      </Menu>
      {isCopied && (
        <Toast aria-live="polite" role="status">
          已複製連結至剪貼簿
        </Toast>
      )}
    </Wrapper>
  )
}
