/**
 * Guarded `localStorage` access.
 *
 * Accessing `window.localStorage` can throw — the property access itself, not just
 * the read or write — so every call has to be wrapped.
 */

export function isStorageAvailable(): boolean {
  try {
    return Boolean(window.localStorage)
  } catch {
    return false
  }
}

export function getStorageItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStorageItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
    // eslint-disable-next-line no-empty
  } catch {}
}

export function removeStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key)
    // eslint-disable-next-line no-empty
  } catch {}
}
