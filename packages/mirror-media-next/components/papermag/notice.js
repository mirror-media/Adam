import styled from 'styled-components'

const NoticeWrapper = styled.section`
  line-height: 150%;
  margin: 24px auto;
  width: 90%;
  min-height: 100px;
  background-color: #fff;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 48px auto;
    width: 85%;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
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
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: 400;
`

function Notice() {
  return (
    <NoticeWrapper>
      <Title>注意事項</Title>
      <Ul>
        <Li>目前無提供國外海外地區的紙本雜誌訂閱及寄送服務。</Li>
        <Li>完成訂購後，開始寄送期數將由服務人員提供。</Li>
        <Li>
          雜誌每週三出刊，將於週四(含)前完成寄送，若當週五仍未收到，請來電查詢。
        </Li>
        <Li>
          若需更改收件地址，請於每週四中午12:00前來電，我們將於下週寄送至新址。
        </Li>
        <Li>
          訂單成立後，會收到我們email給您的確認信。手機號碼及電子信箱請務必正確填寫。若無收到信請檢查該郵件是否被過濾成垃圾郵件。
        </Li>
        <Li>
          雜誌的取消/退訂注意事項
          <Ul>
            <Li>
              雜誌未配送前可全額退款。雜誌如已開始配送，退費金額=原訂金額-(零售價$75x訂閱已配送期數)-原訂金額之5%手續費。
            </Li>
            <Li>註1：訂閱已配送期數包含已進入配送作業流程的期數。</Li>
          </Ul>
        </Li>
        <Li>紙本訂戶專線：(02) 6633-3882，電子信箱：service@mirrormedia.mg</Li>
      </Ul>
    </NoticeWrapper>
  )
}

export default Notice
