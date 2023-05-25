import styled from 'styled-components'
import NextImage from 'next/image'
import { useState } from 'react'

const ItemWrapper = styled.a`
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 214px;

  img {
    object-fit: cover;
    filter: unset;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    height: 147px;
  }
`

const ItemDetail = styled.div`
  margin: 20px 20px 36px 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 8px 8px 40px 8px;
  }
`

const ItemTitle = styled.div`
  color: #054f77;
  line-height: 25px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    height: 75px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 18px;
  }
`

const ItemBrief = styled.div`
  font-size: 16px;
  color: #979797;
  margin-top: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 16px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 20px;
    -webkit-line-clamp: 4;
  }
`

/**
 * @typedef {import('../../apollo/fragments/external').External} External
 */

/**
 * @param {Object} props
 * @param {External} props.item
 * @returns {React.ReactElement}
 */
export default function ExternalListItem({ item }) {
  const [itemImage, setItemImage] = useState(item.thumb)

  return (
    <ItemWrapper href={`/external/${item.slug}`} target="_blank">
      <ImageContainer>
        <NextImage
          src={itemImage}
          alt={item.title}
          fill={true}
          placeholder="blur"
          blurDataURL="/images/loading.gif"
          onError={() => {
            setItemImage('/images/default-og-img.png')
          }}
          sizes="100%"
        />
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemBrief>{item.brief}</ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
