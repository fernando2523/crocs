const express = require("express");
const router = express.Router();
const controller = require("../controller/salesretail");
const upload = require("../middleware/uploadImage");

// SALES
router.post("/getstore_salesretail", controller.getStore_salesretail);
router.post("/getkasir", controller.getKasir);
router.get("/getresellersales", controller.getResellersales);
router.post("/products_salesretail", controller.productsSalesretail);
// router.post("/salesproductbarcode", controller.salesProductbarcode);
router.post("/inputsalesretail", controller.inputSalesretail);

//RESELLER PAID
router.post("/orderresellerpaid", controller.orderresellerpaid);
router.post("/ordercountresellerpaid", controller.orderCountresellerpaid);
router.post(
  "/getheaderpesananresellerpaid",
  controller.getHeaderpesananresellerpaid
);

//RESELLER PENDING
router.post("/orderresellerpending", controller.orderresellerpending);
router.post("/ordercountresellerpending", controller.orderCountresellerpending);
router.post(
  "/getheaderpesananresellerpending",
  controller.getHeaderpesananresellerpending
);

//RETAIL
router.post("/orderresellerretail", controller.orderresellerretail);
router.post("/ordercountresellerretail", controller.orderCountresellerretail);
router.post(
  "/getheaderpesananresellerretail",
  controller.getHeaderpesananresellerretail
);

router.post("/gethistorypay", controller.gethistorypay);


module.exports = router;
