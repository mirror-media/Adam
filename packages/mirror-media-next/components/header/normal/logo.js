import React from 'react'
import Image from 'next/legacy/image'

/**
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {React.ReactElement}
 */
export default function LogoLink({ className }) {
  return (
    <div className={className}>
      <Image
        src="/images-next/mirror-media-logo.svg"
        alt="mirrormedia"
        layout="responsive"
        width={107}
        height={45}
        loading="eager"
      ></Image>
    </div>
  )
}
