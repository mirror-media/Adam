import { initializeApp, getApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let FIREBASE_ADMIN_CREDENTIAL
try {
  const credential = process.env.FIREBASE_ADMIN_CREDENTIAL
  FIREBASE_ADMIN_CREDENTIAL = JSON.parse(credential)
} catch (err) {
  console.error(
    JSON.stringify({
      severity: 'ERROR',
      message: err.message,
    })
  )
  FIREBASE_ADMIN_CREDENTIAL = {}
}

function getAdminApp() {
  let app
  try {
    app = getApp()
  } catch (e) {
    app = initializeApp({ credential: cert(FIREBASE_ADMIN_CREDENTIAL) })
  }
  return app
}

function getAdminAuth() {
  return getAuth(getAdminApp())
}

export { getAdminApp, getAdminAuth }
