# 專案簡介

本專案為一個以 React + TypeScript + Vite 為基礎的影片逐字稿輔助工具，支援影片播放、逐字稿顯示與重點高亮。

## 專案架構

- `src/api/`：AI 逐字稿資料 API（aiTranscript.ts）。
- `src/components/VideoPreview/`：影片播放器元件，支援上傳、播放、進度、音量、跳段。
- `src/components/VideoTranscript/`：逐字稿顯示元件，支援高亮、跳段、即時滾動。
- `src/types/`：統一管理 TypeScript 型別。
- 其他：專案設定、靜態資源、樣式等。

## 主要功能

- 影片播放器：
  - 上傳本地影片並播放
  - 進度條、時間、音量、靜音控制
  - 拖曳上傳、點擊進度條跳段
  - 依逐字稿高亮重點片段
- 逐字稿顯示：
  - 分區段顯示逐字稿
  - 目前播放區間自動高亮與滾動
  - 點擊逐字稿跳至對應時間
- AI 逐字稿 API：
  - 回傳分段逐字稿與重點句子
  - 型別集中於 `src/types/index.ts` 方便維護

## 技術工具與選用原因

- **React**：主流前端框架，組件化、易維護
- **TypeScript**：靜態型別，提升可靠性
- **Vite**：快速建構、熱更新體驗佳
- **CSS Modules**：元件化樣式，避免污染
- **ESLint**：維持程式碼品質
- **Vercel**：自動化部署、全球 CDN、HTTPS 支援

> 選用這些技術可提升專案可維護性、開發效率與團隊協作便利性，並利於未來擴充。

## 部署說明

本專案使用 Vercel 進行自動化部署：

1. 每次推送至 main 分支時，Vercel 會自動：
   - 執行 `npm install`
   - 執行 `npm run build`
   - 部署至全球 CDN
   - 提供 HTTPS 支援

2. 部署網址：
   - 主網址：`https://video-ai.vercel.app`
   - 預覽網址：每次 PR 都會產生一個預覽網址

3. 環境變數：
   - 目前無需特殊環境變數設定

---
