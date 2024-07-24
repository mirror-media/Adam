import styled from 'styled-components'

import Image from 'next/image'
import ButtonCopyLink from '../shared/button-copy-link'
import DonateLink from '../shared/donate-link'
import SubscribeLink from '../shared/subscribe-link'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import Tags from '../shared/tags'
import Credits from '../shared/credits'
/**
 * @typedef {import('../../../type/theme').Theme} Theme
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
    padding-right: 40px;
    margin-bottom: 0px;
    &::after {
      position: absolute;
      content: '';
      background-color: #a1a1a1;
      width: 1px;
      height: 16px;
      transform: translateY(-50%);
      top: 50%;
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
  .subscribe-btn {
    margin-left: 8px;
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

  .normal-credits {
    max-width: 640px;
    ${({ theme }) => theme.breakpoint.xl} {
      max-width: 457.312px;
    }
  }
`
const StyledTags = styled(Tags)`
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 25.5px;
  }
`

const DonateSubscribeWrapper = styled.div`
  display: flex;
`

/**
 * @typedef {import('../../../apollo/fragments/contact').Contact[]} Contacts
 */

/**
 * @typedef {import('../../../apollo/fragments/tag').Tag[]} Tags
 */

/**
 * @typedef {Object} Credit
 * @property {Contacts} [writers]
 * @property {Contacts} [photographers]
 * @property {Contacts} [camera_man]
 * @property {Contacts} [designers]
 * @property {Contacts} [engineers]
 * @property {Contacts} [vocals]
 * @property {string} [extend_byline]
 */

/**
 * @param {Object} props
 * @param {string} props.updatedDate
 * @param {string} props.publishedDate
 * @param {Credit[]} props.credits
 * @param {Tags} props.tags
 * @returns {JSX.Element}
 */
export default function ArticleInfo({
  updatedDate,
  publishedDate,
  credits,
  tags,
}) {
  return (
    <ArticleInfoContainer>
      <Date>發布時間：{publishedDate} 臺北時間</Date>
      <Date>更新時間：{updatedDate} 臺北時間</Date>

      <Credits credits={credits} className="normal-credits"></Credits>
      <SocialMediaAndDonateLink>
        <SocialMedia>
          <ButtonSocialNetworkShare type="facebook" />
          <ButtonSocialNetworkShare type="line" />
          <ButtonCopyLink />
        </SocialMedia>
        <DonateSubscribeWrapper>
          <DonateLink className="GTM-donate-link-top" />
          <SubscribeLink className="subscribe-btn GTM-subscribe-link-top" />
        </DonateSubscribeWrapper>
      </SocialMediaAndDonateLink>
      <StyledTags tags={tags} />
    </ArticleInfoContainer>
  )
}
