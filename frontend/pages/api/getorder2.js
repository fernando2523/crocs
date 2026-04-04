import e from "express";
import getToken from "../../components/gettoken";
import axios from "axios";
import { log } from "node:console";
const db = require("../../components/db");

// Fungsi pembantu: melakukan pemanggilan axios dengan retry tanpa batas (hingga berhasil)
async function fetchWithRetry(config) {
  let delayMs = 500; // delay awal (500 ms)
  let attempt = 0;
  while (true) {
    try {
      return await axios(config);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 429 ||
          error.response.data?.code === "SERVICE_BUSY")
      ) {
        const retryAfterHeader = error.response.headers["retry-after"];
        const waitTime = retryAfterHeader
          ? parseInt(retryAfterHeader) * 1000
          : delayMs;
        console.log(
          `Rate limited or service busy. Waiting for ${waitTime} ms before retrying. Attempt: ${attempt}`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        attempt++;
        delayMs = Math.min(delayMs * 2, 10000);
      } else {
        throw error;
      }
    }
  }
}


// Fungsi pembantu untuk memanggil endpoint list dengan retry
async function fetchPage(requestData, token, http_method, request_host, request_uri) {
  const config = {
    method: http_method,
    url: request_host + request_uri,
    data: requestData,
    headers: {
      "Content-Type": "application/json",
      "X-Advai-Country": "ID",
      Authorization: token,
    },
  };
  return await fetchWithRetry(config);
}

