# mirror-media-next

Mirror Media 的主要新聞網站，採 Next.js 15、React 19、Pages Router（頁面路由器）、Apollo Client 與 styled-components，並以 server-side rendering（伺服器端渲染）提供內容與會員個人化頁面。

## Requirements（執行需求）

- Node.js `>=24.0.0 <25.0.0`
- pnpm `10.17.1`

Monorepo（單一儲存庫）相依套件必須從 repository root（儲存庫根目錄）安裝：

```bash
pnpm install
```

## Getting Started

Go to this package directory:

```bash
cd packages/mirror-media-next
```

Run package commands:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm codegen:check
pnpm test:smoke
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Docker

Dockerfile 需要完整的 pnpm workspace（pnpm 工作區），因此 image（映像檔）必須從 repository root 建置，不可在本 package 目錄直接使用 `docker build .`：

```bash
docker build \
  -f packages/mirror-media-next/Dockerfile \
  --build-arg NEXT_PUBLIC_ENV=dev \
  -t mirror-media-next \
  .
```

一般 runtime（執行期）：

```bash
docker run --rm -p 3000:3000 mirror-media-next
```

AMP proxy runtime（AMP 代理執行期）：

```bash
docker run --rm -e PROXY_AMP=true -p 3000:3000 mirror-media-next
```

## v4.0 架構基準

`mirror-media-next` v4.0 的現行架構與維護限制如下；只有在對應實作完成變更後，才應同步更新或移除這些限制：

- Framework and routing（框架與路由）：使用 Next.js 15.5.20、React 19.2.7 與 Pages Router（頁面路由器），並保留 `/story/amp/[slug]`、`/external/amp/[slug]` 內建 AMP 路由。Next.js 16 已移除內建 AMP API；升級前必須先決定 AMP 的替代或退場方式，並驗證 Turbopack（打包工具）與 SVG、GraphQL 等既有 webpack loaders（webpack 載入器）的相容性。
- App Router（應用程式路由器）：目前未使用。若要導入，必須同時設計 `getServerSideProps`、styled-components SSR、Apollo SSR 與會員個人化驗證流程的替代方案；不可只搬移路由檔案。
- Deployment（部署）：Docker runtime（Docker 執行期）依賴 `output: 'standalone'`、monorepo output tracing（單一儲存庫輸出追蹤）與 repository-root build context（儲存庫根目錄建置上下文）。調整 Next.js、pnpm workspace 或 Dockerfile 後，必須確認一般模式及 `PROXY_AMP=true` 都能建置與啟動。
- TypeScript：採 `strict: true`、`allowJs: true` 漸進遷移；既有 JavaScript 可繼續維護，但不得新增 application（應用程式）`.js`／`.jsx` 檔，請使用 `.ts`／`.tsx`。

### Auth-only Service Worker（僅供身分驗證的服務工作執行緒）

Mirror 不是 PWA（漸進式網頁應用程式）。目前 Service Worker 只負責替 same-origin（同來源）的 HTML 與 `/_next/data` SSR（伺服器端渲染）request 注入 Firebase ID token 的 `Authorization: Bearer` header，以保留會員個人化內容：

- Source：`service-worker/index.js`
- Build output：`public/sw.js`
- Build command：`pnpm build:sw`；`pnpm build` 會先自動執行
- Registration：由 `pages/_app.js` 在 production mode（正式模式）手動註冊

請勿把它改造成 offline cache（離線快取）、precache（預先快取）或 installable PWA（可安裝式 PWA），也不要重新引入 `next-pwa`／Workbox。若要改寫或移除，必須先另外規劃 Pages Router 個人化 SSR authentication flow（身分驗證流程）的替代方案，並驗證登入與 `/_next/data` 的 Authorization header。

### Data contracts（資料契約）

- GraphQL 的 content、member 與 story schema snapshots（結構快照）存放於 `apollo/schema/`，GraphQL Codegen（GraphQL 程式碼生成）的輸出存放於 `apollo/__generated__/`。Schema 或 query 變更後執行 `pnpm codegen`，並以 `pnpm codegen:check` 確認生成結果一致；GraphQL response 不重複執行 Zod parse。
- GCS static JSON（GCS 靜態 JSON）、REST 與 repo 內的 SearchLite API 等沒有 server-enforced contract（伺服器強制契約）的資料邊界使用 Zod runtime validation（Zod 執行期驗證）。Monitor mode（監測模式）只記錄 schema 差異並保留既有 response；enforcement mode（強制模式）才會拒絕不符合 schema 的資料。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Reminder

### 使用 `.mjs` 副檔名的時機

為了要能讓 `node` 能用 ES module 的方式來處理 import/export，可以藉由選擇以下其中一個方法來達成：

1. 副檔名為 `.mjs`
2. 在 `package.json` 中，設定 `type` 為 `"module"`

而我們選擇方法 1，將 `node` 使用到的 ES module 檔案的副檔名設定為 `.mjs`，在有限的範圍內控制其行為

