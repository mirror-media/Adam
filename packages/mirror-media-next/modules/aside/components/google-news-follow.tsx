import Image from 'next/image'

import { Link } from '@/components/ui/link'
import gnewsGif from '@/public/images-next/gnews-gif.gif'

export function GoogleNewsFollow() {
  return (
    <Link
      className="hidden xl:block"
      href="https://google.com/preferences/source?q=mirrormedia.mg"
      target="_blank"
      rel="noreferrer noopener"
    >
      <Image src={gnewsGif} alt="Google News GIF" className="h-auto w-full" />
    </Link>
  )
}
