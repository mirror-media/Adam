import styled from 'styled-components'
import Link from 'next/link'

const GrayBox = styled.div`
  border-radius: 12px;
  background: #f2f2f2;
  padding: 16px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 48px;
    padding: 40px;
  }
`

const Message = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 24px;
  text-align: center;
`

const StyledBtn = styled.button`
  width: 100%;
  height: 48px;
  min-width: 240px;
  max-width: 420px;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  line-height: 100%;
  font-weight: 500;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.07);
  background: #054f77;
  color: #fff;
  :focus {
    outline: none;
  }

  :hover {
    background: #9cb7c6;
    color: rgba(0, 0, 0, 0.87);
  }

  transition: all 0.25s ease;

  ${({ theme }) => theme.breakpoint.md} {
    min-width: 240px;
  }
`

export default function Failed() {
  return (
    <GrayBox>
      <Message>訂單建立失敗，請重新操作再次下訂單。</Message>
      <Link href="/papermag">
        <StyledBtn>重新選擇方案</StyledBtn>
      </Link>
    </GrayBox>
  )
}
