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
    line-height: 31.5px;
    margin: 0 auto 20px;
    font-weight: 600;
    text-align: center;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 24px;
    h2 {
      display: none;
    }
  }
`

const Article = styled.figure`
  max-width: 280px;
  font-size: 18px;
  line-height: 1.5;
  color: black;
  font-weight: 400;
  .article-image {
    height: 186.67px;
  }

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
    .article-image {
      width: 87px;
      min-width: 87px;
      max-width: 87px;
      height: 100%;
    }
    .article-title {
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
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    .article-image {
      min-width: 135px;
      max-width: 135px;
    }
    .article-title {
      padding: 16px 0 0 40px;
      &::before {
        width: 10px;
      }
    }
  }
`

const ArticleWrapper = styled.ul`
  background: #eeeeee;
  padding: 48px 10px;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  gap: 24px;
  ${({ theme }) => theme.breakpoint.md} {
    background: transparent;
    padding: 0;
    gap: 20px;
  }
`

const AdvertisementWrapper = styled.div`
  margin-bottom: 24px;
  padding: 0px 10px;
  display: flex;
  flex-direction: column;
  gap: 24px;

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
                defaultImage={'/images/default-og-img.png'}
                loadingImage={'/images/loading.gif'}
              />
            </Link>

            <figcaption className="article-title">
              <Link
                href={`/story/${related.slug}`}
                className="GTM-story-related-list"
                target="_blank"
              >
                {related.title}
              </Link>
            </figcaption>
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
