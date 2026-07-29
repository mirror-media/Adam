import type { NextApiRequest, NextApiResponse } from 'next'

type MiddlewareCallback = (result?: unknown) => void

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  corsFn: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: MiddlewareCallback
  ) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    corsFn(req, res, async (result) => {
      if (result instanceof Error) {
        reject(result)
      } else {
        resolve(result)
      }
    })
  })
}

export { runMiddleware }
