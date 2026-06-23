import { gql } from '@apollo/client'

import { magazine } from '../fragments/magazine'

const fetchSpecials = gql`
  ${magazine}
  query fetchSpecials {
    magazines(
      where: { type: { equals: "special" }, state: { equals: "published" } }
      orderBy: { publishedDate: desc }
    ) {
      ...magazine
    }
  }
`

const fetchWeeklys = gql`
  ${magazine}
  query fetchWeeklys {
    magazines(
      where: { type: { equals: "weekly" }, state: { equals: "published" } }
      orderBy: { createdAt: desc }
      take: 20
    ) {
      ...magazine
    }
  }
`

export { fetchSpecials, fetchWeeklys }
