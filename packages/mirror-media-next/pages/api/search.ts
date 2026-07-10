import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getSearchResult } from '../../utils/api/search'

const transformFunc = (val: string | undefined): number | undefined => {
  if (typeof val === 'string') {
    return Number(val)
  } else {
    return val
  }
}

const querySchema = z.object({
  query: z.string().min(1),
  skip: z.string().optional().transform(transformFunc),
  take: z.string().optional().transform(transformFunc),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(400).json({
      success: false,
      data: 'invalid request method',
    })
  }

  const query = req.query
  const { success: parsedSuccess, data: parsedQuery } =
    querySchema.safeParse(query)
  if (!parsedSuccess) {
    return res.status(400).json({
      success: parsedSuccess,
      data: 'invalid request query',
    })
  }

  const { success, code, data } = await getSearchResult(parsedQuery)

  return res.status(code).json({
    success,
    data,
  })
}
