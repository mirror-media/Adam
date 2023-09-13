import styled from 'styled-components'
import Notice from './notice'

const Message = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
  margin-top: 24px;
  padding: 0 10px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 36px;
    margin-top: 48px;
  }
`
const Text = styled.p`
  color: #e51731;
  font-size: 14px;
  font-weight: 400;
  margin-top: 8px;
  padding: 0 10px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 36px;
  }
`

const GrayBox = styled.div`
  border-radius: 12px;
  background: #f2f2f2;
  padding: 16px;
  margin-top: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 48px;
    padding: 40px 60px;
  }
`

const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
`

const ItemWrapper = styled.div`
  display: flex;
  margin-top: 8px;
`

const Item = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  margin-right: 16px;
  width: 96px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-right: 80px;
  }
`
const Info = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
`
const ContentWrapper = styled.div`
  display: flex;
  margin: 24px 0;
  margin-bottom: 48px;
  flex-direction: column;
  ${({ theme }) => theme.breakpoint.lg} {
    flex-direction: row;
    margin: 24px 0;
  }
`
const OrderContent = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  margin-right: 16px;
  width: 96px;
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-right: 80px;
  }
`
const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  :not(:first-child) {
    margin-top: 8px;
  }
  width: 100%;

  ${({ theme }) => theme.breakpoint.lg} {
    width: 664px;
  }
`

const DetailItem = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
  }

  span {
    margin-right: 8px;
  }

  .number {
    color: #054f77;
    margin-left: 8px;
  }
`
const Price = styled.div`
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  text-align: right;
  /* Body_150% */
  font-family: PingFang TC;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  min-width: 90px;
`

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Hr = styled.hr`
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  margin: 16px 0;
`
const CustomerTitle = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 500;
  margin-top: 24px;
`

const CustomerItem = styled.div`
  display: flex;
  margin-top: 8px;

  .name {
    color: rgba(0, 0, 0, 0.5);
    font-size: 18px;
    font-weight: 400;
    margin-right: 16px;
    width: 96px;
  }

  .value {
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    font-weight: 400;
    width: 90%;
  }
`

/**
 * @param {Object} props
 * @param {Object} props.orderData
 * @return {JSX.Element}
 */

export default function Succeeded({ orderData }) {
  const {
    orderId,
    date,
    discountCode,
    orderInfoPurchasedList,
    purchaseName,
    purchaseEmail,
    purchaseMobile,
    receiveName,
    receiveMobile,
    receiveAddress,
  } = orderData

  function addCommas(number) {
    let numberStr = number.toString()
    numberStr = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numberStr
  }

  return (
    <>
      <Message>您已完成付款，以下為本次訂購資訊。</Message>
      <Text>
        您將收到完成訂閱通知信、付款完成通知信、電子發票開立通知信。若無收到請檢查該郵件是否被過濾成垃圾郵件。
      </Text>
      <GrayBox>
        {/* 訂單資訊 */}
        <Title>訂單資訊</Title>
        <ItemWrapper>
          <Item>訂單編號</Item>
          <Info>{orderId}</Info>
        </ItemWrapper>
        <ItemWrapper>
          <Item>訂單日期</Item>
          <Info>{date}</Info>
        </ItemWrapper>
        {discountCode && (
          <ItemWrapper>
            <Item>優惠折扣碼</Item>
            <Info>{discountCode}</Info>
          </ItemWrapper>
        )}

        {/* 訂單內容 */}
        <ContentWrapper>
          <OrderContent>訂單內容</OrderContent>
          <DetailWrapper>
            <Detail>
              <DetailItem>
                <span>
                  {orderInfoPurchasedList?.[0]?.text || '鏡週刊紙本雜誌 52 期'}
                </span>
                <span>
                  共
                  <span className="number">
                    {orderInfoPurchasedList?.[0]?.count || 1}
                  </span>
                  份
                </span>
              </DetailItem>
              <Price>NT$ {addCommas(orderInfoPurchasedList?.[0]?.price)}</Price>
            </Detail>

            <Detail>
              <Item>運費</Item>
              <Price>NT$ {addCommas(orderInfoPurchasedList?.[1]?.price)}</Price>
            </Detail>

            <Hr />

            <Detail style={{ marginTop: '0' }}>
              <Item>付款金額</Item>
              <Price>NT$ {addCommas(orderInfoPurchasedList?.[3]?.price)}</Price>
            </Detail>
          </DetailWrapper>
        </ContentWrapper>

        {/* 顧客資訊 */}
        <Title>顧客資訊</Title>
        <CustomerTitle style={{ marginTop: '16px' }}>訂購人</CustomerTitle>
        <CustomerItem style={{ marginTop: '12px' }}>
          <p className="name">姓名</p>
          <p className="value">{purchaseName}</p>
        </CustomerItem>
        <CustomerItem>
          <p className="name">電子信箱</p>
          <p className="value">{purchaseEmail}</p>
        </CustomerItem>
        <CustomerItem>
          <p className="name">聯絡電話</p>
          <p className="value">{purchaseMobile}</p>
        </CustomerItem>

        <CustomerTitle>收件人</CustomerTitle>
        <CustomerItem style={{ marginTop: '12px' }}>
          <p className="name">姓名</p>
          <p className="value">{receiveName}</p>
        </CustomerItem>
        <CustomerItem>
          <p className="name">聯絡電話</p>
          <p className="value">{receiveMobile}</p>
        </CustomerItem>
        <CustomerItem>
          <p className="name">通訊地址</p>
          <p className="value">{receiveAddress}</p>
        </CustomerItem>
        <CustomerItem>
          <p className="name">派送備註</p>
          <p className="value">無</p>
        </CustomerItem>
      </GrayBox>

      {/* 注意事項 */}
      <Notice />
    </>
  )
}
