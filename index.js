require('dotenv').config();
const { startBot } = require('./lib/connection');
const { handleMessage } = require('./handlers/fiturHandler');
const fs = require('fs');
const path = require('path');

// Buat folder jika belum ada
const folders = ['auth_info', 'data', 'temp'];
folders.forEach(folder => {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

async function main() {
    try {
        console.log('🚀 Memulai WhatsApp Bot...');
        console.log('⏳ Menghubungkan ke WhatsApp...');
        
        const sock = await startBot();
        
        console.log('✅ Bot berhasil dijalankan!');
        console.log('📱 Bot siap menerima pesan');
        console.log('📊 50 Fitur tersedia');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Tangani proses exit
process.on('SIGINT', () => {
    console.log('\n🛑 Bot dihentikan');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Error tak terduga:', err);
});

main();
