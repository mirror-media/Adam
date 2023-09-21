import styled from 'styled-components'

const HeaderWrapper = styled.header`
  display: flex;
  padding: 12px 0 24px 0;
  max-width: 100vw;
  min-width: 100vw;
  justify-content: center;
`

const HeaderLogo = styled.a`
  position: relative;
  width: 73.5px;
`

/**
 * @returns {JSX.Element}
 */
export default function AmpHeader() {
  return (
    <HeaderWrapper>
      <HeaderLogo href="/">
        {/* @ts-ignore */}
        <amp-img
          width="73.5"
          height="31.08"
          src="/images-next/mirror-media-logo.svg"
          alt="mirrormedia"
          layout="responsive"
        />
      </HeaderLogo>
    </HeaderWrapper>
  )
}
