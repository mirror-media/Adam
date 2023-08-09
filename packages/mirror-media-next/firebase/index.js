import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { FIREBASE_CONFIG } from '../config/index.mjs'

// It is safe to expose the Firebase config.
// See: https://firebase.google.com/docs/projects/api-keys

/**
 * Initialize Firebase
 * @see https://firebase.google.com/docs/reference/js/app.md#initializeapp
 */
const firebaseApp = initializeApp(FIREBASE_CONFIG)

/**
 * Initialize Firebase Authentication and get a reference to the service
 * @see https://firebase.google.com/docs/auth/web/start
 * @see https://firebase.google.com/docs/reference/js/auth.md#getauth
 */
const auth = getAuth(firebaseApp)

export { firebaseApp, auth }
