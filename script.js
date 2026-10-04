// Meme Database
const memeData = {
    popcat: {
        name: "Pop Cat",
        tag: "開心",
        img: "images/pop-cat.gif",
        desc: "這隻貓叫 Oatmeal,被網友搭配 POP 音效製作成病毒式傳播的影片。",
        origin: "Twitter / 日本",
        year: "2020"
    },
    cryingcat: {
        name: "Crying Cat",
        tag: "難過",
        img: "images/crying-cat.gif",
        desc: "眼睛帶淚的貓咪圖片系列。這些圖片常被用來表達悲傷、失望或假裝傷心的情緒。",
        origin: "4chan / Reddit",
        year: "2014"
    },
    huhcat: {
        name: "Huh? Cat",
        tag: "開心",
        img: "images/huh-cat.gif",
        desc: "歪頭疑惑的表情適用於表達「蛤?」或 Code 不知道為什麼跑不動的時候。",
        origin: "TikTok / Twitter",
        year: "2023"
    },
    thumbsup: {
        name: "Thumbs Up Cat",
        tag: "難過",
        img: "images/thumbs-up.jpg",
        desc: "看起來有點憂傷但還是比讚的貓。「雖然很難受,但還是要假裝沒事」的心情。",
        origin: "Twitter / Reddit",
        year: "2022"
    },
    sleepycat: {
        name: "Sleepy Cat (瞌睡貓)",
        tag: "疲累",
        img: "images/sleepy-cat.gif",
        desc: "這隻小貓咪努力想保持清醒但失敗了。完全代表週一早晨或是剛吃飽飯的你。",
        origin: "Viral Video",
        year: "2019"
    },
    happyjump: {
        name: "Happy Cat (跳舞貓)",
        tag: "開心",
        img: "images/happy-cat.gif",
        desc: "伴隨著 \"Happy Happy Happy\" 兒歌蹦蹦跳跳的貓。用於發生好事、放假!",
        origin: "TikTok Trend",
        year: "2015 (Meme: 2023)"
    },
    lavacat: {
        name: "Lava Cat (岩漿貓)",
        tag: "難過",
        img: "images/lava-cat.gif",
        desc: "不小心掉進岩漿裡的貓。象徵著突如其來的災難、考試考砸或不可挽回的錯誤。",
        origin: "Minecraft / Edit",
        year: "2020"
    },
    hugcat: {
        name: "Hug Cat (抱抱貓)",
        tag: "開心",
        img: "images/hug-cat.gif",
        desc: "撲向鏡頭給你一個大大的擁抱。適合用來安慰朋友或討拍的時候使用。",
        origin: "Cat Gifs",
        year: "Unknown"
    }
};

// Modal Manager
const ModalManager = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = "block";
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = "hidden";
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    },
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = "auto";
    }
};

// Meme Lab Controller
const MemeLab = {
    likes: 0,
    storageKey: 'meowmeme-likes',

    addLike() {
        this.likes++;
        this.saveLikes();
        const counter = document.getElementById("like-count");
        if (counter) {
            counter.innerText = this.likes;
            const btn = counter.parentElement;
            btn.style.transform = "scale(1.2)";
            setTimeout(() => btn.style.transform = "scale(1)", 200);
        }
    },

    saveLikes() {
        try { localStorage.setItem(this.storageKey, this.likes.toString()); }
        catch (e) { console.warn('Cannot save likes:', e); }
    },

    loadLikes() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            this.likes = saved ? parseInt(saved, 10) : 0;
            const counter = document.getElementById("like-count");
            if (counter) counter.innerText = this.likes;
        } catch (e) { console.warn('Cannot load likes:', e); }
    },

    // Download meme as PNG
    downloadMeme() {
        const img = document.getElementById("lab-meme-img");
        const textOverlay = document.getElementById("meme-text-overlay");

        if (!img) {
            alert("未找到圖片元素");
            return;
        }

        const text = textOverlay ? textOverlay.innerText : "";
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const tempImg = new Image();
        tempImg.src = img.src;

        tempImg.onload = function () {
            try {
                canvas.width = tempImg.width;
                canvas.height = tempImg.height;
                ctx.drawImage(tempImg, 0, 0);

                if (text && text !== "TEXT HERE") {
                    const fontSize = Math.max(canvas.width / 10, 30);
                    ctx.font = `900 ${fontSize}px Impact, sans-serif`;
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = fontSize / 15;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    const x = canvas.width / 2;
                    const y = canvas.height * 0.9;
                    ctx.strokeText(text, x, y);
                    ctx.fillText(text, x, y);
                }

                canvas.toBlob(function (blob) {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.download = `my-meme-${Date.now()}.png`;
                        link.href = url;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => URL.revokeObjectURL(url), 100);
                    } else {
                        throw new Error('Canvas toBlob failed');
                    }
                }, 'image/png');

            } catch (e) {
                console.error('Download failed:', e);
                alert("下載失敗!請使用 Live Server 開啟頁面。");
            }
        };

        tempImg.onerror = function () {
            console.error('Image load failed:', tempImg.src);
            alert("無法載入圖片!請檢查圖片是否存放在 images 文件夾中。");
        };
    }
};

