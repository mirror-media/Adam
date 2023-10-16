import client from '../../apollo/apollo-client'
import { fetchModEvents } from '../../apollo/query/event'

export function fetchModEventsInDesc() {
  return client.query({
    query: fetchModEvents,
    variables: {
      eventsFilter: {
        state: { equals: 'published' },
        eventType: { equals: 'mod' },
      },
      eventsOrderBy: {
        publishedDate: 'desc',
      },
    },
  })
}
