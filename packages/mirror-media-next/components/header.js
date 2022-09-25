import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
const HeaderWrapper = styled.div`
  z-index: 519;
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 1);
`
export default function Header() {
  return (
    <HeaderWrapper>
      <Link href="/">
        <>
          <Image
            src="/image/mirror-media-logo.svg"
            alt="mirrormedia"
            width={107}
            height={45}
          ></Image>
        </>
      </Link>
    </HeaderWrapper>
  )
}
