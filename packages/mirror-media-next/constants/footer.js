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

export { FOOTER_SOCIAL_MEDIA_LISTS }
