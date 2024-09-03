import styled from 'styled-components'
import Nextink from 'next/link'

import { FOOTER_PROMOTION_LINKS } from '../../constants/index'
import {
  FOOTER_SOCIAL_MEDIA_LISTS,
  CUSTOMER_SERVICE_INFOS,
} from '../../constants/footer'

const {
  PAPER_MAGAZINE_LINK,
  MAGAZINE_LINK,
  AUTH_LINK,
  DOWNLOAD_APP_LINK,
  MEDIA_DISCIPLINE_LINK,
  AI_GUIDANCE,
} = FOOTER_PROMOTION_LINKS

const PROMOTION_LISTS = [
  PAPER_MAGAZINE_LINK,
  MAGAZINE_LINK,
  AUTH_LINK,
  DOWNLOAD_APP_LINK,
  MEDIA_DISCIPLINE_LINK,
  AI_GUIDANCE,
]

const FooterWrapper = styled.footer`
  padding: 12px 0px;
  width: 320px;
  margin: 20px auto 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => theme.breakpoint.xl} {
    border-top: 4px solid #000000;
    width: 100%;
    max-width: 1024px;
    padding: 10px 0px 16px;
    margin: 32px auto 35px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
  }
`

const DesktopPromotionLists = styled.ul`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0px 28px;
    margin: 0;
  }

  li {
    line-height: 1.5;
    color: #054f77;
    font-weight: 600;
    cursor: pointer;
  }
`

const MobilePromotionLists = styled.ul`
  display: flex;
  gap: 4px 25px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: auto;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }

  li {
    line-height: 1.5;
    color: #054f77;
    font-weight: 600;
    cursor: pointer;
    align-self: center;
    justify-self: center;
  }
`

const MediaLists = styled.ul`
  display: flex;
  gap: 0 25px;
  padding: 0px 5px;
  margin-top: 4px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 16px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 0;
  }
`

const CustomerServiceList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);

  ${({ theme }) => theme.breakpoint.xl} {
    flex-direction: row;
    gap: 15px;
  }
`

const CustomerServiceTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  margin-right: 9px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-right: 11px;
    font-size: 14px;
  }
`

const CustomerServiceDescription = styled.span`
  font-size: 13px;
  line-height: 1.5;
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 14px;
  }
  > a {
    text-decoration: underline;
  }
`

function Footer() {
  const desktopPromotionLinks = PROMOTION_LISTS.map((item) => {
    return (
      <li key={item.name} aria-label={item.title}>
        <Nextink
          href={item.href}
          target="_blank"
          rel="noopener noreferrer external nofollow"
        >
          {item.title}
        </Nextink>
      </li>
    )
  })

  const mobilePromotionLinks = PROMOTION_LISTS.map((item) => {
    return (
      <li key={item.name} aria-label={item.title}>
        <Nextink
          href={item.href}
          target="_blank"
          rel="noopener noreferrer external nofollow"
        >
          {item.title}
        </Nextink>
      </li>
    )
  })

  const socialMediaLinks = FOOTER_SOCIAL_MEDIA_LISTS.map((item) => {
    return (
      <li key={item.name} aria-label={item.name}>
        <Nextink
          href={item.href}
          target="_blank"
          aria-label={item.name}
          rel="noopener noreferrer external nofollow"
        >
          <item.svgIcon />
        </Nextink>
      </li>
    )
  })

  const customerServices = CUSTOMER_SERVICE_INFOS.map((info) => {
    return (
      <li key={info.name} aria-label={info.name}>
        <CustomerServiceTitle>{info.title}</CustomerServiceTitle>
        {info.name === 'customer-service-email' ? (
          <CustomerServiceDescription>
            <a href={`mailto:${info.description}`}>{info.description}</a>
          </CustomerServiceDescription>
        ) : (
          <CustomerServiceDescription>
            {info.description}
          </CustomerServiceDescription>
        )}
      </li>
    )
  })

  return (
    <FooterWrapper>
      <DesktopPromotionLists className="footer-desktop-promotion">
        {desktopPromotionLinks}
      </DesktopPromotionLists>
      <MobilePromotionLists className="footer-mobile-promotion">
        {mobilePromotionLinks}
      </MobilePromotionLists>
      <MediaLists>{socialMediaLinks}</MediaLists>
      <CustomerServiceList>{customerServices}</CustomerServiceList>
    </FooterWrapper>
  )
}

/**
 * @typedef {'default' | 'empty'} FooterType
 */

/**
 * @param {Object} props
 * @param {FooterType} props.footerType - string enum used to select the corresponding footer
 * @returns {React.ReactElement}
 */
export default function ShareFooter({ footerType }) {
  /**
   * @param {FooterType} footerType
   * @returns {React.ReactElement}
   */
  const getFooterJsx = (footerType) => {
    switch (footerType) {
      case 'default':
        return <Footer />
      case 'empty':
        return <></>
      default:
        return <Footer />
    }
  }

  return getFooterJsx(footerType)
}
