import styled from 'styled-components'

const NavWrapper = styled.section`
  position: absolute;
  top: 0;
  left: calc((100vw - 100%) / 2 * -1);
  width: calc((100vw - 100%) / 2);
  height: 100%;
`
const NavItem = styled.li`
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  cursor: pointer;
  ${
    /**
     * @param {{headerType: 'header-two' | 'header-three'}} param
     */
    ({ headerType }) => {
      switch (headerType) {
        case 'header-two':
          return `  
        font-size: 18px;
        line-height: 1.5;
        `
        case 'header-three':
          return `
        font-size: 14px;
        line-height: 2;
        `
        default:
          return `  
        font-size: 18px;
        line-height: 1.5;
        `
      }
    }
  }
`
const Nav = styled.nav`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    position: sticky;
    top: 15%;

    margin: 20px auto;
    width: 168px;
    height: auto;
  }
`
/**
 * TODO: add feature for scroll into certain subtitle
 * @returns {JSX.Element}
 */
export default function NavSubtitleNavigator({ h2AndH3Block = [] }) {
  const handleOnClick = (key) => {
    const target = document.querySelector(`[data-offset-key*="${key}"]`)
    if (!target) {
      return
    }
    target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <NavWrapper>
      {h2AndH3Block.length ? (
        <Nav>
          <ul>
            {h2AndH3Block.map((item) => (
              <NavItem
                headerType={item.type}
                key={item.key}
                onClick={() => handleOnClick(item.key)}
              >
                {/* {item.text} */}
                <a href={`#header-${item.key}`}>{item.text}</a>
              </NavItem>
            ))}
          </ul>
        </Nav>
      ) : null}
    </NavWrapper>
  )
}
