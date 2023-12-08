import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Z_INDEX } from '../../constants'

const ModalWrapper = styled.div`
  position: fixed;
  cursor: default;
  top: -55px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${Z_INDEX.header};

  ${({ theme }) => theme.breakpoint.md} {
    top: -48px;
  }
`

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 28px 20px;
  max-height: 458px;
  width: 280px;
  overflow-y: scroll;
  word-wrap: break-word;
  cursor: default;

  a {
    color: #1d9fb8;
    :hover {
      text-decoration: underline;
    }
  }

  ${({ theme }) => theme.breakpoint.md} {
    height: 499px;
    width: 244px;
    padding: 28px 40px;
    max-height: 472px;
    width: 480px;
  }
`

const CloseButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-image: url('/images-next/close-circle.svg');
  background-size: cover;

  ${({ theme }) => theme.breakpoint.md} {
    top: 10px;
    right: 10px;
  }
`

const Desc = styled.p`
  color: #000;
  font-size: 14px;
  font-weight: 500;
  line-height: 180%;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
  }
`

export default function PodcastModal({ podcast, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleClickOutside = (event) => {
      handleOutsideClick(event)
    }

    window.addEventListener('mousedown', handleClickOutside)

    // Prevent scrolling on the body when the modal is open
    document.body.style.overflow = 'hidden'

    // Prevent touch scroll on body (mobile devices)
    document.body.addEventListener('touchmove', preventBodyScroll, {
      passive: false,
    })

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)

      // Re-enable scrolling on the body when the modal is closed
      document.body.style.overflow = 'auto'

      // Remove touch scroll prevention on body
      document.body.removeEventListener('touchmove', preventBodyScroll)
    }
  }, [onClose])

  // Function to prevent touch scroll on body
  const preventBodyScroll = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      event.preventDefault()
    }
  }

  // Format the podcast description with line breaks and wrap links in <a> tags
  const formatDescriptionWithLineBreaks = (description) => {
    const linkRegex = /(https?:\/\/\S+)(?=\s|$)/g // Regex pattern to match links

    return description.split(linkRegex).map((segment, index) => {
      if (segment.match(linkRegex)) {
        return (
          <a
            key={index}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment}
          </a>
        )
      } else {
        return (
          <Desc key={index}>
            {segment}
            <br /> {/* Render a line break after each paragraph */}
          </Desc>
        )
      }
    })
  }

  return (
    <ModalWrapper>
      <ModalContent ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <Desc>{podcast.title}</Desc>
        <br />
        <div>{formatDescriptionWithLineBreaks(podcast.description)}</div>
      </ModalContent>
    </ModalWrapper>
  )
}
