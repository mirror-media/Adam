import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  overflow: hidden;
`

const Slot = styled.div`
  height: 135px;
  width: 322px;
  margin: 50px;
  z-index: 2;
  position: relative;
  display: flex;
  overflow: hidden;
  &:before {
    content: ''
    width: 90%
    height: 10px;
    background: red;
    position: absolute;
    top: 0;
    left: 0;
  }
`

const Reel = styled.div`
  width: 70px;
  height: 190px;
  margin-top: -40px;
  overflow: hidden;
  background-image: url('https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/slot2023/reel.jpg');
  background-size: cover;
  position: relative;
  margin-right: 20px;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      rgba(black, 0.4) 0%,
      transparent 30%,
      transparent 70%,
      rgba(black, 0.4) 100%
    );
    box-shadow: inset 0 0 6px 2px rgba(black, 0.3);
  }
`

/**

 * @returns {React.ReactElement}
 */
export default function Reels() {
  const reels = [0, 1, 2]

  return (
    <Container>
      <Slot className="slots">
        {reels.map((reel, index) => (
          <Reel key={index} className="reel"></Reel>
        ))}
      </Slot>
    </Container>
  )
}
