const brandColor = {
  darkBlue: '#054F77',
  lightBlue: '#61B8C6',
  black: '#000000',
  white: '#ffffff',
  gray: '#888888',
}
const sectionsColor = {
  member: '#000000',
  news: '#61B8C6',
  entertainment: '#D43E96',
  businessmoney: '#07B53B',
  people: '#E8C15E',
  international: '#911F56',
  foodtravel: '#FF9598',
  mafalda: '#8F39CE',
  culture: '#A8CF68',
  carandwatch: '#1877F2',
  external: '#2ECDA7',
  mirrorcolumn: '#B79479',
  life: '#2ECDA7',
}
/**
 * Resolve the label background color for a post's first section.
 * `external` posts are labeled with the `news` section's color, and
 * unrecognized slugs fall back to the brand's light blue.
 *
 * @param {string} [sectionSlug]
 * @returns {string}
 */
const getSectionLabelColor = (sectionSlug) => {
  if (sectionSlug === 'external') return sectionsColor.news
  return sectionSlug && sectionsColor[sectionSlug]
    ? sectionsColor[sectionSlug]
    : brandColor.lightBlue
}

export const color = { brandColor, sectionsColor, getSectionLabelColor }
