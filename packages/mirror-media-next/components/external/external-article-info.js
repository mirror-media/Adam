import styled from 'styled-components'
import Link from 'next/link'
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
  a {
    color: #0b4fa2;
  }
`
const ExternalCreditTitle = styled.div`
  padding: 4px 8px;
  border: 1px solid rgb(52, 73, 94);
  border-radius: 2px;
  margin-bottom: auto;
`

/**
 * @param {Object} props
 * @param {string} props.updatedDate
 * @param {string} props.publishedDate
 * @param {string} props.credits
 * @returns {JSX.Element}
 */
export default function ArticleInfo({ updatedDate, publishedDate, credits }) {
  const creditJsx = credits.length > 0 && (
    <ExternalCredit>
      <ExternalCreditTitle>鏡週刊</ExternalCreditTitle>
      <p>文｜{getCreditsHtml(credits)} </p>
    </ExternalCredit>
  )

  return (
    <ArticleInfoContainer>
      <Date>發布時間：{publishedDate} 臺北時間</Date>
      <Date>更新時間：{updatedDate} 臺北時間</Date>

      {creditJsx}

      <SocialMediaAndDonateLink>
        <Link className="link-to-index" href="/">
          <Image
            width={35}
            height={35}
            alt="go-to-index-page"
            src="/images-next/logo-circle@2x.png"
          ></Image>
        </Link>
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
