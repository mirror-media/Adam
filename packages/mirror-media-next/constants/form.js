const Start = 'start'
const Incomplete = 'incomplete'
const Invalid = 'invalid'
const Valid = 'valid'

/** @typedef {Start | Incomplete | Invalid | Valid} InputStateEnum */

export const InputState = /** @type {const} */ ({
  Start,
  Incomplete,
  Invalid,
  Valid,
})
