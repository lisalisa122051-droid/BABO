module.exports = {
    // Konfigurasi Bot
    BOT_NAME: '🤖 BOT 50 FITUR',
    BOT_VERSION: '2.0',
    BOT_OWNER: '628xxxxxxx@c.us', // Ganti dengan nomor owner
    BOT_PREFIX: ['!', '/', '.'],
    
    // Fitur yang diaktifkan
    FEATURES: {
        UTILITY: true,
        MEDIA: true,
        TOOLS: true,
        GAMES: true,
        EDUCATION: true
    },
    
    // API Keys (isi di .env)
    API_KEYS: {
        OPENWEATHER: process.env.OPENWEATHER_API,
        GOOGLE_TRANSLATE: process.env.GOOGLE_API,
        YOUTUBE: process.env.YOUTUBE_API
    },
    
    // Settings
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    SESSION_TIMEOUT: 60000, // 60 detik
    AUTO_READ: true,
    AUTO_TYPING: false
};
