//TODO: insert real Advertisement, not just fake

import styled from 'styled-components'
import Image from '@readr-media/react-image'
import Link from 'next/link'

/**
 * @typedef {import('../../../apollo/query/post').HeroImage &
 * {
 *  id: string,
 *  resized: {
 *    original: string,
 *    w480: string,
 *    w800: string,
 *    w1200: string,
 *    w1600: string,
 *    w2400: string
 *  }
 * } } HeroImage
 */

/**
 * @typedef {(import('../../../apollo/query/post').Related & {
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
  gap: 24px;
  ${({ theme }) => theme.breakpoint.md} {
    background: transparent;
    padding: 0;
    gap: 20px;
  }
`

const AdvertisementWrapper = styled.div`
  height: 300px;
  background-color: pink;
  padding: 28px 0 10px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 0 0;
  }
`

/**
 *
 * @param {Object} props
 * @param {Relateds} props.relateds
 * @returns {JSX.Element}
 */
export default function RelatedArticleList({ relateds }) {
  const relatedsArticleJsx = relateds.length ? (
    <ArticleWrapper>
      {relateds.map((related) => (
        <li key={related.id}>
          <Article>
            <Link
              href={`/story/${related.slug}`}
              target="_blank"
              className="article-image"
            >
              <Image
                images={related.heroImage?.resized}
                alt={related.title}
                rwd={{
                  mobile: '280px',
                  tablet: '87px',
                  laptop: '135px',
                }}
                defaultImage={'/images/default-og-img.png'}
                loadingImage={'/images/loading.gif'}
              />
            </Link>

            <figcaption className="article-title">
              <Link href={`/story/${related.slug}`} target="_blank">
                {related.title}
              </Link>
            </figcaption>
          </Article>
        </li>
      ))}
    </ArticleWrapper>
  ) : null

  return (
    <Wrapper>
      <h2>延伸閱讀</h2>
      {relatedsArticleJsx}
      <AdvertisementWrapper>
        特企區塊施工中......
        {/* micro ad */}
        {/* popin */}
      </AdvertisementWrapper>
    </Wrapper>
  )
}
