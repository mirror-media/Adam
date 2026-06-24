import styled from 'styled-components'

import { COUPON_DISCOUNT } from '../../../constants/papermag'
import { getNumberWithCommas } from '../../../utils'
import { getPlanInfoByIdAndShouldFreight } from '../../../utils/papermag'

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
  &:not(:last-child) {
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

/**
 * @typedef Props
 * @property {number} count
 * @property {import('../../../constants/papermag').PlanEnum} plan
 * @property {boolean} renewCouponApplied
 * @property {boolean} shouldCountFreight
 *
 * @param {Props} props
 * @returns {React.ReactNode}
 */
export default function PurchaseInfo({
  count,
  plan,
  renewCouponApplied,
  shouldCountFreight,
}) {
  const { price, shippingFee, discount, renewalDiscount } =
    getPlanInfoByIdAndShouldFreight(plan, shouldCountFreight)

  const freight = shippingFee * count
  const itemPrice = price * count - shippingFee * count
  const renewDiscount = renewCouponApplied ? COUPON_DISCOUNT * count : 0
  const total = itemPrice + freight - renewDiscount

  return (
    <>
      <Wrapper>
        <Title>訂單資訊</Title>
        <ItemWrapper>
          <Item>商品總計</Item>
          <Price>NT$ {getNumberWithCommas(itemPrice)}</Price>
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
        <span>符合{discount.year}年方案優惠</span>
        <span>贈送 {discount.issue} 期</span>
      </DiscountMsg>
      {renewCouponApplied && (
        <DiscountMsg className="renew">
          <span>符合續訂優惠</span>
          <span>贈送 {renewalDiscount.issue} 期</span>
        </DiscountMsg>
      )}
    </>
  )
}
