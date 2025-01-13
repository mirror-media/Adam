import { useState } from 'react'
import { useRouter } from 'next/router'

export default function useSearch() {
  const router = useRouter()
  const [searchTerms, setSearchTerms] = useState('')

  const goSearchPage = () => {
    /*
      1. remove whitespace from both sides of a string
      2. remove whitespace from both sides of any comma
      3. replace whitespace bwtween two letters with a comma
     */
    const trimedSearchTerms = searchTerms
      .trim()
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, ',')

    if (trimedSearchTerms === '') return setSearchTerms('')

    router.push({
      pathname: '/search/[searchTerms]',
      query: {
        searchTerms: trimedSearchTerms,
      },
    })
  }

  return {
    searchTerms,
    setSearchTerms,
    goSearchPage,
  }
}
