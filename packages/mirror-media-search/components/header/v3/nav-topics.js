import React from 'react'
import styled from 'styled-components'

/**
 * @typedef {Pick<import('../apollo/fragments/topic').Topic, 'id' | 'slug' | 'name'>[]} Topics
 */
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
  text-underline-offset: 2.5px;
  text-decoration-thickness: 1px;
  color: #ffffff;
  display: list-item;
  list-style-type: disc;
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
 * @param {Object} props
 * @param {Topics} props.topics
 * @returns {React.ReactElement}
 */
export default function NavTopics({ topics = [] }) {
  return (
    <TopicsWrapper>
      <Topics>
        {topics.map((topic) => (
          <Topic key={topic.id} href={`/topic/${topic.slug}`}>
            <h2>{topic.name}</h2>
          </Topic>
        ))}
      </Topics>
      <Topic href={`/section/topic`}>
        <h2>更多</h2>
      </Topic>
    </TopicsWrapper>
  )
}
