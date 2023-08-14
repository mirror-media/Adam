const GCP_PROJECT_ID = 'mirrormedia-1470651750304'

// The following variables are from environment variables

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// The following variables are given values according to different `ENV`

let SITE_URL = ''
let API_TIMEOUT = 5000
let WEEKLY_API_SERVER_ORIGIN = ''
let WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = ''

let URL_STATIC_PREMIUM_SECTIONS = ''
let URL_STATIC_NORMAL_SECTIONS = ''
let URL_STATIC_TOPICS = ''
let URL_STATIC_POST_FLASH_NEWS = ''
let URL_STATIC_POST_EXTERNAL = ''
let DONATION_PAGE_URL = ''
let GA_MEASUREMENT_ID = ''
let GTM_ID = ''
let SEARCH_URL = 'search-url/search'
let URL_STATIC_POPULAR_NEWS = ''
let URL_STATIC_404_POPULAR_NEWS = ''

let URL_STATIC_EXTERNALS_WARMLIFE = ''
let GPT_MODE = ''
// It is safe to expose the configuration of Firebase.
// See: https://firebase.google.com/docs/projects/api-keys
let FIREBASE_CONFIG = {}
switch (ENV) {
  case 'prod':
    SITE_URL = 'prod.mirrormedia.mg/'
    API_TIMEOUT = 1500

    WEEKLY_API_SERVER_ORIGIN =
      'https://adam-weekly-api-server-prod-ufaummkd5q-de.a.run.app'
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`
    URL_STATIC_PREMIUM_SECTIONS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_sections.json`
    URL_STATIC_TOPICS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/post_external`
    URL_STATIC_POPULAR_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/404_popular.json`
    URL_STATIC_EXTERNALS_WARMLIFE = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/json/life_feed.json`

    DONATION_PAGE_URL = 'https://mirrormedia.oen.tw/'
    GA_MEASUREMENT_ID = 'G-341XFN0675'
    GTM_ID = 'GTM-NCH86SP'
    SEARCH_URL = 'https://adam-mirror-media-search-prod-ufaummkd5q-de.a.run.app'

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
    break

  case 'staging':
    SITE_URL = 'staging-next.mirrormedia.mg'
    API_TIMEOUT = 1500

    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-staging-ufaummkd5q-de.a.run.app'
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`

    URL_STATIC_PREMIUM_SECTIONS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_sections.json`
    URL_STATIC_TOPICS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/post_external`
    URL_STATIC_POPULAR_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/404_popular.json`
    URL_STATIC_EXTERNALS_WARMLIFE = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/json/life_feed.json`

    DONATION_PAGE_URL = 'https://mirrormedia.oen.tw/'
    GA_MEASUREMENT_ID = 'G-32D7P3MJ8B'
    GTM_ID = 'GTM-KVDZ27K'
    SEARCH_URL =
      'https://adam-mirror-media-search-staging-ufaummkd5q-de.a.run.app'

    GPT_MODE = 'prod'
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyD-cFjoIjlEn7-dZtl3zw7OYCRPerl5URs',
      authDomain: 'www-staging.mirrormedia.mg',
      projectId: 'mirrormedia-staging',
      storageBucket: 'mirrormedia-staging.appspot.com',
      messagingSenderId: '388524095772',
      appId: '1:388524095772:web:e3739160c042909827a2d9',
    }
    break

  case 'dev':
    SITE_URL = 'dev-next.mirrormedia.mg'
    API_TIMEOUT = 5000
    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-dev-ufaummkd5q-de.a.run.app'
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`

    URL_STATIC_PREMIUM_SECTIONS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_sections.json`
    URL_STATIC_TOPICS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/post_external`
    URL_STATIC_POPULAR_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/files/json/404_popular.json`
    URL_STATIC_EXTERNALS_WARMLIFE = `https://${WEEKLY_API_SERVER_ORIGIN}/gcs/json/life_feed.json`

    DONATION_PAGE_URL = 'https://mirrormedia.testing.oen.tw/'
    GA_MEASUREMENT_ID = 'G-36HYH6NF6P'
    GTM_ID = 'GTM-PBNLSMX'
    SEARCH_URL = 'https://adam-mirror-media-search-dev-ufaummkd5q-de.a.run.app'

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
    break

  default:
    SITE_URL = 'localhost'
    API_TIMEOUT = 5000

    WEEKLY_API_SERVER_ORIGIN =
      'adam-weekly-api-server-dev-ufaummkd5q-de.a.run.app'
    WEEKLY_API_SERVER_YOUTUBE_ENDPOINT = `https://${WEEKLY_API_SERVER_ORIGIN}/youtube`

    URL_STATIC_PREMIUM_SECTIONS = `http://localhost:8080/json/header_member.json`
    URL_STATIC_NORMAL_SECTIONS = `http://localhost:8080/json/header_sections.json`
    URL_STATIC_TOPICS = `http://localhost:8080/json/header_topics.json`
    URL_STATIC_POST_FLASH_NEWS = `http://localhost:8080/json/header_posts.json`
    URL_STATIC_POST_EXTERNAL = `http://localhost:8080/json/post_external`
    URL_STATIC_POPULAR_NEWS = `http://localhost:8080/json/popular.json`
    URL_STATIC_404_POPULAR_NEWS = `http://localhost:8080/json/404_popular.json`
    URL_STATIC_EXTERNALS_WARMLIFE = `http://localhost:8080/json/life_feed.json`

    DONATION_PAGE_URL = 'https://mirrormedia.testing.oen.tw/'
    GA_MEASUREMENT_ID = 'G-36HYH6NF6P'
    GTM_ID = 'GTM-PBNLSMX'
    SEARCH_URL = 'https://adam-mirror-media-search-dev-ufaummkd5q-de.a.run.app'
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
}

export {
  ENV,
  SITE_URL,
  GCP_PROJECT_ID,
  API_TIMEOUT,
  WEEKLY_API_SERVER_ORIGIN,
  WEEKLY_API_SERVER_YOUTUBE_ENDPOINT,
  URL_STATIC_PREMIUM_SECTIONS,
  URL_STATIC_NORMAL_SECTIONS,
  URL_STATIC_TOPICS,
  URL_STATIC_POST_FLASH_NEWS,
  URL_STATIC_POST_EXTERNAL,
  DONATION_PAGE_URL,
  GA_MEASUREMENT_ID,
  GTM_ID,
  SEARCH_URL,
  URL_STATIC_POPULAR_NEWS,
  URL_STATIC_404_POPULAR_NEWS,
  URL_STATIC_EXTERNALS_WARMLIFE,
  GPT_MODE,
  FIREBASE_CONFIG,
}
