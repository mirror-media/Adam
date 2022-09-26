import styled from 'styled-components'

const SubBrandListWrapper = styled.ul`
  display: flex;
  align-content: center;
  justify-content: center;
  position: relative;
`
const SubBrand = styled.a`
  padding-left: 10px;
  padding-right: 10px;
  flex: 0 0 auto;
  cursor: pointer;
`
const SubBrandIcon = styled.img`
  height: 30px;
  width: auto;
`

export default function SubBrandList({ subBrands = [] }) {
  return (
    <SubBrandListWrapper>
      {subBrands.map(({ name, title, href }) => (
        <SubBrand
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferer"
        >
          <SubBrandIcon src={`/images/${name}.png`} alt={title}></SubBrandIcon>
        </SubBrand>
      ))}
    </SubBrandListWrapper>
  )
}
