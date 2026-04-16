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

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    box-shadow: 0 2.47px 2.47px rgba(0, 0, 0, 0.25);
    pointer-events: none;
    z-index: 0;
  }

  .promote-topic-swiper {
    position: relative;
    z-index: 1;
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
  gap: 16px;
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
        className="promote-topic-swiper"
        modules={[Autoplay, Pagination]}
        pagination={
          shouldLoop
            ? {
                clickable: true,
                bulletClass: 'promote-topic-swiper-bullet',
                bulletActiveClass: 'promote-topic-swiper-bullet-active',
              }
            : false
        }
        slidesPerView={1}
        resistanceRatio={0}
        autoplay={
          shouldLoop
            ? {
                delay: 30000,
                disableOnInteraction: false,
              }
            : false
        }
        rewind={shouldLoop}
      >
        {list.map((topic) => (
          <SwiperSlide key={topic.id || topic.slug}>
            <PromoteTopicItem topic={topic} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  )
}
