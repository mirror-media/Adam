import styled, { css } from 'styled-components'
import MicroAd from './micro-ad'

const typeListing = css`
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
  background: #f3f1e9;

  #compass-fit-widget-content {
    // Image
    .listArticleBlock__figure {
      position: relative;

      // Label ('特企')
      .listArticleBlock__figure--colorBlock {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 8px;
        color: white;
        font-size: 16px;
        font-weight: 300;
        background-color: #bcbcbc;

        ${({ theme }) => theme.breakpoint.md} {
          font-size: 18px;
          font-weight: 600;
          padding: 4px 20px;
        }
      }
    }

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

  // Micro Ad Container
  #compass-fit-widget-content,
  .latest-list_item {
    display: flex;

    ${({ theme }) => theme.breakpoint.md} {
      display: block;
    }

    // Image
    .listArticleBlock__figure {
      position: relative;
      height: 134px;
      width: 134px;

      img {
        height: 100%;
        object-fit: cover;
      }

      ${({ theme }) => theme.breakpoint.md} {
        width: 244px;
        height: 170px;
      }

      // Label ('特企')
      .listArticleBlock__figure--colorBlock {
        width: fit-content;
        height: 36px;
        padding: 8px 10px;
        text-align: center;
        color: white;
        font-size: 18px;
        line-height: 20px;
        font-weight: 400;
        background-color: #bcbcbc;
        position: absolute;
        top: 0;
        right: -76px;

        ${({ theme }) => theme.breakpoint.md} {
          font-weight: 300;
          top: auto;
          right: auto;
          bottom: 0;
          left: 0;
        }
      }
    }

    .listArticleBlock__content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-left: 20px;

      ${({ theme }) => theme.breakpoint.md} {
        position: absolute;
        bottom: 0;
        z-index: 1;
        padding-left: 0;
      }

      // Title
      h2 {
        text-align: left;
        width: 134px;
        font-size: 18px;
        line-height: 1.3;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.66);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin: 0;

        ${({ theme }) => theme.breakpoint.md} {
          width: 244px;
          height: 75px;
          font-size: 16px;
          line-height: 27px;
          font-weight: 300;
          color: white;
          background-color: rgba(5, 79, 119);
          padding: 10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      // Description
      p {
        display: none;
      }
    }
  }
`
const typeStory = css`
  //Micro Ad container
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
      background-color: #eeeeee;
      gap: 20px;
    }

    //IMAGE
    figure {
      height: 186.67px;

      img {
        height: 100%;
        object-fit: cover;
      }

      ${({ theme }) => theme.breakpoint.md} {
        width: 87px;
        min-width: 87px;
        max-width: 87px;
        height: 100%;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        min-width: 135px;
        max-width: 135px;
      }
    }

    // Title
    .pop_item_title {
      margin: 0;
      position: relative;
      padding: 16px 0 0 25.75px;
      &::before {
        position: absolute;
        content: '';
        width: 7.72px;
        height: 100%;
        background-color: #808080;
        left: 0;
        top: 0;
      }

      ${({ theme }) => theme.breakpoint.xl} {
        padding: 16px 0 0 40px;
        &::before {
          width: 10px;
        }
      }
    }

    // Label('特企')
    .pop_item--colorBlock {
      display: none;
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