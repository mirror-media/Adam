import useWindowDimensions from '../../../hooks/use-window-dimensions'
import Script from 'next/script'
import { mediaSize } from '../../../styles/media'

export default function AvividScript() {
  const { width } = useWindowDimensions()
  const isDesktopWidth = width >= mediaSize.xl

  if (!isDesktopWidth) {
    return <></>
  }
  return (
    <Script
      async
      strategy="lazyOnload"
      id="likrNotification"
      dangerouslySetInnerHTML={{
        __html: `window.AviviD = window.AviviD || {settings:{},status:{}}; AviviD.web_id = "mirrormedia"; AviviD.category_id = "20180905000003"; AviviD.tracking_platform = 'likr'; (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&timestamp='+new Date().getTime();f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-W9F4QDN'); (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&timestamp='+new Date().getTime();f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-MKB8VFG');`,
      }}
    />
  )
}
