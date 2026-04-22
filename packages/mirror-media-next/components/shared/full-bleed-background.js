import { css } from 'styled-components'

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
