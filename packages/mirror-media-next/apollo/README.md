# Apollo data layer（Apollo 資料層）

此目錄為專案自訂，非 Next.js 框架自動生成，放置 Mirror Media 的 GraphQL client（GraphQL 用戶端）、hand-written operations（手寫操作）、schema snapshots（結構快照）與 GraphQL Codegen（GraphQL 程式碼生成）產物。

## Directory layout（目錄結構）

- `apollo-client.js`：既有 Apollo Client 設定；content／member 共用 client 並以 `context.uri` 切換 endpoint，story 使用另外的 server-side singleton（伺服器端單例）。這是漸進 TypeScript 遷移期間保留的既有 JavaScript；不要以它作為新增 `.js` 檔的先例。
- `fragments/`、`query/`、`membership/`：手寫的 fragments（片段）、queries（查詢）與 mutations（異動）。
- `schema/{content,member,story}.graphql`：三個 GraphQL endpoint 的 committed SDL snapshots（已提交 SDL 快照）。Codegen 不會在一般 build 中連線到遠端 introspection（結構自省）。
- `__generated__/{content,member,story}/`：由 GraphQL Codegen 產生的型別與 `graphql()` helper。不要手動修改。
- `codegen-documents/story.graphql`：story endpoint 專用的 Codegen input（輸入）；不可直接把 content-only fragments 混入。

## Type strategy（型別策略）

GraphQL schema 是 server-enforced contract（伺服器強制契約），因此 GraphQL response 型別使用 Codegen 與 `TypedDocumentNode`，不在每次 SSR request（伺服器端渲染請求）上再以 Zod 重複 parse。

Zod 保留給沒有同等契約的資料邊界，例如 GCS static JSON（GCS 靜態 JSON）、REST 與 search API。這些 schema 位於各自的 consumer（使用端）附近，不放在 Apollo generated output 中。

content、member 與 story 是三個不同的 Codegen project（程式碼生成專案）。尤其 story schema 不支援所有 content fragments；新增或搬移 operation 時，必須確認文件由正確 project 生成，不能為了通過 Codegen 而混用 endpoint-specific fields（端點限定欄位）。

## Workflow（操作流程）

在 `packages/mirror-media-next` 執行：

```bash
# Regenerate committed output from the local schema snapshots
pnpm codegen

# Regenerate and fail if schema/generated output is stale or dirty
pnpm codegen:check

# Verify TypeScript consumers
pnpm typecheck
```

當後端 schema 有意變更時：

1. 明確更新對應的 `apollo/schema/*.graphql` snapshot。
2. 執行 `pnpm codegen`。
3. 檢查並提交 schema snapshot 與 `apollo/__generated__/` 的差異。
4. 執行 `pnpm codegen:check`、`pnpm typecheck` 與相關 build／route regression（路由回歸）。

生成檔必須提交進 repository（儲存庫），確保 local、CI（持續整合）與 Docker build 不依賴外部 introspection availability（結構自省可用性）。
