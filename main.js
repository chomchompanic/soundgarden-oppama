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
// 写真ギャラリー - モーダル表示
// ========================================

const galleryItems = document.querySelectorAll('.gallery-item');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');

// ギャラリー画像をクリックしたらモーダル表示
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imageSrc = item.dataset.image;
        const imageAlt = item.querySelector('img').alt;

        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        imageModal.classList.add('active');

        // スクロールを無効化
        document.body.style.overflow = 'hidden';
    });
});

// モーダルを閉じる
const closeModal = () => {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
};

modalClose.addEventListener('click', closeModal);

// モーダルの背景をクリックしても閉じる
imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeModal();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeModal();
    }
});

// ========================================
// お問い合わせフォーム - バリデーション
// ========================================

const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const successModalClose = document.getElementById('successModalClose');
const successModalButton = document.getElementById('successModalButton');

// メールアドレスの形式チェック
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// フォーム送信処理
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // フォーム要素の取得
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const privacy = document.getElementById('privacy').checked;

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

    if (!privacy) {
        alert('個人情報の取り扱いに同意してください。');
        return;
    }

    // バリデーション成功 - 送信完了モーダルを表示
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // フォームをリセット
    contactForm.reset();
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
// スムーススクロール（古いブラウザ対応）
// ========================================

// 一部の古いブラウザではCSSのscroll-behavior: smoothが効かないため
// JavaScriptでもスムーススクロールを実装
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

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
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
        src: 'images/room-01.jpg',
        caption: '二階洋室（南東）'
    },
    {
        src: 'images/room-02.jpg',
        caption: '二階洋室（北西）'
    },
    {
        src: 'images/room-03.jpg',
        caption: '二階洋室（北西）'
    },
    {
        src: 'images/room-04.jpg',
        caption: '二階洋室（南西）'
    },
    {
        src: 'images/room-05.jpg',
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