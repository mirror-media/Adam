import styled from 'styled-components'

// The AMP PopIn ads only appear on mobile screens. To prevent blank space, the component should not be displayed when the screen width is greater than 'md'.
const PopInWrapper = styled.div`
  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`
/**
 * Renders a Popin component.
 *
 * @return {JSX.Element} The rendered Popin component.
 */

export default function AmpPopIn() {
  return (
    <PopInWrapper>
      {/* @ts-ignore */}
      <amp-ad
        type="popin"
        width={300}
        height={68}
        layout="responsive"
        heights="(min-width:1907px) 39%, (min-width:1200px) 46%, (min-width:780px) 64%, (min-width:480px) 98%, (min-width:460px) 167%, 196%"
        data-mediaid="mirrormedia_AMP"
      />
    </PopInWrapper>
  )
}
