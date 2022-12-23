// The following variables are from environment variables

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// The following variables are given values according to different `ENV`

let API_TIMEOUT = 5000
let API_PROTOCOL = 'http'
let API_HOST = ''
let RESTFUL_API_HOST = ''
let API_PORT = ''

let URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`
let URL_K3_FLASH_NEWS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/getposts?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate`
let URL_STATIC_COMBO_SECTIONS = ''
let URL_STATIC_POST_EXTERNAL = ''

switch (ENV) {
  case 'prod':
  case 'staging':
    API_TIMEOUT = 1500
    API_HOST = '' //currently unset
    RESTFUL_API_HOST = '' //currently unset
    API_PORT = '' //currently unset
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`
    URL_K3_FLASH_NEWS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/getposts?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate`
    URL_STATIC_COMBO_SECTIONS =
      'https://statics.mirrormedia.mg/json/sections.json'
    URL_STATIC_POST_EXTERNAL =
      'https://statics.mirrormedia.mg/json/post_external'
    break
  case 'dev':
    API_TIMEOUT = 5000
    API_HOST = 'mirror-cms-gql-dev-ufaummkd5q-de.a.run.app'
    RESTFUL_API_HOST = '104.199.190.189'
    API_PORT = '8080'
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/combo?endpoint=topics`
    URL_K3_FLASH_NEWS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/getposts?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate`
    URL_STATIC_COMBO_SECTIONS =
      'https://statics.mirrormedia.mg/json/sections.json'
    URL_STATIC_POST_EXTERNAL =
      'https://statics.mirrormedia.mg/dev/post_external'

    break
  default:
    API_TIMEOUT = 5000
    RESTFUL_API_HOST = 'localhost'
    API_PORT = '8080'
    API_HOST = 'mirror-cms-gql-dev-ufaummkd5q-de.a.run.app'
    URL_STATIC_COMBO_SECTIONS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/json/sections.json`
    URL_STATIC_COMBO_TOPICS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/api/v2/combo?endpoint=topics`
    URL_K3_FLASH_NEWS = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/api/v2/getposts?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate`
    URL_STATIC_POST_EXTERNAL = `${API_PROTOCOL}://${RESTFUL_API_HOST}:${API_PORT}/json/post_external`
}

export {
  API_TIMEOUT,
  API_HOST,
  URL_STATIC_COMBO_SECTIONS,
  URL_STATIC_COMBO_TOPICS,
  URL_K3_FLASH_NEWS,
  URL_STATIC_POST_EXTERNAL,
}
