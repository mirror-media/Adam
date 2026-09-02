import Image from 'next/image'

import { cn } from '@/components/cn'
import { Link } from '@/components/ui/link'

const GOOGLE_PREFERRED_SOURCE_URL =
  'https://www.google.com/preferences/source?q=mirrormedia.mg'

type GoogleNewsFollowProps = {
  className?: string
}

function GoogleNewsFollow({ className }: GoogleNewsFollowProps) {
  return (
    <Link
      aria-label="將鏡週刊設為 Google 搜尋的偏好來源"
      className={cn(
        // Desktop runs the card across the whole sidebar column; the narrower
        // sizes keep the artwork at its drawn width.
        'block w-[300px] shrink-0 rounded-mm-xs hover:no-underline xl:w-full',
        className
      )}
      href={GOOGLE_PREFERRED_SOURCE_URL}
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
