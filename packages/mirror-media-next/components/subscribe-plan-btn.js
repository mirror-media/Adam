import styled from 'styled-components'
import Link from 'next/link'

const StyledSubscribeBtn = styled.button`
  :focus {
    outline: 0;
  }
  border-radius: 12px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 72px;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 6px;

  background: ${
    /**
     * @param {{bgColor: string}} param
     */
    ({ bgColor }) => bgColor
  };

  &:hover {
    background: ${({
      // @ts-ignore
      hoverColor,
    }) => hoverColor};

    .text,
    .title {
      color: ${({
        // @ts-ignore
        hoverText,
      }) => hoverText};
    }
  }

  transition: background 0.25s ease, color 0.25s ease;

  .title {
    color: #fff;
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
 * @param {string} props.subtitle
 * @param {string} props.bgColor
 * @param {string} props.hoverColor
 * @param {string} props.hoverText
 * @param {string} props.href
 * @return {JSX.Element}
 */
export default function SubscribePlanBtn({
  title,
  subtitle,
  bgColor,
  hoverColor,
  hoverText,
  href,
}) {
  return (
    <Link href={href}>
      <StyledSubscribeBtn
        bgColor={bgColor}
        // @ts-ignore
        hoverColor={hoverColor}
        hoverText={hoverText}
      >
        <p className="title">{title}</p>
        <p className="text">{subtitle}</p>
      </StyledSubscribeBtn>
    </Link>
  )
}
