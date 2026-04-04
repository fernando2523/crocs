const dbPool = require("../config/database");

const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
const tanggalinput = date.format(new Date(), "YYYYMMDD");
const tahun = date.format(new Date(), "YY");
const { generateFromEmail } = require("unique-username-generator");

const productsSales = async (body) => {
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

    for (let index = 0; index < query_nota.length; index++) {
      datas.push({
        id: query_nota[index].id,
        id_produk: query_nota[index].id_nota,
        id_ware: query_nota[index].id_ware,
        id_brand: query_nota[index].id_brand,
        id_category: query_nota[index].id_category,
        tanggal_upload: query_nota[index].tanggal_upload,
        produk: query_nota[index].produk,
        deskripsi: query_nota[index].deskripsi,
        quality: query_nota[index].quality,
        n_price: query_nota[index].m_price,
        r_price: query_nota[index].m_price,
        g_price: query_nota[index].m_price,
        img: "box.png",
        users: query_nota[index].users,
        variation_sales: [
          {
            size: query_nota[index].size,
            qty: query_nota[index].qty,
          },
        ],
        variationcount: 1,
        stok: "External",
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

const salesProductbarcode = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  const datas = [];
  try {
    await connection.beginTransaction();

    const [get_product] = await connection.query(
      `SELECT * FROM tb_produk WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'`
    );
    const [get_size] = await connection.query(
      `SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' AND size='${body.size}' GROUP BY id_produk,size`
    );

    for (let index = 0; index < get_product.length; index++) {
      datas.push({
        produk: get_product[index].produk,
        id_produk: get_product[index].id_produk,
        qty_ready: get_size[0].qty,
        img: get_product[index].img,
        n_price: get_product[index].n_price,
        r_price: get_product[index].r_price,
        g_price: get_product[index].g_price,
      });
    }

    const [get_po] = await connection.query(
      `SELECT m_price FROM tb_purchaseorder WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'`
    );

    const [get_hargajual] = await connection.query(
      `SELECT r_price FROM tb_produk WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'`
    );


    await connection.commit();
    await connection.release();

    if (get_size[0].qty > 0) {
      return {
        produk: get_product[0].produk,
        qty_ready: get_size[0].qty,
        img: get_product[0].img,
        id_ware: get_product[0].id_ware,
        get_hargajual,
        datas,
      };
    } else {
      return "sold_out";
    }
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const inputSales = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const { data, id_pesanan, tanggal: tanggalOrder, id_store, total_amount, users } = body;

  try {
    await connection.beginTransaction();

    // Check Order ID yang sudah ada di database
    const [cekPesananGlobal] = await connection.query(
      `SELECT id_pesanan 
       FROM tb_order 
       WHERE id_pesanan = '${id_pesanan}' 
       GROUP BY id_pesanan`
    );

    if (cekPesananGlobal.length > 0) {
      return {
        status: "failed ID",
        message: "Order ID already exists in the database.",
      };
    }

    // Hitung total harga_jual * qty dari data
    // const requiredTotal = data.reduce((acc, item) => acc + item.harga_jual * item.qty, 0);

    var total_modal = 0;
    for (let x = 0; x < data.length; x++) {
      if (data[x].source === "Barang Luar") {
        total_modal = total_modal + parseInt(data[x].harga_beli);
      } else {
        var [get_purchaseorder] = await connection.query(
          `SELECT AVG(g_price) as g_price FROM tb_produk WHERE id_produk='${data[x].idproduk}' AND id_ware='${data[x].id_ware}'`
        );
        total_modal = total_modal + Math.round(parseInt(get_purchaseorder[0].g_price) - parseInt(100000)) * data[x].qty;

        // var [get_purchaseorder] = await connection.query(
        //   `SELECT AVG(g_price) as g_price FROM tb_produk WHERE id_produk='${data[x].idproduk}' AND id_ware='${data[x].id_ware}'`
        // );
        // total_modal = total_modal + (parseInt(Math.round(get_purchaseorder[0].g_price)) - parseInt(50000)) * data[x].qty;
      }
    }
    console.log("total_modal", total_modal);


    if (total_amount < total_modal) {
      return {
        status: "failed price",
        message: "Total amount from frontend is less than the calculated selling price.",
        data: {
          frontendTotalAmount: total_amount,
          total_modal,
        },
      };
    }

    // Generate Mutasi ID
    const [cekMutasi] = await connection.query(`SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`);
    let lastMutasi = cekMutasi[0].id_mutasi
      ? parseInt(cekMutasi[0].id_mutasi.slice(-8))
      : 0;

    // Proses setiap item
    for (const item of data) {
      const { idproduk, id_ware, size, harga_jual, qty, img, produk, source } = item;

      // Fetch Product
      const [getProduk] = await connection.query(
        `SELECT * FROM tb_produk WHERE id_produk='${idproduk}' AND id_ware='${id_ware}'`
      );

      let qtySales = qty;

      // Fetch variations
      const [variations] = await connection.query(
        `SELECT * FROM tb_variation WHERE id_produk='${idproduk}' AND id_ware='${id_ware}' AND size='${size}' AND qty > 0 ORDER BY id ASC`
      );

      if (variations.length === 0) continue;

      for (const variation of variations) {
        const qtyBaru = variation.qty - qtySales;
        const qtyToProcess = qtyBaru >= 0 ? qtySales : variation.qty;

        const [getModal] = await connection.query(
          `SELECT m_price FROM tb_purchaseorder WHERE idpo='${variation.idpo}' AND id_produk='${idproduk}'`
        );

        const subtotal = harga_jual * qtyToProcess;

        // Insert into tb_order
        await connection.query(
          `INSERT INTO tb_order (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
           VALUES ('${tanggalOrder}', '${id_pesanan}', '${id_store}', '${idproduk}', 'Barang Gudang', '${img}', '${produk}', '${getProduk[0].id_brand}', '${id_ware}', '${variation.idpo}', '${getProduk[0].quality}', '${size}', '${qtyToProcess}', '${getModal[0].m_price}', '${harga_jual}', '0', '${subtotal}', '${users}', '${tanggal}', '${tanggal}')`
        );

        // Generate Mutasi ID
        lastMutasi += 1;
        const idMutasi = `MT-${lastMutasi.toString().padStart(8, "0")}`;

        // Insert into tb_mutasistock
        await connection.query(
          `INSERT INTO tb_mutasistock (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
           VALUES ('${idMutasi}', '${tanggalOrder}', '${id_pesanan}', '${id_ware}', '${id_store}', '${idproduk}', '${produk}', '${variation.idpo}', '${size}', '${qtyToProcess}', '${source}', '-', 'SALES ONLINE', '${users}', '${tanggal}', '${tanggal}')`
        );

        // Update tb_variation
        await connection.query(
          `UPDATE tb_variation SET qty='${Math.max(0, qtyBaru)}', updated_at='${tanggal}' WHERE id_produk='${idproduk}' AND id_ware='${id_ware}' AND size='${size}' AND idpo='${variation.idpo}'`
        );

        qtySales -= qtyToProcess;
        if (qtySales <= 0) break;
      }
    }

    // Generate Invoice
    const [cekInvoice] = await connection.query(`SELECT MAX(id_invoice) as id_invoice FROM tb_invoice`);
    let lastInvoice = cekInvoice[0].id_invoice
      ? parseInt(cekInvoice[0].id_invoice.slice(-9))
      : 0;

    const [get_store] = await connection.query(
      `SELECT * FROM tb_store WHERE id_store='${id_store}'`
    );

    lastInvoice += 1;
    const idInvoice = `INV-${lastInvoice.toString().padStart(9, "0")}`;

    await connection.query(
      `INSERT INTO tb_invoice (tanggal_order, id_invoice, id_pesanan, customer, type_customer, sales_channel, amount, diskon_nota, biaya_lainnya, total_amount, selisih, status_pesanan, payment, reseller, users, created_at, updated_at)
       VALUES ('${tanggalOrder}', '${idInvoice}', '${id_pesanan}', '${id_store}', '${get_store[0].channel}', '${get_store[0].channel}', '${total_amount}', '0', '0', '${total_amount}', '0', 'SELESAI', 'PAID', '-', '${users}', '${tanggal}', '${tanggal}')`
    );

    // Commit transaction
    await connection.commit();

    return {
      status: "success",
      message: "All orders processed successfully.",
    };
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const order = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  const { status_pesanan: status, query, store, users, date: tanggal, Brand, area, statusdate } = body;

  const [tanggal_start, tanggal_end] = tanggal.includes(" to ") ? tanggal.split(" to ") : [tanggal, tanggal];

  const datas = [];
  let output_area_ware = null;

  if (store === "all_area") {
    const area_ware = area.split('-')[0];
    if (area_ware === "WARE") {
      const [data_get_ware] = await connection.query(
        `SELECT id_area FROM tb_warehouse WHERE id_ware=? GROUP BY id_area`,
        [area]
      );
      output_area_ware = data_get_ware[0]?.id_area;
    } else if (area_ware === "AREA") {
      output_area_ware = area;
    }
  }
  console.log("body const order", body);

  try {
    await connection.beginTransaction();

    const conditions = [
      "tb_invoice.sales_channel != 'OFFLINE STORE'",
      `tb_invoice.status_pesanan='${status}'`,
    ];

    if (query !== "all") {
      if (statusdate !== "noclick") {
        conditions.push(`tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`);
      }
      conditions.push(`(
        tb_invoice.id_pesanan LIKE '%${query}%' OR 
        EXISTS (
          SELECT 1 FROM tb_order 
          WHERE tb_order.id_pesanan = tb_invoice.id_pesanan AND (
            tb_order.produk LIKE '%${query}%' OR 
            tb_order.id_produk LIKE '%${query}%' OR 
            CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR 
            CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%'
          )
        )
      )`);
    } else {
      conditions.push(`tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`);
    }

    if (store !== "all" && store !== "all_area") {
      conditions.push(`tb_invoice.customer='${store}'`);
    }
    if (store === "all_area" && output_area_ware) {
      conditions.push(`tb_store.id_area='${output_area_ware}'`);
    }
    if (Brand != "all") {
      conditions.push(`tb_invoice.customer IN (SELECT id_store FROM tb_store WHERE id_area='${Brand}')`);
    }
    const whereClause = conditions.join(" AND ");
    console.log("whereClause", whereClause);

    const [get_orders] = await connection.query(
      `SELECT 
        tb_invoice.id, tb_invoice.tanggal_order, tb_invoice.type_customer, 
        tb_invoice.created_at, tb_invoice.id_pesanan, tb_invoice.users
       FROM tb_invoice
       LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store
       WHERE ${whereClause}
       GROUP BY tb_invoice.id_pesanan
       ORDER BY tb_invoice.id DESC`
    );

    const [header] = await connection.query(
      `SELECT 
        COUNT(tb_invoice.id_pesanan) as countsales, 
        SUM(tb_order.qty) as totalqty, 
        SUM(tb_order.m_price*tb_order.qty) as total_modal, 
        SUM(tb_invoice.total_amount) as omzet, 
        SUM(tb_order.diskon_item) as total_diskon, 
        SUM(tb_order.subtotal) as subtotals
       FROM tb_order
       LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan
       LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store
       WHERE ${whereClause}`
    );

    const [omzet] = await connection.query(
      `SELECT 
         SUM(tb_invoice.total_amount) AS omzet
       FROM tb_invoice
       LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store
       WHERE ${whereClause}`
    );

    for (const order of get_orders) {
      const [details_order] = await connection.query(
        `SELECT 
          tb_order.id, tb_order.id_pesanan, tb_order.id_produk, tb_order.source, tb_order.img, 
          tb_order.id_ware, tb_order.idpo, tb_order.produk, tb_order.size, tb_order.qty, 
          tb_order.m_price, tb_order.selling_price, tb_order.diskon_item, tb_order.subtotal, 
          SUM(tb_order.qty) as qty, SUM(tb_order.m_price*tb_order.qty) as m_price, 
          SUM(tb_order.subtotal) as subtotal, tb_store.store, tb_invoice.selisih
         FROM tb_order
         LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = tb_order.id_pesanan
         LEFT JOIN tb_store ON tb_store.id_store = tb_order.id_store
         WHERE tb_invoice.id_pesanan=?
         GROUP BY tb_order.size, tb_order.id_produk, tb_invoice.id_pesanan`,
        [order.id_pesanan]
      );

      const [totaltotal] = await connection.query(
        `SELECT 
          SUM(tb_order.m_price*tb_order.qty) as modalsatuan, 
          SUM(tb_order.subtotal) as subtotalakhir, 
          tb_invoice.total_amount as totalakhir, 
          SUM(tb_order.diskon_item) as total_diskon, 
          SUM(tb_order.qty) as hasilqty, tb_invoice.selisih
         FROM tb_order
         LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = tb_order.id_pesanan
         WHERE tb_invoice.id_pesanan=?
         GROUP BY tb_invoice.id_pesanan`,
        [order.id_pesanan]
      );

      datas.push({
        id: order.id,
        tanggal_order: order.tanggal_order,
        type_customer: order.type_customer,
        created_at: order.created_at,
        id_pesanan: order.id_pesanan,
        users: order.users,
        modalakhir: totaltotal[0]?.modalsatuan || 0,
        subtotalakhir: totaltotal[0]?.subtotalakhir || 0,
        subtotalstandar: totaltotal[0]?.totalakhir || 0,
        qty: totaltotal[0]?.hasilqty || 0,
        store: details_order[0]?.store || 0,
        selisih: details_order[0]?.selisih || 0,
        details_order,
      });
    }

    const kirim_tanggal_start = query === "all" ? tanggal_start : get_orders[0]?.tanggal_order || tanggal_start;

    await connection.commit();
    await connection.release();

    return {
      datas,
      selesai: get_orders.length,
      sales: get_orders.length,
      qty_sales: Math.round(header[0]?.totalqty || 0),
      subtotal: Math.round(header[0]?.subtotals || 0),
      omzet: Math.round(omzet[0]?.omzet || 0),
      modal: Math.round(header[0]?.total_modal || 0),
      net_sales: Math.round((omzet[0]?.omzet || 0) - (header[0]?.total_modal || 0)),
      today: kirim_tanggal_start,
    };
  } catch (error) {
    console.error(error);
    await connection.release();
    throw error;
  }
};


// const order = async (body) => {
//   const connection = await dbPool.getConnection();
//   const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
//   const { status_pesanan: status, query, store, users, date: tanggal, Brand, area, statusdate } = body;

//   const [tanggal_start, tanggal_end] = tanggal.includes(" to ") ? tanggal.split(" to ") : [tanggal, tanggal];

//   const datas = [];
//   let output_area_ware = null;

//   if (store === "all_area") {
//     const area_ware = area.split('-')[0];
//     if (area_ware === "WARE") {
//       const [data_get_ware] = await connection.query(
//         `SELECT id_area FROM tb_warehouse WHERE id_ware=? GROUP BY id_area`,
//         [area]
//       );
//       output_area_ware = data_get_ware[0]?.id_area;
//     } else if (area_ware === "AREA") {
//       output_area_ware = area;
//     }
//   }
//   console.log(body);

//   try {
//     await connection.beginTransaction();

//     const conditions = [
//       "tb_invoice.sales_channel != 'OFFLINE STORE'",
//       `tb_invoice.status_pesanan='${status}'`,
//     ];

//     if (query !== "all") {
//       if (statusdate !== "noclick") {
//         conditions.push(`tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`);
//       }
//       conditions.push(`(
//         tb_invoice.id_pesanan LIKE '%${query}%' OR 
//         EXISTS (
//           SELECT 1 FROM tb_order 
//           WHERE tb_order.id_pesanan = tb_invoice.id_pesanan AND (
//             tb_order.produk LIKE '%${query}%' OR 
//             tb_order.id_produk LIKE '%${query}%' OR 
//             CONCAT(tb_order.id_produk,'.', tb_order.size) LIKE '%${query}%' OR 
//             CONCAT(tb_order.produk,'.', tb_order.size) LIKE '%${query}%'
//           )
//         )
//       )`);
//     } else {
//       conditions.push(`tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`);
//     }

//     if (store !== "all") conditions.push(`tb_invoice.customer='${store}'`);
//     if (store === "all_area" && output_area_ware) conditions.push(`tb_store.id_area='${output_area_ware}'`);
//     if (Brand !== "all") conditions.push(`tb_invoice.customer IN (SELECT id_store FROM tb_store WHERE id_area='${Brand}')`);

//     const whereClause = conditions.join(" AND ");

//     const [get_orders] = await connection.query(
//       `SELECT 
//         tb_invoice.id, tb_invoice.tanggal_order, tb_invoice.type_customer, 
//         tb_invoice.created_at, tb_invoice.id_pesanan, tb_invoice.users
//        FROM tb_invoice
//        LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store
//        WHERE ${whereClause}
//        GROUP BY tb_invoice.id_pesanan
//        ORDER BY tb_invoice.id DESC`
//     );

//     const [header] = await connection.query(
//       `SELECT 
//         COUNT(tb_invoice.id_pesanan) as countsales, 
//         SUM(tb_order.qty) as totalqty, 
//         SUM(tb_order.m_price*tb_order.qty) as total_modal, 
//         SUM(tb_invoice.total_amount) as omzet, 
//         SUM(tb_order.diskon_item) as total_diskon, 
//         SUM(tb_order.subtotal) as subtotals
//        FROM tb_order
//        LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan
//        LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store
//        WHERE ${whereClause}`
//     );

//     const [omzet] = await connection.query(
//       `SELECT SUM(tb_invoice.total_amount) as omzet
//        FROM tb_invoice
//        LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store
//        WHERE ${whereClause}`
//     );
//     console.log("omzet", omzet);

//     for (const order of get_orders) {
//       const [details_order] = await connection.query(
//         `SELECT 
//           tb_order.id, tb_order.id_pesanan, tb_order.id_produk, tb_order.source, tb_order.img, 
//           tb_order.id_ware, tb_order.idpo, tb_order.produk, tb_order.size, tb_order.qty, 
//           tb_order.m_price, tb_order.selling_price, tb_order.diskon_item, tb_order.subtotal, 
//           SUM(tb_order.qty) as qty, SUM(tb_order.m_price*tb_order.qty) as m_price, 
//           SUM(tb_order.subtotal) as subtotal, tb_store.store, tb_invoice.selisih
//          FROM tb_order
//          LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = tb_order.id_pesanan
//          LEFT JOIN tb_store ON tb_store.id_store = tb_order.id_store
//          WHERE tb_invoice.id_pesanan=?
//          GROUP BY tb_order.size, tb_order.id_produk, tb_invoice.id_pesanan`,
//         [order.id_pesanan]
//       );

//       const [totaltotal] = await connection.query(
//         `SELECT 
//           SUM(tb_order.m_price*tb_order.qty) as modalsatuan, 
//           SUM(tb_order.subtotal) as subtotalakhir, 
//           tb_invoice.total_amount as totalakhir, 
//           SUM(tb_order.diskon_item) as total_diskon, 
//           SUM(tb_order.qty) as hasilqty, tb_invoice.selisih
//          FROM tb_order
//          LEFT JOIN tb_invoice ON tb_invoice.id_pesanan = tb_order.id_pesanan
//          WHERE tb_invoice.id_pesanan=?
//          GROUP BY tb_invoice.id_pesanan`,
//         [order.id_pesanan]
//       );

//       datas.push({
//         id: order.id,
//         tanggal_order: order.tanggal_order,
//         type_customer: order.type_customer,
//         created_at: order.created_at,
//         id_pesanan: order.id_pesanan,
//         users: order.users,
//         modalakhir: totaltotal[0]?.modalsatuan || 0,
//         subtotalakhir: totaltotal[0]?.subtotalakhir || 0,
//         subtotalstandar: totaltotal[0]?.totalakhir || 0,
//         qty: totaltotal[0]?.hasilqty || 0,
//         store: details_order[0]?.store || 0,
//         selisih: details_order[0]?.selisih || 0,
//         details_order,
//       });
//     }

//     const kirim_tanggal_start = query === "all" ? tanggal_start : get_orders[0]?.tanggal_order || tanggal_start;

//     await connection.commit();
//     await connection.release();

//     return {
//       datas,
//       selesai: get_orders.length,
//       sales: get_orders.length,
//       qty_sales: Math.round(header[0]?.totalqty || 0),
//       subtotal: Math.round(header[0]?.subtotals || 0),
//       omzet: Math.round(omzet[0]?.omzet || 0),
//       modal: Math.round(header[0]?.total_modal || 0),
//       net_sales: Math.round((omzet[0]?.omzet || 0) - (header[0]?.total_modal || 0)),
//       today: kirim_tanggal_start,
//     };
//   } catch (error) {
//     console.error(error);
//     await connection.release();
//     throw error;
//   }
// };

const orderCount = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var store = body.store;
  var users = body.users;

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
      if (users === "all") {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan='SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE users='${users}' AND sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE users='${users}' AND sales_channel != 'OFFLINE STORE' AND status_pesanan='SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE users='${users}' AND sales_channel != 'OFFLINE STORE' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      }
    } else if (store === "all_area") {
      if (users === "all") {
        var [dikirim] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_store.id_area='${body.area}' AND tb_invoice.users='${users}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_store.id_area='${body.area}' AND tb_invoice.users='${users}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_store.id_area='${body.area}' AND tb_invoice.users='${users}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
        );
      }
    } else {
      if (users === "all") {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SEDANG DIKIRIM' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SELESAI' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'CANCEL' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      } else {
        var [dikirim] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SEDANG DIKIRIM' AND customer='${store}' AND users='${users}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [selesai] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SELESAI' AND customer='${store}' AND users='${users}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
        var [cancel] = await connection.query(
          `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'CANCEL' AND customer='${store}' AND users='${users}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
        );
      }
    }

    if (store === "all") {
      if (query === "all") {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan = 'SELESAI' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan = 'CANCEL' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan = 'SEDANG DIKIRIM' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan = 'SELESAI' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND payment='PAID' AND status_pesanan = 'CANCEL' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        }
      } else {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      }
    } else if (store === "all_area") {
      if (query === "all") {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND type_customer='${tipesales}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'SELESAI' AND type_customer='${tipesales}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.*,tb_store.id_area FROM tb_invoice LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan = 'CANCEL' AND type_customer='${tipesales}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      } else {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_invoice.customer = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_store.id_area='${body.area}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        }
      }
    } else {
      if (query === "all") {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SEDANG DIKIRIM' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SELESAI' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'CANCEL' AND customer='${store}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SEDANG DIKIRIM' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'SELESAI' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT * FROM tb_invoice WHERE sales_channel != 'OFFLINE STORE' AND status_pesanan = 'CANCEL' AND customer='${store}' AND type_customer='${tipesales}' AND tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
          );
        }
      } else {
        if (tipesales === "all") {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
        } else {
          var [dikirim] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SEDANG DIKIRIM' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [selesai] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'SELESAI' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
          );
          var [cancel] = await connection.query(
            `SELECT tb_invoice.id_pesanan FROM tb_invoice LEFT JOIN tb_order ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_invoice.reseller LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.customer='${store}' AND tb_invoice.type_customer='${tipesales}' AND tb_invoice.status_pesanan = 'CANCEL' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_invoice.id DESC`
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

const getHeaderpesanan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  var status = body.status_pesanan;
  var store = body.store;
  var users = body.users;
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
        if (users === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.users='${users}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (users === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.users='${users}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      }
    } else if (store === "all_area") {
      if (query === "all") {
        if (users === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.users='${users}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (users === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan LEFT JOIN tb_store ON tb_order.id_store = tb_store.id_store WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_store.id_area='${body.area}' AND tb_invoice.users='${users}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      }
    } else {
      if (query === "all") {
        if (users === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.users='${users}' AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      } else {
        if (users === "all") {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        } else {
          var [header] = await connection.query(
            `SELECT COUNT(tb_invoice.id_invoice) as countsales,SUM(tb_order.subtotal) as subtotals,SUM(tb_order.qty) as totalqty,SUM(tb_order.m_price*tb_order.qty) as total_modal,SUM(tb_invoice.total_amount) as amount FROM tb_order LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan WHERE tb_invoice.sales_channel != 'OFFLINE STORE' AND tb_invoice.status_pesanan='${status}' AND tb_invoice.customer='${store}' AND tb_invoice.users='${users}' AND (tb_invoice.id_pesanan LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%' OR tb_order.produk LIKE '%${query}%') AND tb_invoice.tanggal_order BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
          );
        }
      }
    }

    datas.push({
      sales: header[0].countsales,
      qty_sales: Math.round(header[0].totalqty),
      subtotal: Math.round(header[0].subtotals),
      omzet: Math.round(header[0].amount),
      modal: Math.round(header[0].total_modal),
      net_sales: parseInt(header[0].amount) - parseInt(header[0].total_modal),
    });

    await connection.commit();
    await connection.release();

    return datas;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const refund = async (body) => {
  const connection = await dbPool.getConnection();
  const now = new Date();
  const formattedDate = date.format(now, "YYYY-MM-DD HH:mm:ss");
  const today = date.format(now, "YYYY-MM-DD");

  try {
    console.log("Refund request data:", body);
    await connection.beginTransaction();

    /** 1️⃣ Generate ID Mutasi */
    const [mutasiResult] = await connection.query(
      "SELECT MAX(id_mutasi) AS latest_mutasi_id FROM tb_mutasistock"
    );
    const latest_mutasi_id = mutasiResult[0]?.latest_mutasi_id;
    let id_mutasi = "MT-" + String(
      latest_mutasi_id ? parseInt(latest_mutasi_id.slice(-8)) + 1 : 1
    ).padStart(8, "0");

    /** 2️⃣ Ambil Data Pesanan & Invoice */
    const [orderData] = await connection.query(
      `SELECT * FROM tb_order WHERE id_pesanan = ? AND id_produk = ? AND size = ? AND source = ? ORDER BY idpo ASC`,
      [body.id_pesanan, body.id_produk, body.size, body.source]
    );

    const [invoiceData] = await connection.query(
      `SELECT * FROM tb_invoice WHERE id_pesanan = ?`,
      [body.id_pesanan]
    );

    const [orderSummary] = await connection.query(
      `SELECT SUM(qty) AS total_qty, SUM(subtotal) AS total_subtotal FROM tb_order WHERE id_pesanan = ?`,
      [body.id_pesanan]
    );

    if (!invoiceData.length) throw new Error("Invoice tidak ditemukan.");
    if (!orderData.length) throw new Error("Pesanan tidak ditemukan.");

    let totalQtyPesanan = orderSummary[0].total_qty || 0;
    let totalSubtotalPesanan = orderSummary[0].total_subtotal || 0;
    let amountSisa = invoiceData[0].amount - totalSubtotalPesanan;
    let qtyRefund = body.qty_refund;
    let qtySisa = 0;
    let amountFinal = 0; // ✅ **Inisialisasi default untuk mencegah undefined**

    /** 3️⃣ Proses Refund Per Item */
    for (let order of orderData) {
      let diskonPerItem = order.diskon_item ? order.diskon_item / order.qty : 0;
      let hargaJualRefund = (order.selling_price * qtyRefund) - (diskonPerItem * qtyRefund);

      let persentaseRefund = (hargaJualRefund / invoiceData[0].amount) * 100;
      let jumlahDikurangkan = (amountSisa * persentaseRefund) / 100;
      amountFinal += hargaJualRefund + jumlahDikurangkan; // ✅ **Pastikan `amountFinal` selalu bertambah**

      let qtyTersisa = order.qty - qtyRefund;

      /** 3.1 Jika sumber Barang Gudang, lakukan mutasi stok */
      if (order.source === "Barang Gudang") {
        qtySisa = qtyRefund - order.qty;

        await connection.query(
          `INSERT INTO tb_mutasistock (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REFUND', ?, ?, ?)`,
          [
            id_mutasi, today, order.id_pesanan, order.id_ware, order.id_store,
            order.id_produk, order.produk, order.idpo, order.size,
            order.qty, order.source, order.source, body.users, formattedDate, formattedDate
          ]
        );

        /** 3.2 Update tb_variation */
        const [variation] = await connection.query(
          `SELECT * FROM tb_variation WHERE id_produk = ? AND id_ware = ? AND size = ? ORDER BY id DESC LIMIT 1`,
          [body.id_produk, order.id_ware, order.size]
        );

        if (variation.length) {
          let newQty = variation[0].qty + qtyRefund;
          await connection.query(
            `UPDATE tb_variation SET qty = ?, updated_at = ? WHERE id_produk = ? AND id_ware = ? AND size = ? AND idpo = ?`,
            [newQty, formattedDate, body.id_produk, order.id_ware, order.size, variation[0].idpo]
          );
        } else {
          await connection.query(
            `INSERT INTO tb_variation (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [today, body.id_produk, order.idpo, variation[0].idpo, order.id_ware, order.size, qtyRefund, variation[0].id_act, body.users, formattedDate, formattedDate]
          );
        }

        /** 3.3 Update atau Hapus tb_order */
        if (qtyTersisa > 0) {
          await connection.query(
            `UPDATE tb_order SET qty = ?, diskon_item = ?, subtotal = ?, updated_at = ? WHERE id = ?`,
            [
              qtyTersisa,
              diskonPerItem * qtyTersisa,
              order.subtotal - hargaJualRefund,
              formattedDate,
              order.id
            ]
          );
        } else {
          await connection.query(`DELETE FROM tb_order WHERE id = ?`, [order.id]);
        }
      }
    }

    /** 4️⃣ Catat Refund di tb_refund */
    await connection.query(
      `INSERT INTO tb_refund (tanggal_refund, id_pesanan, id_produk, id_store, produk, source, idpo, size, qty, keterangan, users, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Refund', ?, ?, ?)`,
      [
        today, body.id_pesanan, body.id_produk, orderData[0].id_store,
        body.produk, body.source, body.idpo, body.size, body.qty_refund,
        body.users, formattedDate, formattedDate
      ]
    );



    /** 4️⃣ Pastikan `amountFinal` memiliki nilai yang valid sebelum update */
    if (amountFinal === 0) {
      console.warn("⚠️ amountFinal tetap 0! Tidak ada perubahan yang terjadi.");
      amountFinal = totalSubtotalPesanan; // **Gunakan jumlah total jika refund gagal dihitung**
    }

    /** 5️⃣ Update tb_invoice */
    await connection.query(
      `UPDATE tb_invoice SET amount = ?, total_amount = ?, updated_at = ? WHERE id_pesanan = ?`,
      [
        invoiceData[0].amount - amountFinal,
        invoiceData[0].amount - amountFinal,
        formattedDate,
        body.id_pesanan
      ]
    );

    /** 6️⃣ Update atau Hapus tb_payment Jika Perlu */
    if (invoiceData[0].type_customer === "Retail" || invoiceData[0].type_customer === "Reseller" || invoiceData[0].type_customer === "Grosir") {
      const [getpayment] = await connection.query(
        `SELECT * FROM tb_payment WHERE id_invoice = ?`, [body.id_pesanan]
      );

      for (let payment of getpayment) {
        if (getpayment.length > 1) {
          // Jika ada lebih dari 1 pembayaran, hapus semua pembayaran lama
          await connection.query(
            `DELETE FROM tb_payment WHERE id_invoice = ?`, [body.id_pesanan]
          );

          // Masukkan pembayaran baru dengan jumlah yang telah dikurangi refund
          await connection.query(
            `INSERT INTO tb_payment (tanggal_pembayaran, id_invoice, total_payment, metode_payment, bank, id_store, id_area, deskripsi, created_at, updated_at)
             VALUES (?, ?, ?, 'DEBIT', 'BCA', ?, ?, '-', ?, ?)`,
            [
              payment.tanggal_pembayaran, payment.id_invoice,
              invoiceData[0].amount - amountFinal,
              payment.id_store, payment.id_area,
              payment.created_at, formattedDate
            ]
          );
        } else {
          // Jika hanya ada 1 pembayaran, update total pembayaran
          await connection.query(
            `UPDATE tb_payment SET total_payment = ?, updated_at = ? WHERE id_invoice = ?`,
            [invoiceData[0].amount - amountFinal, formattedDate, body.id_pesanan]
          );
        }
      }
    }

    /** 6️⃣ Jika tidak ada pesanan tersisa, hapus invoice & payment */
    const [remainingOrders] = await connection.query(
      `SELECT * FROM tb_order WHERE id_pesanan = ?`, [body.id_pesanan]
    );

    if (!remainingOrders.length) {
      await connection.query(`DELETE FROM tb_invoice WHERE id_pesanan = ?`, [body.id_pesanan]);
      await connection.query(`DELETE FROM tb_payment WHERE id_invoice = ?`, [body.id_pesanan]);
    }

    await connection.commit();
    console.log("✅ Refund berhasil!");
  } catch (error) {
    console.error("❌ Refund gagal:", error);
    await connection.rollback();
  } finally {
    await connection.release();
  }
};

const getSizeretur = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  try {
    await connection.beginTransaction();

    const [data] = await connection.query(
      `SELECT *,SUM(qty)as qty FROM tb_variation WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'  AND size != '${body.size}' GROUP BY size`
    );

    await connection.commit();
    await connection.release();

    return data;
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const retur = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  // Generate id_mutasi
  const [cek_mutasi] = await connection.query(
    `SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`
  );
  let id_mutasi;
  if (cek_mutasi[0].id_mutasi === null) {
    id_mutasi = "MT-" + "00000001";
  } else {
    const get_last2 = cek_mutasi[0].id_mutasi;
    const data_2 = get_last2.toString().slice(-8);
    const hasil = parseInt(data_2) + 1;
    id_mutasi = "MT-" + String(hasil).padStart(8, "0");
  }

  try {
    await connection.beginTransaction();

    // === PROSES PENAMBAHAN BARANG RETUR (Ukuran Baru) ===
    const [get_produk_grup] = await connection.query(
      `SELECT * FROM tb_order WHERE id_pesanan='${body.id_pesanan}' AND id_produk='${body.id_produk}' AND size='${body.size_old}' GROUP BY id_produk,size`
    );
    const {
      tanggal_order,
      id_pesanan,
      id_brand,
      id_store,
      id_produk,
      produk,
      img,
      quality,
      selling_price: harga_jual,
      diskon_item,
      qty: qty_default,
      m_price: harga_modal,
    } = get_produk_grup[0];

    const bagi_diskon = parseInt(diskon_item) / parseInt(qty_default);
    const hasil_diskon = parseInt(bagi_diskon) * parseInt(body.qty_new);

    // Cek stok variasi untuk ukuran baru (misal: size 41)
    const [get_var] = await connection.query(
      `SELECT * FROM tb_variation 
       WHERE id_produk='${body.id_produk}' AND id_ware='${body.new_id_ware}' AND size='${body.size_new}' AND qty > 0 
       ORDER BY idpo ASC`
    );

    const [get_pesanan_awal] = await connection.query(
      `SELECT * FROM tb_order WHERE id_pesanan='${body.id_pesanan}'`
    );

    let qty_sales = parseInt(body.qty_new);

    for (let i = 0; i < get_var.length && qty_sales > 0; i++) {
      const availableQty = parseInt(get_var[i].qty);
      let qty_baru = availableQty - qty_sales;

      if (qty_baru >= 0) {
        // Stok cukup di variasi ini
        await connection.query(
          `INSERT INTO tb_order
            (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
            VALUES ('${tanggal_order}','${id_pesanan}','${id_store}','${id_produk}','Barang Gudang','${img}','${produk}','${id_brand}','${get_var[i].id_ware}','${get_var[i].idpo}','${quality}','${body.size_new}','${qty_sales}','${harga_modal}','${harga_jual}','${hasil_diskon}','${(parseInt(harga_jual) * qty_sales) - hasil_diskon}','${body.users}','${tanggal}','${tanggal}')`
        );

        await connection.query(
          `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan}','${get_var[i].id_ware}','${id_store}','${id_produk}','${produk}','${get_var[i].idpo}','${body.size_new}','${qty_sales}','Barang Gudang','-','RETUR_OUT','${body.users}','${tanggal}','${tanggal}')`
        );

        // Update stok variasi untuk ukuran baru
        await connection.query(
          `UPDATE tb_variation SET qty='${qty_baru}', updated_at='${tanggal}' 
           WHERE id_produk='${id_produk}' AND id_ware='${get_var[i].id_ware}' AND size='${body.size_new}' AND idpo='${get_var[i].idpo}'`
        );

        qty_sales = 0; // target terpenuhi
      } else {
        // Stok pada variasi ini tidak mencukupi, gunakan seluruh stok yang ada dan lanjutkan ke variasi berikutnya
        await connection.query(
          `INSERT INTO tb_order
            (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
            VALUES ('${tanggal_order}','${id_pesanan}','${id_store}','${id_produk}','Barang Gudang','${img}','${produk}','${id_brand}','${get_var[i].id_ware}','${get_var[i].idpo}','${quality}','${body.size_new}','${availableQty}','${harga_modal}','${harga_jual}','${hasil_diskon}','${(parseInt(harga_jual) * availableQty) - hasil_diskon}','${body.users}','${tanggal}','${tanggal}')`
        );

        await connection.query(
          `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan}','${get_var[i].id_ware}','${id_store}','${id_produk}','${produk}','${get_var[i].idpo}','${body.size_new}','${availableQty}','Barang Gudang','-','RETUR_OUT','${body.users}','${tanggal}','${tanggal}')`
        );

        await connection.query(
          `UPDATE tb_variation SET qty='0', updated_at='${tanggal}' 
           WHERE id_produk='${id_produk}' AND id_ware='${get_var[i].id_ware}' AND size='${body.size_new}' AND idpo='${get_var[i].idpo}'`
        );

        qty_sales -= availableQty;
      }
    }
    // === SELESAI PROSES PENAMBAHAN BARANG RETUR ===

    // === PROSES PENGEMBALIAN BARANG RETUR KE GUDANG (Ukuran Lama) ===
    const [get_dataorder] = await connection.query(
      `SELECT * FROM tb_order 
       WHERE id_pesanan='${body.id_pesanan}' AND id_produk='${body.id_produk}' AND size='${body.size_old}' AND source='${body.source}' 
       ORDER BY idpo ASC`
    );

    let qty_retur = parseInt(body.qty_new);

    for (let x = 0; x < get_dataorder.length && qty_retur > 0; x++) {
      if (get_dataorder[x].source === "Barang Gudang") {
        const orderQty = parseInt(get_dataorder[x].qty);
        const remainingAfterOrder = qty_retur - orderQty; // jika >= 0, order terpakai seluruhnya
        const sisa_qty_order = orderQty - qty_retur;  // sisa jika tidak seluruhnya terpakai

        if (remainingAfterOrder >= 0) {
          // Gunakan seluruh qty dari order ini untuk retur
          await connection.query(
            `INSERT INTO tb_mutasistock
              (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
              VALUES ('${id_mutasi}','${tanggal_skrg}','${get_dataorder[x].id_pesanan}','${get_dataorder[x].id_ware}','${get_dataorder[x].id_store}','${get_dataorder[x].id_produk}','${get_dataorder[x].produk}','${get_dataorder[x].idpo}','${get_dataorder[x].size}','${orderQty}','${get_dataorder[x].source}','-','RETUR_IN','${body.users}','${tanggal}','${tanggal}')`
          );

          // --- Update stok di tb_variation ---
          let [get_qty_old] = await connection.query(
            `SELECT * FROM tb_variation 
             WHERE id_produk='${body.id_produk}' AND id_ware='${get_dataorder[x].id_ware}' 
               AND size='${get_dataorder[x].size}' AND idpo='${get_dataorder[x].idpo}'`
          );
          if (get_qty_old.length > 0) {
            await connection.query(
              `UPDATE tb_variation SET qty='${parseInt(get_qty_old[0].qty) + orderQty}', updated_at='${tanggal}' 
               WHERE id_produk='${body.id_produk}' AND id_ware='${get_dataorder[x].id_ware}' 
                 AND size='${get_dataorder[x].size}' AND idpo='${get_dataorder[x].idpo}'`
            );
          } else {
            // Jika tidak ditemukan, update record terakhir berdasarkan id_produk & id_ware
            const [get_last_variation] = await connection.query(
              `SELECT * FROM tb_variation 
               WHERE id_produk='${body.id_produk}' AND id_ware='${get_dataorder[x].id_ware}' AND size='${body.size_old}' 
               ORDER BY id DESC,qty DESC LIMIT 1`
            );
            if (get_last_variation.length > 0) {
              await connection.query(
                `UPDATE tb_variation SET qty='${parseInt(get_last_variation[0].qty) + orderQty}', updated_at='${tanggal}' 
                 WHERE id='${get_last_variation[0].id}'`
              );
            }
          }
          // --- End Update stok ---

          // Jika seluruh order terpakai, hapus order; jika tidak, perbarui qty order
          if (sisa_qty_order > 0) {
            await connection.query(
              `UPDATE tb_order SET qty='${sisa_qty_order}', diskon_item='${parseInt(get_dataorder[x].diskon_item) - hasil_diskon}', subtotal='${(parseInt(get_dataorder[x].selling_price) * sisa_qty_order) - (parseInt(get_dataorder[x].diskon_item) - hasil_diskon)}', updated_at='${tanggal}' 
               WHERE id='${get_dataorder[x].id}'`
            );
          } else {
            await connection.query(
              `DELETE FROM tb_order WHERE id='${get_dataorder[x].id}'`
            );
          }

          qty_retur -= orderQty;
        } else {
          // Kasus di mana hanya sebagian order yang digunakan untuk retur
          await connection.query(
            `INSERT INTO tb_mutasistock
              (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
              VALUES ('${id_mutasi}','${tanggal_skrg}','${get_dataorder[x].id_pesanan}','${get_dataorder[x].id_ware}','${get_dataorder[x].id_store}','${get_dataorder[x].id_produk}','${get_dataorder[x].produk}','${get_dataorder[x].idpo}','${get_dataorder[x].size}','${qty_retur}','Barang Gudang','-','RETUR_IN','${body.users}','${tanggal}','${tanggal}')`
          );

          let [get_qty_old] = await connection.query(
            `SELECT * FROM tb_variation 
             WHERE id_produk='${body.id_produk}' AND id_ware='${get_dataorder[x].id_ware}' 
               AND size='${get_dataorder[x].size}' AND idpo='${get_dataorder[x].idpo}'`
          );
          if (get_qty_old.length > 0) {
            await connection.query(
              `UPDATE tb_variation SET qty='${parseInt(get_qty_old[0].qty) + qty_retur}', updated_at='${tanggal}' 
               WHERE id_produk='${body.id_produk}' AND id_ware='${get_dataorder[x].id_ware}' 
                 AND size='${get_dataorder[x].size}' AND idpo='${get_dataorder[x].idpo}'`
            );
          } else {
            const [get_last_variation] = await connection.query(
              `SELECT * FROM tb_variation 
              WHERE id_produk='${body.id_produk}' AND id_ware='${get_dataorder[x].id_ware}' AND size='${body.size_old}' 
              ORDER BY id DESC,qty DESC LIMIT 1`
            );
            if (get_last_variation.length > 0) {
              await connection.query(
                `UPDATE tb_variation SET qty='${parseInt(get_last_variation[0].qty) + qty_retur}', updated_at='${tanggal}' 
                 WHERE id='${get_last_variation[0].id}'`
              );
            }
          }
          const updatedQty = orderQty - qty_retur;
          await connection.query(
            `UPDATE tb_order SET qty='${updatedQty}', diskon_item='${parseInt(get_dataorder[x].diskon_item) - hasil_diskon}', subtotal='${(parseInt(get_dataorder[x].selling_price) * updatedQty) - (parseInt(get_dataorder[x].diskon_item) - hasil_diskon)}', updated_at='${tanggal}' 
             WHERE id='${get_dataorder[x].id}'`
          );
          qty_retur = 0;
        }
      }
    }
    // === SELESAI PROSES PENGEMBALIAN BARANG RETUR KE GUDANG ===

    // Simpan data retur ke tb_retur
    await connection.query(
      `INSERT INTO tb_retur 
        (tanggal_retur, id_pesanan, id_produk, id_store, produk, source, idpo, size_lama, size_baru, qty_retur, keterangan, users, created_at, updated_at)
        VALUES ('${tanggal_skrg}','${id_pesanan}','${id_produk}','${get_pesanan_awal[0].id_store}','${produk}','${body.source}','${get_var.length > 0 ? get_var[0].idpo : body.idpo}','${body.size_old}','${body.size_new}','${body.qty_new}','Tukar Size','${body.users}','${tanggal}','${tanggal}')`
    );

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.rollback();
    await connection.release();
  }
};

const returLuar = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

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

  const [cek_notabarang] = await connection.query(
    `SELECT MAX(id_nota) as id_nota FROM tb_notabarang`
  );
  if (cek_notabarang[0].id_nota === null) {
    var id_nota = "EXT-" + "0000001";
  } else {
    const get_last2 = cek_notabarang[0].id_nota;
    const data_2 = get_last2.toString().slice(-7);
    const hasil = parseInt(data_2) + 1;
    var id_nota = "EXT-" + String(hasil).padStart(7, "0");
  }
  try {
    await connection.beginTransaction();

    const [get_produk] = await connection.query(
      `SELECT * FROM tb_order WHERE id_pesanan='${body.LuarIdPesanan}' AND id_produk='${body.LuarIdProduk}'`
    );

    var qty_sisa = parseInt(body.LuarOldQty) - parseInt(body.LuarQtyNew);

    const [get_store] = await connection.query(
      `SELECT * FROM tb_store WHERE id_store='${get_produk[0].id_store}'`
    );

    if (qty_sisa === 0) {
      var [get_produk_grup] = await connection.query(
        `SELECT * FROM tb_order WHERE id_pesanan='${body.LuarIdPesanan}' AND id_produk='${body.LuarIdProduk}'`
      );
      // Add Nota Barang Baru
      await connection.query(
        `INSERT INTO tb_notabarang
            (id_nota, id_ware, id_brand, id_category, id_sup, tanggal_upload, produk, size, qty, deskripsi, quality, status_pesanan, m_price, selling_price, payment, img, users, created_at, updated_at)
            VALUES ('${id_nota}','EXTERNAL','-','-','${body.LuarSupplier
        }','${tanggal_skrg}','${body.LuarProduk}','${body.LuarSize}','${body.LuarQtyNew
        }','${get_produk_grup[0].id_pesanan +
        " - " +
        get_store[0].store +
        " -SALES "
        }','-','SEDANG DIKIRIM','${body.LuarHargaBeli}','${body.LuarHargaBeli
        }','${body.LuarPayment
        }','box.png','ADMIN-NEXTJS','${tanggal}','${tanggal}')`
      );

      var [get_supp] = await connection.query(
        `SELECT * FROM tb_supplier WHERE id_sup='${body.LuarSupplier}'`
      );

      await connection.query(
        `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','${body.LuarIdPesanan}','EXTERNAL','${get_produk[0].id_store}','${id_nota}','${body.LuarProduk}','${id_nota}','${body.LuarSize}','${body.LuarQtyNew}','Barang Luar','${get_supp[0].supplier}','RETUR_OUT','${tanggal}','${tanggal}')`
      );
      // End Add Nota Barang Baru
      //
      // Update Nota Barang Lama
      if (body.StatusBarangRetur === "STOKAN") {
        await connection.query(
          `UPDATE tb_notabarang SET status_pesanan='RETUR',updated_at='${tanggal}' WHERE id_nota='${body.LuarIdProduk}' AND deskripsi LIKE '%${body.LuarIdPesanan}%'`
        );

        var [get_nota] = await connection.query(
          `SELECT * FROM tb_notabarang WHERE id_nota='${body.LuarIdProduk}' AND deskripsi LIKE '%${body.LuarIdPesanan}%'`
        );

        var [get_supp] = await connection.query(
          `SELECT * FROM tb_supplier WHERE id_sup='${get_nota[0].id_sup}'`
        );

        await connection.query(
          `INSERT INTO tb_mutasistock
                (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
                VALUES ('${id_mutasi}','${tanggal_skrg}','${body.LuarIdPesanan}','EXTERNAL','${get_produk[0].id_store}','${body.LuarIdProduk}','${body.LuarProduk}','${body.LuarIdProduk}','${get_nota[0].size}','${body.LuarQtyNew}','Barang Luar','${get_supp[0].supplier}','RETUR_IN','${tanggal}','${tanggal}')`
        );
      } else {
        var [get_nota] = await connection.query(
          `SELECT * FROM tb_notabarang WHERE id_nota='${body.LuarIdProduk}' AND deskripsi LIKE '%${body.LuarIdPesanan}%'`
        );

        var [get_supp] = await connection.query(
          `SELECT * FROM tb_supplier WHERE id_sup='${get_nota[0].id_sup}'`
        );

        await connection.query(
          `INSERT INTO tb_mutasistock
                (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
                VALUES ('${id_mutasi}','${tanggal_skrg}','${body.LuarIdPesanan}','EXTERNAL','${get_produk[0].id_store}','${body.LuarIdProduk}','${body.LuarProduk}','${body.LuarIdProduk}','${get_nota[0].size}','${body.LuarQtyNew}','Barang Luar','${get_supp[0].supplier}','RETUR_IN','${tanggal}','${tanggal}')`
        );

        await connection.query(
          `DELETE FROM tb_notabarang WHERE id_nota='${body.LuarIdProduk}' AND deskripsi LIKE '%${body.LuarIdPesanan}%'`
        );

        await connection.query(
          `UPDATE tb_order SET size='${body.LuarSize
          }',id_produk='${id_nota}',idpo='${id_nota}',m_price='${body.LuarHargaBeli
          }',selling_price='${body.LuarHargaBeli}',subtotal='${parseInt(body.LuarHargaBeli) * parseInt(body.LuarQtyNew)
          }',updated_at='${tanggal}' WHERE id_pesanan='${body.LuarIdPesanan
          }' AND id_produk='${body.LuarIdProduk}'`
        );
      }
    } else {
      var [get_produk_grup] = await connection.query(
        `SELECT * FROM tb_order WHERE id_pesanan='${body.LuarIdPesanan}' AND id_produk='${body.LuarIdProduk}'`
      );

      var tanggal_order = get_produk_grup[0].tanggal_order;
      var id_pesanan = get_produk_grup[0].id_pesanan;
      var id_brand = get_produk_grup[0].id_brand;
      var id_store = get_produk_grup[0].id_store;
      var id_produk = get_produk_grup[0].id_produk;
      var produk = get_produk_grup[0].produk;
      var img = get_produk_grup[0].img;
      var quality = get_produk_grup[0].quality;

      await connection.query(
        `INSERT INTO tb_notabarang
            (id_nota, id_ware, id_brand, id_category, id_sup, tanggal_upload, produk, size, qty, deskripsi, quality, status_pesanan, m_price, selling_price, payment, img, users, created_at, updated_at)
            VALUES ('${id_nota}','EXTERNAL','-','-','${body.LuarSupplier
        }','${tanggal_skrg}','${body.LuarProduk}','${body.LuarSize}','${body.LuarQtyNew
        }','${get_produk_grup[0].id_pesanan +
        " - " +
        get_store[0].store +
        " -SALES "
        }','-','SEDANG DIKIRIM','${body.LuarHargaBeli}','${body.LuarHargaBeli
        }','${body.LuarPayment
        }','box.png','ADMIN-NEXTJS','${tanggal}','${tanggal}')`
      );

      await connection.query(
        `INSERT INTO tb_order
            (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
            VALUES ('${tanggal_order}','${id_pesanan}','${id_store}','${id_produk}','Barang Luar','box.png','${produk}','${id_brand}','EXTERNAL','${id_nota}','${quality}','${body.LuarSize
        }','${body.LuarQtyNew}','${body.LuarHargaBeli}','${body.LuarHargaBeli
        }','0','${parseInt(body.LuarHargaBeli) * parseInt(body.LuarQtyNew)
        }','ADMIN-NEXTJS','${tanggal}','${tanggal}')`
      );

      var [get_supp] = await connection.query(
        `SELECT * FROM tb_supplier WHERE id_sup='${body.LuarSupplier}'`
      );

      await connection.query(
        `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan}','EXTERNAL','${id_store}','${id_nota}','${produk}','${id_nota}','${body.LuarSize}','${body.LuarQtyNew}','Barang Luar','${get_supp[0].supplier}','RETUR_OUT','${tanggal}','${tanggal}')`
      );

      var [get_nota] = await connection.query(
        `SELECT * FROM tb_notabarang WHERE id_nota='${body.LuarIdProduk}' AND deskripsi LIKE '%${body.LuarIdPesanan}%'`
      );

      if (body.StatusBarangRetur === "STOKAN") {
        await connection.query(
          `INSERT INTO tb_notabarang
                (id_nota, id_ware, id_brand, id_category, id_sup, tanggal_upload, produk, size, qty, deskripsi, quality, status_pesanan, m_price, selling_price, payment, img, users, created_at, updated_at)
                VALUES ('${get_nota[0].id_nota}','EXTERNAL','-','-','${get_nota[0].id_sup}','${get_nota[0].tanggal_upload}','${get_nota[0].produk}','${get_nota[0].size}','${body.LuarQtyNew}','${get_nota[0].deskripsi}','-','RETUR','${get_nota[0].m_price}','${get_nota[0].selling_price}','${get_nota[0].payment}','${get_nota[0].img}','${get_nota[0].users}','${tanggal}','${tanggal}')`
        );

        var [get_supp] = await connection.query(
          `SELECT * FROM tb_supplier WHERE id_sup='${get_nota[0].id_sup}'`
        );

        await connection.query(
          `INSERT INTO tb_mutasistock
                (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
                VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan}','EXTERNAL','${id_store}','${get_nota[0].id_nota}','${get_nota[0].produk}','${get_nota[0].id_nota}','${get_nota[0].size}','${body.LuarQtyNew}','Barang Luar','${get_supp[0].supplier}','RETUR_IN','${tanggal}','${tanggal}')`
        );
      } else {
        var [get_supp] = await connection.query(
          `SELECT * FROM tb_supplier WHERE id_sup='${get_nota[0].id_sup}'`
        );

        await connection.query(
          `INSERT INTO tb_mutasistock
                (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
                VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan}','EXTERNAL','${id_store}','${get_nota[0].id_nota}','${get_nota[0].produk}','${get_nota[0].id_nota}','${get_nota[0].size}','${body.LuarQtyNew}','Barang Luar','${get_supp[0].supplier}','RETUR_IN','${tanggal}','${tanggal}')`
        );
      }

      await connection.query(
        `UPDATE tb_notabarang SET qty='${parseInt(get_nota[0].qty) - parseInt(body.LuarQtyNew)
        }',updated_at='${tanggal}' WHERE id_nota='${body.LuarIdProduk
        }' AND deskripsi LIKE '%${body.LuarIdPesanan
        }%' AND status_pesanan='SEDANG DIKIRIM'`
      );

      await connection.query(
        `UPDATE tb_order SET qty='${parseInt(get_produk_grup[0].qty) - parseInt(body.LuarQtyNew)
        }',subtotal='${parseInt(get_nota[0].m_price) *
        (parseInt(get_produk_grup[0].qty) - parseInt(body.LuarQtyNew))
        }',updated_at='${tanggal}' WHERE id_pesanan='${body.LuarIdPesanan
        }' AND id_produk='${body.LuarIdProduk}' AND idpo='${body.LuarIdProduk}'`
      );

    }

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deletePesanan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

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
  console.log("body", body);

  var id_pesanan = body.id_pesanan;
  var status = body.status;
  try {
    await connection.beginTransaction();

    if (status != "CANCEL") {
      var [get_pesanan] = await connection.query(
        `SELECT * FROM tb_order WHERE id_pesanan='${id_pesanan}'`
      );

      for (let i = 0; i < get_pesanan.length; i++) {
        if (get_pesanan[i].source === "Barang Gudang") {
          var [get_qty_old] = await connection.query(
            `SELECT * FROM tb_variation WHERE id_produk='${get_pesanan[i].id_produk}' AND id_ware='${get_pesanan[i].id_ware}' AND size='${get_pesanan[i].size}' AND idpo='${get_pesanan[i].idpo}'`
          );
          var [get_qty_old_self] = await connection.query(
            `SELECT * FROM tb_variation WHERE id_produk='${get_pesanan[i].id_produk}' AND id_ware='${get_pesanan[i].id_ware}' AND size='${get_pesanan[i].size}' ORDER BY id DESC,qty DESC LIMIT 1`
          );

          if (get_qty_old.length > 0) {
            await connection.query(
              `UPDATE tb_variation SET qty='${parseInt(get_qty_old[0].qty) + parseInt(get_pesanan[i].qty)
              }',updated_at='${tanggal}' WHERE id_produk='${get_pesanan[i].id_produk
              }' AND id_ware='${get_pesanan[i].id_ware}' AND size='${get_pesanan[i].size
              }' AND idpo='${get_pesanan[i].idpo}'`
            );
            await connection.query(
              `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','${get_pesanan[i].id_pesanan}','${get_pesanan[i].id_ware}','${get_pesanan[i].id_store}','${get_pesanan[i].id_produk}','${get_pesanan[i].produk}','${get_pesanan[i].idpo}','${get_pesanan[i].size}','${get_pesanan[i].qty}','${get_pesanan[i].source}','-','DELETE_ORDER','${body.users}','${tanggal}','${tanggal}')`
            );
          } else {
            await connection.query(
              `UPDATE tb_variation SET qty='${parseInt(get_qty_old_self[0].qty) + parseInt(get_pesanan[i].qty)
              }',updated_at='${tanggal}' WHERE id_produk='${get_pesanan[i].id_produk
              }' AND id_ware='${get_pesanan[i].id_ware}' AND size='${get_pesanan[i].size
              }' AND idpo='${get_qty_old_self[0].idpo}'`
            );
            await connection.query(
              `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','${get_pesanan[i].id_pesanan}','${get_pesanan[i].id_ware}','${get_pesanan[i].id_store}','${get_pesanan[i].id_produk}','${get_pesanan[i].produk}','${get_pesanan[i].idpo}','${get_pesanan[i].size}','${get_pesanan[i].qty}','${get_pesanan[i].source}','-','DELETE_ORDER','${body.users}','${tanggal}','${tanggal}')`
            );
          }

        } else {
          await connection.query(
            `UPDATE tb_notabarang SET status_pesanan='CANCEL',updated_at='${tanggal}' WHERE id_nota='${get_pesanan[i].idpo}'`
          );

          var [get_nota] = await connection.query(
            `SELECT * FROM tb_notabarang WHERE id_nota='${get_pesanan[i].idpo}'`
          );

          var [get_supp] = await connection.query(
            `SELECT * FROM tb_supplier WHERE id_sup='${get_nota[0].id_sup}'`
          );

          await connection.query(
            `INSERT INTO tb_mutasistock
                    (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                    VALUES ('${id_mutasi}','${tanggal_skrg}','${get_pesanan[i].id_pesanan}','${get_pesanan[i].id_ware}','${get_pesanan[i].id_store}','${get_pesanan[i].id_produk}','${get_pesanan[i].produk}','${get_pesanan[i].idpo}','${get_pesanan[i].size}','${get_pesanan[i].qty}','Barang Luar','${get_supp[0].supplier}','DELETE_ORDER','${body.users}','${tanggal}','${tanggal}')`
          );
        }
      }

    }

    await connection.query(
      `DELETE FROM tb_invoice WHERE id_pesanan='${id_pesanan}'`
    );

    await connection.query(
      `DELETE FROM tb_order WHERE id_pesanan='${id_pesanan}'`
    );

    await connection.query(
      `DELETE FROM tb_payment WHERE id_invoice='${id_pesanan}'`
    );

    await connection.query(
      `DELETE FROM tb_history_payment WHERE id_invoice='${id_pesanan}'`
    );

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};


const updatePesanan = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

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

  var id_pesanan = body.id_pesanan;
  var status = body.status;

  await connection.query(
    `UPDATE tb_invoice SET status_pesanan='${status}',tanggal_update='${tanggal_skrg}',updated_at='${tanggal}' WHERE id_pesanan='${id_pesanan}'`
  );

  const [get_pesanan] = await connection.query(
    `SELECT * FROM tb_order WHERE id_pesanan='${id_pesanan}'`
  );
  try {
    await connection.beginTransaction();

    if (status === "CANCEL") {
      for (let i = 0; i < get_pesanan.length; i++) {
        if (get_pesanan[i].source === "Barang Gudang") {
          var [get_qty_old] = await connection.query(
            `SELECT * FROM tb_variation WHERE id_produk='${get_pesanan[i].id_produk}' AND id_ware='${get_pesanan[i].id_ware}' AND size='${get_pesanan[i].size}' AND idpo='${get_pesanan[i].idpo}'`
          );

          // Update Variation Old QTY
          await connection.query(
            `UPDATE tb_variation SET qty='${parseInt(get_qty_old[0].qty) + parseInt(get_pesanan[i].qty)
            }',updated_at='${tanggal}' WHERE id_produk='${get_pesanan[i].id_produk
            }' AND id_ware='${get_pesanan[i].id_ware}' AND size='${get_pesanan[i].size
            }' AND idpo='${get_pesanan[i].idpo}'`
          );
          //
          await connection.query(
            `INSERT INTO tb_mutasistock
                    (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
                    VALUES ('${id_mutasi}','${tanggal_skrg}','${get_pesanan[i].id_pesanan}','${get_pesanan[i].id_ware}','${get_pesanan[i].id_store}','${get_pesanan[i].id_produk}','${get_pesanan[i].produk}','${get_pesanan[i].idpo}','${get_pesanan[i].size}','${get_pesanan[i].qty}','${get_pesanan[i].source}','-','CANCEL_ORDER','${tanggal}','${tanggal}')`
          );
        } else {
          await connection.query(
            `UPDATE tb_notabarang SET status_pesanan='CANCEL',updated_at='${tanggal}' WHERE id_nota='${get_pesanan[i].idpo}'`
          );

          var [get_nota] = await connection.query(
            `SELECT * FROM tb_notabarang WHERE id_nota='${get_pesanan[i].idpo}'`
          );

          var [get_supp] = await connection.query(
            `SELECT * FROM tb_supplier WHERE id_sup='${get_nota[0].id_sup}'`
          );

          await connection.query(
            `INSERT INTO tb_mutasistock
                    (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, created_at, updated_at)
                    VALUES ('${id_mutasi}','${tanggal_skrg}','${get_pesanan[i].id_pesanan}','${get_pesanan[i].id_ware}','${get_pesanan[i].id_store}','${get_pesanan[i].id_produk}','${get_pesanan[i].produk}','${get_pesanan[i].idpo}','${get_pesanan[i].size}','${get_pesanan[i].qty}','Barang Luar','${get_supp[0].supplier}','CANCEL_ORDER','${tanggal}','${tanggal}')`
          );
        }
      }
    } else if (status === "SELESAI") {
      for (let x = 0; x < get_pesanan.length; x++) {
        if (get_pesanan[x].source === "Barang Gudang") {
        } else {
          await connection.query(
            `UPDATE tb_notabarang SET status_pesanan='SELESAI',updated_at='${tanggal}' WHERE id_nota='${get_pesanan[x].idpo}'`
          );
        }
      }
    }

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const gudangretur = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  try {
    await connection.beginTransaction();

    const [data_role] = await connection.query(
      `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
    );

    if (body.role === 'SUPER-ADMIN') {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse`
      );
    } else if (body.role === 'HEAD-AREA') {
      var [data_ware] = await connection.query(
        `SELECT * FROM tb_warehouse WHERE id_area='${body.area}'`
      );
    } else {
      var [list_data_role] = await connection.query(
        `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.area}'`
      );
      var [data_ware] = await connection.query(
        `SELECT tb_store.*,tb_warehouse.* FROM tb_store LEFT JOIN tb_warehouse ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_store.id_store='${list_data_role[0].id_store}'`
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

const cekbarcode = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  try {
    await connection.beginTransaction();

    const [cek_ketersediaan] = await connection.query(
      `SELECT id_ware,qty FROM tb_variation WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' AND size='${body.size}' GROUP BY id_ware`
    );
    for (let index = 0; index < cek_ketersediaan.length; index++) {
      if (cek_ketersediaan[index].id_ware === body.idware) {
        var hasil_cekbarcode = "GO";
      }
    }

    const [cek_produk] = await connection.query(
      `SELECT img,produk,id_produk,g_price,r_price,n_price FROM tb_produk WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'`
    );

    await connection.commit();
    await connection.release();

    return {
      cek_produk,
      hasil_cekbarcode
    };


  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const syncorder = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const data = body.data;

  try {
    await connection.beginTransaction();

    // Generate Mutasi ID
    const [cekMutasi] = await connection.query(`SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`);
    const idMutasi = cekMutasi[0].id_mutasi
      ? `MT-${(parseInt(cekMutasi[0].id_mutasi.slice(-8)) + 1).toString().padStart(8, "0")}`
      : "MT-00000001";

    // Check Order ID
    const [cekPesanan] = await connection.query(`SELECT id_pesanan FROM tb_order WHERE id_pesanan='${body.id_pesanan}'`);
    if (cekPesanan.length > 0) return "already_used";

    // Calculate Total Modal
    let totalModal = 0;
    for (const item of data) {
      if (item.source === "Barang Luar") {
        totalModal += parseInt(item.harga_beli);
      } else {
        const [getPurchase] = await connection.query(
          `SELECT AVG(g_price) as g_price FROM tb_produk WHERE id_produk='${item.idproduk}' AND id_ware='${item.id_ware}'`
        );
        totalModal += Math.round(getPurchase[0].g_price) * item.qty;
      }
    }

    if (body.total_amount < totalModal) return "undermodal";

    // Process Order Items
    for (const item of data) {
      // Handle Display Logic
      if (body.status_display === "display_true") {
        await connection.query(
          `DELETE FROM displays WHERE id_produk='${item.idproduk}' AND id_ware='${item.id_ware}'`
        );
      }

      // Get Product and Variations
      const [getProduk] = await connection.query(
        `SELECT * FROM tb_produk WHERE id_produk='${item.idproduk}' AND id_ware='${item.id_ware}'`
      );
      const [variations] = await connection.query(
        `SELECT * FROM tb_variation WHERE id_produk='${item.idproduk}' AND id_ware='${item.id_ware}' AND size='${item.size}' AND qty > 0 ORDER BY id ASC`
      );

      let qtySales = item.qty;

      // Update Variations and Insert Order/Mutasi
      for (const variation of variations) {
        const qtyBaru = variation.qty - qtySales;
        const qtyToProcess = qtyBaru >= 0 ? qtySales : variation.qty;

        const [getModal] = await connection.query(
          `SELECT m_price FROM tb_purchaseorder WHERE idpo='${variation.idpo}' AND id_produk='${item.idproduk}'`
        );

        // Insert Order
        await connection.query(
          `INSERT INTO tb_order (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
           VALUES ('${body.tanggal}', '${body.id_pesanan}', '${body.id_store}', '${item.idproduk}', 'Barang Gudang', '${item.img}', '${item.produk}', '${getProduk[0].id_brand}', '${item.id_ware}', '${variation.idpo}', '${getProduk[0].quality}', '${item.size}', '${qtyToProcess}', '${getModal[0].m_price}', '${item.harga_jual}', '0', '${item.harga_jual * qtyToProcess}', '${body.users}', '${tanggal}', '${tanggal}')`
        );

        // Insert Mutasi
        await connection.query(
          `INSERT INTO tb_mutasistock (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
           VALUES ('${idMutasi}', '${body.tanggal}', '${body.id_pesanan}', '${item.id_ware}', '${body.id_store}', '${item.idproduk}', '${item.produk}', '${variation.idpo}', '${item.size}', '${qtyToProcess}', 'Barang Gudang', '-', 'SALES ONLINE', '${body.users}', '${tanggal}', '${tanggal}')`
        );

        // Update Variation Stock
        await connection.query(
          `UPDATE tb_variation SET qty='${Math.max(0, qtyBaru)}', updated_at='${tanggal}' WHERE id_produk='${item.idproduk}' AND id_ware='${item.id_ware}' AND size='${item.size}' AND idpo='${variation.idpo}'`
        );

        qtySales -= qtyToProcess;
        if (qtySales <= 0) break;
      }
    }

    // Generate Invoice ID
    const [cekInvoice] = await connection.query(`SELECT MAX(id_invoice) as id_invoice FROM tb_invoice`);
    const idInvoice = cekInvoice[0].id_invoice
      ? `INV-${(parseInt(cekInvoice[0].id_invoice.slice(-9)) + 1).toString().padStart(9, "0")}`
      : "INV-000000001";

    const [get_store] = await connection.query(
      `SELECT * FROM tb_store WHERE id_store='${body.id_store}'`
    );
    // Insert Invoice
    await connection.query(
      `INSERT INTO tb_invoice (tanggal_order, id_invoice, id_pesanan, customer, type_customer, sales_channel, amount, diskon_nota, biaya_lainnya, total_amount, selisih, status_pesanan, payment, reseller, users, created_at, updated_at)
       VALUES ('${body.tanggal}', '${idInvoice}', '${body.id_pesanan}', '${body.id_store}', '${get_store[0].channel}', '${get_store[0].channel}', '${body.total_amount}', '0', '0', '${body.total_amount}', '0', 'SELESAI', 'PAID', '-', '${body.users}', '${tanggal}', '${tanggal}')`
    );

    await connection.commit();
    return "success";
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const syncordermassal = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const data = body.data;
  console.log("body syncordermassal", data);

  try {
    await connection.beginTransaction();

    // 1. Cek pesanan yang sudah ada (berdasarkan id_pesanan)
    const orderIds = [...new Set(data.map(item => item.id_pesanan))];
    const [cekPesananGlobal] = await connection.query(
      `SELECT id_pesanan FROM tb_order 
       WHERE id_pesanan IN (${orderIds.map(id => `'${id}'`).join(",")})
       GROUP BY id_pesanan`
    );
    const existingOrders = new Set(cekPesananGlobal.map(order => order.id_pesanan));
    const skippedOrders = [];
    const processedOrders = new Map();

    // 2. Kelompokkan data per id_pesanan
    const groupedOrders = data.reduce((acc, item) => {
      if (!acc[item.id_pesanan]) {
        acc[item.id_pesanan] = {
          items: [],
          totalAmount: item.total_amount, // Simpan totalAmount
        };
      }
      acc[item.id_pesanan].items.push(item);
      return acc;
    }, {});

    // 3. Prefetch data produk (berdasarkan pasangan unik idproduk dan id_ware)
    const uniqueProductPairs = {};
    data.forEach(item => {
      uniqueProductPairs[`${item.idproduk}_${item.id_ware}`] = { idproduk: item.idproduk, id_ware: item.id_ware };
    });
    const productWhere = Object.values(uniqueProductPairs)
      .map(pair => `(id_produk='${pair.idproduk}' AND id_ware='${pair.id_ware}')`)
      .join(" OR ");
    const productKeyMap = new Map();
    if (productWhere) {
      const [products] = await connection.query(`SELECT * FROM tb_produk WHERE ${productWhere}`);
      products.forEach(p => {
        productKeyMap.set(`${p.id_produk}_${p.id_ware}`, p);
      });
    }

    // 4. Prefetch data variasi (tb_variation)
    // Gunakan CAST(size AS CHAR) jika kolom size di database bukan tipe string
    const uniqueVariationKeys = {};
    data.forEach(item => {
      const key = `${item.idproduk}_${item.id_ware}_${item.size}`;
      uniqueVariationKeys[key] = { idproduk: item.idproduk, id_ware: item.id_ware, size: item.size };
    });
    const variationWhere = Object.values(uniqueVariationKeys)
      .map(v => `(id_produk='${v.idproduk}' AND id_ware='${v.id_ware}' AND CAST(size AS CHAR)= '${v.size}' AND qty > 0)`)
      .join(" OR ");
    const [allVariations] = await connection.query(
      `SELECT * FROM tb_variation WHERE ${variationWhere} ORDER BY id ASC`
    );
    // Kelompokkan variasi berdasarkan key "idproduk_id_ware_size"
    const variationMap = {};
    allVariations.forEach(variation => {
      const key = `${variation.id_produk}_${variation.id_ware}_${variation.size}`;
      if (!variationMap[key]) variationMap[key] = [];
      variationMap[key].push(variation);
    });

    // 5. Prefetch Purchase Order (tb_purchaseorder) untuk variasi yang diambil
    const uniquePOKeys = {};
    allVariations.forEach(v => {
      const key = `${v.idpo}_${v.id_produk}`;
      uniquePOKeys[key] = { idpo: v.idpo, id_produk: v.id_produk };
    });
    const poWhere = Object.values(uniquePOKeys)
      .map(po => `(idpo='${po.idpo}' AND id_produk='${po.id_produk}')`)
      .join(" OR ");
    const [purchaseOrders] = await connection.query(
      `SELECT idpo, id_produk, m_price FROM tb_purchaseorder WHERE ${poWhere}`
    );
    const poMap = new Map();
    purchaseOrders.forEach(po => {
      poMap.set(`${po.idpo}_${po.id_produk}`, po.m_price);
    });

    // 6. Dapatkan nilai terakhir id_mutasi untuk generate id_mutasi baru
    const [cekMutasi] = await connection.query(`SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`);
    let lastMutasi = cekMutasi[0].id_mutasi ? parseInt(cekMutasi[0].id_mutasi.slice(-8)) : 0;

    // Siapkan array untuk bulk INSERT dan UPDATE
    const orderInserts = [];     // Untuk INSERT ke tb_order
    const mutasiInserts = [];    // Untuk INSERT ke tb_mutasistock
    const variationUpdates = []; // Untuk UPDATE tb_variation

    // 7. Proses tiap order (per id_pesanan)
    for (const [id_pesanan, orderGroup] of Object.entries(groupedOrders)) {
      // Jika order sudah ada di database, skip
      if (existingOrders.has(id_pesanan)) {
        skippedOrders.push({ id_pesanan, reason: "Order ID already exists in the database." });
        continue;
      }

      // Lakukan validasi stok untuk seluruh item dalam order
      let orderFulfillable = true;
      let insufficientDetails = [];
      for (const item of orderGroup.items) {
        const { idproduk, id_ware, size } = item;
        const requestedQty = Number(item.qty);
        const key = `${idproduk}_${id_ware}_${size}`;
        const variations = variationMap[key] || [];
        // Jumlah stok tersedia dari semua variasi untuk key ini
        const totalAvailable = variations.reduce((sum, variation) => {
          return sum + Number(variation.qty);
        }, 0);
        if (totalAvailable < requestedQty) {
          orderFulfillable = false;
          insufficientDetails.push({ idproduk, size, requestedQty, totalAvailable });
        }
      }
      if (!orderFulfillable) {
        skippedOrders.push({ id_pesanan, reason: "stok tidak tercukupi", details: insufficientDetails });
        continue; // Skip proses order ini
      }

      // Jika order memenuhi syarat, proses tiap item dalam order
      for (const item of orderGroup.items) {
        const { idproduk, id_ware, size, harga_jual, id_store } = item;
        const requestedQty = Number(item.qty);  // nilai asli dari frontend
        // Simpan nilai awal requestedQty agar digunakan di insert ke tb_order
        const product = productKeyMap.get(`${idproduk}_${id_ware}`);
        if (!product) continue;

        // Insert ke tb_order menggunakan requestedQty

        // Proses pengurangan stok untuk item ini
        let variationIdpo = null;
        let remainingQty = requestedQty;
        const variationKey = `${idproduk}_${id_ware}_${size}`;
        const variations = variationMap[variationKey] || [];
        for (const variation of variations) {
          // Set variationIdpo jika belum diset
          if (variationIdpo === null) {
            variationIdpo = variation.idpo;
          }

          if (remainingQty <= 0) break;
          const availableQty = Number(variation.qty);
          // qtyToProcess adalah jumlah yang dapat diambil dari variasi ini
          const qtyToProcess = availableQty >= remainingQty ? remainingQty : availableQty;
          const newQty = availableQty - qtyToProcess;
          const m_price = poMap.get(`${variation.idpo}_${idproduk}`) || 0;
          lastMutasi += 1;
          const idMutasi = `MT-${lastMutasi.toString().padStart(8, "0")}`;

          mutasiInserts.push(
            `('${idMutasi}', '${body.tanggal}', '${id_pesanan}', '${id_ware}', '${id_store}', '${idproduk}', '${item.produk}', '${variation.idpo}', '${size}', ${qtyToProcess}, 'Barang Gudang', '-', 'SALES ONLINE', '${body.users}', '${tanggal}', '${tanggal}')`
          );
          variationUpdates.push({
            key: `${idproduk}_${id_ware}_${size}_${variation.idpo}`,
            newQty
          });
          // Perbarui stok di memori (variationMap) agar tidak diproses dua kali
          variation.qty = newQty;
          remainingQty -= qtyToProcess;
        }
        const [getModal] = await connection.query(
          `SELECT m_price FROM tb_purchaseorder WHERE idpo='${variationIdpo}' AND id_produk='${idproduk}'`
        );
        const modalPrice = getModal.length && getModal[0].m_price != null ? getModal[0].m_price : 0;
        orderInserts.push(
          `('${body.tanggal}', '${id_pesanan}', '${id_store}', '${idproduk}', 'Barang Gudang', '${item.img}', '${item.produk}', '${product.id_brand}', '${id_ware}', '${variationIdpo}', '${product.quality}', '${size}', ${requestedQty}, '${modalPrice}', ${harga_jual}, 0, ${requestedQty * harga_jual}, '${body.users}', '${tanggal}', '${tanggal}')`
        );
      }
      processedOrders.set(id_pesanan, { totalAmount: orderGroup.totalAmount, id_store: orderGroup.items[0].id_store });
    }

    // 8. Bulk INSERT ke tb_order
    if (orderInserts.length > 0) {
      const orderInsertQuery = `
        INSERT INTO tb_order 
          (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at)
        VALUES ${orderInserts.join(", ")}
      `;
      await connection.query(orderInsertQuery);
    }

    // 9. Bulk INSERT ke tb_mutasistock
    if (mutasiInserts.length > 0) {
      const mutasiInsertQuery = `
        INSERT INTO tb_mutasistock 
          (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
        VALUES ${mutasiInserts.join(", ")}
      `;
      await connection.query(mutasiInsertQuery);
    }

    // 10. Bulk UPDATE tb_variation menggunakan CASE
    if (variationUpdates.length > 0) {
      const updateMap = {};
      variationUpdates.forEach(update => {
        updateMap[update.key] = update.newQty;
      });
      const keys = Object.keys(updateMap);
      let cases = "";
      const conditions = [];
      keys.forEach(key => {
        const [idproduk, id_ware, size, idpo] = key.split("_");
        cases += ` WHEN id_produk='${idproduk}' AND id_ware='${id_ware}' AND CAST(size AS CHAR)= '${size}' AND idpo='${idpo}' THEN ${updateMap[key]}`;
        conditions.push(`(id_produk='${idproduk}' AND id_ware='${id_ware}' AND CAST(size AS CHAR)= '${size}' AND idpo='${idpo}')`);
      });
      const updateQuery = `
        UPDATE tb_variation 
        SET qty = CASE ${cases} END,
            updated_at = '${tanggal}'
        WHERE ${conditions.join(" OR ")}
      `;
      await connection.query(updateQuery);
    }

    // 11. Pembuatan invoice untuk tiap pesanan yang berhasil diproses
    const [cekInvoice] = await connection.query(`SELECT MAX(id_invoice) as id_invoice FROM tb_invoice`);
    let lastInvoice = cekInvoice[0].id_invoice ? parseInt(cekInvoice[0].id_invoice.slice(-9)) : 0;
    for (const [uniquePesanan, { totalAmount, id_store }] of processedOrders.entries()) {
      const [get_store] = await connection.query(`SELECT * FROM tb_store WHERE id_store='${id_store}'`);
      lastInvoice += 1;
      const idInvoice = `INV-${lastInvoice.toString().padStart(9, "0")}`;
      await connection.query(
        `INSERT INTO tb_invoice 
          (tanggal_order, id_invoice, id_pesanan, customer, type_customer, sales_channel, amount, diskon_nota, biaya_lainnya, total_amount, selisih, status_pesanan, payment, reseller, users, created_at, updated_at)
         VALUES 
          ('${body.tanggal}', '${idInvoice}', '${uniquePesanan}', '${id_store}', '${get_store[0].channel}', '${get_store[0].channel}', '${totalAmount}', '0', '0', '${totalAmount}', '0', 'SELESAI', 'PAID', '-', '${body.users}', '${tanggal}', '${tanggal}')`
      );
    }

    await connection.commit();

    // ============================
    // Tambahan: Proses pengecekan harga
    // Jika total_amount (dari frontend) kurang dari harga_jual, masukkan order ke skippedPrices
    const skippedPrices = [];
    for (const [id_pesanan, orderGroup] of Object.entries(groupedOrders)) {
      orderGroup.items.forEach(item => {
        // Cek apakah total_amount kurang dari harga_jual
        if (Number(item.total_amount) < Number(item.harga_jual)) {
          skippedPrices.push({
            id_pesanan,
            idproduk: item.idproduk,
            frontendTotalAmount: item.total_amount,
            requiredTotal: item.harga_jual,
            reason: "Total amount is less than selling price"
          });
        }
      });
    }

    // ============================

    return {
      status: skippedOrders.length > 0 ? "partially_processed" : "success",
      message: skippedOrders.length > 0
        ? "Some orders were skipped due to stok tidak tercukupi."
        : "All orders processed successfully.",
      data: {
        processedOrders: Array.from(processedOrders.entries()).map(([id_pesanan, { totalAmount, id_store }]) => ({
          id_pesanan,
          totalAmount,
          id_store,
          items: data.filter(item => item.id_pesanan === id_pesanan)
            .map(item => ({
              id_pesanan: item.id_pesanan,
              idproduk: item.idproduk,
              qty: item.qty,
              harga_jual: item.harga_jual,
              subtotal: item.qty * item.harga_jual
            }))
        })),
        skippedOrders,
        skippedPrices
      }
    };

  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const deletepesanansync = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM tb_invoice WHERE id_pesanan='${body.id_pesanan}'`
    );

    await connection.query(
      `DELETE FROM tb_order WHERE id_pesanan='${body.id_pesanan}'`
    );

    await connection.query(
      `DELETE FROM tb_mutasistock WHERE id_pesanan='${body.id_pesanan}'`
    );

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const insertgagalinput = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  const data = body.data;
  const params = body.params;

  try {
    await connection.beginTransaction();

    if (params === "SKIP_HARGA") {
      for (let index = 0; index < data.length; index++) {
        await connection.query(
          `INSERT INTO history_order_api
    (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            tanggal_skrg,
            data[index].id_pesanan,
            data[index].idproduk,
            data[index].id_ware,
            data[index].produk,
            data[index].size,
            data[index].qty,
            data[index].qty_ready,
            data[index].total_amount,
            data[index].harga_jual,
            "Harga Di bawah Ketentuan",
            tanggal,
            tanggal,
          ]
        );
      }
    } else if (params === "SKIP_ORDER") {
      for (let index = 0; index < data.length; index++) {
        await connection.query(
          `INSERT INTO history_order_api
    (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            tanggal_skrg,
            data[index].id_pesanan,
            data[index].idproduk,
            data[index].id_ware,
            data[index].produk,
            data[index].size,
            data[index].qty,
            data[index].qty_ready,
            data[index].total_amount,
            data[index].harga_jual,
            "Stok Tidak Mencukupi",
            tanggal,
            tanggal,
          ]
        );
      }
    }
    // else {
    //   for (let index = 0; index < data.length; index++) {
    //     await connection.query(
    //       `INSERT INTO history_order_api
    // (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
    // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //       [
    //         tanggal_skrg,
    //         data[index].id_pesanan,
    //         data[index].idproduk,
    //         data[index].id_ware,
    //         data[index].produk,
    //         data[index].size,
    //         data[index].qty,
    //         data[index].qty_ready,
    //         data[index].total_amount,
    //         data[index].harga_jual,
    //         data[index].total_amount < data[index].harga_jual ? "Harga Di bawah Ketentuan" : "Stok Tidak Mencukupi",
    //         tanggal,
    //         tanggal,
    //       ]
    //     );
    //   }
    // }

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const deletependinginput = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    await connection.beginTransaction();

    // if (params === "SKIP_HARGA") {
    //   for (let index = 0; index < data.length; index++) {
    //     await connection.query(
    //       `INSERT INTO history_order_api
    // (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
    // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //       [
    //         tanggal_skrg,
    //         data[index].id_pesanan,
    //         data[index].idproduk,
    //         data[index].id_ware,
    //         data[index].produk,
    //         data[index].size,
    //         data[index].qty,
    //         data[index].qty_ready,
    //         data[index].total_amount,
    //         data[index].harga_jual,
    //         "Harga Di bawah Ketentuan",
    //         tanggal,
    //         tanggal,
    //       ]
    //     );
    //   }
    // } else {
    //   for (let index = 0; index < data.length; index++) {
    //     await connection.query(
    //       `INSERT INTO history_order_api
    // (tanggal, id_pesanan, id_produk, id_ware, produk, size, qtyOrder, qtyReady, total_amount, harga_jual_app, ket, created_at, updated_at)
    // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //       [
    //         tanggal_skrg,
    //         data[index].id_pesanan,
    //         data[index].idproduk,
    //         data[index].id_ware,
    //         data[index].produk,
    //         data[index].size,
    //         data[index].qty,
    //         data[index].qty_ready,
    //         data[index].total_amount,
    //         data[index].harga_jual,
    //         "Gagal Input DUPLIKAT",
    //         tanggal,
    //         tanggal,
    //       ]
    //     );
    //   }
    // }

    await connection.commit();
    await connection.release();
  } catch (error) {
    console.log(error);
    await connection.release();
  }
};

const history_massal = async (body) => {
  const connection = await dbPool.getConnection();
  // Format tanggal sekarang untuk field 'tanggal', 'created_at' dan 'updated_at'
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");

  try {
    await connection.beginTransaction();

    for (const record of body) {
      await connection.query(
        `INSERT INTO history_massal 
          (tanggal, channelid, id_pesanan, orderId, deliveryType, shipmentProvider, shipmentProviderId, trackingNo, addressId, address, pickupTimeId, timeText, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tanggal_skrg,         // tanggal
          record.channelid,    // channelid
          record.id_pesanan,   // id_pesanan
          record.orderId,      // orderId
          record.deliveryType, // deliveryType
          record.shipmentProvider, // shipmentProvider
          record.shipmentProviderId, // shipmentProviderId
          record.trackingNo,   // trackingNo
          record.addressId,    // addressId
          record.address,      // address
          record.pickupTimeId, // pickupTimeId
          record.timeText,     // timeText
          tanggal,             // created_at
          tanggal              // updated_at
        ]
      );
    }

    await connection.commit();
  } catch (error) {
    console.error(error);
    await connection.rollback();
  } finally {
    await connection.release();
  }
};

const get_history_massal = async (body) => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
  try {
    await connection.beginTransaction();
    console.log(tanggal_skrg);

    const [cek_data] = await connection.query(
      `SELECT * FROM history_massal WHERE tanggal='${tanggal_skrg}'`
    );
    console.log("cek_data", cek_data);

    await connection.commit();
    return cek_data;
  } catch (error) {
    console.error(error);
    await connection.rollback();
  } finally {
    await connection.release();
  }
};

const deletependingdata = async () => {
  const connection = await dbPool.getConnection();
  const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

  try {
    await connection.beginTransaction();

    console.log("Deleting all pending data from history_order_api...");

    // Hapus semua data dari tabel history_order_api
    const [result] = await connection.query(`DELETE FROM history_order_api`);

    console.log(`Deleted ${result.affectedRows} rows from history_order_api`);

    await connection.commit();
  } catch (error) {
    console.error("Error deleting all pending data:", error);
    await connection.rollback();
  } finally {
    await connection.release();
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

// ── Picking List ─────────────────────────────────────────────────────────────

// 1. Cek no_pesanan di tb_invoice, lalu ambil item order yg cocok id_produk+size
async function getPickingList(body) {
  const connection = await dbPool.getConnection();
  try {
    const { no_pesanan, id_produk, size } = body;

    // Cek apakah no_pesanan ada di tb_invoice
    const [invoice] = await connection.query(
      `SELECT id_pesanan, customer, sales_channel, jasa_kirim, status_pesanan
       FROM tb_invoice WHERE id_pesanan = ? LIMIT 1`,
      [no_pesanan]
    );
    if (invoice.length === 0) {
      return { found: false, orderItem: null };
    }

    // Left join tb_invoice + tb_order, filter by id_produk & size
    const [items] = await connection.query(
      `SELECT
         tb_order.id_pesanan, tb_order.id_produk,
         tb_order.produk,     tb_order.size, tb_order.qty
       FROM tb_invoice
       LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan
       WHERE tb_invoice.id_pesanan = ?
         AND tb_order.id_produk    = ?
         AND tb_order.size         = ?
       LIMIT 1`,
      [no_pesanan, id_produk, size]
    );

    return {
      found:     true,
      invoice:   invoice[0],
      orderItem: items.length > 0 ? items[0] : null,
    };
  } finally {
    connection.release();
  }
}

// 2. Insert satu record ke tb_picking_list
async function insertPickingList(body) {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();
    const { no_pesanan, id_produk, size, qty, users } = body;
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

    await connection.query(
      `INSERT INTO tb_picking_list
         (tanggal, no_pesanan, id_produk, size, qty, users, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [tanggal_skrg, no_pesanan, id_produk, size, qty, users]
    );
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// 3. Ambil data tb_picking_list (default: hari ini)
async function getPickingListData(body) {
  const connection = await dbPool.getConnection();
  try {
    const tanggal = body.tanggal || date.format(new Date(), "YYYY-MM-DD");
    const [data] = await connection.query(
      `SELECT
         pl.id, pl.tanggal, pl.no_pesanan, pl.id_produk, pl.size, pl.qty,
         pl.users, pl.created_at,
         (SELECT tb_order.produk
          FROM tb_order
          WHERE tb_order.id_pesanan = pl.no_pesanan
            AND tb_order.id_produk  = pl.id_produk
            AND tb_order.size       = pl.size
          LIMIT 1) AS produk
       FROM tb_picking_list pl
       WHERE pl.tanggal = ?
       ORDER BY pl.id DESC`,
      [tanggal]
    );
    return data;
  } finally {
    connection.release();
  }
}

// 4. Update record tb_picking_list
async function updatePickingList(body) {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();
    const { id, qty, size } = body;
    await connection.query(
      `UPDATE tb_picking_list SET qty = ?, size = ?, updated_at = NOW() WHERE id = ?`,
      [qty, size, id]
    );
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateStatusPacking(body) {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();
    const { order_id, status_packing } = body;
    await connection.query(
      `UPDATE tb_order SET status_packing = ?, updated_at = NOW() WHERE id = ?`,
      [status_packing, order_id]
    );
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
}
