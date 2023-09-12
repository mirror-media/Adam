import { theme } from '../styles/theme/index'
const { color } = theme
/**
 * The `brief` of the externals is string and not in the format of a draft.
 * Here convert the string into a data format with `blocks` and `entityMap`.
 *
 * @param {string} id
 * @param {string} text
 * @returns {Object}
 */

function transformStringToDraft(id = '', text = '') {
  return {
    blocks: [
      {
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: `${id}`,
        text: `${text}`,
        type: 'unstyled',
      },
    ],
    entityMap: {},
  }
}

/**
 * @typedef {import('../apollo/fragments/partner').Partner} Partner
 */

/**
 * Special requirement:
 * If the partner's property `showOnIndex` in true, then title be `時事`.
 * If not, then title should be `生活`.
 *
 * @param {Partner | null} partner
 * @returns {string | undefined}
 */
function getExternalSectionTitle(partner) {
  if (!partner || !partner.slug) {
    return undefined
  }

  if (partner.showOnIndex) {
    return '時事'
  } else {
    return '生活'
  }
}

/**
 * Special requirement:
 * If the partner's property `showOnIndex` in true, then title color should be `#61B8C6`, which is section color of `news`.
 * If not, then title color should be `#2ECDA7`, which is section color of `life`.
 *
 * @param {Partner | null} partner
 * @returns {string | undefined}
 */
function getExternalPartnerColor(partner) {
  if (!partner || !partner.slug) {
    return undefined
  }

  if (partner.showOnIndex) {
    return color.sectionsColor.news
  } else {
    return color.sectionsColor.life
  }
}

/**
 * The author field in externals can be either a plain string or a string containing HTML formatting. Based on the content of the string, return the corresponding JSX.Element.
 *
 * @param {string} credits
 * @returns {JSX.Element}
 */
function getCreditsHtml(credits = '') {
  if (/<[a-z][\s\S]*>/i.test(credits)) {
    return <span dangerouslySetInnerHTML={{ __html: credits }} />
  } else {
    return <span>{credits}</span>
  }
}

export {
  transformStringToDraft,
  getExternalSectionTitle,
  getCreditsHtml,
  getExternalPartnerColor,
}
