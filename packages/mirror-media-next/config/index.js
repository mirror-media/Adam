const URL_MIRROR_MEDIA =
  process.env.URL_MIRROR_MEDIA || 'https://www.mirrormedia.mg'

// The following variables are from environment variables

const ENV = process.env.ENV || 'local'
const API_PROTOCOL = process.env.API_PROTOCOL || 'http'
const RESTFUL_API_HOST = process.env.RESTFUL_API_HOST || 'no-api-host'
const API_PORT = process.env.API_PORT || '8080'

// The following variables are given values according to different `ENV`
let API_TIMEOUT = 5000
let URL_STATIC_COMBO_SECTIONS = ''
let URL_STATIC_COMBO_TOPICS = ''

switch (ENV) {
  case 'prod':
    API_TIMEOUT = 1500
    URL_STATIC_COMBO_SECTIONS =
      'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`
  case 'staging':
    API_TIMEOUT = 1500
    URL_STATIC_COMBO_SECTIONS =
      'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`

    break
  case 'dev':
    API_TIMEOUT = 5000
    URL_STATIC_COMBO_SECTIONS =
      'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`

    break
  default:
    API_TIMEOUT = 5000
    URL_STATIC_COMBO_SECTIONS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/json/sections.json`
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/api/v2/combo?endpoint=topics`
}

export {
  URL_MIRROR_MEDIA,
  URL_STATIC_COMBO_SECTIONS,
  URL_STATIC_COMBO_TOPICS,
  API_TIMEOUT,
}
