// This file is for response codes from Firebaes SDK

export const FirebaseAuthError = /** @type {const} */ ({
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
  WEAK_PASSWORD: 'auth/weak-password',
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL:
    'auth/account-exists-with-different-credential',
  USER_DISABLED: 'auth/user-disabled',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
})
