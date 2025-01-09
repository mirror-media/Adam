//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import styled from 'styled-components'
import Image from 'next/image'
import useSharedUrl from '../../../hooks/use-shared-url'
import useClipboard from '../../../hooks/use-clipboard'

const ClickButton = styled.button`
  &:focus {
    outline: none;
  }
`

/**
 * @param {Object} props
 * @param {number} [props.width] - width of the button
 * @param {number} [props.height] - height of the button
 * @returns {React.ReactNode}
 */
export default function ButtonCopyLink({ width = 35, height = 35 }) {
  const sharedUrl = useSharedUrl()
  const { write, getPopup } = useClipboard()
  const handleCopyLink = () => write(sharedUrl)
  const popupJsx = getPopup('已複製連結')

  return (
    <>
      {popupJsx}
      <ClickButton
        onClick={handleCopyLink}
        aria-label="link-share-icon"
        // @ts-ignore
        on="tap:clipboard-example.copy"
      >
        <Image
          src={'/images-next/link-logo.svg'}
          width={width}
          height={height}
          className="GTM-share-link"
          alt="copy link button"
        ></Image>
      </ClickButton>

      <input
        aria-label="link-share-icon"
        id="clipboard-example"
        type="text"
        value={sharedUrl}
        readOnly
        style={{ position: 'absolute', left: '-9999px' }}
      />
    </>
  )
}
