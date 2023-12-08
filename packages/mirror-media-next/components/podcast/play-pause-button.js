import { useState } from 'react'
import styled from 'styled-components'

const TogglePlayButton = styled.button`
  :focus {
    outline: 0;
  }
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  margin-top: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: transparent;
  border: none;
`

const PlayIcon = styled.span`
  position: absolute;
  width: 12px;
  height: 16px;
  border-top: 8px solid transparent;
  border-left: 12px solid #1d9fb8;
  border-bottom: 8px solid transparent;
`

const PauseIcon = styled.span`
  position: absolute;
  width: 12px;
  height: 16px;
  border-right: 4px solid #1d9fb8;
  border-left: 4px solid #1d9fb8;
`

const PlayPauseButton = ({ isPlaying, togglePlayPause }) => {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    togglePlayPause()
    setActive(!active)
  }

  return (
    <TogglePlayButton onClick={handleClick}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </TogglePlayButton>
  )
}

export default PlayPauseButton
