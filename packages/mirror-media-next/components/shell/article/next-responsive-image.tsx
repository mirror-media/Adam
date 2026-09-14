'use client'

import { useEffect, useState } from 'react'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image, { type ImageLoader, type ImageProps } from 'next/image'

interface NextResponsiveImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallback?: string | StaticImport | null
  errorImage?: string | StaticImport
  srcSet?: number[]
}

export const imageLoader: ImageLoader = ({ src, width }) => {
  return src.replace(/(-w\d+)/, `-w${width}`)
}

export default function NextResponsiveImage(props: NextResponsiveImageProps) {
  const {
    src,
    fallback,
    errorImage,
    style,
    alt,
    srcSet,
    className,
    ...restProps
  } = props

  const isLocalSource = src.startsWith('/') && !src.startsWith('//')

  // Try src (e.g. webp) first, then fall back to the original format, then
  // finally a guaranteed-good error image. Skip any stage that duplicates
  // the previous one (e.g. no distinct fallback was given).
  const candidates = [src, fallback, errorImage].reduce<
    (string | StaticImport)[]
  >((acc, candidate) => {
    if (!candidate || candidate === acc[acc.length - 1]) return acc
    acc.push(candidate)
    return acc
  }, [])

  const [errorCount, setErrorCount] = useState(0)
  const hasError = errorCount > 0
  const currentSrc = candidates[Math.min(errorCount, candidates.length - 1)]

  const handleError = () => {
    setErrorCount((count) => Math.min(count + 1, candidates.length - 1))
  }

  const sourceImageLoader = ({
    src,
    width,
  }: {
    src: string
    width: number[]
  }) => {
    if (src.includes('-w')) {
      return width
        .map(
          (w) => src.replace(/(-w\d+)(\.\w+)$/, '-w' + w + '$2') + ' ' + w + 'w'
        )
        .join(', ')
    }

    return width
      .map((w) => `${src.replace(/(\.\w+)$/, `-w${w}$1`)} ${w}w`)
      .join(', ')
  }

  useEffect(() => {
    setErrorCount(0)
  }, [src, fallback, errorImage])

  if (restProps?.width || restProps?.height) {
    return <Image loader={imageLoader} {...props} alt={alt} />
  }

  return (
    <picture
      style={{
        position: 'relative',
        display: 'block',
        ...style,
      }}
      className={className}
    >
      {!hasError && !isLocalSource && (
        <source
          type="image/webp"
          src={src}
          srcSet={
            srcSet &&
            sourceImageLoader({
              src,
              width: srcSet,
            })
          }
        />
      )}
      <Image
        alt={alt}
        src={currentSrc}
        loader={imageLoader}
        onError={handleError}
        style={{ objectFit: 'cover' }}
        {...restProps}
      />
    </picture>
  )
}
