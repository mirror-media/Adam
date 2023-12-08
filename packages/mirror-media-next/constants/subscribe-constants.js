const PREMIUM_FEATURES = [
  '支持鏡週刊報導精神',
  '暢讀鏡週刊全站內容',
  '會員專區零廣告純淨閱覽',
  '專區好文不分頁流暢閱讀',
  '免費閱讀數位版動態雜誌',
  '月方案定價 $99 元，限時優惠 $49 元',
  '年方案定價 $1,188 元，限時優惠 $499 元',
]

const BASIC_FEATURES = [
  '支持鏡週刊報導精神',
  '好文解鎖 隨心所欲',
  '$5 元可享單篇好文 14 天無限瀏覽',
]

// const DISCOUNT_MESSAGE = '優惠年訂閱團體折扣，請洽會員專屬客服信箱：'

// const SERVICE_EMAIL = 'MM-onlineservice@mirrormedia.mg'

const NOTIFICATIONS = [
  {
    id: 0,
    text: '月方案計算天數為 30 日，年方案計算天數為 365 日。',
    style: 'normal',
  },
  {
    id: 1,
    text: '月訂閱方案經會員授權扣款購買即為完成服務，因此月費會員無法退費，但可取消繼續訂閱。',
    style: 'normal',
  },
  {
    id: 2,
    text: '訂閱購買的同時會開啓自動續費(扣款)，在訂閱到期時將依據原訂閱方案自動扣款，並延續訂閱。',
    style: 'warning',
  },
  {
    id: 3,
    text: '訂閱相關問題請 email 至會員專屬客服信箱<a href = "mailto: MM-onlineservice@mirrormedia.mg">MM-onlineservice@mirrormedia.mg</a>，我們會盡快為您協助處理。',
    style: 'normal',
  },
  {
    id: 4,
    text: '更多詳細內容，請至<a href = "/story/service-rule/">服務條款</a>。',
    style: 'normal',
  },
]

export { BASIC_FEATURES, PREMIUM_FEATURES, NOTIFICATIONS }
