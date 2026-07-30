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
