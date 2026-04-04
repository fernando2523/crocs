const Models = require("../models/salesretail");
const sharp = require("sharp");
const path = require("path");
const { customAlphabet } = require("nanoid");
const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
var crypto = require("node:crypto");

const getStore_salesretail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getStore_salesretail(data);
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

const getKasir = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getKasir(data);
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

const getResellersales = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getResellersales(data);
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

const productsSalesretail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.productsSalesretail(data);
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

const inputSalesretail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.inputSalesretail(data);
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

const orderresellerpaid = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.orderresellerpaid(data);
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

const orderCountresellerpaid = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.orderCountresellerpaid(data);
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

const getHeaderpesananresellerpaid = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getHeaderpesananresellerpaid(data);
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

const orderresellerpending = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.orderresellerpending(data);
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

const gethistorypay = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.gethistorypay(data);
    res.json({
      result: result,
      //   data: data,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const orderCountresellerpending = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.orderCountresellerpending(data);
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

const getHeaderpesananresellerpending = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getHeaderpesananresellerpending(data);
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

const orderresellerretail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.orderresellerretail(data);
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

const orderCountresellerretail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.orderCountresellerretail(data);
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

const getHeaderpesananresellerretail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getHeaderpesananresellerretail(data);
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


module.exports = {
  getStore_salesretail,
  getKasir,
  getResellersales,
  productsSalesretail,
  inputSalesretail,
  orderresellerpaid,
  orderCountresellerpaid,
  getHeaderpesananresellerpaid,
  orderresellerpending,
  orderCountresellerpending,
  getHeaderpesananresellerpending,
  orderresellerretail,
  orderCountresellerretail,
  getHeaderpesananresellerretail,
  gethistorypay,
  // returLuar,
  // deletePesanan,
  // updatePesanan,
};
