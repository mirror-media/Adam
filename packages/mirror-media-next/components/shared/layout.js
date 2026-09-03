import { LegacyLayoutAdapter } from '../shell/legacy-layout-adapter'

import CustomHead from './custom-head'

/**
 * @typedef {Object} Header
 * @property {'default' | 'default-with-flash-news'} type
 * @property {Object} [data]
 *
 * @typedef {import('./custom-head').HeadProps} Head
 *
 * @param {Object} props
 * @param {Head} [props.head] - object that CustomHead needs to set the html meta
 * @param {Header} props.header - legacy data shape adapted into PageShell
 * @param {boolean} [props.withFooter] - whether PageShell renders the footer（頁尾）
 * @param {React.ReactNode} props.children - main content of the page
 * @returns {React.ReactElement}
 */
export default function Layout({ head, header, withFooter = true, children }) {
  return (
    <>
      <CustomHead
        title={head?.title}
        ogTitle={head?.ogTitle}
        description={head?.description}
        ogDescription={head?.ogDescription}
        imageUrl={head?.imageUrl}
        ogImageUrl={head?.ogImageUrl}
        skipCanonical={head?.skipCanonical}
        pageType={head?.pageType}
        pageSlug={head?.pageSlug}
        robotsMetaContent={head?.robotsMetaContent}
      />
      <LegacyLayoutAdapter header={header} withFooter={withFooter}>
        {children}
      </LegacyLayoutAdapter>
    </>
  )
}
