const dbPool = require("../config/database");

const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
const tanggalinput = date.format(new Date(), "YYYYMMDD");
const tahun = date.format(new Date(), "YY");
const { generateFromEmail } = require("unique-username-generator");

const getStore_salesretail = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    await connection.beginTransaction();

    const [data_role] = await connection.query(
      `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
    );
    console.log(body);
    if (body.Brand != "" || body.Brand != null) {

      if (body.role === 'SUPER-ADMIN') {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE channel='OFFLINE STORE'`
        );
      } else if (body.role === 'HEAD-AREA') {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE id_area='${body.store}' AND channel='OFFLINE STORE'`
        );
      } else if (body.role === 'HEAD-WAREHOUSE') {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE id_ware='${body.store}' AND channel='OFFLINE STORE'`
        );
      } else {
        var [list_data_role] = await connection.query(
          `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.store}'`
        );
        for (let x = 0; x < list_data_role.length; x++) {
          var [data_store] = await connection.query(
            `SELECT * FROM tb_store WHERE id_store='${list_data_role[x].id_store}' AND channel='OFFLINE STORE' GROUP BY id_store`
          );
        }
      }
    } else {
      if (body.role === 'SUPER-ADMIN') {
        if (body.Brand === "all") {
          var [data_store] = await connection.query(
            `SELECT * FROM tb_store WHERE channel='OFFLINE STORE'`
          );
        } else {
          var [data_store] = await connection.query(
            `SELECT * FROM tb_store WHERE channel='OFFLINE STORE' AND id_area='${body.Brand}'`
          );
        }
      } else if (body.role === 'HEAD-AREA') {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE id_area='${body.store}' AND channel='OFFLINE STORE'`
        );
      } else if (body.role === 'HEAD-WAREHOUSE') {
        var [data_store] = await connection.query(
          `SELECT * FROM tb_store WHERE id_ware='${body.store}' AND channel='OFFLINE STORE'`
        );
      } else {
        var [list_data_role] = await connection.query(
          `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.store}'`
        );
        for (let x = 0; x < list_data_role.length; x++) {
          var [data_store] = await connection.query(
            `SELECT * FROM tb_store WHERE id_store='${list_data_role[x].id_store}' AND channel='OFFLINE STORE' GROUP BY id_store`
          );
        }
      }
    }

    var [data_brand] = await connection.query(
      `SELECT brand,id_area FROM tb_warehouse GROUP BY brand`
    );
    console.log(data_store);
    await connection.commit();
    await connection.release();

    return {
      data_store,
      data_brand
    };

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getKasir = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  try {
    await connection.beginTransaction();
    const [data_kasir] = await connection.query(
      `SELECT * FROM tb_karyawan WHERE status_account='ACTIVE' AND id_store='${body.idstore}' AND name='${body.users}'`
    );

    await connection.commit();
    await connection.release();

    return data_kasir;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getResellersales = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  try {
    await connection.beginTransaction();

    const [data_kasir] = await connection.query(`SELECT * FROM tb_reseller`);

    await connection.commit();
    await connection.release();

    return data_kasir;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const productsSalesretail = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  const datas = [];

  if (body.role === "HEAD-AREA" || body.role === "HEAD-WAREHOUSE") {
    var area_ware = body.area.split('-')[0];
    if (area_ware == "WARE") {
      var [data_get_ware] = await connection.query(
        `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_area`
      );
      var output_area_ware = data_get_ware[0].id_area
    } else if (area_ware == "AREA") {
      var output_area_ware = body.area
    }
  }

  if (body.role === "CASHIER") {
    var [data_awal_store] = await connection.query(
      `SELECT id_ware FROM tb_store WHERE id_store='${body.area}'`
    );
  }

  if (body.role === "SUPER-ADMIN") {
    if (body.query != "all") {
      var [query_produk] = await connection.query(
        `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE (tb_produk.id_produk LIKE '%${body.query}%' OR tb_produk.produk LIKE '%${body.query}%') GROUP BY tb_produk.id_produk ORDER BY tb_produk.id`
      );
      var [query_nota] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_notabarang WHERE produk LIKE '%${body.query}%'  AND status_pesanan != "SEDANG DIKIRIM" AND status_pesanan != "SELESAI" GROUP BY id_nota,produk,size,id_sup ORDER BY id DESC`
      );
    } else {
      var [query_produk] = await connection.query(
        `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware GROUP BY tb_produk.id_produk ORDER BY tb_produk.id DESC LIMIT 24`
      );
      var [query_nota] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_notabarang WHERE status_pesanan != "SEDANG DIKIRIM" AND status_pesanan != "SELESAI" GROUP BY id_nota,produk,size,id_sup ORDER BY id DESC`
      );
    }
  } else if (body.role === "HEAD-AREA" || body.role === "HEAD-WAREHOUSE") {
    if (body.query != "all") {
      var [query_produk] = await connection.query(
        `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE (tb_produk.id_produk LIKE '%${body.query}%' OR tb_produk.produk LIKE '%${body.query}%') AND tb_warehouse.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk ORDER BY tb_produk.id`
      );
      var [query_nota] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_notabarang WHERE produk LIKE '%${body.query}%'  AND status_pesanan != "SEDANG DIKIRIM" AND status_pesanan != "SELESAI" GROUP BY id_nota,produk,size,id_sup ORDER BY id DESC`
      );
    } else {
      var [query_produk] = await connection.query(
        `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk ORDER BY tb_produk.id DESC LIMIT 24`
      );
      var [query_nota] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_notabarang WHERE status_pesanan != "SEDANG DIKIRIM" AND status_pesanan != "SELESAI" GROUP BY id_nota,produk,size,id_sup ORDER BY id DESC`
      );
    }
  } else {
    if (body.query != "all") {
      var [query_produk] = await connection.query(
        `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE (tb_produk.id_produk LIKE '%${body.query}%' OR tb_produk.produk LIKE '%${body.query}%') AND tb_warehouse.id_ware='${data_awal_store[0].id_ware}' GROUP BY tb_produk.id_produk ORDER BY tb_produk.id`
      );
      var [query_nota] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_notabarang WHERE produk LIKE '%${body.query}%'  AND status_pesanan != "SEDANG DIKIRIM" AND status_pesanan != "SELESAI" GROUP BY id_nota,produk,size,id_sup ORDER BY id DESC`
      );
    } else {
      var [query_produk] = await connection.query(
        `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_awal_store[0].id_ware}' GROUP BY tb_produk.id_produk ORDER BY tb_produk.id DESC LIMIT 24`
      );
      var [query_nota] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_notabarang WHERE status_pesanan != "SEDANG DIKIRIM" AND status_pesanan != "SELESAI" GROUP BY id_nota,produk,size,id_sup ORDER BY id DESC`
      );
    }
  }

  try {
    await connection.beginTransaction();

    for (let i = 0; i < query_produk.length; i++) {
      var [variation_sales] = await connection.query(
        `SELECT *, SUM(qty) as qty FROM tb_variation WHERE id_produk='${query_produk[i].id_produk}' GROUP BY size,id_produk`
      );

      var [variationcount] = await connection.query(
        `SELECT id_produk, SUM(qty) as total_qty, id_ware FROM tb_variation WHERE id_produk='${query_produk[i].id_produk}' GROUP BY id_produk,id_ware`
      );

      datas.push({
        id: query_produk[i].id,
        id_produk: query_produk[i].id_produk,
        id_ware: query_produk[i].id_ware,
        id_brand: query_produk[i].id_brand,
        id_category: query_produk[i].id_category,
        tanggal_upload: query_produk[i].tanggal_upload,
        produk: query_produk[i].produk,
        deskripsi: query_produk[i].deskripsi,
        quality: query_produk[i].quality,
        n_price: query_produk[i].n_price,
        r_price: query_produk[i].r_price,
        g_price: query_produk[i].g_price,
        img: query_produk[i].img,
        users: query_produk[i].users,
        variation_sales: variation_sales,
        variationcount: variationcount,
        stok: "Internal",
      });
    }

    // for (let index = 0; index < query_nota.length; index++) {

    //     datas.push({
    //         id: query_nota[index].id,
    //         id_produk: query_nota[index].id_nota,
    //         id_ware: query_nota[index].id_ware,
    //         id_brand: query_nota[index].id_brand,
    //         id_category: query_nota[index].id_category,
    //         tanggal_upload: query_nota[index].tanggal_upload,
    //         produk: query_nota[index].produk,
    //         deskripsi: query_nota[index].deskripsi,
    //         quality: query_nota[index].quality,
    //         n_price: query_nota[index].m_price,
    //         r_price: query_nota[index].m_price,
    //         g_price: query_nota[index].m_price,
    //         img: 'box.png',
    //         users: query_nota[index].users,
    //         variation_sales: [{
    //             size: query_nota[index].size,
    //             qty: query_nota[index].qty,
    //         }],
    //         variationcount: 1,
    //         stok: 'External',
    //     });
    // }
    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const inputSalesretail = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    const [cek_mutasi] = await connection.query(
      `SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`
    );
    if (cek_mutasi[0].id_mutasi === null) {
      var id_mutasi = "MT-" + "00000001";
    } else {
      const get_last2 = cek_mutasi[0].id_mutasi;
      const data_2 = get_last2.toString().slice(-8);
      const hasil = parseInt(data_2) + 1;
      var id_mutasi = "MT-" + String(hasil).padStart(8, "0");
    }

    const [cek_invoice] = await connection.query(
      `SELECT MAX(id_invoice) as id_invoice FROM tb_invoice`
    );
    if (cek_invoice[0].id_invoice === null) {
      var id_invoice = "INV-" + "000000001";
    } else {
      const get_last2 = cek_invoice[0].id_invoice;
      const data_2 = get_last2.toString().slice(-9);
      const hasil = parseInt(data_2) + 1;
      var id_invoice = "INV-" + String(hasil).padStart(9, "0");
    }

    const [get_store] = await connection.query(
      `SELECT * FROM tb_store WHERE id_store='${body.id_store}'`
    );
    var data = body.data;

    await connection.beginTransaction();

    for (let index = 0; index < data.length; index++) {

      if (body.status_display === 'display_true') {
        await connection.query(
          `DELETE FROM displays WHERE id_produk='${data[index].idproduk}' AND id_ware='${data[index].id_ware}'`
        );
      }

      var [get_produk] = await connection.query(
        `SELECT * FROM tb_produk WHERE id_produk='${data[index].idproduk}' AND id_ware='${data[index].id_ware}'`
      );

      var [get_var] = await connection.query(
        `SELECT * FROM tb_variation WHERE id_produk='${data[index].idproduk}' AND id_ware='${data[index].id_ware}' AND size='${data[index].size}' AND qty > '0' ORDER BY id ASC`
      );

      var qty_sales = data[index].qty;

      for (let b = 0; b < get_var.length; b++) {
        var get_qty = get_var[b].qty;
        var qty_baru = parseInt(get_qty) - parseInt(qty_sales);


        var [get_modal] = await connection.query(
          `SELECT m_price FROM tb_purchaseorder WHERE idpo='${get_var[b].idpo}' AND id_produk='${data[index].idproduk}'`
        );

        var [get_modal_area] = await connection.query(
          `SELECT tb_area.m_price FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data[index].id_ware}'`
        );

        if (qty_baru >= 0) {
          if (data[index].diskon_item === "") {
            var subtotal =
              parseInt(data[index].harga_jual) * parseInt(qty_sales);
          } else {
            var subtotal =
              parseInt(data[index].harga_jual) * parseInt(qty_sales) -
              parseInt(data[index].diskon_item) * parseInt(qty_sales);
          }

          await connection.query(
            `INSERT INTO tb_order
                            (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
                            VALUES ('${body.tanggal}','${id_invoice}','${body.id_store}','${data[index].idproduk}','Barang Gudang','${data[index].img}','${data[index].produk}','${get_produk[0].id_brand}','${data[index].id_ware}','${get_var[b].idpo}','${get_produk[0].quality}','${data[index].size}','${qty_sales}','${parseInt(get_modal[0].m_price) + parseInt(get_modal_area[0].m_price)}','${data[index].harga_jual}','${parseInt(data[index].diskon_item) * parseInt(qty_sales)}','${subtotal}','${body.kasir}','${tanggal}','${tanggal}')`
          );

          await connection.query(
            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${body.tanggal}','${id_invoice}','${data[index].id_ware}','${body.id_store}','${data[index].idproduk}','${data[index].produk}','${get_var[b].idpo}','${data[index].size}','${qty_sales}','Barang Gudang','-','SALES RETAIL','${body.kasir}','${tanggal}','${tanggal}')`
          );

          await connection.query(
            `UPDATE tb_variation SET qty='${qty_baru}',updated_at='${tanggal}' WHERE id_produk='${data[index].idproduk}' AND id_ware='${data[index].id_ware}' AND size='${data[index].size}' AND idpo='${get_var[b].idpo}'`
          );
          break;
        } else {
          if (qty_baru < 0) {
            var qty_sisa = 0;
          }
          if (data[index].diskon_item === "") {
            var subtotal =
              parseInt(data[index].harga_jual) * parseInt(get_var[b].qty);
          } else {
            var subtotal =
              parseInt(data[index].harga_jual) * parseInt(get_var[b].qty) -
              parseInt(data[index].diskon_item) * parseInt(get_var[b].qty);
          }

          await connection.query(
            `INSERT INTO tb_order
                            (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
                            VALUES ('${body.tanggal}','${id_invoice}','${body.id_store}','${data[index].idproduk}','Barang Gudang','${data[index].img}','${data[index].produk}','${get_produk[0].id_brand}','${data[index].id_ware}','${get_var[b].idpo}','${get_produk[0].quality}','${data[index].size}','${get_var[b].qty}','${parseInt(get_modal[0].m_price) + parseInt(get_modal_area[0].m_price)}','${data[index].harga_jual}','${parseInt(data[index].diskon_item) * parseInt(qty_sales)}','${subtotal}','${body.kasir}','${tanggal}','${tanggal}')`
          );

          await connection.query(
            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${body.tanggal}','${id_invoice}','${data[index].id_ware}','${body.id_store}','${data[index].idproduk}','${data[index].produk}','${get_var[b].idpo}','${data[index].size}','${get_var[b].qty}','Barang Gudang','-','SALES RETAIL','${body.kasir}','${tanggal}','${tanggal}')`
          );

          await connection.query(
            `UPDATE tb_variation SET qty='${qty_sisa}',updated_at='${tanggal}' WHERE id_produk='${data[index].idproduk}' AND id_ware='${data[index].id_ware}' AND size='${data[index].size}' AND idpo='${get_var[b].idpo}'`
          );

          qty_sales = parseInt(qty_sales) - parseInt(get_var[b].qty);
        }
      }
    }

    if (body.customer != "Retail") {
      await connection.query(
        `INSERT INTO tb_invoice
                (tanggal_order, id_invoice, id_pesanan, customer, type_customer, sales_channel, amount, diskon_nota, biaya_lainnya, total_amount, selisih, status_pesanan, payment, reseller, users, created_at, updated_at)
                VALUES ('${body.tanggal}','${id_invoice}','${id_invoice}','${get_store[0].id_store}','${body.customer}','${get_store[0].channel}','${body.total_amount}','${body.diskon_nota}','${body.biayalain}','${body.total_amount}','0','SELESAI','${body.payment_method}','${body.reseller}','${body.kasir}','${tanggal}','${tanggal}')`
      );
    } else {
      await connection.query(
        `INSERT INTO tb_invoice
                (tanggal_order, id_invoice, id_pesanan, customer, type_customer, sales_channel, amount, diskon_nota, biaya_lainnya, total_amount, selisih, status_pesanan, payment, reseller, users, created_at, updated_at)
                VALUES ('${body.tanggal}','${id_invoice}','${id_invoice}','${get_store[0].id_store}','${body.customer}','${get_store[0].channel}','${body.total_amount}','${body.diskon_nota}','${body.biayalain}','${body.total_amount}','0','SELESAI','${body.payment_method}','-','${body.kasir}','${tanggal}','${tanggal}')`
      );
    }

    if (body.payment_method === "PAID") {
      if (body.cash != 0) {
        await connection.query(
          `INSERT INTO tb_payment
                (tanggal_pembayaran, id_invoice, total_payment, metode_payment, bank, id_store, id_area, deskripsi, created_at, updated_at)
                VALUES ('${tanggal_skrg}','${id_invoice}','${body.cash}','CASH','CASH','${get_store[0].id_store}','${get_store[0].id_area}','-','${tanggal}','${tanggal}')`
        );
      }

      if (body.bca != 0) {
        await connection.query(
          `INSERT INTO tb_payment
                  (tanggal_pembayaran, id_invoice, total_payment, metode_payment, bank, id_store, id_area, deskripsi, created_at, updated_at)
                  VALUES ('${tanggal_skrg}','${id_invoice}','${body.bca}','DEBIT','DEBIT','${get_store[0].id_store}','${get_store[0].id_area}','-','${tanggal}','${tanggal}')`
        );
      }

      if (body.qris != 0) {
        await connection.query(
          `INSERT INTO tb_payment
                  (tanggal_pembayaran, id_invoice, total_payment, metode_payment, bank, id_store, id_area, deskripsi, created_at, updated_at)
                  VALUES ('${tanggal_skrg}','${id_invoice}','${body.qris}','TRANSFER','QRIS','${get_store[0].id_store}','${get_store[0].id_area}','-','${tanggal}','${tanggal}')`
        );
      }
    }

    const datas = [];

    const [print_store] = await connection.query(
      `SELECT tb_order.id_store,tb_store.* FROM tb_order LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_order.id_pesanan='${id_invoice}'`
    );

    const [print_detail] = await connection.query(
      `SELECT tb_invoice.*,SUM(subtotal) as subtotal,tb_order.*,SUM(qty) as qty FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan WHERE tb_invoice.id_pesanan='${id_invoice}' GROUP BY tb_invoice.id_pesanan,tb_order.id_produk,tb_order.size`
    );

    const [print_amount] = await connection.query(
      `SELECT *,SUM(qty) as qty FROM tb_order WHERE id_pesanan='${id_invoice}'`
    );

    const [print_grandtotal] = await connection.query(
      `SELECT *,SUM(qty) as qty FROM tb_order WHERE id_pesanan='${id_invoice}' GROUP BY id_pesanan`
    );

    datas.push({
      print_detail: print_detail,
      print_amount: print_amount,
      print_grandtotal: print_grandtotal,
      print_store: print_store,
      id_invoice,
      // timestamp: tanggal,
    });

    await connection.commit();
    await connection.release();

    return datas;

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const orderresellerpaid = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  var status = body.status_pesanan;
  var query = body.query;
  var store = body.store;
  var tipe_sales = body.tipe_sales;
  var brand = body.Brand;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }

  const datas = [];

  if (body.store === "all_area") {
    var area_ware = body.area.split('-')[0];
    if (area_ware == "WARE") {
      var [data_get_ware] = await connection.query(
        `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_area`
      );
      var output_area_ware = data_get_ware[0].id_area
    } else if (area_ware == "AREA") {
      var output_area_ware = body.area
    }
  }

  console.log("body", body);

  try {
    await connection.beginTransaction();

    if (store === "all" && brand === "all") {

      if (query === "all") {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT id,tanggal_order,type_customer,created_at,id_pesanan,users FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND status_pesanan='${status}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan='${status}'  AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [get_orders] = await connection.query(
            `SELECT id,tanggal_order,type_customer,created_at,id_pesanan,users FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND type_customer='${tipe_sales}' AND status_pesanan='${status}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.status_pesanan='${status}'  AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.status_pesanan='${status}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        } else {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.status_pesanan='${status}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        }
      }
    } else if (store === "all_area") {

      if (query === "all") {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_store.id_area='${output_area_ware}' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.m_price*tb_order.qty) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail')  AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.type_customer='${tipe_sales}' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}'  AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_store.id_area='${output_area_ware}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_store.id_area='${output_area_ware}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_store.id_area='${output_area_ware}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        } else {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}'  AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.type_customer='${tipe_sales}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${output_area_ware}' AND tb_invoice.type_customer='${tipe_sales}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        }
      }
    } else if (brand != "all") {

      if (query === "all") {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_store.id_area='${brand}' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.m_price*tb_order.qty) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail')  AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

        } else {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.type_customer='${tipe_sales}' AND tb_store.id_area='${brand}' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_store.id_area='${brand}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        } else {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_store.id_area='${brand}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}'  AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_invoice.type_customer='${tipe_sales}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${brand}' AND tb_invoice.type_customer='${tipe_sales}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        }
      }
    } else if (store != "all") {

      if (query === "all") {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT id,tanggal_order,type_customer,created_at,id_pesanan,users FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND customer='${store}' AND status_pesanan='${status}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan='${status}'  AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );

        } else {
          var [get_orders] = await connection.query(
            `SELECT id,tanggal_order,type_customer,created_at,id_pesanan,users FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND customer='${store}' AND tb_invoice.type_customer='${tipe_sales}' AND status_pesanan='${status}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan='${status}'  AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) as bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipe_sales === "all") {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan='${status}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        } else {
          var [get_orders] = await connection.query(
            `SELECT tb_invoice.id,tb_invoice.tanggal_order,tb_invoice.type_customer,tb_invoice.created_at,tb_invoice.id_pesanan,tb_invoice.users FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan='${status}' GROUP BY tb_invoice.id_pesanan`
          );
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet,SUM(tb_order.diskon_item) as total_diskon FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.type_customer='${tipe_sales}' AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan='${status}'`
          );
          var [payment_cash] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS cash FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='CASH' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
          var [payment_bca] = await connection.query(
            `SELECT tb_payment.bank,tb_payment.id_invoice,SUM(tb_payment.total_payment) AS bca FROM tb_payment LEFT JOIN tb_invoice ON tb_payment.id_invoice = tb_invoice.id_invoice LEFT JOIN (SELECT id_pesanan, produk, id_produk, size FROM tb_order GROUP BY id_pesanan) AS tb_order ON tb_order.id_pesanan = tb_invoice.id_invoice WHERE tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipe_sales}' AND tb_payment.bank='DEBIT' AND tb_payment.tanggal_pembayaran BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_payment.bank, tb_payment.id_invoice`
          );
        }
      }
    }
    // order

    for (let i = 0; i < get_orders.length; i++) {
      var [details_order] = await connection.query(
        `SELECT tb_order.id,tb_order.id_pesanan,tb_order.id_produk,tb_order.source,tb_order.img,tb_order.id_ware,tb_order.idpo,tb_order.produk,tb_order.size,tb_order.qty,tb_order.m_price,tb_order.selling_price,tb_order.diskon_item,tb_order.subtotal,SUM(tb_order.qty) as qty,SUM(tb_order.m_price*tb_order.qty) as total_m_price,SUM(tb_order.subtotal) as subtotal,SUM(tb_order.m_price*tb_order.qty) as modalsatuan,tb_store.store,tb_store.address,tb_invoice.selisih,tb_invoice.reseller FROM tb_order LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_store.id_store = tb_order.id_store WHERE tb_invoice.id_pesanan='${get_orders[i].id_pesanan}' GROUP BY tb_order.size,tb_order.id_produk,tb_invoice.id_pesanan`
      );
      var [totaltotal] = await connection.query(
        `SELECT SUM(tb_order.m_price*tb_order.qty) as modalsatuan,SUM(tb_order.subtotal) as subtotalakhir,SUM(tb_invoice.total_amount) as totalakhir,SUM(tb_order.diskon_item) as total_diskon,SUM(tb_order.qty) as hasilqty,tb_invoice.selisih FROM tb_order LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = tb_order.id_pesanan WHERE tb_invoice.id_pesanan='${get_orders[i].id_pesanan}' GROUP BY tb_invoice.id_pesanan`
      );
      var [total_payment] = await connection.query(
        `SELECT amount FROM tb_invoice WHERE id_pesanan='${get_orders[i].id_pesanan}'`
      );

      var [cash] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as cash FROM tb_payment WHERE bank='CASH' AND id_invoice='${get_orders[i].id_pesanan}'`
      );
      var [bca] = await connection.query(
        `SELECT bank,id_invoice,SUM(total_payment) as bca FROM tb_payment WHERE bank='DEBIT' AND id_invoice='${get_orders[i].id_pesanan}'`
      );
      var [data_payment] = await connection.query(
        `SELECT *,SUM(total_payment) as total_payment FROM tb_payment WHERE id_invoice='${get_orders[i].id_pesanan}' GROUP BY bank`
      );

      if (i === 1) {
        var data_tanggal_awal = get_orders[i].tanggal_order;
      }

      datas.push({
        id: get_orders[i].id,
        tanggal_order: get_orders[i].tanggal_order,
        type_customer: get_orders[i].type_customer,
        created_at: get_orders[i].created_at,
        id_pesanan: get_orders[i].id_pesanan,
        users: get_orders[i].users,
        modalakhir: totaltotal[0].modalsatuan,
        subtotalakhir: totaltotal[0].subtotalakhir,
        subtotalstandar: total_payment[0].amount,
        qty: totaltotal[0].hasilqty,
        store: details_order[0].store,
        selisih: details_order[0].selisih,
        address: details_order[0].address,
        reseller: details_order[0].reseller,
        details_order: details_order,
        total_diskon: totaltotal[0].total_diskon,
        bca: bca[0].bca ? bca[0].bca : 0,
        cash: cash[0].cash ? cash[0].cash : 0,
        data_payment: data_payment,
      });
    }

    var total_bca = 0;
    for (let cek_bca = 0; cek_bca < payment_bca.length; cek_bca++) {
      total_bca = parseInt(total_bca) + parseInt(payment_bca[cek_bca].bca);
    }
    var total_cash = 0;
    for (let cek_cash = 0; cek_cash < payment_cash.length; cek_cash++) {
      total_cash = parseInt(total_cash) + parseInt(payment_cash[cek_cash].cash);
    }
    // end order
    if (body.query === "all") {
      var kirim_tanggal_start = tanggal_start;
    } else {
      var kirim_tanggal_start = data_tanggal_awal;
    }

    await connection.commit();
    await connection.release();

    return {
      datas,
      selesai: get_orders.length,
      sales: get_orders.length,
      qty_sales: Math.round(header[0].totalqty ? header[0].totalqty : 0),
      omzet: Math.round(header[0].omzet ? header[0].omzet : 0),
      modal: Math.round(header[0].total_modal ? header[0].total_modal : 0),
      total_diskon: Math.round(header[0].total_diskon ? header[0].total_diskon : 0),
      net_sales: parseInt(header[0].omzet ? header[0].omzet : 0) - parseInt(header[0].total_diskon ? header[0].total_diskon : 0),
      today: kirim_tanggal_start,
      payment_cash: total_cash ? total_cash : 0,
      payment_bca: total_bca ? total_bca : 0,
    };

  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const orderCountresellerpaid = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var store = body.store;
  var query = body.query;
  var tipesales = body.tipe_sales;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }
  const datas = [];

  try {
    await connection.beginTransaction();

    if (store === "all") {
      if (query === "all") {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SELESAI' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'CANCEL' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        }
      } else {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      }
    } else if (store === "all_area") {
      if (query === "all") {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan = 'SELESAI' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan = 'CANCEL' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND type_customer='${tipesales}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan = 'SELESAI' AND type_customer='${tipesales}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND tb_invoice.status_pesanan = 'CANCEL' AND type_customer='${tipesales}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      } else {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      }
    } else {
      if (query === "all") {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SELESAI' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'CANCEL' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'SELESAI' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE (type_customer='Reseller' OR type_customer='Grosir' OR type_customer='Retail') AND payment='PAID' AND status_pesanan = 'CANCEL' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        }
      } else {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE (tb_invoice.type_customer='Reseller' OR tb_invoice.type_customer='Grosir' OR tb_invoice.type_customer='Retail') AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      }
    }

    datas.push({
      dikirim: dikirim.length,
      selesai: selesai.length,
      cancel: cancel.length,
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getHeaderpesananresellerpaid = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var status = body.status_pesanan;
  var store = body.store;
  var query = body.query;
  var tipesales = body.tipe_sales;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }

  const datas = [];
  try {
    await connection.beginTransaction();
    if (store === "all") {
      if (query === "all") {
        if (tipesales === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [sales] = await connection.query(
            `SELECT id_pesanan FROM tb_invoice WHERE sales_channel='OFFLINE STORE' AND status_pesanan='${status}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [sales] = await connection.query(
            `SELECT id_pesanan FROM tb_invoice WHERE sales_channel='OFFLINE STORE' AND status_pesanan='${status}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipesales === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%')`
          );
          var [sales] = await connection.query(
            `SELECT * FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%')`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.type_customer='${tipesales}'`
          );
          var [sales] = await connection.query(
            `SELECT * FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.type_customer='${tipesales}'`
          );
        }
      }
    } else if (store === "all_area") {
      if (query === "all") {
        if (tipesales === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [sales] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [sales] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipesales === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%')`
          );
          var [sales] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%')`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.type_customer='${tipesales}'`
          );
          var [sales] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.type_customer='${tipesales}'`
          );
        }
      }
    } else {
      if (query === "all") {
        if (tipesales === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [sales] = await connection.query(
            `SELECT id_pesanan FROM tb_invoice WHERE sales_channel='OFFLINE STORE' AND status_pesanan='${status}' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
          var [sales] = await connection.query(
            `SELECT id_pesanan FROM tb_invoice WHERE sales_channel='OFFLINE STORE' AND status_pesanan='${status}' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (tipesales === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%')`
          );
          var [sales] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%')`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_pesanan) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_order.subtotal) as omzet FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.type_customer='${tipesales}'`
          );
          var [sales] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel='OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.type_customer='${tipesales}'`
          );
        }
      }
    }

    datas.push({
      sales: sales.length,
      qty_sales: Math.round(header[0].totalqty ? header[0].totalqty : 0),
      omzet: Math.round(header[0].omzet ? header[0].omzet : 0) + Math.round(header[0].total_diskon ? header[0].total_diskon : 0),
      modal: Math.round(header[0].total_modal ? header[0].total_modal : 0),
      gross_sales: header[0].omzet ? header[0].omzet : 0,
      total_diskon: header[0].total_diskon ? header[0].total_diskon : 0,
      net_sales: parseInt(header[0].omzet ? header[0].omzet : 0) - parseInt(header[0].total_modal ? header[0].total_modal : 0),
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};
// END RESELLER PAID
//
//
// RESELLER PENDING
const orderresellerpending = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  var status = body.status_pesanan;
  var query = body.query;
  var store = body.store;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }

  const datas = [];

  if (store === "all") {
    if (query === "all") {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND status_pesanan='${status}' AND payment='PENDING' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    } else {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PENDING' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    }
  } else {
    if (query === "all") {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND status_pesanan='${status}' AND payment='PENDING' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    } else {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND status_pesanan='${status}' AND paymet='PENDING' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    }
  }
  try {
    await connection.beginTransaction();

    for (let i = 0; i < get_orders.length; i++) {
      var [details_order] = await connection.query(
        `SELECT tb_order.*,SUM(tb_order.qty) as qty,tb_warehouse.warehouse FROM tb_order LEFT JOIN tb_warehouse ON tb_order.id_ware = tb_warehouse.id_ware WHERE tb_order.id_pesanan='${get_orders[i].id_pesanan}' GROUP BY tb_order.size,tb_order.id_produk,tb_order.id_pesanan`
      );
      var [data_payment] = await connection.query(
        `SELECT * FROM tb_payment WHERE id_invoice='${get_orders[i].id_invoice}'`
      );
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store WHERE id_store='${get_orders[i].customer}'`
      );
      var [data_payment] = await connection.query(
        `SELECT *,SUM(total_payment) as total_payment FROM tb_payment WHERE id_invoice='${get_orders[i].id_invoice}' GROUP BY bank`
      );

      datas.push({
        id: get_orders[i].id,
        tanggal_order: get_orders[i].tanggal_order,
        tanggal_update: get_orders[i].tanggal_update,
        id_invoice: get_orders[i].id_invoice,
        id_pesanan: get_orders[i].id_pesanan,
        customer: get_orders[i].customer,
        type_customer: get_orders[i].type_customer,
        sales_channel: get_orders[i].sales_channel,
        amount: get_orders[i].amount,
        diskon_nota: get_orders[i].diskon_nota,
        biaya_lainnya: get_orders[i].biaya_lainnya,
        total_amount: get_orders[i].total_amount,
        selisih: get_orders[i].selisih,
        status_pesanan: get_orders[i].status_pesanan,
        payment: get_orders[i].payment,
        reseller: get_orders[i].reseller,
        details_order: details_order,
        data_payment: data_payment,
        data_store: data_store,
        data_payment: data_payment,
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

const orderCountresellerpending = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var store = body.store;
  var query = body.query;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }

  const datas = [];

  try {
    await connection.beginTransaction();

    if (store === "all") {
      if (query === "all") {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND payment='PENDING' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND payment='PENDING' AND status_pesanan = 'SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND payment='PENDING' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND payment='PENDING' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND payment='PENDING' AND status_pesanan = 'SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND payment='PENDING' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      }
    } else {
      if (query === "all") {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND payment='PENDING' AND status_pesanan = 'SEDANG DIKIRIM' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND payment='PENDING' AND status_pesanan = 'SELESAI' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND payment='PENDING' AND status_pesanan = 'CANCEL' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' payment='PENDING' AND status_pesanan = 'SEDANG DIKIRIM' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' payment='PENDING' AND status_pesanan = 'SELESAI' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' payment='PENDING' AND status_pesanan = 'CANCEL' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      }
    }

    datas.push({
      dikirim: dikirim.length,
      selesai: selesai.length,
      cancel: cancel.length,
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getHeaderpesananresellerpending = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var status = body.status_pesanan;
  var store = body.store;
  var query = body.query;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }

  const datas = [];

  try {
    await connection.beginTransaction();

    if (store === "all") {
      if (query === "all") {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND status_pesanan='${status}' AND payment='PENDING' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer!='Retail' AND status_pesanan='${status}' AND payment='PENDING' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PENDING' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PENDING' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }
    } else {
      if (query === "all") {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND status_pesanan='${status}' AND payment='PENDING' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer!='Retail' AND status_pesanan='${status}' AND payment='PENDING' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PENDING' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer!='Retail' AND id_pesanan LIKE '%${query}%' OR reseller LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PENDING' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer!='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PENDING' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }
    }

    datas.push({
      sales: sales.length,
      qty_sales: Math.round(qty_sales[0].total),
      omzet: Math.round(omzet[0].amount),
      modal: Math.round(modal[0].total_modal),
      net_sales: parseInt(omzet[0].amount) - parseInt(modal[0].total_modal),
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};
// END RESELLER PENDING
//
//
// RETAIL
const orderresellerretail = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var status = body.status_pesanan;
  var query = body.query;
  var store = body.store;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }

  const datas = [];

  if (store === "all") {
    if (query === "all") {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND status_pesanan='${status}' AND payment='PAID' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    } else {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PAID' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    }
  } else if (store === "all_area") {
    if (query === "all") {
      var [get_orders] = await connection.query(
        `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );
    } else {
      var [get_orders] = await connection.query(
        `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
      );
    }
  } else {
    if (query === "all") {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND status_pesanan='${status}' AND payment='PAID' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    } else {
      var [get_orders] = await connection.query(
        `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PAID' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
      );
    }
  }
  try {
    await connection.beginTransaction();

    for (let i = 0; i < get_orders.length; i++) {
      var [details_order] = await connection.query(
        `SELECT tb_order.*,SUM(tb_order.qty) as qty,tb_warehouse.warehouse FROM tb_order LEFT JOIN tb_warehouse ON tb_order.id_ware = tb_warehouse.id_ware WHERE tb_order.id_pesanan='${get_orders[i].id_pesanan}' GROUP BY tb_order.size,tb_order.id_produk,tb_order.id_pesanan`
      );

      var [sumqty] = await connection.query(
        `SELECT SUM(qty) as hasilqty FROM tb_order WHERE id_pesanan='${get_orders[i].id_pesanan}'`
      );

      var [data_payment] = await connection.query(
        `SELECT * FROM tb_payment WHERE id_invoice='${get_orders[i].id_invoice}'`
      );
      var [data_store] = await connection.query(
        `SELECT * FROM tb_store WHERE id_store='${get_orders[i].customer}'`
      );
      var [data_payment] = await connection.query(
        `SELECT *,SUM(total_payment) as total_payment FROM tb_payment WHERE id_invoice='${get_orders[i].id_invoice}' GROUP BY bank`
      );

      var [modalakhir] = await connection.query(
        `SELECT SUM(m_price * qty) as modalsatuan,SUM(subtotal) as subtotalakhir FROM tb_order WHERE id_pesanan='${get_orders[i].id_pesanan}' GROUP BY id_pesanan`
      );

      datas.push({
        id: get_orders[i].id,
        tanggal_order: get_orders[i].tanggal_order,
        tanggal_update: get_orders[i].tanggal_update,
        id_invoice: get_orders[i].id_invoice,
        id_pesanan: get_orders[i].id_pesanan,
        customer: get_orders[i].customer,
        type_customer: get_orders[i].type_customer,
        sales_channel: get_orders[i].sales_channel,
        amount: get_orders[i].amount,
        diskon_nota: get_orders[i].diskon_nota,
        biaya_lainnya: get_orders[i].biaya_lainnya,
        total_amount: get_orders[i].total_amount,
        selisih: get_orders[i].selisih,
        status_pesanan: get_orders[i].status_pesanan,
        payment: get_orders[i].payment,
        reseller: get_orders[i].reseller,
        users: get_orders[i].users,
        details_order: details_order,
        data_payment: data_payment,
        data_store: data_store,
        data_payment: data_payment,
        qty: sumqty[0].hasilqty,
        modalakhir: modalakhir[0].modalsatuan,
        subtotalakhir: modalakhir[0].subtotalakhir,
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

const orderCountresellerretail = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var store = body.store;
  var query = body.query;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }
  const datas = [];

  try {
    await connection.beginTransaction();

    if (store === "all") {
      if (query === "all") {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND payment='PAID' AND status_pesanan = 'SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND payment='PAID' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND payment='PAID' AND status_pesanan = 'SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND payment='PAID' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      }
    } else if (store === "all_area") {
      if (query === "all") {
        var [dikirim] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
      }
    } else {
      if (query === "all") {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND payment='PAID' AND status_pesanan = 'SELESAI' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND payment='PAID' AND status_pesanan = 'CANCEL' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND payment='PAID' AND status_pesanan = 'SELESAI' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND payment='PAID' AND status_pesanan = 'CANCEL' AND store='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      }
    }

    datas.push({
      dikirim: dikirim.length,
      selesai: selesai.length,
      cancel: cancel.length,
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const getHeaderpesananresellerretail = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var status = body.status_pesanan;
  var store = body.store;
  var query = body.query;

  const tanggal = body.date;
  const myArray = tanggal.split(" to ");

  if (tanggal.length > 10) {
    var tanggal_start = myArray[0];
    var tanggal_end = myArray[1];
  } else {
    var tanggal_start = tanggal;
    var tanggal_end = tanggal;
  }
  const datas = [];

  try {
    await connection.beginTransaction();

    if (store === "all") {
      if (query === "all") {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND status_pesanan='${status}' AND payment='PAID' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer='Retail' AND status_pesanan='${status}' AND payment='PAID' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PAID' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PAID' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }
    } else if (store === "all_area") {
      if (query === "all") {
        var [sales] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_invoice.*,SUM(qty) as total,tb_order.* FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT tb_invoice.*,SUM(total_amount) as amount,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_invoice.*,SUM(m_price) as total_modal,tb_order.* FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [sales] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`

        );
        var [qty_sales] = await connection.query(
          `SELECT tb_invoice.*,SUM(qty) as total,tb_order.* FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT tb_invoice.*,SUM(total_amount) as amount,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_invoice.*,SUM(m_price) as total_modal,tb_order.* FROM tb_invoice LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.payment='PAID' AND tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }
    } else {
      if (query === "all") {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND status_pesanan='${status}' AND payment='PAID' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer='Retail' AND status_pesanan='${status}' AND payment='PAID' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      } else {
        var [sales] = await connection.query(
          `SELECT * FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PAID' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [qty_sales] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(qty) as total FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [omzet] = await connection.query(
          `SELECT *,SUM(total_amount) as amount FROM tb_invoice WHERE type_customer='Retail' AND id_pesanan LIKE '%${query}%' AND status_pesanan='${status}' AND payment='PAID' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
        var [modal] = await connection.query(
          `SELECT tb_order.*,tb_invoice.*,SUM(m_price) as total_modal FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.type_customer='Retail' AND tb_invoice.id_pesanan LIKE '%${query}%' AND tb_invoice.status_pesanan='${status}' AND payment='PAID' AND tb_order.id_store='${store}' AND tb_order.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
        );
      }
    }

    datas.push({
      sales: sales.length,
      qty_sales: Math.round(qty_sales[0].total),
      omzet: Math.round(omzet[0].amount),
      modal: Math.round(modal[0].total_modal),
      net_sales: parseInt(omzet[0].amount) - parseInt(modal[0].total_modal),
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};
// END RETAIL

const gethistorypay = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    await connection.beginTransaction();

    var [gethistorypay] = await connection.query(
      `SELECT * FROM tb_history_payment WHERE id_invoice='${body.id_invoice}' AND id_produk='${body.id_produk}' AND size='${body.size}'`
    );

    await connection.commit();
    await connection.release();
    return gethistorypay;
  } catch (error) {
    console.log(error);
    await connection.release();
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
};
