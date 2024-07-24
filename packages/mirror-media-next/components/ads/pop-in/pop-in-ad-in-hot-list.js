import PopInAd from './pop-in-ad'
import styled from 'styled-components'

const StyledPopInAd = styled(PopInAd)`
  #_popIn_hot {
    ._popIn_recommend_article {
      display: flex;
      flex-direction: column;
      max-width: 276px;
      margin: 0 auto;
      // max-height: 256px;
      padding: 0;
      overflow: hidden;
      border: unset;
      position: unset;
    }

    ._popIn_recommend_art_img {
      width: 100%;
      min-height: 184px;
      margin: 0;

      a {
        width: 100%;
        height: 184px;
      }
    }

    ._popIn_recommend_art_title {
      padding: 0;
      position: relative;

      a {
        margin-top: 16px;
        overflow: hidden;
        color: #054f77;
        font-size: 18px;
        line-height: 1.5;
        font-weight: 400;
        height: auto;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }

    ._popIn_label {
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      padding: 8px;
      position: absolute;
      bottom: unset;
      top: -34px;
    }
  }

  ${({ theme }) => theme.breakpoint.md} {
    #_popIn_hot {
      ._popIn_recommend_article {
        flex-direction: row;
        width: 100%;
        height: 177px;
        max-width: none;
        justify-content: space-between;
        gap: 28px;
        margin: 0 auto 0 0;
        padding: 0 !important;
        position: relative;
      }

      ._popIn_recommend_art_img {
        height: unset;
        width: 266px;
        min-height: unset;
      }

      ._popIn_label {
        padding: 0 8px !important;
        line-height: 25px;
        left: 0;
        top: unset;
        bottom: 0;
      }

      ._popIn_recommend_art_title {
        padding: 0 !important;
        position: unset;
        a {
          margin: 0 !important;
        }
      }
    }
  }

  ${({ theme }) => theme.breakpoint.xl} {
    #_popIn_hot {
      ._popIn_recommend_article {
        height: 80px;
        gap: 12px;
        position: unset;
      }

      ._popIn_recommend_art_img {
        width: 120px;
        height: 80px;

        a {
          width: 120px;
          height: 80px;
        }
      }

      ._popIn_recommend_art_title {
        ._popIn_label {
          width: fit-content;
          position: relative;
          margin-bottom: 8px;
          font-weight: 600;
        }
        a {
          -webkit-line-clamp: 2;
        }
      }
    }
  }
`
/**
 * Show Pop In ad as hot post.
 * Before use this component, make sure the page include the hook `usePopInAd` to insert the Pop In script.
 * In mirror-media-nuxt the style was set in the Pop In script.
 * Since there will be new style in 3.0, write style like ~/components/ads/pop-in/pop-in-in-related-list.js
 * or ask the ad publisher to change the style in script.
 * Check [document](https://paper.dropbox.com/doc/--B5HoYJJCDi3wuLktiME_oi2YAg-UtXMJmDEubtFfxcoB3zZ9#:h2=%E7%AE%A1%E7%90%86%E6%96%B9%E5%BC%8F) for more detail.
 *
 * @param {Object} props
 * @param {string} props.popInId
 * @param {string} [props.className]
 * @returns {React.ReactElement}
 */
export default function PopInAdInHotList({
  popInId,
  className = 'pop-in-hot-ad',
}) {
  return <StyledPopInAd popInId={popInId} className={className} />
}
