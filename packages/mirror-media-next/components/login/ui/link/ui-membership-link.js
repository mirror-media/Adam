import Link from 'next/link'

/**
 * @typedef {import('next/link').LinkProps['href']} Href
 */

/**
 * @param {React.PropsWithoutRef<{href?: Href}>} props
 * @returns
 */
export default function UiMembershipLink({ href = '/' }) {
  return <Link href={href}></Link>
}
