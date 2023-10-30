import styled from 'styled-components'
import HeroImageAndVideo from '../shared/hero-image-and-video'
import ArticleInfo from './article-info'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/**
 * @typedef {import('../shared/hero-image-and-video').HeroImage} HeroImage
 * @typedef {import('../shared/hero-image-and-video').HeroVideo} HeroVideo
 */

/**
 *  @typedef {import('./article-info').ArticleInfoProps} ArticleInfoProps
 */

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  line-height: 1.4;
  max-width: 680px;
  margin: 12px auto 0;
  width: 100%;
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.87);
  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 0;
    font-size: 40px;
    line-height: 1.5;
    font-weight: 600;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 0;
  }
`

const SubTitle = styled.h2`
  text-align: center;
  color: #717171;
  max-width: 680px;
  padding: 0 20px;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0 auto;
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
    line-height: 150%;
    margin-top: 10px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 0;
  }
`

const Label = styled.div`
  margin: 0 auto;
  width: fit-content;
  font-weight: 400;
  span {
    color: #fff;
    font-size: 18px;
    line-height: 1.4;
    background-color: ${
      /**
       *
       * @param {Object} param
       * @param {Theme} param.theme
       */
      ({ theme }) => theme.color.brandColor.darkBlue
    };
    padding: 0px 7.5px;
    &.section {
      background-color: #000;
    }
  }
`

const StyledArticleInfo = styled(ArticleInfo)``
const TitleAndInfo = styled.section`
  margin-top: 35px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 45px;

    ${Label} {
      order: -3;
    }
    ${Title} {
      order: -2;
    }
    ${SubTitle} {
      order: -2;
    }
    ${StyledArticleInfo} {
      order: -1;
    }
  }
`
/**
 *
 * @param {Object} props
 * @param {string} props.sectionLabelFirst
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {HeroImage | null} props.heroImage
 * @param {HeroVideo | null} props.heroVideo
 * @param {string} props.heroCaption
 * @param {ArticleInfoProps["credits"]} props.credits
 * @param {ArticleInfoProps["publishedDate"]} props.publishedDate
 * @param {ArticleInfoProps["updatedAt"]} props.updatedAt
 * @param {ArticleInfoProps["tags"]} props.tags
 * @returns {JSX.Element}
 */
export default function TitleAndInfoAndHero({
  sectionLabelFirst = '',
  title = '',
  heroImage = null,
  heroVideo = null,
  heroCaption = '',
  credits = [],
  publishedDate = '',
  updatedAt = '',
  tags = [],
  subtitle = '',
}) {
  return (
    <TitleAndInfo>
      <Label>
        <span>會員專區</span>
        {sectionLabelFirst ? (
          <span className="section">{sectionLabelFirst}</span>
        ) : null}
      </Label>
      <Title>{title}</Title>
      {!!subtitle && <SubTitle>{subtitle}</SubTitle>}
      <HeroImageAndVideo
        heroImage={heroImage}
        heroVideo={heroVideo}
        heroCaption={heroCaption}
        style="premium"
      ></HeroImageAndVideo>
      <StyledArticleInfo
        credits={credits}
        publishedDate={publishedDate}
        updatedAt={updatedAt}
        tags={tags}
      />
    </TitleAndInfo>
  )
}
