import styled from 'styled-components'
import Credits from '../shared/credits'
import ButtonCopyLink from '../shared/button-copy-link'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import DonateLink from '../shared/donate-link'
import SubscribeLink from '../shared/subscribe-link'
import Date from '../shared/date'
import Tags from '../shared/tags'
import { useMembership } from '../../../context/membership'

/**
 * @typedef {import('../shared/credits').Credit[]} Credits
 */
/**
 * @typedef {import('../shared/tags').Tags} Tags
 */

const StyledDate = styled(Date)`
  margin-top: 8px;

  ${({ theme }) => theme.breakpoint.md} {
    position: relative;
    margin-top: 0px;
    margin-right: 9px;
    margin-left: 9px;
  }
`
const StyledCredits = styled(Credits)`
  margin-top: 24px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 0;
  }
`
const StyledDonateLink = styled(DonateLink)`
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StyledSubscribeLink = styled(SubscribeLink)`
  margin-left: 8px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const DonateSubscribeWrapper = styled.div`
  display: flex;
`

const DateWrapper = styled.div`
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    justify-content: center;
    margin: 20px auto 0;
    ${StyledDate} {
      &:first-child {
        &::after {
          position: absolute;
          content: '';
          width: 2px;
          height: 1rem;
          top: 50%;
          right: -11px;
          transform: translate(-50%, -50%);
          background-color: ${({ theme }) => theme.color.brandColor.darkBlue};
        }
      }
    }
  }
`
const StyledTags = styled(Tags)`
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 12px;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 44px;
  padding-right: 20px;
  width: 100%;
  max-width: 684px;

  margin: 32px auto 20px;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    left: 20px;
    height: 100%;
    width: 2px;
    background-color: ${({ theme }) => theme.color.brandColor.darkBlue};
  }
  ${DateWrapper} {
    order: -1;
  }
  ${({ theme }) => theme.breakpoint.md} {
    border: unset;
    padding: 0;
    max-width: 640px;
    align-items: center;
    margin: 28px auto 20px;

    &::before {
      position: absolute;
      content: '';
      left: 0px;
      height: 100%;
      width: 0;
      background-color: unset;
    }
    ${DateWrapper} {
      order: 0;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 20px auto 20px;
  }
`

const SocialMedia = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 20px;
  a {
    margin-right: 16px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
/**
 * @typedef {Object} ArticleInfoProps
 * @property {Credits} props.credits
 * @property {string} props.publishedDate
 * @property {string} props.updatedAt
 * @property {Tags} props.tags
 * @property {string} [props.className]
 */
/**
 * @param {ArticleInfoProps} props
 */
export default function ArticleInfo({
  credits = [],
  publishedDate = '',
  updatedAt = '',
  tags = [],
  className = '',
}) {
  const { memberInfo } = useMembership()
  const { memberType } = memberInfo

  return (
    <Wrapper className={className}>
      <StyledCredits credits={credits}></StyledCredits>
      <DateWrapper className="date">
        <StyledDate timeType="publishedDate" timeData={publishedDate} />
        <StyledDate timeType="updatedDate" timeData={updatedAt} />
      </DateWrapper>
      <StyledTags tags={tags}></StyledTags>
      <SocialMedia>
        <ButtonSocialNetworkShare width={28} height={28} type="facebook" />
        <ButtonSocialNetworkShare width={28} height={28} type="line" />
        <ButtonCopyLink width={28} height={28} />
      </SocialMedia>
      <DonateSubscribeWrapper>
        <StyledDonateLink />
        {(memberType === 'not-member' ||
          memberType === 'basic-member' ||
          memberType === 'one-time-member') && <StyledSubscribeLink />}
      </DonateSubscribeWrapper>
    </Wrapper>
  )
}
