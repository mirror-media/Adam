import styled from 'styled-components'
import ButtonCopyLink from '../../story/shared/button-copy-link'
import ButtonSocialNetworkShare from '../../story/shared/button-social-network-share'
import AmpCredits from '../../story/shared/credits'
import AmpHero from './amp-hero'
import AmpInfo from './amp-info'
import AmpArticleBrief from './amp-article-brief'
import useAmpSharedUrl from '../../../hooks/use-amp-shared-url'

import ExternalArticleContent from '../../external/external-article-content'

const MainWrapper = styled.div`
  margin-top: 24px;

  .i-amp-credits {
    margin: 20px 20px 0 20px;
    flex-direction: column;
    font-size: 16px;
    line-height: 16px;
    color: #4a4a4a;
    display: flex;
    flex-direction: column;
    figcaption {
      line-height: 24px;
      padding-right: 8px;
      margin-right: 8px;
      border-right: 1px solid #4a4a4a;
      color: #4a4a4a;
      min-width: fit-content;
      max-width: 72px;
      &:after {
        display: none;
      }
    }
    figure {
      width: calc(100vw - 40px);
      & + figure {
        margin-top: 8px;
      }
      li {
        color: #4a4a4a;
      }
      li:not(:last-child) {
        display: flex;
        position: relative;
        &:after {
          content: '';
          display: block;
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #c4c4c4;
          top: 50%;
          left: 100%;
          transform: translate(calc(8px - 50%), -50%);
        }
      }
    }
  }
`

const SharesWrapper = styled.ul`
  display: flex;
  padding-top: 24px;
  justify-content: center;
  gap: 16px;
`

const AmpBriefContainer = styled.section`
  & > * {
    background: rgba(0, 0, 0, 0);
    padding: 0 44px;
    margin-top: 52px;
  }
  * {
    color: ${({ theme }) => theme.color.brandColor.darkBlue};
  }
`

const AmpContentContainer = styled.section`
  padding: 0 20px;
  margin-top: 36px;
  .link-to-story {
    background: #f9f9f9;
    &:hover {
      background: #ebebeb;
      cursor: pointer;
    }
  }
`

/**
 * @typedef {import('../../../apollo/fragments/external').External} External
 */

/**
 *
 * @param {Object} props
 * @param {External} props.external
 * @returns {JSX.Element}
 */
export default function AmpMain({ external }) {
  const {
    partner,
    thumb,
    title,
    extend_byline,
    content,
    publishedDate,
    updatedAt,
    brief,
  } = external

  // Since external article only has extend_byline, use it as writer.
  const fakeContact = [{ id: 'external', name: extend_byline }]
  const credits = [{ writers: fakeContact }]

  return (
    <MainWrapper>
      <AmpInfo
        title={title}
        partner={partner}
        publishedDate={publishedDate}
        updatedAt={updatedAt}
      />
      <SharesWrapper>
        <ButtonSocialNetworkShare
          type="facebook"
          handleGetShareUrl={useAmpSharedUrl}
        />
        <ButtonSocialNetworkShare
          type="line"
          handleGetShareUrl={useAmpSharedUrl}
        />
        <ButtonCopyLink />
      </SharesWrapper>
      <AmpHero thumb={thumb} title={title} />
      <AmpCredits credits={credits} className="i-amp-credits" />
      <AmpBriefContainer>
        <AmpArticleBrief brief={brief} />
      </AmpBriefContainer>

      <AmpContentContainer>
        <ExternalArticleContent content={content} />
      </AmpContentContainer>
    </MainWrapper>
  )
}
