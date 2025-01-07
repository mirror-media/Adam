This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Reminder

### 使用 .mjs 副檔名的時機

為了要能讓 `node` 能用 ES module 的方式來處理 import/export，可以藉由選擇以下其中一個方法來達成：

1. 副檔名為 `.mjs`
2. 在 `pacakge.json` 中，設定 `type` 為 `"module"`

而我們選擇方法 1，將 `node` 使用到的 ES module 檔案的副檔名設定為 `.mjs`，在有限的範圍內控制其行為

Ref: [ECMAScript Modules | Node.js](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_enabling)

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

### 使用 JSDoc 寫出與 TypeScript 中 `as const` 等效的註解
```
/** @type {const} */ ([something]) 
```
ref: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#casts


## Environment Variables (環境變數)

| 變數名稱 | 資料型態 | 初始值 | 變數說明 |
| ------ | ------ | ------ | ------ |
| NEXT_PUBLIC_ENV | 字串 | 'local' | 系統環境 (`local`, `dev`, `staging`, `prod`) |
| NEXT_PUBLIC_IS_PREVIEW_MODE | 字串(布林) | `undefined` | 是否為 preview mode |
| PROXY_AMP | 字串 | `undefined` | 是否為 proxy AMP 模式 |
| PROXY_SERVER_PORT | 字串(整數) | `3000` | proxy server port |
| PROXIED_SERVER_PORT | 字串(整數) | `3001` | 被 proxy 的 next.js server port |
| FIREBASE_ADMIN_CREDENTIAL | 字串(JSON) | '' | Firebase 專案所屬服務帳號的密鑰資訊，參考：[Initialize the SDK in non-Google environments#To generate a private key file for your service account](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) |
| NEWEBPAY_PAPERMAG_KEY | 字串 | `'newebpay-papermag-key'` | 藍新商店 key |
| NEWEBPAY_PAPERMAG_IV | 字串 | `'newebpay-papermag-iv'` | 藍新商店 iv |
| GOOGLE_SHEETS_PRIVATE_KEY | 字串(JSON) | `''` | 呼叫 google sheet API 所使用的 service account token 資訊 |
| GOOGLE_SHEETS_CLIENT_EMAIL | 字串 | `undefined` | 呼叫 google sheet API 所使用的 service account 名稱 |
| GOOGLE_SHEETS_CLIENT_ID | 字串 | `undefined` | 呼叫 google sheet API 所使用的 service account ID |
| GOOGLE_SHEET_SLOT_ID | 字串 | `undefined` | 抽獎資訊所使用的 spreadsheet ID |

## Environment Variables for search only (Search 限定的環境變數)
| 變數名稱 | 資料型態 | 初始值 | 變數說明 |
| ------ | ------ | ------ | ------ |
| URL_SEARCH | 字串 | `''` | SearchLite API 的網址 |
| REDIS_AUTH | 字串 | `undefined` | Redis 認證密碼 |
| REDIS_HOST | 字串 | `''` | Redis 位址資訊 |
| REDIS_DB | 字串（數字） | `0` | Redis DB 資訊 |
| REDIS_EX | 字串(整數) | `3600` | redis 資料有效期長度 (秒) |
| REDIS_CONNECTION_TIMEOUT | 字串（整數） | `10000` | redis 連結 timeout 時間（微秒）|
