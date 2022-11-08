import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import useClickOutside from '../hooks/useClickOutside'
import moreIcon from '../public/images/more-black.png'

const PromotionLinksWrapper = styled.div`
  display: none;

  margin-left: 5px;
  position: relative;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`

const PromotionLinksButton = styled.button`
  display: block;
  background-image: url(${moreIcon.src});
  background-position: center;
  background-repeat: no-repeat;
  width: 5px;
  height: 30.81px;
  background-size: 5px;
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: content-box;
  cursor: pointer;
  user-select: none;
`
const LinkWrapper = styled.div`
  text-align: center;
  position: absolute;
  top: 28px;
  left: 8px;
  width: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  color: #34495e;
  line-height: 1.15;
  font-size: 16px;
`
const Link = styled.a`
  display: block;
  padding: 8px 16px;
`
/**
 *
 * @param {Object} props
 * @param {import('../type').Promotion[]} props.links
 * @returns {React.ReactElement}
 */
export default function PromotionLinks({ links }) {
  const [showLinks, setShowLinks] = useState(false)
  const moreLinksWrapperRef = useRef(null)
  useClickOutside(moreLinksWrapperRef, () => {
    setShowLinks(false)
  })

  return (
    <PromotionLinksWrapper ref={moreLinksWrapperRef}>
      <PromotionLinksButton
        onClick={() => {
          setShowLinks((val) => !val)
        }}
      />
      {showLinks && (
        <LinkWrapper>
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener nooreferer"
            >
              {link.title}
            </Link>
          ))}
        </LinkWrapper>
      )}
    </PromotionLinksWrapper>
  )
}
