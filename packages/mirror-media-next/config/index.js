const URL_MIRROR_MEDIA =
  process.env.URL_MIRROR_MEDIA || 'https://www.mirrormedia.mg'

// The following variables are from environment variables

const ENV = process.env.ENV || 'local'
const API_PROTOCOL = process.env.API_PROTOCOL || 'http'
const RESTFUL_API_HOST = process.env.RESTFUL_API_HOST || 'no-api-host'
const API_PORT = process.env.API_PORT || '8080'

// The following variables are given values according to different `ENV`
let API_TIMEOUT = 5000
let URL_STATIC_COMBO_SECTIONS =
  'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'
let URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`
let URL_K3_FLASH_NEWS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/getposts?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate`

switch (ENV) {
  case 'prod':
    API_TIMEOUT = 1500
  case 'staging':
    API_TIMEOUT = 1500
    break
  case 'dev':
    API_TIMEOUT = 5000
    break
  default:
    API_TIMEOUT = 5000
    URL_STATIC_COMBO_SECTIONS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/json/sections.json`
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/api/v2/combo?endpoint=topics`
    URL_K3_FLASH_NEWS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/api/v2/getposts?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate`
}

export {
  URL_MIRROR_MEDIA,
  URL_STATIC_COMBO_SECTIONS,
  URL_STATIC_COMBO_TOPICS,
  URL_K3_FLASH_NEWS,
  API_PROTOCOL,
  RESTFUL_API_HOST,
  API_PORT,
  API_TIMEOUT,
}
