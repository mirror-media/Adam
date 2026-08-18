import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge doesn't read Tailwind v4's CSS theme variables at runtime.
// Register every custom theme value whose name isn't recognized by the
// default config. Keep these lists in sync with styles/tailwind.css.
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

const mmSpacing = [
  'mm-sx',
  'mm-s',
  'mm-m',
  'mm-l',
  'mm-xl',
  'mm-2xl',
  'mm-3xl',
  'mm-4xl',
  'mm-5xl',
  'mm-6xl',
]

const mmRadii = ['mm-xs', 'mm-s', 'mm-m', 'mm-l', 'mm-xl', 'mm-full']

export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: mmRadii,
      spacing: mmSpacing,
      text: mmTextSizes,
    },
  },
})
