# Google Search Console 登録ガイド

Zalci Audio (https://audiostore.zalci.net) を Google Search Console に登録し、検索エンジンにインデックスさせるための手順です。

## 1. Google Search Console にログイン
1. [Google Search Console](https://search.google.com/search-console/about) にアクセスします。
2. Googleアカウントでログインします。

## 2. プロパティの追加
1. 画面左上のプロパティ選択メニューから「+ プロパティを追加」をクリックします。
2. **「URL プレフィックス」** を選択します（「ドメイン」ではありません）。
3. URLに `https://audiostore.zalci.net` を入力し、「続行」をクリックします。

## 3. 所有権の確認（HTMLタグ方式）
1. 確認方法の選択画面で、**「HTML タグ」** を探してクリックし、展開します。
2. 表示されるメタタグ `<meta name="google-site-verification" content="..." />` の `content` の中身（`...`の部分のみ）をコピーします。
   - 例: `content="aBcD1234..."` なら `aBcD1234...` の部分だけをコピー。

## 4. Vercel 環境変数の設定
サイトのコードを書き換えることなく、環境変数でIDを設定できるようにしています。

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセスし、`zalci-audio` プロジェクトを開きます。
2. **Settings** > **Environment Variables** に移動します。
3. 以下の変数を追加します：
   - **Key**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - **Value**: 先ほどコピーしたコード（例: `aBcD1234...`）
4. 追加したら、**Deployments** タブに戻り、最新のデプロイの「三点リーダー(...)」から **Redeploy** を実行します（環境変数を反映させるため）。
   - **重要**: 再デプロイしないと環境変数が反映されません。

## 5. 確認の完了
1. デプロイが完了したら、ブラウザで `https://audiostore.zalci.net` を開き、ページのソースを表示して `<meta name="google-site-verification" ...>` が含まれているか確認します（任意）。
2. Google Search Console の画面に戻り、HTMLタグのセクションにある**「確認」**ボタンをクリックします。
3. 「所有権を確認しました」と表示されれば成功です。

## 6. サイトマップの送信
1. Search Console の左メニューから **「サイトマップ」** をクリックします。
2. 「新しいサイトマップの追加」欄に `sitemap.xml` と入力します。
3. **「送信」** をクリックします。
4. ステータスが「成功」になれば完了です（反映まで数日かかることがあります）。

## トラブルシューティング
- **確認に失敗する場合**:
  - Vercelで再デプロイが完了しているか確認してください。
  - キャッシュが残っている場合があるので、数分待ってから再度試してください。
- **サイトマップが読み込まれない場合**:
  - `https://audiostore.zalci.net/sitemap.xml` にブラウザでアクセスできるか確認してください。
