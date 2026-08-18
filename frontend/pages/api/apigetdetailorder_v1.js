import getToken from "../../components/gettoken";
import axios from "axios";

// Endpoint v1: /openapi/order/v1/batch-get (GetOrderDetails - endpoint resmi Ginee)
// Berbeda dari v3 OMS (/openapi/v3/oms/order/item/batch-get)
// V1 mungkin return totalAmount yang lebih akurat untuk Shopee

const REQUEST_HOST = "https://api.ginee.com";
const ACCESS_KEY = "24149de32ca192a5";
const SECRET_KEY = "d06535d93ed71299";

export default async function handler(req, res) {
  try {
    const params = req.body?.params || {};
    let orderIds = params.orderId ?? params.orderIds ?? [];
    if (!Array.isArray(orderIds)) orderIds = [orderIds];
    orderIds = orderIds
      .map((o) => (o && typeof o === "object" ? (o.orderId ?? Object.values(o)[0]) : o))
      .filter(Boolean);

    if (orderIds.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const token = getToken("POST", "/openapi/order/v1/batch-get", ACCESS_KEY, SECRET_KEY);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const batchSize = 100;
    let combinedDetail = [];

    for (let i = 0; i < orderIds.length; i += batchSize) {
      const batch = orderIds.slice(i, i + batchSize);
      const response = await axios({
        method: "POST",
        url: `${REQUEST_HOST}/openapi/order/v1/batch-get`,
        headers: {
          "X-Advai-Country": "ID",
          Authorization: token,
          "Content-Type": "application/json",
        },
        data: { orderIds: batch },
      });
      combinedDetail = combinedDetail.concat(response.data?.data || []);
      if (i + batchSize < orderIds.length) await delay(500);
    }

    return res.status(200).json({ data: combinedDetail });
  } catch (error) {
    console.error("apigetdetailorder_v1 error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
}
