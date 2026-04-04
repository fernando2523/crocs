import getToken from "../../components/gettoken";
import axios from "axios";

// Fungsi untuk membagi array ke dalam potongan (chunk) dengan ukuran tertentu
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export default async function handler(req, res) {
    const request_host = 'https://api.ginee.com';
    const request_uri = req.body.request_uri;
    const http_method = req.method;
    const params = req.body.params;
    const access_key = '24149de32ca192a5';
    const secret_key = 'd06535d93ed71299';

    // Mendapatkan token otentikasi
    const token = await getToken(http_method, request_uri, access_key, secret_key);
    console.log("params", params);

    let results = [];

    // Mengolah data jika params.datasync tersedia
    if (Array.isArray(params.datasync) && params.datasync.length > 0) {
        // Iterasi untuk setiap data item (setiap shop)
        for (const dataItem of params.datasync) {
            const shopId = dataItem.shopsString;
            const externalOrderIds = dataItem.dataExternalOrderId;
            let batches = [];

            // Jika data lebih dari 100, bagi ke dalam batch dengan maksimal 100 item
            if (Array.isArray(externalOrderIds) && externalOrderIds.length > 100) {
                batches = chunkArray(externalOrderIds, 100);
            } else {
                batches = [externalOrderIds];
            }

            // Proses setiap batch secara sequential untuk menghindari rate limit
            for (const batch of batches) {
                let success = false;
                let responseData = null;
                let attempt = 0;
                let delayTime = 1000; // Delay awal 1 detik

                // Lakukan percobaan ulang hingga berhasil (maksimal 10 kali)
                while (!success && attempt < 10) {
                    try {
                        const response = await axios({
                            method: http_method,
                            url: request_host + request_uri,
                            data: {
                                syncDataType: params.syncDataType,
                                syncAction: params.syncAction,
                                shopId: shopId,
                                externalOrderIds: batch,
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Advai-Country': 'ID',
                                'Authorization': token,
                            },
                        });
                        responseData = response.data;
                        success = true;
                    } catch (error) {
                        attempt++;
                        const status = error.response ? error.response.status : null;
                        console.error(`Error processing batch for shop ${shopId} (attempt ${attempt}):`, status, error.message);

                        // Jika error 429 (rate limit), tingkatkan delay secara eksponensial
                        if (status === 429) {
                            console.log(`Rate limit hit. Menunggu ${delayTime} ms sebelum retry...`);
                            await new Promise(resolve => setTimeout(resolve, delayTime));
                            delayTime *= 2;
                        } else {
                            // Untuk error lain, tunggu delay awal sebelum retry
                            await new Promise(resolve => setTimeout(resolve, delayTime));
                        }
                    }
                }

                // Jika setelah 10 kali percobaan masih gagal, batalkan proses untuk shop tersebut
                if (!success) {
                    return res.status(500).json({ error: `Gagal memproses batch untuk shop ${shopId} setelah beberapa percobaan.` });
                }

                results.push({
                    shopId: shopId,
                    response: responseData,
                });
                // Optional: delay singkat antar batch untuk mengurangi beban server
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    } else {
        return res.status(400).json({ error: "Parameter datasync tidak ditemukan atau kosong." });
    }

    res.status(200).json({
        message: "Semua batch berhasil diproses dengan mekanisme retry",
        results: results,
    });
}