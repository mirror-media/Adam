import { gql } from '@apollo/client'
import { magazine } from '../fragments/magazine'

const fetchSpecials = gql`
  ${magazine}
  query {
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
  query {
    magazines(
      where: { type: { equals: "weekly" }, state: { equals: "published" } }
      orderBy: { publishedDate: desc }
      take: 8
    ) {
      ...magazine
    }
  }
`

export { fetchSpecials, fetchWeeklys }
