const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads');
const EXPIRATION_DAYS = 90;

function cleanupOldUploads() {
    const now = Date.now();

    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return console.error('📁 フォルダ読み込み失敗:', err);

        files.forEach((file) => {
            const filePath = path.join(UPLOAD_DIR, file);

            fs.stat(filePath, (err, stats) => {
                if (err) return console.error('📄 ファイル情報取得失敗:', err);

                const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
                if (ageInDays > EXPIRATION_DAYS) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('❌ 削除失敗:', file);
                        } else {
                            console.log('🧹 古いファイル削除:', file);
                        }
                    });
                }
            });
        });
    });
}

module.exports = cleanupOldUploads;
