import { sendGTMEvent } from '@next/third-parties/google'

import {
  DATA_LAYER_DIMENSION_KEYS,
  type InteractionEvent,
  type ResolvedDataLayerPayload,
} from '@/types/dataLayer'
import { compactDataLayer } from '@/utils/gtm/build-data-layer'

/**
 * CSR 換頁時更新 dataLayer 維度，不帶 event。
 * 非本頁欄位會清成 undefined，避免上一頁殘留。
 */
export function pushDataLayer(fields: ResolvedDataLayerPayload = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const compact = compactDataLayer(fields)
  const payload: Record<string, string | undefined> = {}

  for (const key of DATA_LAYER_DIMENSION_KEYS) {
    payload[key] = compact[key]
  }

  sendGTMEvent(payload)
}

/**
 * 送出互動事件。click_item / share 的 term、share_channel 由 GTM 讀 GTM-* class，不要放進 payload。
 */
export function sendInteractionEvent(payload: InteractionEvent) {
  if (typeof window === 'undefined') {
    return
  }

  sendGTMEvent(payload)
}
