import styled from 'styled-components'

import { IS_SPECIAL_EVENT } from '../../config/index.mjs'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */
/**
 * @typedef {Object} RecallCampaignsProps
 * @property {string} [className]
 */

/**
 * @param {RecallCampaignsProps} props
 * @returns {import('react/jsx-runtime').JSX.Element | null}
 */

const Wrapper = styled.div`
  position: relative;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoint.sm} {
    width: 310px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 696px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 912px;
  }
  iframe {
    background-color: #fff;
    height: 100%;
    width: 100%;
  }
`
const Header = styled.h3`
  color: #1d9fb8;
  text-align: center;
  font-family: 'Noto Sans CJK TC';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const ViewMoreLink = styled.a`
  color: #1d9fb8;
  font-family: 'Noto Sans CJK TC';
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  text-decoration-line: underline;
  text-underline-position: from-font;
`

export default function RecallCampaigns({ className = '' }) {
  if (!IS_SPECIAL_EVENT) return null

  return (
    <Wrapper className={className}>
      <Header>2025 鏡週刊立委罷免即時開票</Header>
      <iframe src="https://www.mirrormedia.mg/projects/election2024-homepage/index.html" />
      <ViewMoreLink
        target="_blank"
        rel="noreferrer noopenner"
        href="https://www.google.com/"
      >
        查看完整資料
      </ViewMoreLink>
    </Wrapper>
  )
}
