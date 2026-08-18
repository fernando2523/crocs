// Import dependencies
const axios = require("axios");
const getToken2 = require("../../components/gettoken2");
const db = require("../../components/db"); // Koneksi database
const date = require("date-and-time");
const { log } = require("node:console");
const { formatISO, parseISO } = require("date-fns");
const XLSX = require('xlsx');

// Konstanta Global
const REQUEST_HOST = "https://api.ginee.com";
const ACCESS_KEY = "24149de32ca192a5";
const SECRET_KEY = "d06535d93ed71299";
const MAX_BATCH_SIZE = 100;
const RATE_LIMIT_DELAY = 1000;
const MAX_PAGINATION_ITERATIONS = 100; // Batas maksimum iterasi pagination
const REQUEST_DELAY = 1000; // Penundaan antar batch

// === DEBUG: telusuri produk yang tidak ikut sync ===
// Bisa dioverride via env: DEBUG_SYNC_IDS="1025000118,1025000119"
const DEBUG_SYNC_IDS = (
    process.env.DEBUG_SYNC_IDS ||
    "1025000118,1025000119,1025000120,1025000121,1025000122,1025000123,1025000124,1025000125,1025000126,1025000161"
).split(",").map(s => s.trim()).filter(Boolean);


// Fungsi untuk menunda eksekusi
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper retry BLOCKING (WAJIB SUCCESS)
async function postWithRetry(fn, {
    retries = 5,
    delayMs = 1500,
    label = ''
} = {}) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fn();
            if (res?.data?.code === 'SUCCESS') {
                console.log(`✅ [${label}] BERHASIL (attempt ${attempt})`);
                return res;
            }
            const msg = res?.data?.message || 'API returned non-success';
            console.warn(`⚠️  [${label}] attempt ${attempt} — code: ${res?.data?.code} | msg: ${msg}`);
            throw new Error(msg);
        } catch (err) {
            console.error(`❌ [${label}] attempt ${attempt} GAGAL: ${err.message}`);
            if (attempt === retries) throw err;
            await delay(delayMs);
        }
    }
}

// Fungsi untuk mendapatkan rentang tanggal 2 hari terakhir
function getDatesForLastTwoDays() {
    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);
    return {
        createSince: twoDaysAgo.toISOString(),
        createTo: now.toISOString(),
    };
}

// Fungsi helper retryRequest untuk retry request axios
async function retryRequest(fn, retries = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
            if (attempt === retries) throw err;
            await delay(delayMs);
        }
    }
}

