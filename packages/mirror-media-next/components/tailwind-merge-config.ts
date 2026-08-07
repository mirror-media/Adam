import { extendTailwindMerge } from 'tailwind-merge'

// twMerge doesn't know this project's custom `mm-*` scale, so `text-mm-h1`
// (font-size, from Tailwind v4's `--text-*` namespace) and `text-mm-neutral-0`
// (color, from `--color-*`) both look like plain `text-*` classes to it and
// get treated as the same conflict group -- one gets silently dropped.
// These lists teach twMerge to tell the two `mm-*` scales apart so both can
// coexist in one class list (e.g. `text-mm-subtitle text-mm-neutral-0` on a
// Button or Badge). Keep these in sync with the token names in
// styles/tailwind.css when the token set changes.
const mmTextSizes = [
  'mm-hero-title',
  'mm-h1',
  'mm-h2',
  'mm-h3',
  'mm-h4',
  'mm-h5',
  'mm-h6',
  'mm-subtitle',
  'mm-body2',
  'mm-body-l',
  'mm-body-m',
  'mm-body-s',
  'mm-caption-l',
  'mm-caption-s',
]

const mmTextColors = [
  'mm-neutral-900',
  'mm-neutral-800',
  'mm-neutral-700',
  'mm-neutral-600',
  'mm-neutral-500',
  'mm-neutral-400',
  'mm-neutral-300',
  'mm-neutral-200',
  'mm-neutral-100',
  'mm-neutral-50',
  'mm-neutral-0',
  'mm-base-700',
  'mm-base-600',
  'mm-base-500',
  'mm-base-400',
  'mm-base-300',
  'mm-base-200',
  'mm-base-100',
  'mm-second-700',
  'mm-second-600',
  'mm-second-500',
  'mm-second-400',
  'mm-second-300',
  'mm-second-200',
  'mm-second-100',
  'mm-error-700',
  'mm-error-600',
  'mm-error-500',
  'mm-error-400',
  'mm-error-300',
  'mm-error-200',
  'mm-error-100',
]

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: mmTextSizes }],
      'text-color': [{ text: mmTextColors }],
    },
  },
})
