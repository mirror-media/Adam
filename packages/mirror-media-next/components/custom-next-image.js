import { useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  span > img {
    position: absolute;
    filter: none !important;
  }
`
/**
 * TODO: using `ref` to replacing image src at error fallback
 * `ref` property is added in next/image in nextjs 13.0.6
 * @param {Object} props
 * @param {String} props.src
 * @returns {JSX.Element}
 */
export default function CustomNextImage({ src }) {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <Wrapper>
      <Image
        src={imageSrc}
        alt="image"
        layout="fill"
        placeholder="blur"
        blurDataURL="/images/loading.gif"
        objectFit="cover"
        onError={() => setImageSrc('/images/default-og-img.png')}
      ></Image>
    </Wrapper>
  )
}
