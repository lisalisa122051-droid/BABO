const config = require('../config');

const menuData = {
    categories: [
        {
            id: 1,
            name: "UTILITY",
            description: "Fitur utilitas sehari-hari",
            start: 1,
            end: 10
        },
        {
            id: 2,
            name: "MEDIA",
            description: "Fitur media dan downloader",
            start: 11,
            end: 20
        },
        {
            id: 3,
            name: "TOOLS",
            description: "Alat dan converter",
            start: 21,
            end: 30
        },
        {
            id: 4,
            name: "GAMES",
            description: "Game dan hiburan",
            start: 31,
            end: 40
        },
        {
            id: 5,
            name: "EDUCATION",
            description: "Fitur edukasi",
            start: 41,
            end: 50
        }
    ],
    
    fiturList: {
        // UTILITY (1-10)
        1: { name: "Info Pengguna", cmd: "!info", desc: "Menampilkan info pengguna" },
        2: { name: "Cek Status", cmd: "!status", desc: "Cek status bot" },
        3: { name: "Downloader Video", cmd: "!dlvideo", desc: "Download video dari URL" },
        4: { name: "Downloader Audio", cmd: "!dlaudio", desc: "Download audio dari video" },
        5: { name: "Konversi Gambar", cmd: "!convertimg", desc: "Konversi format gambar" },
        6: { name: "Sticker Maker", cmd: "!sticker", desc: "Buat sticker dari gambar" },
        7: { name: "QR Code Generator", cmd: "!qrcode", desc: "Buat QR Code" },
        8: { name: "Shortlink", cmd: "!short", desc: "Pendekkan URL" },
        9: { name: "Currency Converter", cmd: "!currency", desc: "Konversi mata uang" },
        10: { name: "Weather Info", cmd: "!cuaca", desc: "Info cuaca" },
        
        // MEDIA (11-20)
        11: { name: "YouTube Downloader", cmd: "!ytdl", desc: "Download dari YouTube" },
        12: { name: "Instagram Downloader", cmd: "!igdl", desc: "Download dari Instagram" },
        13: { name: "TikTok Downloader", cmd: "!ttdl", desc: "Download dari TikTok" },
        14: { name: "Image Editor", cmd: "!editimg", desc: "Edit gambar" },
        15: { name: "Text to Speech", cmd: "!tts", desc: "Konversi teks ke suara" },
        16: { name: "Speech to Text", cmd: "!stt", desc: "Konversi suara ke teks" },
        17: { name: "PDF Converter", cmd: "!pdf", desc: "Konversi ke/dari PDF" },
        18: { name: "Screen Capture", cmd: "!ss", desc: "Capture website" },
        19: { name: "Video Compressor", cmd: "!compress", desc: "Kompres video" },
        20: { name: "Audio Editor", cmd: "!audioedit", desc: "Edit audio" },
        
        // TOOLS (21-30)
        21: { name: "Password Generator", cmd: "!passgen", desc: "Buat password aman" },
        22: { name: "Encrypt/Decrypt", cmd: "!crypt", desc: "Enkripsi/dekripsi teks" },
        23: { name: "File Converter", cmd: "!fileconv", desc: "Konversi file" },
        24: { name: "QR Scanner", cmd: "!qrscan", desc: "Scan QR Code" },
        25: { name: "Barcode Generator", cmd: "!barcode", desc: "Buat barcode" },
        26: { name: "Unit Converter", cmd: "!unit", desc: "Konversi satuan" },
        27: { name: "Calculator", cmd: "!calc", desc: "Kalkulator" },
        28: { name: "Random Picker", cmd: "!random", desc: "Pilih acak" },
        29: { name: "Countdown Timer", cmd: "!timer", desc: "Buat timer" },
        30: { name: "Reminder Set", cmd: "!remind", desc: "Set pengingat" },
        
        // GAMES (31-40)
        31: { name: "Tebak Gambar", cmd: "!tebakgambar", desc: "Game tebak gambar" },
        32: { name: "Kuis Trivia", cmd: "!kuis", desc: "Kuis pengetahuan" },
        33: { name: "Tic Tac Toe", cmd: "!ttt", desc: "Game Tic Tac Toe" },
        34: { name: "Hangman", cmd: "!hangman", desc: "Game Hangman" },
        35: { name: "Slot Machine", cmd: "!slot", desc: "Mesin slot" },
        36: { name: "Dice Roll", cmd: "!dadu", desc: "Lempar dadu" },
        37: { name: "Coin Flip", cmd: "!koin", desc: "Lempar koin" },
        38: { name: "Math Puzzle", cmd: "!mathpuzzle", desc: "Teka-teki matematika" },
        39: { name: "Memory Game", cmd: "!memory", desc: "Game memori" },
        40: { name: "Word Game", cmd: "!wordgame", desc: "Game kata" },
        
        // EDUCATION (41-50)
        41: { name: "Translator", cmd: "!translate", desc: "Terjemah teks" },
        42: { name: "Dictionary", cmd: "!kamus", desc: "Kamus bahasa" },
        43: { name: "Wikipedia Search", cmd: "!wiki", desc: "Cari di Wikipedia" },
        44: { name: "Learning Quiz", cmd: "!learn", desc: "Kuis belajar" },
        45: { name: "Math Solver", cmd: "!math", desc: "Solver matematika" },
        46: { name: "Science Facts", cmd: "!science", desc: "Fakta sains" },
        47: { name: "History Facts", cmd: "!history", desc: "Fakta sejarah" },
        48: { name: "Language Tutor", cmd: "!tutor", desc: "Tutor bahasa" },
        49: { name: "Flash Cards", cmd: "!flashcard", desc: "Kartu belajar" },
        50: { name: "Exam Prep", cmd: "!exam", desc: "Persiapan ujian" }
    }
};

