import Image from 'next/image'

import { cn } from '@/components/cn'
import { Link } from '@/components/ui/link'

const GOOGLE_NEWS_PUBLICATION_URL =
  'https://news.google.com/publications/CAAqKQgKIiNDQklTRkFnTWFoQUtEbTFwY25KdmNtMWxaR2xoTG0xbktBQVAB'

type GoogleNewsFollowProps = {
  className?: string
}

function GoogleNewsFollow({ className }: GoogleNewsFollowProps) {
  return (
    <Link
      aria-label="在 Google News 將鏡週刊設為偏好來源"
      className={cn(
        'block w-[300px] shrink-0 rounded-mm-xs hover:no-underline',
        className
      )}
      href={GOOGLE_NEWS_PUBLICATION_URL}
      rel="noopener noreferrer"
      target="_blank"
      variant="plain"
    >
      <Image
        alt=""
        className="h-auto w-full"
        height={200}
        src="/images-next/gnews-gif.gif"
        unoptimized
        width={640}
      />
    </Link>
  )
}

export { GoogleNewsFollow }
