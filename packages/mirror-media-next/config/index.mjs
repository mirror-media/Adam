const GCP_PROJECT_ID = 'mirrormedia-1470651750304'

// The following variables are from environment variables

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
const IS_PREVIEW_MODE = process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true'
const NEWEBPAY_PAPERMAG_KEY =
  process.env.NEWEBPAY_PAPERMAG_KEY || 'newebpay-papermag-key'
const NEWEBPAY_PAPERMAG_IV =
  process.env.NEWEBPAY_PAPERMAG_IV || 'newebpay-papermag-iv'
const ISRAFEL_ORIGIN = process.env.ISRAFEL_ORIGIN || 'israfel-origin'

// should be applied in preview mode
const SITE_BASE_PATH = IS_PREVIEW_MODE ? '/preview-server' : ''

// The following variables are given values according to different `ENV`

let SITE_URL = ''
let API_TIMEOUT = 5000
let API_TIMEOUT_GRAPHQL = 5000
let WEEKLY_API_SERVER_ORIGIN = ''
let PREVIEW_SERVER_ORIGIN = ''
let WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = ''
let STATIC_FILE_DOMAIN = ''
let ACCESS_SUBSCRIBE_FEATURE_TOGGLE = 'off'
let ACCESS_PAPERMAG_FEATURE_TOGGLE = 'off'
let GCP_LOGGING_FEATURE_TOGGLE = 'off'
let DRAFT_RENDERER_FEATURE_TOGGLE = 'off'
let LOGIN_PAGE_FEATURE_TOGGLE = 'off'
let URL_STATIC_PREMIUM_SECTIONS = ''
let URL_STATIC_NORMAL_SECTIONS = ''
let URL_STATIC_TOPICS = ''
let URL_STATIC_POST_FLASH_NEWS = ''
let URL_STATIC_POST_EXTERNAL = ''
let URL_STATIC_HEADER_HEADERS = ''
let URL_STATIC_PODCAST_LIST = ''
let DONATION_PAGE_URL = ''
let GA_MEASUREMENT_ID = ''
let GTM_ID = ''
let SEARCH_URL = 'search-url/search'
let URL_STATIC_POPULAR_NEWS = ''
let URL_STATIC_404_POPULAR_NEWS = ''
let NEWEBPAY_PAPERMAG_API_URL = ''
let URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION = ''
let GPT_MODE = ''
// It is safe to expose the configuration of Firebase.
// See: https://firebase.google.com/docs/projects/api-keys
let FIREBASE_CONFIG = {}

let GCP_STACKDRIVER_LOG_NAME = ''

