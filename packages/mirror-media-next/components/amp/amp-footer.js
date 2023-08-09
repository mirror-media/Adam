import Link from 'next/link'
import styled from 'styled-components'
import useSharedUrl from '../../hooks/use-shared-url'
import { SHARE_URL_FACEBOOK, SHARE_URL_LINE } from '../../constants'

const FooterWrapper = styled.div`
  height: 45px;
  margin: 37.5px 0 0 0;
  display: flex;
`

const FooterItem = styled(Link)`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  background-color: #064f77;
  align-items: center;
  & + & {
    border-left: 1px solid white;
  }
`

/**
 * @typedef {Object} ShareItem
 * @property {string} icon - The icon URL.
 * @property {string} href - The share URL.
 * @property {{ width: number, height: number }} size - The size of the icon.
 */

/**
 * @returns {JSX.Element}
 */
export default function AmpFooter() {
  const sharedUrl = useSharedUrl()
  /** @type {ShareItem[]} */
  const sharesArr = [
    {
      icon: '/images/line_white.png',
      href: `${SHARE_URL_LINE}${sharedUrl}`,
      size: { width: 40, height: 16 },
    },
    {
      icon: '/images/facebook_white.png',
      href: `${SHARE_URL_FACEBOOK}${sharedUrl}`,
      size: { width: 16, height: 24 },
    },
    {
      icon: '/images/google-plus.png',
      href: ``,
      size: { width: 24, height: 16 },
    },
  ]
  return (
    <FooterWrapper>
      {sharesArr.map((shareItem, index) => {
        return (
          <FooterItem
            key={index}
            href={shareItem.href}
            target="_blank"
            rel="noreferrer"
          >
            <div style={{ width: shareItem.size.width }}>
              {/* @ts-ignore */}
              <amp-img
                width={shareItem.size.width}
                height={shareItem.size.height}
                src={shareItem.icon}
                alt="mirrormedia"
                layout="responsive"
              />
            </div>
          </FooterItem>
        )
      })}
    </FooterWrapper>
  )
}
