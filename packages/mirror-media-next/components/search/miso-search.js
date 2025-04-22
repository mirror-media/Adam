import { useEffect } from 'react'
import { MISO_API_KEY } from '../../config/index.mjs'
import styled from 'styled-components'

const SearchWrapper = styled.div`
  // input 框

  // ask 區塊
  .miso-hybrid-search-combo__answer {
    padding: 0 22px !important;
    border: 0;
    ${({ theme }) => theme.breakpoint.md} {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 !important;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      max-width: 1024px;
    }

    .miso-hybrid-search-combo__answer-box {
      border: 0;
      box-shadow: none;

      .miso-hybrid-search-combo__answer-box-inner {
        max-height: inherit;
        border: 0;
      }

      .miso-hybrid-search-combo__phrase {
        font-size: 0;
        margin-bottom: 20px;
        miso-question {
          display: block;
          color: #1D9FB8;
          text-align: center;
          font-feature-settings: 'liga' off, 'clig' off;
          font-family: "PingFang TC";
          font-size: 28px;
          font-style: normal;
          font-weight: 600;
          line-height: 115%; /* 32.2px */
          letter-spacing: 0.5px;
          padding-bottom: 32px;
          border-bottom: 1px solid black;

          &::before {
            content: '你想找的是';
            color: #1D9FB8;
            text-align: center;
            font-family: "PingFang TC";
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%;
            display: block;
            margin-bottom: 27px;
          }


          ${({ theme }) => theme.breakpoint.md} {
            display: flex;
            border: 0;
            font-size: 28px;
            padding-bottom: 0;
            align-items: center;
            &:before {
              margin-right: 28px;
            }
            &:after {
              content: '';
              flex: 1;
              margin-left: 56px;
              border-top: 1px solid black;
              transform: translate(0, 50%)
            }
          }
          ${({ theme }) => theme.breakpoint.xl} {
            &:before {
              margin-right: 36px;
            }
            &:after {
              margin-left: 60px;
            }
          }
        }
      }

      .miso-typewriter, .miso-typewriter * {
        color: #000 !important;
        font-family: "PingFang TC";
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 200%; 
        a::before {
          color: #1D9FB8;
        }
      }

      .miso-feedback {
        display: none;
      }
    }

    // source 文章
    .miso-hybrid-search-combo__sources-container {
      padding: 24px; 22px;
      margin-top: 20px;
      max-height: inherit;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      position: relative;
      z-index: 10;
      ${({ theme }) => theme.breakpoint.md} {
        margin-top: 24px;
      }

      h3 {
        display: none;
      }

      .miso-list__list {
        display: flex;
        flex-direction: row;
        overflow: scroll;
        gap: 16px;
        flex-wrap: nowrap;
        ${({ theme }) => theme.breakpoint.md} {
          gap: 48px;
        }

        .miso-list__item {
          border: 0;
          mark {
            display: none;
          }

          .miso-list__item-body {
            display: flex;
            flex-direction: row-reverse;
            gap: 8px !important;
            ${({ theme }) => theme.breakpoint.md} {
              gap: 10px !important;
            }

            .miso-list__item-cover-image-container {
              width: 88px;
              height: 60px !important;
              margin-top: 32px;
            }

            .miso-list__item-index {
              color: #1D9FB8;
            }

            .miso-list__item-info-container {
              flex-direction: column-reverse;
              flex: 1;
              width: 139px;
              margin-right: 4px;
              ${({ theme }) => theme.breakpoint.md} {
                margin-right: 2px;
              }

              .miso-list__item-date {
                color: #9CB7C6;
                font-family: "PingFang TC";
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 14px;
                margin-bottom: 8px;
              }

              .miso-list__item-title {
                color: #000;
                font-feature-settings: 'liga' off, 'clig' off;
                font-family: "PingFang TC";
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                -webkit-line-clamp: 4;
                padding: 0;
                margin: 0;
              }
            }
          }
        }
      }
    }

    .miso-hybrid-search-combo__answer-box-toggle-container {
      display: none;
    }
  }

  // result 區域
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
