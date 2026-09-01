declare module 'cors' {
  import type { IncomingMessage, ServerResponse } from 'http'

  type CorsMiddleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: unknown) => void
  ) => void

  type CorsOptions = {
    methods?: string | string[]
  }

  function Cors(options?: CorsOptions): CorsMiddleware

  export = Cors
}

declare module 'request-ip' {
  import type { IncomingMessage } from 'http'

  export function getClientIp(req: IncomingMessage): string | null
}

declare module '@mirrormedia/newebpay-node' {
  export default class NewebPay {
    constructor(key: string, iv: string)
    getEncryptedFormPostData(data: unknown): Promise<unknown>
  }
}

declare module '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia' {
  import type { Draft } from '@/type/draft-js'

  const MirrorMedia: {
    hasContentInRawContentBlock: (content?: Draft | null) => boolean
  }

  export default MirrorMedia
}

// The package ships its own `lib/types/index.d.ts`, but its package.json
// declares "exports" without a matching "types" condition, so TS can't
// resolve them under `moduleResolution: "Bundler"`. Shimmed from that
// declaration file / README until the package fixes its "exports" map.
declare module '@readr-media/react-image' {
  import type { ImgHTMLAttributes } from 'react'

  export type Rwd = {
    mobile?: string
    tablet?: string
    laptop?: string
    desktop?: string
    default?: string
  }

  export type Breakpoint = {
    mobile?: string
    tablet?: string
    laptop?: string
    desktop?: string
  }

  // Keyed by resolution label, e.g. { w400: '400.png', w800: '800.png', original: 'original.png' }
  type ImageSet = Record<string, string>

  export type ImageProps = {
    // Optional despite the package's own (inaccurate) types marking it
    // required — the component destructures `images = { ... }` at runtime,
    // so an undefined heroImage falls back to `defaultImage` fine.
    images?: ImageSet | null
    imagesWebP?: ImageSet | null
    loadingImage?: string
    defaultImage?: string
    alt?: string
    objectFit?:
      | 'fill'
      | 'contain'
      | 'cover'
      | 'scale-down'
      | 'none'
      | 'initial'
      | 'inherit'
    width?: string | number
    height?: string | number
    priority?: boolean
    debugMode?: boolean
    breakpoint?: Breakpoint
    rwd?: Rwd
    intersectionObserverOptions?: IntersectionObserverInit
    fetchPriority?: string
    loading?: 'lazy' | 'eager'
    className?: string
    imageProps?: ImgHTMLAttributes<HTMLImageElement>
  }

  export default function Image(props: ImageProps): JSX.Element
}