export default async function handler(req, res) {
  const request_host = "https://api.ginee.com";
  const request_uri = req.body.request_uri;
  const http_method = req.method;
  const params = req.body.params;
  const access_key = "24149de32ca192a5";
  const secret_key = "d06535d93ed71299";
  console.log("params:", params);

  try {
    // Ambil token untuk endpoint utama dan batch-get secara paralel
    const [token, token2] = await Promise.all([
      getToken(http_method, request_uri, access_key, secret_key),
      getToken(http_method, "/openapi/v3/oms/order/item/batch-get", access_key, secret_key),
    ]);

    // Pastikan shopIdList dalam format array (atau null jika "all")
    const shopIdList =
      params.shopIdList === "all"
        ? null
        : Array.isArray(params.shopIdList)
          ? params.shopIdList
          : [params.shopIdList];

    // Penyesuaian tanggal (+1 hari)
    const createSinceDate = new Date(params.createSince);
    createSinceDate.setDate(createSinceDate.getDate() + 1);
    params.createSince = createSinceDate.toISOString();

    const createToDate = new Date(params.createTo);
    createToDate.setDate(createToDate.getDate() + 1);
    params.createTo = createToDate.toISOString();

    let allOrders = [];
    let nextCursor = undefined;
    const batchSize = 100;

    // Loop pagination untuk mengambil list order (bersifat sequential karena nextCursor tergantung halaman sebelumnya)
    do {
      const requestData = {
        createSince: params.createSince,
        createTo: params.createTo,
        // orderStatus: "SHIPPING", // misalnya "READY_TO_SHIP" atau "PAID" sesuai kebutuhan
        orderStatus: params.status, // misalnya "READY_TO_SHIP" atau "PAID" sesuai kebutuhan
        shopIdList: shopIdList,
        size: batchSize,
      };
      if (nextCursor) {
        requestData.nextCursor = nextCursor;
      }
      const response = await fetchPage(requestData, token, http_method, request_host, request_uri);
      const { content, nextCursor: newCursor } = response.data.data;
      console.log(`Retrieved ${content.length} items; nextCursor: ${newCursor}`);
      allOrders.push(...content);
      nextCursor = content.length < batchSize ? null : newCursor;
    } while (nextCursor);

    // Filter data order berdasarkan tab yang dipilih
    let allOrdersSend = [];
    allOrders.forEach((item) => {
      if (params.tabs === "PENDING") {
        if (item.orderStatus === "PAID" && item.externalOrderStatus === "PENDING") {
          allOrdersSend.push(item);
        }
      } else if (params.tabs === "READY_TO_SHIP") {
        if (
          (item.orderStatus === "PAID" && item.externalOrderStatus !== "PENDING") ||
          (item.orderStatus === "PAID" && item.externalOrderStatus === "220") ||
          item.orderStatus === "READY_TO_SHIP"
        ) {
          allOrdersSend.push(item);
        }
      } else if (params.tabs === "PROCESSED") {
        if (
          item.orderStatus === "READY_TO_SHIP" &&
          (item.externalOrderStatus === "PROCESSED" ||
            item.externalOrderStatus === "READY_TO_SHIP" ||
            item.externalOrderStatus === "AWAITING_SHIPMENT" ||
            item.externalOrderStatus === "AWAITING_COLLECTION" ||
            item.externalOrderStatus === "400" ||
            item.externalOrderStatus === "IN_CANCEL")
        ) {
          allOrdersSend.push(item);
        }
      } else if (params.tabs === "IN_CANCEL") {
        if (item.orderStatus === "READY_TO_SHIP" && item.externalOrderStatus === "IN_CANCEL") {
          allOrdersSend.push(item);
        }
      } else if (params.tabs === "SHIPPING") {
        if (item.orderStatus === "SHIPPING") {
          allOrdersSend.push(item);
        }
      }
    });

    // Ambil detail pesanan dan hitung total secara paralel (batch request)
    const { dataAwal, countsTotals } = await getDetailsOrder(allOrdersSend, token2, params);
    // Parallelkan pengambilan orders untuk calculateCounts (PAID & READY_TO_SHIP) agar lebih cepat
    const counts = await calculateCounts(token, shopIdList, params);

    res.status(200).json({
      data_order: allOrdersSend,
      data_details_order: dataAwal,
      more: false,
      next: null,
      tertunda: counts.tertunda,
      lunas: counts.lunas,
      siap_kirim: counts.siap_kirim,
      sedang_dikirim: counts.sedang_dikirim,
      cancelled: counts.cancelled,
      totalamount: countsTotals.totalamount,
      totalqty: countsTotals.totalqty,
    });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Optimasi: Ambil detail order secara paralel untuk setiap batch
async function getDetailsOrder(data, token2, params) {
  let countsTotals = {
    totalamount: 0,
    totalqty: 0,
  };
  // Ambil orderIds dari data
  const orderIds = data.map((item) => Object.values(item)[0]);
  const midPoint = 100; // Ukuran batch maksimal

  // Buat array promise untuk tiap batch
  const batchPromises = [];
  for (let i = 0; i < orderIds.length; i += midPoint) {
    const batchIds = orderIds.slice(i, i + midPoint);
    const promise = fetchWithRetry({
      method: "POST",
      url: "https://api.ginee.com/openapi/v3/oms/order/item/batch-get",
      headers: {
        "X-Advai-Country": "ID",
        Authorization: token2,
        "Content-Type": "application/json",
      },
      data: { orderIds: batchIds },
    });
    batchPromises.push(promise);
  }
  // Tunggu semua batch selesai
  const responses = await Promise.all(batchPromises);
  let dataAwal = [];
  for (const response of responses) {
    const resultApi = response.data.data;
    const storeDetails = await getStoreDetails(resultApi);
    const filteredData = filterData(resultApi, storeDetails, params);
    dataAwal.push(...filteredData);
    // Hitung total berdasarkan kondisi yang ditentukan
    filteredData.forEach((item) => {
      const { orderStatus, externalOrderStatus, channelId, paymentInfo, items } = item;
      const computedTotalAmount =
        channelId === "SHOPEE_ID"
          ? paymentInfo.totalAmount
          : channelId === "TOKOPEDIA_ID"
            ? parseInt(paymentInfo.subTotal) - parseInt(paymentInfo.subTotal) * 0.12
            : channelId === "TIKTOK_ID"
              ? parseInt(paymentInfo.subTotal) - parseInt(paymentInfo.subTotal) * 0.13
              : 0;
      switch (params.tabs) {
        case "PENDING":
          if (orderStatus === "PAID" && externalOrderStatus === "PENDING") {
            countsTotals.totalamount += computedTotalAmount;
            if (Array.isArray(items)) {
              countsTotals.totalqty += items.reduce((sum, item) => {
                const qty = Number(item.quantity);
                return sum + (isNaN(qty) ? 0 : qty);
              }, 0);
            }
          }
          break;
        case "READY_TO_SHIP":
          if (orderStatus === "PAID" && externalOrderStatus !== "PENDING") {
            countsTotals.totalamount += computedTotalAmount;
            if (Array.isArray(items)) {
              countsTotals.totalqty += items.reduce((sum, item) => {
                const qty = Number(item.quantity);
                return sum + (isNaN(qty) ? 0 : qty);
              }, 0);
            }
          }
          break;
        case "PROCESSED":
          if (
            orderStatus === "READY_TO_SHIP" &&
            ["PROCESSED", "READY_TO_SHIP", "AWAITING_SHIPMENT", "AWAITING_COLLECTION", "400", "IN_CANCEL"].includes(
              externalOrderStatus
            )
          ) {
            countsTotals.totalamount += computedTotalAmount;
            if (Array.isArray(items)) {
              countsTotals.totalqty += items.reduce((sum, item) => {
                const qty = Number(item.quantity);
                return sum + (isNaN(qty) ? 0 : qty);
              }, 0);
            }
          }
          break;
        case "IN_CANCEL":
          if (orderStatus === "READY_TO_SHIP" && externalOrderStatus === "IN_CANCEL") {
            countsTotals.totalamount += computedTotalAmount;
            if (Array.isArray(items)) {
              countsTotals.totalqty += items.reduce((sum, item) => {
                const qty = Number(item.quantity);
                return sum + (isNaN(qty) ? 0 : qty);
              }, 0);
            }
          }
          break;
        case "SHIPPING":
          if (orderStatus === "SHIPPING") {
            countsTotals.totalamount += computedTotalAmount;
            if (Array.isArray(items)) {
              countsTotals.totalqty += items.reduce((sum, item) => {
                const qty = Number(item.quantity);
                return sum + (isNaN(qty) ? 0 : qty);
              }, 0);
            }
          }
          break;
        default:
          break;
      }
    });
  }
  console.log("countsTotals:", countsTotals);
  return { dataAwal, countsTotals };
}

async function calculateCounts(token, shopIdList, params, retries = 5) {
  let counts = {
    lunas: 0,
    tertunda: 0,
    siap_kirim: 0,
    sedang_dikirim: 0,
    cancelled: 0,
    totalamount: 0,
    totalqty: 0,
  };

  const batchSize = 100;
  const maxPages = 10;

  async function fetchOrders(orderStatusFilter) {
    let orders = [];
    let nextCursor = null;
    let pageCount = 0;
    let attempt = 0;
    let delayMs = 200;
    while (pageCount < maxPages) {
      const requestData = {
        createSince: params.createSince,
        createTo: params.createTo,
        shopIdList: shopIdList,
        orderStatus: orderStatusFilter,
        size: batchSize,
      };
      if (nextCursor) {
        requestData.nextCursor = nextCursor;
      }
      try {
        const response = await fetchWithRetry({
          method: "POST",
          url: "https://api.ginee.com/openapi/v3/oms/order/list",
          data: requestData,
          headers: {
            "Content-Type": "application/json",
            "X-Advai-Country": "ID",
            Authorization: token,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        const { content, nextCursor: newCursor } = response.data.data;
        orders.push(...content);
        nextCursor = newCursor;
        pageCount++;
        if (!nextCursor || content.length < batchSize) {
          break;
        }
      } catch (error) {
        if (attempt < retries) {
          console.log(
            `Error fetching orders for ${orderStatusFilter}. Retrying after ${delayMs} ms. Attempt: ${attempt}`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          attempt++;
          delayMs *= 2;
          continue;
        } else {
          throw error;
        }
      }
    }
    return orders;
  }

  try {
    // Fetch orders "PAID" dan "READY_TO_SHIP" secara paralel
    const [ordersPaid, ordersReady] = await Promise.all([
      fetchOrders("PAID"),
      fetchOrders("READY_TO_SHIP"),
    ]);
    const allOrders = [...ordersPaid, ...ordersReady];
    console.log("Total allOrders in calculateCounts:", allOrders.length);

    // Dapatkan storeDetails dari semua order
    const storeDetails = await getStoreDetails(allOrders);
    // Filter orders sesuai dengan kriteria pada filterData
    const filteredOrders = filterData(allOrders, storeDetails, params);
    console.log("Total filteredOrders in calculateCounts:", filteredOrders.length);

    // Proses penghitungan berdasarkan data yang telah di-filter
    filteredOrders.forEach((item) => {
      if (!item.Store_id_area) return;
      const { orderStatus, externalOrderStatus, totalAmount, totalQuantity } = item;
      counts.totalamount += totalAmount;
      counts.totalqty += totalQuantity;
      if (orderStatus === "PAID") {
        if (externalOrderStatus === "PENDING") {
          counts.tertunda++;
        } else {
          counts.lunas++;
        }
      } else if (orderStatus === "READY_TO_SHIP") {
        // Periksa dulu jika order dibatalkan
        if (
          [
            "READY_TO_SHIP",
            "PROCESSED",
            "AWAITING_SHIPMENT",
            "AWAITING_COLLECTION",
            "400",
            "220",
            "IN_CANCEL"
          ].includes(externalOrderStatus)
        ) {
          counts.siap_kirim++;
        }
        if (
          [
            "IN_CANCEL"
          ].includes(externalOrderStatus)
        ) {
          counts.cancelled++;
        }
      }
    });
    console.log("Counts in calculateCounts:", counts);
    return counts;
  } catch (error) {
    console.error("Error in calculateCounts:", error);
    return counts;
  }
}

async function getStoreDetails(resultApi) {
  const connection = await db.getConnection();
  try {
    const shopIds = [...new Set(resultApi.map((res) => res.shopId))];
    if (shopIds.length === 0) return {};
    const [resultTBstore] = await connection.query(
      `SELECT ip, shopid, id_area, id_ware, id_store FROM tb_store WHERE shopid IN (${shopIds.map(() => "?").join(",")})`,
      shopIds
    );
    const storeDetails = {};
    resultTBstore.forEach((store) => {
      storeDetails[store.shopid] = store;
    });
    return storeDetails;
  } finally {
    connection.release();
  }
}

function checkUserFilter(params, items) {
  if (!items.Store_id_area) return false;
  if (!items.Store_shopId) return false;
  if (!items.Store_id_ware) return false;
  if (!items.Store_id_store) return false;
  switch (params.filteruser) {
    case "SUPER-ADMIN":
      return params.brand === "all" ? true : params.brand === items.Store_id_area;
    case "HEAD-AREA":
      return params.area === items.Store_id_area;
    case "HEAD-WAREHOUSE":
      return params.area === items.Store_id_ware;
    case "HEAD-STORE":
      return params.area === items.Store_id_store;
    case "CASHIER":
      return params.area === items.Store_id_store;
    default:
      return params.area === items.Store_id_area;
  }
}

function checkQueryFilter(params, items, resultApi) {
  const orderId = items.externalOrderId || "";
  const labelStatus = items.printInfo?.labelPrintStatus || "";

  let matchesItems = false;

  // Temukan order yang sesuai di dalam resultApi
  const foundOrder = resultApi.find(order => order.externalOrderId === orderId);

  if (foundOrder && foundOrder.items && foundOrder.items.length > 0) {
    matchesItems = foundOrder.items.some(product => {
      const combinedName = `${product.productName || ''} ${product.variationName || ''}`.toLowerCase();
      return (
        (product.productName && product.productName.toLowerCase().includes(params.query.toLowerCase())) ||
        (product.variationName && product.variationName.toLowerCase().includes(params.query.toLowerCase())) ||
        combinedName.includes(params.query.toLowerCase())
      );
    });
  }

  const matchesOrderId = params.query === "all" || orderId.includes(params.query);
  const labelStatusMatch = params.StatusCetak === "all" || params.StatusCetak === labelStatus;

  return (params.query === "all" || matchesOrderId || matchesItems) && labelStatusMatch;
}
function filterData(resultApi, storeDetails, params) {
  return resultApi.filter((items) => {
    const { channelId, externalOrderStatus, orderStatus, shopId } = items;
    const storeDetail = storeDetails[shopId] || { ip: null, shopid: null, id_area: null, id_ware: null, id_store: null };
    items.Store_ip = storeDetail.ip;
    items.Store_shopId = storeDetail.shopid;
    items.Store_id_area = storeDetail.id_area;
    items.Store_id_ware = storeDetail.id_ware;
    items.Store_id_store = storeDetail.id_store;

    if (params.shopIdList !== "all" && !params.shopIdList.includes(shopId)) {
      return false;
    }

    return checkUserFilter(params, items) && checkQueryFilter(params, items, resultApi);
  });
}