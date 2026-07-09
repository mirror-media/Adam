const PaymentMethod = {
  NewebPay: 'newebpay',
  LINEPay: 'line_pay',
  GooglePay: 'google_play',
  AppStore: 'app_store',
} as const

const MemberType = {
  YearlyDisturbed: 'subscribe_yearly_disturb',
  MonthlyDisturbed: 'subscribe_monthly_disturb',
  Disturbed: 'disturb',
  MonthlyToYearly: 'subscribe_monthly_update_to_yearly',
  YearlyToMonthly: 'subscribe_yearly_update_to_monthly',
  Yearly: 'subscribe_yearly',
  Monthly: 'subscribe_monthly',
  OneTime: 'subscribe_one_time',
  Marketing: 'marketing',
  None: 'none',
} as const

const Frequency = {
  Marketing: 'marketing',
  Monthly: 'monthly',
  OneTime: 'one_time',
  OneTimeHyphen: 'one-time',
  Yearly: 'yearly',
} as const

type PaymentMethodValue = (typeof PaymentMethod)[keyof typeof PaymentMethod]
type MemberTypeValue = (typeof MemberType)[keyof typeof MemberType]
type FrequencyValue = (typeof Frequency)[keyof typeof Frequency]

export { Frequency, MemberType, PaymentMethod }
export type { FrequencyValue, MemberTypeValue, PaymentMethodValue }
