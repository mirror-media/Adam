import styled from 'styled-components'

const Page = styled.div`
  height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MsgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
  margin-top: 140px;
`

const H1 = styled.h1`
  font-family: 'Helvetica Neue';
  font-weight: 400;
  font-size: 128px;
  line-height: 120%;
  color: #61b8c6;
`

const Text = styled.p`
  font-family: var(--notosansTC-font);
  font-weight: 500;
  font-size: 24px;
  color: #61b8c6;
`

export default function Custom500() {
  return (
    <Page>
      <MsgContainer>
        <H1>500</H1>
        <Text>這個網頁無法正常運作</Text>
      </MsgContainer>
    </Page>
  )
}
