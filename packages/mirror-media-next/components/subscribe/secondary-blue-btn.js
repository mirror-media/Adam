import styled from 'styled-components'
import Link from 'next/link'

const StyledBtn = styled.button`
  :focus {
    outline: 0;
  }
  border-radius: 12px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: 1px solid #054f77;

  background: #fff;

  &:hover {
    background: linear-gradient(
        0deg,
        rgba(5, 79, 119, 0.05) 0%,
        rgba(5, 79, 119, 0.05) 100%
      ),
      #fff;

    .text,
    .title {
      color: #054f77;
    }
  }

  transition: background 0.25s ease, color 0.25s ease;

  .title {
    color: #054f77;
    font-size: 18px;
    font-weight: 500;
  }

  .text {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
    opacity: 0.66;
  }
`
/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.href
 * @param {string} [props.className]
 * @return {JSX.Element}
 */
export default function SecondaryBlueBtn({ title, href, className = '' }) {
  return (
    <Link href={href}>
      <StyledBtn className={className}>
        <p className="title">{title}</p>
      </StyledBtn>
    </Link>
  )
}
