import styled from 'styled-components'

/**
 * @param {Object} props
 * @param {string} props.imageUrl
 */
const getImageUrl = (props) => props.imageUrl

const HeroImage = styled.div`
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.05) 50%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    url(${getImageUrl});

  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;

  background-attachment: ${() => (!isIOS() ? 'fixed' : 'initial')};
`

const TitleBox = styled.div`
  width: 80%;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 120px;
  font-family: var(--notosansTC-font);

  margin-top: 52px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 70px;
  }

  .title {
    color: #ffffff;
    font-weight: 900;
    font-size: 20px;
    line-height: 150%;
    text-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);

    ${({ theme }) => theme.breakpoint.md} {
      font-size: 40px;
    }
  }

  .title-wrapper {
    margin: auto;
    width: 100%;
    ${({ theme }) => theme.breakpoint.md} {
      width: 85%;
    }
  }

  .hero-caption {
    font-weight: 700;
    font-size: 10px;
    line-height: 18px;
    color: #f0dddd;
    text-shadow: 0px 3px 3px rgba(0, 0, 0, 0.8);
    background: rgba(0, 0, 0, 0.4);
    width: fit-content;
    text-align: center;
    padding: 2px;
    margin: auto;
    margin-top: 20px;

    ${({ theme }) => theme.breakpoint.md} {
      font-size: 12px;
      margin-top: 29px;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      margin-top: 32px;
      line-height: 21px;
      font-size: 14px;
    }
  }

  .brief {
    padding-top: 16px;
  }
`

const BriefWrapper = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 500;
    font-size: 16px;
    margin-top: 29px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 32px;
  }
`

const isIOS = () => {
  // @ts-ignore
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

/**
 * @typedef {import('../../../apollo/fragments/post').HeroImage } HeroImage
 */

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.heroCaption
 * @param {Array<{ key: string, text: string }>} props.brief
 * @param {HeroImage | null} props.heroImage
 * @returns {JSX.Element}
 */

export default function HeroSection({
  title = '',
  heroCaption = '',
  brief = [],
  heroImage = null,
}) {
  return (
    <HeroImage
      imageUrl={
        heroImage?.resized?.original ||
        heroImage?.resized?.w2400 ||
        heroImage?.resized?.w1600 ||
        heroImage?.resized?.w1200 ||
        heroImage?.resized?.w800 ||
        heroImage?.resized?.w480 ||
        '/images/default-og-img.png'
      }
    >
      <TitleBox>
        <div className="title-wrapper">
          <h1 className="title">{title}</h1>
          {heroCaption && <p className="hero-caption">{heroCaption}</p>}
        </div>
        <BriefWrapper>
          {brief.map((p) => (
            <p className="brief" key={p.key}>
              {p.text}
            </p>
          ))}
        </BriefWrapper>
      </TitleBox>
    </HeroImage>
  )
}
