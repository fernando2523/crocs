const Models = require("../models/sales");
const sharp = require("sharp");
const path = require("path");
const { customAlphabet } = require("nanoid");
const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
var crypto = require("node:crypto");

const productsSales = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.productsSales(data);
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

const salesProductbarcode = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.salesProductbarcode(data);
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

const inputSales = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.inputSales(data);
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

const order = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.order(data);
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

const orderCount = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.orderCount(data);
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

const getHeaderpesanan = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getHeaderpesanan(data);
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

const refund = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.refund(data);
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

const getSizeretur = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getSizeretur(data);
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

const retur = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.retur(data);
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

const returLuar = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.returLuar(data);
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

const deletePesanan = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deletePesanan(data);
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

const updatePesanan = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.updatePesanan(data);
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

const gudangretur = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.gudangretur(data);
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

const cekbarcode = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.cekbarcode(data);
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

const syncorder = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.syncorder(data);
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

const syncordermassal = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.syncordermassal(data);
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

const deletepesanansync = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deletepesanansync(data);
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

const insertgagalinput = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.insertgagalinput(data);
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

const deletependinginput = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deletependinginput(data);
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

const history_massal = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.history_massal(data);
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

const get_history_massal = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.get_history_massal(data);
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

const deletependingdata = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.deletependingdata(data);
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

const getPickingList = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getPickingList(data);
        res.json({ result });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const insertPickingList = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.insertPickingList(data);
        res.json({ result });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const getPickingListData = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getPickingListData(data);
        res.json({ result });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const updatePickingList = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.updatePickingList(data);
        res.json({ result });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

const updateStatusPacking = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.updateStatusPacking(data);
        res.json({ result });
    } catch (error) {
        res.json({ message: "Server Error", serverMessage: error });
    }
};

module.exports = {
    productsSales,
    salesProductbarcode,
    inputSales,
    order,
    orderCount,
    getHeaderpesanan,
    refund,
    getSizeretur,
    retur,
    returLuar,
    deletePesanan,
    updatePesanan,
    gudangretur,
    cekbarcode,
    syncorder,
    syncordermassal,
    deletepesanansync,
    insertgagalinput,
    deletependinginput,
    history_massal,
    get_history_massal,
    deletependingdata,
    getPickingList,
    insertPickingList,
    getPickingListData,
    updatePickingList,
    updateStatusPacking,
};
