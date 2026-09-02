import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@base-ui/react'
import axios from 'axios'

import type { PopularNewsApiPost } from '@/apollo/fragments/post'
import { cn } from '@/components/cn'
import { PopularNewsItem } from '@/components/shell/idle-timeout-modal/popular-news-item'
import { Typography } from '@/components/ui'
import { API_TIMEOUT, URL_STATIC_POPULAR_NEWS } from '@/config/index.mjs'
import { IDLE_MODAL_LINK } from '@/constants'
import { CUSTOMER_SERVICE_INFOS } from '@/constants/footer'
import { useIdleTimeout } from '@/hooks/use-idle-timeout'
import useClickOutside from '@/hooks/useClickOutside'

const IDLE_TIMEOUT = 60 * 2 * 1000 // 2 minutes in milliseconds

/**
 * IdleTimeoutModal Component
 * This modal appears after the user has been idle for a specified amount of time.
 */
function IdleTimeoutModal() {
  const [isIdle, setIsIdle] = useIdleTimeout(IDLE_TIMEOUT)
  const [popularNews, setPopularNews] = useState<PopularNewsApiPost[]>([])
  const modalRef = useRef<HTMLDivElement>(null)
  useClickOutside(modalRef, () => {
    handleClose()
  })

  useEffect(() => {
    if (popularNews.length) return
    axios({
      method: 'get',
      url: URL_STATIC_POPULAR_NEWS,
      timeout: API_TIMEOUT,
    })
      .then((res) => {
        if (res && res.data) {
          const data: PopularNewsApiPost[] = res.data.slice(0, 6)
          setPopularNews(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching popular news:', error)
      })
  }, [popularNews.length])

  const handleClose = () => {
    setIsIdle(false)
  }

  if (!isIdle) return null

  return (
    <Dialog.Root open={isIdle} onOpenChange={setIsIdle}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed top-0 left-0 z-(--mm-z-shell-top) h-screen w-screen bg-black/50" />
        <Dialog.Viewport className="fixed top-1/2 left-1/2 z-(--mm-z-shell-top) w-full -translate-x-1/2 -translate-y-1/2">
          <Dialog.Popup>
            <div className="mx-auto w-full max-w-90 bg-white px-4 py-6 xl:max-w-200 xl:px-21.5 xl:pt-13">
              <div className="relative">
                <div className="flex flex-col gap-y-3 pb-3 xl:flex-row xl:justify-between xl:pb-0">
                  <Image
                    src="/images-next/mirror-media-logo.svg"
                    alt="mirrormedia"
                    width={107}
                    height={45}
                    loading="lazy"
                  />

                  <div className="font-mm-sans text-mm-h5 text-mm-base-400 xl:self-end">
                    您已閒置2分鐘，請點擊關閉按鈕或空白處，即可回到鏡週刊網站
                  </div>
                </div>
                <Image
                  src="/images-next/close-modal.svg"
                  alt="mirrormedia"
                  width={32}
                  height={32}
                  loading="eager"
                  className="absolute -top-5 -right-3 cursor-pointer xl:-top-7 xl:-right-15.5"
                  onClick={handleClose}
                />

                <PopularNewsItem items={popularNews} />

                <hr className="border-4 border-mm-base-400" />
              </div>
              <div className="space-y-3.5 pt-3">
                <ul className="grid grid-cols-2 gap-x-7 gap-y-3 xl:flex xl:flex-wrap xl:gap-x-4">
                  {IDLE_MODAL_LINK.map((link, index) => {
                    return (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="grow-1"
                      >
                        <Typography variant="h6" className="text-mm-base-500">
                          {link.title}
                        </Typography>
                      </a>
                    )
                  })}
                </ul>

                <div className="xl:flex xl:gap-x-2">
                  {CUSTOMER_SERVICE_INFOS.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={cn({
                          inline: item.name !== 'customer-service-email',
                          'ml-3 xl:ml-0': item.name === 'customer-service-hour',
                        })}
                      >
                        <Typography
                          as="span"
                          variant="caption-s"
                          className="text-xs text-mm-base-700"
                        >
                          {item.title} {item.description}
                        </Typography>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { IdleTimeoutModal }
