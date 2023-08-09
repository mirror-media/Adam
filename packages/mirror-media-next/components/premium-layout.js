import React from 'react'
import PremiumHeader from './premium-header'

/**
 * @typedef {import('./premium-header').PremiumHeaderData} PremiumHeaderData
 *
 * @param {Object} props
 * @param {PremiumHeaderData} props.premiumHeaderData
 * @param {React.ReactNode} props.children
 * @returns {React.ReactElement}
 */
export default function PremiumLayout({ premiumHeaderData, children }) {
  return (
    <>
      <PremiumHeader premiumHeaderData={premiumHeaderData} />
      {children}
    </>
  )
}
