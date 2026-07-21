# API routes（API 路由）

此目錄使用 Next.js 內建的 [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)。每個 `pages/api/*.ts` 檔案會公開為同名的 `/api/*` endpoint（端點）。

## Endpoint inventory（端點清單）

| Route               | Source file       | 主要功能                                                                   |
| ------------------- | ----------------- | -------------------------------------------------------------------------- |
| `/api/healthz`      | `healthz.ts`      | 部署服務 health check（健康檢查）                                          |
| `/api/robots`       | `robots.ts`       | 產生 robots policy；`/robots.txt` 由 Next.js rewrite（路徑重寫）導入此端點 |
| `/api/papermag`     | `papermag.ts`     | 建立紙本雜誌訂單的 NewebPay（藍新金流）付款資料                            |
| `/api/tracking`     | `tracking.ts`     | 寫入 user behavior log（使用者行為紀錄）至 Google Cloud Logging            |
| `/api/error-report` | `error-report.ts` | 寫入 client-side error（用戶端錯誤）至 Google Cloud Logging                |
| `/api/search`       | `search.ts`       | 驗證搜尋參數，透過 Redis cache（Redis 快取）與 SearchLite API 取得搜尋結果 |
| `/api/googlesheet`  | `googlesheet.ts`  | 將指定 row（資料列）新增至 Google Spreadsheet；只接受 `POST`               |
| `/api/slot-sheet`   | `slot-sheet.ts`   | 讀寫抽獎活動的 Google Sheet、檢查參加狀態並計算中獎機率                    |

`utils/api/recommendation.ts` 是 server-side helper（伺服器端輔助函式），不是 API route；不存在 `/api/recomemd` 或 `/api/recommendation` endpoint。

### Search route boundary（搜尋路由邊界）

目前 `/search/[keyword]` 頁面使用 MISO client SDK，不會呼叫 repo 內的 `/api/search`。`/api/search` 仍是獨立的 SearchLite／Redis route，所需環境變數記錄於 package [`README.md`](../../README.md)。

雲端 load balancer（負載平衡器）可能把相同 public path（公開路徑）導向獨立 Search service，因此不能只依某個環境的 `/api/search` response 推論此 repo handler 的行為；排查時應同時確認實際 Cloud Run service、revision（修訂版本）與 Redis 設定。

### Validation behavior（驗證行為）

- `/api/search` 對 method（方法）與 query（查詢參數）執行 Zod validation（Zod 驗證）；不符合契約時回 HTTP 400。
- `/api/tracking` 與 `/api/error-report` 的 request body（請求內容）目前使用 Zod monitor mode（Zod 監測模式）：schema failure（結構失敗）會以 `[zod-monitor] schema validation failed` 記錄；monitor 本身不拒絕 request 或改變既有 response，handler 內原有的資料假設與錯誤處理仍照常生效。若要改成 enforcement mode（強制模式），必須另案評估真實流量與相容性。

## `healthz`

用於檢查目前部署的服務是否正常運作。

## `robots`

用於設定頁面可否被搜尋引擎存取與檢索。
詳細設定請參考 [Google 文件](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=zh-tw)。

## `papermag`

用於完成鏡週刊紙本雜誌購買的相關流程。

## `tracking`

用於將 log 寫入 [Google Cloud Logging](https://console.cloud.google.com/logs/)。
目前僅用於寫入 user-behavior-log。

該 API 會引入套件 `@google-cloud/logging`，而在 Google Cloud Run 部署的服務（[adam-mirror-media-next-dev](https://console.cloud.google.com/run/detail/asia-east1/adam-mirror-media-next-dev/metrics?project=mirrormedia-1470651750304)、[adam-mirror-media-next-staging](https://console.cloud.google.com/run/detail/asia-east1/adam-mirror-media-next-staging/metrics?project=mirrormedia-1470651750304)、[adam-mirror-media-next-prod](https://console.cloud.google.com/run/detail/asia-east1/adam-mirror-media-next-prod/metrics?project=mirrormedia-1470651750304) 等），皆有使用一隻名為 `mm-next` 的 Google Service Account，該 service account 具有寫入 Logging 的權限，因此不需要於檔案 `tracking.ts` 中設定相關權限。（mirror-media-nuxt 則需要額外設定 [`keyFilename`](https://github.com/mirror-media/mirror-media-nuxt/blob/b9949345c89dd09c4fc91e029393e363b94f5558/api/tracking.js#L7)。）

## Cloud Logging

### 如何在本地端開啟 Cloud Logging 寫入權限

由於本地端並沒有 Google Service Account 存在，如果開發期間需要啟動 Logging 服務，需要先將 service account 所生成的 keyfile json 檔下載到本地端，並且設定環境變數 `GOOGLE_APPLICATION_CREDENTIALS`，該環境變數的值為該 json 檔的路徑。

舉例來說，若 keyfile json 檔名為 `service-account-file.json` ，並放置於 `Adam/packages/mirror-media-next` 底下，`GOOGLE_APPLICATION_CREDENTIALS`則為：

```
GOOGLE_APPLICATION_CREDENTIALS= './service-account-file.json'
```

由於`Adam/packages/mirror-media-next/.gitignore` 已有設定`service-account-file.json` 為被 git 忽略追蹤的檔案，建議將 keyfile json 放置在`Adam/packages/mirror-media-next` 底下，並將該檔案命名為 `service-account-file.json`，避免機敏檔案上到 GitHub。

雲端部署的服務，皆不需要設定環境變數 `GOOGLE_APPLICATION_CREDENTIALS`。

#### 如何取得 keyfile json 檔

有兩種方式：

1. 向其他同事索取已經生成的 keyfile json 檔。需要注意的是，該 json 檔 與 mirror-media-nuxt 使用的 `gcskeyfile.json`，是**不一樣**的檔案，請勿搞混。
2. 進入 [mm-next service account](https://console.cloud.google.com/iam-admin/serviceaccounts/details/100545292663403155422/keys?project=mirrormedia-1470651750304) 生成新的 service-account-file.json。

建議使用方法一，避免產生過多的 json 檔。

#### keyfile json 檔為機敏資料，請勿外流

因該 json 檔具有寫入 Logging 的權限，若該檔案外流將造成安全問題，請勿將該 json 檔給予非部門同仁，也不要將該檔案推到 GitHub 上。
