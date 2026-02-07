# 楽曲管理システムのセットアップ手順

## 1. データベーススキーマの更新

Supabaseのダッシュボードで以下のSQLを実行してください:

```sql
-- schema_format_update.sqlの内容を実行
ALTER TABLE public.songs 
ADD COLUMN IF NOT EXISTS has_wav boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_loop boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_high_res boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_midi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS mp3_url text,
ADD COLUMN IF NOT EXISTS full_audio_url text;

-- 既存のpreview_urlをmp3_urlに移行
UPDATE public.songs 
SET mp3_url = preview_url 
WHERE mp3_url IS NULL;
```

## 2. 管理画面へのアクセス

1. ログインしてください（`/login`）
2. `/admin`にアクセスしてください
3. 「新規楽曲を追加」ボタンをクリック

## 3. 楽曲の追加

フォームに以下の情報を入力:

- **タイトル** (必須): 楽曲名
- **説明**: 楽曲の説明
- **価格** (必須): 円単位の価格
- **画像URL** (必須): 楽曲のカバー画像URL
- **MP3 URL** (必須): MP3ファイルのURL
- **Stripe Price ID** (必須): Stripeで作成した価格ID
- **利用可能なフォーマット**: 
  - WAV Format (High Quality)
  - Loop Version Included
  - High-Res Audio (96kHz/24bit)
  - MIDI Data

チェックを入れたフォーマットのみ、購入画面で選択可能になります。

## 4. 動作確認

1. 楽曲を追加後、トップページまたは`/sounds`ページで楽曲が表示されることを確認
2. 楽曲の「Buy Now」ボタンをクリック
3. 購入ポップアップで、チェックを入れなかったオプションが「(利用不可)」と表示され、グレーアウトされていることを確認
4. 利用可能なオプションのみ選択できることを確認

## 注意事項

- MP3は必須です。必ず入力してください
- 他のフォーマット（WAV、ループ、ハイレゾ、MIDI）は任意です
- 利用不可能なオプションは購入画面で選択できません
