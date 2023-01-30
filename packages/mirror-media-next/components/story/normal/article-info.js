import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import ButtonCopyLink from '../button-copy-link'
/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const Date = styled.div`
  width: fit-content;
  height: auto;
  font-size: 14px;
  line-height: 1.5;
  color: #a1a1a1;
  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const Credits = styled.div`
  font-size: 16px;
  line-height: 1.5;

  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 20px;
  }
`

const CreditTitle = styled.span`
  color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  ${({ theme }) => theme.breakpoint.md} {
    color: rgba(52, 73, 94, 1);
  }
`

const CreditList = styled.span`
  display: flex;
  gap: 0px 6px;
  flex-wrap: wrap;
  .link {
    color: ${
      /** @param {{theme:Theme}} param */
      ({ theme }) => theme.color.brandColor.darkBlue
    };
  }

  .no-link {
    color: rgba(52, 73, 94, 1);
  }
`

const Tag = styled.a`
  font-size: 14px;
  line-height: 20px;
  padding: 4px 8px;
  border-radius: 2px;
  background-color: ${
    /**
     * @param {{theme:Theme}} param
     */
    ({ theme }) => theme.color.brandColor.darkBlue
  };
  color: white;
  font-weight: 400;
`
const Tags = styled.div`
  display: flex;
  gap: 12px 8px;
  flex-wrap: wrap;
`

const SocialMedia = styled.div`
  display: flex;
  gap: 10px;
  padding: 0;
  position: relative;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 20px;
    &::before,
    &::after {
      position: absolute;
      content: '';
      background-color: #a1a1a1;
      width: 1px;
      height: 16px;
      transform: translateY(-50%);
      top: 50%;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
`

const DonateLink = styled.a`
  background-color: black;
  width: 100px;
  height: 32px;
  padding: 9px 12px 9px 13.33px;
  display: flex;
  gap: 5.33px;
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  border-radius: 32px;
  color: white;
  img {
    width: 13.33px;
    height: 13.33px;
  }
`

const SocialMediaAndDonateLink = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
  }
  .link-to-index {
    display: none;
    ${({ theme }) => theme.breakpoint.md} {
      display: block;
    }
  }
`

const ArticleInfoContainer = styled.div`
  border-left: 2px ${({ theme }) => theme.color.brandColor.darkBlue} solid;
  padding-left: 24px;
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    border: none;
    padding-left: 0px;
    margin: 0 0 16px;
    gap: 12px;

    ${Date} {
      display: none;
    }
  }
`
const CREDIT_TITLE_NAME_MAP = {
  writers: '文',
  photographers: '攝影',
  camera_man: '影音',
  designers: '設計',
  engineers: '工程',
  vocals: '主播',
  extend_byline: '特約記者',
}

/**
 * @typedef {import('../../../type/post.typedef').Contact} Contact
 */

/**
 * @typedef {Object} Credit
 * @property {Contact[]} [writers]
 * @property {Contact[]} [photographers]
 * @property {Contact[]} [camera_man]
 * @property {Contact[]} [designers]
 * @property {Contact[]} [engineers]
 * @property {Contact[]} [vocals]
 * @property {string} [extend_byline]
 */

/**
 * @param {Object} props
 * @param {string} props.updatedDate
 * @param {string} props.publishedDate
 * @param {Credit[]} props.credits
 * @param {import('../../../type/post.typedef').Tag[]} props.tags
 * @returns {JSX.Element}
 */
export default function ArticleInfo({
  updatedDate,
  publishedDate,
  credits,
  tags,
}) {
  const creditsJsx = (
    <Credits>
      {credits.map((credit, index) => {
        const title = Object.keys(credit)
        const titleName = CREDIT_TITLE_NAME_MAP[title]
        const [people] = Object.values(credit)
        if (
          !titleName ||
          people.length === 0 ||
          (typeof people === 'string' && !people.trim())
        ) {
          return null
        }
        return (
          <CreditList key={index}>
            <CreditTitle>{titleName} | </CreditTitle>
            {Array.isArray(people) ? (
              people.map((person) => (
                <Link
                  target="_blank"
                  rel="noreferrer noopenner"
                  href={`/author/${person.id}`}
                  key={person.id}
                  className="link"
                >
                  {person.name}
                </Link>
              ))
            ) : (
              <p className="no-link">{people}</p>
            )}
          </CreditList>
        )
      })}
    </Credits>
  )

  const tagsJsx = (
    <Tags>
      {tags.map((tag) => (
        <Tag key={tag.id} href={`/tag/${tag.slug}`} target="_blank">
          {tag.name}
        </Tag>
      ))}
    </Tags>
  )
  return (
    <ArticleInfoContainer>
      <div>
        <Date>發布時間：{publishedDate}</Date>
        <Date>更新時間：{updatedDate}</Date>
      </div>

      {creditsJsx}
      {tagsJsx}
      <SocialMediaAndDonateLink>
        <Link className="link-to-index" href="/">
          <Image
            width={35}
            height={35}
            alt="go-to-index-page"
            src="/images/logo-circle@2x.png"
          ></Image>
        </Link>
        <SocialMedia>
          <Link href="/" target="_blank">
            <Image
              src={'/images/fb-logo.svg'}
              width={35}
              height={35}
              alt="facebook-share"
            ></Image>
          </Link>
          <Link href="/" target="_blank">
            <Image
              src={'/images/line-logo.svg'}
              width={35}
              height={35}
              alt="line-share"
            ></Image>
          </Link>
          <ButtonCopyLink />
        </SocialMedia>
        <DonateLink href="https://www.mirrormedia.mg/" target="_blank">
          <Image
            src={'/images/donate.png'}
            width={13.33}
            height={13.33}
            alt="donate"
          ></Image>

          <span>贊助本文</span>
        </DonateLink>
      </SocialMediaAndDonateLink>
    </ArticleInfoContainer>
  )
}
