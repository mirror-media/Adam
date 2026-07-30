import { graphql } from '../__generated__/content'

/** 公告範圍 */
type AnnouncementScope = {
  name: string // 名稱
}

/** 公告 */
type Announcement = {
  id: string
  title: string // 標題
  description: string // 內容
  level: string // 重要程度
  isActive: boolean // 是否生效
  scope: AnnouncementScope[] // 範圍
}

// No default $scope on purpose: codegen can't read JS interpolation in the
// document. Callers must inject the default scope themselves.
const fetchAnnouncements = graphql(`
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
`)

export { fetchAnnouncements }
export type { Announcement }
