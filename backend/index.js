require("dotenv").config();
process.env.TZ = "Asia/Jakarta";
// const PORT = process.env.PORT || 4000;
const PORT = 8888;
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/assets/img", express.static("public/images"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const Salesretail = require("./src/routes/salesretail.js");
const Sales = require("./src/routes/sales.js");
const ProdukRoutes = require("./src/routes/produkRoutes.js");
const ExpenseRoutes = require("./src/routes/expenseRoute.js");
const Routes = require("./src/routes/webroutes.js");

app.use("/v1", Salesretail);
app.use("/v1", Sales);
app.use("/v1", Routes);
app.use("/v1", ExpenseRoutes);
app.use("/v1", ProdukRoutes);
app.use("/public/images", express.static("public/images"));

app.get("/", (req, res) => {
  res.send("This Is Page Api Gudangsandal");
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Running di Port ${PORT}`);
});