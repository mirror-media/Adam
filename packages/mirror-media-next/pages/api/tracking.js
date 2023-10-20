import { Logging } from '@google-cloud/logging'

import {
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
  GCP_LOGGING_FEATURE_TOGGLE,
} from '../../config/index.mjs'
const loggingClient = new Logging({
  projectId: GCP_PROJECT_ID,
})

//mock query for testing gcp service account has set right permission to write log in gcp logging.
const MOCK_QUERY = {
  clientInfo: {
    browser: { name: 'Chrome', version: '118.0.0.0' },
    'is-in-app-browser': false,
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'client-os': { name: 'macOS', version: '10.15.7' },
    'curr-url': 'http://localhost:3000/',
    datetime: '2023.10.19 17:11:06',
    referrer: '',
    'target-text': '',
    'target-window-size': { width: 1905, height: 938 },
    'client-id': 'mock-client-id',
    'current-runtime-start': '2023.10.19 17:11:06',
    'session-id': 'mock-session-id',
    category: 'whole-site',
    description: '',
    'event-type': 'pageview',
    'page-type': 'index',
    'member-info-firebase': { userSignInInfo: {}, user: {} },
    'member-info-israfel': { basicInfo: {} },
  },
  ip: '127.0.0.1',
}

export default function handler(req, res) {
  try {
    res.send({ msg: 'Received in mm-next.' })
    const query = MOCK_QUERY
    const logName = req.query.logName || getDefaultLogName()
    const log = loggingClient.log(logName)
    const metadata = { resource: { type: 'global' } }
    // query.ip = req.clientIp

    /*
     * if (config.ENABLE_CLOUD_LOGGING === false) {
     *   console.log(`[LOG] API tracking`)
     *   console.log(query)
     *   return
     * }
     */
    if (GCP_LOGGING_FEATURE_TOGGLE === 'on') {
      const entry = log.entry(metadata, query)
      log.write(entry)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] Client info logging error occurred: ${error}.`)
  }
}

function getDefaultLogName() {
  return GCP_STACKDRIVER_LOG_NAME
}