// Fungsi untuk sinkronisasi inventory master products Ginee dengan pagination
async function proccesSyncInventory() {
    try {
        const token = await getToken2("POST", "/openapi/product/master/v1/list", ACCESS_KEY, SECRET_KEY);
        const size = 100;
        let page = 0;
        let allProducts = [];
        const seenSpus = new Set();
        let detailSize = [];
        let gineeTotal = 0;              // total master product yang dilaporkan Ginee
        let rawSpuList = [];            // semua spu mentah (untuk debug)
        let rawSkuList = [];           // semua sku variasi mentah (untuk debug)

        while (page < MAX_PAGINATION_ITERATIONS) {
            const response = await axios.post(
                `${REQUEST_HOST}/openapi/product/master/v1/list`,
                { page, size },
                {
                    headers: {
                        Authorization: token,
                        "X-Advai-Country": "ID",
                        "Content-Type": "application/json",
                    },
                }
            );
            response.data.data.content.forEach(item => {
                // Kumpulkan data mentah untuk debug
                if (item.spu) rawSpuList.push(item.spu);
                (item.variationBriefs || []).forEach(v => { if (v.sku) rawSkuList.push(String(v.sku)); });

                if (item.spu && !seenSpus.has(item.spu)) {
                    seenSpus.add(item.spu);
                    allProducts.push({
                        spu: item.spu,
                        skus: (item.variationBriefs || [])
                            .map(variation => String(variation.sku || "").split(".")[1])
                            .filter(Boolean),
                        variations: (item.variationBriefs || [])
                            .map(variation => {
                                const parts = String(variation.sku || "").split(".");
                                return { id_produk: parts[0], size: parts[1] };
                            })
                            .filter(v => v.id_produk && v.size)
                    });
                }
            });

            const data = response.data.data;
            if (data && typeof data.total !== "undefined") gineeTotal = data.total;
            if (!data || !data.content || data.content.length === 0) break;
            if ((page + 1) * size >= data.total) break;

            page++;
            await delay(REQUEST_DELAY); // Respect rate limit
        }

        // === DEBUG TAHAP 0: ringkasan pagination master product ===
        console.log(`🐞 [PAGINATION] halaman diambil: ${page + 1} | produk unik terkumpul: ${allProducts.length} | total dilaporkan Ginee: ${gineeTotal} | SKU mentah: ${rawSkuList.length}`);
        if (gineeTotal > 0 && allProducts.length < gineeTotal) {
            console.log(`🐞 [PAGINATION] ⚠️  produk terkumpul (${allProducts.length}) < total Ginee (${gineeTotal}) → kemungkinan ada halaman yang belum terambil / dedup spu`);
        }

        // === DEBUG TAHAP 1: keberadaan produk target di master list Ginee ===
        console.log("========== 🐞 DEBUG SYNC — MASTER PRODUCT (GINEE) ==========");
        DEBUG_SYNC_IDS.forEach(dbgId => {
            const inRawSku = rawSkuList.filter(sku => sku.includes(dbgId));
            const inRawSpu = rawSpuList.filter(spu => String(spu).includes(dbgId));
            if (inRawSku.length === 0 && inRawSpu.length === 0) {
                console.log(`🐞 [RAW] ${dbgId} ❌ tidak muncul sama sekali di data mentah Ginee (spu maupun sku) → produk BELUM ADA di master product Ginee`);
            } else {
                console.log(`🐞 [RAW] ${dbgId} ⚠️  ADA di data mentah tapi tidak terparse → rawSpu=[${inRawSpu.join(', ')}] rawSku=[${inRawSku.join(', ')}] (cek format SKU harus id_produk.size)`);
            }
        });
        DEBUG_SYNC_IDS.forEach(dbgId => {
            const inAll = allProducts.filter(p =>
                p.spu === dbgId || (p.variations || []).some(v => v.id_produk === dbgId)
            );
            if (inAll.length === 0) {
                console.log(`🐞 [MASTER] ${dbgId} ❌ TIDAK ADA di master product list Ginee → produk belum terdaftar / belum di-mapping di Ginee`);
            } else {
                inAll.forEach(p => console.log(
                    `🐞 [MASTER] ${dbgId} ✅ spu=${p.spu} | sizes=[${p.skus.join(',')}] | variations=${JSON.stringify(p.variations)}`
                ));
                // Tandai kalau SKU-nya tidak mengandung ".size" (variations kosong)
                inAll.forEach(p => {
                    if (!p.variations || p.variations.length === 0) {
                        console.log(`🐞 [MASTER] ${dbgId} ⚠️  variations KOSONG → format SKU di Ginee kemungkinan tanpa ".size" (harus id_produk.size)`);
                    }
                });
            }
        });
        console.log("============================================================");

        // Fungsi untuk mengambil data pesanan dengan pagination
        async function fetchOrdersWithPagination() {
            const { createSince, createTo } = getDatesForLastTwoDays();
            const token = await getToken2("POST", "/openapi/order/v2/list-order", ACCESS_KEY, SECRET_KEY);
            const token2 = await getToken2("POST", "/openapi/v3/oms/order/item/batch-get", ACCESS_KEY, SECRET_KEY);
            const result_detail = [];

            const params = { createSince, createTo, size: MAX_BATCH_SIZE };
            let allOrders = [];
            let nextCursor = null;
            let iterationCount = 0;

            try {
                // Step 1: Paginate through all orders
                while (iterationCount < MAX_PAGINATION_ITERATIONS) {
                    if (nextCursor) {
                        params.nextCursor = nextCursor;
                    }

                    const response = await axios.post(`${REQUEST_HOST}/openapi/order/v2/list-order`, params, {
                        headers: {
                            "X-Advai-Country": "ID",
                            Authorization: token,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status !== 200) {
                        console.error("API Error:", response.status, response.data);
                        break;
                    }

                    const { data } = response.data;
                    if (data?.content?.length) {
                        allOrders = allOrders.concat(data.content);
                    }

                    nextCursor = data.nextCursor;
                    iterationCount++;
                    if (!nextCursor) break;

                    await delay(RATE_LIMIT_DELAY);
                }

                // Step 2: Filter PAID orders
                const orderIds = allOrders.filter(order => order.orderStatus === "PAID").map(order => order.orderId);
                if (orderIds.length === 0) {
                    console.log("No PAID orders found.");
                    return [];
                }

                // Step 3: Prepare concurrent batch requests
                const concurrencyLimit = 3;
                const batches = [];
                for (let i = 0; i < orderIds.length; i += MAX_BATCH_SIZE) {
                    batches.push(orderIds.slice(i, i + MAX_BATCH_SIZE));
                }

                async function processBatch(batch) {
                    try {
                        const response = await axios.post(`${REQUEST_HOST}/openapi/v3/oms/order/item/batch-get`, {
                            orderIds: batch,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                "X-Advai-Country": "ID",
                                Authorization: token2,
                            },
                        });

                        const items = (response.data.data || []).flatMap(order => order.items);
                        const groupedMap = new Map();
                        items.forEach(item => {
                            const skuParts = item.sku.split(".");
                            const key = `${skuParts[0]}.${skuParts[1]}`;
                            const existing = groupedMap.get(key) || 0;
                            groupedMap.set(key, existing + item.quantity);
                        });

                        const simplified = Array.from(groupedMap.entries()).map(([sku, qty]) => {
                            const [skuPart, sizePart] = sku.split(".");
                            return { sku: skuPart, size: sizePart, qty };
                        });

                        result_detail.push(...simplified);
                    } catch (err) {
                        console.error("Failed to fetch batch:", err.message);
                    }

                    await delay(REQUEST_DELAY); // throttle per request
                }

                const queue = [];
                for (let i = 0; i < batches.length; i += concurrencyLimit) {
                    const subset = batches.slice(i, i + concurrencyLimit);
                    await Promise.all(subset.map(processBatch));
                }

                return result_detail;
            } catch (error) {
                console.error("Error fetching orders:", error);
                throw error;
            }
        }

        const result_detail = await fetchOrdersWithPagination();

        await CompletedStock(result_detail);
        await matchProduct(allProducts, result_detail);
    } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
        throw error;
    }
}

