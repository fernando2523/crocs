// ./pages/api/autobackupDB.js
const { exec } = require('child_process');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');

function backupDatabase() {
    console.log('Memulai proses backup database...');

    // Gunakan nama file statis agar setiap backup menimpa file yang sama
    const backupFileName = `backup_gudangsandal.sql`;
    // Jika file ini berada di folder pages/api, folder public berada di dua level di atas (__dirname)
    const backupFilePath = path.join(__dirname, '..', '..', 'public', backupFileName);
    fs.mkdirSync(path.dirname(backupFilePath), { recursive: true });

    const MYSQLDUMP = process.env.MYSQLDUMP_PATH || 'mysqldump';

    // Perintah mysqldump dengan konfigurasi database Anda
    const backupCommand = `${MYSQLDUMP} -h 66.42.49.106 -u 4media -p"Kintamani1@#$" gudangsandaldb_final > "${backupFilePath}"`;

    exec(backupCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error saat backup database: ${error.message}`);
            return;
        }
        if (stderr) {
            console.warn(`mysqldump stderr (non-fatal): ${stderr}`);
        }
        console.log(`Backup database berhasil disimpan di ${backupFilePath}`);
    });
}

// Jadwalkan backup database setiap hari pada pukul 23:00
// Cron expression '0 23 * * *' berarti pada menit 0, jam 23, setiap hari
cron.schedule('0 23 * * *', backupDatabase, {
    scheduled: true,
    timezone: 'Asia/Jakarta',
});

module.exports = { backupDatabase };