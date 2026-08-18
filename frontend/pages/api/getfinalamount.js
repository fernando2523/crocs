import getToken from "../../components/gettoken";
import axios from "axios";

// Ambil totalAmount FINAL dari Ginee untuk rentang tanggal tertentu.
// Dipakai tombol "Sync Amount" di halaman List Order Sales Online.
// Return: { data: { [externalOrderId]: total_amount_net } }

const REQUEST_HOST = "https://api.ginee.com";
const ACCESS_KEY = "24149de32ca192a5";
const SECRET_KEY = "d06535d93ed71299";

async function fetchWithRetry(config, retries = 3, delayMs = 500) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await axios(config);
    } catch (error) {
      const status = error.response?.status;
      const busy = status === 429 || error.response?.data?.code === "SERVICE_BUSY";
      if (busy && attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
}

// Hitung net totalAmount sesuai channel (samakan dengan shipping_base)
function computeNet(o) {
  const p = o.paymentInfo || {};
  if (o.channelId === "SHOPEE_ID") return Number(p.totalAmount) || 0;
  if (o.channelId === "TOKOPEDIA_ID") return parseInt(p.subTotal) - parseInt(p.subTotal) * 0.12;
  if (o.channelId === "TIKTOK_ID") {
    const base = parseInt(p.subTotal + p.voucherPlatform);
    return base - base * 0.175 - base * 0.03;
  }
  return Number(p.totalAmount) || 0;
}

export default async function handler(req, res) {
  try {
    const body = req.body || {};
    // Terima "date" (format shipping: "YYYY-MM-DD" atau "YYYY-MM-DD to YYYY-MM-DD")
    let start, end;
    const dateStr = body.date || "";
    if (dateStr.includes(" to ")) {
      [start, end] = dateStr.split(" to ");
    } else if (dateStr.length >= 10) {
      start = dateStr.slice(0, 10);
      end = dateStr.slice(0, 10);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      start = today;
      end = today;
    }

    // Perlebar window +/- 1 hari untuk aman thd timezone; toh dicocokkan by externalOrderId
    const createSince = new Date(`${start}T00:00:00+07:00`);
    createSince.setDate(createSince.getDate() - 1);
    const createTo = new Date(`${end}T23:59:59+07:00`);
    createTo.setDate(createTo.getDate() + 1);

    const [token, token2] = await Promise.all([
      getToken("POST", "/openapi/v3/oms/order/list", ACCESS_KEY, SECRET_KEY),
      getToken("POST", "/openapi/v3/oms/order/item/batch-get", ACCESS_KEY, SECRET_KEY),
    ]);

    // Status yang relevan untuk order penjualan yang sudah diproses.
    // Sertakan DELIVERED/COMPLETED karena di situ nilai (mis. COD) sudah final.
    const statuses = ["PAID", "READY_TO_SHIP", "SHIPPING", "DELIVERED", "COMPLETED"];
    const batchSize = 100;
    const maxPages = 20;

    const orderIdSet = new Set();
    for (const status of statuses) {
      let nextCursor = null;
      let page = 0;
      while (page < maxPages) {
        const requestData = {
          createSince: createSince.toISOString(),
          createTo: createTo.toISOString(),
          orderStatus: status,
          size: batchSize,
        };
        if (nextCursor) requestData.nextCursor = nextCursor;

        const resp = await fetchWithRetry({
          method: "POST",
          url: `${REQUEST_HOST}/openapi/v3/oms/order/list`,
          data: requestData,
          headers: { "Content-Type": "application/json", "X-Advai-Country": "ID", Authorization: token },
        });
        const content = resp.data?.data?.content || [];
        content.forEach((o) => { if (o.orderId) orderIdSet.add(o.orderId); });
        nextCursor = resp.data?.data?.nextCursor;
        page++;
        if (!nextCursor || content.length < batchSize) break;
      }
    }

    const orderIds = Array.from(orderIdSet);
    const amountByExternalId = {};

    // Ambil detail (paymentInfo) per batch 100
    for (let i = 0; i < orderIds.length; i += 100) {
      const batch = orderIds.slice(i, i + 100);
      const resp = await fetchWithRetry({
        method: "POST",
        url: `${REQUEST_HOST}/openapi/v3/oms/order/item/batch-get`,
        data: { orderIds: batch },
        headers: { "Content-Type": "application/json", "X-Advai-Country": "ID", Authorization: token2 },
      });
      (resp.data?.data || []).forEach((o) => {
        const amt = Math.round(computeNet(o));
        const id_pesanan =
          o.channelId !== "TOKOPEDIA_ID"
            ? o.externalOrderId
            : o.externalOrderSn?.includes("/")
              ? o.externalOrderSn.split("/")[3]
              : o.externalOrderSn;
        if (id_pesanan && amt > 0) amountByExternalId[id_pesanan] = amt;
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    return res.status(200).json({ data: amountByExternalId });
  } catch (error) {
    console.error("getfinalamount error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
}
