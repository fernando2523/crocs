import getToken from "../../components/gettoken";
import axios from "axios";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fungsi untuk memproses batch orderId dalam jumlah tertentu
async function processBatch(orderIds, request_host, request_uri, http_method, token) {
    return await Promise.all(
        orderIds.map(async (order) => {
            try {
                const response = await axios({
                    method: http_method,
                    url: `${request_host}${request_uri}`,
                    data: { orderId: order.orderId },
                    headers: {
                        "Content-Type": "application/json",
                        "X-Advai-Country": "ID",
                        Authorization: token,
                    },
                });
                return response.data.data;
            } catch (error) {
                // console.error(`Error processing orderId ${order.orderId}:`, error.message);
                return { error: error.message, orderId: order.orderId };
            }
        })
    );
}

export default async function handler(req, res) {
    const request_host = "https://api.ginee.com";
    const request_uri = req.body.request_uri;
    const http_method = req.method;
    const params = req.body.params || {};
    const access_key = "24149de32ca192a5";
    const secret_key = "d06535d93ed71299";

    try {
        if (!Array.isArray(params.orderId) || params.orderId.length === 0) {
            return res.status(400).json({ error: "Invalid or empty orderId array." });
        }

        // Batasi jumlah orderId per batch (misal: 10 per batch)
        const batchSize = 20;
        const token = await getToken(http_method, request_uri, access_key, secret_key);
        const responses = [];

        // Memproses dalam batch
        for (let i = 0; i < params.orderId.length; i += batchSize) {
            const batch = params.orderId.slice(i, i + batchSize);
            const batchResults = await processBatch(batch, request_host, request_uri, http_method, token);
            responses.push(...batchResults);
            await delay(500); // Delay antar batch untuk menghindari rate limit (atur sesuai limit API)
        }

        res.status(200).json(responses);
    } catch (error) {
        // console.error("Error during processing:", error.message);
        res.status(500).json({ error: error.message });
    }
}