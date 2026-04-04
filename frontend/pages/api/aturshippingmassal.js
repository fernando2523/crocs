import getToken from "../../components/gettoken";
import axios from "axios";

export default async function handler(req, res) {
    const request_host = "https://api.ginee.com";
    const request_uri = req.body.request_uri;
    const http_method = req.method;
    const params = req.body.params; // Assuming you send 'params' in the body
    const access_key = "24149de32ca192a5";
    const secret_key = "d06535d93ed71299";
    console.log(params.batch);

    try {
        // Generate token once for all requests
        const token = await getToken(http_method, request_uri, access_key, secret_key);

        // Helper function for delay
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Collect responses
        const responses = [];

        // Loop through each params item with delay
        for (const item of params.batch) {
            try {
                const response = await axios({
                    method: http_method,
                    url: request_host + request_uri,
                    data: {
                        orderShips: [
                            {
                                orderId: item.orderId,
                                shipmentProvider: item.kurir,
                                deliveryType: item.deliveryType,
                                pickupTimeId: item.timepickup,
                                addressId: item.addressId,
                                address: item.address,
                            },
                        ],
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "X-Advai-Country": "ID",
                        Authorization: token,
                    },
                });

                // Add successful response to the array
                responses.push({
                    orderId: item.orderId,
                    status: "success",
                    data: response.data,
                });

                console.log(`Order ${item.orderId} processed successfully.`);
            } catch (error) {
                // Add error response to the array
                responses.push({
                    orderId: item.orderId,
                    status: "error",
                    error: error.message,
                });

                console.error(`Error processing order ${item.orderId}:`, error.message);
            }

            // Add a delay to avoid hitting rate limits
            await delay(1000); // 1-second delay, adjust as needed
        }

        // Send all responses to the frontend
        res.status(200).json({ message: "Processing completed", responses });
    } catch (error) {
        console.error("Error in handler:", error.message);
        res.status(500).json({ error: "An error occurred during processing." });
    }
}