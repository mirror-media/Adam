import styled from 'styled-components'
import { getNumberWithCommas } from '../../../utils'

const Wrapper = styled.div`
  border-radius: 12px;
  background: #f2f2f2;
  padding: 16px;
`

const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`
const Item = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  margin-right: 16px;

  &.renew {
    color: #054f77;
  }
`

const Price = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;

  &.renew {
    color: #054f77;
  }
`

const Hr = styled.hr`
  margin: 16px 0;
`
const DiscountMsg = styled.div`
  margin-top: 8px;
  border-radius: 12px;
  background: #f2f2f2;
  padding: 14px 16px;
  color: #054f77;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;

  &.renew {
    color: #e51731;
  }
`

export default function PurchaseInfo({
  count,
  plan,
  renewCouponApplied,
  shouldCountFreight,
}) {
  const freight = shouldCountFreight
    ? plan === 1
      ? 1040 * count
      : 2080 * count
    : 0
  const price = plan === 1 ? 2880 * count : 5280 * count
  const renewDiscount = renewCouponApplied ? 80 * count : 0
  const total = price + freight - renewDiscount

  return (
    <>
      <Wrapper>
        <Title>訂單資訊</Title>
        <ItemWrapper>
          <Item>商品總計</Item>
          <Price>NT$ {getNumberWithCommas(price)}</Price>
        </ItemWrapper>
        <ItemWrapper>
          <Item>運費</Item>
          <Price>NT$ {getNumberWithCommas(freight)}</Price>
        </ItemWrapper>

        {renewCouponApplied && (
          <ItemWrapper>
            <Item className="renew">續訂戶折扣</Item>
            <Price className="renew">
              -NT$ {getNumberWithCommas(renewDiscount)}
            </Price>
          </ItemWrapper>
        )}

        <Hr />
        <ItemWrapper>
          <Item>費用總計</Item>
          <Price>NT$ {getNumberWithCommas(total)}</Price>
        </ItemWrapper>
      </Wrapper>
      <DiscountMsg>
        <span>符合{plan === 1 ? '一' : '二'}年方案優惠</span>
        <span>贈送 {plan === 1 ? '5' : '10'} 期</span>
      </DiscountMsg>
      {renewCouponApplied && (
        <DiscountMsg className="renew">
          <span>符合續訂優惠</span>
          <span>贈送 {plan === 1 ? '1' : '2'} 期</span>
        </DiscountMsg>
      )}
    </>
  )
}
