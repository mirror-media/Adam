import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { Z_INDEX } from '../../constants/index'

const Hyperlink = styled(Link)`
  display: block;

  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`
const ImageWrapper = styled.div`
  padding: 16px;
  position: fixed;
  bottom: 25%;
  right: 0;
  z-index: ${Z_INDEX.articleRightArrow};
`

const rightArrow = '/images-next/right-arrow.svg'

/**
 * @typedef {Pick<import('../../apollo/fragments/post').HeroImage ,'id' | 'resized' | 'resizedWebp'>} HeroImage
 */

/**
 * @typedef {(import('../../apollo/fragments/post').Related & {
 *  id: string, slug: string, title: string, heroImage: HeroImage, url: string, __typename: string})[]
 * } Relateds
 */

/**
 *
 * @param {Object} props
 * @param {Relateds} [props.relateds]
 * @returns {import('react').JSX.Element}
 */
export default function ArticleRightArrow({ relateds = [] }) {
  return (
    <Hyperlink
      href={
        relateds[0].url ||
        `${relateds[0].__typename === 'Post' ? '/story' : '/external'}/${
          relateds[0].slug
        }`
      }
      target="_blank"
    >
      <ImageWrapper>
        <Image
          src={rightArrow}
          width={24}
          height={24}
          alt="點按看下一則延伸閱讀文章"
        />
      </ImageWrapper>
    </Hyperlink>
  )
}
