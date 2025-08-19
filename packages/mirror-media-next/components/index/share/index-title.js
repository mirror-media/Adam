import styled, { css } from 'styled-components'

/**
 * @typedef {Object} IndexTitleProps
 * @property {string} [color] - Text color.
 *   Accepts a `theme.color.brandColor` key (e.g. 'darkBlue', 'gray')
 *   or any valid CSS color string (e.g. '#333', 'rgba(0,0,0,0.6)')
 */

/**
 * Index page section title, styled as an H3 element.
 *
 * @type {import('styled-components').StyledComponent<'h3', any, IndexTitleProps>}
 */
export const IndexTitle = styled.h3(
  /**
   * @param {IndexTitleProps & { theme: { color: { brandColor: Record<string, string> }, breakpoint: Record<string, string> } }} props
   */
  ({ color, theme }) => css`
    color: ${
      theme.color.brandColor[color] || // if color matches a theme key
      color || // or if color is a CSS color string
      theme.color.brandColor.darkBlue // default fallback to darkBlue
    };
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.15;

    /* Medium and up: bold text */
    ${theme.breakpoint.md} {
      font-weight: 700;
    }

    /* Extra-large and up: larger font size */
    ${theme.breakpoint.xl} {
      font-size: 28px;
    }
  `
)
