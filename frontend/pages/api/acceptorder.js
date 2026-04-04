import getToken from "../../components/gettoken";
import axios from "axios";

// Fungsi untuk menunda eksekusi
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
    try {
        const request_host = "https://api.ginee.com";
        const request_uri = req.body.request_uri;
        const http_method = req.method;
        const params = req.body.params;
        const access_key = "24149de32ca192a5";
        const secret_key = "d06535d93ed71299";

        // Generate token
        const token = await getToken(http_method, request_uri, access_key, secret_key);

        // Process each orderId with a delay
        const results = [];
        for (const order of params.orderId) {
            const response = await axios({
                method: http_method,
                url: request_host + request_uri,
                data: {
                    orderId: order.orderId, // Use individual orderId
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-Advai-Country": "ID",
                    Authorization: token,
                },
            });

            // Inject orderId into the response data
            const responseData = {
                ...response.data,
                orderId: order.orderId,
            };

            // Push the modified response data to results
            results.push(responseData);

            // Jeda selama 1 detik (1000 ms) sebelum melanjutkan ke order berikutnya
            await delay(500);
        }

        // Return the processed results to the frontend
        res.status(200).json(results);
    } catch (error) {
        console.error("Error processing orders:", error);
        res.status(500).json({
            message: "Failed to process orders",
            error: error.response ? error.response.data : error.message,
        });
    }
}