Ref: [ECMAScript modules | Node.js](https://nodejs.org/api/esm.html#enabling)

### 請勿刪除前綴為 `GTM-` 的className

如果有元件具有前綴為`GTM-` 的className，比如説：

```
<div className="GTM-some-component">
  //...
</div>
```

該className是用於Google Tag Manager 蒐集事件數據，除非為Google Tag Manager相關的改動，
否則請勿隨意刪除該className，以避免無法正確蒐集數據等錯誤發生。

該className僅用於協助Google Tag Manager蒐集數據，請勿使用該className切版。

### 在調整 element 的 className 時需注意

在調整 element 的 `className` 時，請特別留意 story、topic 頁面：
這些頁面上的部分 `className` 可能是前人刻意保留，用於 CMS 傳遞的自訂 CSS style，用來覆寫原有樣式。

請勿隨意刪除或更動，避免造成某些特定頁面樣式錯誤。

### 既有 JavaScript 使用 JSDoc 寫出與 TypeScript 中 `as const` 等效的註解

此寫法只供尚未遷移的既有 JavaScript 使用；新增或重寫的 application code 請使用 TypeScript 與 `as const`，不得新增 `.js`／`.jsx` 檔。

```
/** @type {const} */ ([something])
```

ref: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#casts

## Environment Variables (環境變數)

| 變數名稱                    | 資料型態   | 初始值                    | 變數說明                                                                                                                                                                                                                                       |
| --------------------------- | ---------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_ENV             | 字串       | 'local'                   | 系統環境 (`local`, `dev`, `staging`, `prod`)                                                                                                                                                                                                   |
| NEXT_PUBLIC_IS_PREVIEW_MODE | 字串(布林) | `undefined`               | 是否為 preview mode                                                                                                                                                                                                                            |
| PROXY_AMP                   | 字串       | `undefined`               | 是否為 proxy AMP 模式                                                                                                                                                                                                                          |
| PROXY_SERVER_PORT           | 字串(整數) | `3000`                    | proxy server port                                                                                                                                                                                                                              |
| PROXIED_SERVER_PORT         | 字串(整數) | `3001`                    | 被 proxy 的 next.js server port                                                                                                                                                                                                                |
| FIREBASE_ADMIN_CREDENTIAL   | 字串(JSON) | ''                        | Firebase 專案所屬服務帳號的密鑰資訊，參考：[Initialize the SDK in non-Google environments#To generate a private key file for your service account](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) |
| NEWEBPAY_PAPERMAG_KEY       | 字串       | `'newebpay-papermag-key'` | 藍新商店 key                                                                                                                                                                                                                                   |
| NEWEBPAY_PAPERMAG_IV        | 字串       | `'newebpay-papermag-iv'`  | 藍新商店 iv                                                                                                                                                                                                                                    |
| GOOGLE_SHEETS_PRIVATE_KEY   | 字串(JSON) | `''`                      | 呼叫 google sheet API 所使用的 service account token 資訊                                                                                                                                                                                      |
| GOOGLE_SHEETS_CLIENT_EMAIL  | 字串       | `undefined`               | 呼叫 google sheet API 所使用的 service account 名稱                                                                                                                                                                                            |
| GOOGLE_SHEETS_CLIENT_ID     | 字串       | `undefined`               | 呼叫 google sheet API 所使用的 service account ID                                                                                                                                                                                              |
| GOOGLE_SHEET_SLOT_ID        | 字串       | `undefined`               | 抽獎資訊所使用的 spreadsheet ID                                                                                                                                                                                                                |
| STORY_GQL_ENDPOINT          | 字串       | 依 `NEXT_PUBLIC_ENV` 決定 | 覆寫 story GraphQL endpoint；未設定時使用各環境預設值                                                                                                                                                                                          |
| GCS_FUSE_MOUNT_DIR          | 字串       | `/statics`                | Server-side static JSON 的 GCS FUSE mount path                                                                                                                                                                                                 |
| GCS_FUSE_STATIC_BUCKET      | 字串       | 依 `NEXT_PUBLIC_ENV` 決定 | GCS FUSE static bucket 名稱                                                                                                                                                                                                                    |

提醒：新增的環境變數若在 dev/prod 環境無法正常讀取， 須到 GCP (Google Cloud Platform) 的編輯觸發條件更新替代變數

## Environment Variables for search only (Search 限定的環境變數)

此組變數只供 repo 內的 `/api/search` SearchLite／Redis 路徑使用。目前 `/search/[keyword]` 使用 MISO client SDK，不應假設它會呼叫 `/api/search`；雲端環境也可能把同一路徑 routing（路由）到獨立 Search service，部署時需另外確認。

| 變數名稱                 | 資料型態     | 初始值      | 變數說明                        |
| ------------------------ | ------------ | ----------- | ------------------------------- |
| URL_SEARCH               | 字串         | `''`        | SearchLite API 的網址           |
| REDIS_AUTH               | 字串         | `undefined` | Redis 認證密碼                  |
| REDIS_HOST               | 字串         | `''`        | Redis 位址資訊                  |
| REDIS_DB                 | 字串（數字） | `0`         | Redis DB 資訊                   |
| REDIS_EX                 | 字串(整數)   | `3600`      | redis 資料有效期長度 (秒)       |
| REDIS_CONNECTION_TIMEOUT | 字串（整數） | `10000`     | Redis 連線 timeout 時間（毫秒） |
