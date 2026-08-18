import getToken from "../../components/gettoken";
import axios from "axios";

// Diagnostic endpoint: bandingkan totalAmount dari v1 vs v3 Ginee API
// Akses: POST /api/debug_shopee_amount  body: { orderId: "SO..." }
// Atau:  GET  /api/debug_shopee_amount?orderId=SO...

const REQUEST_HOST = "https://api.ginee.com";
const ACCESS_KEY = "24149de32ca192a5";
const SECRET_KEY = "d06535d93ed71299";

export default async function handler(req, res) {
  try {
    const orderId = req.body?.orderId || req.query?.orderId;
    if (!orderId) {
      return res.status(400).json({ error: "orderId required" });
    }

    const orderIds = Array.isArray(orderId) ? orderId : [orderId];

    // Generate tokens for both endpoints
    const tokenV3 = getToken("POST", "/openapi/v3/oms/order/item/batch-get", ACCESS_KEY, SECRET_KEY);
    const tokenV1 = getToken("POST", "/openapi/order/v1/batch-get", ACCESS_KEY, SECRET_KEY);

    // Call BOTH endpoints in parallel
    const [respV3, respV1] = await Promise.allSettled([
      axios({
        method: "POST",
        url: `${REQUEST_HOST}/openapi/v3/oms/order/item/batch-get`,
        headers: { "Content-Type": "application/json", "X-Advai-Country": "ID", Authorization: tokenV3 },
        data: { orderIds },
      }),
      axios({
        method: "POST",
        url: `${REQUEST_HOST}/openapi/order/v1/batch-get`,
        headers: { "Content-Type": "application/json", "X-Advai-Country": "ID", Authorization: tokenV1 },
        data: { orderIds },
      }),
    ]);

    const v3Data = respV3.status === "fulfilled" ? (respV3.value.data?.data || []) : [];
    const v1Data = respV1.status === "fulfilled" ? (respV1.value.data?.data || []) : [];
    const v3Error = respV3.status === "rejected" ? respV3.reason?.response?.data || respV3.reason?.message : null;
    const v1Error = respV1.status === "rejected" ? respV1.reason?.response?.data || respV1.reason?.message : null;

    // Build comparison for each order
    const comparison = orderIds.map((oid) => {
      const v3 = v3Data.find((o) => o.orderId === oid) || {};
      const v1 = v1Data.find((o) => o.orderId === oid) || {};

      return {
        orderId: oid,
        channelId: v3.channelId || v1.channel,
        externalOrderId: v3.externalOrderId || v1.externalOrderId,
        v3_totalAmount: v3.totalAmount,
        v1_totalAmount: v1.totalAmount,
        v3_paymentInfo: v3.paymentInfo || null,
        v1_paymentInfo: v1.paymentInfo || null,
        // Quick calculation attempts for Shopee
        _calc: (() => {
          const p = v3.paymentInfo || v1.paymentInfo || {};
          const sub = Number(p.subTotal) || 0;
          const comm = Number(p.commissionFee) || 0;
          const svc = Number(p.serviceFee) || 0;
          const ccTx = Number(p.creditCardTransactionFee) || 0;
          const ccSvc = Number(p.creditCardServiceFee) || 0;
          const ccPromo = Number(p.creditCardPromotion) || 0;
          const discProd = Number(p.totalDiscountProduct) || 0;
          const discShip = Number(p.totalDiscountShipping) || 0;
          const shipFee = Number(p.totalShippingFee) || 0;
          const shipSys = Number(p.shippingFeePaidBySystem) || 0;
          const vouPlat = Number(p.voucherPlatform) || 0;
          const vouSell = Number(p.voucherSeller) || 0;
          const rebate = Number(p.sellerRebate) || 0;
          const tax = Number(p.totalTaxation) || 0;
          const buyer = Number(p.buyerPaymentAmount) || 0;
          const cod = Number(p.codTotalAmount) || 0;
          const coin = Number(p.coin) || 0;
          const cashback = Number(p.cashback) || 0;
          const insurance = Number(p.insuranceFee) || 0;
          const refund = Number(p.sellerReturnRefundAmount) || 0;

          return {
            // Formula 1: subTotal - fees
            "sub-comm-svc-ccTx": Math.round(sub - comm - svc - ccTx),
            // Formula 2: subTotal - fees - discountProduct
            "sub-comm-svc-ccTx-discProd": Math.round(sub - comm - svc - ccTx - discProd),
            // Formula 3: buyer - shipping - fees
            "buyer-shipFee-comm-svc-ccTx": Math.round(buyer - shipFee - comm - svc - ccTx),
            // Formula 4: buyer - comm - svc - ccTx
            "buyer-comm-svc-ccTx": Math.round(buyer - comm - svc - ccTx),
            // Formula 5: sub - discProd - comm - svc - ccTx + shipSys
            "sub-discProd-comm-svc-ccTx+shipSys": Math.round(sub - discProd - comm - svc - ccTx + shipSys),
            // Formula 6: buyer - (shipFee - shipSys) - comm - svc - ccTx
            "buyer-(ship-shipSys)-comm-svc-ccTx": Math.round(buyer - (shipFee - shipSys) - comm - svc - ccTx),
          };
        })(),
      };
    });

    return res.status(200).json({
      comparison,
      v3Error,
      v1Error,
      _note: "Bandingkan v3_totalAmount vs v1_totalAmount vs real Shopee. Cek _calc formulas.",
    });
  } catch (error) {
    console.error("debug_shopee_amount error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
}
