const Models = require("../models/produk");
const sharp = require("sharp");
const path = require("path");
const { customAlphabet } = require("nanoid");
const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
var crypto = require("node:crypto");

const getProduk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getProduk(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getNamaware = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getNamaware(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getWarehousebarcode = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getWarehousebarcode(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const addProduk = async (req, res) => {
    const timeStamp = new Date().getTime();
    const data = req.body;
    // console.log(JSON.stringify(data));
    // console.log(JSON.stringify(req.file));
    try {
        // console.log(req.body.file)
        if (req.body.file === 'null') {

            const retData = await Models.addProduk(data);
            res.json({
                data: data,
            });
            // var hasil = "foto kosong";
        } else {
            await sharp(req.file.buffer)
                // .resize({ width: 800, height: 800 })
                .toFile(
                    `public/images/${timeStamp}${path.extname(req.file.originalname)}`
                );
            const retData = await Models.addProduk(
                data,
                `${timeStamp}${path.extname(req.file.originalname)}`
            );

            res.json({
                message: "Upload Success",
                // data: retData[0],
            });
            // var hasil = "foto ada";

        }
        // console.log(hasil)
    } catch (error) {
        console.log(error);
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const editProduk = async (req, res) => {
    const timeStamp = new Date().getTime();
    const data = req.body;
    // console.log(JSON.stringify(data));
    // console.log(JSON.stringify(req.file));
    try {
        // console.log(req.body.file)
        if (req.body.file === 'null') {

            const retData = await Models.editProduk(data);
            res.json({
                data: data,
            });
            // var hasil = "foto kosong";
        } else {
            await sharp(req.file.buffer)
                // .resize({ width: 800, height: 800 })
                .toFile(
                    `public/images/${timeStamp}${path.extname(req.file.originalname)}`
                );
            const retData = await Models.editProduk(
                data,
                `${timeStamp}${path.extname(req.file.originalname)}`
            );

            res.json({
                message: "Upload Success",
                // data: retData[0],
            });
            // var hasil = "foto ada";

        }
        // console.log(hasil)
    } catch (error) {
        console.log(error);
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deleteProduk = async (req, res) => {
    const data = req.body;
    try {
        await Models.deleteProduk(data);
        res.json({
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getSizesales = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSizesales(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const get_upprice = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_upprice(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHistoriposelected = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHistoriposelected(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const repeatStok = async (req, res) => {
    const data = req.body;
    try {
        await Models.repeatStok(data);
        res.json({
            data: data,
        });

    } catch (error) {
        if (error.code === "SPK_NOT_MATCHING") {
            return res.status(400).json({
                error: "SPK_NOT_MATCHING",
                message: error.message,
            });
        }
        res.status(500).json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHargabeliso = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHargabeliso(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHistorisoselected = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHistorisoselected(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const stockOpname = async (req, res) => {
    const data = req.body;
    try {
        await Models.stockOpname(data);
        res.json({
            data: data,
        });

    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const transferStok = async (req, res) => {
    const data = req.body;
    try {
        await Models.transferStok(data);
        res.json({
            data: data,
        });

    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const print_Stockopname = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.print_Stockopname(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getPo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getPo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHistoripo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHistoripo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const get_Sizepo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_Sizepo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const editPo = async (req, res) => {
    const data = req.body;
    try {
        await Models.editPo(data);
        res.json({
            data: data,
        });

    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deleteItem = async (req, res) => {
    const data = req.body;
    try {
        await Models.deleteItem(data);
        res.json({
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deletePo = async (req, res) => {
    const data = req.body;
    try {
        await Models.deletePo(data);
        res.json({
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHistoriso = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHistoriso(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getSo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getProdukbarcode = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getProdukbarcode(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getIdpo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getIdpo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getSizebarcode = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSizebarcode(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getSpkDetailList = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSpkDetailList(data);
        res.json({ result, data });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const getSizeBySpkDetail = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSizeBySpkDetail(data);
        res.json({ result, data });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const getSizeRestockBySpk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSizeRestockBySpk(data);
        res.json({ result, data });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const getStore_sales = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getStore_sales(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getMutation = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getMutation(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const get_Asset = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_Asset(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHistoripoasset = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHistoripoasset(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const settlementStock = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.settlementStock(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getWarehouse_sales = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getWarehouse_sales(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getWarehouse_sales_online = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getWarehouse_sales_online(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getRetur = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getRetur(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getRefund = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getRefund(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getStore_sales_online = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getStore_sales_online(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getStore_dashboard = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getStore_dashboard(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getHistoripotransfer = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHistoripotransfer(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getPotransfer = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getPotransfer(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getuserpo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getuserpo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getusertransfer = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getusertransfer(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getProdukdisplay = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getProdukdisplay(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getstoredisplay = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getstoredisplay(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const addDisplay = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.addDisplay(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deleteDisplay = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deleteDisplay(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const cariwares = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cariwares(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getwarehousetransfer = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getwarehousetransfer(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const cariwaresretur = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cariwaresretur(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const transferStokdefect = async (req, res) => {
    const data = req.body;
    try {
        await Models.transferStokdefect(data);
        res.json({
            data: data,
        });

    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getusersales = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getusersales(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getpodefect = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getpodefect(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getsizereturmodel = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getsizereturmodel(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getproduktukarmodel = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getproduktukarmodel(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const tukermodel = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.tukermodel(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getreturmodel = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getreturmodel(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getdeleteorder = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getdeleteorder(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const updateDefectStatus = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.update_defect_status(data);
        res.json({ result: result, data: data });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const bulkUpdateDefectStatus = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.bulk_update_defect_status(data);
        res.json({ result: result, data: data });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const updateDefectHarga = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.update_defect_harga(data);
        res.json({ result: result });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const editPo_defect = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.editPo_defect(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deleteItemdefect = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deleteItemdefect(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const get_Sizepodefect = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_Sizepodefect(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const editstockopname = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.editstockopname(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deleteitemso = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deleteitemso(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const edittransfer = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.edittransfer(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const deleteitempo = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deleteitempo(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getstore_api = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getstore_api(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};
const cekbeforeorder = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cekbeforeorder(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const cekbeforeordermassal = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cekbeforeordermassal(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getstore_history = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getstore_history(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getstore_cashier_online = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getstore_cashier_online(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getpendingapi = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getpendingapi(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const cek_namaproduk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cek_namaproduk(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const cekarea_sync = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cekarea_sync(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};


const get_spk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_spk(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const create_column_spk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.create_column_spk(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const edit_qty_spk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.edit_qty_spk(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const edit_spk_name = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.edit_spk_name(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const delete_spk = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.delete_spk(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const delete_spk_temp = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.delete_spk_temp(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const edit_qty_spk_utama = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.edit_qty_spk_utama(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const x_month = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.x_month(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getwarehouseSPK = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getwarehouseSPK(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const save_dateSelected = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.save_dateSelected(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getSelectedDate = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSelectedDate(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};

const getProduction = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getProduction(data);
        res.json({
            result: result,
            data: data,
        });
    } catch (error) {
        res.json({
            message: "Server Error",
            serverMessage: error,
        });
    }
};


// ================================================================
// PAYMENT & REJECT CONTROLLERS
// ================================================================

const save_spk_harga = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.save_spk_harga(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const get_spk_payment_summary = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_spk_payment_summary(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const add_spk_payment = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.add_spk_payment(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const delete_spk_payment = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.delete_spk_payment(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const add_spk_reject = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.add_spk_reject(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const get_spk_list = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_spk_list(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const get_supplier_payment_list = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_supplier_payment_list(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const get_supplier_payment_detail = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_supplier_payment_detail(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const get_spk_reject_list = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_spk_reject_list(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const update_spk_reject_status = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.update_spk_reject_status(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const bulk_update_spk_reject_status = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.bulk_update_spk_reject_status(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const delete_spk_reject_item = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.delete_spk_reject_item(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const get_spk_reject_sizes = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_spk_reject_sizes(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const delete_spk_reject_group = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.delete_spk_reject_group(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const update_spk_reject_harga = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.update_spk_reject_harga(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const update_spk_reject_harga_group = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.update_spk_reject_harga_group(data);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

const writeoff_reject = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.writeoff_reject(data);
        res.json({ result });
    } catch (error) {
        if (error.code === "SPK_NOT_MATCHING") {
            return res.json({
                error: "SPK_NOT_MATCHING",
                message: error.message,
            });
        }
        res.status(500).json({ message: "Server Error", serverMessage: error });
    }
};

// ================================================================
// END PAYMENT & REJECT CONTROLLERS
// ================================================================

module.exports = {
    getProduk,
    addProduk,
    editProduk,
    deleteProduk,
    getSizesales,
    getHistoriposelected,
    repeatStok,
    getHargabeliso,
    getHistorisoselected,
    stockOpname,
    transferStok,
    print_Stockopname,
    getPo,
    getHistoripo,
    get_Sizepo,
    editPo,
    deleteItem,
    deletePo,
    getHistoriso,
    getSo,
    getProdukbarcode,
    getIdpo,
    getSizebarcode,
    getStore_sales,
    getMutation,
    get_Asset,
    getHistoripoasset,
    settlementStock,
    getWarehouse_sales,
    getRetur,
    getRefund,
    getStore_sales_online,
    getWarehouse_sales_online,
    getNamaware,
    getWarehousebarcode,
    getStore_dashboard,
    get_upprice,
    getHistoripotransfer,
    getPotransfer,
    getuserpo,
    getusertransfer,
    getProdukdisplay,
    getstoredisplay,
    addDisplay,
    deleteDisplay,
    cariwares,
    getwarehousetransfer,
    cariwaresretur,
    transferStokdefect,
    getusersales,
    getpodefect,
    getsizereturmodel,
    getproduktukarmodel,
    tukermodel,
    getreturmodel,
    getdeleteorder,
    updateDefectStatus,
    bulkUpdateDefectStatus,
    updateDefectHarga,
    editPo_defect,
    deleteItemdefect,
    get_Sizepodefect,
    editstockopname,
    deleteitemso,
    edittransfer,
    deleteitempo,
    getstore_api,
    cekbeforeorder,
    cekbeforeordermassal,
    getstore_history,
    getstore_cashier_online,
    getpendingapi,
    cek_namaproduk,
    cekarea_sync,
    get_spk,
    create_column_spk,
    edit_qty_spk,
    edit_spk_name,
    delete_spk,
    delete_spk_temp,
    edit_qty_spk_utama,
    x_month,
    getwarehouseSPK,
    save_dateSelected,
    getSelectedDate,
    getProduction,
    save_spk_harga,
    get_spk_payment_summary,
    add_spk_payment,
    delete_spk_payment,
    add_spk_reject,
    get_spk_list,
    get_supplier_payment_list,
    get_supplier_payment_detail,
    get_spk_reject_list,
    get_spk_reject_sizes,
    update_spk_reject_status,
    bulk_update_spk_reject_status,
    delete_spk_reject_item,
    delete_spk_reject_group,
    update_spk_reject_harga,
    update_spk_reject_harga_group,
    writeoff_reject,
    getSpkDetailList,
    getSizeBySpkDetail,
    getSizeRestockBySpk,
};
