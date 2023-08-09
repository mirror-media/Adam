import useWindowDimensions from '../../../hooks/use-window-dimensions'
import Script from 'next/script'
import { DABLE_WIDGET_IDS } from '../../../constants/ads'
import { mediaSize } from '../../../styles/media'

/**
 *
 * @param {Object} props
 * @param {boolean} props.isDesktop - programmatically set for desktop or not
 * @returns
 */
export default function DableAd({ isDesktop }) {
  const { width } = useWindowDimensions()
  const isDesktopWidth = width >= mediaSize.xl

  if (isDesktopWidth !== isDesktop) {
    return <></>
  }

  return (
    <>
      <Script
        id="dable"
        dangerouslySetInnerHTML={{
          __html: `
            (function (d, a, b, l, e, _) {
              if (d[b] && d[b].q) return
              d[b] = function () {
                ;(d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
            dable('setService', 'mirrormedia.mg')
            dable('sendLogOnce')
            dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.MB}')
            dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.PC}')
          `,
        }}
      />
      <div
        id={`dablewidget_${
          isDesktopWidth ? DABLE_WIDGET_IDS.PC : DABLE_WIDGET_IDS.MB
        }`}
        data-widget_id={
          isDesktopWidth ? DABLE_WIDGET_IDS.PC : DABLE_WIDGET_IDS.MB
        }
      ></div>
    </>
  )
}
