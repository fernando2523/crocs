import getToken from "../../components/gettoken";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import pLimit from "p-limit";

// Fungsi delay dengan exponential backoff
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk membagi array menjadi batch
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

// Fungsi untuk menggabungkan PDF dari buffer secara batch
async function mergePdfBatch(pdfBuffers, batchIndex) {
    console.log(`Mulai merge batch ${batchIndex + 1} dengan ${pdfBuffers.length} file PDF`);
    const mergedDoc = await PDFDocument.create();
    for (let i = 0; i < pdfBuffers.length; i++) {
        try {
            const pdf = await PDFDocument.load(pdfBuffers[i]);
            console.log(`Batch ${batchIndex + 1}: PDF ${i + 1} dimuat, halaman: ${pdf.getPageCount()}`);
            const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page, idx) => {
                mergedDoc.addPage(page);
                console.log(`Batch ${batchIndex + 1}: Menambahkan halaman ${idx + 1} dari PDF ${i + 1}`);
            });
        } catch (error) {
            console.error(`Batch ${batchIndex + 1}: Gagal memproses PDF ${i + 1}: ${error.message}`);
        }
    }
    console.log(`Selesai merge batch ${batchIndex + 1}`);
    return mergedDoc.save();
}

export default async function handler(req, res) {
    const request_host = 'https://api.ginee.com';
    const request_uri = req.body.request_uri;
    const http_method = req.method;
    const params = req.body.params;
    const access_key = '24149de32ca192a5';
    const secret_key = 'd06535d93ed71299';
    const concurrencyLimit = 5;
    const maxRetries = 3;
    const axiosTimeout = 30000;
    console.log("Received parameters:", params);

    try {
        const token = await getToken(http_method, request_uri, access_key, secret_key);
        console.log("Token retrieved successfully");

        const limit = pLimit(concurrencyLimit);

        const fetchPdfUrlWithRetry = async (order, attempt = 1) => {
            console.log(`Fetching PDF URL untuk orderId ${order.orderId}, attempt ${attempt}`);
            try {
                const response = await axios({
                    method: http_method,
                    url: request_host + request_uri,
                    data: {
                        orderId: order.orderId,
                        documentType: "SHIPPING_LABEL"
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Advai-Country': 'ID',
                        'Authorization': token
                    },
                    timeout: axiosTimeout
                });
                console.log(`Berhasil fetch PDF URL untuk orderId ${order.orderId}`);
                return response.data.data.pdfUrl;
            } catch (error) {
                console.warn(`Retry ${attempt} untuk orderId ${order.orderId} gagal: ${error.message}`);
                if (attempt < maxRetries) {
                    const backoffDelay = 1000 * Math.pow(2, attempt);
                    await delay(backoffDelay);
                    return fetchPdfUrlWithRetry(order, attempt + 1);
                } else {
                    console.error(`Max retries tercapai untuk orderId ${order.orderId}`);
                    return null;
                }
            }
        };

        // Ambil semua URL PDF
        const pdfUrlResults = await Promise.all(
            params.orderId.map(order => limit(() => fetchPdfUrlWithRetry(order)))
        );
        const successfulUrls = pdfUrlResults.filter(url => url !== null);
        if (successfulUrls.length !== params.orderId.length) {
            console.error(`Gagal mendapatkan PDF untuk ${params.orderId.length - successfulUrls.length} order.`);
            return res.status(500).json({
                error: `Gagal mendapatkan PDF untuk ${params.orderId.length - successfulUrls.length} order.`
            });
        }
        console.log("Semua PDF URLs berhasil didapatkan");

        // Download semua PDF secara paralel dan simpan buffer-nya
        const pdfBuffers = await Promise.all(
            successfulUrls.map((url, index) =>
                limit(async () => {
                    console.log(`Mulai download PDF ${index + 1} dari ${url}`);
                    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: axiosTimeout });
                    console.log(`Selesai download PDF ${index + 1}`);
                    return response.data;
                })
            )
        );

        console.log(`Semua PDF berhasil di-download, total file: ${pdfBuffers.length}`);

        // Bagi PDF buffers menjadi batch, misalnya 20 file per batch
        const batchSize = 20;
        const pdfBatches = chunkArray(pdfBuffers, batchSize);
        console.log(`Total batch: ${pdfBatches.length}`);

        // Merge setiap batch secara paralel
        const mergedBatchBuffers = await Promise.all(
            pdfBatches.map((batch, index) => mergePdfBatch(batch, index))
        );

        console.log("Semua batch PDF berhasil di-merge");

        // Gabungkan hasil batch menjadi satu dokumen akhir
        console.log("Mulai menggabungkan hasil batch");
        const finalMergedDoc = await PDFDocument.create();
        for (let i = 0; i < mergedBatchBuffers.length; i++) {
            const pdf = await PDFDocument.load(mergedBatchBuffers[i]);
            const copiedPages = await finalMergedDoc.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page, idx) => {
                finalMergedDoc.addPage(page);
                console.log(`Menggabungkan batch ${i + 1}: Menambahkan halaman ${idx + 1}`);
            });
        }
        console.log("Selesai menggabungkan semua batch");

        const finalPdfBuffer = await finalMergedDoc.save();
        const filePath = path.join(process.cwd(), 'public', 'merged.pdf');
        await fs.writeFile(filePath, finalPdfBuffer);
        // console.log(`Merged PDF disimpan di ${filePath}`);

        res.status(200).json({ mergedPdfUrl: `${req.headers.origin}/merged.pdf` });
    } catch (error) {
        console.error("Error processing PDFs:", error.message);
        res.status(500).json({ error: "Failed to process PDFs" });
    }
}