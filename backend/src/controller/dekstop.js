const Models = require("../models/dekstop");
const sharp = require("sharp");
const path = require("path");
const { customAlphabet } = require("nanoid");
const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
var crypto = require("node:crypto");

const getKaryawan = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getKaryawan(data);
    res.json({
      result: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getStore = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getStore(data);
    res.json({
      data_store: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getRoles = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getRoles(data);
    res.json({
      data_roles: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addKaryawan = async (req, res) => {
  const data = req.body;
  try {
    await Models.addKaryawan(data);
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

const editKaryawan = async (req, res) => {
  const data = req.body;
  try {
    await Models.editKaryawan(data);
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

const updateAkun = async (req, res) => {
  const data = req.body;
  try {
    await Models.updateAkun(data);
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

const deleteAkun = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteAkun(data);
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

// reseller

const getReseller = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getReseller(data);
    res.json({
      data_reseller: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addReseller = async (req, res) => {
  const data = req.body;
  try {
    await Models.addReseller(data);
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

const editReseller = async (req, res) => {
  const data = req.body;
  try {
    await Models.editReseller(data);
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

const deleteReseller = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteReseller(data);
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

// supplier

const getSupplier = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getSupplier(data);
    res.json({
      data_supplier: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addSupplier = async (req, res) => {
  const data = req.body;
  try {
    await Models.addSupplier(data);
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

const editSupplier = async (req, res) => {
  const data = req.body;
  try {
    await Models.editSupplier(data);
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

const deleteSupplier = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteSupplier(data);
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

// category
const getCategory = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getCategory(data);
    res.json({
      data_category: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addCategory = async (req, res) => {
  const data = req.body;
  try {
    await Models.addCategory(data);
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

const editCategory = async (req, res) => {
  const data = req.body;
  try {
    await Models.editCategory(data);
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

const deleteCategory = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteCategory(data);
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

// brand
const getBrand = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getBrand(data);
    res.json({
      data_brand: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addBrand = async (req, res) => {
  const data = req.body;
  try {
    await Models.addBrand(data);
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

const editBrand = async (req, res) => {
  const data = req.body;
  try {
    await Models.editBrand(data);
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

const deleteBrand = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteBrand(data);
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

// store
const getStores = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getStores(data);
    res.json({
      data_store: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addStore = async (req, res) => {
  const data = req.body;
  try {
    await Models.addStore(data);
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

const getstore_Area = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getstore_Area(data);
    res.json({
      data_area: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const editStore = async (req, res) => {
  const data = req.body;
  try {
    await Models.editStore(data);
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

const deleteStore = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteStore(data);
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

const getstore_Warehouse = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getstore_Warehouse(data);
    res.json({
      data_warehouse: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

// warehouse
const getWarehouse = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getWarehouse(data);
    res.json({
      data_warehouse: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getwarehouse_product = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getwarehouse_product(data);
    res.json({
      data_warehouse: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getWarehouseselected = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getWarehouseselected(data);
    res.json({
      data_warehouse: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const addWarehouse = async (req, res) => {
  const data = req.body;
  try {
    await Models.addWarehouse(data);
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

const editWarehouse = async (req, res) => {
  const data = req.body;
  try {
    await Models.editWarehouse(data);
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

const deleteWarehouse = async (req, res) => {
  const data = req.body;
  try {
    await Models.deleteWarehouse(data);
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

// area
const getArea = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getArea(data);
    res.json({
      data_area: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const login = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.login(data);
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

const getDashboard = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getDashboard(data);
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

const getstorekaryawan = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getstorekaryawan(data);
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

const updatePassword = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.updatePassword(data);
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

const getstorekaryawanedit = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getstorekaryawanedit(data);
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

const getarea = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getarea(data);
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

const editarea = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.editarea(data);
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

const getstoreexpense = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getstoreexpense(data);
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

const getwarehousedisplayproduct = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getwarehousedisplayproduct(data);
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

const getprintsales = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getprintsales(data);
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

const login_on_enter = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.login_on_enter(data);
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

const getbrandarea = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getbrandarea(data);
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

const getsupplierarea = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getsupplierarea(data);
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

const getso_brand = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getso_brand(data);
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

const histories_recap = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.histories_recap(data);
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

const getHistoryDetail = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getHistoryDetail(data);
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

const getnotifikasi = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getnotifikasi(data);
    res.json({
      result: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const getnotifikasi_stok = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.getnotifikasi_stok(data);
    res.json({
      result: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const updatenotif = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.updatenotif(data);
    res.json({
      result: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const updatenotifall = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.updatenotifall(data);
    res.json({
      result: result,
    });
  } catch (error) {
    res.json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

const updatestatus_stokmarket = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.updatestatus_stokmarket(data);
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

const stokmin_update = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.stokmin_update(data);
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

const stokminimum_update_default = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.stokminimum_update_default(data);
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

const setstoknotif_manual = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.setstoknotif_manual(data);
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

const massalUpdate_stokAlert = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.massalUpdate_stokAlert(data);
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

const massalUpdate_status_stokmarket = async (req, res) => {
  const data = req.body;
  try {
    const result = await Models.massalUpdate_status_stokmarket(data);
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
  getKaryawan,
  getStore,
  getRoles,
  addKaryawan,
  editKaryawan,
  updateAkun,
  deleteAkun,
  getReseller,
  addReseller,
  editReseller,
  deleteReseller,
  getSupplier,
  addSupplier,
  editSupplier,
  deleteSupplier,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
  getBrand,
  addBrand,
  editBrand,
  deleteBrand,
  getStores,
  addStore,
  getstore_Area,
  editStore,
  deleteStore,
  getstore_Warehouse,
  getWarehouse,
  addWarehouse,
  editWarehouse,
  deleteWarehouse,
  getArea,
  login,
  getDashboard,
  getstorekaryawan,
  updatePassword,
  getstorekaryawanedit,
  getWarehouseselected,
  getarea,
  editarea,
  getwarehouse_product,
  getstoreexpense,
  getwarehousedisplayproduct,
  getprintsales,
  login_on_enter,
  getbrandarea,
  getsupplierarea,
  getso_brand,
  histories_recap,
  getHistoryDetail,
  getnotifikasi,
  updatenotif,
  updatenotifall,
  updatestatus_stokmarket,
  getnotifikasi_stok,
  stokmin_update,
  stokminimum_update_default,
  setstoknotif_manual,
  massalUpdate_stokAlert,
  massalUpdate_status_stokmarket,
};
