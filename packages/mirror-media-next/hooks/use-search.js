import { useState } from 'react'

export default function useSearch() {
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

    /**
     * Since search page is hosted on different backend service,
     * we use location API instead of next/router to prevent client-side navigation
     */
    window.location.assign(`/search/${trimedSearchTerms}`)
  }

  return {
    searchTerms,
    setSearchTerms,
    goSearchPage,
  }
}
