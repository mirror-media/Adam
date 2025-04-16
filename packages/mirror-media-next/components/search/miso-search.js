import { useEffect } from 'react'
import { MISO_API_KEY } from '../../config/index.mjs'
import styled from 'styled-components'

const SearchWrapper = styled.div`
  min-height: 80vh;
`

/**
 * @param {string} props.search
 * @returns {React.ReactElement}
 */
export default function MisoSearch({ searchTerms }) {
  console.log(searchTerms)
  useEffect(() => {
    // @ts-ignore: Property 'misocmd' does not exist on type 'Window & typeof globalThis'.
    const misocmd = window.misocmd || (window.misocmd = [])
    misocmd.push(async () => {
      // setup client
      // @ts-ignore: Property 'MisoClient' does not exist on type 'Window & typeof globalThis'.
      const MisoClient = window.MisoClient
      const client = new MisoClient(MISO_API_KEY)
      const workflow = client.ui.hybridSearch

      // wait for styles to be loaded
      await client.ui.ready

      // render DOM and get element references
      const defaults = MisoClient.ui.defaults.hybridSearch
      const templates = defaults.templates
      const wireAnswerBox = defaults.wireAnswerBox

      const rootElement = document.querySelector('#miso-hybrid-search-combo')
      rootElement.innerHTML = templates.root({ answerBox: true })

      wireAnswerBox(client, rootElement)

      // start query if specified in URL parameters
      workflow.autoQuery()
    })
  }, [])
  return (
    <SearchWrapper>
      <div
        id="miso-hybrid-search-combo"
        className="miso-hybrid-search-combo"
      ></div>
    </SearchWrapper>
  )
}
