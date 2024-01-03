import Link from 'next/link'
import styled from 'styled-components'

import Image from 'next/image'
import ButtonCopyLink from '../../components/story/shared/button-copy-link'
import DonateLink from '../../components/story/shared/donate-link'
import ButtonSocialNetworkShare from '../../components/story/shared/button-social-network-share'
import { getCreditsHtml } from '../../utils/external'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const Date = styled.div`
  width: fit-content;
  height: auto;
  font-size: 14px;
  line-height: 1;
  color: #a1a1a1;
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const SocialMedia = styled.div`
  display: flex;
  gap: 10px;
  padding: 0;
  position: relative;
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 40px;
    margin-bottom: 0px;
    &::before,
    &::after {
      position: absolute;
      content: '';
      background-color: #a1a1a1;
      width: 1px;
      height: 16px;
      transform: translateY(-50%);
      top: 50%;
    }
    &::before {
      left: 20px;
    }
    &::after {
      right: 20px;
    }
  }
`

const SocialMediaAndDonateLink = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 40px;
    flex-direction: row;
    align-items: center;
  }
  .link-to-index {
    display: none;
    ${({ theme }) => theme.breakpoint.md} {
      display: block;
    }
  }
`

const ArticleInfoContainer = styled.div`
  border-left: 2px ${({ theme }) => theme.color.brandColor.darkBlue} solid;
  padding-left: 24px;
  margin: 32px 0;
  ${({ theme }) => theme.breakpoint.md} {
    border: none;
    padding-left: 0px;
    margin: 0 0 24px;
  }
`

const ExternalCredit = styled.div`
  margin: 25px 0px;
  text-align: left;
  color: rgb(52, 73, 94);
  line-height: 1.5;
  display: grid;
  grid-template-columns: 68px 1fr;
  gap: 0px 16px;
  justify-content: start;
  align-items: center;

  .link {
    color: ${
      /** @param {{theme:Theme}} param */
      ({ theme }) => theme.color.brandColor.darkBlue
    };
  }
`
const ExternalCreditTitle = styled.div`
  padding: 4px 8px;
  border: 1px solid rgb(52, 73, 94);
  border-radius: 2px;
  margin-bottom: auto;
`

/**
 * @typedef {import('../../apollo/fragments/partner').Partner} Partner
 */

/**
 * @param {Object} props
 * @param {string} props.updatedDate
 * @param {string} props.publishedDate
 * @param {string} props.credits
 * @param {Partner | null} props.partner
 * @returns {JSX.Element}
 */
export default function ArticleInfo({
  updatedDate,
  publishedDate,
  credits,
  partner,
}) {
  const creditJsx = credits.length > 0 && (
    <ExternalCredit>
      <ExternalCreditTitle>鏡週刊</ExternalCreditTitle>
      <div>
        文｜
        {partner?.slug ? (
          <Link
            className="link"
            target="_blank"
            rel="noreferrer noopenner"
            href={`/externals/${partner?.slug}`}
          >
            {getCreditsHtml(credits)}
          </Link>
        ) : (
          <>{getCreditsHtml(credits)}</>
        )}
      </div>
    </ExternalCredit>
  )

  return (
    <ArticleInfoContainer>
      <Date>發布時間：{publishedDate} 臺北時間</Date>
      <Date>更新時間：{updatedDate} 臺北時間</Date>

      {creditJsx}

      <SocialMediaAndDonateLink>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="link-to-index" href="/">
          <Image
            width={35}
            height={35}
            alt="go-to-index-page"
            src="/images-next/logo-circle@2x.png"
          ></Image>
        </a>
        <SocialMedia>
          <ButtonSocialNetworkShare type="facebook" />
          <ButtonSocialNetworkShare type="line" />
          <ButtonCopyLink />
        </SocialMedia>
        <DonateLink />
      </SocialMediaAndDonateLink>
    </ArticleInfoContainer>
  )
}
