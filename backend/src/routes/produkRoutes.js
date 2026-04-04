const express = require("express");
const router = express.Router();
const controller = require("../controller/produk");
const upload = require("../middleware/uploadImage");

// PRODUCT
router.post("/getproduk", controller.getProduk);
router.post("/getnamaware", controller.getNamaware);
router.post("/addproduk", upload.single("file"), controller.addProduk);
router.post("/editproduk", upload.single("file"), controller.editProduk);
router.post("/deleteproduk", controller.deleteProduk);
router.post("/getsizesales", controller.getSizesales);
router.post("/gethistoriposelected", controller.getHistoriposelected);
router.post("/repeatstok", controller.repeatStok);
router.post("/gethargabeliso", controller.getHargabeliso);
router.post("/gethistorisoselected", controller.getHistorisoselected);
router.post("/stockopname", controller.stockOpname);
router.post("/transferstok", controller.transferStok);
router.post("/print_stockopname", controller.print_Stockopname);
router.get("/gethistoripo", controller.getHistoripo);
router.post("/get_sizepo", controller.get_Sizepo);
router.post("/editpo", controller.editPo);
router.post("/deleteitem", controller.deleteItem);
router.post("/deletepo", controller.deletePo);
router.get("/gethistoriso", controller.getHistoriso);
router.post("/getstore_sales", controller.getStore_sales);
router.post("/getstore_dashboard", controller.getStore_dashboard);
router.post("/getstore_sales_online", controller.getStore_sales_online);
router.post("/getwarehouse_sales", controller.getWarehouse_sales);
router.post("/getwarehouse_sales_online", controller.getWarehouse_sales_online);
router.post("/getarehousebarcode", controller.getWarehousebarcode);


// data po
router.post("/getpo", controller.getPo);
router.post("/getpotransfer", controller.getPotransfer);
router.post("/getuserpo", controller.getuserpo);
router.post("/getusertransfer", controller.getusertransfer);

// data so
router.post("/getso", controller.getSo);

// data barcode
router.post("/getprodukbarcode", controller.getProdukbarcode);
router.post("/getidpo", controller.getIdpo);
router.post("/getsizebarcode", controller.getSizebarcode);

// mutasi stok
router.post("/getmutation", controller.getMutation);
router.post("/settlement_stock", controller.settlementStock);

// asset
router.post("/get_asset", controller.get_Asset);
router.post("/gethistoripoasset", controller.getHistoripoasset);

// retur refund
router.post("/getretur", controller.getRetur);
router.post("/getrefund", controller.getRefund);


// upprice
router.post("/get_upprice", controller.get_upprice);
router.get("/gethistoripo_transfer", controller.getHistoripotransfer);

router.post("/getprodukdisplay", controller.getProdukdisplay);
router.post("/getstoredisplay", controller.getstoredisplay);

router.post("/add_display", controller.addDisplay);
router.post("/delete_display", controller.deleteDisplay);

router.post("/cariwares", controller.cariwares);
router.post("/getwarehousetransfers", controller.getwarehousetransfer);
router.post("/cariwaresretur", controller.cariwaresretur);

router.post("/transferstokdefect", controller.transferStokdefect);
router.post("/getusersales", controller.getusersales);

router.post("/getpodefect", controller.getpodefect);

router.post("/getsizereturmodel", controller.getsizereturmodel);
router.post("/getproduktukarmodel", controller.getproduktukarmodel);
router.post("/tukermodel", controller.tukermodel);
router.post("/getreturmodel", controller.getreturmodel);

router.post("/getdeleteorder", controller.getdeleteorder);

router.post("/update_defect_status", controller.updateDefectStatus);
router.post("/bulk_update_defect_status", controller.bulkUpdateDefectStatus);
router.post("/update_defect_harga", controller.updateDefectHarga);
router.post("/editpo_defect", controller.editPo_defect);
router.post("/deleteitemdefect", controller.deleteItemdefect);

router.post("/get_Sizepodefect", controller.get_Sizepodefect);
router.post("/editstockopname", controller.editstockopname);
router.post("/deleteitemso", controller.deleteitemso);
router.post("/edittransfer", controller.edittransfer);
router.post("/deleteitempo", controller.deleteitempo);
router.get("/getstore_api", controller.getstore_api);
router.post("/cekbeforeorder", controller.cekbeforeorder);
router.post("/cekbeforeordermassal", controller.cekbeforeordermassal);
router.post("/getstore_history", controller.getstore_history);
router.post("/getstore_cashier_online", controller.getstore_cashier_online);
router.get("/getpendingapi", controller.getpendingapi);
router.get("/cek_namaproduk", controller.cek_namaproduk);
router.post("/cekarea_sync", controller.cekarea_sync);

router.post("/get_spk", controller.get_spk);
router.post("/create_column_spk", controller.create_column_spk);
router.post("/create_column_spk", controller.create_column_spk);
router.post("/edit_qty_spk", controller.edit_qty_spk);
router.post("/edit_spk_name", controller.edit_spk_name);
router.post("/delete_spk", controller.delete_spk);
router.post("/delete_spk_temp", controller.delete_spk_temp);
router.post("/edit_qty_spk_utama", controller.edit_qty_spk_utama);
router.post("/x_month", controller.x_month);
router.post("/getwarehouseSPK", controller.getwarehouseSPK);
router.post("/save_dateSelected", controller.save_dateSelected);
router.post("/getSelectedDate", controller.getSelectedDate);
router.get("/getProduction", controller.getProduction);

// payment & reject SPK
router.post("/save_spk_harga",            controller.save_spk_harga);
router.post("/get_spk_payment_summary",   controller.get_spk_payment_summary);
router.post("/add_spk_payment",           controller.add_spk_payment);
router.post("/delete_spk_payment",        controller.delete_spk_payment);
router.post("/add_spk_reject",            controller.add_spk_reject);
router.post("/get_spk_list",              controller.get_spk_list);
router.post("/get_supplier_payment_list",       controller.get_supplier_payment_list);
router.post("/get_supplier_payment_detail",     controller.get_supplier_payment_detail);
router.post("/get_spk_reject_list",             controller.get_spk_reject_list);
router.post("/get_spk_reject_sizes",            controller.get_spk_reject_sizes);
router.post("/update_spk_reject_status",        controller.update_spk_reject_status);
router.post("/bulk_update_spk_reject_status",   controller.bulk_update_spk_reject_status);
router.post("/delete_spk_reject_item",          controller.delete_spk_reject_item);
router.post("/delete_spk_reject_group",         controller.delete_spk_reject_group);
router.post("/update_spk_reject_harga",         controller.update_spk_reject_harga);
router.post("/update_spk_reject_harga_group",   controller.update_spk_reject_harga_group);
router.post("/writeoff_reject",                 controller.writeoff_reject);
router.post("/get_spk_detail_list",       controller.getSpkDetailList);
router.post("/get_size_by_spk_detail",    controller.getSizeBySpkDetail);
router.post("/get_size_restock_by_spk",   controller.getSizeRestockBySpk);


module.exports = router;