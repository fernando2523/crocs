const dbPool = require("../config/database");

const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
const { generateFromEmail } = require("unique-username-generator");

// karyawan
const getKaryawan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const datas = [];

    const [data_karyawan] = await connection.query(
      `SELECT * FROM tb_karyawan WHERE username != 'SUPERADMIN'`
    );

    for (let index = 0; index < data_karyawan.length; index++) {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store`
      );
      if (data_store[0].id_store === "SUPER-ADMIN") {
        datas.push({
          id: data_karyawan[index].id,
          username: data_karyawan[index].username,
          password: data_karyawan[index].password,
          name: data_karyawan[index].name,
          tlp: data_karyawan[index].tlp,
          domisili: data_karyawan[index].domisili,
          role: data_karyawan[index].role,
          id_store: data_karyawan[index].id_store,
          status_account: data_karyawan[index].status_account,
          created_at: data_karyawan[index].created_at,
          updated_at: data_karyawan[index].updated_at,
          store: data_karyawan[index].id_store,
          akses: data_karyawan[index].akses,
        });
      } else if (data_store[0].id_store === "HEAD-AREA") {
        datas.push({
          id: data_karyawan[index].id,
          username: data_karyawan[index].username,
          password: data_karyawan[index].password,
          name: data_karyawan[index].name,
          tlp: data_karyawan[index].tlp,
          domisili: data_karyawan[index].domisili,
          role: data_karyawan[index].role,
          id_store: data_karyawan[index].id_store,
          status_account: data_karyawan[index].status_account,
          created_at: data_karyawan[index].created_at,
          updated_at: data_karyawan[index].updated_at,
          store: data_karyawan[index].id_area,
          akses: data_karyawan[index].akses,
        });
      } else {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE id_store='${data_karyawan[index].id_store}'`
        );
        datas.push({
          id: data_karyawan[index].id,
          username: data_karyawan[index].username,
          password: data_karyawan[index].password,
          name: data_karyawan[index].name,
          tlp: data_karyawan[index].tlp,
          domisili: data_karyawan[index].domisili,
          role: data_karyawan[index].role,
          id_store: data_karyawan[index].id_store,
          status_account: data_karyawan[index].status_account,
          created_at: data_karyawan[index].created_at,
          updated_at: data_karyawan[index].updated_at,
          store: data_store,
          akses: data_karyawan[index].akses,
        });
      }

    }
    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getStore = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_store] = await connection.query(
      `SELECT * FROM tb_store`
    );

    await connection.commit();
    await connection.release();

    return data_store;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getRoles = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_roles] = await connection.query(
      `SELECT * FROM tb_roles`
    );

    await connection.commit();
    await connection.release();

    return data_roles;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addKaryawan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    function genRandonString(length) {
      var chars = body.name;
      var charLength = chars.length;
      var result = "";
      for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
      }
      return result;
    }

    const dataName = genRandonString(8);
    const username = generateFromEmail(dataName.replace(/\s/g, ""), 4);

    if (body.role === "SUPER-ADMIN") {
      await connection.query(
        `INSERT INTO tb_karyawan
      (username, password, name, tlp, domisili, role, id_store, akses, status_account, created_at, updated_at)
      VALUES ('${username}','123456789','${body.name}','${body.tlp}','${body.domisili}','${body.role}','${body.store}','${body.store}','NONACTIVE','${tanggal}','${tanggal}')`
      );
    } else if (body.role === "HEAD-AREA") {
      var [data_area] = await connection.query(
        `SELECT * FROM tb_area WHERE id_area='${body.store}'`
      );
      await connection.query(
        `INSERT INTO tb_karyawan
      (username, password, name, tlp, domisili, role, id_store, akses, status_account, created_at, updated_at)
      VALUES ('${username}','123456789','${body.name}','${body.tlp}','${body.domisili}','${body.role}','${body.store}','${data_area[0].kota}','NONACTIVE','${tanggal}','${tanggal}')`
      );
    } else if (body.role === "HEAD-BRAND") {
      var [data_brand] = await connection.query(
        `SELECT * FROM tb_brand WHERE id_brand='${body.store}'`
      );
      await connection.query(
        `INSERT INTO tb_karyawan
      (username, password, name, tlp, domisili, role, id_store, akses, status_account, created_at, updated_at)
      VALUES ('${username}','123456789','${body.name}','${body.tlp}','${body.domisili}','${body.role}','${body.store}','${data_brand[0].brand}','NONACTIVE','${tanggal}','${tanggal}')`
      );
    } else if (body.role === "HEAD-WAREHOUSE") {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware='${body.store}'`
      );
      await connection.query(
        `INSERT INTO tb_karyawan
      (username, password, name, tlp, domisili, role, id_store, akses, status_account, created_at, updated_at)
      VALUES ('${username}','123456789','${body.name}','${body.tlp}','${body.domisili}','${body.role}','${body.store}','${data_ware[0].warehouse}','NONACTIVE','${tanggal}','${tanggal}')`
      );
    } else if (body.role === "GUEST") {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware='${body.store}'`
      );
      await connection.query(
        `INSERT INTO tb_karyawan
      (username, password, name, tlp, domisili, role, id_store, akses, status_account, created_at, updated_at)
      VALUES ('${username}','123456789','${body.name}','${body.tlp}','${body.domisili}','${body.role}','${body.store}','${body.store}','NONACTIVE','${tanggal}','${tanggal}')`
      );
    }
    else {
      await connection.query(
        `INSERT INTO tb_karyawan
      (username, password, name, tlp, domisili, role, id_store, akses, status_account, created_at, updated_at)
      VALUES ('${username}','123456789','${body.name}','${body.tlp}','${body.domisili}','${body.role}','${body.store}','${body.store}','NONACTIVE','${tanggal}','${tanggal}')`
      );
    }

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editKaryawan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    if (body.data.edit_role === "SUPER-ADMIN") {
      await connection.query(
        `UPDATE tb_karyawan SET username='${body.data.edit_username}',password='${body.data.edit_password}',name='${body.data.edit_name}',tlp='${body.data.edit_tlp}',domisili='${body.data.edit_domisili}',role='${body.data.edit_role}',id_store='${body.data.edit_store}',akses='${body.data.edit_store}',updated_at='${tanggal}' WHERE id='${body.id}'`
      );
    } else if (body.data.edit_role === "HEAD-AREA") {
      var [data_area] = await connection.query(
        `SELECT * FROM tb_area WHERE id_area='${body.data.edit_store}'`
      );
      await connection.query(
        `UPDATE tb_karyawan SET username='${body.data.edit_username}',password='${body.data.edit_password}',name='${body.data.edit_name}',tlp='${body.data.edit_tlp}',domisili='${body.data.edit_domisili}',role='${body.data.edit_role}',id_store='${body.data.edit_store}',akses='${data_area[0].kota}',updated_at='${tanggal}' WHERE id='${body.id}'`
      );
    } else if (body.data.edit_role === "HEAD-BRAND") {
      var [data_brand] = await connection.query(
        `SELECT * FROM tb_brand WHERE id_brand='${body.data.edit_store}'`
      );
      await connection.query(
        `UPDATE tb_karyawan SET username='${body.data.edit_username}',password='${body.data.edit_password}',name='${body.data.edit_name}',tlp='${body.data.edit_tlp}',domisili='${body.data.edit_domisili}',role='${body.data.edit_role}',id_store='${body.data.edit_store}',akses='${data_brand[0].brand}',updated_at='${tanggal}' WHERE id='${body.id}'`
      );
    } else if (body.data.edit_role === "HEAD-WAREHOUSE") {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware='${body.data.edit_store}'`
      );
      await connection.query(
        `UPDATE tb_karyawan SET username='${body.data.edit_username}',password='${body.data.edit_password}',name='${body.data.edit_name}',tlp='${body.data.edit_tlp}',domisili='${body.data.edit_domisili}',role='${body.data.edit_role}',id_store='${body.data.edit_store}',akses='${data_ware[0].warehouse}',updated_at='${tanggal}' WHERE id='${body.id}'`
      );
    } else {
      await connection.query(
        `UPDATE tb_karyawan SET username='${body.data.edit_username}',password='${body.data.edit_password}',name='${body.data.edit_name}',tlp='${body.data.edit_tlp}',domisili='${body.data.edit_domisili}',role='${body.data.edit_role}',id_store='${body.data.edit_store}',akses='${body.data.edit_store}',updated_at='${tanggal}' WHERE id='${body.id}'`
      );
    }

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const updateAkun = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_karyawan SET status_account='${body.status}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteAkun = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_karyawan WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// reseller
const getReseller = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    // const datas = [];

    const [data_reseller] = await connection.query(
      `SELECT * FROM tb_reseller ORDER BY id DESC`
    );

    await connection.commit();
    await connection.release();

    return data_reseller;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addReseller = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [cek_reseller] = await connection.query(
      `SELECT MAX(id_reseller) as id_reseller FROM tb_reseller`
    );
    if (cek_reseller[0].id_reseller === null) {
      var IDRES = "RES-0001";
    } else {
      const get_last2 = cek_reseller[0].id_reseller.split("-");
      const data_2 = parseInt(get_last2[1]) + 1;
      var IDRES = "RES-" + String(data_2).padStart(4, "0");
    }

    await connection.query(
      `INSERT INTO tb_reseller
      (id_reseller, nama, created_at, updated_at)
      VALUES ('${IDRES}','${body.nama}','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editReseller = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_reseller SET nama='${body.data.edit_nama}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteReseller = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_reseller WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// supplier
const getSupplier = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    // const datas = [];

    const [data_supplier] = await connection.query(
      `SELECT * FROM tb_supplier ORDER BY id DESC`
    );

    await connection.commit();
    await connection.release();

    return data_supplier;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addSupplier = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [cek_supplier] = await connection.query(
      `SELECT MAX(id_sup) as id_sup FROM tb_supplier`
    );
    if (cek_supplier[0].id_sup === null) {
      var IDSUP = "SUP-0001";
    } else {
      const get_last2 = cek_supplier[0].id_sup.split("-");
      const data_2 = parseInt(get_last2[1]) + 1;
      var IDSUP = "SUP-" + String(data_2).padStart(4, "0");
    }

    await connection.query(
      `INSERT INTO tb_supplier
      (id_sup, supplier, contact, created_at, updated_at)
      VALUES ('${IDSUP}','${body.supplier}','${body.contact}','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editSupplier = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_supplier SET supplier='${body.data.edit_supplier}',contact='${body.data.edit_contact}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteSupplier = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_supplier WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// category
const getCategory = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_category] = await connection.query(
      `SELECT * FROM tb_category ORDER BY id DESC`
    );

    await connection.commit();
    await connection.release();

    return data_category;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addCategory = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [cek_category] = await connection.query(
      `SELECT MAX(id_category) as id_category FROM tb_category`
    );
    if (cek_category[0].id_category === null) {
      var IDCAT = "CAT-0001";
    } else {
      const get_last2 = cek_category[0].id_category.split("-");
      const data_2 = parseInt(get_last2[1]) + 1;
      var IDCAT = "CAT-" + String(data_2).padStart(4, "0");
    }

    await connection.query(
      `INSERT INTO tb_category
      (id_category, category, created_at, updated_at)
      VALUES ('${IDCAT}','${body.category}','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editCategory = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_category SET category='${body.data.edit_category}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteCategory = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_category WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// brand
const getBrand = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_brand] = await connection.query(
      `SELECT * FROM tb_brand  ORDER BY id DESC`
    );

    await connection.commit();
    await connection.release();

    return data_brand;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addBrand = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [cek_brand] = await connection.query(
      `SELECT MAX(id_brand) as id_brand FROM tb_brand`
    );
    if (cek_brand[0].id_brand === null) {
      var id_brand = "BRN-0001";
    } else {
      const get_last2 = cek_brand[0].id_brand.split("-");
      const data_2 = parseInt(get_last2[1]) + 1;
      var id_brand = "BRN-" + String(data_2).padStart(4, "0");
    }

    await connection.query(
      `INSERT INTO tb_brand
      (id_brand, brand, img, created_at, updated_at)
      VALUES ('${id_brand}','${body.brand}','NULL','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editBrand = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_brand SET brand='${body.data.edit_brand}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteBrand = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_brand WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// store
const getStores = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const datas = [];

    const [data_stores] = await connection.query(
      `SELECT * FROM tb_store`
    );

    for (let index = 0; index < data_stores.length; index++) {
      const [data_area] = await connection.query(
        `SELECT * FROM tb_area WHERE id_area='${data_stores[index].id_area}'`
      );

      datas.push({
        id: data_stores[index].id,
        id_store: data_stores[index].id_store,
        id_ware: data_stores[index].id_ware,
        id_area: data_stores[index].id_area,
        store: data_stores[index].store,
        channel: data_stores[index].channel,
        address: data_stores[index].address,
        ip: data_stores[index].ip,
        created_at: data_stores[index].created_at,
        updated_at: data_stores[index].updated_at,
      });
    }

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addStore = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [cek_store] = await connection.query(
      `SELECT MAX(id_store) as id_store FROM tb_store`
    );
    if (cek_store[0].id_store === null) {
      var id_store = "STR-0001";
    } else {
      const get_last2 = cek_store[0].id_store.split("-");
      const data_2 = parseInt(get_last2[1]) + 1;
      var id_store = "STR-" + String(data_2).padStart(4, "0");
    }

    const [data_ware] = await connection.query(
      `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.id_ware}'`
    );

    await connection.query(
      `INSERT INTO tb_store
      (id_store, id_ware, id_area, store, channel, address, ip, created_at, updated_at)
      VALUES ('${id_store}','${body.id_ware}','${data_ware[0].id_area}','${body.store}','${body.channel}','${body.alamat}','${body.ip}','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getstore_Area = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_area] = await connection.query(
      `SELECT * FROM tb_area ORDER BY id ASC`
    );

    await connection.commit();
    await connection.release();

    return data_area;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editStore = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_area] = await connection.query(
      `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.data.edit_id_ware}'`
    );

    if (body.data.edit_ip === null) {
      var ip_channel = null;
    } else {
      var ip_channel = body.data.edit_ip;
    }

    await connection.query(
      `UPDATE tb_store SET id_ware='${body.data.edit_id_ware}',id_area='${data_area[0].id_area}',store='${body.data.edit_store}',channel='${body.data.edit_channel}',address='${body.data.edit_alamat}',ip='${ip_channel}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteStore = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_store WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getstore_Warehouse = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_warehouse] = await connection.query(
      `SELECT * FROM tb_warehouse ORDER BY id ASC`
    );

    await connection.commit();
    await connection.release();

    return data_warehouse;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// warehouse
const getWarehouse = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_warehouse] = await connection.query(
      `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL' ORDER BY id DESC`
    );

    await connection.commit();
    await connection.release();

    return data_warehouse;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getwarehouse_product = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    if (body.role === "SUPER-ADMIN") {
      var [data_warehouse] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL' ORDER BY id DESC`
      );
    } else if (body.role === "HEAD-AREA") {
      var [data_warehouse] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL' AND id_area='${body.area}' ORDER BY id DESC`
      );
    } else if (body.role === "HEAD-WAREHOUSE") {
      var [data_ware_awal] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL' AND id_ware='${body.area}' ORDER BY id DESC`
      );

      for (let index = 0; index < data_ware_awal.length; index++) {
        var [data_warehouse] = await connection.query(
          `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL' AND id_area='${data_ware_awal[index].id_area}' ORDER BY id DESC`
        );
      }
    } else {
      var [data_ware_awal] = await connection.query(
        `SELECT id_ware FROM tb_store WHERE id_ware != 'EXTERNAL' AND id_store='${body.area}' ORDER BY id DESC`
      );

      for (let index = 0; index < data_ware_awal.length; index++) {
        var [data_warehouse] = await connection.query(
          `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL' AND id_ware='${data_ware_awal[index].id_ware}' ORDER BY id DESC`
        );
      }
    }

    var [data_brand] = await connection.query(
      `SELECT brand,id_area FROM tb_warehouse GROUP BY brand`
    );

    await connection.commit();
    await connection.release();

    return {
      data_warehouse,
      data_brand
    };
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getwarehousedisplayproduct = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_warehouse] = await connection.query(
      `SELECT * FROM tb_warehouse WHERE id_ware != 'EXTERNAL'  ORDER BY id DESC`
    );

    await connection.commit();
    await connection.release();

    return data_warehouse;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getWarehouseselected = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_role] = await connection.query(
      `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
    );

    if (body.role === 'SUPER-ADMIN') {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse`
      );
    }
    else if (body.role === 'HEAD-AREA') {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_area='${body.store}'`
      );
    }
    else {
      var [list_data_role] = await connection.query(
        `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.store}'`
      );
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_ware='${list_data_role[0].id_store}'`
      );
    }

    await connection.commit();
    await connection.release();

    return data_ware;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const addWarehouse = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [cek_warehouse] = await connection.query(
      `SELECT MAX(id_ware) as id_ware FROM tb_warehouse`
    );
    if (cek_warehouse[0].id_ware === null) {
      var id_ware = "WARE-0001";
    } else {
      const get_last2 = cek_warehouse[0].id_ware.split("-");
      const data_2 = parseInt(get_last2[1]) + 1;
      var id_ware = "WARE-" + String(data_2).padStart(4, "0");
    }

    await connection.query(
      `INSERT INTO tb_warehouse
      (id_ware, id_area, warehouse, address, brand, created_at, updated_at)
      VALUES ('${id_ware}','${body.id_area}','${body.warehouse}','${body.alamat}','${body.brand}','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editWarehouse = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_warehouse SET id_area='${body.data.edit_id_area}',warehouse='${body.data.edit_warehouse}',address='${body.data.edit_alamat}',brand='${body.data.edit_brand}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deleteWarehouse = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_warehouse WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const login = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();
    var username = body.data.username;
    var password = body.data.password;

    const [cek_divisi] = await connection.query(
      `SELECT tb_karyawan.*,tb_store.channel FROM tb_karyawan LEFT JOIN tb_store ON tb_karyawan.id_store = tb_store.id_store WHERE tb_karyawan.username='${username}' AND tb_karyawan.password='${password}'`
    );
    if (cek_divisi.length > 0) {
      if (cek_divisi[0].username === username && cek_divisi[0].password === password) {
        if (cek_divisi[0].status_account === 'NONACTIVE') {
          var hasil = 'NONACTIVE';
        } else {
          var hasil = cek_divisi;
        }
      } else {
        var hasil = 'Wrong';
      }
    } else {
      var hasil = 'Failed';
    }
    await connection.commit();
    await connection.release();

    return hasil;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

// dashboard

const getDashboard = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");

  try {
    await connection.beginTransaction();
    console.log("body dashboard", body);

    const store = body.store;
    // Normalisasi ke array & siapkan filter string dengan escape
    const rawStores = Array.isArray(store) ? store : [store];
    const stores = rawStores.filter(s => s && !['all', 'all_area', 'all_brand'].includes(s));
    // Safely escape each store id to inline in the SQL IN list
    const escList = stores.map((s) => connection.escape(s)).join(',');
    // Dynamic filters that degrade to no-op when stores is empty
    const storeFilter = stores.length ? `id_store IN (${escList})` : '1=1';
    const storeOrderFilter = stores.length ? `tb_order.id_store IN (${escList})` : '1=1';
    const invoiceCustomerFilter = stores.length ? `customer IN (${escList})` : '1=1';
    const invoiceCustomerFilterQual = stores.length ? `tb_invoice.customer IN (${escList})` : '1=1';
    const paymentStoreFilter = stores.length ? `id_store IN (${escList})` : '1=1';
    const roles = body.role;
    const tanggal = body.date;
    const myArray = tanggal.split(" to ");

    if (tanggal.length > 10) {
      var tanggal_start = myArray[0];
      var tanggal_end = myArray[1];
    } else {
      var tanggal_start = tanggal;
      var tanggal_end = tanggal;
    }

    var id_area = body.area;

    const [get_area] = await connection.query(
      `SELECT tb_area.id_area,tb_store.id_area FROM tb_area LEFT JOIN tb_store ON tb_area.id_area = tb_store.id_area WHERE tb_area.id_area='${id_area}' GROUP BY tb_store.id_area`
    );

    if (body.area === 'SUPER-ADMIN') {
      var getstores = "-";
    } else if (body.area === 'HEAD-AREA') {
      var getstores = "-";
    } else {
      var [caristore] = await connection.query(
        `SELECT id_store FROM tb_store WHERE id_store='${body.area}' GROUP BY id_store`
      );
      for (let xxx = 0; xxx < caristore.length; xxx++) {
        var getstores = caristore[xxx].id_store;
      }
    }

    if (
      (Array.isArray(body.store) && body.store.includes("all_area")) ||
      body.store === "all_area"
    ) {
      const area_ware = body.area.split('-')[0];
      if (area_ware === "WARE") {
        const [data_get_ware] = await connection.query(
          `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_area`
        );
        var output_area_ware = data_get_ware[0].id_area;
      } else if (area_ware === "AREA") {
        var output_area_ware = body.area;
      }
    }

    console.log("output_area_ware", output_area_ware);


    if (store === "all" || (Array.isArray(store) && store.includes("all"))) {

      if (body.area === "SUPER-ADMIN") {
        if (body.Brand === "all") {

          var [discount] = await connection.query(
            `SELECT SUM(diskon_item) as total_diskon FROM tb_order WHERE tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [top_10_reseller] = await connection.query(
            `SELECT tb_order.qty,SUM(qty) as total,tb_invoice.reseller FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir') AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_invoice.reseller ORDER BY total DESC LIMIT 10`
          );

          var [top_10_produk] = await connection.query(
            `SELECT *,SUM(qty) as qty FROM tb_order WHERE tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_produk ORDER BY qty DESC LIMIT 50`
          );

          var [total_qty] = await connection.query(
            `SELECT *,SUM(qty) as qty FROM tb_order WHERE tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [gross_sale] = await connection.query(
            `SELECT *,SUM(total_amount) as total_amount FROM tb_invoice WHERE sales_channel='OFFLINE STORE' AND payment='PAID' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [gross_sale_online] = await connection.query(
            `SELECT *,SUM(total_amount) as total_amount FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          if (roles === "SUPER-ADMIN" || roles === "HEAD-AREA") {
            var [expense] = await connection.query(
              `SELECT *,SUM(total_amount) as total_amount FROM tb_expense WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
          } else {
            var [expense] = await connection.query(
              `SELECT *,SUM(total_amount) as total_amount FROM tb_expense WHERE id_store != 'ALL-STORE' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
          }

          var [transactions] = await connection.query(
            `SELECT * FROM tb_invoice WHERE payment='PAID' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [produkgudangsold] = await connection.query(
            `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [produkextsold] = await connection.query(
            `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [costgudang] = await connection.query(
            `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [costluar] = await connection.query(
            `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [cancel_sales] = await connection.query(
            `SELECT * FROM tb_invoice WHERE status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [paid] = await connection.query(
            `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PAID' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [pending] = await connection.query(
            `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PENDING' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [cash] = await connection.query(
            `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE bank='CASH' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [bca] = await connection.query(
            `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE bank='DEBIT' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [qris] = await connection.query(
            `SELECT bank,id_invoice,SUM(total_payment) as qris FROM tb_payment WHERE bank='QRIS' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          console.log("BBB");

          var [discount] = await connection.query(
            `SELECT *,SUM(diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [top_10_reseller] = await connection.query(
            `SELECT SUM(qty) as total,reseller FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${body.Brand}' AND sales_channel='OFFLINE STORE' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY reseller ORDER BY total DESC LIMIT 10`
          );

          var [top_10_produk] = await connection.query(
            `SELECT *,SUM(qty) as qty FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${body.Brand}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_produk ORDER BY qty DESC LIMIT 50`
          );

          var [total_qty] = await connection.query(
            `SELECT tb_order.*,SUM(qty) as qty,tb_store.id_area FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [gross_sale] = await connection.query(
            `SELECT tb_invoice.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_store.id_area='${body.Brand}' AND tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [gross_sale_online] = await connection.query(
            `SELECT tb_invoice.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_store.id_area='${body.Brand}' AND tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          if (roles === "SUPER-ADMIN" || roles === "HEAD-AREA") {
            var [expense] = await connection.query(
              `SELECT tb_expense.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tb_store.id_area='${body.Brand}' AND tb_expense.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
          } else {
            var [expense] = await connection.query(
              `SELECT tb_expense.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tb_expense.id_store != 'ALL-STORE' AND tb_store.id_area='${body.Brand}' AND tb_expense.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
          }


          var [transactions] = await connection.query(
            `SELECT tb_store.*,tb_invoice.* FROM tb_store LEFT JOIN tb_invoice ON tb_store.id_store = tb_invoice.customer WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_store.id_area='${body.Brand}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [produkgudangsold] = await connection.query(
            `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [produkextsold] = await connection.query(
            `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [costgudang] = await connection.query(
            `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [costluar] = await connection.query(
            `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [cancel_sales] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='CANCEL' AND tb_store.id_area='${body.Brand}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [paid] = await connection.query(
            `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PAID' AND tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [pending] = await connection.query(
            `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PENDING' AND tb_store.id_area='${body.Brand}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [cash] = await connection.query(
            `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE id_area='${body.Brand}' AND bank='CASH' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [bca] = await connection.query(
            `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE id_area='${body.Brand}' AND bank='DEBIT' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

          var [qris] = await connection.query(
            `SELECT bank,id_invoice,SUM(total_payment) as qris FROM tb_payment WHERE id_area='${body.Brand}' AND bank='QRIS' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }


      } else {

        var [discount] = await connection.query(
          `SELECT *,SUM(diskon_item) as total_diskon FROM tb_order WHERE id_store='${body.area}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [top_10_reseller] = await connection.query(
          `SELECT tb_order.qty,SUM(qty) as total,tb_invoice.reseller FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_order.id_store='${body.area}' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir') AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_invoice.reseller ORDER BY total DESC LIMIT 10`
        );

        var [top_10_produk] = await connection.query(
          `SELECT *,SUM(qty) as qty FROM tb_order WHERE id_store='${body.area}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_produk ORDER BY qty DESC LIMIT 50`
        );

        var [total_qty] = await connection.query(
          `SELECT *,SUM(qty) as qty FROM tb_order WHERE id_store='${body.area}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [gross_sale] = await connection.query(
          `SELECT *,SUM(total_amount) as total_amount FROM tb_invoice WHERE customer='${body.area}' AND sales_channel='OFFLINE STORE' AND payment='PAID' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [gross_sale_online] = await connection.query(
          `SELECT *,SUM(total_amount) as total_amount FROM tb_invoice WHERE customer='${body.area}' AND sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        if (roles === "SUPER-ADMIN" || roles === "HEAD-AREA") {
          var [expense] = await connection.query(
            `SELECT *,SUM(total_amount) as total_amount FROM tb_expense WHERE id_store='${body.area}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [expense] = await connection.query(
            `SELECT *,SUM(total_amount) as total_amount FROM tb_expense WHERE id_store='${body.area}' AND id_store != 'ALL-STORE' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }

        var [transactions] = await connection.query(
          `SELECT * FROM tb_invoice WHERE customer='${body.area}' AND payment='PAID' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [produkgudangsold] = await connection.query(
          `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.customer='${body.area}' AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [produkextsold] = await connection.query(
          `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.customer='${body.area}' AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [costgudang] = await connection.query(
          `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.customer='${body.area}' AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [costluar] = await connection.query(
          `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.customer='${body.area}' AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [cancel_sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE customer='${body.area}' AND status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [paid] = await connection.query(
          `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.customer='${body.area}' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PAID' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [pending] = await connection.query(
          `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.customer='${body.area}' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PENDING' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [cash] = await connection.query(
          `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE id_store='${body.store}' AND bank='CASH' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [bca] = await connection.query(
          `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE id_store='${body.store}' AND bank='DEBIT' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );

        var [qris] = await connection.query(
          `SELECT bank,id_invoice,SUM(total_payment) as qris FROM tb_payment WHERE id_store='${body.store}' AND bank='QRIS' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }


    } else if ((Array.isArray(store) && store.includes("all_area")) ||
      body.store === "all_area") {

      var [discount] = await connection.query(
        `SELECT *,SUM(diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [top_10_reseller] = await connection.query(
        `SELECT SUM(qty) as total,reseller FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${output_area_ware}' AND sales_channel='OFFLINE STORE' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY reseller ORDER BY total DESC LIMIT 10`
      );

      var [top_10_produk] = await connection.query(
        `SELECT *,SUM(qty) as qty FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${output_area_ware}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_produk ORDER BY qty DESC LIMIT 50`
      );

      var [total_qty] = await connection.query(
        `SELECT tb_order.*,SUM(qty) as qty,tb_store.id_area FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [gross_sale] = await connection.query(
        `SELECT tb_invoice.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [gross_sale_online] = await connection.query(
        `SELECT tb_invoice.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      if (roles === "SUPER-ADMIN" || roles === "HEAD-AREA") {
        var [expense] = await connection.query(
          `SELECT tb_expense.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tb_store.id_area='${output_area_ware}' AND tb_expense.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [expense] = await connection.query(
          `SELECT tb_expense.*,SUM(total_amount) as total_amount,tb_store.id_area FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tb_expense.id_store != 'ALL-STORE' AND tb_store.id_area='${output_area_ware}' AND tb_expense.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }


      var [transactions] = await connection.query(
        `SELECT tb_store.*,tb_invoice.* FROM tb_store LEFT JOIN tb_invoice ON tb_store.id_store = tb_invoice.customer WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [produkgudangsold] = await connection.query(
        `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [produkextsold] = await connection.query(
        `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [costgudang] = await connection.query(
        `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [costluar] = await connection.query(
        `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [cancel_sales] = await connection.query(
        `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='CANCEL' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [paid] = await connection.query(
        `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PAID' AND tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [pending] = await connection.query(
        `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PENDING' AND tb_store.id_area='${output_area_ware}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [cash] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE id_area='${output_area_ware}' AND bank='CASH' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [bca] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE id_area='${output_area_ware}' AND bank='DEBIT' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [qris] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as qris FROM tb_payment WHERE id_area='${output_area_ware}' AND bank='QRIS' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );
    } else {

      var [discount] = await connection.query(
        `SELECT *,SUM(diskon_item) as total_diskon FROM tb_order WHERE ${storeFilter} AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [top_10_reseller] = await connection.query(
        `SELECT tb_order.qty,SUM(qty) as total,tb_invoice.reseller FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE ${storeOrderFilter} AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir') AND tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_invoice.reseller ORDER BY tb_order.qty DESC LIMIT 10`
      );

      var [top_10_produk] = await connection.query(
        `SELECT *,SUM(qty) as qty FROM tb_order WHERE ${storeFilter} AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_produk ORDER BY qty DESC LIMIT 50`
      );

      var [total_qty] = await connection.query(
        `SELECT *,SUM(qty) as qty FROM tb_order WHERE ${storeFilter} AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [gross_sale] = await connection.query(
        `SELECT *,SUM(total_amount) as total_amount FROM tb_invoice WHERE sales_channel='OFFLINE STORE' AND payment='PAID' AND status_pesanan != 'CANCEL' AND ${invoiceCustomerFilter} AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [gross_sale_online] = await connection.query(
        `SELECT *,SUM(total_amount) as total_amount FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND  payment='PAID' AND status_pesanan != 'CANCEL' AND ${invoiceCustomerFilter} AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      if (roles === "SUPER-ADMIN" || roles === "HEAD-AREA") {
        var [expense] = await connection.query(
          `SELECT *,SUM(total_amount) as total_amount FROM tb_expense WHERE ${storeFilter} AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [expense] = await connection.query(
          `SELECT *,SUM(total_amount) as total_amount FROM tb_expense WHERE ${storeFilter} AND id_store != 'ALL-STORE' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }

      var [transactions] = await connection.query(
        `SELECT * FROM tb_invoice WHERE payment='PAID' AND status_pesanan != 'CANCEL' AND ${invoiceCustomerFilter} AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [produkgudangsold] = await connection.query(
        `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND ${storeOrderFilter} AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [produkextsold] = await connection.query(
        `SELECT tb_order.*,SUM(qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND ${storeOrderFilter} AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [costgudang] = await connection.query(
        `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Gudang' AND ${storeOrderFilter} AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [costluar] = await connection.query(
        `SELECT tb_order.*,SUM(m_price*qty) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.payment='PAID' AND tb_invoice.status_pesanan != 'CANCEL' AND tb_order.source='Barang Luar' AND ${storeOrderFilter} AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [cancel_sales] = await connection.query(
        `SELECT * FROM tb_invoice WHERE status_pesanan != 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [paid] = await connection.query(
        `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PAID' AND ${storeOrderFilter} AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [pending] = await connection.query(
        `SELECT tb_order.*,SUM(subtotal) as total,tb_invoice.* FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_invoice.payment='PENDING' AND ${storeOrderFilter} AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [cash] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE ${paymentStoreFilter} AND bank='CASH' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [bca] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE ${paymentStoreFilter} AND bank='DEBIT' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );

      var [qris] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as qris FROM tb_payment WHERE ${paymentStoreFilter} AND bank='QRIS' AND tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );
    }

    var total_modal = parseInt(costgudang[0].total ? costgudang[0].total : 0) + parseInt(costluar[0].total ? costluar[0].total : 0);
    var marginawal = (parseInt(gross_sale[0].total_amount ? gross_sale[0].total_amount : 0) + parseInt(gross_sale_online[0].total_amount ? gross_sale_online[0].total_amount : 0)) - parseInt(total_modal ? total_modal : 0);
    var totalpembayaran = parseInt(cash[0].cash ? cash[0].cash : 0) + parseInt(bca[0].bca ? bca[0].bca : 0) + parseInt(qris[0].qris ? qris[0].qris : 0);
    var pendapatanbersih = (parseInt(gross_sale[0].total_amount ? gross_sale[0].total_amount : 0) + parseInt(gross_sale_online[0].total_amount ? gross_sale_online[0].total_amount : 0)) - parseInt(expense[0].total_amount ? expense[0].total_amount : 0) - parseInt(discount[0].total_diskon ? discount[0].total_diskon : 0);
    var total_profit = parseInt(pendapatanbersih ? pendapatanbersih : 0) - parseInt(total_modal ? total_modal : 0);
    var netsales = parseInt(pendapatanbersih);
    var profit_bersih = parseInt(total_profit ? total_profit : 0);

    await connection.commit();
    await connection.release();
    return {
      gross_sale: parseInt(gross_sale[0].total_amount ? gross_sale[0].total_amount : 0),
      gross_sale_online: gross_sale_online[0].total_amount ? gross_sale_online[0].total_amount : 0,
      expense: expense[0].total_amount ? expense[0].total_amount : 0,
      margin: (parseInt(gross_sale[0].total_amount) - parseInt(total_modal ? total_modal : 0)) - parseInt(expense[0].total_amount ? expense[0].total_amount : 0),
      transactions: transactions.length,
      produkgudangsold: produkgudangsold[0].total ? produkgudangsold[0].total : 0,
      produkextsold: produkextsold[0].total ? produkextsold[0].total : 0,
      total_gross_sales: (parseInt(gross_sale[0].total_amount ? gross_sale[0].total_amount : 0) + parseInt(gross_sale_online[0].total_amount ? gross_sale_online[0].total_amount : 0)),

      costgudang: costgudang[0].total ? costgudang[0].total : 0,
      costluar: costluar[0].total ? costluar[0].total : 0,
      pendapatanbersih: netsales,

      profit: profit_bersih,
      cancel_sales: cancel_sales.length,

      paid: paid[0].total ? paid[0].total : 0,
      pending: pending[0].total ? pending[0].total : 0,

      cash: cash[0].cash ? cash[0].cash : 0,
      bca: bca[0].bca ? bca[0].bca : 0,
      qris: qris[0].qris ? qris[0].qris : 0,
      totalpembayaran: totalpembayaran ? totalpembayaran : 0,
      hasil_qty: total_qty[0].qty ? total_qty[0].qty : 0,
      list_top_10_produk: top_10_produk,
      list_top_10_reseller: top_10_reseller,
      total_discount: discount[0].total_diskon ? discount[0].total_diskon : 0,
      today: tanggal_start,
    };


  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getstorekaryawan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    const datas = [];
    await connection.beginTransaction();

    if (body.role === "ALL") {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store`
      );
      datas.push({
        id_store: "-",
        store: "-",
      });
    } else if (body.role === "SUPER-ADMIN") {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store`
      );
      datas.push({
        id_store: "SUPER-ADMIN",
        store: "SUPER-ADMIN",
      });
    } else if (body.role === "HEAD-AREA") {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_warehouse GROUP BY id_area`
      );
      for (let x = 0; x < data_store.length; x++) {
        var [data_area] = await connection.query(
          `SELECT * FROM tb_area WHERE id_area='${data_store[x].id_area}' GROUP BY id_area,kota`
        );
        datas.push({
          id_store: data_area[0].id_area,
          store: data_area[0].kota,
        });
      }
    } else if (body.role === "HEAD-BRAND") {
      var [data_brand] = await connection.query(
        `SELECT * FROM tb_brand`
      );
      for (let x = 0; x < data_brand.length; x++) {
        datas.push({
          id_store: data_brand[x].id_brand,
          store: data_brand[x].brand,
        });
      }
    } else if (body.role === "HEAD-WAREHOUSE") {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse GROUP BY id_ware`
      );
      for (let x = 0; x < data_ware.length; x++) {
        datas.push({
          id_store: data_ware[x].id_ware,
          store: data_ware[x].warehouse,
        });
      }
    } else {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store`
      );
      for (let x = 0; x < data_store.length; x++) {
        datas.push({
          id_store: data_store[x].id_store,
          store: data_store[x].store,
        });
      }
    }
    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getstorekaryawanedit = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    const datas = [];
    await connection.beginTransaction();

    if (body.role === "SUPER-ADMIN") {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_roles WHERE role="SUPER-ADMIN"`
      );
      datas.push({
        id_store: data_store[0].role,
        store: data_store[0].role,
      });
    } else if (body.role === "HEAD-AREA") {
      if (body.edit_store === "") {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_warehouse GROUP BY id_area`
        );
        for (let x = 0; x < data_store.length; x++) {
          var [data_area] = await connection.query(
            `SELECT * FROM tb_area GROUP BY id_area,kota`
          );
          datas.push({
            id_store: data_area[x].id_area,
            store: data_area[x].kota,
          });
        }
      } else {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_warehouse WHERE id_area='${body.edit_store}' GROUP BY id_area`
        );
        for (let x = 0; x < data_store.length; x++) {
          var [data_area] = await connection.query(
            `SELECT * FROM tb_area WHERE id_area='${data_store[x].id_area}' GROUP BY id_area,kota`
          );
          datas.push({
            id_store: data_area[x].id_area,
            store: data_area[x].kota,
          });
        }
      }

    } else if (body.role === "HEAD-BRAND") {
      if (body.edit_store === "") {
        var [data_brand] = await connection.query(
          `SELECT * FROM tb_brand`
        );
        for (let x = 0; x < data_brand.length; x++) {
          datas.push({
            id_store: data_brand[x].id_brand,
            store: data_brand[x].brand,
          });
        }
      } else {
        var [data_brand] = await connection.query(
          `SELECT * FROM tb_brand WHERE id_brand='${body.edit_store}'`
        );
        for (let x = 0; x < data_brand.length; x++) {
          datas.push({
            id_store: data_brand[x].id_brand,
            store: data_brand[x].brand,
          });
        }
      }
    } else if (body.role === "HEAD-WAREHOUSE") {
      if (body.edit_store === "") {
        var [data_ware] = await connection.query(
          `SELECT * FROM tb_warehouse GROUP BY id_ware`
        );
        for (let x = 0; x < data_ware.length; x++) {
          datas.push({
            id_store: data_ware[x].id_ware,
            store: data_ware[x].warehouse,
          });
        }
      } else {
        var [data_ware] = await connection.query(
          `SELECT * FROM tb_warehouse WHERE id_ware='${body.edit_store}' GROUP BY id_ware`
        );
        for (let x = 0; x < data_ware.length; x++) {
          datas.push({
            id_store: data_ware[x].id_ware,
            store: data_ware[x].warehouse,
          });
        }
      }
    } else {
      if (body.edit_store === "") {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store`
        );
        for (let x = 0; x < data_store.length; x++) {
          datas.push({
            id_store: data_store[x].id_store,
            store: data_store[x].store,
          });
        }
      } else {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE id_store='${body.edit_store}'`
        );
        for (let x = 0; x < data_store.length; x++) {
          datas.push({
            id_store: data_store[x].id_store,
            store: data_store[x].store,
          });
        }
      }
    }

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const updatePassword = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_karyawan SET password='${body.password}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getarea = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_area] = await connection.query(
      `SELECT * FROM tb_area`
    );
    // console.log(data_area)
    await connection.commit();
    await connection.release();

    return data_area
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const editarea = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();
    var new_m_price = body.new_m_price.replace(/\D/g, "");
    var new_g_price = body.new_g_price.replace(/\D/g, "");
    var new_r_price = body.new_r_price.replace(/\D/g, "");
    var new_n_price = body.new_n_price.replace(/\D/g, "");
    await connection.query(
      `UPDATE tb_area SET m_price='${new_m_price}',g_price='${new_g_price}',r_price='${new_r_price}',n_price='${new_n_price}',updated_at='${tanggal}' WHERE id='${body.id}'`
    );

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getstoreexpense = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [data_role] = await connection.query(
      `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
    );

    if (body.role === 'SUPER-ADMIN') {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store`
      );
    } else if (body.role === 'HEAD-AREA') {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store WHERE id_area='${body.area} '`
      );
    } else {
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store WHERE id_store='${body.area}'`
      );
    }

    await connection.commit();
    await connection.release();
    return data_store;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getprintsales = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    const datas = [];
    await connection.beginTransaction();

    const [data_print] = await connection.query(
      // `SELECT *,SUM(subtotal) as subtotal FROM tb_order WHERE id_pesanan='${body.id_invoice}'`
      `SELECT tb_order.*,SUM(subtotal) as subtotal,tb_invoice.reseller,tb_invoice.total_amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_order.id_pesanan='${body.id_invoice}'`
    );
    for (let index = 0; index < data_print.length; index++) {
      var [data_store] = await connection.query(
        `SELECT store,address FROM tb_store WHERE id_store='${data_print[index].id_store}'`
      );

      var [cash] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE bank='CASH' AND id_invoice='${data_print[index].id_invoice}'`
      );

      var [bca] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE bank='DEBIT' AND id_invoice='${data_print[index].id_invoice}'`
      );

      datas.push({
        store: data_store[0].store,
        address: data_store[0].address,
        tanggal: data_print[index].tanggal_order,
        payment: "PAID",
        qty: "1",
        grandtotal: data_print[index].total_amount,
        bca: bca[0].bca,
        cash: cash[0].cash,
        mandiri: "0",
        qris: "0",
        timestamp: data_print[index].created_at,
        users: data_print[index].users,
        reseller: data_print[index].reseller,
        details: data_print,
      });
    }

    await connection.commit();
    await connection.release();
    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const login_on_enter = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();
    var username = body.username;
    var password = body.password;

    const [cek_divisi] = await connection.query(
      `SELECT tb_karyawan.*,tb_store.channel FROM tb_karyawan LEFT JOIN tb_store ON tb_karyawan.id_store = tb_store.id_store WHERE tb_karyawan.username='${username}' AND tb_karyawan.password='${password}'`
    );
    if (cek_divisi.length > 0) {
      if (cek_divisi[0].username === username && cek_divisi[0].password === password) {
        if (cek_divisi[0].status_account === 'NONACTIVE') {
          var hasil = 'NONACTIVE';
        } else {
          var hasil = cek_divisi;
        }
      } else {
        var hasil = 'Wrong';
      }
    } else {
      var hasil = 'Failed';
    }
    await connection.commit();
    await connection.release();

    return hasil;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getbrandarea = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    if (body.role === 'SUPER-ADMIN') {
      var [data_brand] = await connection.query(
        `SELECT * FROM tb_brand`
      );
    } else {
      const [data_roles] = await connection.query(
        `SELECT * FROM tb_karyawan WHERE id_store='${body.store}'`
      );
      var [data_brand] = await connection.query(
        `SELECT * FROM tb_brand WHERE brand LIKE '%${data_roles[0].name.split(' ')[1]}%'`
      );
    }

    await connection.commit();
    await connection.release();
    return data_brand;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getsupplierarea = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    var [data_brand] = await connection.query(
      `SELECT * FROM tb_supplier`
    );

    await connection.commit();
    await connection.release();
    return data_brand;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getso_brand = async (body) => {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    const [data_brand] = await connection.query(
      `SELECT id_area,brand FROM tb_warehouse GROUP BY brand`
    );

    await connection.commit();
    await connection.release();
    return data_brand;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const histories_recap = async (body) => {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    const { id_ware, query, brand, loadmorelimit, urutan } = body;
    const limit = 20;
    const offset = loadmorelimit || 0;

    // === Dynamic WHERE Clause ===
    let whereClauses = [];
    let queryParams = [];

    if (id_ware !== "all") {
      whereClauses.push("p.id_ware = ?");
      queryParams.push(id_ware);
    }

    if (query !== "all") {
      whereClauses.push("(p.id_produk LIKE ? OR p.produk LIKE ?)");
      queryParams.push(`%${query}%`, `%${query}%`);
    }

    if (brand !== "all") {
      whereClauses.push("p.id_brand = ?");
      queryParams.push(brand);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // STEP 1: Produk (fetch all matching, no LIMIT/OFFSET)
    const [produkRows] = await connection.query(`
      SELECT 
        p.id,
        p.id_produk,
        p.id_brand,
        p.id_ware,
        p.produk,
        p.users,
        w.id_area,
        w.warehouse
      FROM 
        tb_produk p
      LEFT JOIN 
        tb_warehouse w ON p.id_ware = w.id_ware
      ${whereSQL}
    `, queryParams);

    const [countResult] = await connection.query(`
      SELECT COUNT(*) AS total FROM tb_produk p
      ${whereSQL}
    `, queryParams);

    const total_products = countResult[0].total;

    // STEP 2: History dari tb_variationorder
    const [historyRows] = await connection.query(`
      SELECT 
        id_produk,
        id_ware,
        size,
        qty,
        tanggal AS tanggal_varor,
        tipe_order
      FROM 
        tb_variationorder
      WHERE
        tipe_order != "TRANSFER IN"
    `);
    // console.log("historyRows", historyRows);

    // const [historyMutasiTrasnfer] = await connection.query(`
    //   SELECT 
    //     id_produk,
    //     id_ware,
    //     size,
    //     qty,
    //     tanggal AS tanggal_varor,
    //     tipe_order
    //   FROM 
    //     tb_variationorder
    //   WHERE
    //     tipe_order = "TRANSFER IN"
    // `);
    // // console.log("historyMutasiTrasnfer", historyMutasiTrasnfer);

    // const historyakhir = [...historyRows, ...historyMutasiTrasnfer];

    // STEP 3: Data pesanan dari tb_order
    const [orderRows] = await connection.query(`
      SELECT 
      TRIM(id_produk) AS id_produk,
      TRIM(id_ware) AS id_ware,
      size,
      SUM(qty) AS total_qty_per_size
    FROM 
      tb_order
    GROUP BY 
      id_produk, id_ware, size
    `);

    // STEP 4: Data real dari tb_variation
    const [variationRows] = await connection.query(`
      SELECT 
        id_produk,
        id_ware,
        size,
        qty
      FROM 
        tb_variation
    `);

    // STEP 5: Data defect dari tb_mutasistock
    const [defectRows] = await connection.query(`
      SELECT 
        id_produk,
        id_ware,
        qty,
        mutasi
      FROM 
        tb_mutasistock
      WHERE 
        id_pesanan = 'DEFECT PRODUCT' AND mutasi = 'DEFECT OUT'
    `);

    const [transferRows] = await connection.query(`
      SELECT 
        id_produk,
        tb_mutasistock.id_ware,
        qty,
        mutasi,
        tb_warehouse.id_ware as id_ware_sup
      FROM 
        tb_mutasistock
      LEFT JOIN tb_warehouse ON tb_mutasistock.id_sup = tb_warehouse.warehouse
      WHERE 
        mutasi = 'TRANSFER IN'
    `);

    await connection.commit();
    await connection.release();

    // Gabungkan semua ke produkRows
    let result = produkRows.map(row => {
      const relatedHistory = historyRows.filter(
        h => h.id_produk === row.id_produk && h.id_ware === row.id_ware
      );

      const relatedOrders = orderRows.filter(
        o => o.id_produk === row.id_produk && o.id_ware === row.id_ware
      );

      const relatedVariations = variationRows.filter(
        v => v.id_produk === row.id_produk && v.id_ware === row.id_ware
      );

      const relatedDefects = defectRows.filter(
        d => d.id_produk === row.id_produk && d.id_ware === row.id_ware
      );

      const relatedTransfer = transferRows.filter(
        d => d.id_produk === row.id_produk && d.id_ware_sup === row.id_ware
      );

      const total_qty = relatedHistory.reduce((sum, h) => sum + Number(h.qty || 0), 0);
      const total_qty_terjual = relatedOrders.reduce(
        (sum, o) => sum + Number(o.total_qty_per_size || 0), 0
      );
      const total_qty_real = relatedVariations.reduce((sum, v) => sum + Number(v.qty || 0), 0);
      const total_qty_defect = relatedDefects.reduce((sum, d) => sum + Number(d.qty || 0), 0);
      const total_qty_transfer = relatedTransfer.reduce((sum, d) => sum + Number(d.qty || 0), 0);

      return {
        ...row,
        history: relatedHistory,
        total_qty,
        total_qty_terjual,
        total_qty_real,
        total_qty_defect,
        total_qty_transfer,
        orders: relatedOrders
      };
    });
    // Conditional sorting and pagination moved after data assembly
    if (urutan === "asc") {
      result.sort((a, b) => a.total_qty_real - b.total_qty_real);
    } else if (urutan === "desc") {
      result.sort((a, b) => b.total_qty_real - a.total_qty_real);
    } else {
      result.sort((a, b) => b.id - a.id); // default sort
    }

    // Hitung total nilai akumulasi tanpa pagination
    const total_sum = result.reduce(
      (acc, curr) => {
        acc.total_qty += curr.total_qty;
        acc.total_qty_terjual += curr.total_qty_terjual;
        acc.total_qty_real += curr.total_qty_real;
        acc.total_qty_defect += curr.total_qty_defect;
        return acc;
      },
      { total_qty: 0, total_qty_terjual: 0, total_qty_real: 0, total_qty_defect: 0 }
    );

    const paginatedResult = result.slice(offset, offset + limit);

    return {
      data: paginatedResult,
      total: total_products,
      show_page: Math.floor(offset / limit),
      total_pages: Math.ceil(total_products / limit),
      total_qty: total_sum.total_qty,
      total_qty_terjual: total_sum.total_qty_terjual,
      total_qty_real: total_sum.total_qty_real,
      total_qty_defect: total_sum.total_qty_defect
    };

  } catch (error) {
    await connection.release();
    throw error;
  }
};

const getHistoryDetail = async (body) => {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    const [historyDetail] = await connection.query(`
        SELECT 
        data.id_produk,
        data.id_ware,
        data.size,
        CASE 
          WHEN vo.tipe_order != 'TRANSFER IN' THEN COALESCE(vo.qty, 0)
          ELSE -1 * COALESCE(vo.qty, 0)
        END AS qty,
        CASE 
          WHEN vo.tipe_order = 'TRANSFER IN' THEN 'TRANSFER OUT'
          ELSE vo.tipe_order
        END AS tipe_order,
        vo.users,
        vo.tanggal AS tanggal_varor,
        (
          SELECT SUM(ms.qty)
          FROM tb_mutasistock ms
          WHERE 
            ms.id_produk = data.id_produk AND 
            ms.id_ware = data.id_ware AND 
            ms.size = data.size AND 
            ms.id_pesanan = 'DEFECT PRODUCT' AND
            ms.mutasi = 'DEFECT OUT'
        ) AS qty_defect,
        (
          SELECT SUM(v.qty)
          FROM tb_variation v
          WHERE v.id_produk = data.id_produk AND v.id_ware = data.id_ware AND v.size = data.size
        ) AS qty_real,
        (
          SELECT SUM(o.qty)
          FROM tb_order o
          WHERE o.id_produk = data.id_produk AND o.id_ware = data.id_ware AND o.size = data.size
        ) AS qty_terjual
    FROM (
        SELECT DISTINCT id_produk, id_ware, size FROM tb_variationorder
        UNION
        SELECT DISTINCT id_produk, id_ware, size FROM tb_mutasistock
        WHERE id_pesanan = 'DEFECT PRODUCT' AND mutasi = 'DEFECT OUT'
    ) AS data
    LEFT JOIN tb_variationorder vo 
     ON vo.id_produk = data.id_produk AND vo.size = data.size
      AND (
        (vo.tipe_order = 'TRANSFER IN' AND vo.id_sup = data.id_ware) OR
        (vo.tipe_order != 'TRANSFER IN' AND vo.id_ware = data.id_ware)
      )
    WHERE data.id_produk = ? AND data.id_ware = ?
    ORDER BY data.size ASC, tanggal_varor DESC
    `, [body.id_produk, body.id_ware]);
    // console.log("historyDetail", historyDetail);

    await connection.commit();
    await connection.release();
    return historyDetail;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getnotifikasi = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [datas] = await connection.query(
      `SELECT 
        id_notifikasi,
        id_produk,
        id_ware,
        produk,
        size,
        qty,
        status,
        status_baca,
        stok_min,
        created_at,
        updated_at
      FROM tb_notifikasi
      WHERE qty <= stok_min
      ORDER BY updated_at DESC`
    );

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getnotifikasi_stok = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const [datas] = await connection.query(
      `SELECT 
        id_notifikasi,
        id_produk,
        id_ware,
        produk,
        size,
        qty,
        status,
        status_baca,
        stok_min,
        created_at,
        updated_at
      FROM tb_notifikasi
      WHERE qty <= stok_min
      ORDER BY updated_at DESC`
    );

    const [datas2] = await connection.query(
      `SELECT min
      FROM tb_notifikasi_minimum`
    );

    await connection.commit();
    await connection.release();

    return {
      datas,
      datas2
    };
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const updatenotif = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_notifikasi SET status_baca = 'READ', updated_at = ? WHERE id_notifikasi = ?`,
      [tanggal, body.id_notifikasi]
    );

    await connection.commit();
    await connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    await connection.release();
    return { success: false, error };
  }
};

const updatenotifall = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const ids = body.ids;
    if (Array.isArray(ids) && ids.length > 0) {
      const placeholders = ids.map(() => '?').join(', ');
      await connection.query(
        `UPDATE tb_notifikasi SET status_baca = 'READ', updated_at = ? WHERE id_notifikasi IN (${placeholders})`,
        [tanggal, ...ids]
      );
    }

    await connection.commit();
    await connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    await connection.release();
    return { success: false, error };
  }
};

const updatestatus_stokmarket = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_notifikasi SET status = '${body.status}', updated_at = ? WHERE id_notifikasi = ?`,
      [tanggal, body.id_notifikasi]
    );

    await connection.commit();
    await connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    await connection.release();
    return { success: false, error };
  }
};

const stokmin_update = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_notifikasi SET stok_min = ?, updated_at = ? WHERE id_notifikasi = ?`,
      [body.stok_min, tanggal, body.id_notifikasi]
    );

    await connection.commit();
    await connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    await connection.release();
    return { success: false, error };
  }
};

const stokminimum_update_default = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tb_notifikasi_minimum SET min = ?`,
      [body.stok_min]
    );

    await connection.commit();
    connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    connection.release();
    return { success: false, error };
  }
};

const setstoknotif_manual = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    await connection.beginTransaction();
    // console.log("body manual", body);

    const { id_produk, id_ware, produk, stok_minimum } = body;
    const [lastNotif] = await connection.query(`SELECT MAX(id_notifikasi) as lastId FROM tb_notifikasi`);
    let currentNotifId = (lastNotif[0].lastId !== null ? lastNotif[0].lastId : 999) + 1;

    for (const item of stok_minimum) {
      const { size, qty, qty_new } = item;

      // Cek apakah data sudah ada
      const [check] = await connection.query(
        `SELECT id FROM tb_notifikasi WHERE id_produk = ? AND id_ware = ? AND size = ?`,
        [id_produk, id_ware, size]
      );

      if (check.length > 0) {
        // ✅ Jika data sudah ada → UPDATE stok_min & updated_at
        await connection.query(
          `UPDATE tb_notifikasi SET stok_min = ?, updated_at = ? 
           WHERE id_produk = ? AND id_ware = ? AND size = ?`,
          [qty_new, tanggal, id_produk, id_ware, size]
        );
      } else {
        // ✅ Jika belum ada → INSERT
        await connection.query(
          `INSERT INTO tb_notifikasi 
           (tanggal,id_notifikasi,id_produk, id_ware, produk, size, qty, status, status_baca, stok_min, created_at, updated_at) 
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [tanggal_skrg, currentNotifId++, id_produk, id_ware, produk, size, qty, null, null, qty_new, tanggal, tanggal]
        );
      }
    }

    await connection.commit();
    connection.release();
    return { success: true };
  } catch (error) {
    console.error("ERROR MANUAL INSERT:", error);
    await connection.rollback();
    connection.release();
    return { success: false, error };
  }
};

const massalUpdate_stokAlert = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  try {
    await connection.beginTransaction();

    const dataArray = Array.isArray(body.items) ? body.items : [];
    for (const { id_notifikasi, stok_min } of dataArray) {
      await connection.query(
        `UPDATE tb_notifikasi SET stok_min = ? WHERE id_notifikasi = ?`,
        [stok_min, id_notifikasi]
      );
    }

    await connection.commit();
    connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    connection.release();
    return { success: false, error };
  }
};

const massalUpdate_status_stokmarket = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");

  try {
    await connection.beginTransaction();

    const dataArray = Array.isArray(body.items) ? body.items : [];

    for (const { id_notifikasi, status } of dataArray) {
      await connection.query(
        `UPDATE tb_notifikasi SET status = ? WHERE id_notifikasi = ?`,
        [status, id_notifikasi]
      );
    }

    await connection.commit();
    connection.release();

    return { success: true };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    connection.release();
    return { success: false, error };
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
  // getArea,
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
  getnotifikasi_stok,
  updatenotif,
  updatenotifall,
  updatestatus_stokmarket,
  stokmin_update,
  stokminimum_update_default,
  setstoknotif_manual,
  massalUpdate_stokAlert,
  massalUpdate_status_stokmarket,
};