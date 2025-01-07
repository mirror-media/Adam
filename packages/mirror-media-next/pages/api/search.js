import { z } from 'zod'
import { getSearchResult } from '../../utils/api/search'

/**
 * @param {string | undefined} val
 * @returns {number | undefined}
 */
const transformFunc = (val) => {
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

/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
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
