import styled from 'styled-components'
import PopInAd from './pop-in-ad'
import { POP_IN_IDS } from '../../../constants/ads'

const StyledPopInAd = styled(PopInAd)`
  #_popIn_standard_mobile._popIn_recommend_container {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  #_popIn_standard_mobile,
  #_popIn_standard_pc {
    ._popIn_recommend_article {
      margin: 0px auto;
      flex-direction: column;
      gap: 12px;
      background: none;
      max-width: 280px;
      font-size: 18px;
      line-height: 1.5;
      color: black;
      font-weight: 400;

      ${({ theme }) => theme.breakpoint.md} {
        flex-direction: row-reverse;
        justify-content: space-between;
        gap: 20px;
        max-width: 640px;
        height: 90px;
        color: #808080;
        background-color: #eeeeee;
      }
    }

    ._popIn_recommend_art_img {
      width: 100%;
      order: unset;
      height: 186.67px;
      position: relative;
      padding: 0px;

      ${({ theme }) => theme.breakpoint.md} {
        width: 87px;
        height: 90px;
        max-width: 87px;
        max-height: 90px;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        width: 135px;
        max-width: 135px;
      }

      a {
        width: 100%;
        height: 100%;
        max-height: 186.67px;

        ${({ theme }) => theme.breakpoint.md} {
          max-height: 90px;
        }
      }

      &::after {
        content: '特企';
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'PingFang TC';
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 1;
        padding: 8px;
        background: #bcbcbc;
        color: #ffffff;
        position: absolute;
        bottom: 0;
        left: 0;

        ${({ theme }) => theme.breakpoint.md} {
          font-weight: 300;
          font-size: 12px;
          padding: 4px;
          line-height: 14px;
        }
      }
    }

    ._popIn_recommend_art_title {
      width: 100%;
      padding: 0;
      margin: 0;

      ${({ theme }) => theme.breakpoint.md} {
        padding: 0 20px 0 25.75px;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        padding: 0 20px 0 40px;
      }

      a {
        font-size: 18px;
        line-height: 1.5;
        color: black;
        font-weight: 400;
        max-height: none;

        ${({ theme }) => theme.breakpoint.md} {
          color: #808080;
          padding: 0;
          margin: 0;
        }
      }
    }

    ._popIn_recommend_article::before {
      display: none;

      ${({ theme }) => theme.breakpoint.md} {
        display: block;
        width: 7.72px;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        width: 10px;
      }
    }
  }

  ._popIn_recommend_article {
    margin-top: 0;
  }
`

/**
 * Show Pop In ad as related post.
 * Style of the related post will be set by the styled-component.
 * Before use this component, make sure the page include the hook `usePopInAd` to insert the Pop In script.
 * @returns {React.ReactElement}
 */
export default function PopInAdInRelatedList() {
  return (
    <>
      {POP_IN_IDS.RELATED.map((popInId) => (
        <StyledPopInAd key={popInId} popInId={popInId} />
      ))}
    </>
  )
}
