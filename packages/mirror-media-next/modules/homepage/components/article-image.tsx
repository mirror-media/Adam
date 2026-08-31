import { useState } from 'react'
import Image from 'next/image'

import { cn } from '@/components/cn'

import { HOMEPAGE_DEFAULT_IMAGE_URL } from '../homepage-constants'

type ArticleImageProps = {
  alt: string
  className?: string
  priority?: boolean
  sizes: string
  src: string
}

function ArticleImage({
  alt,
  className,
  priority = false,
  sizes,
  src,
}: ArticleImageProps) {
  const resolvedSrc = src || HOMEPAGE_DEFAULT_IMAGE_URL
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imageSrc =
    failedSrc === resolvedSrc ? HOMEPAGE_DEFAULT_IMAGE_URL : resolvedSrc

  return (
    <Image
      alt={alt}
      className={cn('object-cover', className)}
      fill
      onError={() => setFailedSrc(resolvedSrc)}
      priority={priority}
      sizes={sizes}
      src={imageSrc}
    />
  )
}

export { ArticleImage }
