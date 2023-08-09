/* eslint-disable @next/next/no-img-element */
import styled from 'styled-components'

const SlideContainer = styled.div`
  width: 100%;
  height: 100vh;
  object-fit: cover;

  text-align: center;
  font-size: 18px;
  color: #000;

  /* Center slide content vertically */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  padding-top: 52px;

  ${({ theme }) => theme.breakpoint.md} {
    padding-top: 74px;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    justify-content: center;
    padding-top: 0px;
  }
`
const CaptionBoxPC = styled.div`
  display: none;
  position: relative;
  position: absolute;
  bottom: 130px;
  left: 67px;

  cursor: pointer;

  ${({ theme }) => theme.breakpoint.lg} {
    display: flex;
  }
`
const CaptionPC = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #ffffff;
  width: 682px;
  height: auto;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.6);
  border: 0.5px solid #ffffff;
  pointer-events: none;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  ${
    /**
     * @param {Object} props
     * @param {boolean} props.transparent
     */ ({ transparent }) =>
      transparent
        ? `
      border: transparent;
      background: transparent;
      color: transparent;
    `
        : ''
  }
`
const ShowCaptionIcon = styled.div`
  height: auto;
  width: 4px;
  background-color: #ffffff;

  &::before {
    content: '';
    position: absolute;
    top: calc(50% - 12px);
    left: -24px;
    width: 24px;
    height: 24px;
    background-image: url(/images/caption-icon.svg);
  }
`

const CaptionMB = styled.div`
  padding: 20px;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: justify;

  color: #ffffff;

  ${({ theme }) => theme.breakpoint.lg} {
    display: none;
  }
`
/**
 * @typedef {import('../../../type/draft-js').EntityMap } EntityMap
 */

/**
 *
 * @param {Object} props
 * @param {boolean} props.isTransparent
 * @param {EntityMap} props.photoData
 * @param {()=>void} props.handleCaptionClick
 * @returns {JSX.Element}
 */
const Slide = ({ photoData, isTransparent, handleCaptionClick }) => {
  return (
    <SlideContainer>
      <img
        src={
          photoData?.data.resized?.original ||
          photoData?.data.resized?.w2400 ||
          photoData?.data.resized?.w1600 ||
          photoData?.data.resized?.w1200 ||
          photoData?.data.resized?.w800 ||
          photoData?.data.resized?.w480 ||
          '/images/default-og-img.png'
        }
        alt={photoData.data.desc}
      />
      <CaptionBoxPC onClick={handleCaptionClick}>
        <ShowCaptionIcon />
        <CaptionPC transparent={isTransparent}>
          {photoData?.data?.desc}
        </CaptionPC>
      </CaptionBoxPC>
      <CaptionMB>{photoData?.data?.desc}</CaptionMB>
    </SlideContainer>
  )
}

export default Slide
