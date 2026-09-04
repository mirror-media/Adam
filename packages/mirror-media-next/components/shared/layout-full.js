import { LegacyLayoutAdapter } from '../shell/legacy-layout-adapter'

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
 * @param {boolean} [props.withIdleTimeout] - whether PageShell owns the idle dialog（閒置對話框）
 * @param {React.ReactNode} props.children - main content of the page
 * @returns {React.ReactElement}
 */
export default function LayoutFull({
  head,
  header,
  withIdleTimeout = false,
  children,
}) {
  return (
    <LegacyLayoutAdapter
      head={{
        ...head,
        robotsMetaContent: head?.robotsMetaContent ?? 'noindex, nofollow',
      }}
      header={header}
      withIdleTimeout={withIdleTimeout}
    >
      {children}
    </LegacyLayoutAdapter>
  )
}
