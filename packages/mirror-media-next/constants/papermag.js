const PLAN = /** @type {const}*/ ({
  ONE_YEAR: 1,
  TWO_YEAR: 2,
})

/**
 * @typedef {PLAN[keyof typeof PLAN]} PlanEnum
 */
/**
 * @typedef Discount
 * @property {string} year
 * @property {string} issue
 */

/** @type {Discount} */
const ONE_YEAR_DISCOUNT = {
  year: '一',
  issue: '5',
}

/** @type {Discount} */
const TWO_YEAR_DISCOUNT = {
  year: '二',
  issue: '10',
}

/**
 * @typedef RenewalDiscount
 * @property {string} issue
 */
/** @type {RenewalDiscount} */
const ONE_YEAR_RENEWAL_DISCOUNT = {
  issue: '1',
}

/** @type {RenewalDiscount} */
const TWO_YEAR_RENEWAL_DISCOUNT = {
  issue: '2',
}

const SHIPPING_FEE_PER_YEAR = 1040
const PLAN_LIST = /** @type {const} */ ([
  {
    id: PLAN.ONE_YEAR,
    code: 'magazine_one_year',
    title: '一年鏡週刊 52 期',
    name: '一年鏡週刊 52 期',
    issue: 52,
    basePrice: 5148,
    price: 2880,
    hasShippingFee: false,
    shippingFee: 0,
    discount: ONE_YEAR_DISCOUNT,
    renewalDiscount: ONE_YEAR_RENEWAL_DISCOUNT,
  },
  {
    id: PLAN.ONE_YEAR,
    code: 'magazine_one_year_with_shipping_fee',
    title: '一年鏡週刊 52 期加掛號運費',
    name: '一年鏡週刊 52 期',
    issue: 52,
    basePrice: 5148,
    price: 2880,
    hasShippingFee: true,
    shippingFee: SHIPPING_FEE_PER_YEAR,
    discount: ONE_YEAR_DISCOUNT,
    renewalDiscount: ONE_YEAR_RENEWAL_DISCOUNT,
  },
  {
    id: PLAN.TWO_YEAR,
    code: 'magazine_two_year',
    title: '兩年鏡週刊 104 期',
    name: '兩年鏡週刊 104 期',
    issue: 104,
    basePrice: 10296,
    price: 5280,
    hasShippingFee: false,
    shippingFee: 0,
    discount: TWO_YEAR_DISCOUNT,
    renewalDiscount: TWO_YEAR_RENEWAL_DISCOUNT,
  },
  {
    id: PLAN.TWO_YEAR,
    code: 'magazine_two_year_with_shipping_fee',
    title: '兩年鏡週刊 104 期加掛號運費',
    name: '兩年鏡週刊 104 期',
    issue: 104,
    basePrice: 10296,
    price: 5280,
    hasShippingFee: true,
    shippingFee: SHIPPING_FEE_PER_YEAR * 2,
    discount: TWO_YEAR_DISCOUNT,
    renewalDiscount: TWO_YEAR_RENEWAL_DISCOUNT,
  },
])

const COUPON_DISCOUNT = 80

const RECEIPT_OPTION = /** @type {const} */ ({
  DONATE: 'donate',
  WITH_CARRIER: 'invoiceWithCarrier',
  TRIPPLE: 'tripleInvoice',
})

/** @typedef {RECEIPT_OPTION[keyof typeof RECEIPT_OPTION]} ReceiptOptionEnum */

export { PLAN, PLAN_LIST, COUPON_DISCOUNT, RECEIPT_OPTION }
