/** Hover and focus styles shared by the shell's header and footer links. */

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2'

/**
 * Two white rules that bracket the item on hover.
 *
 * They are a fixed height and vertically centred rather than stretched to the
 * item, so a link, a wordmark and a taller wordmark all get the same rule.
 *
 * The padding gives them room to sit clear of the content, and the matching
 * negative margin takes that room back out of the layout, so no row rewraps or
 * changes its gaps. They stay inside the padding box rather than being offset
 * further out, because these rows clip their overflow.
 */
const bracket =
  'relative inline-block px-mm-m -mx-mm-m before:absolute before:top-1/2 before:left-0 before:h-5 before:w-px before:-translate-y-1/2 before:bg-mm-neutral-0 before:opacity-0 before:transition-opacity before:content-[""] after:absolute after:top-1/2 after:right-0 after:h-5 after:w-px after:-translate-y-1/2 after:bg-mm-neutral-0 after:opacity-0 after:transition-opacity after:content-[""] hover:before:opacity-100 hover:after:opacity-100'

/** Bracketed text, which also brightens to white. */
const shellTextLinkClass = `${bracket} rounded-mm-xs outline-none transition-colors hover:text-mm-neutral-0 ${focusRing} focus-visible:outline-mm-neutral-0 focus-visible:outline-solid`

/** Brand lockups keep their colours, so on a light row they dim instead. */
const shellBrandLinkClass = `rounded-mm-xs outline-none transition-opacity hover:opacity-80 ${focusRing} focus-visible:outline-mm-neutral-900 focus-visible:outline-solid`

/** Lockups on a dark row take the same brackets; their own colours stay put. */
const shellBrandLinkOnDarkClass = `${bracket} outline-none ${focusRing} focus-visible:outline-mm-neutral-0 focus-visible:outline-solid`

/** Social icons take no brackets; they simply lift toward white. */
const shellIconLinkOnDarkClass = `outline-none transition hover:brightness-150 ${focusRing} focus-visible:outline-mm-neutral-0 focus-visible:outline-solid`

export {
  shellBrandLinkClass,
  shellBrandLinkOnDarkClass,
  shellIconLinkOnDarkClass,
  shellTextLinkClass,
}
