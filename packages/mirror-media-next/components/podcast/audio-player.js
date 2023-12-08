import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Z_INDEX } from '../../constants'
import PlayPauseButton from './play-pause-button'

/**
 * Calculate the percentage value for a gradient based on the provided value and maximum value.
 * @param {object} options
 * @param {number} options.value
 * @param {number} options.max
 * @returns {string}
 */
const calculateGradientPercentage = ({ value, max }) => {
  /**
   * @type {number}
   */
  const percentage = (value / max) * 100

  return `${percentage}%`
}

const calculateVolumeGradientPercentage = (volume) => `${(volume / 100) * 100}%`

const marquee = keyframes`
   0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`

const PlayerWrapper = styled.div`
  padding-top: 4px;
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
  height: 44px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 557px;
    height: 36px;
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

const ErrorMessage = styled.div`
  color: #ff0f00;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: normal;
`

const AudioPlayerContainer = styled.div`
  height: 52px;
  width: 278px;
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

const SlidersWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 136px;

  ${({ theme }) => theme.breakpoint.md} {
    width: 420px;
  }
`

const SeekSlider = styled.input`
  max-width: 100%;
  width: 100%;
  height: 4px;
  border-radius: 200px;
  margin: 0 0 0 12px;
  cursor: pointer;
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

  :hover&::-webkit-slider-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #1d9fb8;
    margin-top: -3px;
    transition: all 0.15s ease-in-out;
  }
`

const SpeedButton = styled.button`
  cursor: pointer;
  :focus {
    outline: 0;
  }
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
`

const VolumeControlContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  border-radius: 22px;
  padding: 8px 0px;
  margin-left: 12px;
  ${
    /**
     * @param {Object} param
     * @param {boolean} param.showVolumeSlider
     */ ({ showVolumeSlider }) =>
      showVolumeSlider && `background-color: #767676; padding: 8px 12px;`
  }
  transition: background-color 0.3s ease;

  display: none;

  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
  }
`
const VolumeMutedButtonsContainer = styled.button`
  :focus {
    outline: 0;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 22px;
  height: 22px;
`

const VolumeSliderContainer = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`

const VolumeSlider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 200px;
  cursor: pointer;
  appearance: none;
  /* Track */
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: linear-gradient(
      to right,
      #fff ${(props) => calculateVolumeGradientPercentage(props.value)},
      #000 0
    );
    border-radius: 200px;
  }

  /* Thumb */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -4px;
  }
`

export default function AudioPlayer({ listeningPodcast }) {
  const audioURL = listeningPodcast.enclosures[0].url

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [duration, setDuration] = useState('0:00')
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0)
  const [formattedCurrentTime, setFormattedCurrentTime] = useState('0:00')

  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [volume, setVolume] = useState(100)
  const [audioLoadError, setAudioLoadError] = useState(false)

  useEffect(() => {
    const audio = audioRef.current

    const handleAudioError = () => {
      setAudioLoadError(true)
    }

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
    setCurrentTimeSeconds(0)
    setFormattedCurrentTime('0:00')
    setDuration('0:00')
    setSpeed(1)
    setIsPlaying(true)
    setShowVolumeSlider(false)
    // Update the max attribute of SeekSlider to the new duration
    const seekSlider = document.querySelector('input[type="range"]')
    if (seekSlider) {
      seekSlider.setAttribute('max', String(updateDuration))
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('error', handleAudioError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('error', handleAudioError)
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

  // Control the volume of the audio
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value
    const audio = audioRef.current
    audio.volume = newVolume / 100
    setVolume(newVolume)
    setIsMuted(newVolume === '0')

    // Update the icon based on the volume level
    if (newVolume === '0') {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider)
  }

  return (
    <PlayerWrapper>
      {listeningPodcast && (
        <>
          {audioLoadError ? (
            <ErrorMessage>
              這集節目暫時無法播放，請重新整理頁面或檢查您的網路環境
            </ErrorMessage>
          ) : (
            <MarqueeContainer>
              <MarqueeContent>{listeningPodcast.title}</MarqueeContent>
            </MarqueeContainer>
          )}

          <AudioPlayerContainer key={audioURL}>
            <audio ref={audioRef} src={audioURL} autoPlay></audio>
            <Controls>
              <PlayPauseButton
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
              />
              <span>{formattedCurrentTime}</span>&nbsp;/&nbsp;
              <span>{duration}</span>
              <SlidersWrapper>
                <SeekSlider
                  type="range"
                  min="0"
                  step="1"
                  value={currentTimeSeconds}
                  onChange={onSeek}
                  max={
                    audioRef.current && Math.floor(audioRef.current.duration)
                  }
                />
                <VolumeControlContainer showVolumeSlider={showVolumeSlider}>
                  <VolumeMutedButtonsContainer onClick={toggleVolumeSlider}>
                    {/* Use isMuted state to toggle between volume and muted icons */}
                    {isMuted ? (
                      <Image
                        width={17}
                        height={17}
                        src="/images-next/muted.svg"
                        alt="Muted"
                      />
                    ) : (
                      <Image
                        width={22}
                        height={22}
                        src="/images-next/volume.svg"
                        alt="Volume"
                      />
                    )}
                  </VolumeMutedButtonsContainer>

                  {showVolumeSlider && (
                    <VolumeSliderContainer>
                      <VolumeSlider
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={handleVolumeChange}
                      />
                    </VolumeSliderContainer>
                  )}
                </VolumeControlContainer>
              </SlidersWrapper>
              <SpeedButton onClick={updateSpeed}>{speed}X</SpeedButton>
            </Controls>
          </AudioPlayerContainer>
        </>
      )}
    </PlayerWrapper>
  )
}
