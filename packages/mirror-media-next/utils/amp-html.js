import { parseDocument, DomUtils } from 'htmlparser2'
import * as CSSselect from 'css-select'
import { default as render } from 'dom-serializer'

/**
 * [Server Side only function]
 * Since amp page restrict the client js, this function only tests on the server side.
 *
 * Transform the html and make it amp valid version.
 * Since amp html has so many constraints, this function only handle the situations listed below:
 * 1. remove prohibited element and show hint to redirect to the non-amp page.
 *    Exception: youtube iframe.
 * 2. replace html tag with 'amp-' (amp valid html tag).
 *
 * The listed situation may increase in the future according to the complexity of the html source. In other word, we will handle more situations when new problem occurs.
 * Check the full amp html specification: [link](https://amp.dev/documentation/guides-and-tutorials/learn/spec/amphtml#html-tags)
 * @param {string} html - normal HTML string to be converted
 * @param {string} currentPageUrl - the page url where the html is about to render at
 * @returns
 */
export function transformHtmlIntoAmpHtml(html, currentPageUrl) {
  const dom = parseDocument(html)

  const prohibitedTags = [
    'script',
    'base',
    'picture',
    'frame',
    'frameset',
    'object',
    'param',
    'applet',
    'embed',
    'iframe',
  ]

  const replacedTags = ['img', 'video', 'audio']

  const redirectUrl = currentPageUrl.replace('/external/amp/', '/external/')

  const invalidElementArrtibPairs = [
    {
      element: 'div',
      attribute: `data-progress-bar-1"`,
      selector: 'div[data-progress-bar-1\\"]',
    },
    { element: 'a', attribute: 'spellcheck' },
    { element: 'span', attribute: 'sans-serif' },
  ]

  // handle some html tag with invalid attribute which will grows when new source is added..
  for (const invalidElementAttribPair of invalidElementArrtibPairs) {
    const selector =
      invalidElementAttribPair.selector ||
      invalidElementAttribPair.element +
        `[${invalidElementAttribPair.attribute}]`
    for (const ele of CSSselect.selectAll(selector, dom)) {
      delete ele.attribs?.[invalidElementAttribPair.attribute]
    }
  }

  // 1. remove prohibited element and show hint to redirect to the non-amp page.
  for (const prohibitedTag of prohibitedTags) {
    for (const ele of CSSselect.selectAll(prohibitedTag, dom)) {
      let replaceEle
      if (prohibitedTag === 'iframe') {
        // @ts-ignore
        const iframeSrc = ele.attribs?.src || ''
        const matchYoutubeIframe = iframeSrc?.match(
          /\/embed\/([a-zA-Z0-9_-]{11})/
        )

        // only youtube iframe will be rendered as amp-iframe
        if (matchYoutubeIframe && matchYoutubeIframe[1]) {
          const youtubeId = matchYoutubeIframe[1]
          const ampYoutubeTemplate = `
          <span class="amp-img-wrapper">
            <amp-youtube data-videoid="${youtubeId}" layout="fill">
              <amp-img
                src="https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg"
                placeholder
                layout="fill"
              />
            </amp-youtube>
          </span>
        `
          const ampYoutube = parseDocument(ampYoutubeTemplate)

          replaceEle = ampYoutube
          DomUtils.replaceElement(ele, replaceEle)
          continue
        }
        // if not youtube iframe, let the following logic to handle
      }

      // create new element from parse html string
      const unsupportTemplate = `
      <a class='link-to-story' 
      href='${redirectUrl}'
      target='_blank'
      style='
      display: flex; 
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%; 
      height: 210px;
      box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.15) inset;
      color: #888;
      font-family: PingFang TC;
      font-size: 16px;
      font-style: normal;
      font-weight: 300;
      line-height: 180%;'>
      <span>AMP不支援此功能，請</span>
      <span style='font-weight: 600; margin-bottom: 4.5px;'>點擊連結觀看完整內容</span>
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1929 1.18239C12.7694 1.50222 12.4755 1.9516 12.3383 2.45154C11.6583 2.30243 10.9226 2.41624 10.3664 2.8688C9.91637 3.21518 9.62245 3.66456 9.51118 4.19041C8.83114 4.0413 8.09483 4.20757 7.53862 4.66013C7.24725 4.89969 7.0336 5.21697 6.87242 5.53363L4.33315 2.99436C3.47809 2.1393 2.06301 2.05155 1.13579 2.8233C0.606133 3.24932 0.283761 3.88262 0.249587 4.53865C0.215413 5.19469 0.443525 5.84755 0.909921 6.31394L7.62084 13.0249C6.28159 13.1722 5.16727 14.2347 5.04646 15.5474C4.95856 16.309 5.21131 17.0927 5.7289 17.6634C6.22057 18.2081 6.92461 18.5405 7.68492 18.5575C8.20823 18.6561 12.0812 19.3435 13.8078 19.6897C14.6187 19.8634 15.4612 19.591 16.0452 19.0069L23.2393 11.8128C24.195 10.8572 24.24 9.30936 23.2813 8.35066C21.027 6.09641 16.3371 1.40654 16.3371 1.40654C15.4555 0.578027 14.1195 0.463092 13.1929 1.18239ZM22.1669 9.41315C22.5297 9.7759 22.5221 10.4054 22.1504 10.777L14.9829 17.9446C14.7439 18.1835 14.4279 18.2922 14.0879 18.2177C12.2039 17.8734 7.91255 17.0862 7.86009 17.0868C7.80764 17.0874 7.78173 17.0615 7.72927 17.0622C7.36207 17.0666 6.99677 16.9137 6.79012 16.654C6.53101 16.3948 6.43055 16.0289 6.48745 15.6611C6.51718 15.3722 6.67773 15.1081 6.86355 14.9222C7.12902 14.6568 7.49813 14.4949 7.86533 14.4905L9.33414 14.4727C9.64888 14.4689 9.88716 14.2824 10.0218 13.9923C10.1299 13.7288 10.0813 13.4146 9.87397 13.2074L1.91932 5.25272C1.73795 5.07134 1.66212 4.83624 1.69121 4.59986C1.7203 4.36349 1.80185 4.12647 2.01358 3.96656C2.35805 3.67391 2.88199 3.72001 3.21883 4.05685L7.1832 8.02122L7.28684 8.12486L9.48927 10.3273C9.77429 10.6123 10.2464 10.6066 10.5384 10.3146C10.8304 10.0226 10.8361 9.55045 10.5511 9.26543L8.3487 7.063C8.16733 6.88163 8.0915 6.64652 8.12059 6.41014C8.14968 6.17377 8.23122 5.93676 8.44296 5.77684C8.78743 5.4842 9.31137 5.5303 9.64821 5.86714L9.8555 6.07442L11.8247 8.04365C12.1097 8.32867 12.5819 8.32295 12.8739 8.03094C13.1659 7.73893 13.1716 7.26681 12.8866 6.98179L11.021 5.11621C10.8156 4.75155 10.9263 4.27816 11.2701 4.03797C11.6139 3.79778 12.1119 3.81797 12.4488 4.15481L12.7338 4.43983L14.1071 5.81311C14.3921 6.09813 14.8642 6.09241 15.1562 5.8004C15.4482 5.50839 15.454 5.03627 15.1689 4.75125L13.8734 3.4557C13.668 3.09105 13.7787 2.61766 14.1225 2.37747C14.4663 2.13728 14.9644 2.15747 15.3012 2.49431C15.2228 2.46904 19.9127 7.1589 22.1669 9.41315Z" fill="#9D9D9D"/>
      </svg>
      </a>
      `
      replaceEle = parseDocument(unsupportTemplate)
      DomUtils.replaceElement(ele, replaceEle)
    }
  }

  // 2. replace html tag with 'amp-' (amp valid html tag).
  for (const replacedTag of replacedTags) {
    for (const ele of CSSselect.selectAll(replacedTag, dom)) {
      let ampEle

      if (replacedTag === 'img') {
        // if img wihout src, remove it directly
        if (!ele.attribs?.src) {
          DomUtils.removeElement(ele)
          continue
        }

        delete ele.attribs?.decoding
        delete ele.attribs?.loading
        // reset the original image style and let it fills the parent's width
        const ampImgEle = {
          type: 'tag',
          name: 'amp-img',
          attribs: {
            // @ts-ignore
            ...ele.attribs,
            layout: 'fill',
            style: '',
          },
          // @ts-ignore
          children: ele.children,
        }
        ampImgEle.attribs.layout = 'fill'
        ampImgEle.attribs.style = ''

        // add .amp-img-wrapper class for the page side to decide the style
        // use span incase the <img> tag sits inside a <p> tag
        const ampImpParentTemplate = `
        <span class="amp-img-wrapper">
        </span>
      `
        const section = parseDocument(ampImpParentTemplate)
        const sections = CSSselect.selectAll('span', section)
        // @ts-ignore
        sections[0].children.push(ampImgEle)

        ampEle = section
      } else if (replacedTag === 'video') {
        const ampVideoEle = {
          type: 'tag',
          name: 'amp-video',
          attribs: {
            // @ts-ignore
            ...ele.attribs,
            style: '',
            controls: 'controls',
            autoplay: 'autoplay',
            loop: 'loop',
            layout: 'responsive',
            width: '100vw',
            height: '50vw',
          },
          // @ts-ignore
          children: ele.children,
        }
        ampEle = ampVideoEle
      } else if (replacedTag === 'audio') {
        if (!ele.attribs?.src) {
          DomUtils.removeElement(ele)
          continue
        }

        const ampAudioEle = {
          type: 'tag',
          name: 'amp-audio',
          attribs: {
            // @ts-ignore
            ...ele.attribs,
            style: '',
            width: '50vw',
            height: '54px',
          },
          // @ts-ignore
          children: ele.children,
        }
        ampEle = ampAudioEle
      } else {
        ampEle = {
          type: 'tag',
          name: 'amp-' + replacedTag,
          // @ts-ignore
          attribs: ele.attribs,
          // @ts-ignore
          children: ele.children,
        }
      }

      // replace tag with amp-{tag}
      // @ts-ignore
      DomUtils.replaceElement(ele, ampEle)
    }
  }

  return render(dom, { encodeEntities: 'utf8' })
}
