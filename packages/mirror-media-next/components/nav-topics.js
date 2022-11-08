import React from 'react'
import styled from 'styled-components'

const TopicsWrapper = styled.section`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    width: 100%;
    background: #1d9fb8;
    text-align: center;
    height: 29px;
    overflow: hidden;
  }
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
const MoreTopic = styled(Topic)`
  flex-grow: 1;
  text-align: left;
`
const Topics = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  padding-left: 5px;
  //only show 6 topic
  ${Topic}:nth-child(n + 7) {
    display: none;
  }
`

/**
 * @param {{topics: import('../type').Topic[] | []  }} props
 * @returns {React.ReactElement}
 */
export default function NavTopics({ topics }) {
  return (
    <TopicsWrapper>
      <Topics>
        {topics.map((topic) => (
          <Topic key={topic._id} href={`topic/${topic._id}`}>
            <h2>{topic.name}</h2>
          </Topic>
        ))}
      </Topics>
      <MoreTopic href={`/section/topic`}>
        <h2>更多</h2>
      </MoreTopic>
    </TopicsWrapper>
  )
}
