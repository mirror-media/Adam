const URL_MIRROR_MEDIA =
  process.env.URL_MIRROR_MEDIA || 'https://www.mirrormedia.mg'
const URL_STATIC_COMBO_SECTIONS =
  'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'

// The following variables are from environment variables

const ENV = process.env.ENV || 'local'
const API_PROTOCOL = process.env.API_PROTOCOL || 'http'
const API_PORT = process.env.API_PORT || '8080'
const API_HOST = process.env.API_HOST || 'no-api-host'

// The following variables are given values according to different `ENV`
let API_TIMEOUT = 5000

switch (ENV) {
  case 'prod':
    API_TIMEOUT = 1500
    break
  case 'staging':
    API_TIMEOUT = 1500
    break
  case 'dev':
    API_TIMEOUT = 5000
    break
  default:
    API_TIMEOUT = 5000
}

export {
  URL_MIRROR_MEDIA,
  URL_STATIC_COMBO_SECTIONS,
  API_TIMEOUT,
  API_PROTOCOL,
  API_HOST,
  API_PORT,
}
