/**
 * microCMS 空室管理システム
 *
 * 使い方:
 * 1. microCMS で以下のフィールドを持つ「rooms」APIを作成
 *    - roomNumber: 部屋番号（テキスト）
 *    - floorSize: 専有面積（テキスト） 例: "15.5㎡（8.5畳）"
 *    - rent: 家賃（数値）
 *    - utilities: 共益費（数値）
 *    - deposit: 保証金（数値）
 *    - furniture: 家具（テキスト） 例: "ベッド・デスク・椅子"
 *    - available: 空室かどうか（真偽値）
 *    - image: 部屋画像（画像）
 *
 * 2. 下記の MICROCMS_API_ENDPOINT と MICROCMS_API_KEY を差し替え
 * 3. HTMLに <div id="rooms-container"></div> を配置
 */

// ========================================
// 設定（ここを変更してください）
// ========================================
const MICROCMS_API_ENDPOINT = 'https://YOUR_SERVICE.microcms.io/api/v1/rooms';
const MICROCMS_API_KEY = 'YOUR_READ_ONLY_API_KEY';

// ========================================
// microCMS からデータを取得
// ========================================
async function fetchRooms() {
    try {
        const response = await fetch(MICROCMS_API_ENDPOINT, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.contents; // microCMS のレスポンス形式
    } catch (error) {
        console.error('部屋データの取得に失敗しました:', error);
        return [];
    }
}

// ========================================
// 空室のみをフィルタリング
// ========================================
function filterAvailableRooms(rooms) {
    return rooms.filter(room => room.available === true);
}

// ========================================
// 部屋カードのHTML生成
// ========================================
function createRoomCard(room) {
    const monthlyTotal = (room.rent || 0) + (room.utilities || 0);
    const imageUrl = room.image?.url || 'images/room-placeholder.jpg';

    return `
        <div class="room-card-microcms">
            <div class="room-card-status available">空室</div>
            <img src="${imageUrl}" alt="${room.roomNumber}" class="room-card-image">
            <div class="room-card-content">
                <h3 class="room-card-title">${room.roomNumber}</h3>
                <p class="room-card-size">${room.floorSize || '-'}</p>
                <div class="room-card-pricing">
                    <div class="room-card-price-row">
                        <span class="label">家賃</span>
                        <span class="value">${room.rent?.toLocaleString() || '-'}円</span>
                    </div>
                    <div class="room-card-price-row">
                        <span class="label">共益費</span>
                        <span class="value">${room.utilities?.toLocaleString() || '-'}円</span>
                    </div>
                    <div class="room-card-price-row total">
                        <span class="label">月額合計</span>
                        <span class="value">${monthlyTotal.toLocaleString()}円</span>
                    </div>
                    ${room.deposit ? `
                    <div class="room-card-price-row">
                        <span class="label">保証金</span>
                        <span class="value">${room.deposit.toLocaleString()}円</span>
                    </div>
                    ` : ''}
                </div>
                ${room.furniture ? `
                <div class="room-card-furniture">
                    <strong>備品:</strong> ${room.furniture}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ========================================
// 空室一覧を表示
// ========================================
async function displayAvailableRooms() {
    const container = document.getElementById('rooms-container');

    if (!container) {
        console.error('rooms-container が見つかりません');
        return;
    }

    // ローディング表示
    container.innerHTML = '<p class="loading-message">空室情報を読み込み中...</p>';

    // データ取得
    const allRooms = await fetchRooms();
    const availableRooms = filterAvailableRooms(allRooms);

    // 空室がない場合
    if (availableRooms.length === 0) {
        container.innerHTML = `
            <div class="no-rooms-message">
                <p>現在、空室はございません。</p>
                <p>お問い合わせいただければ、最新の情報をご案内いたします。</p>
            </div>
        `;
        return;
    }

    // カード表示
    const roomsHTML = availableRooms.map(room => createRoomCard(room)).join('');
    container.innerHTML = `
        <div class="rooms-count-microcms">
            <span class="count">${availableRooms.length}</span> 室の空室があります
        </div>
        <div class="rooms-grid-microcms">
            ${roomsHTML}
        </div>
    `;
}

// ========================================
// ページ読み込み時に実行
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayAvailableRooms);
} else {
    displayAvailableRooms();
}
