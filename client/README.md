# Health Check App v2 (Client)

## プロジェクト概要
- 日々の健康状態と作業予定を記録し、メンバー全体の状況を可視化する React アプリケーションです。
- タスク管理・掲示板・共通／個別リンク集・個人専用 TODO など、業務サポート機能をひとつの UI に統合しています。
- 画面共通のサイドバー (`src/components/Layout.js`) から各ページへ遷移し、`REACT_APP_API_URL` で指定したバックエンド API にアクセスします。

## セットアップ
1. 依存インストール:
   ```bash
   npm install
   ```
2. API エンドポイントを `.env` で設定します (`REACT_APP_API_URL=http://localhost:5500` 等)。
3. 開発サーバー起動:
   ```bash
   npm start
   ```
4. ビルド:
   ```bash
   npm run build
   ```

## 主要機能と責務
### 健康チェック
- ホーム (`src/pages/MainPage.js`) で氏名クエリに基づき体調フォーム・未読掲示・タスク通知・リンク・本日の記録を表示。
- フォーム状態管理: `src/hooks/useFormState.js`, `src/hooks/useInitializeHealthForm.js`, 送信ロジック: `src/hooks/useHealthSubmit.js`。
- 入力 UI: `src/components/HealthForm.js`。前日内容の反映・ユーザー別サイド画像(localStorage保存)をサポート。
- 一覧表示: 当日表 `src/components/TodayRecordTable.js`, 月次表 `src/components/HealthTable.js` + CSV 出力 `src/components/CsvExportPanel.js`。
- 一括登録: `src/pages/AdminPage.js` で平日のみを抽出して複数ユーザーへ登録。

### タスク管理
- 一覧ページ `src/pages/TaskPage.js` は開始前／進行中／完了済みを分類し、メンバー別フィルタを提供。
- API 操作は `src/hooks/task/useTasks.js` に集約。追加フォーム `src/hooks/task/useTaskForm.js`, `src/hooks/task/useAddTaskSubmit.js`。
- UI コンポーネント: `src/components/task/TaskForm.js`, `src/components/task/TaskList.js`, `src/components/task/TaskCard.js`。期日差で警告色を制御し、添付ファイルの追加・削除をサポート。
- ホーム上のタスク警告: `src/components/task/TaskNotification.js`。

### 掲示板
- ページ構成: `src/pages/BulletinPage.js`。
- 投稿フォーム `src/components/bulletin/BulletinForm.js` は添付ファイル・投稿者選択に対応。
- 一覧表示と既読管理: `src/components/bulletin/BulletinList.js`, `src/components/bulletin/BulletinCard.js`。
- ホーム向け抜粋カード: `src/components/bulletin/MainBulletinCard.js`。
- データ操作は `src/hooks/bulletin/useBulletins.js`, 編集フローは `src/hooks/bulletin/useEditBulletinForm.js`。

### リンク管理
- サイドバー共通リンク: `src/components/Layout.js` が `links:update` イベントを購読して最新化。
- ホームのリンクセクション: `src/components/LinkSection.js`。
- 作成／編集 UI: `src/pages/LinkBuilderPage.js`。共通と個別リンクを切り替えて管理します。
- ユーザークイックリンク: `src/components/UserQuickLink.js`。

### 個人用 TODO
- ページ: `src/pages/TodoPersonalPage.js`。localStorage 保存用の `useLocalStorage` フックを利用。
- 表示レイヤー: `src/components/todo/view/TodoPersonalView.js` (フォーム折りたたみ・カテゴリ並べ替え対応)。
- タスク追加: `src/components/todo/form/TodoForm.js`。
- ドラッグ＆ドロップボード: `src/components/todo/board/DndBoard.js` と `src/components/todo/list/TodoItem.js`。

## 主なカスタムフック / ユーティリティ
- `src/hooks/useHealthRecords.js`: 月次健康記録と氏名一覧の取得、POST 後の再読み込み。
- `src/hooks/useLocalStorage.js`: デバウンス付き localStorage 永続化。
- `src/utils/normalizeUrl.js`: ユーザー入力 URL 正規化。
- `src/constants/excludedConditions.js`: 年休など朝食入力を除外するステータス定義。

## ページとルート概要
| ルート | コンポーネント | 説明 |
|-------|----------------|------|
| `/` | `MainPage` | 氏名クエリ必須のホームダッシュボード。
| `/select` | `SelectUserPage` | 氏名選択メニュー。
| `/today` | `TodayRecordPage` | 当日の健康記録一覧。
| `/list` | `ListPage` | 月次表（体調/作業切替、CSV 出力）。
| `/tasks` | `TaskPage` | タスク管理。
| `/bulletin` | `BulletinPage` | 掲示板管理。
| `/link-builder` | `LinkBuilderPage` | 共通／個別リンク編集。
| `/names` | `NameList` | メンバー登録と削除。
| `/admin` | `AdminPage` | 健康記録の一括登録。
| `/todo` | `TodoPersonalPage` | 個人用 TODO ボード。

## 開発メモ
- すべての API コールは `REACT_APP_API_URL` ベースで `/api/...` エンドポイントに接続します。
- 長期利用を意識し、localStorage のキーはバージョン付き (`personal.todo.v2` 等) で管理しています。
- 画面共通スタイルは `src/styles/button.css` と各コンポーネント固有の CSS に分離されています。
