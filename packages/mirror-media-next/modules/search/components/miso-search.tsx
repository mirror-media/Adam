import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import MisoScript from '@/components/miso-script'
import { MISO_API_KEY } from '@/config/index.mjs'

import type { MisoAnswerEvent, MisoWindow, MisoWorkflow } from '../search-types'
import {
  insertSortElement,
  renderItems,
  renderList,
  renderProduct,
} from '../search-utils'

type MisoSearchProps = {
  searchTerms: string
}

export default function MisoSearch({ searchTerms }: MisoSearchProps) {
  const router = useRouter()
  const isInitializedRef = useRef(false)
  const workflowRef = useRef<MisoWorkflow | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isMisoReady, setIsMisoReady] = useState(false)

  useEffect(() => {
    if (isInitializedRef.current) return
    if (!isMisoReady) return

    const misoWindow = window as MisoWindow

    // Wait for page to be fully rendered before executing miso code
    const executeMiso = async () => {
      const initializeMisoSearch = async () => {
        const MisoClient = misoWindow.MisoClient
        if (!MisoClient) {
          return
        }

        const client = new MisoClient(MISO_API_KEY, { timeout: 5000 })
        const workflow = client.ui.hybridSearch
        workflowRef.current = workflow

        try {
          workflow.useApi({
            fq: 'product_id:/mirrormedia_story_.+/',
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
            snippet_max_chars: 60,
          })
          workflow.useLayouts({
            query: {
              placeholder: 'Ask anything!',
            },
            products: [
              'list',
              {
                templates: {
                  items: renderItems,
                  list: renderList,
                  product: renderProduct,
                },
              },
            ],
          })
          workflow.useFilters({
            sort: {
              options: [
                { field: 'relevance', text: '關聯性' },
                { field: 'published_at', text: '由新到舊', default: true },
              ],
            },
          })
          workflow.answer.on(
            'request',
            ({ payload: { q } }: MisoAnswerEvent) => {
              router.push(`/search/${q}`, undefined, { shallow: true })
            }
          )

          // wait for styles to be loaded
          await client.ui.ready

          // render DOM and get element references
          const defaults = MisoClient.ui.defaults.hybridSearch
          const templates = defaults.templates.root({ answerBox: true })
          const wireAnswerBox = defaults.wireAnswerBox

          const rootElement = document.querySelector(
            '#miso-hybrid-search-combo'
          )
          if (!rootElement) {
            return
          }
          rootElement.innerHTML = insertSortElement(templates)

          wireAnswerBox(client, rootElement)

          isInitializedRef.current = true

          // start query if specified in URL parameters
          if (searchTerms) {
            setTimeout(() => {
              workflow.query({ q: searchTerms })
            }, 1000)
          }
        } catch (error) {
          console.error(error)
        }
      }

      if (misoWindow.MisoClient) {
        await initializeMisoSearch()
        return
      }

      const misocmd = misoWindow.misocmd || (misoWindow.misocmd = [])
      misocmd.push(initializeMisoSearch)
    }

    // Execute after page is fully loaded to avoid blocking TTFB
    if (document.readyState === 'complete') {
      // Page already loaded, execute immediately
      executeMiso()
    } else {
      // Wait for page to finish loading
      window.addEventListener('load', executeMiso, { once: true })
    }

    return () => {
      window.removeEventListener('load', executeMiso)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMisoReady])

  // 當 searchTerms 變化時，只更新查詢（不重新初始化）
  useEffect(() => {
    if (!isInitializedRef.current || !workflowRef.current) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 延遲執行查詢，避免頻繁觸發
    timeoutRef.current = setTimeout(() => {
      if (workflowRef.current && searchTerms) {
        workflowRef.current.query({ q: searchTerms })
      }
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerms])

  return (
    <div className="mm-miso-search">
      <MisoScript onReady={() => setIsMisoReady(true)} />
      <div id="miso-hybrid-search-combo" className="miso-hybrid-search-combo" />
    </div>
  )
}
