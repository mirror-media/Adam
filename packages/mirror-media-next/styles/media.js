const mediaSize = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1440,
}

const minWidth = {
  xs: `(min-width: ${mediaSize.xs}px)`,
  sm: `(min-width: ${mediaSize.sm}px)`,
  md: `(min-width: ${mediaSize.md}px)`,
  lg: `(min-width: ${mediaSize.lg}px)`,
  xl: `(min-width: ${mediaSize.xl}px)`,
  xxl: `(min-width: ${mediaSize.xxl}px)`,
}

const maxWidth = {
  xs: `(max-width: ${mediaSize.xs - 1}px)`,
  sm: `(max-width: ${mediaSize.sm - 1}px)`,
  md: `(max-width: ${mediaSize.md - 1}px)`,
  lg: `(max-width: ${mediaSize.lg - 1}px)`,
  xl: `(max-width: ${mediaSize.xl - 1}px)`,
  xxl: `(max-width: ${mediaSize.xxl - 1}px)`,
}

export { mediaSize, minWidth, maxWidth }
