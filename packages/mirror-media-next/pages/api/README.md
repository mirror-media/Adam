
為 Next.js 內建的 [API route](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)。放置於該資料夾底下的檔案，都會被視為 public API，並可透過url `/api/*` (`*` 即為檔案名稱)向特定 API 發起請求。

以下為目前 API endpoint 的名稱與主要功能：

## `healthz`
用於檢查目前部署的服務是否正常運作。

## `robots`
用於設定頁面可否被搜尋引擎存取與檢索。
詳細設定請參考 [Google文件](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=zh-tw)。

## `papermag`
用於完成鏡週刊紙本雜誌購買的相關流程。

## `slot-sheet`
用於完成鏡週刊拉霸機抽獎活動的相關流程。

## `tracking`
用於將 log 寫入 [Google Cloud Logging]。(https://console.cloud.google.com/logs/)。
目前僅用於寫入 user-behavior-log。

該 API 會引入套件 `@google-cloud/logging`，而在Google Cloud Run 部署的服務( [adam-mirror-media-next-dev](https://console.cloud.google.com/run/detail/asia-east1/adam-mirror-media-next-dev/metrics?project=mirrormedia-1470651750304), [adam-mirror-media-next-staging](https://console.cloud.google.com/run/detail/asia-east1/adam-mirror-media-next-staging/metrics?project=mirrormedia-1470651750304), [adam-mirror-media-next-prod](https://console.cloud.google.com/run/detail/asia-east1/adam-mirror-media-next-prod/metrics?project=mirrormedia-1470651750304) 等)，皆有使用一隻名為`mm-next`的Google Service Account，該service account具有寫入Logging的權限，因此不需要於檔案 `tracking.js` 中設定相關權限。（ mirror-media-nuxt 則需要額外設定[`keyFilename`](https://github.com/mirror-media/mirror-media-nuxt/blob/b9949345c89dd09c4fc91e029393e363b94f5558/api/tracking.js#L7)）

### 如何在本地端開啟 Cloud Logging 寫入權限
由於本地端並沒有Google Service Account 存在，如果開發期間需要啟動Logging服務，需要先將service account所生成的 keyfile json檔下載到本地端，並且設定環境變數 `GOOGLE_APPLICATION_CREDENTIALS`，該環境變數的值為該json檔的路徑。

舉例來說，若keyfile json檔名為 `service-account-file.json` ，並放置於 `Adam/packages/mirror-media-next` 底下，`GOOGLE_APPLICATION_CREDENTIALS`則為：

```
GOOGLE_APPLICATION_CREDENTIALS= './service-account-file.json'
```

由於`Adam/packages/mirror-media-next/.gitignore` 已有設定`service-account-file.json` 為被 git 忽略追蹤的檔案，建議將keyfile json 放置在`Adam/packages/mirror-media-next` 底下，並將該檔案命名為 `service-account-file.json`，避免機敏檔案上到GitHub。

雲端部署的服務，皆不需要設定環境變數 `GOOGLE_APPLICATION_CREDENTIALS`。

#### 如何取得 keyfile json檔

有兩種方式：
1. 向其他同事索取已經生成的 keyfile json檔。需要注意的是，該 json檔 與 mirror-media-nuxt 使用的 `gcskeyfile.json`，是**不一樣**的檔案，請勿搞混。
2. 進入 [mm-next service account](https://console.cloud.google.com/iam-admin/serviceaccounts/details/100545292663403155422/keys?project=mirrormedia-1470651750304) 生成新的service-account-file.json。

建議使用方法一，避免產生過多的 json檔。

#### keyfile json檔為機敏資料，請勿外流
因該 json檔具有寫入Logging的權限，若該檔案外流將造成安全問題，請勿將該 json檔給予非部門同仁，也不要將該檔案推到GitHub上。



