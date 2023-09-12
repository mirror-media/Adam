//TODO: insert real Advertisement, not just fake

import styled from 'styled-components'
import Image from '@readr-media/react-image'
import Link from 'next/link'

/**
 * @typedef {Pick<import('../../../apollo/fragments/post').HeroImage ,'id' | 'resized' | 'resizedWebp'>} HeroImage
 */

/**
 * @typedef {import('../../../apollo/fragments/post').Related[]} Relateds
 */

const Wrapper = styled.section`
  margin: 0 auto;
  h2 {
    font-size: 21px;
    line-height: 1.5;
    margin: 0 auto;
    font-weight: 600;
    text-align: center;
  }
  ${({ theme }) => theme.breakpoint.md} {
    h2 {
      display: none;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    h2 {
      font-weight: 500;

      display: block;
      font-size: 28px;
    }
  }
`
const ArticleWrapper = styled.ul`
  margin: 16px auto 0px;

  ${({ theme }) => theme.breakpoint.md} {
    background: transparent;
    margin: 0px 11px 0px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 36px auto 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`

const Article = styled.figure`
  max-width: 280px;
  margin: 0 auto 24px;

  font-size: 18px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 400;
  .article-image {
    display: block;
    height: 186.67px;
  }
  .article-title {
    margin-top: 12px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 100%;
    height: 90px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    color: #808080;
    line-height: 1.3;
    background-color: #eeeeee;
    .article-image {
      min-width: 90px;
      max-width: 90px;
      height: 100%;
    }
    .article-title {
      margin-top: 0;
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
    height: fit-content;
    width: 276px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 500;
    font-family: var(--notoserifTC-font);
    line-height: 1.5;
    margin-bottom: 36px;
    .article-image {
      display: block;
      height: 186.67px;
      width: 100%;
      max-width: 276px;
      min-width: 276px;
    }
    .article-title {
      margin-top: 16px;
      padding: 0;
      &::before {
        display: none;
      }
    }
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
              className="article-image GTM-story-related-list"
            >
              <Image
                images={related.heroImage?.resized}
                imagesWebP={related?.heroImage?.resizedWebp}
                alt={related.title}
                rwd={{
                  mobile: '500px',
                  tablet: '500px',
                  laptop: '500px',
                }}
                width={'100%'}
                height={'100%'}
                defaultImage={'/images/default-og-img.png'}
                loadingImage={'/images/loading.gif'}
              />
            </Link>

            <figcaption className="article-title GTM-story-related-list">
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
    </Wrapper>
  )
}
