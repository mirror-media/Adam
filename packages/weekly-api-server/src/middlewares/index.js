import { createLoggerMw } from './logger'
import { queryMemberInfo } from './member-info'
import {
  verifyAccessToken,
  verifyIdTokenByFirebaseAdmin,
  signAccessToken,
  signAccessTokenForInternalColleague,
} from './auth'

const mws = {
  createLoggerMw,
  queryMemberInfo,
  verifyAccessToken,
  verifyIdTokenByFirebaseAdmin,
  signAccessToken,
  signAccessTokenForInternalColleague,
}

export default mws
