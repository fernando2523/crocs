import getToken from "../../components/gettoken";
import axios from "axios";

export default async function handler(req, res) {
    const request_host = "https://api.ginee.com";
    const request_uri = req.body.request_uri || "/openapi/v3/oms/order/item/batch-get";
    const http_method = req.method;
    const params = req.body.params || {};
    const access_key = "24149de32ca192a5";
    const secret_key = "d06535d93ed71299";

    try {
        const token = await getToken(http_method, "/openapi/v3/oms/order/item/batch-get", access_key, secret_key);

        // Normalisasi orderId → array of string orderId
        let orderIds = params.orderId ?? params.orderIds ?? [];
        if (!Array.isArray(orderIds)) orderIds = [orderIds];
        // Dukung bentuk [{orderId: "..."}] maupun ["..."]
        orderIds = orderIds
            .map((o) => (o && typeof o === "object" ? (o.orderId ?? Object.values(o)[0]) : o))
            .filter(Boolean);

        if (orderIds.length === 0) {
            return res.status(200).json({ data: [] });
        }

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const midPoint = 100;
        let combinedDetail = [];

        for (let i = 0; i < orderIds.length; i += midPoint) {
            const dataids = orderIds.slice(i, i + midPoint);
            const response = await axios({
                method: "POST",
                url: request_host + "/openapi/v3/oms/order/item/batch-get",
                headers: {
                    "X-Advai-Country": "ID",
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                data: { orderIds: dataids },
            });
            combinedDetail = combinedDetail.concat(response.data?.data || []);
            if (i + midPoint < orderIds.length) await delay(500);
        }

        return res.status(200).json({ data: combinedDetail });
    } catch (error) {
        console.error("apigetdetailorder error:", error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data || error.message });
    }
}
