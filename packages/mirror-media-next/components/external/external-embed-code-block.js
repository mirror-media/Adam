'use client'

import { useEffect, useRef } from 'react'

function decodeHtmlEntities(text) {
  // This function should only run on the client.
  if (typeof document === 'undefined') {
    return text
  }
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

/**
 * A generic component to render embed code. It correctly handles and executes
 * any <script> tags within the provided code, preserving their original position.
 * It also handles a special case where HTML is encoded inside an iframe's src attribute.
 *
 * @param {Object} props
 * @param {string} props.embedCode - The embed code string, which can be any valid HTML.
 * @returns {JSX.Element}
 */
export default function ExternalEmbedCodeBlock({ embedCode = '' }) {
  const embedRef = useRef(null)

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

  return <div ref={embedRef} />
}
