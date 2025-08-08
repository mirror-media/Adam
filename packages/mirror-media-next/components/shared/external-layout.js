import styled, { css } from 'styled-components'

/**
 * Shared layout style (can be reused across components)
 */
export const ExternalLayoutStyle = css`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`

/**
 * @typedef {Object} ExternalLayoutProps
 * @property {string} [bgColor] - Background color.
 *   Accepts a `theme.color.brandColor` key (e.g. 'white', 'darkBlue')
 *   or any valid CSS color string (e.g. '#ffffff', 'rgba(0,0,0,0.1)')
 */

/**
 * Full-width layout wrapper for external content sections.
 *
 * @type {import('styled-components').StyledComponent<'div', any, ExternalLayoutProps>}
 */
export const ExternalLayout = styled.div(
  /**
   * @param {ExternalLayoutProps & { theme: { color: { brandColor: Record<string, string> } } }} props
   */
  ({ bgColor, theme }) => css`
    ${ExternalLayoutStyle}

    background: ${
      theme.color.brandColor[bgColor] || // if bgColor matches a theme key
      bgColor || // or if bgColor is a CSS color string
      theme.color.brandColor.white // default fallback to white
    };
  `
)
