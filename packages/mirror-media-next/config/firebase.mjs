const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// It is safe to expose the configuration of Firebase.
// See: https://firebase.google.com/docs/projects/api-keys
/** @type {import("firebase/app").FirebaseOptions} */
let FIREBASE_CONFIG = {}

switch (ENV) {
  case 'prod':
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
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyD-cFjoIjlEn7-dZtl3zw7OYCRPerl5URs',
      authDomain: 'staging.mirrormedia.mg',
      projectId: 'mirrormedia-staging',
      storageBucket: 'mirrormedia-staging.appspot.com',
      messagingSenderId: '388524095772',
      appId: '1:388524095772:web:e3739160c042909827a2d9',
    }
    break
  case 'dev':
    FIREBASE_CONFIG = {
      apiKey: 'AIzaSyAavk46-8OQ4B2cv0TOqxOMjd5Fe4tIauc',
      authDomain: 'dev.mirrormedia.mg',
      databaseURL: 'https://mirrormediaapptest.firebaseio.com',
      projectId: 'mirrormediaapptest',
      storageBucket: 'mirrormediaapptest.appspot.com',
      messagingSenderId: '305253456270',
      appId: '1:305253456270:web:21f9851dd09f60ebfbacdf',
      measurementId: 'G-EY5CYC602Z',
    }
    break
  default:
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
}

export { FIREBASE_CONFIG }
