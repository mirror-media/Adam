/**
 * Only dimensions owned by the current site layout belong here. Third-party
 * creative dimensions stay unset until the ad owner confirms that contract.
 */
export const AD_SLOT_LAYOUTS = {
  prism: {
    asideArticleRow: {
      className: 'h-[114px]',
      heightPx: 114,
    },
    homepageHeadlineRow: {
      className: 'h-16',
      heightPx: 64,
    },
  },
} as const
