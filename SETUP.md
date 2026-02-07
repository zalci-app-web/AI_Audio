# Zalci Audio - セットアップガイド

## データベースセットアップ

### 1. Supabase SQLエディタでスキーマを実行

1. Supabaseダッシュボードにログイン
2. SQL Editorを開く
3. `schema.sql`の内容を実行
4. `schema_update.sql`の内容を実行

### 2. Supabase Storageバケット作成

1. Supabaseダッシュボードで「Storage」を開く
2. 新しいバケット「songs」を作成
3. バケットを公開設定にするか、適切なポリシーを設定

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:5000
```

### 4. Stripeセットアップ

1. [Stripe Dashboard](https://dashboard.stripe.com/)にログイン
2. テストモードで商品と価格を作成
3. 各楽曲のPrice IDを`scripts/seed-songs.ts`に設定
4. Webhook エンドポイントを設定: `https://your-domain.com/api/webhook`
5. Webhook署名シークレットを`.env.local`に追加

### 5. サンプルデータの投入

```bash
# 依存関係のインストール
npm install --save-dev tsx

# シードスクリプトの実行
npx tsx scripts/seed-songs.ts
```

## 開発サーバーの起動

```bash
npm run dev
```

サイトは http://localhost:3000 で起動します。

## 機能一覧

### ✅ 実装済み

1. **音声プレビュー機能**
   - 楽曲カードに再生/一時停止ボタン
   - HTML5 Audio統合

2. **楽曲検索機能**
   - ヘッダーに検索バー
   - タイトル・説明文での検索
   - リアルタイム検索結果表示

3. **Stripe決済統合**
   - Checkout API (`/api/checkout`)
   - Webhook ハンドラー (`/api/webhook`)
   - 購入履歴の記録

4. **ユーザーライブラリ管理**
   - 購入済み楽曲の表示
   - ダウンロード機能 (`/api/download`)
   - お気に入り機能 (`/api/favorites`)

5. **認証機能**
   - Supabase Auth統合
   - ログイン/サインアップ
   - セッション管理

6. **国際化**
   - 日本語/英語対応
   - システム言語検出

## 次のステップ

1. Stripe Price IDを実際の値に更新
2. 実際の音声ファイルをSupabase Storageにアップロード
3. `download/route.ts`を更新して実際のファイルURLを返すように修正
4. 本番環境へのデプロイ (Vercel推奨)
5. Stripe Webhookの本番設定

## トラブルシューティング

### データベースエラー
- RLSポリシーが正しく設定されているか確認
- Supabase Service Role Keyが正しいか確認

### Stripe決済エラー
- Webhook署名シークレットが正しいか確認
- Price IDが存在するか確認
- テストモードのキーを使用しているか確認

### 検索が動作しない
- `description`カラムがsongsテーブルに追加されているか確認
- `schema_update.sql`を実行したか確認
