'use client'

import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import React from 'react'

const EmbedContainer = styled.div`
  .youtube-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
  }
  .youtube {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`

function decodeHtmlEntities(text) {
  // This function should only run on the client.
  if (typeof document === 'undefined') {
    return text
  }
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

function addYoutubeClassToIframe(html) {
  // 支援 <iframe ...></iframe> 及 <iframe ... />
  return html.replace(
    /<iframe([^>]+src=["'][^"']*(youtube\.com|youtu\.be)[^"']*["'][^>]*)(?:><\/iframe>|\s*\/?>)/gi,
    (match, p1) => {
      let iframeTag
      if (/class=/.test(p1)) {
        iframeTag = `<iframe${p1.replace(
          /class=(["'])(.*?)\1/,
          'class=$1$2 youtube$1'
        )}></iframe>`
      } else {
        iframeTag = `<iframe${p1} class="youtube"></iframe>`
      }
      return `<div class="youtube-wrapper">${iframeTag}</div>`
    }
  )
}

/**
 * A generic component to render embed code. It correctly handles and executes
 * any <script> tags within the provided code, preserving their original position.
 * It also handles a special case where HTML is encoded inside an iframe's src attribute.
 *
 * @param {Object} props
 * @param {string} props.embedCode - The embed code string, which can be any valid HTML.
 * @returns {React.ReactElement}
 */
export default function ExternalEmbedCodeBlock({ embedCode = '' }) {
  const embedRef = useRef(null)
  console.log('embedCode', embedCode)

  useEffect(() => {
    const node = embedRef.current
    if (!node || !embedCode) {
      return
    }

    // Clear previous content to handle re-renders correctly.
    node.innerHTML = ''

    // Step 1: Decode the embed code if it's in the special iframe src format.
    let finalHtml = embedCode
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(embedCode, 'text/html')
      const iframe = doc.querySelector('iframe')

      if (
        iframe &&
        iframe.hasAttribute('src') &&
        !iframe.getAttribute('src').trim().startsWith('http')
      ) {
        finalHtml = decodeHtmlEntities(iframe.getAttribute('src'))
      }
    } catch (e) {
      console.error(
        'Could not parse embed code to check for encoded iframe, using as is.',
        e
      )
    }

    // 在插入 innerHTML 前處理 YouTube iframe
    finalHtml = addYoutubeClassToIframe(finalHtml)

    // Step 2: Add the final HTML to the DOM.
    // Note: Scripts inserted via innerHTML do not execute by default.
    node.innerHTML = finalHtml

    // Step 3: Find all scripts in the inserted content and re-create them
    // to make them executable. This preserves the script's original position.
    const scripts = Array.from(node.querySelectorAll('script'))
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')

      // Copy all attributes from the old script to the new one.
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value)
      }

      // Copy the content of the script.
      newScript.text = oldScript.innerText

      // Replace the old, non-executed script tag with the new, executable one.
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [embedCode])

  return <EmbedContainer ref={embedRef} />
}
