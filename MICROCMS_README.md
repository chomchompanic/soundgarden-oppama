# microCMS 空室管理システム 導入ガイド

## 📋 概要

このシステムは、microCMSを使ってサウンドガーデン追浜の空室情報を動的に管理・表示する仕組みです。

**メリット:**
- 空室状況をmicroCMSの管理画面から更新できる
- HTMLを編集せずに空室情報を変更可能
- 空室のみを自動で表示（満室の部屋は非表示）

---

## 🚀 セットアップ手順

### 1. microCMS でAPIを作成

#### 1-1. microCMSにログイン
https://microcms.io/ にアクセスしてログイン

#### 1-2. サービスを作成（初回のみ）
- サービス名: `soundgarden-oppama`（任意）
- サービスID: 後でAPIエンドポイントに使用

#### 1-3. APIを作成
- API名: `rooms`（部屋情報）
- エンドポイント: `rooms`
- 型: **リスト形式**

#### 1-4. APIスキーマを設定

以下のフィールドを追加してください：

| フィールドID | 表示名 | 種類 | 必須 | 説明 |
|------------|--------|------|------|------|
| `roomNumber` | 部屋番号 | テキストフィールド | ✓ | 例: 201号室 |
| `floorSize` | 専有面積 | テキストフィールド | ✓ | 例: 15.5㎡（8.5畳） |
| `rent` | 家賃 | 数値 | ✓ | 例: 29000 |
| `utilities` | 共益費 | 数値 | ✓ | 例: 12000 |
| `deposit` | 保証金 | 数値 | - | 例: 30000 |
| `furniture` | 家具・備品 | テキストフィールド | - | 例: ベッド・デスク・椅子 |
| `available` | 空室 | 真偽値 | ✓ | ON=空室、OFF=満室 |
| `image` | 部屋画像 | 画像 | - | 部屋の写真 |

#### 1-5. コンテンツを追加

「コンテンツを追加」ボタンから、各部屋の情報を登録します。

**例: 204号室**
```
部屋番号: 204号室
専有面積: 7.3㎡（4畳）
家賃: 23000
共益費: 12000
保証金: 30000
家具・備品: デスク・椅子
空室: ON（チェックを入れる）
画像: room-04.jpgをアップロード
```

### 2. APIキーを取得

1. microCMS管理画面 → 「API設定」→「APIキー」
2. 「発行」ボタンをクリック
3. 名前: `Read Only Key`
4. 権限: **「GET」のみチェック**（読み取り専用）
5. 発行されたAPIキーをコピー

⚠️ **重要**: 公開サイトで使うので、必ず「GETのみ」の権限にしてください。

### 3. コードを編集

#### 3-1. rooms-microcms.js を編集

```javascript
// この2行を編集してください
const MICROCMS_API_ENDPOINT = 'https://YOUR_SERVICE.microcms.io/api/v1/rooms';
const MICROCMS_API_KEY = 'YOUR_READ_ONLY_API_KEY';
```

**変更例:**
```javascript
const MICROCMS_API_ENDPOINT = 'https://soundgarden-oppama.microcms.io/api/v1/rooms';
const MICROCMS_API_KEY = 'abcd1234-efgh-5678-ijkl-9012mnop3456';
```

### 4. HTMLに組み込む

#### 方法1: 既存のindex.htmlに追加（推奨）

`index.html` の「入居ができるお部屋」セクション（line 237付近）を以下に置き換え：

```html
<!-- 入居可能な部屋（microCMS版） -->
<section class="section section-gray" id="rooms">
    <div class="container">
        <h2 class="section-title">空室情報</h2>

        <!-- microCMS から取得した空室がここに表示されます -->
        <div id="rooms-container"></div>
    </div>
</section>
```

そして、`</body>` の直前に以下を追加：

```html
    <!-- microCMS 空室管理システム -->
    <link rel="stylesheet" href="rooms-microcms.css">
    <script src="rooms-microcms.js"></script>
</body>
```

#### 方法2: 専用ページを作成

`rooms-microcms-example.html` をそのまま使用

---

## 📝 運用方法

### 空室を追加する場合

1. microCMS管理画面にログイン
2. 「rooms」API → 「コンテンツを追加」
3. 部屋情報を入力
4. 「空室」をONにする
5. 「公開」をクリック

→ **サイトに即座に反映されます**（HTMLの編集不要）

### 満室にする場合

1. microCMS管理画面で該当の部屋を開く
2. 「空室」をOFFにする
3. 「更新」をクリック

→ **サイトから自動で非表示になります**

---

## 🎨 カスタマイズ

### デザインを変更したい場合

`rooms-microcms.css` を編集してください。

**色の変更例:**
```css
/* 空室バッジの色を変更 */
.room-card-status.available {
    background: #your-color; /* ここを変更 */
}

/* カードのホバーエフェクトを無効化 */
.room-card-microcms:hover {
    transform: none; /* アニメーションを削除 */
}
```

### 表示する情報を変更したい場合

`rooms-microcms.js` の `createRoomCard()` 関数を編集してください。

---

## ❓ トラブルシューティング

### 「空室情報を読み込み中...」のまま表示されない

**原因1: APIエンドポイントが間違っている**
- microCMS管理画面で正しいサービスIDを確認
- `rooms-microcms.js` の MICROCMS_API_ENDPOINT を修正

**原因2: APIキーが間違っている**
- microCMS管理画面でAPIキーを再確認
- コピー時に余分なスペースが入っていないか確認

**原因3: CORS エラー**
- ブラウザの開発者ツール（F12）でエラーを確認
- microCMS側で CORS設定を確認

### 「現在、空室はございません」と表示される

- microCMS管理画面で「空室」がONになっているか確認
- コンテンツが「公開」状態になっているか確認
- コンテンツが1件以上あるか確認

---

## 📦 ファイル構成

```
soundgarden-oppama/
├── index.html                      # メインHTML（既存）
├── rooms-microcms.js              # microCMS連携スクリプト（★新規）
├── rooms-microcms.css             # 空室カードのスタイル（★新規）
├── rooms-microcms-example.html    # 動作確認用サンプル（★新規）
└── MICROCMS_README.md             # このファイル（★新規）
```

---

## 🔗 参考リンク

- [microCMS公式ドキュメント](https://document.microcms.io/)
- [microCMS API リファレンス](https://document.microcms.io/content-api/get-list-contents)

---

## ✅ チェックリスト

導入前に確認してください：

- [ ] microCMS でサービスを作成した
- [ ] rooms API を作成した
- [ ] APIスキーマを設定した（8フィールド）
- [ ] テストデータを1件以上登録した
- [ ] 読み取り専用APIキーを発行した
- [ ] rooms-microcms.js にAPIエンドポイントとキーを設定した
- [ ] index.html にスクリプトを読み込む記述を追加した
- [ ] ブラウザで表示を確認した

---

作成日: 2025-12-02
