const Models = require("../models/expense");
const sharp = require("sharp");
const path = require("path");
const { customAlphabet } = require("nanoid");
const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
var crypto = require("node:crypto");

const getExpense = async (req, res) => {
    const data = req.body;
    try {
        const result = await Models.getExpense(data);
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

const addExpense = async (req, res) => {
    const data = req.body;
    try {
        await Models.addExpense(data);
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

const editExpense = async (req, res) => {
    const data = req.body;
    try {
        await Models.editExpense(data);
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

const deleteExpense = async (req, res) => {
    const data = req.body;
    try {
        await Models.deleteExpense(data);
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

module.exports = {
    getExpense,
    addExpense,
    editExpense,
    deleteExpense
};
