import dynamic from 'next/dynamic'

import GDPRNotification from '../gdpr'
import { BackToTop } from '../shell/back-to-top'
import { IdleTimeoutModal } from '../shell/idle-timeout-modal/idle-timeout-modal'
import { LegacyLayoutAdapter } from '../shell/legacy-layout-adapter'

import CustomHead from './custom-head'

const V3ShareHeader = dynamic(() => import('../header/share-header'))
const V3Footer = dynamic(() => import('./footer'))

/**
 * @typedef {Object} Header
 * @property {import('../header/share-header').HeaderType} type
 * @property {import('../header/share-header').HeaderData} [data]
 *
 * @typedef {import('./custom-head').HeadProps} Head
 *
 * @typedef {Object} Footer
 * @property {import('./footer').FooterType} type
 */

/**
 * @param {Object} props
 * @param {Head} [props.head] - object that CustomHead needs to set the html meta
 * @param {Header} props.header - object that ShareHeader needs to render the specific type and the content
 * @param {Footer} props.footer - object that Footer needs to render the specific type
 * @param {React.ReactNode} props.children - main content of the page
 * @returns {React.ReactElement}
 */
export default function Layout({ head, header, footer, children }) {
  const shouldKeepV3PremiumShell =
    header.type === 'premium' ||
    header.type === 'premium-with-subtitle-navigator'

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
      {shouldKeepV3PremiumShell ? (
        <>
          <V3ShareHeader
            pageLayoutType={header.type}
            headerData={header.data}
          />
          <IdleTimeoutModal />
          {children}
          <GDPRNotification />
          <V3Footer footerType={footer.type} />
        </>
      ) : (
        <LegacyLayoutAdapter
          footer={footer}
          globalModal={<IdleTimeoutModal />}
          header={header}
          privacyNotice={<GDPRNotification />}
        >
          {children}
        </LegacyLayoutAdapter>
      )}
      {/* Outside both branches so every legacy route gets it exactly once.
          Routes keep it as they move to PageShell, which renders its own. */}
      <BackToTop />
    </>
  )
}
