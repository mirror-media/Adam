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
      height: 92px;
      color: black;
      font-weight: 400;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      background-color: #eeeeee;
      gap: 12px;
      margin: 0 auto;
      display: flex;
      position: relative;

      ${({ theme }) => theme.breakpoint.md} {
        gap: 20px;
        max-width: 640px;
        height: 90px;
        color: #808080;
        background-color: #eeeeee;
        align-items: start;
        gap: 20px;
        font-size: 18px;
      }
    }

    ._popIn_recommend_art_img {
      order: unset;
      padding: 0px;
      width: 100px;
      min-width: 100px;
      max-width: 100px;
      height: 66px;
      margin-right: 16px;

      ${({ theme }) => theme.breakpoint.md} {
        width: 87px;
        min-width: 87px;
        max-width: 87px;
        height: 100%;
        margin-right: 0;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        width: 135px;
        max-width: 135px;
      }

      a {
        width: 100%;
        height: 100%;

        ${({ theme }) => theme.breakpoint.md} {
          max-height: 90px;
        }
      }

      &::after {
        content: '特企';
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 1;
        padding: 4px;
        background: #bcbcbc;
        color: #ffffff;
        position: absolute;
        bottom: 0;
        left: 0;

        ${({ theme }) => theme.breakpoint.md} {
          font-size: 12px;
          padding: 4px;
          line-height: 14px;
          font-weight: 300;
        }
      }
    }

    ._popIn_recommend_art_title {
      width: 100%;
      margin: 0;
      position: relative;
      padding: 0 0 0 18px;
      overflow: hidden;
      display: -webkit-box !important;
      -webkit-box-orient: vertical;

      ${({ theme }) => theme.breakpoint.md} {
        padding: 0 0 0 25.75px;
        height: 100%;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        padding: 0 20px 0 40px;
      }

      // title
      a {
        max-height: 100%;
        width: 100%;
        font-weight: 400;
        color: #808080 !important;
        font-size: 14px;
        line-height: 1.3;
        overflow: hidden;
        display: -webkit-box !important;
        -webkit-line-clamp: 3; /* number of lines to show */
        line-clamp: 3;
        -webkit-box-orient: vertical;
        white-space: wrap;

        ${({ theme }) => theme.breakpoint.md} {
          margin: 0;
          position: relative;
          display: flex !important;
          align-items: center;
          -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2;
          font-size: 18px;
          height: 100%;
        }
      }
    }

    ._popIn_recommend_article::before {
      position: absolute;
      content: '';
      width: 10px;
      height: 100%;
      background-color: #808080;
      left: 0;
      top: 0;

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
