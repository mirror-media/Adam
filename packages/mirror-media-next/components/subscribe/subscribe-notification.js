import styled from 'styled-components'
import { NOTIFICATIONS } from '../../constants/subscribe-constants'

const NoticeWrapper = styled.section`
  line-height: 150%;
  margin: 24px 20px;
  min-height: 100px;
  background-color: #fff;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 48px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
    margin: 48px auto;
  }
`

const Title = styled.h2`
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-weight: 500;
`

const Ul = styled.ul`
  padding-left: 18px;
  list-style: disc;
`
const Li = styled.li`
  color: ${
    /**
     * @param {{isWarning: boolean}} param
     */
    ({ isWarning }) => (isWarning ? '#e51731' : 'rgba(0, 0, 0, 0.5)')
  };
  font-size: 14px;
  font-weight: 400;
  ::marker {
    color: rgba(0, 0, 0, 0.5);
  }

  a {
    color: #1d9fb8;
    margin-left: 4px;
  }
`

export default function Notification() {
  return (
    <NoticeWrapper>
      <Title>注意事項</Title>
      <Ul>
        {NOTIFICATIONS.map((notification) => (
          <Li
            key={notification.id}
            isWarning={notification.style === 'warning'}
            dangerouslySetInnerHTML={{ __html: notification.text }}
          />
        ))}
      </Ul>
    </NoticeWrapper>
  )
}
