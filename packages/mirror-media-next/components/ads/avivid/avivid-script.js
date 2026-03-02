import Script from 'next/script'
import { useEffect } from 'react'

// Delay AviviD visibility until its injected content has a stable size to reduce CLS from third-party DOM insertion.
const AVIVID_READY_ATTRIBUTE = 'data-mm-avivid-ready'
const AVIVID_TARGET_CLASS = 'avivid_onpage_mobile_bottom'
const AVIVID_CONTENT_CLASS = 'avivid_onpage_content_wrapper'

export default function AvividScript() {
  useEffect(() => {
    // 找出所有 script 標籤，並檢查 src 是否包含不安全的網址
    // Remove the known unsafe AviviD script if it was injected.
    const scripts = document.querySelectorAll('script')
    scripts.forEach((script) => {
      if (script.src.includes('aws-sdk-AviviD-min-1')) {
        console.warn('Blocking unsafe script:', script.src)
        script.remove()
      }
    })

    const nodeObservers = new WeakMap()
    const activeObservers = new Set()

    const isAvividContentReady = (node) => {
      const content = node.querySelector(`.${AVIVID_CONTENT_CLASS}`)
      if (!content) return false

      const { height, width } = content.getBoundingClientRect()
      return height > 0 && width > 0
    }

    const markAvividReady = (node) => {
      if (node.getAttribute(AVIVID_READY_ATTRIBUTE) === 'true') {
        return
      }

      node.setAttribute(AVIVID_READY_ATTRIBUTE, 'true')

      const observer = nodeObservers.get(node)
      if (observer) {
        observer.disconnect()
        activeObservers.delete(observer)
        nodeObservers.delete(node)
      }
    }

    const observeAvividNode = (node) => {
      if (!(node instanceof HTMLElement)) return
      if (!node.classList.contains(AVIVID_TARGET_CLASS)) return
      if (nodeObservers.has(node)) return

      // Reveal the banner only after the inner content has measurable dimensions.
      if (isAvividContentReady(node)) {
        markAvividReady(node)
        return
      }

      // Watch third-party mutations because AviviD builds the banner incrementally after GTM executes.
      const innerObserver = new MutationObserver(() => {
        if (isAvividContentReady(node)) {
          markAvividReady(node)
        }
      })

      innerObserver.observe(node, {
        childList: true,
        subtree: true,
        attributes: true,
      })
      nodeObservers.set(node, innerObserver)
      activeObservers.add(innerObserver)
    }

    // Catch banners that may already exist before the observer starts.
    document
      .querySelectorAll(`.${AVIVID_TARGET_CLASS}`)
      .forEach((node) => observeAvividNode(node))

    const rootObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          if (!(addedNode instanceof HTMLElement)) return

          observeAvividNode(addedNode)
          addedNode
            .querySelectorAll(`.${AVIVID_TARGET_CLASS}`)
            .forEach((node) => observeAvividNode(node))
        })
      })
    })

    rootObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      rootObserver.disconnect()
      activeObservers.forEach((observer) => observer.disconnect())
    }
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