async function CompletedStock(result_detail) {
    // Get current time in UTC then adjust to WIB (UTC+7)
    const nowUtc = new Date();
    const nowWib = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);

    const tanggal_skrg = date.format(nowWib, "YYYY-MM-DD");
    const tanggal1 = date.format(nowWib, "YYYY-MM-DD HH:mm:ss");
    const tanggal2 = date.format(nowWib, "YYYY-MM-DD HH:mm:ss");
    let connection;
    try {
        connection = await db.getConnection();

        const [cek_min] = await connection.query(
            `SELECT min
            FROM tb_notifikasi_minimum`
        );
        if (cek_min.length > 0) {
            var qty_minumun = cek_min[0].min;
        } else {
            var qty_minumun = 5;
        }

        const [cek_notifikasi_status] = await connection.query(
            `SELECT *
            FROM tb_notifikasi
            `
        );
        // console.log("cek_notifikasi_status", cek_notifikasi_status);
        // Update status for notifications where stock quantity exceeds minimum threshold


        const [datas] = await connection.query(
            `SELECT 
                tb_produk.id_produk,
                tb_produk.id_ware,
                tb_produk.produk,
                tb_variation.size,
                SUM(tb_variation.qty) as qty
            FROM tb_produk
            LEFT JOIN tb_variation
                ON tb_produk.id_produk = tb_variation.id_produk
                AND tb_produk.id_ware = tb_variation.id_ware
            WHERE 
            tb_variation.id_ware != 'WARE-0003'
            -- AND tb_variation.id_produk = '1024000011'
            GROUP BY tb_variation.id_produk,tb_variation.size
            `
        );

        const [datas2] = await connection.query(
            `SELECT 
                tb_produk.id_produk,
                tb_produk.id_ware,
                tb_produk.produk,
                tb_variation.size,
                SUM(tb_variation.qty) as qty
            FROM tb_produk
            LEFT JOIN tb_variation
                ON tb_produk.id_produk = tb_variation.id_produk
                AND tb_produk.id_ware = tb_variation.id_ware
            WHERE
            (
                tb_variation.size IN ('28','29','30','32','34','36')
                OR tb_variation.size IN ('XS','S','M','L','XL','XXL')
            )
            -- AND tb_variation.id_produk = '1024000011'
            AND tb_variation.id_ware != 'WARE-0003'
            GROUP BY tb_variation.id_produk,tb_variation.size
            `
        );

        // Filter datas to only those entries present in datas2 (matching id_produk, size, and qty <= qty_minumun)
        const filteredDatas = datas.filter(item =>
            datas2.some(d2 =>
                d2.id_produk === item.id_produk &&
                d2.size === item.size
            )
        );

        // Kurangi qty pada datas berdasarkan result_detail
        result_detail.forEach(({ sku, size, qty }) => {
            const item = filteredDatas.find(p => p.id_produk === sku && p.size === size);
            if (item) {
                item.qty = Math.max(0, parseInt(item.qty) - qty);
            }
        });

        if (filteredDatas.length === 0) {
            console.log("ℹ Tidak ada data stok yang memenuhi kondisi.");
        } else {
            console.log(`🔍 Memproses ${filteredDatas.length} data stok...`);
        }

        // Get last notification id and set currentNotifId
        const [lastNotif] = await connection.query(`SELECT MAX(id_notifikasi) as lastId FROM tb_notifikasi`);
        let currentNotifId = (lastNotif[0].lastId !== null ? lastNotif[0].lastId + 1 : 10001);

        // Ambil semua id_notifikasi, id_produk, id_ware, size yang sudah ada
        const [existingNotifs] = await connection.query(`
            SELECT id_notifikasi, id_produk, id_ware, size, qty
            FROM tb_notifikasi
        `);

        // Build update and insert lists by matching against existingNotifs directly
        const updateValues = [];
        const insertValues = [];

        filteredDatas.forEach(({ id_produk, id_ware, size, produk, qty }) => {
            const matchedUpdated = existingNotifs.find(item =>
                item.id_produk === id_produk &&
                item.id_ware === id_ware &&
                item.size === size &&
                item.qty != qty
            );

            if (matchedUpdated) {
                updateValues.push([qty, null, tanggal2, matchedUpdated.id_notifikasi]);
            }

            // Only insert if this combination does not yet exist
            const exists = existingNotifs.some(item =>
                item.id_produk === id_produk &&
                item.id_ware === id_ware &&
                item.size === size
            );
            if (!exists) {
                insertValues.push([
                    tanggal_skrg,
                    currentNotifId++,
                    id_produk,
                    id_ware,
                    produk,
                    size,
                    qty,
                    'ALL_MARKETPLACE',
                    null,
                    qty_minumun,
                    tanggal1,
                    tanggal2
                ]);
            }
        });

        // console.log("insertValues", insertValues.length);
        // console.log("DEBUG insertValues count:", insertValues.length);
        // console.log("DEBUG updateValues count:", updateValues.length);

        if (updateValues.length > 0) {
            for (const [qty, status_baca, updated_at, notifId] of updateValues) {
                await connection.query(
                    `UPDATE tb_notifikasi 
                     SET qty = ?, status_baca = ?, updated_at = ? 
                     WHERE id_notifikasi = ?`,
                    [qty, status_baca, updated_at, notifId]
                );
            }
        }

        if (insertValues.length > 0) {
            await connection.query(
                `INSERT INTO tb_notifikasi 
                (tanggal, id_notifikasi, id_produk, id_ware, produk, size, qty, status, status_baca, stok_min, created_at, updated_at)
                VALUES ?`,
                [insertValues]
            );
            // console.log(`✅ ${insertValues.length} notifikasi berhasil ditambahkan`);
        } else {
            console.log(`ℹ Tidak ada notifikasi baru yang perlu ditambahkan`);
        }

        // ⚠️ Dulu ada auto-reset "status = ALL_MARKETPLACE WHERE qty > stok_min" di sini.
        // Dihapus: `status` adalah assignment channel manual (SHOPEE/TIKTOK/ALL_MARKETPLACE)
        // yang di-set admin di halaman Stock Management, BUKAN flag notifikasi terbaca/resolved
        // (itu tugas kolom `status_baca`). Auto-reset ini diam-diam menghapus assignment channel
        // manual begitu stok naik di atas minimum, sehingga sync stok Shopee/TikTok jadi tidak
        // akurat lagi setelah restock.

    } catch (error) {
        console.error("Error in CompletedStock:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.release();
            } catch (e) {
                console.warn("Warning: Failed to release DB connection in CompletedStock:", e);
            }
        }
    } // close finally and function
}

