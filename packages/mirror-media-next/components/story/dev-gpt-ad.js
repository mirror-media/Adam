import Script from 'next/script'
import { useEffect } from 'react'
import useWindowDimensions from '../../hooks/use-window-dimensions'

export default function DevGptAd() {
  const { width } = useWindowDimensions()
  const isMobile = width < 1200
  useEffect(() => {
    if (width) {
      if (window.googletag) {
        const divId = isMobile
          ? 'div-gpt-ad-1710755205915-0'
          : 'div-gpt-ad-1710755093650-0'
        window.googletag.cmd.push(function () {
          window.googletag.display(divId)
        })
      }
    }
  }, [width, isMobile])

  return (
    <>
      <Script id="test-google-tag-ad">
        {`
            window.googletag = window.googletag || {cmd: []};
            const slotId = window.innerWidth < 1200 ? 'test_mirror_m_ros_out_ADBRO' : 'test_mirror_pc_ros_out_ADBRO';
            const divId = window.innerWidth < 1200 ?   'div-gpt-ad-1710755205915-0' : 'div-gpt-ad-1710755093650-0';
            console.log(slotId, divId)
            googletag.cmd.push(function() {
              googletag.defineOutOfPageSlot('/40175602/' + slotId, divId).addService(googletag.pubads());
              googletag.pubads().enableSingleRequest();
              googletag.enableServices();
            });
          `}
      </Script>
      <div
        id={
          isMobile ? 'div-gpt-ad-1710755205915-0' : 'div-gpt-ad-1710755093650-0'
        }
      />
    </>
  )
}
