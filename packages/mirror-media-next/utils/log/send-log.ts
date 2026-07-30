import { getClientSideOnlyError, isServer } from '../index'

const sendLog = (log: unknown, target = '/api/tracking'): void => {
  if (isServer()) getClientSideOnlyError('sendLog')

  const blob = new Blob([JSON.stringify(log)], {
    type: 'application/json; charset=UTF-8',
  })
  navigator.sendBeacon(target, blob)
}

const sendErrorLog = (log: unknown): void => sendLog(log, '/api/error-report')

const sendUserBehaviorLog = (log: unknown): void =>
  sendLog(log, '/api/tracking')

export { sendErrorLog, sendLog, sendUserBehaviorLog }
