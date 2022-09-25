const SITE_TITLE = '鏡週刊 Mirror Media'

const READR_URL = 'https://www.readr.tw'

const LINE_LINK = {
  name: 'line',
  href: 'https://line.me/R/ti/p/%40cuk1273e',
}
const WEIBO_LINK = {
  name: 'weibo',
  href: 'http://www.weibo.com/u/6030041924?is_all=1',
}
const FACEBOOK_LINK = {
  name: 'facebook',
  href: 'https://www.facebook.com/mirrormediamg/',
}
const INSTAGRAM_LINK = {
  name: 'instagram',
  href: 'https://www.instagram.com/mirror_media/',
}
const RSS_LINK = {
  name: 'rss',
  href: 'https://www.mirrormedia.mg/rss/rss.xml',
}
const EMAIL_LINK = {
  name: 'email',
  href: 'mailto:mirror885@mirrormedia.mg',
}
const SOCIAL_MEDIA_LINKS = [
  LINE_LINK,
  WEIBO_LINK,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  RSS_LINK,
  EMAIL_LINK,
]

const MAGAZINE_LINK = {
  name: 'magazine',
  title: '訂閱電子雜誌',
  href: 'https://mybook.taiwanmobile.com/contentGroup/MIR0100100001',
}
const AUTH_LINK = {
  name: 'auth',
  title: '內容授權',
  href: 'https://www.mirrormedia.mg/story/webauthorize/',
}
const AD_LINK = {
  name: 'ad',
  title: '廣告合作',
  href: 'https://www.mirrormedia.mg/story/ad1018001/index.html',
}
const CAMPAIGN_LINK = {
  name: 'campaign',
  title: '活動專區',
  href: 'https://www.mirrormedia.mg/category/campaign',
}
const WEBAUTHORIZE_LINK = {
  name: 'webauthorize',
  title: '內容授權',
  href: '/story/webauthorize/',
}
const DOWNLOAD_APP_LINK = {
  name: 'download',
  title: '下載APP',
  href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
}
const MEDIA_DISCIPLINE_LINK = {
  name: 'discipline',
  title: '新聞自律綱要',
  href: 'https://www.mirrormedia.mg/story/20200710edi030/',
}
const PROMOTION_LINKS = [
  MAGAZINE_LINK,
  AUTH_LINK,
  AD_LINK,
  CAMPAIGN_LINK,
  WEBAUTHORIZE_LINK,
  DOWNLOAD_APP_LINK,
  MEDIA_DISCIPLINE_LINK,
]

const MIRRORVOICE_LINK = {
  name: 'mirrorvoice',
  title: '鏡好聽',
  href: 'https://voice.mirrorfiction.com/',
}
const MIRRORFICTION_LINK = {
  name: 'mirrorfiction',
  title: '鏡文學',
  href: 'https://www.mirrorfiction.com/',
}
const READR_LINK = {
  name: 'readr',
  title: 'READr 讀+',
  href: READR_URL,
}
const SUB_BRAND_LINKS = [MIRRORVOICE_LINK, MIRRORFICTION_LINK, READR_LINK]

export { SITE_TITLE, SOCIAL_MEDIA_LINKS, PROMOTION_LINKS, SUB_BRAND_LINKS }
