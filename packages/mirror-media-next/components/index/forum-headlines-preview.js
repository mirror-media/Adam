import styled from 'styled-components'

import { FullBleedBackgroundStyle } from '../shared/full-bleed-background'

import { IndexTitle } from './share/index-title'

const StyledSection = styled.section`
  ${FullBleedBackgroundStyle}
  background: ${({ theme }) => theme.color.brandColor.darkBlue};
`

const ContentWrapper = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.color.brandColor.white};

  ${({ theme }) => theme.breakpoint.md} {
    max-width: ${({ theme }) => theme.layout.legacyContentMaxWidth.tablet};
    padding: 40px 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: ${({ theme }) => theme.layout.legacyContentMaxWidth.desktop};
    gap: 32px;
  }
`

const StyledOl = styled.ol`
  display: flex;
  gap: 32px;
  width: 288px;
  flex-direction: column;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 20px;
    width: 504px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    flex-direction: row;
    width: auto;
  }
`

const StyledLi = styled.li`
  position: relative;
  padding-left: 24px;
  min-height: 84px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: space-between;
  line-height: 1.5;

  ${({ theme }) => theme.breakpoint.md} {
    min-height: 56px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    min-height: 84px;
    gap: 16px;
    flex: 1 1 0;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 8px;
    height: 100%;
    background: ${({ theme }) => theme.color.brandColor.lightBlue};
  }
`

const Headline = styled.h5`
  font-weight: 500;
  font-size: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`

const Timestamp = styled.p`
  color: #bcbcbc;
  font-size: 14px;
`

/**
 * Convert a UTC timestamp string to Taiwan local date and time strings
 * @param {string} utcString - UTC timestamp
 * @returns {{ date: string, time: string }} Object containing date and time strings
 */
function formatUtcToDateTime(utcString) {
  if (Number.isNaN(Date.parse(utcString))) return { date: '', time: '' }
  const dateObj = new Date(utcString)

  const date = dateObj.toLocaleDateString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const time = dateObj.toLocaleTimeString('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return { date, time }
}

/**
 * @typedef {Object} ExternalHeadline
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} updatedAt - UTC timestamp when the headline was last updated (currently unused)
 * @property {string} publishedDate - UTC timestamp when the headline was published
 */

/**
 * @param {Object} props
 * @param {ExternalHeadline[]} props.forumHeadlines - Array of latest forum headlines
 */

export default function ForumHeadlinesPreview({ forumHeadlines = [] }) {
  if (!forumHeadlines?.length) return null

  return (
    <StyledSection>
      <ContentWrapper>
        <IndexTitle color="white">鏡報論壇</IndexTitle>
        <StyledOl>
          {forumHeadlines.map((item) => {
            if (!item.title) return null

            const { date, time } = formatUtcToDateTime(item.publishedDate)

            return (
              <StyledLi key={item.id}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/external/${item.slug}`}
                >
                  <Headline>{item.title}</Headline>
                </a>
                <Timestamp>
                  {date} {time}
                </Timestamp>
              </StyledLi>
            )
          })}
        </StyledOl>
      </ContentWrapper>
    </StyledSection>
  )
}
