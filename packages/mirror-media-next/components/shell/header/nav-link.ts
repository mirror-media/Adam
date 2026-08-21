/**
 * The rule is drawn inside the padding box rather than offset below the text:
 * the category strip sets overflow-x, which makes overflow-y compute to auto,
 * so anything outside the box gets clipped.
 */
const navLinkClassName =
  'relative inline-block rounded-mm-xs py-mm-s font-mm-sans text-mm-h5 text-mm-neutral-800 outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-mm-sx after:origin-left after:rounded-full after:bg-mm-base-500 after:transition-transform after:duration-150 after:content-[""] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500'

/** Drawn while hovered or keyboard-focused. */
const navLinkRuleOnHover =
  'after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100'

/** Kept drawn, for the entry matching the current route. */
const navLinkRuleAlways = 'after:scale-x-100'

export { navLinkClassName, navLinkRuleAlways, navLinkRuleOnHover }
