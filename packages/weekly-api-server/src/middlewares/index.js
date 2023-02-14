import { createLoggerMw } from './logger'
import { queryMemberInfo } from './member-info'
import {
  verifyAccessToken,
  verifyIdTokenByFirebaseAdmin,
  signAccessToken,
} from './auth'

const mws = {
  createLoggerMw,
  queryMemberInfo,
  verifyAccessToken,
  verifyIdTokenByFirebaseAdmin,
  signAccessToken,
}

export default mws
