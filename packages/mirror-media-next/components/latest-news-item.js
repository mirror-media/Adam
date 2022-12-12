import styled from 'styled-components'
import Image from 'next/image'
import DefaultOgImg from '../public/images/default-og-img.png'
const ItemWrapper = styled.article`
  display: flex;
  width: 288px;
  margin: 0 auto;
  padding: 15px 0;
  border-bottom: 1px solid #b8b8b8;
  ${({ theme }) => theme.breakpoint.md} {
    position: relative;
    margin: 0;
    width: 244px;
    padding: 0;
    bottom: unset;
  }
`
const ImageContainer = styled.div`
  position: relative;
  height: 134px;
  width: 134px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 244px;
    height: 244px;
  }
`
const Detail = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    position: absolute;
    bottom: 0;
    z-index: 1;
    padding-left: 0;
  }
`
//TODO: set Label background color according to section color

const Label = styled.div`
  width: 56px;
  height: 36px;
  padding: 8px 10px;
  text-align: center;
  background-color: #1d9fb8;
  color: white;
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 300;
  }
`
const Title = styled.div`
  text-align: left;
  width: 134px;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.66);
  h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 244px;
    font-size: 16px;
    line-height: 27px;
    font-weight: 300;
    color: white;
    background-color: rgba(5, 79, 119, 0.8);
    padding: 10px;
    h3 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
`
/**
 *
 * @returns {React.ReactElement}
 */
export default function LatestNewsItem() {
  return (
    <ItemWrapper>
      <ImageContainer>
        <Image
          src={DefaultOgImg}
          alt="image"
          layout="fill"
          objectFit="cover"
        ></Image>
      </ImageContainer>
      <Detail>
        <Label>時事</Label>
        <Title>
          <h3>
            這是一個很長很長很長很長很長很長很長很長很長很長很長很長的標題
          </h3>
        </Title>
      </Detail>
    </ItemWrapper>
  )
}
