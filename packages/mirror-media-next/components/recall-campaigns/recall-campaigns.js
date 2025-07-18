import styled from 'styled-components'

import { ENV, IS_SPECIAL_EVENT } from '../../config/index.mjs'

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

const Wrapper = styled.section`
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 310px;
  color: #1d9fb8;
  font-family: 'Noto Sans CJK TC';
  font-weight: 700;
  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 924px;
  }
  iframe {
    background-color: #fff;
    width: 100%;
    height: 270px;
    ${({ theme }) => theme.breakpoint.md} {
      height: 212px;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      height: 194px;
    }
  }
`
const Header = styled.h3`
  font-size: 20px;
`

const ViewMoreLink = styled.a`
  font-size: 16px;
  text-decoration-line: underline;
  text-underline-position: from-font;
`

const prefix = ['prod', 'staging'].includes(ENV) ? 'www' : 'dev'
const iframeSrc = `https://${prefix}.mirrormedia.mg/projects/election2025-homepage/index.html`

const variables = process.env.NEXT_PUBLIC_SPECIALEVENT
const newVariables = JSON.parse(
  process.env.NEXT_PUBLIC_SPECIALEVENT.toLowerCase()
)

export default function RecallCampaigns({ className = '' }) {
  console.log(
    variables,
    typeof variables,
    'process.env.NEXT_PUBLIC_SPECIALEVENT - test'
  )

  console.log(newVariables, typeof newVariables, 'newVariables - test')

  if (!IS_SPECIAL_EVENT) return null

  return (
    <Wrapper className={className}>
      <Header>2025 鏡週刊立委罷免即時開票</Header>
      <iframe src={iframeSrc} />
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
