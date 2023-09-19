import styled from 'styled-components'
import TopicGroupArticles from './topic-group-articles'
import dynamic from 'next/dynamic'

import { useDisplayAd } from '../../../hooks/useDisplayAd'
import { parseUrl } from '../../../utils/topic'
const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const Container = styled.main`
  margin: 0 auto;

  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.customCss
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    padding: 0;
  }

  // custom css from cms, mainly used class name .topic, .topic-title, .leading
  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.customCss
     */
    ({ customCss }) => customCss
  }
`

const Topic = styled.div`
  background-repeat: no-repeat;
  height: auto;
  padding-top: 66.66%;
  background-position: 50%;
  background-size: cover;

  background-image: ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.backgroundUrl
     */
    ({ backgroundUrl }) =>
      backgroundUrl ? `url(${backgroundUrl}) !important` : 'unset'
  };

  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {string} props.backgroundUrl
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    height: 600px;
    padding-top: 0;
  }
`

const TopicGroups = styled.div`
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
`

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto;
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 35px auto;
  }
`

/**
 * @typedef {import('../../../apollo/fragments/photo').Photo & {
 *  id: string;
 *  name: string;
 *  imageFile: {
 *    width: number;
 *    height: number;
 *  }
 *  resized: {
 *    original: string;
 *    w480: string;
 *    w800: string;
 *    w1200: string;
 *    w1600: string;
 *    w2400: string;
 *  }
 * }} Photo
 * @typedef {import('./topic-group-articles').Tag} Tag
 * @typedef {import('./topic-group-articles').Article} Article
 * @typedef {import('../../../apollo/fragments/topic').Topic } Topic
 */

/**
 * @param {Object} props
 * @param {Topic} props.topic
 * @returns {React.ReactElement}
 */
export default function TopicGroup({ topic }) {
  const { style, posts, tags, dfp } = topic
  const shouldShowAd = useDisplayAd()
  const backgroundUrl = parseUrl(topic.style)
    ? ''
    : topic.og_image?.resized?.original || topic.heroImage?.resized?.original

  return (
    <>
      <Container customCss={style} className="topicContainer">
        <Topic className="topic" backgroundUrl={backgroundUrl} />
        <TopicGroups className="groupList">
          {tags.map((tag) => (
            <TopicGroupArticles
              key={tag.id}
              tag={tag}
              posts={posts.filter((post) =>
                post.tags.some((postTag) => postTag.id === tag.id)
              )}
            />
          ))}
          {shouldShowAd && dfp && <StyledGPTAd adUnit={dfp} />}
        </TopicGroups>
      </Container>
    </>
  )
}
