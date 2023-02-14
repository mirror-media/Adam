const {
  JWT_SECRET,
  GCP_PROJECT_ID,
  FIREBASE_PROJECT_ID,
  ISRAFEL_GQL_ORIGIN,
  WEEKLY_GQL_ORIGIN,
  CORS_ALLOW_ORIGINS,
} = process.env

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
      origin:
        ISRAFEL_GQL_ORIGIN || 'https://israfel-gql.mirrormedia.mg',
    },
    weekly: {
      origin:
        WEEKLY_GQL_ORIGIN || 'https://weekly-gql.mirrormedia.mg',
    },
  },
  cors: {
    allowOrigins:
      typeof CORS_ALLOW_ORIGINS === 'string'
        ? CORS_ALLOW_ORIGINS.split(',')
        : ['https://www.mirrormedia.mg', 'https://mirrormedia.mg'],
  },
}

export default envVar
