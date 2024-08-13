import styled from 'styled-components'
import PopularNewsItem from './popular-news-item'

const Wrapper = styled.section`
  padding: 28px 0 24px 0;
  border-top: 2px solid #054f77;
  border-bottom: 2px solid #054f77;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 0;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    border: 0px;
    padding: 0;
    margin: 72px 0;
  }
`

const Title = styled.div`
  color: #054f77;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang TC';
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 36px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    font-family: 'Noto Sans TC';
    font-size: 28px;
    font-weight: 700;
    line-height: 150%;
  }
`

const List = styled.ul`
  display: grid;
  gap: 28px;
  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: 1fr 1fr;
    gap: 48px 52px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 98px 48px;
  }
`

/**
 * @param {Object} props
 * @param {Object[]} props.popularData
 * @returns {JSX.Element}
 */
export default function PopularNews({ popularData = [] }) {
  return (
    <Wrapper>
      <Title>熱門新聞</Title>
      <List>
        {popularData.map((post) => {
          return <PopularNewsItem key={post.id} itemData={post} />
        })}
      </List>
    </Wrapper>
  )
}
