/**
 * 用於在載入頁面時向 Miso 回報 pageview 的 component。
 * 此元件僅用於 client-side（務必使用 dynamic import），並依據登入狀態與 `firebaseId` 回傳互動資料。
 *
 * @component
 * @param {Object} props - Component props
 * @param {string[] | 'href'} props.productIds
 *
 * @returns {null} 此元件不會渲染任何可見內容，僅用於觸發 Miso 上報邏輯
 */
import { useMembership } from '../context/membership'
import { MISO_API_KEY } from '../config/index.mjs'
import { useEffect } from 'react'

export default function MisoPageView({ productIds }) {
  const { isLogInProcessFinished, firebaseId } = useMembership()
  useEffect(() => {
    // @ts-ignore: Property 'misocmd' does not exist on type 'Window & typeof globalThis'.
    const misocmd = window.misocmd || (window.misocmd = [])
    misocmd.push(() => {
      // @ts-ignore: Property 'MisoClient' does not exist on type 'Window & typeof globalThis'.
      const MisoClient = window.MisoClient
      const client = new MisoClient(MISO_API_KEY)
      if (isLogInProcessFinished) {
        if (firebaseId) {
          client.context.user_id = firebaseId
        }
        client.api.interactions.upload({
          type: 'product_detail_page_view',
          product_ids: [`mirrormedia_${productIds}`],
        })
      }
    })
  }, [isLogInProcessFinished])

  return <></>
}
