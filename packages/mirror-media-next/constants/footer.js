import IconLine from '../public/images-next/footer-line.svg'
import IconWeibo from '../public/images-next/footer-weibo.svg'
import IconFacebook from '../public/images-next/footer-facebook.svg'
import IconInstagram from '../public/images-next/footer-instagram.svg'
import IconEmail from '../public/images-next/footer-email.svg'
import IconRss from '../public/images-next/footer-rss.svg'
import {
  LINE_LINK,
  WEIBO_LINK,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  RSS_LINK,
  EMAIL_LINK,
} from './index'

const FOOTER_SOCIAL_MEDIA_LISTS = [
  {
    name: LINE_LINK.name,
    href: LINE_LINK.href,
    svgIcon: IconLine,
  },
  {
    name: WEIBO_LINK.name,
    href: WEIBO_LINK.href,
    svgIcon: IconWeibo,
  },
  {
    name: FACEBOOK_LINK.name,
    href: FACEBOOK_LINK.href,
    svgIcon: IconFacebook,
  },
  {
    name: INSTAGRAM_LINK.name,
    href: INSTAGRAM_LINK.href,
    svgIcon: IconInstagram,
  },
  {
    name: RSS_LINK.name,
    href: RSS_LINK.href,
    svgIcon: IconRss,
  },
  {
    name: EMAIL_LINK.name,
    href: EMAIL_LINK.href,
    svgIcon: IconEmail,
  },
]

const CUSTOMER_SERVICE_MAIL = {
  name: 'customer-service-email',
  title: '客服信箱',
  description: 'MM-onlineservice@mirrormedia.mg',
}

const CUSTOMER_SERVICE_PHONE = {
  name: 'customer-service-phone',
  title: '客服電話',
  description: '02-6633-3966',
}

const CUSTOMER_SERVICE_HOUR = {
  name: 'customer-service-hour',
  title: '服務時間',
  description: '週一至週五上午10時至下午6時',
}

const CUSTOMER_SERVICE_INFOS = [
  CUSTOMER_SERVICE_MAIL,
  CUSTOMER_SERVICE_PHONE,
  CUSTOMER_SERVICE_HOUR,
]

export { FOOTER_SOCIAL_MEDIA_LISTS, CUSTOMER_SERVICE_INFOS }
