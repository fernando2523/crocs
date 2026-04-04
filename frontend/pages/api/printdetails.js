import getToken from "../../components/gettoken";
import axios from "axios";

export default async function handler(req, res) {
    const request_host = "https://api.ginee.com";
    const request_uri = req.body.request_uri;
    const params = req.body.params;
    const access_key = "24149de32ca192a5";
    const secret_key = "d06535d93ed71299";

    if (!params?.orderId || !Array.isArray(params.orderId)) {
        return res.status(400).json({ error: "orderId must be an array" });
    }

    try {
        const token = await getToken("GET", request_uri, access_key, secret_key);
        const results = [];

        // Use Promise.all for concurrent API calls
        await Promise.all(
            params.orderId.map(async (orderId) => {
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
                } catch (error) {
                    results.push({
                        orderId,
                        error: error.response?.data || error.message,
                    });
                }
            })
        );

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: error.message });
    }
}