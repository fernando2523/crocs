const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "127.0.0.1", // Ganti dengan host database Anda
    user: "4media",      // Ganti dengan username database Anda
    password: "Kintamani1@#$", // Ganti dengan password database Anda
    database: "gudangsandaldb_final", // Ganti dengan nama database Anda
    waitForConnections: true,
    connectionLimit: 10,
    port: 3307,
    queueLimit: 0,
    connectTimeout: 60000, // Tambahkan timeout 60 detik
    acquireTimeout: 30000,
    timezone: '+07:00',        // Set timezone to Waktu Indonesia Barat (UTC+7)
    dateStrings: true,         // Return date/time fields as strings in the given timezone
});

pool.on('error', err => {
    console.error('MySQL pool error:', err);
});

module.exports = pool.promise(); // Gunakan promise untuk query async/await