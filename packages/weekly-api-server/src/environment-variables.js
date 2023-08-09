const {
  JWT_SECRET,
  GCP_PROJECT_ID,
  FIREBASE_PROJECT_ID,
  ISRAFEL_GQL_ORIGIN,
  WEEKLY_GQL_ORIGIN,
  CORS_ALLOW_ORIGINS,
  GCS_ORIGIN,
  YOUTUBE_ORIGIN,
} = process.env

/**
 *
 * @param {string} [cors]
 * @returns {'*' | string[]}
 */
const getAllowOrigins = (cors) => {
  if (cors === '*') {
    return '*'
  } else if (typeof cors === 'string') {
    return cors.split(',')
  } else {
    return ['https://www.mirrormedia.mg', 'https://mirrormedia.mg']
  }
}
const envVar = {
  jwt: {
    secret: JWT_SECRET || 'jwt-secret',
  },
  gcp: {
    projectId: GCP_PROJECT_ID || 'mirrormedia-1470651750304',
  },
  firebase: {
    projectId: FIREBASE_PROJECT_ID || 'mirror-weekly',
  },
  apis: {
    israfel: {
      origin: ISRAFEL_GQL_ORIGIN || 'https://israfel-gql.mirrormedia.mg',
    },
    weekly: {
      origin: WEEKLY_GQL_ORIGIN || 'https://weekly-gql.mirrormedia.mg',
    },
  },
  cors: {
    allowOrigins: getAllowOrigins(CORS_ALLOW_ORIGINS),
  },
  gcs: {
    origin: GCS_ORIGIN || 'https://v3-statics.mirrormedia.mg'
  },
  youtube: {
    origin: YOUTUBE_ORIGIN || 'https://api.mirrormedia.mg'
  },
}

export default envVar
