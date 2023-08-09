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
 * When the partner's slug is 'healthnews', 'zuchi', or '5678news', the section title will be '生活'.
 * When the partner's slug is 'ebc', the section title will be '時事'.
 * For all other partners, the section title will be '合作媒體'.
 *
 * @param {Partner | null} partner
 * @returns {string | undefined}
 */
function getExternalSectionTitle(partner) {
  let sectionTitle

  if (partner && partner.slug) {
    switch (partner.slug) {
      case 'healthnews':
      case 'zuchi':
      case '5678news':
        sectionTitle = '生活'
        break
      case 'ebc':
        sectionTitle = '時事'
        break
      default:
        sectionTitle = '合作媒體'
        break
    }
  } else {
    sectionTitle = undefined
  }

  return sectionTitle
}

/**
 * Special requirement:
 * When the partner's slug is 'healthnews', 'zuchi', 'ebc' or '5678news', the title color will be '#61B8C6'
 * For all other partners, the title color will be '#3855BC'
 *
 * @param {Partner | null} partner
 * @returns {string | undefined}
 */
function getExternalPartnerColor(partner) {
  let partnerColor

  if (partner && partner.slug) {
    switch (partner.slug) {
      case 'healthnews':
      case 'zuchi':
      case '5678news':
      case 'ebc':
        partnerColor = '#61B8C6'
        break
      default:
        partnerColor = '#3855BC'
        break
    }
  } else {
    partnerColor = undefined
  }

  return partnerColor
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