async function sendMainMenu(sock, jid) {
    const menuText = `*🤖 ${config.BOT_NAME} v${config.BOT_VERSION}*\n` +
                    `_50 Fitur Lengkap siap digunakan!_\n\n` +
                    `📋 *MENU UTAMA*\n` +
                    `Pilih kategori fitur:\n\n` +
                    `1️⃣ *UTILITY* (Fitur 1-10)\n` +
                    `2️⃣ *MEDIA* (Fitur 11-20)\n` +
                    `3️⃣ *TOOLS* (Fitur 21-30)\n` +
                    `4️⃣ *GAMES* (Fitur 31-40)\n` +
                    `5️⃣ *EDUCATION* (Fitur 41-50)\n\n` +
                    `📝 *Cara Pakai:*\n` +
                    `• Ketik angka 1-5 untuk pilih kategori\n` +
                    `• Atau ketik !fitur [nomor]\n` +
                    `• Contoh: !fitur 1\n\n` +
                    `🔄 *Update:* v${config.BOT_VERSION}`;

    const sections = [
        {
            title: "📱 PILIH KATEGORI",
            rows: menuData.categories.map(cat => ({
                title: `${cat.id}. ${cat.name} (Fitur ${cat.start}-${cat.end})`,
                description: cat.description,
                rowId: `!kategori ${cat.id}`
            }))
        },
        {
            title: "⚙️ PERINTAH CEPAT",
            rows: [
                { title: "🏠 Menu Utama", rowId: "!menu" },
                { title: "📊 Status Bot", rowId: "!status" },
                { title: "❓ Bantuan", rowId: "!help" },
                { title: "👤 Owner", rowId: "!owner" }
            ]
        }
    ];

    await sock.sendMessage(jid, {
        text: menuText,
        footer: `Ketik "menu" untuk membuka menu ini lagi`,
        title: "MENU UTAMA",
        buttonText: "📱 PILIH KATEGORI",
        sections: sections
    });
}

async function sendCategoryMenu(sock, jid, categoryId) {
    const category = menuData.categories.find(c => c.id == categoryId);
    if (!category) return;

    const rows = [];
    for (let i = category.start; i <= category.end; i++) {
        const fitur = menuData.fiturList[i];
        rows.push({
            title: `${i}. ${fitur.name}`,
            description: fitur.desc,
            rowId: `!fitur ${i}`
        });
    }

    await sock.sendMessage(jid, {
        text: `*📂 KATEGORI: ${category.name}*\n${category.description}\n\nPilih fitur yang diinginkan:`,
        footer: `Fitur ${category.start}-${category.end}`,
        title: `DAFTAR FITUR ${category.name}`,
        buttonText: "🎯 PILIH FITUR",
        sections: [{ title: `FITUR ${category.name}`, rows }]
    });
}

async function sendFiturDetail(sock, jid, fiturNumber) {
    const fitur = menuData.fiturList[fiturNumber];
    if (!fitur) return;

    const text = `*🎯 FITUR ${fiturNumber}: ${fitur.name}*\n\n` +
                 `📝 _${fitur.desc}_\n\n` +
                 `⚡ *Perintah:* ${fitur.cmd}\n` +
                 `📂 *Kategori:* ${getCategoryName(fiturNumber)}\n\n` +
                 `🔧 *Cara Penggunaan:*\n` +
                 `Ketik: \`${fitur.cmd} [parameter]\`\n\n` +
                 `📌 *Contoh:*\n` +
                 `${getExampleUsage(fiturNumber)}\n\n` +
                 `Ketik "menu" untuk kembali ke menu utama.`;

    await sock.sendMessage(jid, { text });
}

function getCategoryName(fiturNumber) {
    for (const cat of menuData.categories) {
        if (fiturNumber >= cat.start && fiturNumber <= cat.end) {
            return cat.name;
        }
    }
    return "Unknown";
}

function getExampleUsage(fiturNumber) {
    const examples = {
        1: "!info",
        2: "!status",
        3: "!dlvideo https://example.com/video.mp4",
        9: "!currency 100 USD IDR",
        10: "!cuaca Jakarta",
        41: "!translate id en Halo dunia",
        45: "!math 2+2*2"
    };
    return examples[fiturNumber] || `${menuData.fiturList[fiturNumber]?.cmd} [parameter]`;
}

module.exports = {
    menuData,
    sendMainMenu,
    sendCategoryMenu,
    sendFiturDetail
};
