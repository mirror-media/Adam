import styled from 'styled-components'
import GroupArticlesItem from './group-articles-item'

const Container = styled.div`
  &:first-of-type h2 {
    padding: 16px 0 19px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    &:first-of-type h2 {
      padding: 24px 0 35px;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    &:first-of-type h2 {
      padding: 16px 0 39px;
    }
  }
`

const GroupTitle = styled.h2`
  padding: 20px 0 19px;
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.5;
  color: #b17f5a;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
    padding: 60px 0 35px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    padding: 40px 0 39px;
  }
`

const GroupArticles = styled.div`
  display: grid;
  grid-template-columns: 320px;
  justify-content: center;
  row-gap: 20px;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 320px);
    gap: 36px 32px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    grid-template-columns: 320px 384px 320px;
    column-gap: unset;
    border-bottom: 1px solid #4a4a4a;
  }
`

/**
 * @typedef {import('./group-articles-item').Article} Article
 * @typedef {import('../../../apollo/fragments/tag').Tag & {
 *  id: string;
 *  name: string;
 *  slug: string;
 * }} Tag
 */

/**
 *
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Tag} props.tag
 * @returns {React.ReactElement}
 */
export default function TopicGroupArticles({ tag, posts }) {
  if (posts.length === 0) {
    return null
  }
  return (
    <Container className={`groupListBlockContainer tag-${tag.slug}`}>
      <GroupTitle>{tag.name}</GroupTitle>
      <GroupArticles className="groupArticles">
        {posts.map((item) => (
          <GroupArticlesItem key={item.id} item={item} />
        ))}
      </GroupArticles>
    </Container>
  )
}