// Gallery filter
function filterSelection(category, btn) {
    const items = document.getElementsByClassName("card-link");
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = (category === "all" || items[i].classList.contains(category)) ? "block" : "none";
    }
    const btns = document.getElementsByClassName("filter-btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
        btns[i].setAttribute('aria-pressed', 'false');
    }
    if (btn) {
        btn.classList.add("active");
        btn.setAttribute('aria-pressed', 'true');
    }
}

// Show meme detail modal
function showMemeDetail(id) {
    const data = memeData[id];
    if (!data) return console.error(`Meme not found: ${id}`);

    document.getElementById("memeDetailImg").src = data.img;
    document.getElementById("memeDetailTitle").innerText = data.name;
    document.getElementById("memeDetailTag").innerText = data.tag;
    document.getElementById("memeDetailDesc").innerText = data.desc;
    document.getElementById("memeDetailOrigin").innerText = data.origin;
    document.getElementById("memeDetailYear").innerText = data.year;
    document.getElementById("memeDetailLink").href = `https://www.google.com/search?q=${encodeURIComponent(data.name + ' meme')}`;
    document.getElementById("memeLabLink").href = "meme.html?meme=" + id;

    ModalManager.open('memeDetailModal');
}

// Update meme text overlay
function updateMemeText() {
    const input = document.getElementById("meme-input");
    const overlay = document.getElementById("meme-text-overlay");
    if (input && overlay) overlay.innerText = input.value.trim() || "TEXT HERE";
}

// Open external Reddit link
function openSourceLink() {
    window.open("https://www.reddit.com/r/Catmemes/", "_blank", "noopener,noreferrer");
}

// Submit feedback form
function submitFeedback(event) {
    if (event) event.preventDefault();
    const textarea = document.getElementById("feedback-textarea");
    if (!textarea) return;
    const feedback = textarea.value.trim();
    if (!feedback) {
        alert("請輸入您的反饋!");
        textarea.focus();
    } else {
        alert("收到!感謝您的反饋!");
        textarea.value = "";
        ModalManager.close('myModal');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Meme Lab page initialization
    const urlParams = new URLSearchParams(window.location.search);
    const memeId = urlParams.get('meme');
    if (memeId && memeData[memeId]) {
        const meme = memeData[memeId];
        const img = document.getElementById('lab-meme-img');
        const name = document.getElementById('lab-meme-name');
        const desc = document.getElementById('lab-meme-desc');
        if (img) img.src = meme.img;
        if (name) name.innerText = meme.name;
        if (desc) desc.innerText = meme.desc;
    }
    MemeLab.loadLikes();

    // Image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'img-placeholder';
            placeholder.innerHTML = '🐱<br><small>Image failed</small>';
            this.parentNode.insertBefore(placeholder, this);
        });
    });
});

// Click outside modal to close
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        ModalManager.close('myModal');
        ModalManager.close('memeDetailModal');
    }
});

// ESC key closes modals
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        ModalManager.close('myModal');
        ModalManager.close('memeDetailModal');
    }
});