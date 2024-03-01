const shippingFeePerYear = 1040
const PLAN_LIST = [
  {
    code: 'magazine_one_year',
    title: '一年鏡週刊 52 期',
    name: '一年鏡週刊 52 期',
    hasShippingFee: false,
    shippingFee: 0,
  },
  {
    code: 'magazine_one_year_with_shipping_fee',
    title: '一年鏡週刊 52 期加掛號運費',
    name: '一年鏡週刊 52 期',
    hasShippingFee: true,
    shippingFee: shippingFeePerYear,
  },
  {
    code: 'magazine_two_year',
    title: '兩年鏡週刊 104 期',
    name: '兩年鏡週刊 104 期',
    hasShippingFee: false,
    shippingFee: 0,
  },
  {
    code: 'magazine_two_year_with_shipping_fee',
    title: '兩年鏡週刊 104 期加掛號運費',
    name: '兩年鏡週刊 104 期',
    hasShippingFee: true,
    shippingFee: shippingFeePerYear * 2,
  },
]

function getMerchandiseAndShippingFeeInfo(merchandiseCode) {
  const plan = PLAN_LIST.find((plan) => plan.code === merchandiseCode)
  return plan
}

function checkOrdererValues(orderItem) {
  return !(
    orderItem.username === '' ||
    orderItem.cellphone === '' ||
    orderItem.address === '' ||
    orderItem.email === ''
  )
}

function checkRecipientValues(recipientItem) {
  return !(
    recipientItem.username === '' ||
    recipientItem.cellphone === '' ||
    recipientItem.address === ''
  )
}

export {
  getMerchandiseAndShippingFeeInfo,
  checkOrdererValues,
  checkRecipientValues,
}
