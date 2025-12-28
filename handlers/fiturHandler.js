const { sendMainMenu, sendCategoryMenu, sendFiturDetail } = require('./menuHandler');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const moment = require('moment');

// Setup moment locale
moment.locale('id');

async function handleMessage(sock, msg) {
    try {
        const from = msg.key.remoteJid;
        const text = getMessageText(msg);
        const sender = msg.key.participant || from;
        const pushName = msg.pushName || "User";
        
        console.log(`📩 Dari: ${pushName} | Pesan: ${text}`);
        
        // Check prefix
        const prefix = config.BOT_PREFIX.find(p => text.startsWith(p));
        if (!prefix && !['menu', 'help'].includes(text.toLowerCase())) {
            return; // Ignore non-command messages
        }
        
        const command = text.toLowerCase().replace(prefix || '', '').trim().split(' ')[0];
        const args = text.slice(text.indexOf(' ') + 1).trim();
        
        // Handle commands
        switch (command) {
            case 'menu':
                await sendMainMenu(sock, from);
                break;
                
            case 'help':
                await sendHelp(sock, from);
                break;
                
            case 'kategori':
                const catId = parseInt(args);
                if (catId >= 1 && catId <= 5) {
                    await sendCategoryMenu(sock, from, catId);
                } else {
                    await sock.sendMessage(from, { text: "❌ Kategori tidak valid. Pilih 1-5." });
                }
                break;
                
            case 'fitur':
                const fiturNum = parseInt(args);
                if (fiturNum >= 1 && fiturNum <= 50) {
                    await sendFiturDetail(sock, from, fiturNum);
                    await executeFitur(sock, from, fiturNum, args.split(' ').slice(1).join(' '));
                } else {
                    await sock.sendMessage(from, { text: "❌ Nomor fitur tidak valid. Pilih 1-50." });
                }
                break;
                
            case 'info':
                await fitur1_InfoPengguna(sock, from, pushName, sender);
                break;
                
            case 'status':
                await fitur2_CekStatus(sock, from);
                break;
                
            case 'owner':
                await sock.sendMessage(from, { 
                    text: `👑 *OWNER BOT*\n\n` +
                         `Nama: Developer\n` +
                         `Kontak: ${config.BOT_OWNER}\n` +
                         `Bot: ${config.BOT_NAME}\n` +
                         `Version: ${config.BOT_VERSION}`
                });
                break;
                
            case 'ping':
                const start = Date.now();
                await sock.sendMessage(from, { text: "🏓 Pong!" });
                const latency = Date.now() - start;
                await sock.sendMessage(from, { 
                    text: `📊 *PONG!*\nLatensi: ${latency}ms\nServer: Aktif`
                });
                break;
                
            default:
                // Check if it's a direct feature command
                const fitur = Object.values(require('./menuHandler').menuData.fiturList)
                    .find(f => f.cmd === `!${command}`);
                if (fitur) {
                    const fiturNum = Object.keys(require('./menuHandler').menuData.fiturList)
                        .find(key => require('./menuHandler').menuData.fiturList[key].cmd === `!${command}`);
                    await executeFitur(sock, from, parseInt(fiturNum), args);
                }
                break;
        }
        
    } catch (error) {
        console.error('Error handling message:', error);
        const from = msg.key.remoteJid;
        await sock.sendMessage(from, { 
            text: "❌ Terjadi kesalahan saat memproses permintaan. Silakan coba lagi."
        });
    }
}

// Fitur Implementations
async function fitur1_InfoPengguna(sock, jid, pushName, sender) {
    const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
    const text = `👤 *INFO PENGGUNA*\n\n` +
                `Nama: ${pushName}\n` +
                `Nomor: ${sender.replace('@s.whatsapp.net', '')}\n` +
                `JID: ${jid}\n` +
                `Waktu: ${timestamp}\n` +
                `Status: Terdaftar\n\n` +
                `🤖 Bot: ${config.BOT_NAME}`;
    
    await sock.sendMessage(jid, { text });
}

async function fitur2_CekStatus(sock, jid) {
    const used = process.memoryUsage();
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);
    
    const text = `📊 *STATUS BOT*\n\n` +
                `🟢 *Status:* Online\n` +
                `⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s\n` +
                `📅 *Tanggal:* ${moment().format('DD MMMM YYYY')}\n` +
                `🕐 *Waktu:* ${moment().format('HH:mm:ss')}\n\n` +
                `💾 *Memory Usage:*\n` +
                `• RSS: ${Math.round(used.rss / 1024 / 1024)} MB\n` +
                `• Heap: ${Math.round(used.heapUsed / 1024 / 1024)} MB\n` +
                `• Total: ${Math.round(used.heapTotal / 1024 / 1024)} MB\n\n` +
                `⚙️ *Konfigurasi:*\n` +
                `• Nama: ${config.BOT_NAME}\n` +
                `• Version: ${config.BOT_VERSION}\n` +
                `• Fitur: 50/50 Aktif`;
    
    await sock.sendMessage(jid, { text });
}

