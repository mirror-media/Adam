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
  background-color: rgba(255, 255, 255, 1);
`
const HeaderTop = styled.div`
  height: 74.62px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5px 90px 20px;
  border-bottom: 3px solid black;
`
const ActionWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 529;
  ${({ fixHeader }) =>
    fixHeader && `margin-right: ${Header_Search_Margin_Right};`}
`

export default function Header() {
  return (
    <HeaderWrapper>
      <HeaderTop>
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
        <ActionWrapper>
          <SubBrandList subBrands={SUB_BRAND_LINKS} />
          <SearchBar />
          <PromotionLinks links={PROMOTION_LINKS} />
        </ActionWrapper>
      </HeaderTop>
    </HeaderWrapper>
  )
}
