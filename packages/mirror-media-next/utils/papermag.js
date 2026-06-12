import { PLAN_LIST } from '../constants/papermag'

/** @typedef {import("../constants/papermag").PlanEnum} PlanEnum */

function getMerchandiseAndShippingFeeInfo(merchandiseCode) {
  const plan = PLAN_LIST.find((plan) => plan.code === merchandiseCode)
  return plan
}

/**
 * @typedef OrderValues
 * @property {string} username
 * @property {string} cellphone
 * @property {string} address
 * @property {string} email
 *
 * @param {OrderValues} orderItem
 * @returns {boolean}
 */
function checkOrdererValues(orderItem) {
  return !(
    orderItem.username === '' ||
    orderItem.cellphone === '' ||
    orderItem.address === '' ||
    orderItem.email === ''
  )
}

/**
 * @typedef RecipientValues
 * @property {string} username
 * @property {string} cellphone
 * @property {string} address
 *
 * @param {RecipientValues} recipientItem
 * @returns {boolean}
 */
function checkRecipientValues(recipientItem) {
  return !(
    recipientItem.username === '' ||
    recipientItem.cellphone === '' ||
    recipientItem.address === ''
  )
}

/**
 * @param {PlanEnum} id
 * @param {boolean} shouldCountFreight
 */
function getPlanInfoByIdAndShouldFreight(id, shouldCountFreight) {
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
