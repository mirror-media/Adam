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

/**
 * The package ships types at `lib/types/index.d.ts`, but its `exports` map does
 * not point at them, so TypeScript cannot resolve them. Only the props the app
 * passes are declared here.
 */
declare module '@readr-media/react-image' {
  import type { ComponentType } from 'react'

  type Rwd = {
    mobile?: string
    tablet?: string
    laptop?: string
    desktop?: string
    default?: string
  }

  type ImageProps = {
    alt?: string
    defaultImage?: string
    images?: unknown
    imagesWebP?: unknown
    loadingImage?: string
    priority?: boolean
    rwd?: Rwd
  }

  const Image: ComponentType<ImageProps>

  export default Image
}

declare module '@mirrormedia/newebpay-node' {
  export default class NewebPay {
    constructor(key: string, iv: string)
    getEncryptedFormPostData(data: unknown): Promise<unknown>
  }
}
