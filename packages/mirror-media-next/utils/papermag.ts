import type { PlanEnum } from '../constants/papermag'
import { PLAN_LIST } from '../constants/papermag'

type OrderValues = {
  username: string
  cellphone: string
  address: string
  email: string
}

type RecipientValues = {
  username: string
  cellphone: string
  address: string
}

type PlanInfo = (typeof PLAN_LIST)[number]

function getMerchandiseAndShippingFeeInfo(
  merchandiseCode: string
): PlanInfo | undefined {
  const plan = PLAN_LIST.find((plan) => plan.code === merchandiseCode)
  return plan
}

function checkOrdererValues(orderItem: OrderValues): boolean {
  return !(
    orderItem.username === '' ||
    orderItem.cellphone === '' ||
    orderItem.address === '' ||
    orderItem.email === ''
  )
}

function checkRecipientValues(recipientItem: RecipientValues): boolean {
  return !(
    recipientItem.username === '' ||
    recipientItem.cellphone === '' ||
    recipientItem.address === ''
  )
}

function getPlanInfoByIdAndShouldFreight(
  id: PlanEnum,
  shouldCountFreight: boolean
): PlanInfo | undefined {
  return PLAN_LIST.find(
    (plan) => plan.id === id && plan.hasShippingFee === shouldCountFreight
  )
}

export {
  checkOrdererValues,
  checkRecipientValues,
  getMerchandiseAndShippingFeeInfo,
  getPlanInfoByIdAndShouldFreight,
}
