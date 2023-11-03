import ShareHeader from './header/v3/share-header'

/**
 * @typedef {Object} Header
 * @property {import('./header/v3/share-header').HeaderType} type
 * @property {import('./header/v3/share-header').HeaderData} [data]
 */

/**
 *
 * @param {Object} props
 * @param {Header} props.header - object that ShareHeader needs to render the specific type and the content
 * @returns {React.JSX}
 */
export default function V3Layout({ header, children }) {
  return (
    <>
      <ShareHeader pageLayoutType={header.type} headerData={header.data} />
      {children}
    </>
  )
}
