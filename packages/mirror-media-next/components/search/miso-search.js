import { useEffect } from 'react'
import { MISO_API_KEY } from '../../config/index.mjs'
import styled from 'styled-components'
import { transformTimeData } from '../../utils'
import { theme } from '../../styles/theme'
import { useRouter } from 'next/router'
const SearchWrapper = styled.div`
  // input 框
  .miso-hybrid-search-combo__question {
    padding: 12px 20px !important;
    background: #EAEAEA;
    display: block;
    ${({ theme }) => theme.breakpoint.md} {
      padding: 20px 0 !important; 
      background: rgba(0, 0, 0, 0);
    }
    .miso-hybrid-search-combo__query-container {
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      ${({ theme }) => theme.breakpoint.md} {
        max-width: 600px;
        margin: 0 auto;
      }
      ${({ theme }) => theme.breakpoint.xl} {
        max-width: 1024px;
      }
    }
    miso-query {
      border: 0;
    }
    .miso-search-box {
      border: 0;
    }
    .miso-search-box__input-group {
      border-radius: 7px;
      border: 1px solid #DDD;
      background: #F5F5F5;
      box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05) inset;
      align-items: center;
      ${({ theme }) => theme.breakpoint.md} {
        border-radius: 4px;
        border: 0.5px solid #DDD;
        background: #F5F5F5;
        box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05) inset;
        
      }
      ::before {
        content: '';
        display: block;
        width: 32px;
        height: 32px;
        background: url('/images-next/search-logo.svg');
        margin-left: 12px;
      }

      .miso-search-box__input {
        background: rgba(0, 0, 0, 0);
        color: #9C9C9C;
        font-family: "PingFang TC";
        font-size: 16px;
        font-weight: 500;
        line-height: 200%;
      }
      .miso-search-box__button {
        background: rgba(0, 0, 0, 0);
        display: flex;
        outline: none !important;
        ::before {
          content: '';
          width: 30px;
          height: 27px;
          background: url('/images-next/search-button.svg');
        }
        svg {
          display: none;
        }
      }
    }
  }

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
      max-height: 200px;
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
          display: flex;
          &:not(:first-child) {
            &:before {
              content: '';
              width: 1px;
              height: 100%;
              display: block;
              background: #000;
              transform: translate(-8px, 0);
              ${({ theme }) => theme.breakpoint.md} {
                transform: translate(-24px, 0);
              }
            }
          }

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
              width: 76px;
              height: 52px !important;
              margin-top: 32px;
            }

            .miso-list__item-index {
              color: #1D9FB8;
            }

            .miso-list__item-title {
              height: auto;
            }

            .miso-list__item-info-container {
              flex-direction: column-reverse;
              flex: 1;
              width: 132px;
              margin-right: 4px;
              justify-content: flex-end;
              ${({ theme }) => theme.breakpoint.md} {
                margin-right: 2px;
              }

              .miso-list__item-date {
                color: #61B8C6;
                font-family: "PingFang TC";
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                margin-bottom: 8px;
              }

              .miso-list__item-title {
                color: #000;
                font-feature-settings: 'liga' off, 'clig' off;
                font-family: "PingFang TC";
                font-size: 16px;
                -webkit-line-clamp: 5;
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

  // result 上方
  .miso-hybrid-search-combo__search-results-info {
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center !important;
    flex-direction: column;
    .miso-hybrid-search-combo__keywords-phrase {
      font-size: 0; /* 把原字整體隱藏掉 */
      display: flex;
      margin-bottom: 16px;
      width: 100%;
      align-items: center;
      justify-content: center;
      ${({ theme }) => theme.breakpoint.xl} {
        margin-bottom: 32px;
        justify-content: flex-start;
      }
      miso-keywords {
        display: block;
        color: black;
        font-family: "PingFang TC";
        font-size: 18px;
        font-weight: 500;
        line-height: 150%; /* 27px */
        ${({ theme }) => theme.breakpoint.xl} {
          font-size: 24px;
        }
      }
      ::before {
        content: '關於';
        font-size: 18px;
        font-weight: 500;
        line-height: 150%;
        margin-right: .5rem;
      }
      ::after {
        content: '的搜尋結果';
        font-size: 18px;
        font-weight: 500;
        line-height: 150%;
        margin-left: .5rem;
      }
    }
    .miso-hybrid-search-combo__total-phrase {
      font-size: 0; /* 把原字整體隱藏掉 */
      display: flex;
      flex-direction: column;
      align-items: center;
      ${({ theme }) => theme.breakpoint.xl} {
        align-items: start;
        width: 100%;
      }
      miso-total {
        color: #1D9FB8;
        font-family: "PingFang TC";
        font-size: 14px;
        font-weight: 600;
        line-height: 14px; /* 87.5% */
        ${({ theme }) => theme.breakpoint.xl} {
          font-size: 16px;
        }
        ::after {
          content: " 篇";
        }
        ::before {
          content: "共有 ";
        }
      }

    }
  }

  .miso-hybrid-search-combo__search-results-filters__right {
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ theme }) => theme.breakpoint.xl} {
      justify-content: flex-end;
      margin-top: -40px;
    }
    .miso-hybrid-search-combo__search-results-filters__sort-header {
      font-size: 0; /* 把原字整體隱藏掉 */
      display: flex;
      flex-direction: column;
      align-items: center;
      &::before {
        content: '排序依';
        display: block;
        color: #000;
        font-family: "PingFang TC";
        font-size: 14px;
        line-height: 14px; /* 100% */
      }
    }
    miso-sort {
      display: flex;
      z-index: 100;
      .miso-select {
        border: 0;
        width: fit-content;

        .miso-select__button {
          border: 0;
          color: #1D9FB8;
          outline: 0 !important;
        }

        &.open {
          .miso-select__button:after {
            transform: rotate(180deg);
          }
          .miso-select__options {
            display: flex;
            width: 88px;
            padding: 12px 9px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            border: 1px solid #9D9D9D;
            background: #FFF;
            border-radius: 0;
            .miso-select__option {
              transition: 0.5s;
              ::before {
                content: none;
              }
              &.selected {
                color: #1D9FB8;
              }
              :hover {
                color: #1D9FB8;
              }
            }
          }
        }
      }
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

        .miso-list__item-section {
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 8px;
          color: white;
          font-size: 16px;
          font-weight: 300;
          ${({ theme }) => theme.breakpoint.md} {
            font-size: 18px;
            font-weight: 600;
            padding: 4px 20px;
          }
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
        height: 50px;
        ${({ theme }) => theme.breakpoint.xl} {
          -webkit-line-clamp: 3;
          padding: 0 8px;
          height: 75px;
        }
      }

      .miso-list__item-time {
        color:  #9CB7C6;
        font-size: 14px;
        line-height: 14px; /* 100% */
        margin-top: 8px;
        margin-bottom: 12px;
        padding: 0 20px;
        ${({ theme }) => theme.breakpoint.md} {
          margin-bottom: 8px;
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
 * @param {Object} props
 * @param {string} props.searchTerms
 * @returns {React.ReactElement}
 */
export default function MisoSearch({ searchTerms }) {
  const router = useRouter()
  function insertElement(html) {
    html = html.replace(
      '<miso-facets></miso-facets>',
      `<div class="miso-hybrid-search-combo__search-results-filters__right"><div class="miso-hybrid-search-combo__search-results-filters__sort-header">Sort</div><miso-sort></miso-sort></div>`
    )
    return html
  }

  function renderProduct(layout, state, product) {
    const [sectionName = '', sectionSlug = ''] = product.tags ?? []
    const backgroundColor =
      sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : theme.color.brandColor.lightBlue

    const html = `
    <a class="miso-list__item-body GTM-search-result-article" data-role="item" data-miso-product-id="${
      product.id
    }" href="${product.url}" target="_blank" rel="noopener">
      <div class="miso-list__item-cover-image-container">
        <img class="miso-list__item-cover-image" src="${product.cover_image}">
        ${
          sectionName
            ? `<div class="miso-list__item-section" style="background-color: ${backgroundColor}">${sectionName}</div>`
            : ''
        }
      </div>
      <div class="miso-list__item-info-container">
        <div class="miso-list__item-title">${product.title}</div>
        <div class='miso-list__item-time'>${transformTimeData(
          product['published_at'].toString(),
          'dot'
        )}</div>
        <div class="miso-list__item-snippet">${product.snippet}</div>
      </div>
   </a>`
    return html
  }

  useEffect(() => {
    // @ts-ignore: Property 'misocmd' does not exist on type 'Window & typeof globalThis'.
    const misocmd = window.misocmd || (window.misocmd = [])
    misocmd.push(async () => {
      // setup client
      // @ts-ignore: Property 'MisoClient' does not exist on type 'Window & typeof globalThis'.
      const MisoClient = window.MisoClient
      const client = new MisoClient(MISO_API_KEY, { timeout: 5000 })
      const workflow = client.ui.hybridSearch

      try {
        workflow.useApi({
          fq: 'product_id:/mirrormedia_.+/',
          source_fl: [
            'cover_image',
            'url',
            'created_at',
            'updated_at',
            'published_at',
            'title',
            'section_name',
          ],
          fl: [
            'cover_image',
            'url',
            'created_at',
            'updated_at',
            'published_at',
            'title',
            'tags',
          ],
        })
        workflow.useLayouts({
          query: {
            placeholder: 'Ask anything!',
          },
          products: [
            'list',
            {
              templates: {
                product: renderProduct,
              },
            },
          ],
        })
        workflow.useFilters({
          sort: {
            options: [
              { field: 'relevance', text: '關聯性', default: true },
              { field: 'published_at', text: '由新到舊' },
            ],
          },
        })
        workflow.answer.on('request', ({ payload: { q } }) => {
          router.push(`/search/${q}`, undefined, { shallow: true })
        })

        // wait for styles to be loaded
        await client.ui.ready

        // render DOM and get element references
        const defaults = MisoClient.ui.defaults.hybridSearch
        let templates = defaults.templates.root({ answerBox: true })
        templates = insertElement(templates)
        const wireAnswerBox = defaults.wireAnswerBox

        const rootElement = document.querySelector('#miso-hybrid-search-combo')
        rootElement.innerHTML = templates

        wireAnswerBox(client, rootElement)

        // start query if specified in URL parameters
        setTimeout(() => {
          workflow.query({ q: searchTerms })
        }, 1000)
      } catch (error) {
        console.error(error)
      }
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
