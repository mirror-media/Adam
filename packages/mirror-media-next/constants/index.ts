const SITE_TITLE = '鏡週刊 Mirror Media'
const SITE_DESCRIPTION =
  '鏡傳媒以台灣為基地，是一跨平台綜合媒體，包含《鏡週刊》以及下設五大分眾內容的《鏡傳媒》網站，刊載時事、財經、人物、國際、文化、娛樂、美食旅遊、精品鐘錶等深入報導及影音內容。我們以「鏡」為名，務求反映事實、時代與人性。'
const MESH_URL = 'https://www.mmesh.news/'

const LINE_LINK = {
  name: 'line',
  href: 'https://line.me/R/ti/p/%40cuk1273e',
}
const WEIBO_LINK = {
  name: 'weibo',
  href: 'http://www.weibo.com/u/6030041924?is_all=1',
}
const FACEBOOK_LINK = {
  name: 'facebook-fanpage',
  href: 'https://www.facebook.com/mirrormediamg/',
}
const INSTAGRAM_LINK = {
  name: 'instagram',
  href: 'https://www.instagram.com/mirror_media/',
}
const RSS_LINK = {
  name: 'mirrormedia-rss',
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

const PAPER_MAGAZINE_LINK = {
  name: 'paper-magazine',
  title: '鏡週刊紙本雜誌',
  href: 'https://www.mirrormedia.mg/papermag',
}

const MAGAZINE_LINK = {
  name: 'magazine',
  title: '訂閱電子雜誌',
  href: 'https://www.momoshop.com.tw/category/DgrpCategory.jsp?d_code=4003200172&p_orderType=5',
}

const AUTH_LINK = {
  name: 'auth',
  title: '內容授權',
  href: 'https://www.mirrormedia.mg/story/webauthorize/',
}

const AD_LINK = {
  name: 'ad',
  title: '廣告合作',
  href: 'https://www.mirrormedia.mg/story/ad1018001/',
}

const AI_GUIDANCE_LINK = {
  name: 'ai-guidance',
  title: 'AI使用準則',
  href: 'https://www.mirrormedia.mg/story/ad1018001/',
}

const DOWNLOAD_APP_LINK = {
  name: 'download',
  title: 'APP下載',
  href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
}

const MEDIA_DISCIPLINE_LINK = {
  name: 'discipline',
  title: '新聞自律綱要',
  href: 'https://www.mirrormedia.mg/story/20200710edi030/',
}

const AI_GUIDANCE = {
  name: 'guidance',
  title: '《鏡週刊》AI使用準則',
  href: 'https://www.mirrormedia.mg/story/20240827edi068',
}

const PROMOTION_LINKS = [
  MAGAZINE_LINK,
  AUTH_LINK,
  AD_LINK,
  DOWNLOAD_APP_LINK,
  MEDIA_DISCIPLINE_LINK,
  AI_GUIDANCE,
]

const FOOTER_PROMOTION_LINKS = {
  PAPER_MAGAZINE_LINK,
  MAGAZINE_LINK,
  AUTH_LINK,
  AD_LINK,
  DOWNLOAD_APP_LINK,
  MEDIA_DISCIPLINE_LINK,
  AI_GUIDANCE,
}

const IDLE_MODAL_LINK = [
  PAPER_MAGAZINE_LINK,
  MAGAZINE_LINK,
  AUTH_LINK,
  MEDIA_DISCIPLINE_LINK,
  AI_GUIDANCE_LINK,
  DOWNLOAD_APP_LINK,
]

const MIRRORVOICE_LINK = {
  name: 'mirrorvoice',
  title: '鏡好聽',
  href: 'https://voice.mirrorfiction.com/',
  imageSize: {
    normal: {
      width: 74,
      height: 20,
    },
    colorless: {
      width: 74,
      height: 20,
    },
  },
}
const MIRRORFICTION_LINK = {
  name: 'mirrorfiction',
  title: '鏡文學',
  href: 'https://www.mirrorfiction.com/',
  imageSize: {
    normal: {
      width: 74,
      height: 20,
    },
    colorless: {
      width: 74,
      height: 20,
    },
  },
}
const MESH_LINK = {
  name: 'mesh',
  title: 'READr Mesh 讀選',
  href: MESH_URL,
  imageSize: {
    normal: {
      width: 49,
      height: 20,
    },
    colorless: {
      width: 74,
      height: 20,
    },
  },
}
const SUB_BRAND_LINKS = [MIRRORVOICE_LINK, MIRRORFICTION_LINK, MESH_LINK]

const SHARE_URL_FACEBOOK = 'https://www.facebook.com/share.php?u='
const SHARE_URL_LINE = 'https://social-plugins.line.me/lineit/share?url='

/**
 * Legacy stacking scale, used by the styled-components era components.
 *
 * The V4 shell and the shadcn primitives under components/ui keep their layers
 * as --mm-z-shell-* in styles/tailwind.css, slotted into this scale rather than
 * above it, and below `top` so global dialogs (IdleTimeoutModal) keep winning.
 */
const Z_INDEX = {
  top: 10000,
  coverHeader: 2000,
  articleRightArrow: 1500, // 用一般 story 和 external 頁的「點擊看第一則延伸閱讀文章的右箭 icon」，須低於廣告的 z-index
  header: 1000,
  promoteTopic: 500,
  coverContent: 100,
} as const

const SECTION_IDS = {
  member: '5fe15f1e123c831000ee54c2',
  news: '57e1e0e5ee85930e00cad4e9',
  entertainment: '57e1e11cee85930e00cad4ea',
  businessmoney: '596441d04bbe120f002a319a',
  people: '596441604bbe120f002a3197',
  international: '5964400d4bbe120f002a3191',
  foodtravel: '57dfe399ee85930e00cad4d6',
  mafalda: '5971aa8ce531830d00e32812',
  culture: '5964418a4bbe120f002a3198',
  carandwatch: '57dfe3b0ee85930e00cad4d7',
  life: 'lifeId',
}

const FB_APP_ID = '175313259598308'
const FB_PAGE_ID = '1855418728011324'

export {
  EMAIL_LINK,
  FACEBOOK_LINK,
  FB_APP_ID,
  FB_PAGE_ID,
  FOOTER_PROMOTION_LINKS,
  IDLE_MODAL_LINK,
  INSTAGRAM_LINK,
  LINE_LINK,
  MESH_LINK,
  PROMOTION_LINKS,
  RSS_LINK,
  SECTION_IDS,
  SHARE_URL_FACEBOOK,
  SHARE_URL_LINE,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SOCIAL_MEDIA_LINKS,
  SUB_BRAND_LINKS,
  WEIBO_LINK,
  Z_INDEX,
}
