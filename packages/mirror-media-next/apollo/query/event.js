import { gql } from '@apollo/client'
import { modEvent } from '../fragments/event'

const fetchModEvents = gql`
  ${modEvent}
  query (
    $eventsOrderBy: [EventOrderByInput!]!
    $eventsFilter: EventWhereInput!
  ) {
    events(where: $eventsFilter, orderBy: $eventsOrderBy) {
      ...modEvent
    }
  }
`

export { fetchModEvents }
