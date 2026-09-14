export type MisoProduct = {
  cover_image?: string
  product_id: string
  published_at: string | number
  snippet?: string
  /** [sectionName, sectionSlug] */
  tags?: string[]
  title: string
  url: string
}

/**
 * SDK 沒有型別定義。這裡只描述我們真的呼叫到的部分，其餘留給 `unknown`
 *
 * `templates` 只列出我們會從 layout 上讀回來呼叫的兩支。SDK 上面還有很多支。
 */
export type MisoLayout = {
  templates: {
    items: MisoItemsTemplate
    product: MisoProductTemplate
  }
}

export type MisoProductTemplate = (
  layout: MisoLayout,
  state: unknown,
  product: MisoProduct
) => string

export type MisoItemsTemplate = (
  layout: MisoLayout,
  state: unknown,
  products: MisoProduct[]
) => string

export type MisoWorkflow = {
  answer: {
    on: (event: string, handler: (payload: MisoAnswerEvent) => void) => void
  }
  query: (args: { q: string }) => void
  useApi: (options: Record<string, unknown>) => void
  useFilters: (options: Record<string, unknown>) => void
  useLayouts: (options: Record<string, unknown>) => void
}
export type MisoAnswerEvent = { payload: { q: string } }
export type MisoClientInstance = {
  ui: { hybridSearch: MisoWorkflow; ready: Promise<unknown> }
}
export type MisoClientConstructor = {
  new (apiKey: string, options: { timeout: number }): MisoClientInstance
  ui: {
    defaults: {
      hybridSearch: {
        templates: { root: (options: { answerBox: boolean }) => string }
        wireAnswerBox: (client: MisoClientInstance, root: Element) => void
      }
    }
  }
}

export type MisoWindow = Window & {
  MisoClient?: MisoClientConstructor
  misocmd?: (() => void)[]
}
