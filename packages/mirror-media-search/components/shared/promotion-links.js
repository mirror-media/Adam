import { useRef, useState } from 'react'
import styled from 'styled-components'
import useClickOutside from '../../hooks/useClickOutside'
import moreIcon from '../../public/images/more-grey.png'
import { maxWidth } from '../../styles/media'

const PromotionLinksWrapper = styled.div`
  margin-left: 5px;
  position: relative;
  @media ${maxWidth.xl} {
    display: none;
  }
`

const PromotionLinksButton = styled.button`
  display: block;
  background-image: url(${moreIcon.src});
  background-position: center;
  background-repeat: no-repeat;
  width: 5px;
  height: 20px;
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
