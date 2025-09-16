# Novelty - エンジニア採用選考課題

ノベルティの採用選考課題として作成されたウェブサイトのトップページです。

## 🚀 開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルに以下の値を設定：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

### 3. microCMSの設定

#### ブログAPI

- エンドポイント: `blog`
- 必要フィールド:
  - `title` (テキスト)
  - `content` (リッチエディタ)
  - `excerpt` (テキスト)
  - `eyecatch` (画像)
  - `category` (コンテンツ参照 - ブログカテゴリー)

#### ブログカテゴリーAPI

- エンドポイント: `category`
- 必要フィールド:
  - `name` (テキスト)
  - `slug` (テキスト)

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:4321` にアクセス

## 🧞 コマンド

| コマンド               | 説明                   |
| :--------------------- | :--------------------- |
| `npm run dev`          | 開発サーバーを起動     |
| `npm run build`        | 本番用ビルド           |
| `npm run preview`      | ビルド結果をプレビュー |
| `npm run lint`         | ESLintでコードチェック |
| `npm run lint:fix`     | ESLintで自動修正       |
| `npm run format`       | Prettierでフォーマット |
| `npm run format:check` | フォーマットチェック   |
| `npm run type-check`   | TypeScriptの型チェック |

## 🌐 デプロイ（Cloudflare Pages）

### 1. Cloudflare Pagesでプロジェクトを作成

1. Cloudflare Dashboardにログイン
2. Pages > Create a project
3. GitHubリポジトリを接続

### 2. ビルド設定

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

### 3. 環境変数の設定

Cloudflare Pagesの設定で以下の環境変数を追加：

- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`

### 4. Webhook設定（microCMS）

microCMSの設定でWebhookを追加：

- **URL**: `https://your-site.pages.dev/api/webhook`
- **トリガー**: コンテンツの公開・更新・削除
- **対象API**: `blog`, `category`

### 5. Webhook用環境変数の設定

Cloudflare Pagesで以下の追加環境変数を設定：

- `BUILD_HOOK_URL`: Cloudflare PagesのBuild Hook URL
- `SITE_DOMAIN`: サイトのドメイン名

これらの設定により、microCMSでコンテンツを更新すると自動的にサイトが再ビルドされ、最新の情報が反映されます。
