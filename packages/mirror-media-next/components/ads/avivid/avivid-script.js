import Script from 'next/script'
import { useEffect } from 'react'

export default function AvividScript() {
  useEffect(() => {
    // 找出所有 script 標籤，並檢查 src 是否包含不安全的網址
    const scripts = document.querySelectorAll('script')
    scripts.forEach((script) => {
      if (script.src.includes('aws-sdk-AviviD-min-1')) {
        console.warn('Blocking unsafe script:', script.src)
        script.remove()
      }
    })
  }, [])

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
