// @ts-nocheck

import { GPT_AD_NETWORK } from '../../../constants/ads'

/**
 * @param {Object} props - The component props.
 * @param {string} [props.className] - The class name for the component.
 * @return {JSX.Element} The rendered AMP GPT ad component.
 */
export default function AmpGptStickyAd() {
  return (
    <amp-sticky-ad layout="nodisplay">
      <amp-ad
        width="320"
        height="100"
        type="doubleclick"
        data-slot={`/${GPT_AD_NETWORK}/mirror_AMP_ros_320x100_ST`}
      />
    </amp-sticky-ad>
  )
}
