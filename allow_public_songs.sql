-- Stripe審査用：ゲストユーザーが楽曲一覧を見られるようにRLSを調整
-- 匿名ユーザー(anon)に対してsongsテーブルのSELECT権限を付与します。

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Allow public read access" ON songs;

-- 全ユーザー（未ログイン含む）に読み取りを許可
CREATE POLICY "Allow public read access" ON songs
    FOR SELECT
    USING (true);
