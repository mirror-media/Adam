import styled from 'styled-components'
import Link from 'next/link'
import { Frequency } from '../../../constants/membership'
import { useMembership } from '../../../context/membership'
import { PRIZE_LIST } from '../../../constants/subscribe-constants'
import { getLoginHref } from '../../../utils'
import { useRouter } from 'next/router'
const inviteMemberOptionColor = {
  premium: {
    description: '#61B8C6', //light blue of theme color
    link: '#61B8C6',
  },
  oneTime: {
    description: '#EBEBEB',
    link: '#000000',
  },
}

const InviteMemberCardWrapper = styled.div`
  width: 100%;
  height: auto;
  border-radius: 10px;
  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.25));
  padding: 20px 20px;
  background-color: ${({ theme }) => theme.color.brandColor.darkBlue};
  text-align: center;
  h3 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto 32px;
    min-width: 173px;
    font-size: 24px;
    line-height: 1.5;
    color: #fff;
    gap: 0 8px;
    font-weight: 600;
  }
  .already-member {
    margin: 0 auto;
    font-size: 16px;
    line-height: 2;
    min-height: 32px;

    color: rgba(238, 238, 238, 1);
    .login {
      text-decoration: underline;
      text-underline-offset: 2.5px;
    }
  }
  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 72px;
  }
`
const OptionWrapper = styled.div`
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`
const InviteMemberOption = styled.div`
  height: fit-content;
  margin-bottom: 32px;
  .description {
    text-align: center;
    color: ${
      /**
       * @param {{optionType: 'premium' | 'oneTime'}} param0
       */
      ({ optionType }) => inviteMemberOptionColor[optionType].description
    };
    margin: 0 auto 17px;
  }
  .link {
    text-align: center;
    display: block;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 24px;
    padding: 19px 12px;
    margin: 0 auto;
    width: ${({ optionType }) =>
      optionType === 'premium' ? '200px' : '184px'};
    font-weight: 500;
    font-size: 20px;
    line-height: 1.5;
    background-color: ${({ optionType }) =>
      inviteMemberOptionColor[optionType].link};
    color: white;
  }
`
const InviteMemberCard = ({ postId = '' }) => {
  const { isLoggedIn } = useMembership()
  const router = useRouter()
  return (
    <InviteMemberCardWrapper>
      <h3>
        <span>歡迎加入鏡週刊</span> <span> 會員專區</span>
      </h3>
      <OptionWrapper>
        <InviteMemberOption optionType="premium">
          <p className="description">
            限時優惠每月${PRIZE_LIST.monthly}元 <br></br>全站看到飽
          </p>

          <Link
            href="/subscribe"
            target="_blank"
            className="link GTM-subscribe-premium"
          >
            加入premium會員
          </Link>
        </InviteMemberOption>
        <InviteMemberOption optionType="oneTime">
          <p className="description">
            ＄{PRIZE_LIST.oneTime}元可享單篇好文14天 <br></br>無限瀏覽
          </p>

          <Link
            href={
              postId
                ? `/subscribe/info?plan=${Frequency.OneTimeHyphen}&one-time-post-id=${postId}`
                : '/subscribe'
            }
            className="link GTM-subscribe-one-time"
            target="blank"
          >
            解鎖單篇報導
          </Link>
        </InviteMemberOption>
      </OptionWrapper>
      <p className="already-member">
        {isLoggedIn ? null : (
          <>
            已經是會員？
            <Link href={getLoginHref(router)} className="login GTM-login">
              立即登入
            </Link>
          </>
        )}
      </p>
    </InviteMemberCardWrapper>
  )
}
const Wrapper = styled.div`
  width: 100%;

  margin: 0 auto;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    width: 100%;
    height: 300px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 80%);
  }
`
/**
 * The Article Mask for story page, displayed when user is not subscribe certain member only article.
 * @param {Object} props
 * @param {string} props.postId
 * @returns
 */
export default function ArticleMask({ postId = '' }) {
  /**
   * Why we need class name `paywall`?
   * Because we need to indicate this is a paywall component and there are paywalled content behind.
   * To achieve that, we need to assign which one is paywall component by using certain class name in component `json-lds-script`,
   * @see https://developers.google.com/search/docs/appearance/structured-data/paywalled-content
   */
  return (
    <Wrapper className="paywall">
      <InviteMemberCard postId={postId}></InviteMemberCard>
    </Wrapper>
  )
}
