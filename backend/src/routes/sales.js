const express = require("express");
const router = express.Router();
const controller = require("../controller/sales");
const upload = require("../middleware/uploadImage");

// SALES
router.post("/products_sales", controller.productsSales);
router.post("/salesproductbarcode", controller.salesProductbarcode);
router.post("/inputsales", controller.inputSales);

//ORDER
router.post("/order", controller.order);
router.post("/ordercount", controller.orderCount);
router.post("/getheaderpesanan", controller.getHeaderpesanan);
router.post("/refund", controller.refund);
router.post("/getsizeretur", controller.getSizeretur);
router.post("/retur", controller.retur);
router.post("/returluar", controller.returLuar);
router.post("/deletepesanan", controller.deletePesanan);
router.post("/updatepesanan", controller.updatePesanan);
router.post("/gudangretur", controller.gudangretur);
router.post("/cekbarcode", controller.cekbarcode);
router.post("/syncorder", controller.syncorder);
router.post("/syncordermassal", controller.syncordermassal);
router.post("/deletepesanansync", controller.deletepesanansync);
router.post("/insertgagalinput", controller.insertgagalinput);
router.post("/deletependinginput", controller.deletependinginput);
router.post("/history_massal", controller.history_massal);
router.get("/get_history_massal", controller.get_history_massal);
router.delete("/deletependingdata", controller.deletependingdata);

// Picking List
router.post("/getpickinglist",      controller.getPickingList);
router.post("/insertpickinglist",   controller.insertPickingList);
router.post("/getpickinglistdata",  controller.getPickingListData);
router.post("/updatepickinglist",   controller.updatePickingList);
router.post("/updatestatuspacking", controller.updateStatusPacking);

module.exports = router;