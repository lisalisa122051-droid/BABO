const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const config = require('../config');

const msgRetryCounterCache = new NodeCache();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: state,
        msgRetryCounterCache,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
    });

    // QR Code handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('\n📱 Scan QR Code ini:');
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'open') {
            console.log('\n✅ Berhasil terhubung ke WhatsApp!');
            await updateBotStatus(sock);
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log(`⚠️  Koneksi terputus: ${lastDisconnect?.error?.message}`);
            
            if (shouldReconnect) {
                console.log('🔄 Mencoba menghubungkan kembali...');
                setTimeout(startBot, 3000);
            }
        }
    });

    // Credentials update
    sock.ev.on('creds.update', saveCreds);

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        require('../handlers/fiturHandler')(sock, msg);
    });

    // Connection status
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'connecting') {
            console.log('🔄 Menghubungkan...');
        }
    });

    return sock;
}

async function updateBotStatus(sock) {
    try {
        await sock.updateProfileName(config.BOT_NAME);
        await sock.sendPresenceUpdate('available');
        console.log(`🤖 ${config.BOT_NAME} siap digunakan!`);
    } catch (error) {
        console.error('Gagal update status:', error);
    }
}

module.exports = { startBot };
