import Image from 'next/image'

import styled from 'styled-components'
import { Z_INDEX } from '../../constants'
import { getCategoryOfWineSlug } from '../../utils/index'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 10vh;
  background: #000;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: ${Z_INDEX.coverContent};
  color: #fff;
  font-weight: 300;
  line-height: 50px;
  font-size: 20px;
  padding: 0 6px;
  letter-spacing: -2px;

  @media screen and (min-width: 320px) {
    font-size: 25px;
    padding: 0 14px;
  }

  ${({ theme }) => theme.breakpoint.sm} {
    font-size: 40px;
    padding: 0 20px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 40px;
    font-size: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 90px;
    font-size: 50px;
  }

  .wine-warning-image {
    width: 27.78px;
    height: 27.78px;
    ${({ theme }) => theme.breakpoint.sm} {
      width: 50px;
      height: 50px;
    }
  }
`
/**
 * @typedef {import('../../apollo/fragments/category').Category} Category - category information
 */

/**
 * Consider that it's hard for an image to fit the width of all screens while maintaining its ratio. Therefore, display the warning message in separate <span> tags and arrange them using flexbox with 'justify-content: space-between'.
 * @param {Object} props
 * @param {Pick<Category, 'id' | 'name'  | 'slug'>[]} props.categories - certain category information
 * @returns {JSX.Element}
 */

export default function WineWarning({ categories = [] }) {
  const categoryOfWineSlug = getCategoryOfWineSlug(categories)

  const wineWarningJsx =
    categoryOfWineSlug.length > 0 ? (
      <Wrapper>
        <span>禁</span>
        <span>止</span>
        <span>酒</span>
        <span>駕</span>
        <Image
          className="wine-warning-image"
          src={'/images/wine-warning-icon.png'}
          width={50}
          height={50}
          alt="wine-warning-icon"
        />
        <span>未</span>
        <span>滿</span>
        <span>十</span>
        <span>八</span>
        <span>歲</span>
        <span>禁</span>
        <span>止</span>
        <span>飲</span>
        <span>酒</span>
      </Wrapper>
    ) : null

  return <>{wineWarningJsx}</>
}
