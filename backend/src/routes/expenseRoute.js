const express = require("express");
const router = express.Router();

const controller = require("../controller/expense");

// expense
router.post("/getexpense", controller.getExpense);
router.post("/addexpense", controller.addExpense);
router.post("/editexpense", controller.editExpense);
router.post("/deleteexpense", controller.deleteExpense);

module.exports = router;