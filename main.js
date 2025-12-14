// ========================================
// ハンバーガーメニュー
// ========================================

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-list a');

// ハンバーガーメニューのトグル
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// ナビゲーションリンクをクリックしたらメニューを閉じる
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ========================================
// お問い合わせフォーム - バリデーション
// ========================================

const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const successModalClose = document.getElementById('successModalClose');
const successModalButton = document.getElementById('successModalButton');

// カスタムバリデーションメッセージの設定
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

nameInput.addEventListener('invalid', () => {
    if (nameInput.validity.valueMissing) {
        nameInput.setCustomValidity('お名前を入力してください');
    } else {
        nameInput.setCustomValidity('');
    }
});

nameInput.addEventListener('input', () => {
    nameInput.setCustomValidity('');
});

emailInput.addEventListener('invalid', () => {
    if (emailInput.validity.valueMissing) {
        emailInput.setCustomValidity('メールアドレスを入力してください');
    } else if (emailInput.validity.typeMismatch) {
        emailInput.setCustomValidity('正しいメールアドレスの形式で入力してください');
    } else {
        emailInput.setCustomValidity('');
    }
});

emailInput.addEventListener('input', () => {
    emailInput.setCustomValidity('');
});

// メールアドレスの形式チェック
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// フォーム送信処理
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // フォーム要素の取得
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    // バリデーション
    if (!name) {
        alert('お名前を入力してください。');
        document.getElementById('name').focus();
        return;
    }

    if (!email) {
        alert('メールアドレスを入力してください。');
        document.getElementById('email').focus();
        return;
    }

    if (!isValidEmail(email)) {
        alert('正しいメールアドレスの形式で入力してください。');
        document.getElementById('email').focus();
        return;
    }

    // フォームデータを送信
    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // 送信成功 - モーダルを表示
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            contactForm.reset();
        } else {
            alert('送信に失敗しました。もう一度お試しください。');
        }
    } catch (error) {
        alert('送信中にエラーが発生しました。もう一度お試しください。');
    }
});

// 送信完了モーダルを閉じる
const closeSuccessModal = () => {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
};

successModalClose.addEventListener('click', closeSuccessModal);
successModalButton.addEventListener('click', closeSuccessModal);

// モーダルの背景をクリックしても閉じる
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeSuccessModal();
    }
});

// ========================================
// スムーススクロール（カスタム速度対応）
// ========================================

// スムーススクロールを実装（速度をゆっくりめに調整）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // ハッシュのみのリンクの場合
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // スクロール時間（ミリ秒）1000ms = 1秒
            let start = null;

            // アニメーション関数（リニア - 完全に一定速度）
            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);

                // イージングなし、完全に一定速度でスクロール
                window.scrollTo(0, startPosition + distance * progress);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
    });
});

// ========================================
// ヘッダーのスクロール時の影調整（オプション）
// ========================================

let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // スクロール時にヘッダーに影を追加
    if (currentScroll > 10) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// ========================================
// ヒーロー個室写真カルーセル
// ========================================

const heroRoomImages = [
    {
        src: 'images/room-2f-se.jpg',
        caption: '二階洋室（南東）'
    },
    {
        src: 'images/room-2f-nw-1.jpg',
        caption: '二階洋室（北西）'
    },
    {
        src: 'images/room-2f-nw-2.jpg',
        caption: '二階洋室（北西）'
    },
    {
        src: 'images/room-2f-sw.jpg',
        caption: '二階洋室（南西）'
    },
    {
        src: 'images/room-1f-se.jpg',
        caption: '一階洋室（南東）'
    }
];

let currentHeroRoomIndex = 0;

const heroCarouselImage = document.getElementById('heroCarouselImage');
const heroCarouselCaption = document.getElementById('heroCarouselCaption');
const heroCarouselCounter = document.getElementById('heroCarouselCounter');
const prevHeroRoomBtn = document.getElementById('prevHeroRoom');
const nextHeroRoomBtn = document.getElementById('nextHeroRoom');

// ヒーローカルーセル画像を更新する関数
const updateHeroCarousel = () => {
    const currentImage = heroRoomImages[currentHeroRoomIndex];

    // フェードアウト効果
    heroCarouselImage.style.opacity = '0';

    setTimeout(() => {
        heroCarouselImage.src = currentImage.src;
        heroCarouselCaption.textContent = currentImage.caption;
        heroCarouselCounter.textContent = `${currentHeroRoomIndex + 1} / ${heroRoomImages.length}`;

        // フェードイン効果
        heroCarouselImage.style.opacity = '1';
    }, 150);
};

// 次の画像へ
nextHeroRoomBtn.addEventListener('click', () => {
    currentHeroRoomIndex = (currentHeroRoomIndex + 1) % heroRoomImages.length;
    updateHeroCarousel();
});

// 前の画像へ
prevHeroRoomBtn.addEventListener('click', () => {
    currentHeroRoomIndex = (currentHeroRoomIndex - 1 + heroRoomImages.length) % heroRoomImages.length;
    updateHeroCarousel();
});

// サムネイルクリック
const thumbnails = document.querySelectorAll('.hero-thumbnail');
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        currentHeroRoomIndex = index;
        updateHeroCarousel();
        updateThumbnails();
    });
});

// サムネイルのアクティブ状態を更新
const updateThumbnails = () => {
    thumbnails.forEach((thumbnail, index) => {
        if (index === currentHeroRoomIndex) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
};

// カルーセル更新時にサムネイルも更新
const originalUpdateCarousel = updateHeroCarousel;
updateHeroCarousel = () => {
    originalUpdateCarousel();
    updateThumbnails();
};

// ========================================
// 物件概要テキストの2行目インデント調整
// ========================================

const adjustOverviewTextIndent = () => {
    const overviewText = document.querySelector('.overview-description p strong');
    if (!overviewText) return;

    const originalText = '🎵自然豊かな環境の中、周りを気にすることなく楽器演奏可能🎵';

    // 一旦元のテキストに戻す
    overviewText.textContent = originalText;

    // 要素の高さをチェック（1行か2行か判定）
    const lineHeight = parseFloat(window.getComputedStyle(overviewText).lineHeight);
    const actualHeight = overviewText.offsetHeight;

    // 2行以上の場合（高さが1.5倍以上）
    if (actualHeight > lineHeight * 1.5) {
        // テキストを分割して2行目に全角スペースを追加
        overviewText.innerHTML = '🎵自然豊かな環境の中、<br>　周りを気にすることなく楽器演奏可能🎵';
    }
};

// 初回実行
adjustOverviewTextIndent();

// ウィンドウリサイズ時に再調整
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(adjustOverviewTextIndent, 100);
});

// ========================================
// 部屋フィルター機能
// ========================================

const filterButtons = document.querySelectorAll('.filter-btn');
const roomCards = document.querySelectorAll('.room-card');
const displayedRoomsSpan = document.getElementById('displayedRooms');

// フィルターボタンのクリックイベント
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // すべてのボタンからactiveクラスを削除
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // クリックされたボタンにactiveクラスを追加
        button.classList.add('active');

        // フィルタータイプを取得
        const filterType = button.dataset.filter;

        let visibleCount = 0;

        // 部屋カードの表示/非表示を切り替え
        roomCards.forEach(card => {
            const status = card.dataset.status;

            if (filterType === 'all') {
                // 全部屋表示
                card.style.display = 'block';
                visibleCount++;
            } else if (filterType === 'vacant') {
                // 空室のみ表示
                if (status === 'vacant') {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // 表示中の部屋数を更新
        displayedRoomsSpan.textContent = visibleCount;
    });
});