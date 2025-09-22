import styled from 'styled-components'

const Message = styled.p`
  color: #ea4335;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 24px;
  }
`

const Duration = styled.p`
  color: #808080;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;
`

export default function AnniversaryMessage() {
  return (
    <div>
      <Message>鏡週刊 10 週年慶 全站文章、獨家新聞全網免費閱讀</Message>
      <Duration>活動期間：2025/10/1 — 2025/12/31</Duration>
    </div>
  )
}
