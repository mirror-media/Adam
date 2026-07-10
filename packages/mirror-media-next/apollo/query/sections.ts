import { graphql } from '../__generated__/content'

const fetchSection = graphql(`
  query fetchSection($where: SectionWhereUniqueInput!) {
    section(where: $where) {
      ...section
    }
  }
`)

const fetchSectionWithCategory = graphql(`
  query fetchSectionWithCategory($where: SectionWhereUniqueInput!) {
    section(where: $where) {
      ...sectionWithCategory
    }
  }
`)

export { fetchSection, fetchSectionWithCategory }