async function matchProduct(allProducts, result_detail) {
    // ⚠️ Dulu ada watchdog di sini yang `process.exit(1)` kalau matchProduct macet >10 menit.
    // Dihapus: cron.js SUDAH punya watchdog 10 menit sendiri yang membungkus seluruh
    // proccesSyncInventory() (termasuk matchProduct). Dua watchdog process.exit yang independen
    // race satu sama lain dan mematikan SELURUH proses node cron.js tanpa auto-restart
    // (dijalankan bare "node cron.js", tanpa pm2/systemd) — begitu ke-trigger, sync stok
    // berhenti total & diam sampai direstart manual. Cukup satu watchdog otoritatif di cron.js.
    const TIMEOUT_LIMIT = 10 * 60 * 1000;
    const watchdog = setTimeout(() => {
        console.warn("⏰ matchProduct masih berjalan setelah 10 menit (belum di-exit, hanya info).");
    }, TIMEOUT_LIMIT);
    var tokenWare = await getToken2("POST", "/openapi/warehouse/v1/search", ACCESS_KEY, SECRET_KEY)
    var tokenWare_getlockedstok = await getToken2("POST", "/openapi/warehouse-inventory/v1/sku/list", ACCESS_KEY, SECRET_KEY)
    var tokenAutoInsertAvailable = await getToken2("POST", "/openapi/v1/oms/stock/available-stock/update", ACCESS_KEY, SECRET_KEY)
    var tokenAutoInsert = await getToken2("POST", "/openapi/warehouse-inventory/v1/product/stock/update", ACCESS_KEY, SECRET_KEY)
    var tokenpromo = await getToken2("POST", "/openapi/warehouse-inventory/v1/sku/list", ACCESS_KEY, SECRET_KEY)
    let connection;

    try {
        connection = await db.getConnection();
        const groupedBySpu = {};
        console.log("start macthproduct");
        // console.log("allProducts", allProducts);
        // console.log("result_detail", result_detail);

        allProducts.forEach(item => {
            if (!groupedBySpu[item.spu]) {
                groupedBySpu[item.spu] = { sizes: new Set(), variations: [] };
            }
            item.skus.forEach(sku => groupedBySpu[item.spu].sizes.add(sku));
            (item.variations || []).forEach(v => {
                const key = `${v.id_produk}.${v.size}`;
                if (!groupedBySpu[item.spu].variations.some(e => `${e.id_produk}.${e.size}` === key)) {
                    groupedBySpu[item.spu].variations.push(v);
                }
            });
        });

        const groupedAllProducts = Object.entries(groupedBySpu).map(([spu, data]) => ({
            spu,
            skus: Array.from(data.sizes),
            variations: data.variations
        }));

        let allCekProductLocal = [];
        for (const product of groupedAllProducts) {
            // Ambil id_produk unik dari SKU variasi (bukan dari spu),
            // karena SKU bisa punya id_produk berbeda dari SPU-nya di Ginee
            const varIds = product.variations && product.variations.length > 0
                ? [...new Set(product.variations.map(v => v.id_produk).filter(Boolean))]
                : [product.spu];

            console.log(`🔍 SPU: ${product.spu} → varIds DB: [${varIds.join(', ')}]`);

            for (const varId of varIds) {
                const [cekProductLocal] = await connection.query(
                    `SELECT
                        tb_produk.id_produk,
                        tb_produk.produk,
                        tb_variation.size,
                        SUM(tb_variation.qty) AS qty,
                        MAX(s.ip) AS ip
                    FROM tb_produk
                    LEFT JOIN tb_variation
                        ON tb_produk.id_produk = tb_variation.id_produk
                        AND tb_produk.id_ware   = tb_variation.id_ware
                    LEFT JOIN (
                        SELECT id_area, MAX(ip) AS ip
                        FROM tb_store
                        GROUP BY id_area
                    ) AS s ON tb_variation.id_area = s.id_area
                    WHERE tb_produk.id_produk = ?
                        AND tb_produk.id_ware != "WARE-0003"
                    GROUP BY tb_produk.id_produk, tb_produk.produk, tb_variation.size`,
                    [varId]
                );
                allCekProductLocal.push(...cekProductLocal);
            }
        }
        console.log("allCekProductLocal", allCekProductLocal);

        // === DEBUG TAHAP 2: hasil query DB lokal (tb_produk/tb_variation) ===
        console.log("========== 🐞 DEBUG SYNC — DB LOKAL ==========");
        DEBUG_SYNC_IDS.forEach(dbgId => {
            const rows = allCekProductLocal.filter(r => String(r.id_produk) === dbgId);
            if (rows.length === 0) {
                console.log(`🐞 [DB LOKAL] ${dbgId} ❌ 0 baris → tidak ada di tb_produk/tb_variation (selain WARE-0003) atau id_produk beda`);
            } else {
                console.log(`🐞 [DB LOKAL] ${dbgId} ✅ ${rows.length} baris → ${rows.map(r => `${r.size}:${r.qty}`).join(', ')}`);
            }
        });
        console.log("==============================================");

        // Kurangi qty pada allCekProductLocal berdasarkan result_detail
        result_detail.forEach(({ sku, size, qty }) => {
            const item = allCekProductLocal.find(p => p.id_produk === sku && p.size === size);
            if (item) {
                item.qty = Math.max(0, parseInt(item.qty) - qty);
            }
        });

        // Load Stock_parting but scope it to relevant products to avoid full-table scans when running for all products
        const targetIds = Array.from(new Set(allCekProductLocal.map(r => r.id_produk)));
        let Stock_parting = [];
        if (targetIds.length > 0) {
            const CHUNK = 500; // adjust if needed based on dataset and max_packet_size
            for (let i = 0; i < targetIds.length; i += CHUNK) {
                const chunk = targetIds.slice(i, i + CHUNK);
                const [rows] = await connection.query(
                    `SELECT 
                  id_produk,
                  id_ware,
                  produk,
                  size,
                  qty,
                 CASE
                    WHEN status = 'SHOPEE' AND id_ware = 'WARE-0002' THEN 'WARE-0003'
                    WHEN status = 'TIKTOK' AND id_ware = 'WARE-0001' THEN 'WARE-0003'
                    WHEN status = 'SHOPEE' THEN 'WARE-0001'
                    WHEN status = 'TIKTOK' THEN 'WARE-0002'
                    ELSE status
                END AS status
               FROM tb_notifikasi
               WHERE id_produk IN (?)
               ORDER BY qty DESC, created_at DESC`,
                    [chunk]
                );
                Stock_parting.push(...rows);
            }
        }
        // console.log("Stock_parting", Stock_parting);

        const filteredCekProductLocal = allCekProductLocal.filter(item => {
            return groupedAllProducts.some(product => {
                // Prioritaskan matching lewat variations (SKU id_produk + size)
                if (product.variations && product.variations.length > 0) {
                    return product.variations.some(v =>
                        v.id_produk === item.id_produk && v.size === item.size
                    );
                }
                // Fallback ke spu jika variations tidak tersedia
                return product.spu === item.id_produk && product.skus.includes(item.size);
            });
        });

        // === DEBUG TAHAP 3: apakah lolos filteredCekProductLocal (match variations/skus Ginee) ===
        console.log("========== 🐞 DEBUG SYNC — FILTER MATCH GINEE ==========");
        DEBUG_SYNC_IDS.forEach(dbgId => {
            const rows = filteredCekProductLocal.filter(r => String(r.id_produk) === dbgId);
            if (rows.length === 0) {
                console.log(`🐞 [FILTER] ${dbgId} ❌ TERBUANG → id_produk.size lokal tidak cocok dengan variations/skus dari Ginee`);
            } else {
                console.log(`🐞 [FILTER] ${dbgId} ✅ lolos → ${rows.map(r => r.size).join(', ')}`);
            }
        });
        console.log("=======================================================");

        const warehouseResponse = await axios({
            method: "POST",
            url: REQUEST_HOST + "/openapi/warehouse/v1/search",
            data: {
                warehouseStatus: "ENABLE",
                warehouseType: "MY_WAREHOUSE"
            },
            headers: {
                'Content-Type': 'application/json',
                'X-Advai-Country': 'ID',
                'Authorization': tokenWare
            },
        });

        const warehouseData = warehouseResponse.data.data.content;

        // `warehouseList` sebelumnya tidak dideklarasikan (implicit global) — kalau fetch ini
        // gagal/kosong di satu cycle, kode lama diam-diam lanjut pakai sisa data dari cycle
        // sebelumnya (atau undefined kalau ini run pertama). Sekarang: scoped ke fungsi ini,
        // dan kalau kosong langsung throw supaya cycle ini gagal terlihat di log & di-retry
        // otomatis oleh cron 3 menit lagi — bukan diam-diam pakai data basi/kosong.
        if (!warehouseData || warehouseData.length === 0) {
            throw new Error("warehouse/v1/search mengembalikan data kosong — batalkan sync cycle ini");
        }
        const warehouseList = warehouseData.map((item) => ({
            id: item.id,
            code: item.code,
        }));
        // console.log("warehouseList", warehouseList);

        // Aggregate result_detail by sku and size
        const aggregatedResultDetail = result_detail.reduce((acc, { sku, size, qty }) => {
            const key = `${sku}.${size}`;
            if (!acc[key]) {
                acc[key] = { sku, size, qty: 0 };
            }
            acc[key].qty += qty;
            return acc;
        }, {});
        const summarizedResultDetail = Object.values(aggregatedResultDetail);

        // Fetch locked stock for each warehouse individually, with retry
        const stockLockedResults = await Promise.all(
            warehouseList.map(async (warehouse) => {
                const resp = await retryRequest(() =>
                    axios.post(
                        `${REQUEST_HOST}/openapi/warehouse-inventory/v1/sku/list`,
                        {
                            page: 0,
                            size: 50,
                            warehouseId: warehouse.id
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Advai-Country': 'ID',
                                'Authorization': tokenWare_getlockedstok
                            }
                        }
                    ), 3
                );
                return { warehouseId: warehouse.id, content: resp.data.data.content };
            })
        );
        // console.log("stockLockedResults", stockLockedResults);

        // Collect simplified stock info for use later
        const stockInventories = [];
        stockLockedResults.forEach(({ content }) => {
            content.forEach(item => {
                const inv = item.warehouseInventory;
                const mv = item.masterVariation;
                // Extract warehouseId and lockedStock
                const warehouseId = inv.warehouseId;
                const lockedStock = inv.lockedStock;
                // Take first two segments of masterSku (e.g., "1024000003.34")
                const parts = mv.masterSku.split('.');
                const masterSku = `${parts[0]}.${parts[1]}`;
                stockInventories.push({ warehouseId, lockedStock, masterSku });
            });
        });
        // Aggregate lockedStock by masterSku
        const aggregated = stockInventories.reduce((acc, { masterSku, lockedStock }) => {
            acc[masterSku] = (acc[masterSku] || 0) + lockedStock;
            return acc;
        }, {});
        // Convert to array of objects
        const groupedStockInventories = Object.entries(aggregated).map(([masterSku, lockedStock]) => ({
            masterSku,
            lockedStock
        }));

        // Calculate remaining locked stock after subtracting sold quantities, excluding zero-locked entries
        const RESULTSISA_LOCKEDSTOCK = groupedStockInventories
            .filter(({ lockedStock }) => lockedStock !== 0)
            .map(({ masterSku, lockedStock }) => {
                const [sku, size] = masterSku.split('.');
                const detail = summarizedResultDetail.find(item => item.sku === sku && item.size === size);
                const qtySold = detail ? detail.qty : 0;
                return {
                    masterSku: sku,
                    size: size,
                    sisaStok: Math.max(0, lockedStock - qtySold)
                    // sisaStok: 0
                };
            });
        // console.log("RESULTSISA_LOCKEDSTOCK", RESULTSISA_LOCKEDSTOCK);

        // Build product array with updated qty (local qty + sisaStok) preserving fields
        const product = filteredCekProductLocal.map(({ id_produk, produk, size, qty, ip }) => {
            // Find remaining locked stock for this product and size
            const lockedEntry = RESULTSISA_LOCKEDSTOCK.find(
                entry => entry.masterSku === id_produk && entry.size === size
            );
            const locked = lockedEntry ? lockedEntry.sisaStok : 0;
            return {
                id_produk,
                produk,
                size,
                qty: Math.max(0, (parseInt(qty, 10) || 0) - locked),
                ip
            };
        });
        // console.log("product", JSON.stringify({ product }, null, 2));

        const stockMap = {};
        const stockMapAvailable = {};
        warehouseList.forEach(item => {
            stockMap[item.id] = {
                warehouseId: item.id,
                stockList: []
            };
            stockMapAvailable[item.id] = {
                warehouseId: item.id,
                stockList: []
            };
        });

        // tahap 1
        for (const element of product) {
            const matchedParting = Stock_parting.filter(p =>
                p.id_produk === element.id_produk &&
                p.size === element.size
            );

            for (const warehouse of warehouseList) {
                let quantity = 0;

                const matchingPart = matchedParting.find(p => p.status === warehouse.code);
                if (matchingPart) {
                    // Exact warehouse match
                    quantity = parseInt(matchingPart.qty);
                } else if (matchedParting.some(p => p.status === 'ALL_MARKETPLACE')) {
                    // Fallback for all-marketplace status
                    quantity = parseInt(element.qty);
                } else if (matchedParting.length === 0) {
                    // Produk baru tanpa partitioning rule → perlakukan sebagai ALL_MARKETPLACE
                    quantity = parseInt(element.qty);
                } else {
                    // Ada partitioning rule tapi bukan untuk warehouse ini
                    quantity = 0;
                }

                stockMap[warehouse.id].stockList.push({
                    masterSku: `${element.id_produk}.${element.size}.${warehouse.code}`,
                    quantity,
                    remark: "manual adjustment"
                });
            }
        }
        // console.log("stockMap", JSON.stringify({ stockMap }, null, 2));


        const groupedStockList_Warehouse = Object.values(stockMap);
        // end tahap 1

        // Build skuMap: each warehouseId maps to its list of masterSku
        const skuMap = {};
        groupedStockList_Warehouse.forEach(({ warehouseId, stockList }) => {
            if (!skuMap[warehouseId]) skuMap[warehouseId] = [];
            stockList.forEach(item => skuMap[warehouseId].push(item.masterSku));
        });
        // console.log("skuMap", JSON.stringify({ skuMap }, null, 2));


        // Fetch detailed inventory for each warehouse using masterSkuList, with pagination
        const allInventory = [];
        for (const [warehouseId, masterSkuList] of Object.entries(skuMap)) {

            let page = 0;
            while (true) {
                try {
                    const response = await axios({
                        method: "POST",
                        url: REQUEST_HOST + "/openapi/warehouse-inventory/v1/sku/list",
                        data: {
                            page,
                            size: 200,
                            warehouseId,
                            masterSkuList
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Advai-Country': 'ID',
                            'Authorization': tokenpromo
                        },
                    });
                    const content = response.data?.data?.content || [];

                    const filtered = content
                        .filter(item => {
                            const promo = item.warehouseInventory?.promotionStock;
                            const avail = item.warehouseInventory?.availableStock;
                            // tetap masukkan kalau field ada (walaupun nilainya 0)
                            return promo !== undefined || avail !== undefined;
                        })
                        .map(item => ({
                            warehouseId,
                            masterSku: item.masterVariation?.masterSku ?? null,
                            size: item.masterVariation?.masterSku.split(".")[1] ?? null,
                            availableStock: item.warehouseInventory?.availableStock ?? 0,
                            promotionStock: item.warehouseInventory?.promotionStock ?? 0
                        }));
                    // console.log("filtered", JSON.stringify({ filtered }, null, 2));

                    allInventory.push(...filtered);
                    if (content.length < 200) break;
                    page++;
                } catch (error) {
                    console.error(`Error for warehouseId ${warehouseId} on page ${page}:`, error.response?.data || error.message);
                    break;
                }
            }
        }
        // console.log("allInventory", allInventory);


        // ===============================
        // BUILD VALID MASTER SKU SET
        // ===============================
        const validMasterSkuSet = new Set(
            allInventory
                .map(i => i.masterSku)
                .filter(Boolean)
        );

        // === DEBUG TAHAP 4: apakah produk ada di warehouse-inventory Ginee (validMasterSkuSet) ===
        // Ini gate terakhir: SKU yang TIDAK ada di sini akan ter-filter dan TIDAK di-sync.
        console.log("========== 🐞 DEBUG SYNC — GINEE WAREHOUSE INVENTORY ==========");
        DEBUG_SYNC_IDS.forEach(dbgId => {
            const valid = [...validMasterSkuSet].filter(sku => String(sku).startsWith(dbgId + "."));
            if (valid.length === 0) {
                console.log(`🐞 [GINEE INV] ${dbgId} ❌ TIDAK ADA di warehouse-inventory Ginee → akan ter-filter, TIDAK di-sync (produk belum di-bind ke warehouse di Ginee)`);
            } else {
                console.log(`🐞 [GINEE INV] ${dbgId} ✅ ada: [${valid.join(', ')}]`);
            }
        });
        console.log("==============================================================");

        const groupedStockList_Warehouse_final = Object.values(stockMap);
        // console.log("groupedStockList_Warehouse_final", JSON.stringify({ groupedStockList_Warehouse_final }, null, 2));

        // Map promotionStock per masterSku PENUH (sudah termasuk kode warehouse/channel,
        // mis. "1024000011.32.WARE-0001" untuk Shopee, "1024000011.32.WARE-0002" untuk TikTok).
        // allInventory diambil per-warehouseId dari Ginee, jadi promotionStock di sini SUDAH
        // scoped ke channel masing-masing — TIDAK boleh dijumlah lintas warehouse, karena
        // promo yang jalan di 1 channel tidak boleh ikut memotong stok channel lain.
        const promoByFullSku = allInventory.reduce((acc, ai) => {
            if (ai.masterSku) acc[ai.masterSku] = ai.promotionStock ?? 0;
            return acc;
        }, {});

        // Adjust grouped final stock by subtracting HANYA promotionStock milik masterSku (warehouse) itu sendiri
        const adjustedGroupedStock = groupedStockList_Warehouse_final.map(entry => {
            const adjustedList = entry.stockList.map(item => {
                const promo = promoByFullSku[item.masterSku] || 0;
                return {
                    ...item,
                    quantity: Math.max(0, item.quantity - promo)
                };
            });
            return {
                warehouseId: entry.warehouseId,
                stockList: adjustedList
            };
        });

        adjustedGroupedStock.forEach((item, idx) => {
            console.log(
                `Warehouse #${idx} (${item.warehouseId}) stockList length:`,
                item.stockList.length
            );
        });

        // for (const entry of adjustedGroupedStock) {
        //     console.log(`🏭 START warehouse ${entry.warehouseId}`);
        //     const chunkSize = 10;

        //     // 🔐 FILTER SKU YANG VALID UNTUK GINEE
        //     const safeStockList = entry.stockList.filter(item =>
        //         validMasterSkuSet.has(item.masterSku)
        //     );

        //     if (safeStockList.length === 0) {
        //         console.warn(`⚠️ No valid SKU for warehouse ${entry.warehouseId}, skip`);
        //         continue;
        //     }

        //     for (let i = 0; i < safeStockList.length; i += chunkSize) {
        //         const chunk = safeStockList.slice(i, i + chunkSize);

        //         console.log(
        //             `➡️ ${entry.warehouseId} | product stock | chunk ${i / chunkSize + 1}/${Math.ceil(safeStockList.length / chunkSize)}`
        //         );

        //         await postWithRetry(
        //             () => axios({
        //                 method: "POST",
        //                 url: REQUEST_HOST + "/openapi/warehouse-inventory/v1/product/stock/update",
        //                 data: {
        //                     warehouseId: entry.warehouseId,
        //                     stockList: chunk.map(({ masterSku, quantity, remark }) => ({
        //                         masterSku,
        //                         quantity,
        //                         remark
        //                     })),
        //                 },
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'X-Advai-Country': 'ID',
        //                     'Authorization': tokenAutoInsert
        //                 },
        //             }),
        //             { label: `PRODUCT ${entry.warehouseId}` }
        //         );

        //         await delay(1000);
        //     }

        //     console.log(`✅ DONE product stock ${entry.warehouseId}`);
        //     await delay(2000);
        // }

        const adjustedGroupedStock_Available = adjustedGroupedStock.map(entry => {
            const safeStockList = entry.stockList
                .filter(item => validMasterSkuSet.has(item.masterSku))
                .map(item => ({
                    masterSku: item.masterSku,
                    action: "OVER_WRITE",
                    quantity: item.quantity,
                    warehouseId: entry.warehouseId,
                    shelfInventoryId: "",
                    remark: "from openapi"
                }));

            return {
                warehouseId: entry.warehouseId,
                stockList: safeStockList
            };
        });
        // console.log("adjustedGroupedStock_Available", JSON.stringify({ adjustedGroupedStock_Available }, null, 2));

        // for (const entry of adjustedGroupedStock_Available) {

        //     // ⛔ GUARD CLAUSE — WAJIB
        //     if (!entry.stockList || entry.stockList.length === 0) {
        //         console.warn(`⚠️ No valid available stock for ${entry.warehouseId}, skip`);
        //         continue;
        //     }

        //     console.log(`🏭 START available-stock ${entry.warehouseId}`);
        //     const chunkSize = 10;

        //     for (let i = 0; i < entry.stockList.length; i += chunkSize) {
        //         const chunk = entry.stockList.slice(i, i + chunkSize);

        //         console.log(
        //             `➡️ ${entry.warehouseId} | available stock | chunk ${i / chunkSize + 1}/${Math.ceil(entry.stockList.length / chunkSize)}`
        //         );

        //         await postWithRetry(
        //             () => axios({
        //                 method: "POST",
        //                 url: REQUEST_HOST + "/openapi/v1/oms/stock/available-stock/update",
        //                 data: { stockList: chunk },
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'X-Advai-Country': 'ID',
        //                     'Authorization': tokenAutoInsertAvailable
        //                 },
        //             }),
        //             { label: `AVAILABLE ${entry.warehouseId}` }
        //         );

        //         await delay(600);
        //     }

        //     console.log(`✅ DONE available-stock ${entry.warehouseId}`);
        //     await delay(1500);
        // }

        async function processAvailableWarehouse(entry) {
            if (!entry.stockList || entry.stockList.length === 0) {
                console.warn(`⚠️  Skip warehouse ${entry.warehouseId} — stockList kosong`);
                return;
            }

            const total = entry.stockList.length;
            const totalChunks = Math.ceil(total / 10);
            console.log(`\n🏭 START available-stock warehouse: ${entry.warehouseId} | total SKU: ${total} | chunks: ${totalChunks}`);
            const chunkSize = 10;

            for (let i = 0; i < entry.stockList.length; i += chunkSize) {
                const chunk = entry.stockList.slice(i, i + chunkSize);
                const chunkNo = i / chunkSize + 1;

                console.log(`\n➡️  [${entry.warehouseId}] chunk ${chunkNo}/${totalChunks} — ${chunk.length} SKU:`);
                chunk.forEach(s => console.log(`     • ${s.masterSku} → qty: ${s.quantity}`));

                const res = await postWithRetry(
                    () => axios({
                        method: "POST",
                        url: REQUEST_HOST + "/openapi/v1/oms/stock/available-stock/update",
                        data: { stockList: chunk },
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Advai-Country': 'ID',
                            'Authorization': tokenAutoInsertAvailable
                        },
                    }),
                    { label: `AVAILABLE ${entry.warehouseId} chunk ${chunkNo}/${totalChunks}` }
                );

                // Log detail response Ginee jika ada failedList
                if (res?.data?.data?.failedList?.length > 0) {
                    console.warn(`⚠️  [${entry.warehouseId}] chunk ${chunkNo} — ada ${res.data.data.failedList.length} SKU GAGAL:`);
                    res.data.data.failedList.forEach(f => console.warn(`     ✗ ${f.masterSku} | reason: ${f.message || f.reason || JSON.stringify(f)}`));
                }

                await delay(700);
            }

            console.log(`\n✅ SELESAI warehouse: ${entry.warehouseId} (${total} SKU diproses)\n`);
        }
        // === DEBUG TAHAP 5: payload akhir yang benar-benar akan di-sync ke Ginee ===
        console.log("========== 🐞 DEBUG SYNC — PAYLOAD AKHIR (yang di-sync) ==========");
        DEBUG_SYNC_IDS.forEach(dbgId => {
            const found = adjustedGroupedStock_Available
                .flatMap(e => e.stockList)
                .filter(s => String(s.masterSku).startsWith(dbgId + "."));
            if (found.length === 0) {
                console.log(`🐞 [FINAL] ${dbgId} ❌ TIDAK ikut di-sync (0 SKU di payload akhir)`);
            } else {
                console.log(`🐞 [FINAL] ${dbgId} ✅ di-sync: ${found.map(s => `${s.masterSku}=${s.quantity}`).join(', ')}`);
            }
        });
        console.log("================================================================");

        // ===============================
        // RUN AVAILABLE STOCK (SEMI PARALEL)
        // ===============================
        const CONCURRENCY = 2;

        for (let i = 0; i < adjustedGroupedStock_Available.length; i += CONCURRENCY) {
            const batch = adjustedGroupedStock_Available.slice(i, i + CONCURRENCY);
            await Promise.all(batch.map(processAvailableWarehouse));
        }


    } catch (error) {
        console.error("Error in matchProduct:", error);
        throw error;
    } finally {
        clearTimeout(watchdog);
        if (connection) {
            try {
                await connection.release();
            } catch (e) {
                console.warn("Warning: Failed to release DB connection in matchProduct:", e);
            }
        }
    }
}

// module.exports = { proccesSyncInventory, matchProduct, CompletedStock };
module.exports = { proccesSyncInventory, CompletedStock, matchProduct };
// module.exports = { proccesSyncInventory, CompletedStock };

