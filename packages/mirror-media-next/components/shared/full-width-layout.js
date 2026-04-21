import styled, { css } from 'styled-components'

/**
 * Shared layout style (can be reused across components)
 */
export const FullWidthLayoutStyle = css`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`

/**
 * Shared style for sections that only need a full-bleed background.
 */
export const FullBleedBackgroundStyle = css`
  position: relative;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: calc(50% - 50vw);
    right: calc(50% - 50vw);
    background: inherit;
    pointer-events: none;
  }
`

/**
 * @typedef {Object} FullWidthLayoutProps
 * @property {string} [bgColor] - Background color.
 *   Accepts a `theme.color.brandColor` key (e.g. 'white', 'darkBlue')
 *   or any valid CSS color string (e.g. '#ffffff', 'rgba(0,0,0,0.1)')
 */

/**
 * Full-width layout wrapper for external content sections.
 *
 * @type {import('styled-components').StyledComponent<'div', any, FullWidthLayoutProps>}
 */
export const FullWidthLayout = styled.div(
  /**
   * @param {FullWidthLayoutProps & { theme: { color: { brandColor: Record<string, string> } } }} props
   */
  ({ bgColor, theme }) => css`
    ${FullWidthLayoutStyle}

    background: ${
      theme.color.brandColor[bgColor] || // if bgColor matches a theme key
      bgColor || // or if bgColor is a CSS color string
      theme.color.brandColor.white // default fallback to white
    };
  `
)
