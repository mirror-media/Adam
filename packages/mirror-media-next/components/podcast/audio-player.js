import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Z_INDEX } from '../../constants'

/**
 * Calculate the percentage value for a gradient based on the provided value and maximum value.
 * @param {object} options
 * @param {number} options.value
 * @param {number} options.max
 * @returns {string} The calculated percentage value as a string.
 */
const calculateGradientPercentage = ({ value, max }) => {
  /**
   * @type {number}
   */
  const percentage = (value / max) * 100

  return `${percentage}%`
}

const marquee = keyframes`
   0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`

const PlayerWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  cursor: default;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 116px;
  background: rgba(0, 0, 0, 0.87);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${Z_INDEX.header};

  ${({ theme }) => theme.breakpoint.md} {
    height: 88px;
  }
`

const MarqueeContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 278px;
  height: 52px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 557px;
    height: 44px;
  }
`

const MarqueeContent = styled.div`
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  margin-top: 14px;

  display: inline-block;
  white-space: nowrap;
  animation: ${marquee} 18s linear infinite;
  position: absolute;
  top: 0;
  left: 0;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 10px;
  }

  &:hover {
    animation-play-state: paused; /* Pause the animation on hover */
  }
`
const AudioPlayerContainer = styled.div`
  height: 52px;
  width: 278px;
  background-color: grey;

  color: #fff;

  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;

  ${({ theme }) => theme.breakpoint.md} {
    width: 557px;
  }
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SeekSlider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 200px;
  margin: 0 10px;
  cursor: pointer;

  overflow: hidden;
  display: block;
  appearance: none;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: linear-gradient(
      to right,
      #1d9fb8 ${calculateGradientPercentage},
      #d9d9d9 0
    );
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 2px;
    height: 4px;
    border-radius: 0 200px 200px 0;
    background-color: #1d9fb8;
  }
`

export default function AudioPlayer({ listeningPodcast }) {
  const audioURL = listeningPodcast.enclosures[0].url

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [duration, setDuration] = useState('0:00')
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0)
  const [formattedCurrentTime, setFormattedCurrentTime] = useState('0:00')

  useEffect(() => {
    const audio = audioRef.current

    const updateTime = () => {
      const currentSeconds = Math.floor(audio.currentTime)
      setCurrentTimeSeconds(currentSeconds)

      const minutes = Math.floor(currentSeconds / 60)
      const seconds = currentSeconds % 60
      setFormattedCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`)
    }

    const updateDuration = () => {
      const durationSeconds = Math.floor(audio.duration)
      const minutes = Math.floor(durationSeconds / 60)
      const seconds = durationSeconds % 60
      setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`)
    }

    // Reset the player states
    setCurrentTimeSeconds(0) // Reset current time
    setFormattedCurrentTime('0:00') // Reset formatted time
    setDuration('0:00') // Reset duration
    setSpeed(1) // Reset speed
    setIsPlaying(false) // reset is playing
    // Update the max attribute of SeekSlider to the new duration
    const seekSlider = document.querySelector('input[type="range"]')
    if (seekSlider) {
      seekSlider.setAttribute('max', String(updateDuration))
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [audioURL])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const updateSpeed = () => {
    const audio = audioRef.current
    if (speed === 1) {
      audio.playbackRate = 1.5
      setSpeed(1.5)
    } else if (speed === 1.5) {
      audio.playbackRate = 2
      setSpeed(2)
    } else {
      audio.playbackRate = 1
      setSpeed(1)
    }
  }

  const onSeek = (e) => {
    const audio = audioRef.current
    const newTime = parseInt(e.target.value, 10)
    audio.currentTime = newTime
    setCurrentTimeSeconds(newTime)
  }

  return (
    <PlayerWrapper>
      {listeningPodcast && (
        <>
          <MarqueeContainer>
            <MarqueeContent>{listeningPodcast.title}</MarqueeContent>
          </MarqueeContainer>

          <AudioPlayerContainer key={audioURL}>
            <audio ref={audioRef} src={audioURL}></audio>
            <Controls>
              <button onClick={togglePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <span>{formattedCurrentTime}</span> / <span>{duration}</span>
              <SeekSlider
                type="range"
                min="0"
                step="1"
                value={currentTimeSeconds}
                onChange={onSeek}
                max={audioRef.current && Math.floor(audioRef.current.duration)}
              />
              <button onClick={updateSpeed}>{speed}X</button>
            </Controls>
          </AudioPlayerContainer>
        </>
      )}
    </PlayerWrapper>
  )
}