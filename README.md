# オールド腕時計のキャリバー説明書ライブラリ

SEIKO等の日本製腕時計の取扱説明書PDFを検索・閲覧できるサイトです。

> **重要: このプロジェクトはAIエージェントのみがコーディングを行います。**
> 人間はコードを直接編集せず、AIエージェントに指示を出すことで開発を進めます。
> そのため、すべてのAIエージェント用ファイル（`.claude/`, `.gemini/`, `.kimi/`, `.agents/`）は
> プロジェクトルートで一元管理し、シンボリックリンクで各ツールから参照しています。

## サイト情報

- **サイト名**: オールド腕時計のキャリバー説明書ライブラリ
- **URL**: https://vintage.watchdoc.workers.dev
- **デプロイ先**: Cloudflare Workers

## 技術スタック

- **フレームワーク**: Astro 5.x (Static Site Generation)
- **スタイリング**: Tailwind CSS 3.x
- **検索機能**: Pagefind
- **フォント**: Noto Sans JP (Google Fonts)

## ディレクトリ構造

```
/
├── src/
│   ├── components/     # Astroコンポーネント
│   ├── layouts/        # レイアウトテンプレート
│   ├── pages/          # ページコンポーネント
│   ├── data/           # 生成されるJSONデータ
│   └── styles/         # グローバルスタイル
├── public/
│   └── pdf/            # PDFファイル（615個）
├── scripts/
│   ├── generate-manifest.js  # データ生成スクリプト
│   └── generate-sitemap.js   # サイトマップ生成スクリプト
├── astro.config.mjs    # Astro設定
├── tailwind.config.mjs # Tailwind設定
└── _headers            # カスタムヘッダー設定
```

## ローカル開発

### 必要条件

- Node.js 18.x 以上
- npm 9.x 以上

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/watch-manual/vintage.git
cd vintage

# 依存関係をインストール
npm install

# PDFメタデータを生成
npm run generate-data

# サイトマップを生成
npm run generate-sitemap

# 開発サーバーを起動
npm run dev
```

開発サーバーは http://localhost:4321 で起動します。

### ビルド

```bash
# データ生成 + ビルド
npm run generate-data
npm run build

# プレビュー
npm run preview
```

ビルド結果は `dist/` ディレクトリに出力されます。

## データ生成スクリプト

`scripts/generate-manifest.js` は `public/pdf/` ディレクトリ内のPDFファイルをスキャンし、以下の処理を行います：

1. ファイル名をパースしてキャリバー番号を抽出
2. カテゴリ（Quartz/Digital/Mechanical/Other）を推測
3. `src/data/calibers.json` にメタデータを出力

### 対応するファイル名パターン

| パターン | 例 | 抽出結果 |
|---------|-----|---------|
| 単一キャリバー | `7T32A.pdf` | `["7T32A"]` |
| アンダースコア区切り | `2A22A_23A_29A_32A.pdf` | `["2A22A", "2A23A", "2A29A", "2A32A"]` |
| ハイフン区切り | `7T32B_7T42B.pdf` | `["7T32B", "7T42B"]` |
| シリーズ | `2A_series.pdf` | `["2Aシリーズ"]` |
| パート番号付き | `7D48-pt1.pdf` | `["7D48-pt1"]` |

## Cloudflare Workers デプロイ設定

| 項目 | 設定値 |
|-----|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | `/` |

### カスタムヘッダー

`_headers` ファイルにより、PDFファイルは1年間キャッシュされます。

## サイト構造

| パス | 内容 |
|-----|------|
| `/` | トップページ（検索 + カテゴリ + 人気キャリバー） |
| `/caliber/` | 全キャリバー一覧（アルファベット順） |
| `/caliber/[caliber]/` | 各キャリバー詳細ページ（PDFビューワー） |
| `/category/[category]/` | カテゴリ別一覧（quartz/digital/other） |

## 検索機能

Pagefind を使用した全文検索を提供：

- ビルド時に自動インデックス生成
- 日本語対応（部分一致検索）
- 検索対象：キャリバー番号 + ファイル名

## AIエージェント向けファイル構成

| ファイル | 役割 |
|---------|------|
| `.mcp.json` | MCPサーバー設定（`.kimi/mcp.json` の実体） |
| `.agents/settings.json` | AIエージェント共通設定（`.claude/settings.json`, `.gemini/settings.json` から symlink 参照） |
| `.claude/settings.json` | Claude Code の設定（symlink） |
| `.gemini/settings.json` | Gemini CLI の設定（symlink） |
| `.agents/skills/*.md` | AIエージェント共通スキル（`.claude/skills/`, `.kimi/skills/` から symlink 参照） |
| `.claude/commands/*.md` | Claude Code カスタムコマンド |
| `.claudeignore` | 無視ファイルリスト（`.geminiignore`, `.kimiignore` の実体） |

## ライセンス

本プロジェクトで提供するPDFファイルの著作権は各権利者に帰属します。
