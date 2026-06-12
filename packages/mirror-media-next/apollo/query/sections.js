import { gql } from '@apollo/client'

import { section, sectionWithCategory } from '../fragments/section'

const fetchSection = gql`
  ${section}
  query fetchSection($where: SectionWhereUniqueInput!) {
    section(where: $where) {
      ...section
    }
  }
`

const fetchSectionWithCategory = gql`
  ${sectionWithCategory}
  query fetchSectionWithCategory($where: SectionWhereUniqueInput!) {
    section(where: $where) {
      ...sectionWithCategory
    }
  }
`

export { fetchSection, fetchSectionWithCategory }
