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
const RATE_LIMIT_DELAY = 5000;
const MAX_PAGINATION_ITERATIONS = 100; // Batas maksimum iterasi pagination
const REQUEST_DELAY = 1000; // Penundaan antar batch

// Fungsi untuk mendapatkan rentang tanggal 2 hari terakhir
function getDatesForLastTwoDays() {
    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 4);
    return {
        createSince: twoDaysAgo.toISOString(),
        createTo: now.toISOString(),
    };
}

// Fungsi untuk menunda eksekusi
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fungsi untuk mengambil data pesanan dengan pagination
async function fetchOrdersWithPagination() {
    const { createSince, createTo } = getDatesForLastTwoDays();
    const token = getToken2("POST", "/openapi/order/v2/list-order", ACCESS_KEY, SECRET_KEY);

    const params = { createSince, createTo, size: MAX_BATCH_SIZE };
    let allOrders = [];
    let nextCursor = null;
    let iterationCount = 0;

    try {
        do {
            if (nextCursor) {
                params.nextCursor = nextCursor;
            }

            // Buat permintaan ke API
            const response = await axios.post(
                `${REQUEST_HOST}/openapi/order/v2/list-order`,
                params,
                {
                    headers: {
                        "X-Advai-Country": "ID",
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status !== 200) {
                console.error("API Error:", response.status, response.data);
                break;
            }

            const { data } = response.data;

            if (data && Array.isArray(data.content)) {
                allOrders = allOrders.concat(data.content);
            } else {
                console.warn("Invalid or empty content received:", data.content);
            }

            nextCursor = data.nextCursor;
            iterationCount++;

            if (iterationCount >= MAX_PAGINATION_ITERATIONS) {
                console.warn("Reached maximum pagination iterations.");
                break;
            }

            if (nextCursor) {
                await delay(RATE_LIMIT_DELAY);
            }
        } while (nextCursor);

        // Filter orders by status PAID and map to orderIds
        const readytoShip = allOrders.filter(order => order.orderStatus === "READY_TO_SHIP" || order.orderStatus === "400" || order.orderStatus === "AWAITING_COLLECTION");
        const orderIds = readytoShip.map(order => order.orderId); // Pastikan struktur data sesuai
        // Filter orders by status PAID and map to orderIds
        const pending = allOrders.filter(order => order.externalOrderStatus === "PENDING");
        // console.log("pending awal", pending);

        // Panggil fetchOrderDetails dengan ID pesanan yang sudah difilter
        const detailedOrders = await fetchOrderDetails(orderIds);

        // Panggil fungsi untuk memasukkan ke database
        await insertOrdersToDatabase(detailedOrders);
        if (pending.length > 0) {
            await ChangePending(pending);
        }

        return detailedOrders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

// Fungsi untuk mendapatkan detail pesanan
async function fetchOrderDetails(orderIds) {
    const token = getToken2("POST", "/openapi/v3/oms/order/item/batch-get", ACCESS_KEY, SECRET_KEY);
    const detailedOrders = [];

    for (let i = 0; i < orderIds.length; i += MAX_BATCH_SIZE) {
        const batchIds = orderIds.slice(i, i + MAX_BATCH_SIZE);
        try {
            const response = await axios({
                method: "POST",
                url: `${REQUEST_HOST}/openapi/v3/oms/order/item/batch-get`,
                headers: {
                    "Content-Type": "application/json",
                    "X-Advai-Country": "ID",
                    Authorization: token,
                },
                data: { orderIds: batchIds },
            });

            detailedOrders.push(...(response.data.data || []));

            console.log(`Fetched details for batch ${i / MAX_BATCH_SIZE + 1}`);
        } catch (error) {
            console.error("Failed to fetch order details:", error.message);
        }

        await delay(REQUEST_DELAY);
    }

    return detailedOrders;
}

async function insertOrdersToDatabase(orders) {
    let connection;

    const tanggal1 = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal2 = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    try {
        connection = await db.getConnection();
        if (orders.length === 0) {
            console.log("No orders to insert.");
            return;
        }
        let ordersAwal = orders;
        let dataAwal = [];
        let result = [];
        let ordersInput = [];
        let rowsData = [];
        let idstore = null;
        let idware = null;
        let rowsSkippedPrice = [];

        const [cek_hapus_history] = await connection.query(
            `SELECT history_order_api.id_pesanan FROM tb_invoice 
             LEFT JOIN history_order_api ON tb_invoice.id_pesanan = history_order_api.id_pesanan 
             GROUP BY history_order_api.id_pesanan`
        );
        if (cek_hapus_history.length > 1) {
            // Use for...of loop instead of forEach
            for (const ceks of cek_hapus_history) {
                try {
                    await connection.query(
                        `DELETE FROM history_order_api WHERE id_pesanan = ?`,
                        [ceks.id_pesanan]
                    );
                    console.log(`Berhasil delete order dengan id: ${ceks.id_pesanan}`);
                } catch (err) {
                    console.error("Error saat memproses deleteHistory:", err);
                }
            }
        }

        ordersAwal.forEach(order => {
            if (order.channelId === "TOKOPEDIA_ID") {
                order.externalOrderId = order.externalOrderSn.includes("/")
                    ? order.externalOrderSn.split('/')[3]
                    : order.externalOrderSn;
            }
        });

        const query = `
            SELECT temp.externalOrderId
            FROM (
                SELECT '${ordersAwal.map(order =>
            order.externalOrderId
        ).join("' AS externalOrderId UNION SELECT '")}' AS externalOrderId
            ) AS temp
            LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = temp.externalOrderId
            WHERE tb_invoice.id_pesanan IS NULL
        `;
        const [newOrders] = await connection.query(query);

        for (const selectOrders of newOrders) {
            // orders.forEach(items => {
            //     if (items.externalOrderId === selectOrders.externalOrderId) {
            //         console.log(items.externalOrderId, '-', selectOrders.externalOrderId);
            //     }
            // });
            const Input = orders.find((items) => items.externalOrderId === selectOrders.externalOrderId);
            ordersInput.push(Input)
        }

        const dataStore = [];
        for (const order of ordersInput) {
            const [cek_store] = await connection.query(
                `SELECT id_store, id_ware FROM tb_store WHERE shopid='${order.shopId}'`
            );
            cek_store.forEach(store => {
                dataStore.push({
                    shopId: order.shopId,
                    id_store: store.id_store,
                    id_ware: store.id_ware,
                });
            });
        }

        ordersInput.forEach((vars) => {
            if (Array.isArray(vars.logisticsInfos)) {
                vars.logisticsInfos.forEach((logisticsInfo) => {
                    if (Array.isArray(vars.items)) {
                        // Periksa apakah externalOrderId sudah ada di dataAwal
                        const existingIndex = dataAwal.findIndex((entry) => entry.externalOrderId === vars.externalOrderId);

                        if (existingIndex > -1) {
                            // Jika externalOrderId sudah ada, gabungkan items
                            vars.items.forEach((item) => {
                                dataAwal[existingIndex].items.push({
                                    variationName: item.variationName,
                                    productImageUrl: item.productImageUrl,
                                    productName: item.productName,
                                    quantity: item.quantity,
                                });
                            });

                            // Update morethan jika jumlah items lebih dari 1
                            dataAwal[existingIndex].morethan = "true";
                        } else {
                            // Jika externalOrderId belum ada, buat entri baru
                            dataAwal.push({
                                orderId: vars.orderId,
                                externalOrderId: vars.externalOrderId,
                                externalCreateAt: formatISO(parseISO(vars.externalCreateAt), { representation: "date" }),
                                shopId: vars.shopId,
                                totalAmount: vars.channelId === "SHOPEE_ID"
                                    ? vars.paymentInfo.totalAmount
                                    : vars.channelId === "TOKOPEDIA_ID"
                                        ? parseInt(vars.paymentInfo.subTotal) - (parseInt(vars.paymentInfo.subTotal) * 0.12)
                                        : vars.channelId === "TIKTOK_ID"
                                            ? parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.175) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.03)
                                            : 0, // Nilai default jika tidak ada channel yang cocok

                                logisticsProviderName: logisticsInfo.logisticsProviderName,
                                externalOrderStatus: vars.externalOrderStatus,
                                channelId: vars.channelId,
                                items: vars.items.map((item) => {
                                    // Periksa apakah "variationName" memiliki koma
                                    const hasComma = item.variationName.includes(",");

                                    return {
                                        // variationName: item.variationName,
                                        variationName: item.variationName.includes(",")
                                            ? item.variationName.split(',')[1].trim()
                                            : item.variationName.trim(),
                                        productImageUrl: item.productImageUrl,
                                        productName: item.productName,
                                        quantity: item.quantity,
                                        spu: vars.channelId === "TIKTOK_ID" || vars.channelId === "TOKOPEDIA_ID"
                                            ? item.sku.split(".")[0]
                                            : vars.channelId === "SHOPEE_ID"
                                                ? (item.spu === "" || item.spu === null ? item.sku.split(".")[0] : item.spu)
                                                : null,
                                    };
                                }),
                                morethan: vars.items.length > 1 ? "true" : "false", // Tentukan apakah lebih dari 1 item
                            });
                        }
                    }

                });
            }
        });

        dataAwal.forEach((order) => {
            // Temukan data sinkronisasi toko berdasarkan nama toko
            const syncshope = dataStore.find((syncshope) => syncshope.shopId === order.shopId);
            if (syncshope) {
                idstore = syncshope.id_store;
                idware = syncshope.id_ware;
            }

            // Looping melalui setiap item dalam pesanan
            order.items.forEach((item) => {
                result.push({
                    id_produk: item.spu,
                    size: item.variationName,
                    id_store: idstore,
                    id_ware: idware,
                    quantity: item.quantity,
                    no_pesanan: order.externalOrderId,
                    total_amount: order.totalAmount,
                    nama_produk: item.productName,
                    gambar_produk: item.productImageUrl,
                    morethan: order.externalOrderId + "-" + order.morethan,
                });
            });
        });

        if (result.length > 0) {
            await axios
                .post(`https://api.gudangsandal.com/v1/cekbeforeordermassal`, {
                    result: result,
                })
                .then(function (response) {
                    response.data.result.forEach((pesanan) => {
                        // 1. Cek status pesanan
                        const isAllItemsValid = pesanan.items.every((item) => parseInt(item.qty_ready) > 0);

                        // 2. Tentukan parameter berdasarkan status
                        const parameter = isAllItemsValid ? "GO" : "SKIP";

                        // 3. Push semua item dengan parameter yang sesuai
                        pesanan.items.forEach((item) => {
                            rowsData.push({
                                produk: item.produk,
                                idproduk: item.id_produk,
                                size: item.size,
                                harga_beli: 200000,
                                qty_ready: item.qty_ready,
                                qty: item.qtysales,
                                img: item.img,
                                source: item.source,
                                id_ware: item.id_ware,
                                id_store: item.id_store,
                                harga_jual: item.harga_jual,
                                payment: "PAID",
                                id_pesanan: item.no_pesanan,
                                total_amount: item.total_amount,
                                morethan: item.morethan,
                                parameter: parameter // Parameter sama untuk semua item dalam 1 pesanan
                            });
                        });
                    });

                    // 4. Filter data
                    const dataQtyReady = rowsData.filter((data) => data.parameter === "GO");
                    const dataQtyNotReady = rowsData.filter((data) => data.parameter === "SKIP");

                    Promise.all(
                        dataQtyNotReady.map(async (data) => {
                            try {
                                // Cek apakah id_pesanan sudah ada di database
                                const [rows] = await connection.query(
                                    `SELECT 1 FROM history_order_api WHERE id_pesanan = ? LIMIT 1`,
                                    [data.id_pesanan]
                                );

                                if (rows.length === 0) {
                                    // Jika belum ada, lakukan INSERT
                                    await connection.query(
                                        `INSERT INTO history_order_api
                                        (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                        [
                                            tanggal_skrg,
                                            data.id_pesanan,
                                            data.idproduk,
                                            data.id_ware,
                                            data.produk,
                                            data.size,
                                            data.qty,
                                            data.qty_ready,
                                            data.total_amount,
                                            data.reason || 'N/A',
                                            'Gagal Input Qty di Apss Habis !!',
                                            tanggal1,
                                            tanggal2,
                                        ]
                                    );
                                    console.log(`Data berhasil diinsert untuk id_pesanan: ${data.id_pesanan}`);
                                } else {
                                    console.log(`Data dengan id_pesanan ${data.id_pesanan} sudah ada di tabel history_order_api. Tidak melakukan INSERT.`);
                                }
                            } catch (err) {
                                console.error("Error saat memproses dataQtyNotReady:", err);
                            }
                        })
                    );

                    if (dataQtyReady.length > 0) {
                        axios
                            .post(`https://api.gudangsandal.com/v1/syncordermassal`, {
                                data: dataQtyReady,
                                tanggal: tanggal_skrg,
                                id_store: idstore,
                                users: "Auto Insert Api",
                                status_display: "display_false",
                            })
                            .then(async (response) => {
                                const { data } = response.data.result;
                                console.log("data", data.processedOrders);

                                // const ws5 = XLSX.utils.json_to_sheet(data);
                                // const wb5 = XLSX.utils.book_new();
                                // XLSX.utils.book_append_sheet(wb5, ws5, "data");
                                // XLSX.writeFile(wb5, 'data.xlsx');

                                if (data.processedOrders.length > 0) {
                                    // Pastikan untuk menunggu query SELECT selesai
                                    const [cek_pesanan] = await connection.query(
                                        `SELECT id_pesanan FROM history_order_api`
                                    );

                                    await Promise.all(
                                        data.processedOrders.map(async (order) => {
                                            // Cek apakah order.id_pesanan ada di hasil query cek_pesanan
                                            const orderExists = cek_pesanan.some(
                                                (item) => item.id_pesanan === order.id_pesanan
                                            );

                                            if (orderExists) {
                                                try {
                                                    await connection.query(
                                                        `DELETE FROM history_order_api WHERE id_pesanan = ?`,
                                                        [order.id_pesanan]
                                                    );
                                                    console.log(`Berhasil delete order dengan id: ${order.id_pesanan}`);
                                                } catch (err) {
                                                    console.error("Error saat memproses deleteHistory:", err);
                                                }
                                            }
                                        })
                                    );
                                }

                                if (data.skippedPrices.length > 0) {
                                    dataQtyReady.forEach((Inputs) => {
                                        data.skippedPrices.forEach((order) => {
                                            if (Inputs.id_pesanan === order.id_pesanan) {
                                                rowsSkippedPrice.push({
                                                    produk: Inputs.produk,
                                                    idproduk: Inputs.idproduk,
                                                    size: Inputs.size,
                                                    qty_ready: Inputs.qty_ready,
                                                    qty: Inputs.qty,
                                                    id_ware: Inputs.id_ware,
                                                    id_pesanan: Inputs.id_pesanan,
                                                    total_amount: Inputs.total_amount,
                                                    requiredTotal: order.requiredTotal,
                                                    reason: "Harga Jual di Bawah Ketentuan Harga Apps",
                                                });
                                            }
                                        });
                                    });
                                    console.log("rowsSkippedPrice", rowsSkippedPrice.length);

                                    Promise.all(
                                        rowsSkippedPrice.map(async (data) => {
                                            try {
                                                // Cek apakah id_pesanan sudah ada di database
                                                const [rows] = await connection.query(
                                                    `SELECT 1 FROM history_order_api WHERE id_pesanan = ? LIMIT 1`,
                                                    [data.id_pesanan]
                                                );

                                                if (rows.length === 0) {
                                                    // Jika belum ada, lakukan INSERT
                                                    await connection.query(
                                                        `INSERT INTO history_order_api
                                                        (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
                                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                        [
                                                            tanggal_skrg,
                                                            data.id_pesanan,
                                                            data.idproduk,
                                                            data.id_ware,
                                                            data.produk,
                                                            data.size,
                                                            data.qty,
                                                            data.qty_ready,
                                                            data.total_amount,
                                                            data.requiredTotal,
                                                            data.reason,
                                                            tanggal1,
                                                            tanggal2,
                                                        ]
                                                    );
                                                    // console.log(`Data berhasil diinsert untuk id_pesanan: ${data.id_pesanan}`);
                                                } else {
                                                    console.log(`Data dengan id_pesanan ${data.id_pesanan} sudah ada di tabel history_order_api. Tidak melakukan INSERT.`);
                                                }
                                            } catch (err) {
                                                console.error("Error saat memproses rowsSkippedPrice:", err);
                                            }
                                        })
                                    );
                                }
                            });
                    }
                });
        } else {
            console.log("No new orders to insert.");
        }

    } catch (error) {
        console.error("Failed to insert orders into the database:", error.message);
        console.error("Stack Trace:", error.stack);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

async function ChangePending(pending) {
    let datasync = [];
    let params_data = [];
    const currentItemsUtama = pending;
    // Mengelompokkan order berdasarkan shopId tanpa mengecek properti items
    const groupedOrders = currentItemsUtama.reduce((acc, order) => {
        // Inisialisasi grup jika shopId belum ada
        if (!acc[order.shopId]) {
            acc[order.shopId] = [];
        }
        // Tentukan externalOrderId berdasarkan channel (gunakan channel, bukan channelId)
        const externalId = order.channel !== "TOKOPEDIA_ID"
            ? order.externalOrderId
            : order.externalOrderSn.includes("/")
                ? order.externalOrderSn.split("/")[3]
                : order.externalOrderSn;
        // Tambahkan externalOrderId jika belum ada dalam grup
        if (!acc[order.shopId].includes(externalId)) {
            acc[order.shopId].push(externalId);
        }
        return acc;
    }, {});

    // Buat array datasync dengan format yang diinginkan
    for (const shopId in groupedOrders) {
        datasync.push({
            shopsString: shopId,
            dataExternalOrderId: groupedOrders[shopId],
        });
    }

    // Validasi: lempar error jika datasync kosong
    if (datasync.length === 0) {
        throw new Error("Parameter datasync tidak ditemukan atau kosong.");
    }

    params_data.push({
        syncDataType: "ORDER_HOT_NORMAL",
        syncAction: "SPECIFIC_ID",
        datasync: datasync,
    });

    const request_host = 'https://api.ginee.com';
    const request_uri = '/openapi/v3/oms/order/sync';
    const http_method = 'POST';
    const params = params_data;
    const access_key = '24149de32ca192a5';
    const secret_key = 'd06535d93ed71299';

    // Mendapatkan token otentikasi
    const token = getToken2("POST", "/openapi/v3/oms/order/sync", access_key, secret_key);

    let results = [];
    // Perbaikan: validasi dan iterasi data parameter dengan benar
    if (Array.isArray(params) && params.length > 0) {
        // Karena params adalah array dengan satu objek yang memuat properti datasync,
        // maka iterasi dilakukan pada objek tersebut dan selanjutnya pada array datasync-nya.
        for (const param of params) {
            for (const dataItem of param.datasync) {
                const shopId = dataItem.shopsString;
                const externalOrderIds = dataItem.dataExternalOrderId;
                let batches = [];

                // Jika data lebih dari 100, bagi ke dalam batch dengan maksimal 100 item
                if (Array.isArray(externalOrderIds) && externalOrderIds.length > 100) {
                    batches = chunkArray(externalOrderIds, 100);
                } else {
                    batches = [externalOrderIds];
                }

                // Proses setiap batch secara sequential untuk menghindari rate limit
                for (const batch of batches) {
                    let success = false;
                    let responseData = null;
                    let attempt = 0;
                    let delayTime = 1000; // Delay awal 1 detik

                    // Lakukan percobaan ulang hingga berhasil (maksimal 10 kali)
                    while (!success && attempt < 10) {
                        try {
                            const response = await axios({
                                method: http_method,
                                url: request_host + request_uri,
                                data: {
                                    syncDataType: param.syncDataType,
                                    syncAction: param.syncAction,
                                    shopId: shopId,
                                    externalOrderIds: batch,
                                },
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Advai-Country': 'ID',
                                    'Authorization': token, // pastikan token yang digunakan benar
                                },
                            });
                            responseData = response.data;
                            success = true;
                        } catch (error) {
                            attempt++;
                            const status = error.response ? error.response.status : null;
                            console.error(`Error processing batch for shop ${shopId} (attempt ${attempt}):`, status, error.message);

                            // Jika error 429 (rate limit), tingkatkan delay secara eksponensial
                            if (status === 429) {
                                console.log(`Rate limit hit. Menunggu ${delayTime} ms sebelum retry...`);
                                await new Promise(resolve => setTimeout(resolve, delayTime));
                                delayTime *= 2;
                            } else {
                                // Untuk error lain, tunggu delay awal sebelum retry
                                await new Promise(resolve => setTimeout(resolve, delayTime));
                            }
                        }
                    }

                    // Jika setelah 10 kali percobaan masih gagal, lempar error untuk shop tersebut
                    if (!success) {
                        throw new Error(`Gagal memproses batch untuk shop ${shopId} setelah beberapa percobaan.`);
                    }

                    results.push({
                        shopId: shopId,
                        response: responseData,
                    });
                    // Optional: delay singkat antar batch untuk mengurangi beban server
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }
    } else {
        throw new Error("Parameter datasync tidak ditemukan atau kosong.");
    }
    console.log("results akhir : ", results);
}

module.exports = { fetchOrdersWithPagination, fetchOrderDetails, insertOrdersToDatabase, ChangePending };
