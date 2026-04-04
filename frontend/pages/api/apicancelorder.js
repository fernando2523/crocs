import getToken from "../../components/gettoken";
import axios from "axios";

export default async function handler(req, res) {
    // Pastikan hanya method POST yang diterima
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Konfigurasi host dan parameter API
    const request_host = "https://api.ginee.com";
    const request_uri = req.body.request_uri; // seharusnya "/openapi/v3/oms/order/cancel"
    const params = req.body.params;
    const access_key = "24149de32ca192a5";
    const secret_key = "d06535d93ed71299";

    console.log("Received params:", params);

    try {
        // Mengambil token untuk otorisasi
        const token = await getToken(req.method, request_uri, access_key, secret_key);

        // Membangun payload sesuai dengan dokumentasi:
        // orderId: ID pesanan dari Ginee.
        // orderItemIds: Array berisi ID tiap item pesanan yang akan dibatalkan.
        // cancelId: Alasan pembatalan (misalnya: OUT_OF_STOCK, CUSTOMER_PROBLEM, dll).
        // cancelNote: Catatan pembatalan (opsional).
        const payload = {
            orderId: params.orderId,
            orderItemIds: params.orderItemIds,
            cancelId: params.cancelId,
            cancelNote: params.cancelNote,
        };

        // Mengirim request ke API Ginee
        const response = await axios({
            method: "POST",
            url: request_host + request_uri,
            data: payload,
            headers: {
                "Content-Type": "application/json",
                "X-Advai-Country": "ID",
                Authorization: token,
            },
        });
        console.log(response.data);

        // Mengembalikan hasil response ke client
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error cancelling order:", error);

        // Jika error berasal dari respons axios, kembalikan status dan data error tersebut
        if (error.response && error.response.data) {
            return res.status(error.response.status).json(error.response.data);
        }
        // Error internal server
        return res.status(500).json({ error: "Internal Server Error" });
    }
}