import consts from './constants'
import cors from 'cors'
// @ts-ignore `@twreporter/errors` does not have tyepscript definition file yet
import errors from '@twreporter/errors'
import express from 'express'
import middlewareCreator from './middlewares'
import { createProxyMiddleware } from 'http-proxy-middleware'

const statusCodes = consts.statusCodes

/**
 *  This function creates a mini app.
 *  This mini app aims to handle requests' authorization and
 *  proxies requests to backed GraphQL API origin server.
 *
 *  @param {Object} opts
 *  @param {string} opts.gcpProjectId
 *  @param {string} opts.jwtSecret
 *  @param {string} opts.proxyOrigin
 *  @param {'/content/graphql'|'/member/graphql'} opts.proxyPath
 *  @param {string[]} [opts.corsAllowOrigin=[]]
 *  @return {express.Router}
 */
export function createGraphQLProxy({
  gcpProjectId,
  jwtSecret,
  proxyOrigin,
  proxyPath,
  corsAllowOrigin = [],
}) {
  // create express mini app
  const router = express.Router()

  const corsOpts = {
    origin: corsAllowOrigin,
  }

  // enable cors pre-flight request
  router.options(
    proxyPath,
    middlewareCreator.createLoggerMw(gcpProjectId),
    cors(corsOpts)
  )

  const verifyAccessToken = middlewareCreator.verifyAccessToken({
    jwtSecret,
  })

  router.post(
    proxyPath,
    // log request
    middlewareCreator.createLoggerMw(gcpProjectId),

    // handle cors request
    cors(corsOpts),

    // verify access token if needed
    /** @type {express.RequestHandler} */
    (req, res, next) => {
      // if request contains `Authorization` header, and then we verify it.
      if (req.header('Authorization')) {
        verifyAccessToken(req, res, next)
        return
      }

      // Otherwise, we skip authorization.
      // get to next middleware
      next()
    },


    // proxy request to API GraphQL endpoint
    createProxyMiddleware({
      target: proxyOrigin,
      changeOrigin: true,
      pathRewrite: {
        [proxyPath]: '/api/graphql',
      },
      // add `X-Access-Token-Scope` custom header.
      // The api servers use this custom header to implement access control mechanism.
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          JSON.stringify({
            severity: 'DEBUG',
            message: 'proxy to backed API origin server: ' + proxyOrigin + proxyReq.path,
            ...res?.locals?.globalLogFields,
          })
        )
        // @ts-ignore `res.locals` is not defined in 'http-proxy-middleware' pkg,
        // but it does exist in 'express' res object.
        const scope = res?.locals?.auth?.decodedAccessToken?.scope || ''
        proxyReq.setHeader('X-Access-Token-Scope', scope)
      },
      onError: (err, req, res, target) => { // eslint-disable-line
        const annotatingError = errors.helpers.wrap(
          err,
          'ProxyError',
          `Error occurs while proxying request to API origin server: ${proxyOrigin}` +
            err.message
        )

        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(annotatingError, {
              withStack: true,
              withPayload: true,
            }),
            ...res?.locals?.globalLogFields,
          })
        )

        res.status(statusCodes.internalServerError).send({
          status: 'error',
          error: annotatingError.message,
        })
      },
    })
  )

  router.use(
    /**
     * Mini app level error handler
     * @type {express.ErrorRequestHandler}
     */
    (err, req, res, next) => {
      switch (err.name) {
        case 'AuthError': {
          console.log(
            JSON.stringify({
              severity: 'NOTICE',
              message: 'Authorization token is invalid.' + err.message,
              ...res.locals.globalLogFields,
            })
          )
          res.status(statusCodes.unauthorized).send({
            status: 'fail',
            data: err.message + ' Authorization token is invalid.',
          })
          return
        }
        default: {
          // Let application level error handle to deal with the error
          next(err)
          return
        }
      }
    }
  )

  return router
}
