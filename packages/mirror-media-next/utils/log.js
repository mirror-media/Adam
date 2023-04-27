import { GCP_PROJECT_ID } from '../config/index.mjs'

/**
 *  Follow [Writing structured logs](https://cloud.google.com/run/docs/logging#writing_structured_logs)
 *  doc to do logging.
 *
 *  @param {import('http').IncomingMessage} req
 *  @param {string} [projectId]
 *  @return {Object}
 */
function getGlobalLogFields(req, projectId = GCP_PROJECT_ID) {
  const headers = req?.headers
  const traceHeader = headers?.['x-cloud-trace-context']
  const globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${projectId}/traces/${trace}`
  }

  return globalLogFields
}

export { getGlobalLogFields }
