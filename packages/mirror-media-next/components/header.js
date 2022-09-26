import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import SubBrandList from './sub-brand-list'
import {
  SUB_BRAND_LINKS,
  PROMOTION_LINKS,
} from '../utils/mirror-media/const.js'
import SearchBar from './search-bar'
import PromotionLinks from './promotion-links'
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
            src="/images/mirror-media-logo.svg"
            alt="mirrormedia"
            width={107}
            height={45}
          ></Image>
        </>
      </Link>
      <SubBrandList subBrands={SUB_BRAND_LINKS} />
      <SearchBar />
      <PromotionLinks links={PROMOTION_LINKS} />
    </HeaderWrapper>
  )
}
