import styled from 'styled-components'

const BriefContainer = styled.div`
  padding: 16px 24px;
  font-weight: 500;
  font-size: 18px;
  line-height: 36px;

  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 400;
    font-size: 19.2px;
    padding: 24px 32px;
  }
  *,
  *::before,
  *::after {
    color: white;
  }
`

/**
 * @param {Object} props
 * @param {string} props.brief
 */
export default function AmpArticleBrief({ brief }) {
  return <BriefContainer>{brief}</BriefContainer>
}
