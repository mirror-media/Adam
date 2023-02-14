import consts from './constants'
import cors from 'cors'
// @ts-ignore `@twreporter/errors` does not have tyepscript definition file yet
import errors from '@twreporter/errors'
import express from 'express'
import middlewareCreator from './middlewares'
import { createGraphQLProxy } from './gql-proxy-mini-app'

const statusCodes = consts.statusCodes

/**
 *  This function creates an express application.
 *  This application aims to handle requests' authentication and authorization by
 *
 *  1. providing `/access_token` route, which will response access token
 *  if the request contains valid firebase ID token, and that firebase token
 *  refers to a valid member in our Israfel member system.
 *
 *  2. creating Weekly and Israfel mini apps. Each of the mini apps handles
 *  the requests authorization and proxy them to the backed API origin server.
 *
 *  @param {Object} opts
 *  @param {string} opts.gcpProjectId
 *  @param {string} opts.firebaseProjectId
 *  @param {string} opts.jwtSecret
 *  @param {string} opts.weeklyProxyOrigin
 *  @param {string} opts.israfelProxyOrigin
 *  @param {string[]} [opts.corsAllowOrigin=[]]
 *  @return {express.Application}
 */
export function createApp({
  gcpProjectId,
  firebaseProjectId,
  jwtSecret,
  weeklyProxyOrigin,
  israfelProxyOrigin,
  corsAllowOrigin = [],
}) {
  // create express app
  const app = express()

  const corsOpts = {
    origin: corsAllowOrigin,
  }

  // enable cors pre-flight request
  app.options(
    '/access-token',
    middlewareCreator.createLoggerMw(gcpProjectId),
    cors(corsOpts)
  )

  // api route for granting access token
  app.post(
    '/access-token',
    middlewareCreator.createLoggerMw(gcpProjectId), // log request
    cors(corsOpts), // handle cors request
    middlewareCreator.verifyIdTokenByFirebaseAdmin({ firebaseProjectId }), // check authentication
    middlewareCreator.queryMemberInfo({ apiUrl: israfelProxyOrigin + '/api/graphql' }), // query member access permission
    middlewareCreator.signAccessToken({ jwtSecret: jwtSecret }), // sign access token according to member permission
    /** @type {express.RequestHandler} */
    (req, res) => {
      const payload = res.locals.accessTokenPayload
      res.status(statusCodes.ok).send({
        status: 'success',
        data: payload,
      })
    },
    /**
     * Route level error handler
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
        case 'SignJWTError':
        case 'MemberInfoError': {
          console.log(
            JSON.stringify({
              severity: 'ERROR',
              message: errors.helpers.printAll(err, {
                withStack: true,
                withPayload: true,
              }),
              ...res.locals.globalLogFields,
            })
          )
          res.status(statusCodes.internalServerError).send({
            status: 'error',
            error: err.message,
          })
          return
        }
        default: {
          next(err)
          return
        }
      }
    }
  )

  // mini app: weekly GraphQL API
  app.use(
    createGraphQLProxy({
      gcpProjectId,
      jwtSecret,
      corsAllowOrigin,
      proxyOrigin: weeklyProxyOrigin,
      proxyPath: '/content/graphql',
    })
  )

  // mini app: isafel GraphQL API
  app.use(
    createGraphQLProxy({
      gcpProjectId,
      jwtSecret,
      corsAllowOrigin,
      proxyOrigin: israfelProxyOrigin,
      proxyPath: '/member/graphql',
    })
  )

  app.use(
    /**
     *  Application level error handler
     *  error handler
     *  @type {express.ErrorRequestHandler}
     */
    (err, req, res, next) => { // eslint-disable-line
      const annotatingError = errors.helpers.wrap(
        err,
        'UnknownError',
        'Express error handler catches an unknown error'
      )

      const entry = Object.assign(
        {
          severity: 'ERROR',
          // All exceptions that include a stack trace will be
          // integrated with Error Reporting.
          // See https://cloud.google.com/run/docs/error-reporting
          message: errors.helpers.printAll(annotatingError, {
            withStack: true,
            withPayload: true,
          }, 0, 0),
        },
        res.locals.globalLogFields
      )
      console.error(JSON.stringify(entry))
      res.status(statusCodes.internalServerError).send({
        status: 'error',
        error: annotatingError.error,
      })
    }
  )

  return app
}
