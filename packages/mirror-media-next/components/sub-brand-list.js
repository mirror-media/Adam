import styled from 'styled-components'
import Image from 'next/image'
const SubBrandListWrapper = styled.ul`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;
  }
`
const SubBrand = styled.a`
  padding-left: 10px;
  padding-right: 10px;
  flex: 0 0 auto;
  cursor: pointer;
`

/**
 *
 * @param {Object} props
 * @param {import('../type').SubBrand[]} props.subBrands
 * @param {string} [props.className]
 * @returns
 */
export default function SubBrandList({ subBrands = [], className }) {
  return (
    <SubBrandListWrapper className={className}>
      {subBrands.map(({ name, title, href, imageSize }) => (
        <SubBrand
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferer"
        >
          <Image
            width={imageSize.normal.width}
            height={imageSize.normal.height}
            src={`/images-next/${name}.png`}
            alt={title}
            loading="eager"
          ></Image>
        </SubBrand>
      ))}
    </SubBrandListWrapper>
  )
}