switch (ENV) {
  case 'prod':
    SITE_URL = 'www.mirrormedia.mg'
    API_TIMEOUT = 1500
    API_TIMEOUT_GRAPHQL = 4000
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-prod-ufaummkd5q-de.a.run.app'
    PREVIEW_SERVER_ORIGIN = 'mirror-cms-preview-prod-ufaummkd5q-de.a.run.app'
    STATIC_FILE_DOMAIN = 'v3-statics.mirrormedia.mg'
    // WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://api.mirrormedia.mg/youtube`
    URL_STATIC_PREMIUM_SECTIONS = `https://${STATIC_FILE_DOMAIN}/files/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `https://${STATIC_FILE_DOMAIN}/files/json/header_sections.json`
    URL_STATIC_TOPICS = `https://${STATIC_FILE_DOMAIN}/files/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `https://${STATIC_FILE_DOMAIN}/files/json/post_external`
    URL_STATIC_POPULAR_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/404_popular.json`
    URL_STATIC_HEADER_HEADERS = `https://${STATIC_FILE_DOMAIN}/files/json/header_headers.json`
    URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION = `https://${STATIC_FILE_DOMAIN}/files/json/sections`
    URL_STATIC_PODCAST_LIST = `https://${STATIC_FILE_DOMAIN}/json/podcast_list.json`

    NEWEBPAY_PAPERMAG_API_URL = 'https://core.newebpay.com/MPG/mpg_gateway'
    ACCESS_SUBSCRIBE_FEATURE_TOGGLE = 'off'
    ACCESS_PAPERMAG_FEATURE_TOGGLE = 'off'
    GCP_LOGGING_FEATURE_TOGGLE = 'on'
    DRAFT_RENDERER_FEATURE_TOGGLE = 'on'
    LOGIN_PAGE_FEATURE_TOGGLE = 'off'
    DONATION_PAGE_URL = 'https://mirrormedia.oen.tw/'
    GA_MEASUREMENT_ID = 'G-341XFN0675'
    GTM_ID = 'GTM-NCH86SP'
    SEARCH_URL = 'https://search.mirrormedia.mg'

    GPT_MODE = 'prod'
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyBZVaJXDbtc6O6Iy36OeYDG8Cd9pB2vq54',
      authDomain: 'www.mirrormedia.mg',
      projectId: 'mirror-weekly',
      storageBucket: 'mirror-weekly.appspot.com',
      messagingSenderId: '814835936704',
      appId: '1:814835936704:web:ce5288f6d1c0f71828ec25',
      measurementId: 'G-2FDRC4S37L',
    }
    GCP_STACKDRIVER_LOG_NAME = 'mirror-media-next-user-behavior'

    break

  case 'staging':
    SITE_URL = 'staging-next.mirrormedia.mg'
    API_TIMEOUT = 1500
    API_TIMEOUT_GRAPHQL = 4000

    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-staging-ufaummkd5q-de.a.run.app'

    PREVIEW_SERVER_ORIGIN = 'mirror-cms-preview-staging-ufaummkd5q-de.a.run.app'
    // WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://api.mirrormedia.mg/youtube`
    STATIC_FILE_DOMAIN = 'v3-statics-staging.mirrormedia.mg'

    URL_STATIC_PREMIUM_SECTIONS = `https://${STATIC_FILE_DOMAIN}/files/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `https://${STATIC_FILE_DOMAIN}/files/json/header_sections.json`
    URL_STATIC_TOPICS = `https://${STATIC_FILE_DOMAIN}/files/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `https://${STATIC_FILE_DOMAIN}/files/json/post_external`
    URL_STATIC_POPULAR_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/404_popular.json`
    URL_STATIC_HEADER_HEADERS = `https://${STATIC_FILE_DOMAIN}/files/json/header_headers.json`
    URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION = `https://${STATIC_FILE_DOMAIN}/files/json/sections`
    URL_STATIC_PODCAST_LIST = `https://v3-statics.mirrormedia.mg/json/podcast_list.json`

    NEWEBPAY_PAPERMAG_API_URL = 'https://ccore.newebpay.com/MPG/mpg_gateway'

    ACCESS_SUBSCRIBE_FEATURE_TOGGLE = 'off'
    ACCESS_PAPERMAG_FEATURE_TOGGLE = 'off'
    GCP_LOGGING_FEATURE_TOGGLE = 'on'
    DRAFT_RENDERER_FEATURE_TOGGLE = 'on'
    LOGIN_PAGE_FEATURE_TOGGLE = 'off'

    DONATION_PAGE_URL = 'https://mirrormedia.oen.tw/'
    GA_MEASUREMENT_ID = 'G-32D7P3MJ8B'
    GTM_ID = 'GTM-KVDZ27K'
    SEARCH_URL = 'https://search-staging.mirrormedia.mg'

    GPT_MODE = 'prod'
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyD-cFjoIjlEn7-dZtl3zw7OYCRPerl5URs',
      authDomain: 'www-staging.mirrormedia.mg',
      projectId: 'mirrormedia-staging',
      storageBucket: 'mirrormedia-staging.appspot.com',
      messagingSenderId: '388524095772',
      appId: '1:388524095772:web:e3739160c042909827a2d9',
    }
    GCP_STACKDRIVER_LOG_NAME = 'mirror-media-next-user-behavior_staging'
    break

  case 'dev':
    SITE_URL = 'dev-next.mirrormedia.mg'
    API_TIMEOUT = 5000
    API_TIMEOUT_GRAPHQL = 5000

    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-dev-ufaummkd5q-de.a.run.app'
    PREVIEW_SERVER_ORIGIN = 'mirror-cms-preview-dev-ufaummkd5q-de.a.run.app'
    // WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://api.mirrormedia.mg/youtube`
    STATIC_FILE_DOMAIN = 'v3-statics-dev.mirrormedia.mg'
    URL_STATIC_PREMIUM_SECTIONS = `https://${STATIC_FILE_DOMAIN}/files/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `https://${STATIC_FILE_DOMAIN}/files/json/header_sections.json`
    URL_STATIC_TOPICS = `https://${STATIC_FILE_DOMAIN}/files/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `https://${STATIC_FILE_DOMAIN}/files/json/post_external`
    URL_STATIC_POPULAR_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `https://${STATIC_FILE_DOMAIN}/files/json/404_popular.json`
    URL_STATIC_HEADER_HEADERS = `https://${STATIC_FILE_DOMAIN}/files/json/header_headers.json`
    URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION = `https://${STATIC_FILE_DOMAIN}/files/json/sections`
    URL_STATIC_PODCAST_LIST = `https://${STATIC_FILE_DOMAIN}/json/podcast_list.json`

    NEWEBPAY_PAPERMAG_API_URL = 'https://ccore.newebpay.com/MPG/mpg_gateway'

    DONATION_PAGE_URL = 'https://mirrormedia.testing.oen.tw/'
    GA_MEASUREMENT_ID = 'G-36HYH6NF6P'
    GTM_ID = 'GTM-PBNLSMX'
    SEARCH_URL = 'https://search-dev.mirrormedia.mg'

    ACCESS_SUBSCRIBE_FEATURE_TOGGLE = 'on'
    ACCESS_PAPERMAG_FEATURE_TOGGLE = 'on'
    GCP_LOGGING_FEATURE_TOGGLE = 'on'
    DRAFT_RENDERER_FEATURE_TOGGLE = 'on'
    LOGIN_PAGE_FEATURE_TOGGLE = 'on'
    GPT_MODE = 'dev'
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyAavk46-8OQ4B2cv0TOqxOMjd5Fe4tIauc',
      authDomain: 'mirrormediaapptest.firebaseapp.com',
      databaseURL: 'https://mirrormediaapptest.firebaseio.com',
      projectId: 'mirrormediaapptest',
      storageBucket: 'mirrormediaapptest.appspot.com',
      messagingSenderId: '305253456270',
      appId: '1:305253456270:web:21f9851dd09f60ebfbacdf',
      measurementId: 'G-EY5CYC602Z',
    }
    GCP_STACKDRIVER_LOG_NAME = 'mirror-media-next-user-behavior_dev'
    break

  default:
    SITE_URL = 'localhost'
    API_TIMEOUT = 5000
    API_TIMEOUT_GRAPHQL = 5000
    PREVIEW_SERVER_ORIGIN = ''
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-dev-ufaummkd5q-de.a.run.app'
    // WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `http://api-dev.mirrormedia.mg:8080/youtube`
    STATIC_FILE_DOMAIN = 'v3-statics-dev.mirrormedia.mg'

    NEWEBPAY_PAPERMAG_API_URL = 'https://ccore.newebpay.com/MPG/mpg_gateway'
    ACCESS_SUBSCRIBE_FEATURE_TOGGLE = 'on'
    ACCESS_PAPERMAG_FEATURE_TOGGLE = 'on'
    GCP_LOGGING_FEATURE_TOGGLE = 'on'
    DRAFT_RENDERER_FEATURE_TOGGLE = 'on'
    LOGIN_PAGE_FEATURE_TOGGLE = 'on'

    URL_STATIC_PREMIUM_SECTIONS = `http://localhost:8080/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `http://localhost:8080/json/header_sections.json`
    URL_STATIC_TOPICS = `http://localhost:8080/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `http://localhost:8080/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `http://localhost:8080/json/post_external`
    URL_STATIC_POPULAR_NEWS = `http://localhost:8080/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `http://localhost:8080/json/404_popular.json`
    URL_STATIC_HEADER_HEADERS = `http://localhost:8080/json/header_headers.json`
    URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION = `http://localhost:8080/json/sections`
    URL_STATIC_PODCAST_LIST = `https://${STATIC_FILE_DOMAIN}/json/podcast_list.json`

    DONATION_PAGE_URL = 'https://mirrormedia.testing.oen.tw/'
    GA_MEASUREMENT_ID = 'G-36HYH6NF6P'
    GTM_ID = 'GTM-PBNLSMX'
    SEARCH_URL = 'https://search-dev.mirrormedia.mg'
    GPT_MODE = 'dev'
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyAavk46-8OQ4B2cv0TOqxOMjd5Fe4tIauc',
      authDomain: 'mirrormediaapptest.firebaseapp.com',
      databaseURL: 'https://mirrormediaapptest.firebaseio.com',
      projectId: 'mirrormediaapptest',
      storageBucket: 'mirrormediaapptest.appspot.com',
      messagingSenderId: '305253456270',
      appId: '1:305253456270:web:21f9851dd09f60ebfbacdf',
      measurementId: 'G-EY5CYC602Z',
    }
    GCP_STACKDRIVER_LOG_NAME = 'mirror-media-next-user-behavior_local'
}