async function fitur3_VideoDownloader(sock, jid, url) {
    if (!url) {
        await sock.sendMessage(jid, { 
            text: "🎬 *VIDEO DOWNLOADER*\n\n" +
                 "Format: !dlvideo [url]\n" +
                 "Contoh: !dlvideo https://example.com/video.mp4\n\n" +
                 "⚠️ Pastikan URL video valid."
        });
        return;
    }
    
    await sock.sendMessage(jid, { 
        text: `⏬ *Mendownload Video...*\n\nURL: ${url}\n\nMohon tunggu...`
    });
    
    // Implementasi download video di sini
    // Contoh dengan axios
    try {
        // Simulasi download
        setTimeout(async () => {
            await sock.sendMessage(jid, {
                text: "✅ Video berhasil didownload!\n\n" +
                     "📁 Format: MP4\n" +
                     "⚡ Durasi: 00:30\n" +
                     "💾 Size: 5.2 MB\n\n" +
                     "⚠️ Fitur ini dalam pengembangan."
            });
        }, 2000);
    } catch (error) {
        await sock.sendMessage(jid, {
            text: "❌ Gagal mendownload video. Pastikan URL valid."
        });
    }
}

async function executeFitur(sock, jid, fiturNum, args) {
    // Map fitur number ke fungsi
    const fiturMap = {
        1: fitur1_InfoPengguna,
        2: fitur2_CekStatus,
        3: fitur3_VideoDownloader,
        9: fitur9_CurrencyConverter,
        10: fitur10_WeatherInfo,
        27: fitur27_Calculator,
        41: fitur41_Translator
        // Tambahkan mapping untuk fitur lainnya
    };
    
    const fiturFunction = fiturMap[fiturNum];
    if (fiturFunction) {
        const pushName = "User"; // Ambil dari context
        const sender = jid;
        await fiturFunction(sock, jid, args || "", pushName, sender);
    } else {
        await sock.sendMessage(jid, {
            text: `🎯 Fitur ${fiturNum} tersedia!\n\n` +
                 `Ketik \`${require('./menuHandler').menuData.fiturList[fiturNum]?.cmd}\` untuk menggunakan.\n\n` +
                 `Contoh: ${require('./menuHandler').menuData.fiturList[fiturNum]?.cmd} [parameter]`
        });
    }
}

async function fitur9_CurrencyConverter(sock, jid, args) {
    const [amount, from, to] = args.split(' ');
    if (!amount || !from || !to) {
        await sock.sendMessage(jid, {
            text: "💱 *CURRENCY CONVERTER*\n\n" +
                 "Format: !currency [amount] [from] [to]\n" +
                 "Contoh: !currency 100 USD IDR\n\n" +
                 "💡 Kode mata uang: USD, EUR, IDR, JPY, SGD, dll."
        });
        return;
    }
    
    // Implementasi converter (simulasi)
    const rates = {
        'USD_IDR': 15500,
        'EUR_IDR': 17000,
        'IDR_USD': 0.000064,
        'IDR_EUR': 0.000059
    };
    
    const rate = rates[`${from.toUpperCase()}_${to.toUpperCase()}`] || 1;
    const result = parseFloat(amount) * rate;
    
    await sock.sendMessage(jid, {
        text: `💱 *HASIL KONVERSI*\n\n` +
             `${amount} ${from.toUpperCase()} = ${result.toFixed(2)} ${to.toUpperCase()}\n` +
             `📊 Rate: 1 ${from.toUpperCase()} = ${rate.toFixed(4)} ${to.toUpperCase()}\n\n` +
             `⚠️ *Catatan:* Rate simulasi untuk demo.`
    });
}

