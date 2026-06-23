import { gql } from '@apollo/client'

/**
 * @typedef AnnouncementScope - 公告範圍
 * @property {string} name -  名稱
 */

/**
 * @typedef Announcement - 公告
 * @property {string} id
 * @property {string} title - 標題
 * @property {string} description - 內容
 * @property {string} level - 重要程度
 * @property {boolean} isActive - 是否生效
 * @property {AnnouncementScope[]} scope - 範圍
 */

// No default $scope on purpose: codegen can't read JS interpolation in the
// document. Callers must inject the default scope themselves.
const fetchAnnoucements = gql`
  query fetchAnnouncements($scope: [String!]) {
    announcements(where: { scope: { some: { name: { in: $scope } } } }) {
      id
      title
      description
      level
      isActive
      scope {
        name
      }
    }
  }
`

export { fetchAnnoucements }
