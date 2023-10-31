//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import styled from 'styled-components'
import Image from '@readr-media/react-image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useWindowDimensions from '../../../hooks/use-window-dimensions'
import { mediaSize } from '../../../styles/media'
import { MICRO_AD_UNITS } from '../../../constants/ads'
import { useDisplayAd } from '../../../hooks/useDisplayAd'

const StyledMicroAd = dynamic(
  () => import('../../../components/ads/micro-ad/micro-ad-with-label'),
  {
    ssr: false,
  }
)

const StyledPopInAdRelated = dynamic(
  () => import('../../../components/ads/pop-in/pop-in-ad-in-related-list'),
  {
    ssr: false,
  }
)

/**
 * @typedef {Pick<import('../../../apollo/fragments/post').HeroImage ,'id' | 'resized' | 'resizedWebp'>} HeroImage
 */

/**
 * @typedef {(import('../../../apollo/fragments/post').Related & {
 *  id: string, slug: string, title: string, heroImage: HeroImage})[]
 * } Relateds
 */

const Wrapper = styled.section`
  margin: 16px auto 0;
  h2 {
    font-size: 21px;
    line-height: 150%;
    margin: 0 auto 32px;
    font-weight: 600;
    text-align: center;
    font-size: 21px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 24px;
    h2 {
      display: none;
      margin: 0 auto 16px;
    }
  }
`

const Article = styled.figure`
  height: 74px;
  font-size: 15px;
  line-height: 1.3;
  color: black;
  font-weight: 400;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  color: #808080;
  background-color: #eeeeee;
  gap: 12px;
  margin: 0 auto;
  display: flex;
  position: relative;
  .article-image {
    width: 112px;
    min-width: 112px;
    max-width: 112px;
    height: 74px;
  }
  .article-title {
    position: relative;
    padding: 0 0 0 16px;
  }
  &::before {
    position: absolute;
    content: '';
    width: 8px;
    height: 100%;
    background-color: #808080;
    left: 0;
    top: 0;
  }
  ${({ theme }) => theme.breakpoint.md} {
    max-width: 640px;
    height: 90px;
    flex-direction: row-reverse;
    justify-content: space-between;
    color: #808080;
    background-color: #eeeeee;
    gap: 20px;
    font-size: 18px;
    .article-image {
      width: 87px;
      min-width: 87px;
      max-width: 87px;
      height: 100%;
      margin-right: 0;
    }
    .article-title {
      position: relative;
      padding: 0 0 0 25.75px;
      display: flex;
      justify-content: center;
    }
    &::before {
      width: 7.72px;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    .article-image {
      min-width: 135px;
      max-width: 135px;
    }
    .article-title {
      padding: 0 0 0 40px;
      &::before {
        width: 10px;
      }
    }
  }
`

const ArticleWrapper = styled.ul`
  background: transparent;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0;
    gap: 20px;
    margin-bottom: 20px;
  }
`

const AdvertisementWrapper = styled.div`
  margin-bottom: 24px;
  padding: 0px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    background: transparent;
    padding: 0px;
    gap: 20px;
    margin-bottom: 32px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 0px;
  }
`

const StyledFigcaption = styled.figcaption`
  > a {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-clamp: 3;
    -webkit-box-orient: vertical;
    ${({ theme }) => theme.breakpoint.md} {
      -webkit-line-clamp: 2; /* number of lines to show */
      line-clamp: 2;
    }
  }
`

/**
 *
 * @param {Object} props
 * @param {Relateds} props.relateds
 * @param {boolean} [props.hiddenAdvertised] - CMS Posts「google廣告違規」
 * @returns {JSX.Element}
 */
export default function RelatedArticleList({
  relateds,
  hiddenAdvertised = false,
}) {
  const { width } = useWindowDimensions()
  const device = width >= mediaSize.xl ? 'PC' : 'MB'

  const shouldShowAd = useDisplayAd(hiddenAdvertised)

  const relatedsArticleJsx = relateds.length ? (
    <ArticleWrapper>
      {relateds.map((related) => (
        <li key={related.id}>
          <Article>
            <Link
              href={`/story/${related.slug}`}
              target="_blank"
              className="article-image GTM-story-related-list"
            >
              <Image
                images={related.heroImage?.resized}
                imagesWebP={related.heroImage?.resizedWebp}
                alt={related.title}
                rwd={{
                  mobile: '500px',
                  tablet: '500px',
                  laptop: '500px',
                }}
                defaultImage={'/images-next/default-og-img.png'}
                loadingImage={'/images-next/loading.gif'}
              />
            </Link>

            <StyledFigcaption className="article-title">
              <Link
                href={`/story/${related.slug}`}
                className="GTM-story-related-list"
                target="_blank"
              >
                {related.title}
              </Link>
            </StyledFigcaption>
          </Article>
        </li>
      ))}
    </ArticleWrapper>
  ) : null

  const advertisementJsx = shouldShowAd ? (
    <AdvertisementWrapper>
      {/* micro ad */}
      {MICRO_AD_UNITS.STORY[device].map((unit) => (
        <StyledMicroAd key={unit.name} unitId={unit.id} microAdType="STORY" />
      ))}
      {/* pop-in ad */}
      <StyledPopInAdRelated />
    </AdvertisementWrapper>
  ) : null

  return (
    <Wrapper>
      <h2>延伸閱讀</h2>
      {relatedsArticleJsx}
      {advertisementJsx}
    </Wrapper>
  )
}
