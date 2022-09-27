import styled from 'styled-components'
import { minWidth } from '../styles/media'

const TopicsWrapper = styled.section`
  display: none;
  @media ${minWidth.xl} {
    display: flex;
    width: 100%;
    background: #1d9fb8;
    text-align: center;
    height: 29px;
    overflow: hidden;
  }
`
const Topics = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  padding-left: 5px;
`
const Topic = styled.a`
  font-size: 16px;
  line-height: 29px;
  height: 100%;
  width: auto;
  margin: 0 12px 0 1em;
  cursor: pointer;
  position: relative;
  text-decoration-line: underline;
  color: #ffffff;
  display: list-item;
  list-style-type: disc;
`

export default function NavTopics({ topics }) {
  return (
    <TopicsWrapper>
      <Topics>
        {topics.map((topic) => (
          <Topic key={topic._id} className="normal" href={`topic/${topic._id}`}>
            <h2>{topic.name}</h2>
          </Topic>
        ))}
      </Topics>
      <Topic className="more" href={`/section/topic`}>
        <h2>更多</h2>
      </Topic>
    </TopicsWrapper>
  )
}
