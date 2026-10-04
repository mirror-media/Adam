import BaseMicroAd from '@/components/ads/micro-ad/micro-ad'

type MicroAdProps = {
  unitId: string
}

/**
 * A MicroAd slot shaped like an article row. The markup comes from MicroAd, so
 * the styling lives in `micro-ad.css`, which in `styles/tailwind.css`
 */
export function MicroAd({ unitId }: MicroAdProps) {
  /*
    TODO:
    BaseMicroAd 元件不會讀取 `type`，它把這個 prop 宣告成必填，
    是為了讓外層的 styled-components 包裝（舊 micro-ad-with-label 元件）能依它切換樣式，
    而這個元件並沒有這樣做。

    因為還有其他元件使用舊的 micro-ad-with-label，
    所以無法移除最底層的 micro-ad 元件的 props type 定義。
    這裡傳它只是為了滿足那個宣告 — 其他呼叫端依賴著它，所以不動。

    未來在舊的 styled-components 都移除時，
    就可以移除 type="LISTING"
  */
  return (
    <BaseMicroAd
      unitId={unitId}
      type="LISTING"
      className="mm-micro-ad-listing"
    />
  )
}
