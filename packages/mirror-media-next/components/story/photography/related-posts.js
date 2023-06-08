import styled from 'styled-components'
import Image from '@readr-media/react-image'
import Link from 'next/link'

/**
 * @typedef {import('../../../apollo/fragments/post').HeroImage &
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
 * @typedef {(import('../../../apollo/fragments/post').Related & {
 *  id: string, slug: string, title: string, heroImage: HeroImage})[]
 * } Relateds
 */

const Wrapper = styled.div`
  margin-bottom: 100px;
`

const Title = styled.div`
  color: white;
  font-family: 'PingFang TC';
  font-weight: 600;
  font-size: 21px;
  line-height: 150%;
  text-align: center;
  margin-bottom: 16px;

  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 500;
    font-size: 28px;
    margin-bottom: 48px;
  }
`

const PostsList = styled.ul`
  margin: 0 auto;
  width: 280px;
  display: flex;
  flex-wrap: wrap;

  ${({ theme }) => theme.breakpoint.md} {
    width: 640px;
    justify-content: space-between;
  }
`
const PostCard = styled.li`
  color: white;
  width: 280px;
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoint.md} {
    width: 276px;
    margin-bottom: 28px;
  }

  figcaption {
    font-weight: 400px;
    font-size: 18px;
    margin-top: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    ${({ theme }) => theme.breakpoint.md} {
      margin-top: 16px;
      font-size: 18px;
      font-family: var(--notoserifTC-font);
      font-weight: 500px;
      line-height: 150%;
    }
  }
`

const ImageWrapper = styled.div`
  height: 186.67px;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    height: 184px;
  }
`
/**
 * @param {Object} props
 
 */

export default function RelatedPosts({ relateds = [] }) {
  if (!relateds.length) {
    return null // not to render anything if relateds is empty
  }

  return (
    <Wrapper>
      <Title>延伸閱讀</Title>
      <PostsList>
        {relateds.map((related) => (
          <li key={related.id}>
            <PostCard>
              <Link
                href={`/story/${related.slug}`}
                target="_blank"
                className="article-image"
              >
                <ImageWrapper>
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
                </ImageWrapper>
              </Link>

              <figcaption className="article-title">
                <Link href={`/story/${related.slug}`} target="_blank">
                  {related.title}
                </Link>
              </figcaption>
            </PostCard>
          </li>
        ))}
      </PostsList>
    </Wrapper>
  )
}
