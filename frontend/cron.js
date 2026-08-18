// // cronjob.js
// const { fetchOrdersWithPagination } = require("./pages/api/fetchOrders");
// // Memastikan file backup dijalankan (jadwal backup diatur di dalam file ini)
// require("./pages/api/autobackupDB");
// const { proccesSyncInventory } = require("./pages/api/syncInventory");

// let cronRunning = false;

// // Global error handlers to catch promise rejections and exceptions
// process.on('unhandledRejection', (reason, p) => {
//     console.error('Unhandled Rejection at:', p, 'reason:', reason);
// });
// process.on('uncaughtException', err => {
//     console.error('Uncaught Exception:', err);
// });

// async function runCycle() {
//     if (cronRunning) return;
//     cronRunning = true;

//     try {
//         // ===============================
//         // STEP 1: FETCH ORDERS
//         // ===============================
//         console.log("🧾 Fetching orders...");
//         const orders = await fetchOrdersWithPagination();
//         console.log(`🧾 Fetched ${orders.length} orders successfully.`);

//         // ===============================
//         // STEP 2: SYNC INVENTORY
//         // ===============================
//         console.log("📦 Starting inventory sync...");

//         const watchdog = setTimeout(() => {
//             console.error("⏰ Inventory sync stuck >10 menit, exiting.");
//             process.exit(1);
//         }, 10 * 60 * 1000);

//         try {
//             await proccesSyncInventory();
//             console.log("📦 Inventory sync completed.");
//         } finally {
//             clearTimeout(watchdog);
//         }

//     } catch (error) {
//         console.error("❌ Error in cron cycle:", error);
//     } finally {
//         cronRunning = false;
//         // ===============================
//         // NEXT CYCLE (3 MENIT SETELAH SELESAI)
//         // ===============================
//         setTimeout(runCycle, 3 * 60 * 1000);
//     }
// }

// // Mulai cron pertama kali
// runCycle();