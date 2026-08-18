import Image from 'next/image'
import NextLink from 'next/link'

import { cn } from '@/components/cn'
import {
  FACEBOOK_LINK,
  FOOTER_PROMOTION_LINKS,
  INSTAGRAM_LINK,
  LINE_LINK,
} from '@/constants'

const {
  AI_GUIDANCE,
  AUTH_LINK,
  DOWNLOAD_APP_LINK,
  MAGAZINE_LINK,
  MEDIA_DISCIPLINE_LINK,
  PAPER_MAGAZINE_LINK,
} = FOOTER_PROMOTION_LINKS

const promotionLinks = [
  PAPER_MAGAZINE_LINK,
  MAGAZINE_LINK,
  AUTH_LINK,
  MEDIA_DISCIPLINE_LINK,
  { ...AI_GUIDANCE, title: 'AI使用準則' },
  { ...DOWNLOAD_APP_LINK, title: 'APP下載' },
]

const socialLinks = [
  {
    alt: 'LINE',
    height: 20,
    href: LINE_LINK.href,
    src: '/images-next/sns-line.png',
    width: 20,
  },
  {
    alt: 'Facebook',
    height: 20,
    href: FACEBOOK_LINK.href,
    src: '/images-next/facebook_white.png',
    width: 20,
  },
  {
    alt: 'Instagram',
    height: 20,
    href: INSTAGRAM_LINK.href,
    src: '/images-next/sns-ig.png',
    width: 20,
  },
  {
    alt: 'YouTube',
    height: 20,
    href: 'https://www.youtube.com/channel/UCYkldEK001GxR884OZMFnRw?sub_confirmation=1',
    src: '/images-next/sns-yt.png',
    width: 27,
  },
]

const externalLinkClass =
  'rounded-mm-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-400'

function SiteFooter() {
  return (
    <footer
      className="bg-mm-base-700 px-mm-xl py-12 font-mm-sans text-mm-neutral-0"
      data-slot="site-footer"
    >
      <div className="mx-auto flex w-full max-w-266 flex-col items-center gap-7">
        <div className="flex w-full flex-col items-center justify-center gap-7 lg:flex-row lg:gap-mm-3xl">
          <nav
            aria-label="網站資訊"
            className="grid grid-cols-2 gap-x-7 gap-y-mm-l text-mm-h6 text-mm-base-100 md:flex md:flex-wrap md:justify-center md:gap-x-7"
          >
            {promotionLinks.map((link) => (
              <NextLink
                className={externalLinkClass}
                href={link.href}
                key={link.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.title}
              </NextLink>
            ))}
          </nav>

          <div className="flex items-center gap-9 lg:gap-mm-3xl">
            <NextLink
              aria-label="READr"
              className={externalLinkClass}
              href="https://www.readr.tw/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt=""
                className="h-5 w-[50px] object-contain"
                height={20}
                src="/images-next/readr-colorless.png"
                width={50}
              />
            </NextLink>
            <nav aria-label="社群媒體" className="flex items-center gap-mm-l">
              {socialLinks.map((link) => (
                <NextLink
                  aria-label={link.alt}
                  className={externalLinkClass}
                  href={link.href}
                  key={link.alt}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt=""
                    className={cn(
                      'h-5 object-contain',
                      link.alt === 'YouTube' ? 'w-[27px]' : 'w-5'
                    )}
                    height={link.height}
                    src={link.src}
                    width={link.width}
                  />
                </NextLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="text-center font-mm-body text-mm-caption-s">
          <p>
            本網頁使用{' '}
            <a
              className="text-mm-second-400 underline underline-offset-2"
              href="https://developers.google.com/youtube/terms/developer-policies?hl=zh-tw#definition-youtube-api-services"
              rel="noopener noreferrer"
              target="_blank"
            >
              YouTube API 服務
            </a>
            ，詳見{' '}
            <a
              className="text-mm-second-400 underline underline-offset-2"
              href="https://www.youtube.com/t/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              YouTube 服務條款
            </a>
            、{' '}
            <a
              className="text-mm-second-400 underline underline-offset-2"
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google 隱私權與條款
            </a>
          </p>
          <p>瀏覽此頁面即代表您同意上述授權條款及細則</p>
        </div>

        <address className="text-center font-mm-body text-mm-caption-s not-italic">
          <p>
            客服信箱{' '}
            <a
              className="underline underline-offset-2"
              href="mailto:MM-onlineservice@mirrormedia.mg"
            >
              MM-onlineservice@mirrormedia.mg
            </a>
          </p>
          <p>客服電話 02-6633-3966</p>
          <p>服務時間 週一至週五上午10時至下午6時</p>
        </address>
      </div>
    </footer>
  )
}

export { SiteFooter }
