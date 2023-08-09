import styled, { css } from 'styled-components'
import MicroAd from './micro-ad'

const typeListing = css`
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
  background: #f3f1e9;

  // Micro AD container
  #compass-fit-widget-content {
    // AD Image
    .listArticleBlock__figure {
      position: relative;
      height: 214px;

      ${({ theme }) => theme.breakpoint.xl} {
        height: 147px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      // AD Label ('特企')
      .listArticleBlock__figure--colorBlock {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 8px;
        color: white;
        background-color: #bcbcbc;
        font-family: 'PingFang TC';
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 1;

        ${({ theme }) => theme.breakpoint.md} {
          font-weight: 600;
          padding: 4px 20px;
          line-height: 1.5;
        }
      }
    }

    // AD Detail
    .listArticleBlock__content {
      margin: 20px 20px 36px 20px;

      ${({ theme }) => theme.breakpoint.md} {
        margin: 20px;
      }
      ${({ theme }) => theme.breakpoint.xl} {
        margin: 8px 8px 40px 8px;
      }

      // Title
      h2 {
        color: #054f77;
        line-height: 25px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;

        ${({ theme }) => theme.breakpoint.md} {
          height: 75px;
        }
        ${({ theme }) => theme.breakpoint.xl} {
          font-size: 18px;
        }
      }

      // Description
      p {
        font-size: 16px;
        color: #979797;
        margin-top: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;

        ${({ theme }) => theme.breakpoint.md} {
          margin-top: 16px;
        }
        ${({ theme }) => theme.breakpoint.xl} {
          margin-top: 20px;
          -webkit-line-clamp: 4;
        }
      }
    }
  }
`
const typeHome = css`
  display: flex;
  width: 288px;
  margin: 0 auto;
  padding: 15px 0;
  border-bottom: 1px solid #b8b8b8;

  ${({ theme }) => theme.breakpoint.md} {
    position: relative;
    margin: 0;
    width: 244px;
    padding: 0;
    bottom: unset;
  }

  // Mobile: AD Image
  > a {
    display: inline-block;
    position: relative;
    height: 134px;
    min-width: 134px;
  }

  // Mobile: AD Detail
  .latest-list_item_title {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 20px;
    //Since AD uses inline-style to set the background-color, it is necessary to use !important.
    background-color: #ffffff !important;

    ${({ theme }) => theme.breakpoint.md} {
      position: absolute;
      bottom: 0;
      z-index: 1;
      //Since AD uses inline-style to set padding, it is necessary to use !important.
      padding-left: 0 !important;
    }

    // Mobile: AD Label('特企')
    .latest-list_item_label {
      width: fit-content;
      height: 36px;
      padding: 8px 10px;
      text-align: center;
      color: white;
      font-size: 18px;
      line-height: 20px;
      font-weight: 400;
    }

    // AD Title
    > a {
      text-align: left;
      width: 134px;
      font-size: 18px;
      line-height: 1.3;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.66);

      h3 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }

      ${({ theme }) => theme.breakpoint.md} {
        width: 244px;
        font-size: 16px;
        line-height: 27px;
        font-weight: 300;
        color: white;
        background-color: rgba(5, 79, 119, 0.8);
        padding: 10px;

        h3 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }

    // Mobile: AD Description Brief
    span.brief {
      display: none;
    }
  }

  // Desktop: AD Container
  .latest-list_item {
    // Desktop: AD Image
    > a {
      ${({ theme }) => theme.breakpoint.md} {
        display: inline-block;
        position: relative;
        width: 244px;
        height: 170px;
        position: relative;

        .latest-list_item_img {
          object-fit: cover;
          height: 100%;
        }
      }
    }

    // Desktop: AD Label('特企')
    .latest-list_item_label {
      ${({ theme }) => theme.breakpoint.md} {
        width: fit-content;
        height: 36px;
        padding: 8px 10px;
        text-align: center;
        color: white;
        font-size: 18px;
        line-height: 20px;
        font-weight: 300;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
`
const typeStory = css`
  ${({ theme }) => theme.breakpoint.xl} {
    height: 90px;
  }

  // Mobile: Micro AD container
  #compass-fit-widget-content {
    max-width: 280px;
    font-size: 18px;
    line-height: 1.5;
    color: black;
    font-weight: 400;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;

    ${({ theme }) => theme.breakpoint.md} {
      max-width: 640px;
      height: 90px;
      flex-direction: row-reverse;
      justify-content: space-between;
      color: #808080;
      //Since AD uses inline-style to set the background-color, it is necessary to use !important.
      background-color: #eeeeee !important;
      gap: 20px;
    }

    // Mobile: AD Image
    figure {
      height: 186.67px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      ${({ theme }) => theme.breakpoint.md} {
        width: 87px;
        min-width: 87px;
        max-width: 87px;
        height: 100%;
      }
    }

    // Mobile: AD Title
    .pop_item_title {
      //Since AD uses inline-style to set the background-color, it is necessary to use !important.
      background: none !important;
      ${({ theme }) => theme.breakpoint.md} {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 20px 0 25.75px;
        &::before {
          position: absolute;
          content: '';
          width: 7.72px;
          height: 100%;
          background-color: #808080;
          left: 0;
          top: 0;
        }
      }
    }

    // Mobile: AD Label('特企')
    .pop_item--colorBlock {
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

    // Mobile: useless empty component
    .compass-fit-clear {
      display: none;
    }

    // Desktop: Micro AD container
    .popListVert-list__item {
      ${({ theme }) => theme.breakpoint.xl} {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        position: relative;
        height: 100%;
      }

      // Desktop: AD Image
      > a {
        ${({ theme }) => theme.breakpoint.xl} {
          min-width: 135px;
          max-width: 135px;

          img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
      }

      // Desktop: AD detail
      .popListVert-list__item--text {
        ${({ theme }) => theme.breakpoint.xl} {
          // Desktop: AD Label('特企')
          > div {
            background: #bcbcbc;
            color: #ffffff;
            position: absolute;
            bottom: 0;
            right: 103px;
            font-family: 'PingFang TC';
            font-style: normal;
            font-weight: 300;
            font-size: 12px;
            line-height: 14px;
            padding: 4px;
          }

          // Desktop: AD Title
          h2 {
            text-align: left;
            display: block;
            height: 100%;
            position: relative;
            padding: 0 20px 0 40px;
            font-style: normal;
            //Since AD uses inline-style to set the font-weight, it is necessary to use !important.
            font-weight: 400 !important;
            font-size: 18px;
            line-height: 1.5;
            color: #808080;
            display: flex;
            align-items: center;

            > a {
              //Since AD uses inline-style to set the font-weight, it is necessary to use !important.
              font-weight: 400 !important;
            }

            &::before {
              position: absolute;
              content: '';
              width: 10px;
              height: 100%;
              background-color: #808080;
              left: 0;
              top: 0;
            }
          }
        }
      }
    }
  }
`

/**
 * @typedef {import('../../../utils/ad').MicroAdType} MicroAdType
 */
/**
 * @param {Object} props
 * @param {MicroAdType} props.type
 */
const StyledMicroAd = styled(MicroAd)`
  ${({ type }) => {
    switch (type) {
      case 'HOME':
        return typeHome
      case 'LISTING':
        return typeListing
      case 'STORY':
        return typeStory
      default:
        return typeListing
    }
  }}
`

/**
 * @param {Object} props
 * @param {string} props.unitId
 * @param {MicroAdType} props.microAdType
 * @returns {JSX.Element}
 */
export default function MicroAdWithLabel({ unitId, microAdType }) {
  return <StyledMicroAd unitId={unitId} type={microAdType} />
}
