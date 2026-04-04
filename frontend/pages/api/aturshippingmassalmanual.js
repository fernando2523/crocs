import getToken from "../../components/gettoken";
import axios from "axios";

export default async function handler(req, res) {
    const requestHost = "https://api.ginee.com";
    const requestUri = req.body.request_uri; // Contoh: "/openapi/v3/oms/order/rts"
    const httpMethod = req.method;
    const params = req.body.params || {};
    const batch = params.batch; // Seluruh data order (misalnya 250 atau 300 order)

    if (!batch || !Array.isArray(batch)) {
        return res.status(400).json({ error: "Batch data is missing or invalid." });
    }

    console.log("Received batch length:", batch.length);

    const accessKey = "24149de32ca192a5";
    const secretKey = "d06535d93ed71299";

    // Fungsi delay untuk menunggu
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Fungsi polling untuk memastikan status shipping sudah complete
    async function pollShippingResult(taskId) {
        const getShippingUri = `/openapi/v3/oms/order/get-shipping-result`;
        const pollInterval = 1000; // polling setiap 1 detik
        const maxRetries = 20;
        let retries = 0;
        while (retries < maxRetries) {
            const tokenForGet = await getToken("POST", getShippingUri, accessKey, secretKey);
            try {
                const shippingRes = await axios({
                    method: "POST",
                    url: `${requestHost}${getShippingUri}`,
                    data: { taskId },
                    headers: {
                        "Content-Type": "application/json",
                        "X-Advai-Country": "ID",
                        Authorization: tokenForGet,
                    },
                });
                const result = shippingRes.data;
                if (result.data && result.data.isComplete) {
                    return result;
                } else {
                    console.log(`Task ${taskId} is still processing, polling...`);
                }
            } catch (error) {
                console.error(`Error polling task ${taskId}:`, error.message);
            }
            await delay(pollInterval);
            retries++;
        }
        throw new Error(`Polling timeout for task ${taskId}`);
    }

    // Fungsi untuk memproses satu batch (maksimal 100 item per request)
    async function processBatch(batchItems, retries = 3, delayTime = 500) {
        // Mapping setiap order menjadi objek shipping item sesuai dokumentasi API
        const shippingItems = batchItems.map(item => {
            let pickupStartTime = 0;
            if (item.pickupTimeId && typeof item.pickupTimeId === "string") {
                const parts = item.pickupTimeId.split('_');
                if (parts.length === 2) {
                    pickupStartTime = parseInt(parts[0], 10);
                } else {
                    console.error(`Invalid pickupTimeId format for order ${item.orderId}: ${item.pickupTimeId}`);
                }
            }
            const pickupEndTime = pickupStartTime + 1800;
            const shippingItem = {
                orderId: item.orderId,
                deliveryType: item.deliveryType,
                shipmentProvider: item.shipmentProvider,
                shippingProviderId: item.shipmentProviderId || "",
                trackingNo: item.trackingNo || "",
                addressId: item.addressId,
            };
            // Jika order dari Shopee dengan delivery type PICK_UP, sertakan object pickUp sesuai kebutuhan
            if (item.channelid === "SHOPEE_ID" && item.deliveryType === "PICK_UP") {
                shippingItem.pickUp = {
                    pickupTimeId: item.pickupTimeId, // kirim nilai lengkap
                    pickupStartTime: pickupStartTime,
                    pickupEndTime: pickupEndTime,
                    fullAddress: item.address,
                    timeText: item.timeText,
                    addressId: item.addressId,
                };
            }
            return shippingItem;
        });

        const payload = { shippingItems };
        console.log("Final Payload:", JSON.stringify(payload, null, 2));

        try {
            const token = await getToken(httpMethod, requestUri, accessKey, secretKey);
            const response = await axios({
                method: httpMethod,
                url: `${requestHost}${requestUri}`,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                    "X-Advai-Country": "ID",
                    Authorization: token,
                },
            });
            console.log(`Batch processed for orders: ${batchItems.map(item => item.orderId).join(", ")}`);
            return {
                status: "success",
                data: response.data, // Diharapkan response berupa { data: { taskId: '...' } }
                orders: batchItems.map(item => item.orderId)
            };
        } catch (error) {
            if (error.response && error.response.status === 429 && retries > 0) {
                console.warn(`Rate limit for orders ${batchItems.map(item => item.orderId).join(", ")}. Retrying in ${delayTime} ms...`);
                await delay(delayTime);
                return processBatch(batchItems, retries - 1, delayTime * 2);
            }
            console.error(`Error processing batch for orders ${batchItems.map(item => item.orderId).join(", ")}:`, error.message);
            return {
                status: "error",
                error: error.message,
                orders: batchItems.map(item => item.orderId)
            };
        }
    }

    try {
        const batchSize = 100;
        const batchResults = [];
        // Bagi data input ke dalam batch dengan ukuran maksimal 100
        for (let i = 0; i < batch.length; i += batchSize) {
            const currentBatch = batch.slice(i, i + batchSize);
            const result = await processBatch(currentBatch);
            batchResults.push(result);
            if (i + batchSize < batch.length) {
                console.log("Waiting 500 ms before processing next batch...");
                await delay(500);
            }
        }

        // Gabungkan orderId dari seluruh batch dan ambil satu taskId dari batch yang sukses
        const aggregatedOrdersId = [];
        let taskId = "";
        for (const result of batchResults) {
            if (result.status === "success" && result.data && result.data.data && result.data.data.taskId) {
                if (!taskId) {
                    taskId = result.data.data.taskId;
                }
                // Lakukan polling untuk memastikan batch tersebut selesai
                try {
                    await pollShippingResult(result.data.data.taskId);
                    aggregatedOrdersId.push(...result.orders);
                } catch (pollError) {
                    console.error(`Polling error for task ${result.data.data.taskId}:`, pollError.message);
                }
            } else {
                console.error("Error processing batch or missing taskId for orders:", result.orders);
            }
        }

        // Siapkan respons akhir dengan struktur sesuai dokumentasi API
        const finalResponse = {
            code: "SUCCESS",
            message: "OK",
            data: {
                taskId: taskId || ""
            },
            ordersId: aggregatedOrdersId,
            extra: null,
            pricingStrategy: "PAY"
        };

        console.log("Final aggregated response", finalResponse);
        return res.status(200).json(finalResponse);
    } catch (error) {
        console.error("Handler error:", error.message);
        return res.status(500).json({ error: "An error occurred during processing." });
    }
}