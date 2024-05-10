import styled from 'styled-components'
import Link from 'next/link'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LinkWrapper = styled(Link)``

const Button = styled.button`
  display: inline-block;
  color: #1d9fb8;
  font-size: 15px;
  font-weight: 500;
  line-height: 21px;

  &:hover,
  &:active {
    border-bottom: 1px solid #1d9fb8;
  }
`

/**
 * @param {Object} props
 * @param {import('next/link').LinkProps['href']} props.href
 * @param {string} props.children
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function TextButton({ href, children, onClick }) {
  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  const handleOnClick = (e) => {
    if (typeof onClick !== 'function') return
    onClick(e)
  }

  return (
    <Wrapper>
      <LinkWrapper href={href}>
        <Button onClick={handleOnClick} type="button">
          {children}
        </Button>
      </LinkWrapper>
    </Wrapper>
  )
}
