# Kagoshima Voice（鹿児島ボイス）

地域の困りごとを、前向きに解決へ繋げるプラットフォーム

## 概要

Kagoshima Voice は、鹿児島の住民が地域の課題や要望を投稿し、建設的な議論と解決策を促進するためのWebアプリケーションです。

### 特徴

- **コメント機能なし**: 投稿に対するコメント機能を廃止し、誹謗中傷や炎上を防ぎます
- **自動集約**: 同じテーマの投稿を自動でまとめ、課題を可視化します
- **トーンチェック**: 投稿前に不適切な表現を検出し、穏やかな表現に修正提案
- **週3回制限**: 1ユーザーあたり週3回までの投稿制限で質の高い投稿を促進
- **多様なカテゴリ**: 政治的課題だけでなく、商品要望・サービス改善・イベント企画なども募集

### カテゴリ例

- **生活改善**: 交通、子育て、医療、教育、防災など
- **商品・サービス**: 商品要望、サービス要望、アプリ機能など
- **企画提案**: イベント企画、観光施策など

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **データベース**: SQLite + Prisma ORM
- **UI**: shadcn/ui + Tailwind CSS
- **言語**: TypeScript
- **認証**: なし（ブラウザローカルストレージベースの簡易ID管理）

## セットアップ

### 必要要件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/gogoyoshimyy/kagoshima-voice.git
cd kagoshima-voice

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .env ファイルに以下を追加:
# DATABASE_URL="file:./dev.db"

# データベースをセットアップ
npx prisma migrate dev
npx prisma db seed

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 機能

### 一般ユーザー向け

- **投稿フォーム** (`/post`): カテゴリ・地域を選択して要望を投稿
- **トーンチェック**: 不適切な表現を自動検出・修正提案
- **課題一覧** (`/`): 投稿された課題をカテゴリ・地域でフィルタリング
- **課題詳細** (`/issue/[id]`): 投稿数、リアクション、解決策の確認
- **ダッシュボード** (`/dashboard`): 全体統計とカテゴリ別分析
- **マイページ** (`/me`): 投稿数、通知、フォロー中の課題

### 管理者向け

- **投稿モデレーション** (`/admin/moderation`): 保留中の投稿を承認/却下
- **課題管理** (`/admin/issues`): 全課題の一覧表示
- **解決策投稿** (`/admin/products`): 課題に対する解決策（アプリ・イベント・お知らせ）を追加

## データベーススキーマ

主要なテーブル:

- `User`: ユーザー（ブラウザIDベース）
- `IssueCard`: 課題カード（自動集約された投稿）
- `Post`: 個別の投稿
- `Reaction`: リアクション（共感・急ぎ・検証可）
- `Follow`: 課題のフォロー
- `ProductUpdate`: 解決策（アプリ・イベント・お知らせ）
- `Notification`: 通知

## デプロイ

### Vercel

```bash
# Vercelにデプロイ
npm run build
vercel --prod
```

環境変数の設定:
- `DATABASE_URL`: Turso, PlanetScale, Neon などのクラウドDBを推奨

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## 作者

[@gogoyoshimyy](https://github.com/gogoyoshimyy)
