import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ELECTION_2024 } from '../config/index.mjs'
const Wrapper = styled.div`
  position: relative;
  padding-top: 20px;
  iframe {
    background-color: #f5f5f5;
    height: 600px;
    width: 100%;
  }
`

//  {/* <iframe src="https://dev.mirrormedia.mg/projects/dev-election2024-homepage-0110-7/index.html"></iframe> */}
export default function Election2024Homepage({ className = '' }) {
  const [shouldShowIframe, setShouldShowIframe] = useState(false)
  useEffect(() => {
    const currentTimeStamp = new Date().getTime()
    const targetTimestamp = new Date('2024-01-13T08:00:00Z').getTime()
    if (currentTimeStamp >= targetTimestamp) {
      setShouldShowIframe(true)
    }
  }, [])

  return (
    <>
      <Wrapper className={className}>
        {shouldShowIframe ? (
          <iframe src={ELECTION_2024.url}></iframe>
        ) : (
          <Image
            style={{ margin: '0 auto' }}
            height={250}
            width={970}
            src="/images-next/election2024_weekly_970x250.jpg"
            alt="2024年總統大選將於2024/1/13 16:00開始開票"
            priority={true}
          ></Image>
        )}
      </Wrapper>
      {ELECTION_2024.shouldShowToggleButton && (
        <button
          onClick={() => {
            setShouldShowIframe((pre) => !pre)
          }}
        >
          測試切換
        </button>
      )}
    </>
  )
}
