import styled from 'styled-components'
import StyledLink from './styled-link'
import { SERVICE_RULE_URL, PRIVACY_POLICY_URL } from '../../constants/url'

const Reminder = styled.section`
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  color: rgba(0, 0, 0, 0.5);
`

export default function ReminderSection() {
  return (
    <Reminder>
      繼續使用代表您同意與接受鏡傳媒的
      <StyledLink href={SERVICE_RULE_URL}>《服務條款》</StyledLink>
      以及<StyledLink href={PRIVACY_POLICY_URL}>《隱私政策》</StyledLink>
    </Reminder>
  )
}
