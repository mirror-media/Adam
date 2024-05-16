import Link from 'next/link'
import styled from 'styled-components'

const UserDeletionFormWrapper = styled.div`
  margin-top: 80px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 48px;
  }
`
const DeletionLink = styled(Link)`
  color: #e51731;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  text-decoration: underline;
`

const DeletionPara = styled.p`
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`

export default function UserDeletionForm() {
  return (
    <UserDeletionFormWrapper>
      <DeletionLink href={`/cancelMembership`}>刪除會員</DeletionLink>
      <DeletionPara>
        提醒您，若您有訂閱會員專區單篇文章，刪除帳號可能導致無法閱讀文章。
      </DeletionPara>
    </UserDeletionFormWrapper>
  )
}
