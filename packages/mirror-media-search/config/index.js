const delimiter = ','

const URL_MIRROR_MEDIA =
  process.env.URL_MIRROR_MEDIA || 'https://www.mirrormedia.mg'
const URL_MIRROR_MEDIA_V3 =
  process.env.URL_MIRROR_MEDIA_V3 || 'https://dev-next.mirrormedia.mg'
const URL_STATIC_COMBO_SECTIONS =
  'https://storage.googleapis.com/statics.mirrormedia.mg/json/sections.json'
const URL_PROGRAMABLE_SEARCH =
  'https://www.googleapis.com/customsearch/v1/siterestrict'

// The following variables are from environment variables
const ENV = process.env.ENV || 'local'
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(delimiter)
  : ['http://localhost']
const URL_HOST = process.env.URL_HOST || 'http://localhost:3000/'
const API_PROTOCOL = process.env.API_PROTOCOL || 'http'
const API_PORT = process.env.API_PORT || '8080'
const API_HOST = process.env.API_HOST || 'no-api-host'
const READ_REDIS_HOST = process.env.READ_REDIS_HOST || 'get read redis url'
const WRITE_REDIS_HOST = process.env.WRITE_REDIS_HOST || 'get write redis url'
const REDIS_AUTH = process.env.REDIS_AUTH || 'find redis password'
const REDIS_EX = parseInt(process.env.REDIS_EX) || 60
const PROGRAMABLE_SEARCH_ENGINE_ID =
  process.env.PROGRAMABLE_SEARCH_ENGINE_ID || 'SEARCH_ENGINE_ID'
const PROGRAMABLE_SEARCH_API_KEY =
  process.env.PROGRAMABLE_SEARCH_API_KEY || 'API_KEY'
let GA_TRACKING_ID

// The following variables are given values according to different `ENV`
let API_TIMEOUT = 5000

switch (ENV) {
  case 'prod':
    API_TIMEOUT = 1500
    GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? 'UA-83609754-1'
    break
  case 'staging':
    API_TIMEOUT = 1500
    GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? 'UA-83609754-1'
    break
  case 'dev':
    API_TIMEOUT = 5000
    GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? 'UA-83609754-2'
    break
  default:
    API_TIMEOUT = 5000
    GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID ?? 'UA-83609754-2'
}

export {
  API_HOST,
  API_PORT,
  API_PROTOCOL,
  API_TIMEOUT,
  URL_MIRROR_MEDIA,
  URL_MIRROR_MEDIA_V3,
  URL_STATIC_COMBO_SECTIONS,
  URL_PROGRAMABLE_SEARCH,
  URL_HOST,
  READ_REDIS_HOST,
  WRITE_REDIS_HOST,
  REDIS_AUTH,
  REDIS_EX,
  PROGRAMABLE_SEARCH_ENGINE_ID,
  PROGRAMABLE_SEARCH_API_KEY,
  CORS_ORIGINS,
  GA_TRACKING_ID,
}
