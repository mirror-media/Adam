import { useState } from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

import { Z_INDEX } from '../../constants/index'
import CloseIcon from '../../public/images-next/close.svg'
import PromoteTopicItem from './promote-topic-item'

const CARD_WIDTH = 124

const Wrapper = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  z-index: ${Z_INDEX.promoteTopic};
  transform: translateY(-50%);
  width: ${CARD_WIDTH}px;

  .swiper {
    position: relative;
    z-index: 1;
    overflow: hidden;
    border-radius: 10px;
    background-color: #054f77;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
  }

  .swiper-pagination {
    position: absolute;
    z-index: 2;
    bottom: 10px !important;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 0;
  }

  .swiper-pagination-bullet {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #d9d9d9;
    cursor: pointer;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: #0000004d;
    cursor: default;
  }
`

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  z-index: ${Z_INDEX.promoteTopic + 1};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  background-color: #61b8c6;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  svg {
    width: 24px;
    height: 24px;
  }
`

/**
 * @typedef {import('./promote-topic-item').PromoteTopicData} PromoteTopicData
 */

/**
 * @param {Object} props
 * @param {PromoteTopicData[]} props.list
 * @returns {React.ReactElement | null}
 */
export default function PromoteTopicSwiper({ list }) {
  const [shouldShow, setShouldShow] = useState(true)

  if (!shouldShow || !list.length) return null

  const shouldLoop = list.length > 1

  return (
    <Wrapper>
      <CloseButton
        type="button"
        aria-label="關閉推薦專題"
        onClick={() => setShouldShow(false)}
      >
        <CloseIcon />
      </CloseButton>
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={
          shouldLoop
            ? {
                clickable: true,
              }
            : false
        }
        slidesPerView={1}
        resistanceRatio={0}
        autoplay={
          shouldLoop
            ? {
                delay: 10000,
                disableOnInteraction: false,
              }
            : false
        }
        rewind={shouldLoop}
      >
        {list.map((topic) => (
          <SwiperSlide key={topic.id}>
            <PromoteTopicItem topic={topic} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  )
}
