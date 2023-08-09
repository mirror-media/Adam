import styled from 'styled-components'
import { GPT_AD_NETWORK } from '../../../constants/ads'

const Wrapper = styled.div`
  /**
 * 廣告有時會替換掉原本 <Ad> 元件裡頭的根元素 <div>
 * 因此不限定所指定的元素類型（*）
 * 以確保能選擇到 Wrapper 的直接子元素
 */
  & > * {
    display: block;
    margin-left: auto;
    margin-right: auto;
    iframe {
      display: block;
    }
  }
`
/**
 * @param {Object} props - The component props.
 * @param {string} [props.className] - The class name for the component.
 * @param {string} props.section - The section for the ad.
 * @param {string} props.position - The position of the ad within the section.
 * @return {JSX.Element} The rendered AMP GPT ad component.
 */
export default function AmpGptAd({ className, section, position }) {
  return (
    <Wrapper className={className}>
      {/* @ts-ignore */}
      <amp-ad
        width="300"
        height="250"
        type="doubleclick"
        data-slot={`/${GPT_AD_NETWORK}/mirror_AMP_${section}_300x250_${position}`}
        data-multi-size="336x280,300x250"
        data-multi-size-validation="false"
      />
    </Wrapper>
  )
}