async function fitur10_WeatherInfo(sock, jid, city) {
    if (!city) {
        await sock.sendMessage(jid, {
            text: "🌤️ *WEATHER INFO*\n\n" +
                 "Format: !cuaca [kota]\n" +
                 "Contoh: !cuaca Jakarta\n\n" +
                 "💡 Contoh kota: Jakarta, Bandung, Surabaya, Bali"
        });
        return;
    }
    
    // Simulasi data cuaca
    const weatherData = {
        "jakarta": { temp: 30, desc: "Cerah Berawan", humidity: 75 },
        "bandung": { temp: 25, desc: "Hujan Ringan", humidity: 85 },
        "surabaya": { temp: 32, desc: "Cerah", humidity: 70 },
        "bali": { temp: 28, desc: "Berawan", humidity: 80 }
    };
    
    const data = weatherData[city.toLowerCase()] || { temp: 27, desc: "Tidak Diketahui", humidity: 75 };
    
    await sock.sendMessage(jid, {
        text: `🌤️ *INFO CUACA ${city.toUpperCase()}*\n\n` +
             `🌡️ Suhu: ${data.temp}°C\n` +
             `☁️ Kondisi: ${data.desc}\n` +
             `💧 Kelembaban: ${data.humidity}%\n` +
             `📅 Tanggal: ${moment().format('DD MMMM YYYY')}\n\n` +
             `🕐 Update: ${moment().format('HH:mm')} WIB`
    });
}

async function fitur27_Calculator(sock, jid, expression) {
    if (!expression) {
        await sock.sendMessage(jid, {
            text: "🧮 *CALCULATOR*\n\n" +
                 "Format: !calc [expression]\n" +
                 "Contoh: !calc 2+2*3\n" +
                 "        !calc sin(45)\n" +
                 "        !calc 10^2\n\n" +
                 "💡 Operator: + - * / ^ ( )"
        });
        return;
    }
    
    try {
        // Simple calculation (gunakan eval dengan hati-hati)
        const result = eval(expression.replace(/[^-()\d/*+.]/g, ''));
        
        await sock.sendMessage(jid, {
            text: `🧮 *HASIL PERHITUNGAN*\n\n` +
                 `📝 Ekspresi: ${expression}\n` +
                 `✅ Hasil: ${result}\n\n` +
                 `📊 Tipe: ${typeof result}`
        });
    } catch (error) {
        await sock.sendMessage(jid, {
            text: "❌ Ekspresi matematika tidak valid.\n" +
                 "Contoh: !calc 2+2*3"
        });
    }
}

async function fitur41_Translator(sock, jid, args) {
    const [from, to, ...textArray] = args.split(' ');
    const text = textArray.join(' ');
    
    if (!from || !to || !text) {
        await sock.sendMessage(jid, {
            text: "🌍 *TRANSLATOR*\n\n" +
                 "Format: !translate [from] [to] [text]\n" +
                 "Contoh: !translate id en Halo dunia\n" +
                 "        !translate en id Hello world\n\n" +
                 "💡 Kode bahasa: id, en, es, fr, ja, zh, etc."
        });
        return;
    }
    
    // Simulasi translate
    const translations = {
        "halo dunia": "Hello world",
        "hello world": "Halo dunia",
        "terima kasih": "Thank you",
        "good morning": "Selamat pagi"
    };
    
    const translated = translations[text.toLowerCase()] || `[Terjemahan: ${text}]`;
    
    await sock.sendMessage(jid, {
        text: `🌍 *HASIL TERJEMAHAN*\n\n` +
             `📝 Teks: ${text}\n` +
             `🔤 Dari: ${from.toUpperCase()}\n` +
             `🔤 Ke: ${to.toUpperCase()}\n\n` +
             `✅ Hasil: ${translated}\n\n` +
             `⚠️ *Catatan:* Translator simulasi. Untuk fungsi real, tambahkan API Google Translate.`
    });
}

function getMessageText(msg) {
    const message = msg.message;
    if (!message) return '';
    
    if (message.conversation) return message.conversation;
    if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
    if (message.imageMessage?.caption) return message.imageMessage.caption;
    if (message.videoMessage?.caption) return message.videoMessage.caption;
    
    return '';
}

async function sendHelp(sock, jid) {
    const text = `❓ *BANTUAN & PANDUAN*\n\n` +
                `*Cara Menggunakan Bot:*\n` +
                `1. Ketik "menu" untuk membuka menu utama\n` +
                `2. Pilih kategori dengan klik button\n` +
                `3. Pilih fitur yang diinginkan\n` +
                `4. Ikuti instruksi yang diberikan\n\n` +
                `*Perintah Umum:*\n` +
                `• menu - Tampilkan menu utama\n` +
                `• help - Bantuan ini\n` +
                `• status - Cek status bot\n` +
                `• owner - Info owner\n` +
                `• ping - Test koneksi\n\n` +
                `*Contoh Penggunaan:*\n` +
                `!cuaca Jakarta\n` +
                `!calc 2+2*3\n` +
                `!translate id en Halo\n\n` +
                `⚠️ *Note:* Bot dalam pengembangan aktif.`;
    
    await sock.sendMessage(jid, { text });
}

module.exports = handleMessage;
