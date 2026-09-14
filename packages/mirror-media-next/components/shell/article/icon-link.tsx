import Image, { ImageProps } from 'next/image'

import { Link, LinkProps } from '@/components/ui'

type SocialLinkWithChildren = Omit<LinkProps, 'children'> & {
  children: LinkProps['children']
}

type SocialLinkWithIcon = Omit<LinkProps, 'children'> &
  Pick<ImageProps, 'src' | 'alt' | 'loading'> & {
    width?: ImageProps['width']
    height?: ImageProps['height']
    children?: never
  }

type SocialProps = SocialLinkWithChildren | SocialLinkWithIcon

export function IconLink(props: SocialProps) {
  // `src` only exists on the icon variant's type, so `in` reliably
  // discriminates the union — a truthy check on `children` doesn't, since
  // `ReactNode` legitimately allows falsy values like `null`.
  if ('src' in props) {
    const { src, alt, loading, width = 28, height = 28, ...rest } = props
    return (
      <Link {...rest}>
        <Image
          width={width}
          height={height}
          src={src}
          alt={alt}
          loading={loading}
        />
      </Link>
    )
  }

  const { children, ...rest } = props
  return <Link {...rest}>{children}</Link>
}
