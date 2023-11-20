import { useEffect } from 'react'

import { useMembership } from '../../context/membership'
import { LOCAL_STORAGE_KEY } from '../../constants/member-article-history'
const HISTORY_EXPIRE_TIME = 30 * 60 * 1000 //milliseconds, which is equal to 30 minutes

/**
 * @typedef {{ts: number,slug: string}} ArticleRecord
 */

/**
 * Save member's article (/story) browsing history.
 * Renew the localStorage.memberArticleRecords every time with fresh record corresponding to the logged-in user.
 * Only store articles read within certain period of time, time is determined by `HISTORY_EXPIRE_TIME`.
 * @param {string} storySlug
 */
export default function useSaveMemberArticleHistoryLocally(storySlug = '') {
  const { firebaseId, isLogInProcessFinished } = useMembership()
  useEffect(() => {
    if (!storySlug || !isLogInProcessFinished || !firebaseId) {
      return
    }
    const nowTs = new Date().valueOf()
    const expireTs = nowTs - HISTORY_EXPIRE_TIME
    const newArticleRecord = { ts: nowTs, slug: storySlug }
    /**
     * @type {{ [id: string] : ArticleRecord[]}}
     */
    const memberArticleRecords =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {}

    const hasArticleRecordsInLocalStorage = Boolean(
      memberArticleRecords[firebaseId] &&
        Array.isArray(memberArticleRecords[firebaseId]) &&
        memberArticleRecords[firebaseId].length
    )

    const articleRecords = hasArticleRecordsInLocalStorage
      ? memberArticleRecords[firebaseId]
          .filter((record) => record.ts > expireTs)
          .concat(newArticleRecord)
      : [newArticleRecord]

    const newMemberArticleRecords = {
      ...memberArticleRecords,
      [firebaseId]: articleRecords,
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(newMemberArticleRecords)
    )
  }, [storySlug, isLogInProcessFinished, firebaseId])
}
