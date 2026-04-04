import getToken from "../../components/gettoken";
import axios from "axios";

// Fungsi delay untuk memberikan jeda waktu
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
    const request_host = "https://api.ginee.com";
    const request_uri = req.body.request_uri;
    const params = req.body.params;
    const access_key = "24149de32ca192a5";
    const secret_key = "d06535d93ed71299";
    const maxRetries = 3; // Maksimum percobaan ulang
    const retryDelay = 2000; // Delay antar percobaan ulang (dalam milidetik)
    console.log("cek params-=", params.orderId);

    if (!params?.orderId || !Array.isArray(params.orderId)) {
        return res.status(400).json({ error: "orderId must be an array of objects" });
    }

    try {
        const token = await getToken("GET", request_uri, access_key, secret_key);
        const results = [];

        // Proses setiap orderId dengan retry logic
        for (const order of params.orderId) {
            const { orderId } = order; // Extract orderId from the object
            let attempt = 0;
            let success = false;

            while (attempt < maxRetries && !success) {
                try {
                    const response = await axios({
                        method: "GET",
                        url: `${request_host}${request_uri}?orderId=${orderId}`,
                        headers: {
                            "Content-Type": "application/json",
                            "X-Advai-Country": "ID",
                            Authorization: token,
                        },
                    });

                    results.push({ orderId, data: response.data });
                    success = true; // Tandai sebagai berhasil
                } catch (error) {
                    const errorCode = error.response?.data?.code;

                    // Jika error adalah SERVICE_BUSY, coba ulang
                    if (errorCode === "SERVICE_BUSY") {
                        console.log(
                            `SERVICE_BUSY for orderId ${orderId}, retrying... (attempt ${attempt + 1})`
                        );
                        attempt++;
                        await delay(retryDelay); // Tambahkan delay sebelum mencoba ulang
                    } else {
                        // Jika error bukan SERVICE_BUSY, simpan error dan hentikan retry
                        results.push({
                            orderId,
                            error: error.response?.data || error.message,
                        });
                        break;
                    }
                }
            }

            // Jika tidak berhasil setelah retry maksimal, simpan error
            if (!success) {
                results.push({
                    orderId,
                    error: {
                        code: "SERVICE_BUSY",
                        message: "Maximum retry attempts reached",
                    },
                });
            }
        }

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: error.message });
    }
}