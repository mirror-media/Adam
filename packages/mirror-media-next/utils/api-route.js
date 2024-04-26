/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 * @param {ReturnType<import('cors')>} corsFn
 */
function runMiddleware(req, res, corsFn) {
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
