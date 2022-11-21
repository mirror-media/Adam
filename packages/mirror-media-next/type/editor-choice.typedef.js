export default {}

/**
 * @typedef {Object} ApiData
 * @property {String} alignment
 * @property {String[]} content
 * @property {String} id
 * TODO: should check property `styles` has type other than empty object
 * @property {Object} styles
 */

/**
 * @typedef {Object} Draft
 * @property {DraftBlock[]} blocks
 * @property {Object} entityMap
 */

/**
 * @typedef {Object} DraftBlock
 * @property {Object} data
 * @property {Number} depth
 * @property {Array} entityRanges
 * @property {Array} inlineStyleRanges
 * @property {String} key
 * @property {String} text
 * @property {String} type
 */

/**
 * @typedef {Object} Category
 * @property {String} _id - unique id
 * @property {String} title - chinese name of category
 * @property {String} name - english name of category
 * @property {Boolean} isCampaign - unknown usage
 */
/**
 * @typedef {Object} Section
 * @property {String} _id - unique id
 * @property {String} title - chinese name of section
 * @property {String} name - english name of section
 * @property {String} description - introduction of this section
 * @property {Number} sortOrder - sorting order of section (currently no use)
 * @property {Boolean} isFeatured - whether this section is marked as  `置頂` in cms
 * @property {Boolean} isAudioSiteOnly - unknown usage
 * @property {Boolean} isMemberOnly - whether this category belongs to the members area
 * @property {Array} topics - unknown usage
 */

/**
 * @typedef {Object} Image - image information
 * @property {String} filename - filename in gcs bucket
 * @property {String} filetype - filetype, e.g. image/jpeg
 * @property {String} gcsBucket - name of gcs bucket which image is located
 * @property {String} gcsDir - name of directory in gcs bucket which iamge is located
 * @property {String} url whole url of image, which value is equal to `https://storage.googleapis.com/${gcsBucket}/${gcsDir}${filename}`
 * @property {Number} height - image height, unit is `px`
 * @property {Number} width - image width, unit is `px`
 * @property {Number} size - image file size, unit is `bytes`
 * @property {Object} iptc - unknown usage
 * @property {String} iptc.city
 * @property {Array} iptc.keywords
 * @property {Object} resizedTargets - information of different size of image,
 * @property {ResizedImageInfo} resizedTargets.tiny - smallest image, which height and width is shortest compared to different size of image
 * @property {ResizedImageInfo} resizedTargets.mobile - size of image for mobile
 * @property {ResizedImageInfo} resizedTargets.square - size of image for square, which height and width is same
 * @property {ResizedImageInfo} resizedTargets.tablet - size of image for tablet
 * @property {ResizedImageInfo} resizedTargets.desktop  - size of image for desktop, which height and width is largest compared to different size of image
 */

/**
 * @typedef {Object} ResizedImageInfo
 * @property {Number} height image height, unit is `px`
 * @property {Number} width image width, unit is `px`
 * @property {Number} url whole url of image

 */

/**
 * @typedef {Object} HeroImage
 * @property {String} createTime - image create time at cms
 * @property {String} description - image description image at cms
 * @property {Image} image - image information
 * @property {Object[]} tags - image tags
 * @property {Object[]} _id - image unique id
 */

/**
 * @typedef {Object} EditorChoiceRawData - information of certain editor choices article
 * @property {Object} brief - short content of article
 * @property {ApiData[]} brief.apiData - api Data of article
 * @property {Draft} brief.draft - unknown usage
 * @property {String} brief.html - short content of article which included html tag.
 * @property {Category[]} categories - which categories does this article belong to
 * @property {HeroImage} heroImage - information of hero image in article
 * @property {String} partner - unknown usage
 * @property {String} publishedDate - article publish date
 * @property {String} redirect - redirect url, if this property is not empty string, that means should redirect to other url when user enter
 * @property {Section[]} sections - which sections does this article belong to
 * @property {Object[]} slug - article slug
 * @property {'article'| 'wide' | 'projects' | 'photography' | 'script' | 'campaigns' | 'readr'} style - article type, script and readr is unknown usage
 * @property {String} title - article title
 * @property {String} _id - article unique id
 *
 */