export {
  ACCESS_PAPERMAG_FEATURE_TOGGLE,
  ACCESS_SUBSCRIBE_FEATURE_TOGGLE,
  DRAFT_RENDERER_FEATURE_TOGGLE,
  LOGIN_PAGE_FEATURE_TOGGLE,
  API_TIMEOUT,
  API_TIMEOUT_GRAPHQL,
  DONATION_PAGE_URL,
  ENV,
  FIREBASE_CONFIG,
  GA_MEASUREMENT_ID,
  GCP_LOGGING_FEATURE_TOGGLE,
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
  GPT_MODE,
  GTM_ID,
  IS_PREVIEW_MODE,
  NEWEBPAY_PAPERMAG_API_URL,
  NEWEBPAY_PAPERMAG_IV,
  NEWEBPAY_PAPERMAG_KEY,
  ISRAFEL_ORIGIN,
  PREVIEW_SERVER_ORIGIN,
  SEARCH_URL,
  SITE_BASE_PATH,
  SITE_URL,
  URL_STATIC_404_POPULAR_NEWS,
  URL_STATIC_HEADER_HEADERS,
  URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
  URL_STATIC_NORMAL_SECTIONS,
  URL_STATIC_PODCAST_LIST,
  URL_STATIC_POPULAR_NEWS,
  URL_STATIC_POST_EXTERNAL,
  URL_STATIC_POST_FLASH_NEWS,
  URL_STATIC_PREMIUM_SECTIONS,
  URL_STATIC_TOPICS,
  WEEKLY_API_SERVER_ORIGIN,
  WEEKLY_API_SERVER_YOUTUBE_ENDPOINT,
}
