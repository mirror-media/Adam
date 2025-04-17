import { useEffect } from 'react'
import { MISO_API_KEY } from '../../config/index.mjs'
import styled from 'styled-components'

const SearchWrapper = styled.div`
  .miso-hybrid-search-combo__search-results {
    padding: 0 !important;
    ${({ theme }) => theme.breakpoint.md} {
      max-width: 600px;
      margin: 0 auto;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      max-width: 1024px;
    }
  }
  .miso-hybrid-search-combo__search-results-container {
    padding: 0 !important;

  }

  .miso-list__list {
    display: flex;
    flex-direction: column;
    gap 28px;
    ${({ theme }) => theme.breakpoint.xl} {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 52px 44px;
    }

    .miso-list__item {
      margin: 0 !important;
    }

    .miso-list__item-body {
      flex-direction: column;
      padding: 0 !important;
      gap: 20px !important;
      ${({ theme }) => theme.breakpoint.md} {
        max-width: 320px;
        margin: 0 auto;
      }
      ${({ theme }) => theme.breakpoint.xl} {
        max-width: 220px;
      }

      .miso-list__item-cover-image-container {
        width: 100vw;
        height: calc(100vw * 214 / 320) !important;
        border-radius: 0;
        &::before {
          content: none;
        }
        ${({ theme }) => theme.breakpoint.md} {
          width: 320px;
          height: 214px !important;
        }
        ${({ theme }) => theme.breakpoint.xl} {
          width: 220px;
          height: 147px !important;
        }
        
        .miso-list__item-cover-image {
          object-fit: cover;
        }
      }

      .miso-list__item-title {
        color: #054F77;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "PingFang TC";
        font-size: 18px;
        font-weight: 400;
        line-height: normal;
        padding: 0 20px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        ${({ theme }) => theme.breakpoint.xl} {
          -webkit-line-clamp: 3;
          padding: 0 8px;
        }
      }

      .miso-list__item-snippet {
        padding: 0 20px;
        color: #979797;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "PingFang TC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        ${({ theme }) => theme.breakpoint.xl} {
          padding: 0 8px;
        }
      }
    }
  }
`

/**
 * @param {{searchTerms: string}} props
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
