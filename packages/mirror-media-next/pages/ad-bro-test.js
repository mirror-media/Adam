import Script from 'next/script'
import { useEffect } from 'react'
import useWindowDimensions from '../hooks/use-window-dimensions'
import { ENV } from '../config/index.mjs'

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

  let testAdJsx = null
  if (width) {
    testAdJsx = isMobile ? (
      <>
        <Script id="test-google-tag-ad">
          {`
          window.googletag = window.googletag || {cmd: []};
          googletag.cmd.push(function() {
            googletag.defineOutOfPageSlot('/40175602/test_mirror_m_ros_out_ADBRO', 'div-gpt-ad-1719287275291-0').addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
        `}
        </Script>
        {/* /40175602/test_mirror_m_ros_out_ADBRO */}
        <div id="div-gpt-ad-1719287275291-0">
          <script>
            {window.googletag.cmd.push(function () {
              window.googletag.display('div-gpt-ad-1719287275291-0')
            })}
          </script>
        </div>
      </>
    ) : (
      <>
        <Script id="test-google-tag-ad">
          {`
          window.googletag = window.googletag || {cmd: []};
          googletag.cmd.push(function() {
            googletag.defineOutOfPageSlot('/40175602/test_mirror_pc_ros_out_ADBRO', 'div-gpt-ad-1719287528685-0').addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
        `}
        </Script>
        {/* /40175602/test_mirror_pc_ros_out_ADBRO */}
        <div id="div-gpt-ad-1719287528685-0">
          <script>
            {window.googletag.cmd.push(function () {
              window.googletag.display('div-gpt-ad-1719287528685-0')
            })}
          </script>
        </div>
      </>
    )
  }

  return testAdJsx
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps() {
  console.log('getServerSideProps', ENV)
  if (ENV !== 'dev' && ENV !== 'local') {
    return { notFound: true }
  }
  return { props: {} }
}
