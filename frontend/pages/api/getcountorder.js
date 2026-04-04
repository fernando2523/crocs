import getToken from "../../components/gettoken";
import axios from "axios";
const db = require("../../components/db"); // Koneksi database

export default async function handler(req, res) {
  const request_host = "https://api.ginee.com";
  const { request_uri, params } = req.body;
  const http_method = req.method;
  const access_key = "24149de32ca192a5";
  const secret_key = "d06535d93ed71299";
  const connection = await db.getConnection();

  const token = await getToken(http_method, request_uri, access_key, secret_key);
  // const shopIdList = params.filteruser === 'SUPER-ADMIN' || params.filteruser === 'HEAD-AREA' || params.filteruser === 'HEAD-WAREHOUSE' ? null : [params.shopIdList];

  // Helper function untuk menghitung data
  const calculateCounts = async (data, connection) => {
    let dataResult = [];
    let counts = {
      lunas: 0,
      siap_kirim: 0,
      sedang_dikirim: 0,
      cancelled: 0,
      totalamount: 0,
      totalqty: 0,
    };

    const ResultApi = data;

    // Fungsi untuk mengambil detail toko dari database
    const fetchStoreDetails = async (res) => {
      const [ResultTBstore] = await connection.query(
        `SELECT ip, shopid, id_area FROM tb_store WHERE shopid='${res.shopId}'`
      );

      if (ResultTBstore.length > 0) {
        const resDetail = ResultTBstore[0];
        res.Store_ip = resDetail.ip;
        res.Store_shopId = resDetail.shopid;
        res.Store_id_area = resDetail.id_area;
      }

      return res;
    };

    // Loop melalui ResultApi dan ambil detail toko
    for (const res of ResultApi) {
      const updatedRes = await fetchStoreDetails(res);
      dataResult.push(updatedRes);
    }

    // Hitung jumlah berdasarkan status
    dataResult.forEach((item) => {
      const { orderStatus, externalOrderStatus, totalAmount, totalQuantity, shopId } = item;

      if (params.shopIdList === "all" || params.shopIdList === shopId) {
        // Perhitungan untuk lunas (PAID)
        if (orderStatus === "PAID") {
          counts.lunas++;
        }

        // Perhitungan untuk siap_kirim (READY_TO_SHIP)
        if (
          orderStatus === "READY_TO_SHIP" &&
          (externalOrderStatus === "PROCESSED" ||
            externalOrderStatus === "AWAITING_SHIPMENT" ||
            externalOrderStatus === "AWAITING_COLLECTION" ||
            externalOrderStatus === "400" ||
            externalOrderStatus === "220")
        ) {
          counts.siap_kirim++;
        }

        // Perhitungan untuk sedang_dikirim (SHIPPING)
        if (orderStatus === "SHIPPING") {
          counts.sedang_dikirim++;
        }

        // Perhitungan untuk cancelled (IN_CANCEL)
        if (externalOrderStatus === "IN_CANCEL") {
          counts.cancelled++;
        }

        // Perhitungan untuk total amount dan quantity
        if (
          ["READY_TO_SHIP", "PAID"].includes(orderStatus) ||
          externalOrderStatus === "IN_CANCEL"
        ) {
          counts.totalamount += totalAmount || 0;
          counts.totalqty += totalQuantity || 0;
        }
      }
    });

    return counts;
  };

  // Recursive fetch dengan retry dan backoff exponential
  const fetchOrders = async (nextCursor = null, accumulatedData = [], retries = 0) => {
    try {
      const response = await axios({
        method: http_method,
        url: request_host + request_uri,
        data: {
          createSince: params.createSince,
          createTo: params.createTo,
          size: 50, // Mengurangi ukuran batch untuk menghindari batasan API
          nextCursor,
        },
        headers: {
          "Content-Type": "application/json",
          "X-Advai-Country": "ID",
          Authorization: token,
        },
      });

      const { more, nextCursor: newCursor, content } = response.data.data;
      const combinedData = accumulatedData.concat(content);

      if (more) {
        return fetchOrders(newCursor, combinedData); // Rekursif untuk data berikutnya
      }

      return combinedData;
    } catch (error) {
      if (error.response?.data?.code === "SERVICE_BUSY" && retries < 5) {
        const delay = Math.pow(2, retries) * 1000; // Delay eksponensial
        console.log(`SERVICE_BUSY error, retrying after ${delay} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay)); // Delay sebelum retry
        return fetchOrders(nextCursor, accumulatedData, retries + 1); // Retry
      }
      console.error("Error fetching orders:", error.response?.data || error.message);
      throw error; // Jika gagal setelah retries, lempar error
    }
  };

  try {
    const orders = await fetchOrders();
    const counts = await calculateCounts(orders, connection);

    res.status(200).json({
      lunas: counts.lunas,
      siap_kirim: counts.siap_kirim,
      sedang_dikirim: counts.sedang_dikirim,
      cancelled: counts.cancelled,
      totalamount: counts.totalamount,
      totalqty: counts.totalqty,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error.response?.data || error.message,
    });
  } finally {
    connection.release(); // Pastikan koneksi database dilepas
  }
}