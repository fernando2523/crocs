const { log } = require("console");
const dbPool = require("../config/database");

const date = require("date-and-time");
const { stringify } = require("querystring");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
const tanggalinput = date.format(new Date(), "YYYYMMDD");
const tahun = date.format(new Date(), "YY");
const { generateFromEmail } = require("unique-username-generator");
const { v4: uuidv4 } = require("uuid");

// const getProduk = async (body) => {
//     const connection = await dbPool.getConnection();
//     const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
//     const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
//     const tahun = date.format(new Date(), "YY");
//     try {
//         await connection.beginTransaction();
//         if (body.role === "SUPER-ADMIN" || body.role === "HEAD-AREA") {
//             var areas = body.area;
//         } else if (body.role === "HEAD-WAREHOUSE") {
//             var [cek_area] = await connection.query(
//                 `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_area`
//             );
//             var areas = cek_area[0].id_area;
//         } else {
//             var [cek_area] = await connection.query(
//                 `SELECT id_area FROM tb_store`
//             );
//             var areas = cek_area[0].id_area;
//             var [countproduk_ware] = await connection.query(
//                 `SELECT * FROM tb_produk WHERE id_ware='${body.area}'`
//             );
//         }
//         const [countproduk] = await connection.query(
//             `SELECT * FROM tb_produk`
//         );

//         if (body.loadmorelimit === 1) {
//             var limitss = 20;
//         } else if (body.loadmorelimit === 0) {
//             var limitss = 0;
//         } else {
//             var limitss = body.loadmorelimit * 20;
//         }
//         const total_pages = countproduk.length / 20;
//         const total_pages_ware = countproduk.length / 20;


//         if (body.id_ware === "all_area") {
//             var area_ware = body.area.split('-')[0];
//             if (area_ware == "WARE") {
//                 var [data_get_ware] = await connection.query(
//                     `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_area`
//                 );
//                 var output_area_ware = data_get_ware[0].id_area
//             } else if (area_ware == "AREA") {
//                 var output_area_ware = body.area
//             }
//         }

//         if (body.role === "CASHIER") {
//             var [data_awal_store] = await connection.query(
//                 `SELECT id_ware FROM tb_store WHERE id_store='${body.id_ware}' GROUP BY id_ware`
//             );
//         }
//         console.log("body", body);


//         const datas = [];

//         if (body.query === "all") {
//             if (body.id_ware === "all") {
//                 if (body.urutan === "all") {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 } else if (body.urutan === "desc") {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 } else {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 }


//                 var [total_artikel] = await connection.query(`SELECT COUNT(id_produk) as totals FROM tb_produk GROUP BY id_produk`);
//                 var [sum_artikel] = await connection.query(`SELECT SUM(qty) as sumqty FROM tb_variation`);
//                 for (let index = 0; index < data_produk.length; index++) {

//                     var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
//                     for (let bx = 0; bx < details.length; bx++) {
//                         var countqty = details[bx].qty;
//                     }

//                     var [detail_variation] = await connection.query(
//                         `SELECT tb_variation.*,SUM(tb_variation.qty) as qty,displays.size as sizes,displays.qty as qtyss,displays.id_ware as id_waress FROM tb_variation LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk WHERE tb_variation.id_produk='${data_produk[index].id_produk}' AND tb_variation.id_ware='${data_produk[index].id_ware}' GROUP BY tb_variation.id_ware,tb_variation.size ORDER BY tb_variation.id ASC`
//                     );
//                     for (let xyx = 0; xyx < detail_variation.length; xyx++) {
//                         var sizes = detail_variation[xyx].sizes;
//                         var qtyss = detail_variation[xyx].qtyss;
//                         var id_waress = detail_variation[xyx].id_waress;
//                     }
//                     var [data_category] = await connection.query(`SELECT category FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
//                     var [data_warehouse] = await connection.query(`SELECT tb_warehouse.id_ware,tb_warehouse.warehouse,tb_store.ip FROM tb_warehouse LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
//                     var [data_brand] = await connection.query(`SELECT brand FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
//                     var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);

//                     datas.push({
//                         id: data_produk[index].id,
//                         id_produk: data_produk[index].id_produk,
//                         id_ware: data_produk[index].id_ware,
//                         id_brand: data_produk[index].id_brand,
//                         id_category: data_produk[index].id_category,
//                         tanggal_upload: data_produk[index].tanggal_upload,
//                         produk: data_produk[index].produk,
//                         deskripsi: data_produk[index].deskripsi,
//                         quality: data_produk[index].quality,
//                         n_price: data_produk[index].n_price,
//                         r_price: data_produk[index].r_price,
//                         g_price: data_produk[index].g_price,
//                         img: data_produk[index].img,
//                         users: data_produk[index].users,
//                         created_at: data_produk[index].created_at,
//                         updated_at: data_produk[index].updated_at,
//                         countqty: countqty,
//                         detail_variation: detail_variation,
//                         category: data_category,
//                         warehouse: data_warehouse,
//                         brand: data_brand,
//                         sizes: sizes,
//                         qtyss: qtyss,
//                         id_waress: id_waress,
//                         upprice_n_price: data_area[0].n_price,
//                         upprice_r_price: data_area[0].r_price,
//                         upprice_g_price: data_area[0].g_price,
//                         no_urut: countproduk.length,
//                     });
//                 }
//             } else if (body.id_ware === "all_area") {
//                 if (body.urutan === "all") {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 } else if (body.urutan === "desc") {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 } else {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 }

//                 var [total_artikel] = await connection.query(
//                     `SELECT tb_produk.*,COUNT(id_produk) as totals,tb_warehouse.id_area FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk`
//                 );
//                 var [sum_artikel] = await connection.query(
//                     `SELECT SUM(qty) as sumqty FROM tb_variation WHERE id_area='${output_area_ware}'`
//                 );
//                 for (let index = 0; index < data_produk.length; index++) {
//                     var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
//                     for (let bx = 0; bx < details.length; bx++) {
//                         var countqty = details[bx].qty;
//                     }
//                     var [detail_variation] = await connection.query(
//                         `SELECT tb_variation.*,SUM(tb_variation.qty) as qty,displays.size as sizes,displays.qty as qtyss,displays.id_ware as id_waress FROM tb_variation LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk WHERE tb_variation.id_produk='${data_produk[index].id_produk}' AND tb_variation.id_ware='${data_produk[index].id_ware}' GROUP BY tb_variation.id_ware,tb_variation.size ORDER BY tb_variation.id ASC`
//                     );
//                     for (let xyx = 0; xyx < detail_variation.length; xyx++) {
//                         var sizes = detail_variation[xyx].sizes;
//                         var qtyss = detail_variation[xyx].qtyss;
//                         var id_waress = detail_variation[xyx].id_waress;
//                     }
//                     var [data_category] = await connection.query(`SELECT category FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
//                     var [data_warehouse] = await connection.query(`SELECT tb_warehouse.id_ware,tb_warehouse.warehouse,tb_store.ip FROM tb_warehouse LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
//                     var [data_brand] = await connection.query(`SELECT brand FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
//                     var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);

//                     datas.push({
//                         id: data_produk[index].id,
//                         id_produk: data_produk[index].id_produk,
//                         id_ware: data_produk[index].id_ware,
//                         id_brand: data_produk[index].id_brand,
//                         id_category: data_produk[index].id_category,
//                         tanggal_upload: data_produk[index].tanggal_upload,
//                         produk: data_produk[index].produk,
//                         deskripsi: data_produk[index].deskripsi,
//                         quality: data_produk[index].quality,
//                         n_price: data_produk[index].n_price,
//                         r_price: data_produk[index].r_price,
//                         g_price: data_produk[index].g_price,
//                         img: data_produk[index].img,
//                         users: data_produk[index].users,
//                         created_at: data_produk[index].created_at,
//                         updated_at: data_produk[index].updated_at,
//                         countqty: countqty,
//                         detail_variation: detail_variation,
//                         category: data_category,
//                         warehouse: data_warehouse,
//                         brand: data_brand,
//                         sizes: sizes,
//                         qtyss: qtyss,
//                         id_waress: id_waress,
//                         upprice_n_price: data_area[0].n_price,
//                         upprice_r_price: data_area[0].r_price,
//                         upprice_g_price: data_area[0].g_price,
//                     });
//                 }
//             } else {
//                 if (body.urutan === "all") {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 } else if (body.urutan === "desc") {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 } else {
//                     if (countproduk.length < 20) {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC LIMIT 20`
//                         );
//                     } else {
//                         var [data_produk] = await connection.query(
//                             `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC LIMIT 20 OFFSET ${limitss}`
//                         );
//                     }
//                 }

//                 // if (countproduk.length < 20) {
//                 //     var [data_produk] = await connection.query(
//                 //         `SELECT tb_produk.*,tb_warehouse.warehouse FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware  WHERE tb_produk.id_ware='${data_awal_store[0].id_ware}' ORDER BY tb_produk.id DESC LIMIT 20`
//                 //     );
//                 // } else {
//                 //     var [data_produk] = await connection.query(
//                 //         `SELECT tb_produk.*,tb_warehouse.warehouse FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware  WHERE tb_produk.id_ware='${data_awal_store[0].id_ware}' ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
//                 //     );
//                 // }

//                 var [total_artikel] = await connection.query(`SELECT COUNT(id_produk) as totals FROM tb_produk WHERE id_ware='${body.id_ware}' GROUP BY id_produk`);
//                 var [sum_artikel] = await connection.query(`SELECT SUM(qty) as sumqty FROM tb_variation WHERE id_ware='${body.id_ware}'`);
//                 for (let index = 0; index < data_produk.length; index++) {
//                     var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
//                     for (let bx = 0; bx < details.length; bx++) {
//                         var countqty = details[bx].qty;
//                     }
//                     var [detail_variation] = await connection.query(
//                         `SELECT tb_variation.*,SUM(tb_variation.qty) as qty,displays.size as sizes,displays.qty as qtyss,displays.id_ware as id_waress FROM tb_variation LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk WHERE tb_variation.id_produk='${data_produk[index].id_produk}' AND tb_variation.id_ware='${data_produk[index].id_ware}' GROUP BY tb_variation.id_ware,tb_variation.size ORDER BY tb_variation.id ASC`
//                     );
//                     for (let xyx = 0; xyx < detail_variation.length; xyx++) {
//                         var sizes = detail_variation[xyx].sizes;
//                         var qtyss = detail_variation[xyx].qtyss;
//                         var id_waress = detail_variation[xyx].id_waress;
//                     }
//                     var [data_category] = await connection.query(`SELECT category FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
//                     var [data_warehouse] = await connection.query(`SELECT tb_warehouse.id_ware,tb_warehouse.warehouse,tb_store.ip FROM tb_warehouse LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
//                     var [data_brand] = await connection.query(`SELECT brand FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
//                     var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);

//                     datas.push({
//                         id: data_produk[index].id,
//                         id_produk: data_produk[index].id_produk,
//                         id_ware: data_produk[index].id_ware,
//                         id_brand: data_produk[index].id_brand,
//                         id_category: data_produk[index].id_category,
//                         tanggal_upload: data_produk[index].tanggal_upload,
//                         produk: data_produk[index].produk,
//                         deskripsi: data_produk[index].deskripsi,
//                         quality: data_produk[index].quality,
//                         n_price: data_produk[index].n_price,
//                         r_price: data_produk[index].r_price,
//                         g_price: data_produk[index].g_price,
//                         img: data_produk[index].img,
//                         users: data_produk[index].users,
//                         created_at: data_produk[index].created_at,
//                         updated_at: data_produk[index].updated_at,
//                         countqty: countqty,
//                         detail_variation: detail_variation,
//                         category: data_category,
//                         warehouse: data_warehouse,
//                         brand: data_brand,
//                         sizes: sizes,
//                         qtyss: qtyss,
//                         id_waress: id_waress,
//                         upprice_n_price: data_area[0].n_price,
//                         upprice_r_price: data_area[0].r_price,
//                         upprice_g_price: data_area[0].g_price,
//                     });
//                 }
//             }
//         } else {
//             if (body.id_ware === "all") {
//                 if (body.urutan === "all") {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC`
//                     );
//                 } else if (body.urutan === "desc") {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC`
//                     );
//                 } else {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC`
//                     );
//                 }

//                 // var [data_produk] = await connection.query(
//                 //     `SELECT tb_produk.*,tb_brand.brand FROM tb_produk LEFT JOIN tb_brand ON tb_produk.id_brand = tb_brand.id_brand WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%')  ORDER BY tb_produk.id DESC`
//                 // );

//                 var [total_artikel] = await connection.query(`SELECT COUNT(id_produk) as totals FROM tb_produk GROUP BY id_produk`);
//                 var [sum_artikel] = await connection.query(`SELECT SUM(qty) as sumqty FROM tb_variation`);

//                 for (let index = 0; index < data_produk.length; index++) {
//                     var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
//                     for (let bx = 0; bx < details.length; bx++) {
//                         var countqty = details[bx].qty;
//                     }

//                     var [detail_variation] = await connection.query(
//                         `SELECT tb_variation.*,SUM(tb_variation.qty) as qty,displays.size as sizes,displays.qty as qtyss,displays.id_ware as id_waress FROM tb_variation LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk WHERE tb_variation.id_produk='${data_produk[index].id_produk}' AND tb_variation.id_ware='${data_produk[index].id_ware}' GROUP BY tb_variation.id_ware,tb_variation.size ORDER BY tb_variation.id ASC`
//                     );
//                     for (let xyx = 0; xyx < detail_variation.length; xyx++) {
//                         var sizes = detail_variation[xyx].sizes;
//                         var qtyss = detail_variation[xyx].qtyss;
//                         var id_waress = detail_variation[xyx].id_waress;
//                     }
//                     var [data_category] = await connection.query(`SELECT category FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
//                     var [data_warehouse] = await connection.query(`SELECT tb_warehouse.id_ware,tb_warehouse.warehouse,tb_store.ip FROM tb_warehouse LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
//                     var [data_brand] = await connection.query(`SELECT brand FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
//                     var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);

//                     datas.push({
//                         id: data_produk[index].id,
//                         id_produk: data_produk[index].id_produk,
//                         id_ware: data_produk[index].id_ware,
//                         id_brand: data_produk[index].id_brand,
//                         id_category: data_produk[index].id_category,
//                         tanggal_upload: data_produk[index].tanggal_upload,
//                         produk: data_produk[index].produk,
//                         deskripsi: data_produk[index].deskripsi,
//                         quality: data_produk[index].quality,
//                         n_price: data_produk[index].n_price,
//                         r_price: data_produk[index].r_price,
//                         g_price: data_produk[index].g_price,
//                         img: data_produk[index].img,
//                         users: data_produk[index].users,
//                         created_at: data_produk[index].created_at,
//                         updated_at: data_produk[index].updated_at,
//                         countqty: countqty,
//                         detail_variation: detail_variation,
//                         category: data_category,
//                         warehouse: data_warehouse,
//                         brand: data_brand,
//                         sizes: sizes,
//                         qtyss: qtyss,
//                         id_waress: id_waress,
//                         upprice_n_price: data_area[0].n_price,
//                         upprice_r_price: data_area[0].r_price,
//                         upprice_g_price: data_area[0].g_price,
//                     });
//                 }
//             } else if (body.id_ware === "all_area") {
//                 if (body.urutan === "all") {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC`
//                     );
//                 } else if (body.urutan === "desc") {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC`
//                     );
//                 } else {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_variation.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC`
//                     );
//                 }

//                 // var [data_produk] = await connection.query(
//                 //     `SELECT tb_produk.*,tb_warehouse.id_area,tb_brand.brand FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware LEFT JOIN tb_brand ON tb_produk.id_ware = tb_brand.id_brand WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_warehouse.id_area='${areas}' ORDER BY tb_produk.id DESC`
//                 // );

//                 var [total_artikel] = await connection.query(
//                     `SELECT tb_produk.*,COUNT(id_produk) as totals,tb_warehouse.id_area FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${output_area_ware}' GROUP BY tb_produk.id_produk`
//                 );
//                 var [sum_artikel] = await connection.query(
//                     `SELECT SUM(qty) as sumqty FROM tb_variation WHERE id_area='${output_area_ware}'`
//                 );
//                 for (let index = 0; index < data_produk.length; index++) {
//                     var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
//                     for (let bx = 0; bx < details.length; bx++) {
//                         var countqty = details[bx].qty;
//                     }
//                     var [detail_variation] = await connection.query(
//                         `SELECT tb_variation.*,SUM(tb_variation.qty) as qty,displays.size as sizes,displays.qty as qtyss,displays.id_ware as id_waress FROM tb_variation LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk WHERE tb_variation.id_produk='${data_produk[index].id_produk}' AND tb_variation.id_ware='${data_produk[index].id_ware}' GROUP BY tb_variation.id_ware,tb_variation.size ORDER BY tb_variation.id ASC`
//                     );
//                     for (let xyx = 0; xyx < detail_variation.length; xyx++) {
//                         var sizes = detail_variation[xyx].sizes;
//                         var qtyss = detail_variation[xyx].qtyss;
//                         var id_waress = detail_variation[xyx].id_waress;
//                     }
//                     var [data_category] = await connection.query(`SELECT category FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
//                     var [data_warehouse] = await connection.query(`SELECT tb_warehouse.id_ware,tb_warehouse.warehouse,tb_store.ip FROM tb_warehouse LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
//                     var [data_brand] = await connection.query(`SELECT brand FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
//                     var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);

//                     datas.push({
//                         id: data_produk[index].id,
//                         id_produk: data_produk[index].id_produk,
//                         id_ware: data_produk[index].id_ware,
//                         id_brand: data_produk[index].id_brand,
//                         id_category: data_produk[index].id_category,
//                         tanggal_upload: data_produk[index].tanggal_upload,
//                         produk: data_produk[index].produk,
//                         deskripsi: data_produk[index].deskripsi,
//                         quality: data_produk[index].quality,
//                         n_price: data_produk[index].n_price,
//                         r_price: data_produk[index].r_price,
//                         g_price: data_produk[index].g_price,
//                         img: data_produk[index].img,
//                         users: data_produk[index].users,
//                         created_at: data_produk[index].created_at,
//                         updated_at: data_produk[index].updated_at,
//                         countqty: countqty,
//                         detail_variation: detail_variation,
//                         category: data_category,
//                         warehouse: data_warehouse,
//                         brand: data_brand,
//                         sizes: sizes,
//                         qtyss: qtyss,
//                         id_waress: id_waress,
//                         upprice_n_price: data_area[0].n_price,
//                         upprice_r_price: data_area[0].r_price,
//                         upprice_g_price: data_area[0].g_price,
//                     });
//                 }
//             } else {
//                 if (body.urutan === "all") {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY tb_produk.id DESC`
//                     );
//                 } else if (body.urutan === "desc") {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) DESC`
//                     );
//                 } else {
//                     var [data_produk] = await connection.query(
//                         `SELECT tb_produk.* FROM tb_produk LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk AND tb_produk.id_ware = tb_variation.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_produk.id_ware='${body.id_ware}' GROUP BY tb_produk.id_produk, tb_produk.id_ware ORDER BY SUM(tb_variation.qty) ASC`
//                     );
//                 }

//                 var [total_artikel] = await connection.query(`SELECT COUNT(id_produk) as totals FROM tb_produk WHERE id_ware='${body.id_ware}' GROUP BY id_produk`);
//                 var [sum_artikel] = await connection.query(`SELECT SUM(qty) as sumqty FROM tb_variation WHERE id_ware='${body.id_ware}'`);
//                 for (let index = 0; index < data_produk.length; index++) {
//                     var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
//                     for (let bx = 0; bx < details.length; bx++) {
//                         var countqty = details[bx].qty;
//                     }
//                     var [detail_variation] = await connection.query(
//                         `SELECT tb_variation.*,SUM(tb_variation.qty) as qty,displays.size as sizes,displays.qty as qtyss,displays.id_ware as id_waress FROM tb_variation LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk WHERE tb_variation.id_produk='${data_produk[index].id_produk}' AND tb_variation.id_ware='${data_produk[index].id_ware}' GROUP BY tb_variation.id_ware,tb_variation.size ORDER BY tb_variation.id ASC`
//                     );
//                     for (let xyx = 0; xyx < detail_variation.length; xyx++) {
//                         var sizes = detail_variation[xyx].sizes;
//                         var qtyss = detail_variation[xyx].qtyss;
//                         var id_waress = detail_variation[xyx].id_waress;
//                     }
//                     var [data_category] = await connection.query(`SELECT category FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
//                     var [data_warehouse] = await connection.query(`SELECT tb_warehouse.id_ware,tb_warehouse.warehouse,tb_store.ip FROM tb_warehouse LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
//                     var [data_brand] = await connection.query(`SELECT brand FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
//                     var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);

//                     datas.push({
//                         id: data_produk[index].id,
//                         id_produk: data_produk[index].id_produk,
//                         id_ware: data_produk[index].id_ware,
//                         id_brand: data_produk[index].id_brand,
//                         id_category: data_produk[index].id_category,
//                         tanggal_upload: data_produk[index].tanggal_upload,
//                         produk: data_produk[index].produk,
//                         deskripsi: data_produk[index].deskripsi,
//                         quality: data_produk[index].quality,
//                         n_price: data_produk[index].n_price,
//                         r_price: data_produk[index].r_price,
//                         g_price: data_produk[index].g_price,
//                         img: data_produk[index].img,
//                         users: data_produk[index].users,
//                         created_at: data_produk[index].created_at,
//                         updated_at: data_produk[index].updated_at,
//                         countqty: countqty,
//                         detail_variation: detail_variation,
//                         category: data_category,
//                         warehouse: data_warehouse,
//                         brand: data_brand,
//                         sizes: sizes,
//                         qtyss: qtyss,
//                         id_waress: id_waress,
//                         upprice_n_price: data_area[0].n_price,
//                         upprice_r_price: data_area[0].r_price,
//                         upprice_g_price: data_area[0].g_price,
//                     });
//                 }
//             }
//         }

//         await connection.commit();
//         await connection.release();
//         return {
//             datas,
//             total_artikel: total_artikel.length,
//             sum_artikel: sum_artikel[0].sumqty,
//             total_pages: Math.round(total_pages),
//             show_page: limitss,
//         };
//     } catch (error) {
//         console.log(error);
//         await connection.release();
//     }
// };

const getProduk = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
        const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
        const tahun = date.format(new Date(), "YY");

        /** 
         * 1. Setup variabel awal dan filter dinamis 
         */
        let whereClauses = [];
        let output_area_ware = null;
        let areas;

        // Penentuan 'areas' berdasarkan role
        if (body.role === "SUPER-ADMIN" || body.role === "HEAD-AREA") {
            areas = body.area;
        } else if (body.role === "HEAD-WAREHOUSE") {
            const [cek_area] = await connection.query(
                `SELECT id_area FROM tb_warehouse WHERE id_ware=? GROUP BY id_area`,
                [body.area]
            );
            areas = cek_area[0]?.id_area;
        } else {
            const [cek_area] = await connection.query(`SELECT id_area FROM tb_store LIMIT 1`);
            areas = cek_area[0]?.id_area;
        }

        // Hitung nilai limit (loadmorelimit)
        let limitss =
            body.loadmorelimit === 1
                ? 20
                : body.loadmorelimit === 0
                    ? 0
                    : body.loadmorelimit * 20;

        // Jika id_ware = "all_area", tentukan output_area_ware
        if (body.id_ware === "all_area") {
            const areaPrefix = body.area.split("-")[0];
            if (areaPrefix === "WARE") {
                const [data_get_ware] = await connection.query(
                    `SELECT id_area FROM tb_warehouse WHERE id_ware=? GROUP BY id_area`,
                    [body.area]
                );
                output_area_ware = data_get_ware[0]?.id_area;
            } else if (areaPrefix === "AREA") {
                output_area_ware = body.area;
            }
        }

        // Filter pencarian (query)
        if (body.query !== "all") {
            whereClauses.push(
                `(tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%')`
            );
        }

        // Filter berdasarkan id_ware
        if (body.id_ware === "all") {
            // Tidak menambahkan filter khusus untuk id_ware
        } else if (body.id_ware === "all_area") {
            // Jika brand tidak "all", gunakan filter brand (id_area = body.brand)
            if (body.brand !== "all") {
                whereClauses.push(`tb_variation.id_area = '${body.brand}'`);
            } else {
                whereClauses.push(`tb_variation.id_area = '${output_area_ware}'`);
            }
        } else {
            whereClauses.push(`tb_produk.id_ware = '${body.id_ware}'`);
        }

        // Tambahan filter berdasarkan brand apabila id_ware bukan "all_area"
        if (body.brand !== "all" && body.id_ware !== "all_area") {
            whereClauses.push(`tb_variation.id_area = '${body.brand}'`);
        }

        // Urutan (sorting)
        let orderBy = "";
        if (body.urutan === "all") {
            orderBy = "tb_produk.id DESC";
        } else if (body.urutan === "desc") {
            orderBy = "SUM(tb_variation.qty) DESC";
        } else {
            orderBy = "SUM(tb_variation.qty) ASC";
        }

        /**
         * 2. Membangun query utama secara dinamis
         */
        let baseQuery = `
        SELECT tb_produk.*
        FROM tb_produk
        LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk 
          AND tb_produk.id_ware = tb_variation.id_ware
      `;
        if (whereClauses.length > 0) {
            baseQuery += " WHERE " + whereClauses.join(" AND ");
        }
        baseQuery += " GROUP BY tb_produk.id_produk, tb_produk.id_ware";
        if (body.query === "all") {
            baseQuery += ` ORDER BY ${orderBy} LIMIT 20 OFFSET ${limitss}`;
        } else {
            baseQuery += ` ORDER BY ${orderBy}`;
        }

        const [data_produk] = await connection.query(baseQuery);

        /**
         * 3. Menghitung total produk dan jumlah qty (sum_artikel) 
         *    dengan query yang mengacu pada filter yang sama
         */
        let countQuery = `
        SELECT COUNT(DISTINCT tb_produk.id_produk) as totals
        FROM tb_produk
        LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk 
          AND tb_produk.id_ware = tb_variation.id_ware
      `;
        if (whereClauses.length > 0) {
            countQuery += " WHERE " + whereClauses.join(" AND ");
        }
        const [totalCountResult] = await connection.query(countQuery);
        const total_artikel = totalCountResult.length ? totalCountResult[0].totals : 0;
        const total_pages = Math.round(total_artikel / 20);

        let sumQuery = `
        SELECT SUM(tb_variation.qty) as sumqty
        FROM tb_variation
        LEFT JOIN tb_produk ON tb_produk.id_produk = tb_variation.id_produk 
          AND tb_produk.id_ware = tb_variation.id_ware
      `;
        if (whereClauses.length > 0) {
            sumQuery += " WHERE " + whereClauses.join(" AND ");
        }
        const [sumResult] = await connection.query(sumQuery);
        const sum_artikel = sumResult[0]?.sumqty || 0;

        /**
         * 4. Memproses tiap produk untuk mengambil detail-detail terkait
         */
        const datas = [];
        for (let index = 0; index < data_produk.length; index++) {
            const produkItem = data_produk[index];

            const [details] = await connection.query(
                `SELECT *, SUM(qty) as qty, COUNT(size) as totalqty 
           FROM tb_variation 
           WHERE id_produk=? AND id_ware=? 
           GROUP BY id_ware`,
                [produkItem.id_produk, produkItem.id_ware]
            );
            const countqty = details[0]?.qty || 0;

            const [detail_variation] = await connection.query(
                `SELECT tb_variation.*, SUM(tb_variation.qty) as qty, displays.size as sizes, 
                  displays.qty as qtyss, displays.id_ware as id_waress 
           FROM tb_variation 
           LEFT JOIN displays ON tb_variation.id_produk = displays.id_produk 
           WHERE tb_variation.id_produk=? AND tb_variation.id_ware=? 
           GROUP BY tb_variation.id_ware, tb_variation.size 
           ORDER BY tb_variation.id ASC`,
                [produkItem.id_produk, produkItem.id_ware]
            );

            const [data_category] = await connection.query(
                `SELECT category FROM tb_category WHERE id_category=?`,
                [produkItem.id_category]
            );

            const [data_warehouse] = await connection.query(
                `SELECT tb_warehouse.id_ware, tb_warehouse.warehouse, tb_store.ip 
           FROM tb_warehouse 
           LEFT JOIN tb_store ON tb_store.id_ware = tb_warehouse.id_ware 
           WHERE tb_warehouse.id_ware=?`,
                [produkItem.id_ware]
            );

            const [data_brand] = await connection.query(
                `SELECT brand FROM tb_brand WHERE id_brand=?`,
                [produkItem.id_brand]
            );

            const [data_area] = await connection.query(
                `SELECT tb_area.*, tb_warehouse.id_area, id_ware 
           FROM tb_area 
           LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area 
           WHERE tb_warehouse.id_ware=?`,
                [produkItem.id_ware]
            );

            datas.push({
                id: produkItem.id,
                id_produk: produkItem.id_produk,
                id_ware: produkItem.id_ware,
                id_brand: produkItem.id_brand,
                id_category: produkItem.id_category,
                tanggal_upload: produkItem.tanggal_upload,
                produk: produkItem.produk,
                deskripsi: produkItem.deskripsi,
                quality: produkItem.quality,
                n_price: produkItem.n_price,
                r_price: produkItem.r_price,
                g_price: produkItem.g_price,
                img: produkItem.img,
                users: produkItem.users,
                created_at: produkItem.created_at,
                updated_at: produkItem.updated_at,
                countqty: countqty,
                detail_variation: detail_variation,
                category: data_category,
                warehouse: data_warehouse,
                brand: data_brand,
                // Jika detail_variation tidak kosong, ambil value dari baris pertama
                sizes: detail_variation.length ? detail_variation[0].sizes : null,
                qtyss: detail_variation.length ? detail_variation[0].qtyss : null,
                id_waress: detail_variation.length ? detail_variation[0].id_waress : null,
                upprice_n_price: data_area[0]?.n_price,
                upprice_r_price: data_area[0]?.r_price,
                upprice_g_price: data_area[0]?.g_price,
                no_urut: total_artikel,
            });
        }

        await connection.commit();
        connection.release();

        return {
            datas,
            total_artikel,
            sum_artikel,
            total_pages,
            show_page: limitss,
        };
    } catch (error) {
        console.error(error);
        await connection.release();
        throw error;
    }
};


const getProdukdisplay = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();
        if (body.role === "SUPER-ADMIN" || body.role === "HEAD-AREA") {
            var areas = body.area;
        } else if (body.role === "HEAD-WAREHOUSE") {
            var [cek_area] = await connection.query(
                `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_area ORDER BY id DESC`
            );
            var areas = cek_area[0].id_area;
        } else {
            var [cek_area] = await connection.query(
                `SELECT id_area FROM tb_store`
            );
            var areas = cek_area[0].id_area;
        }
        const datas = [];

        if (body.store != "all") {
            var [cek_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_store='${body.store}'`
            );

            for (let mm = 0; mm < cek_store.length; mm++) {
                var [cek_id_ware] = await connection.query(
                    `SELECT * FROM tb_warehouse WHERE id_ware='${cek_store[mm].id_ware}' ORDER BY id DESC`
                );

                var getidware = cek_id_ware[0].id_ware;
            }
        } else {
            var [cek_id_ware] = await connection.query(
                `SELECT * FROM tb_warehouse ORDER BY id DESC`
            );

            var getidware = cek_id_ware[0].id_ware;
        }

        var [countproduk] = await connection.query(
            `SELECT * FROM tb_produk`
        );

        if (body.loadmorelimit === 1) {
            var limitss = 20;
        } else if (body.loadmorelimit === 0) {
            var limitss = 0;
        } else {
            var limitss = body.loadmorelimit * 20;
        }
        const total_pages = countproduk.length / 20;

        if (body.role === "SUPER-ADMIN") {
            if (body.store === "all") {
                if (body.query === "all") {
                    if (countproduk.length < 20) {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk ORDER BY id DESC LIMIT 20`
                        );
                    } else {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk ORDER BY id DESC LIMIT 20 OFFSET ${limitss}`
                        );
                    }
                    for (let index = 0; index < data_produk.length; index++) {
                        var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: details,
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                } else {
                    var [data_produk] = await connection.query(
                        `SELECT tb_produk.*,tb_brand.brand FROM tb_produk LEFT JOIN tb_brand ON tb_produk.id_brand = tb_brand.id_brand WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') ORDER BY tb_produk.id DESC`
                    );

                    for (let index = 0; index < data_produk.length; index++) {
                        // var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk} AND id_ware='${data_produk[index].id_ware}'`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: "",
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                }
            } else {
                if (body.query === "all") {
                    if (countproduk.length < 20) {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC LIMIT 20`
                        );
                    } else {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
                        );
                    }
                    for (let index = 0; index < data_produk.length; index++) {
                        var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: details,
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                } else {
                    var [data_produk] = await connection.query(
                        `SELECT tb_produk.*,tb_brand.brand FROM tb_produk LEFT JOIN tb_brand ON tb_produk.id_brand = tb_brand.id_brand LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC`
                    );

                    for (let index = 0; index < data_produk.length; index++) {
                        // var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk} AND id_ware='${data_produk[index].id_ware}'`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: "",
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                }
            }
        } else if (body.role === "HEAD-AREA") {
            if (body.store === "all_area") {
                if (body.query === "all") {
                    if (countproduk.length < 20) {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_produk.id_ware='${body.area}' ORDER BY tb_produk.id DESC LIMIT 20`
                        );
                    } else {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.area}' ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
                        );
                    }
                    for (let index = 0; index < data_produk.length; index++) {
                        var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: details,
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                } else {
                    var [data_produk] = await connection.query(
                        `SELECT tb_produk.*,tb_brand.brand FROM tb_produk LEFT JOIN tb_brand ON tb_produk.id_brand = tb_brand.id_brand LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_warehouse.id_area='${body.area}' AND tb_produk.id_ware != 'EXTERNAL'  ORDER BY tb_produk.id DESC`
                    );

                    for (let index = 0; index < data_produk.length; index++) {
                        // var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk} AND id_ware='${data_produk[index].id_ware}'`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: "",
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                }
            } else {
                if (body.query === "all") {
                    if (countproduk.length < 20) {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC LIMIT 20`
                        );
                    } else {
                        var [data_produk] = await connection.query(
                            `SELECT * FROM tb_produk LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
                        );
                    }
                    for (let index = 0; index < data_produk.length; index++) {
                        var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: details,
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                } else {
                    var [data_produk] = await connection.query(
                        `SELECT tb_produk.*,tb_brand.brand FROM tb_produk LEFT JOIN tb_brand ON tb_produk.id_brand = tb_brand.id_brand LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC`
                    );

                    for (let index = 0; index < data_produk.length; index++) {
                        // var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk} AND id_ware='${data_produk[index].id_ware}'`);
                        var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                        var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                        var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                        var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                        var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                        var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                        datas.push({
                            id: data_produk[index].id,
                            id_produk: data_produk[index].id_produk,
                            id_ware: data_produk[index].id_ware,
                            id_brand: data_produk[index].id_brand,
                            id_category: data_produk[index].id_category,
                            tanggal_upload: data_produk[index].tanggal_upload,
                            produk: data_produk[index].produk,
                            deskripsi: data_produk[index].deskripsi,
                            quality: data_produk[index].quality,
                            n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                            r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                            g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                            img: data_produk[index].img,
                            users: data_produk[index].users,
                            created_at: data_produk[index].created_at,
                            updated_at: data_produk[index].updated_at,
                            detail: "",
                            detail_variation: detail_variation,
                            category: data_category,
                            warehouse: data_warehouse,
                            brand: data_brand,
                            display: display,
                        });
                    }
                }
            }
        } else {
            if (body.query === "all") {
                if (countproduk.length < 20) {
                    var [data_produk] = await connection.query(
                        `SELECT * FROM tb_produk LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC LIMIT 20`
                    );
                } else {
                    var [data_produk] = await connection.query(
                        `SELECT * FROM tb_produk LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC LIMIT 20 OFFSET ${limitss}`
                    );
                }
                for (let index = 0; index < data_produk.length; index++) {
                    var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware`);
                    var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                    var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                    var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                    var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                    var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                    var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                    datas.push({
                        id: data_produk[index].id,
                        id_produk: data_produk[index].id_produk,
                        id_ware: data_produk[index].id_ware,
                        id_brand: data_produk[index].id_brand,
                        id_category: data_produk[index].id_category,
                        tanggal_upload: data_produk[index].tanggal_upload,
                        produk: data_produk[index].produk,
                        deskripsi: data_produk[index].deskripsi,
                        quality: data_produk[index].quality,
                        n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                        r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                        g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                        img: data_produk[index].img,
                        users: data_produk[index].users,
                        created_at: data_produk[index].created_at,
                        updated_at: data_produk[index].updated_at,
                        detail: details,
                        detail_variation: detail_variation,
                        category: data_category,
                        warehouse: data_warehouse,
                        brand: data_brand,
                        display: display,
                    });
                }
            } else {
                var [data_produk] = await connection.query(
                    `SELECT tb_produk.*,tb_brand.brand FROM tb_produk LEFT JOIN tb_brand ON tb_produk.id_brand = tb_brand.id_brand LEFT JOIN tb_store ON tb_produk.id_ware = tb_store.id_ware WHERE (tb_produk.produk LIKE '%${body.query}%' OR tb_produk.id_produk LIKE '%${body.query}%') AND tb_store.id_store='${body.store}' ORDER BY tb_produk.id DESC`
                );

                for (let index = 0; index < data_produk.length; index++) {
                    // var [details] = await connection.query(`SELECT *,SUM(qty) as qty,COUNT(size) as totalqty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk} AND id_ware='${data_produk[index].id_ware}'`);
                    var [detail_variation] = await connection.query(`SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}' GROUP BY id_ware,size`);
                    var [data_category] = await connection.query(`SELECT * FROM tb_category WHERE id_category='${data_produk[index].id_category}'`);
                    var [data_warehouse] = await connection.query(`SELECT * FROM tb_warehouse WHERE id_ware='${data_produk[index].id_ware}'`);
                    var [data_brand] = await connection.query(`SELECT * FROM tb_brand WHERE id_brand='${data_produk[index].id_brand}'`);
                    var [data_area] = await connection.query(`SELECT tb_area.*,tb_warehouse.id_area,id_ware FROM tb_area LEFT JOIN tb_warehouse ON tb_area.id_area = tb_warehouse.id_area WHERE tb_warehouse.id_ware='${data_produk[index].id_ware}'`);
                    var [display] = await connection.query(`SELECT * FROM displays WHERE id_produk='${data_produk[index].id_produk}' AND id_ware='${data_produk[index].id_ware}'`);

                    datas.push({
                        id: data_produk[index].id,
                        id_produk: data_produk[index].id_produk,
                        id_ware: data_produk[index].id_ware,
                        id_brand: data_produk[index].id_brand,
                        id_category: data_produk[index].id_category,
                        tanggal_upload: data_produk[index].tanggal_upload,
                        produk: data_produk[index].produk,
                        deskripsi: data_produk[index].deskripsi,
                        quality: data_produk[index].quality,
                        n_price: parseInt(data_produk[index].n_price) + parseInt(data_area[0].n_price),
                        r_price: parseInt(data_produk[index].r_price) + parseInt(data_area[0].r_price),
                        g_price: parseInt(data_produk[index].g_price) + parseInt(data_area[0].g_price),
                        img: data_produk[index].img,
                        users: data_produk[index].users,
                        created_at: data_produk[index].created_at,
                        updated_at: data_produk[index].updated_at,
                        detail: "",
                        detail_variation: detail_variation,
                        category: data_category,
                        warehouse: data_warehouse,
                        brand: data_brand,
                        display: display,
                    });
                }
            }
        }

        await connection.commit();
        await connection.release();
        return {
            datas,
            total_pages: Math.round(total_pages),
            show_page: limitss,
        };

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const addProduk = async (data, img) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    var rubahnama = data.produk.split(" ");
    for (let xxx = 0; xxx < rubahnama.length; xxx++) {
        rubahnama[xxx] = rubahnama[xxx][0].toUpperCase() + rubahnama[xxx].substring(1);
    }
    var namaproduk = rubahnama.join(" ")
    try {
        await connection.beginTransaction();

        const [cek_produk] = await connection.query(
            `SELECT MAX(id_produk) as id_produk FROM tb_produk`
        );
        if (cek_produk[0].id_produk === null) {
            var id_produk = "10" + tahun + "000001";
        } else {
            const get_last2 = cek_produk[0].id_produk;
            const data_2 = get_last2.toString().slice(-6);
            const hasil = parseInt(data_2) + 1;
            var id_produk = "10" + tahun + String(hasil).padStart(6, "0");
        }

        const [data_wares] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware='${data.warehouse}'`
        );
        for (let cek_ware = 0; cek_ware < data_wares.length; cek_ware++) {
            var [data_wares_2] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE brand='${data_wares[cek_ware].brand}'`
            );
        }

        const [data_sup] = await connection.query(
            `SELECT supplier FROM tb_supplier WHERE id_sup='${data.supplier}'`
        );

        if (data.file === 'null') {
            for (let xx = 0; xx < data_wares_2.length; xx++) {
                if (data.warehouse === "WARE-0001") {
                    await connection.query(
                        `INSERT INTO tb_produk
                        (id_produk, id_ware, id_brand, id_category, tanggal_upload, produk, deskripsi, quality, n_price, r_price, g_price, img, users, created_at, updated_at)
                        VALUES ('${id_produk}','${data_wares_2[xx].id_ware}','${data.brand}','${data.kategori}','${tanggal_skrg}','${namaproduk}','-','${data.quality}','${data.n_price}','${data.r_price}','${data.g_price}','defaultimg.png','${data.users}','${tanggal}','${tanggal}')`
                    );
                } else if (data.warehouse === "WARE-0002") {
                    await connection.query(
                        `INSERT INTO tb_produk
                        (id_produk, id_ware, id_brand, id_category, tanggal_upload, produk, deskripsi, quality, n_price, r_price, g_price, img, users, created_at, updated_at)
                        VALUES ('${id_produk}','${data_wares_2[xx].id_ware}','${data.brand}','${data.kategori}','${tanggal_skrg}','${namaproduk}','-','${data.quality}','${data.n_price}','${data.r_price}','${data.g_price}','defaultimg_subtle.png','${data.users}','${tanggal}','${tanggal}')`
                    );
                }
            }
        } else {
            for (let xx = 0; xx < data_wares_2.length; xx++) {
                await connection.query(
                    `INSERT INTO tb_produk
            (id_produk, id_ware, id_brand, id_category, tanggal_upload, produk, deskripsi, quality, n_price, r_price, g_price, img, users, created_at, updated_at)
            VALUES ('${id_produk}','${data_wares_2[xx].id_ware}','${data.brand}','${data.kategori}','${tanggal_skrg}','${namaproduk}','-','${data.quality}','${data.n_price}','${data.r_price}','${data.g_price}','${img}','${data.users}','${tanggal}','${tanggal}')`
                );
            }
        }

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

        const [cek_act] = await connection.query(
            `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
        );
        if (cek_act[0].id_act === null) {
            var id_act = "0001";
        } else {
            const get_last2 = cek_act[0].id_act;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var id_act = String(hasil).padStart(4, "0");
        }

        const [cek_po] = await connection.query(
            `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
        );
        if (cek_po[0].idpo === null) {
            var idpo = tahun + "0001";
        } else {
            const get_last2 = cek_po[0].idpo;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var idpo = tahun + String(hasil).padStart(4, "0");
        }

        const [data_ware] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware='${data.warehouse}'`
        );

        const variasi = JSON.parse(data.variasi)
        const id_area = data_ware[0].id_area

        const [data_wares_variasi] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware != '${data.warehouse}'`
        );

        for (let indexz = 0; indexz < data_wares_2.length; indexz++) {
            if (data_wares_2[indexz].id_ware != data.warehouse) {
                for (let bb = 0; bb < variasi.length; bb++) {
                    await connection.query(
                        `INSERT INTO tb_variation
                    (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at)
                    VALUES ('${tanggal_skrg}','${id_produk}','${idpo}','${id_area}','${data_wares_2[indexz].id_ware}','${variasi[bb].size.toUpperCase()}','0','${id_act}','${data.users}','${tanggal}','${tanggal}')`
                    );
                }
            }
        }

        for (let index = 0; index < variasi.length; index++) {
            await connection.query(
                `INSERT INTO tb_variation
            (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at)
            VALUES ('${tanggal_skrg}','${id_produk}','${idpo}','${id_area}','${data.warehouse}','${variasi[index].size.toUpperCase()}','${variasi[index].stok}','${id_act}','${data.users}','${tanggal}','${tanggal}')`
            );

            await connection.query(
                `INSERT INTO tb_variationorder
            (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
            VALUES ('${tanggal_skrg}','${id_produk}','${idpo}','${data.supplier}','${id_area}','${data.warehouse}','${variasi[index].size.toUpperCase()}','${variasi[index].stok}','${id_act}','RELEASE','${data.users}','${tanggal}','${tanggal}')`
            );

            if (variasi[index].stok > 0) {
                await connection.query(
                    `INSERT INTO tb_mutasistock
                (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                VALUES ('${id_mutasi}','${tanggal_skrg}','BARANG BARU','${data.warehouse}','-','${id_produk}','${namaproduk}','${idpo}','${variasi[index].size.toUpperCase()}','${variasi[index].stok}','Barang Gudang','${data_sup[0].supplier}','ADD_PRODUK','${data.users}','${tanggal}','${tanggal}')`
                );
            }
        }

        await connection.query(
            `INSERT INTO tb_purchaseorder
                (idpo, tanggal_receive, id_sup, id_produk, id_ware, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
                VALUES ('${idpo}','${tanggal_skrg}','${data.supplier}','${id_produk}','${data.warehouse}','${data.qty_all}','${data.hargabeli}','${data.total_amount}','RELEASE','${id_act}','${data.users}','${tanggal}','${tanggal}')`
        );

        // ✅ INSERT produk baru ke semua SPK yang sudah ada (per warehouse × per supplier)
        const [allSuppliers] = await connection.query(`SELECT id_sup FROM tb_supplier ORDER BY id ASC`);

        for (const ware of data_wares_2) {
            // Ambil semua id_spk unik yang ada di warehouse ini
            const [existingSpk] = await connection.query(
                `SELECT DISTINCT id_spk, nama, harga, id_spk_detail
                 FROM tb_spk
                 WHERE id_ware = ?`,
                [ware.id_ware]
            );

            for (const spkRow of existingSpk) {
                for (const sup of allSuppliers) {
                    // Cek apakah sudah ada (hindari duplikat)
                    const [cekDup] = await connection.query(
                        `SELECT 1 FROM tb_spk WHERE id_spk = ? AND id_produk = ? AND id_ware = ? AND id_sup = ? LIMIT 1`,
                        [spkRow.id_spk, id_produk, ware.id_ware, sup.id_sup]
                    );
                    if (cekDup.length === 0) {
                        await connection.query(
                            `INSERT INTO tb_spk (id_spk, nama, qty, id_produk, id_ware, id_sup, harga, id_spk_detail, created_at, updated_at)
                             VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?)`,
                            [spkRow.id_spk, spkRow.nama, id_produk, ware.id_ware, sup.id_sup, spkRow.harga ?? 0, spkRow.id_spk_detail ?? null, tanggal, tanggal]
                        );
                    }
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

const editProduk = async (data, img) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    var edit_produk = data.edit_produk[0].toUpperCase() + data.edit_produk.substring(1);
    try {
        await connection.beginTransaction();

        var edit_g_price = data.edit_g_price.replace(/\D/g, "");
        var edit_r_price = data.edit_r_price.replace(/\D/g, "");
        var edit_n_price = data.edit_n_price.replace(/\D/g, "");

        const [get_id_produk] = await connection.query(
            `SELECT id_produk FROM tb_produk WHERE id='${data.id}'`
        );

        await connection.query(
            `UPDATE tb_produk SET produk='${edit_produk}',id_brand='${data.edit_brand}',id_category='${data.edit_kategori}',quality='${data.edit_quality}',g_price='${edit_g_price}',r_price='${edit_r_price}',n_price='${edit_n_price}',updated_at='${tanggal}' WHERE id_produk='${get_id_produk[0].id_produk}'`
        );

        if (img === null || img === undefined || img === 'undefined') {

        } else {
            await connection.query(
                `UPDATE tb_produk SET img='${img}' WHERE id_produk='${get_id_produk[0].id_produk}'`
            );
        }

        await connection.commit();
        await connection.release();

        return 'oke';
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deleteProduk = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM tb_produk WHERE id_produk='${body.id}' AND id_ware='${body.idware}'`
        );

        await connection.query(
            `DELETE FROM tb_variation WHERE id_produk='${body.id}' AND id_ware='${body.idware}'`
        );

        await connection.query(
            `DELETE FROM tb_variationorder WHERE id_produk='${body.id}' AND id_ware='${body.idware}'`
        );

        await connection.query(
            `DELETE FROM tb_purchaseorder WHERE id_produk='${body.id}' AND id_ware='${body.idware}'`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getSizesales = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [datasize] = await connection.query(
            `SELECT *,SUM(qty) as qty 
             FROM tb_variation 
             WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' 
             GROUP BY size 
             ORDER BY 
                CASE 
                    WHEN size IN ('XS','S','M','L','XL','XXL') THEN FIELD(size, 'XS', 'S', 'M', 'L', 'XL', 'XXL')
                    WHEN size REGEXP '^[0-9]+$' THEN CAST(size AS UNSIGNED)
                    ELSE 1000
                END`
        );
        const [stokready] = await connection.query(
            `SELECT qty,SUM(qty)as qty FROM tb_variation WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' AND size='${body.size}' GROUP BY size`
        );
        for (let xox = 0; xox < stokready.length; xox++) {
            var get_stokready = stokready[xox].qty;
        }
        for (let index = 0; index < datasize.length; index++) {
            var [display] = await connection.query(
                `SELECT * FROM displays WHERE id_produk='${datasize[index].id_produk}' AND id_ware='${datasize[index].id_ware}' AND size='${datasize[index].size}'`
            );
            for (let xxx = 0; xxx < display.length; xxx++) {
                var display_id_produk = display[xxx].id_produk;
                var display_id_ware = display[xxx].id_ware;
                var display_size = display[xxx].size;
            }
        }

        const [getwares] = await connection.query(
            `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.idware}'`
        );

        const [gudang_awal] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${body.idware}'`
        );

        const [get_hargajual] = await connection.query(
            `SELECT r_price FROM tb_produk WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'`
        );

        await connection.commit();
        await connection.release();

        return {
            gudang_awal,
            datasize,
            get_hargajual,
            display_id_produk,
            display_id_ware,
            display_size,
            get_stokready,
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getHistoriposelected = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const datas = [];

        const [data_po] = await connection.query(
            `SELECT tb_purchaseorder.*,SUM(qty) as qty,tb_supplier.supplier FROM tb_purchaseorder LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup WHERE tb_purchaseorder.id_ware='${body.idware}' AND tb_purchaseorder.id_produk='${body.idproduct}' AND tb_purchaseorder.tipe_order != 'TRANSFER IN' AND tb_purchaseorder.tipe_order != 'TRANSFER OUT' AND tb_purchaseorder.tipe_order != 'SO_GUDANG' GROUP BY tb_purchaseorder.idpo ORDER BY tb_purchaseorder.id DESC`
        );

        for (let index = 0; index < data_po.length; index++) {
            const [data_variationorder] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE idpo='${data_po[index].idpo}' AND id_ware='${body.idware}' AND id_produk='${body.idproduct}' GROUP BY size ORDER BY size DESC`
            );

            if (data_po[index].tipe_order === "TRANSFER") {
                const [get_ware] = await connection.query(
                    `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data_po[index].id_sup}'`
                );
                datas.push({
                    id: data_po[index].id,
                    idpo: data_po[index].idpo,
                    tanggal_receive: data_po[index].tanggal_receive,
                    id_sup: data_po[index].id_sup,
                    id_produk: data_po[index].id_produk,
                    id_ware: data_po[index].id_ware,
                    qty: data_po[index].qty,
                    m_price: data_po[index].m_price,
                    total_amount: data_po[index].total_amount,
                    tipe_order: data_po[index].tipe_order,
                    id_act: data_po[index].id_act,
                    users: data_po[index].users,
                    supplier: get_ware[0].warehouse,
                    id_spk: data_po[index].id_spk || null,
                    id_spk_detail: data_po[index].id_spk_detail || null,
                    variation: data_variationorder,
                });
            } else {
                datas.push({
                    id: data_po[index].id,
                    idpo: data_po[index].idpo,
                    tanggal_receive: data_po[index].tanggal_receive,
                    id_sup: data_po[index].id_sup,
                    id_produk: data_po[index].id_produk,
                    id_ware: data_po[index].id_ware,
                    qty: data_po[index].qty,
                    m_price: data_po[index].m_price,
                    total_amount: data_po[index].total_amount,
                    tipe_order: data_po[index].tipe_order,
                    id_act: data_po[index].id_act,
                    users: data_po[index].users,
                    supplier: data_po[index].supplier,
                    id_spk: data_po[index].id_spk || null,
                    id_spk_detail: data_po[index].id_spk_detail || null,
                    variation: data_variationorder,
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

const repeatStok = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {

        await connection.beginTransaction();
        const data = body.data;
        let hargabeli = parseInt(data.harga_beli_repeat.replace(/\D/g, "")) || 0;
        console.log("data restock", body);

        // ── Validasi SPK Detail jika production ──
        const spkDetailValue = body.id_spk_detail || null;
        let foundIdSpk = null;

        if (body.restockType === "production" && spkDetailValue) {
            const [spkRows] = await connection.query(
                `SELECT id_spk FROM tb_spk
                 WHERE id_spk_detail = ? AND id_sup = ? AND id_produk = ?
                 LIMIT 1`,
                [spkDetailValue, data.supplier_pobaru, data.id_produk]
            );
            if (spkRows.length === 0) {
                const err = new Error("Data Production tidak matching! ID SPK Detail tidak ditemukan untuk supplier ini.");
                err.code = "SPK_NOT_MATCHING";
                throw err;
            }
            foundIdSpk = spkRows[0].id_spk;
        }

        // ── Lookup harga dari tb_purchaseorder jika hargabeli = 0 ──
        if (hargabeli === 0 && spkDetailValue) {
            const [prevPo] = await connection.query(
                `SELECT m_price FROM tb_purchaseorder
                 WHERE id_spk_detail = ? AND id_produk = ? AND id_sup = ? AND m_price > 0
                 ORDER BY created_at DESC LIMIT 1`,
                [spkDetailValue, data.id_produk, data.supplier_pobaru]
            );
            if (prevPo.length > 0) {
                hargabeli = Number(prevPo[0].m_price);
                console.log("harga dari tb_purchaseorder:", hargabeli);
            }
        }

        var qty_all = 0;
        for (let index = 0; index < data.variasirestock.length; index++) {
            qty_all = qty_all + parseInt(data.variasirestock[index].stok_baru);
        }
        var total_amount = qty_all * parseInt(hargabeli);

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

        const [id_ware] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware='${data.id_gudang_pengirim}'`
        );

        const [cek_po] = await connection.query(
            `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
        );
        if (cek_po[0].idpo === null) {
            var idpo = tahun + "0001";
        } else {
            const get_last2 = cek_po[0].idpo;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var idpo = tahun + String(hasil).padStart(4, "0");
        }

        const [cek_act] = await connection.query(
            `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
        );
        if (cek_act[0].id_act === null) {
            var id_act = "0001";
        } else {
            const get_last2 = cek_act[0].id_act;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var id_act = String(hasil).padStart(4, "0");
        }

        const [get_product] = await connection.query(
            `SELECT * FROM tb_produk WHERE id_produk='${data.id_produk}'`
        );

        const [get_sup] = await connection.query(
            `SELECT * FROM tb_supplier WHERE id_sup='${data.supplier_pobaru}'`
        );

        const id_area = id_ware[0].id_area;
        const variasi = data.variasirestock;
        for (let index = 0; index < variasi.length; index++) {
            if (variasi[index] === null) continue;

            await connection.query(
                `INSERT INTO tb_variation (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at)
                 VALUES ('${tanggal_skrg}','${data.id_produk}','${idpo}','${id_area}','${data.id_gudang_pengirim}','${variasi[index].size}','${variasi[index].stok_baru}','${id_act}','${body.users}','${tanggal}','${tanggal}')`
            );

            await connection.query(
                `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                 VALUES ('${tanggal_skrg}','${data.id_produk}','${idpo}','${data.supplier_pobaru}','${id_area}','${data.id_gudang_pengirim}','${variasi[index].size}','${variasi[index].stok_baru}','${id_act}','RESTOCK','${body.users}','${tanggal}','${tanggal}')`
            );

            if (variasi[index].stok_baru > 0) {
                await connection.query(
                    `INSERT INTO tb_mutasistock (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                     VALUES ('${id_mutasi}','${tanggal_skrg}','REPEAT STOCK','${data.id_gudang_pengirim}','-','${data.id_produk}','${get_product[0].produk}','${idpo}','${variasi[index].size}','${variasi[index].stok_baru}','Barang Gudang','${get_sup[0].supplier}','RESTOCK','${body.users}','${tanggal}','${tanggal}')`
                );
            }
        }

        await connection.query(
            `INSERT INTO tb_purchaseorder
             (idpo, tanggal_receive, id_sup, id_produk, id_ware, id_spk, id_spk_detail, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,'RESTOCK',?,?,?,?)`,
            [
                idpo, tanggal_skrg, data.supplier_pobaru, data.id_produk, data.id_gudang_pengirim,
                foundIdSpk, spkDetailValue,
                qty_all, hargabeli, total_amount,
                id_act, body.users, tanggal, tanggal
            ]
        );

        // Auto-update harga di tb_spk saat barang datang
        if (foundIdSpk && spkDetailValue) {
            await connection.query(
                `UPDATE tb_spk
                 SET harga = ?, updated_at = NOW()
                 WHERE id_spk = ? AND id_produk = ? AND id_ware = ? AND id_sup = ?`,
                [
                    parseInt(hargabeli) || 0,
                    foundIdSpk,
                    data.id_produk,
                    data.id_gudang_pengirim,
                    data.supplier_pobaru,
                ]
            );
        }

        await connection.commit();
        await connection.release();
    } catch (error) {
        await connection.rollback();
        await connection.release();
        throw error;
    }
};

const getHargabeliso = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const datas = [];

        const [data_po] = await connection.query(
            `SELECT tb_purchaseorder.*,SUM(qty) as qty,tb_supplier.supplier FROM tb_purchaseorder LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup WHERE tb_purchaseorder.id_ware='${body.idware}' AND tb_purchaseorder.id_produk='${body.idproduct}' AND tb_purchaseorder.tipe_order != "SO_GUDANG" GROUP BY tb_purchaseorder.idpo ORDER BY tb_purchaseorder.id DESC`
        );

        for (let index = 0; index < data_po.length; index++) {
            const [data_variationorder] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE idpo='${data_po[index].idpo}' AND id_ware='${body.idware}' AND id_produk='${body.idproduct}' GROUP BY size ORDER BY size ASC`
            );

            if (data_po[index].tipe_order === "TRANSFER") {
                const [get_ware] = await connection.query(
                    `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data_po[index].id_sup}'`
                );
                datas.push({
                    id: data_po[index].id,
                    idpo: data_po[index].idpo,
                    tanggal_receive: data_po[index].tanggal_receive,
                    id_sup: data_po[index].id_sup,
                    id_produk: data_po[index].id_produk,
                    id_ware: data_po[index].id_ware,
                    qty: data_po[index].qty,
                    m_price: data_po[index].m_price,
                    total_amount: data_po[index].total_amount,
                    tipe_order: data_po[index].tipe_order,
                    id_act: data_po[index].id_act,
                    users: data_po[index].users,
                    supplier: get_ware,
                    variation: data_variationorder,
                });
            } else {
                datas.push({
                    id: data_po[index].id,
                    idpo: data_po[index].idpo,
                    tanggal_receive: data_po[index].tanggal_receive,
                    id_sup: data_po[index].id_sup,
                    id_produk: data_po[index].id_produk,
                    id_ware: data_po[index].id_ware,
                    qty: data_po[index].qty,
                    m_price: data_po[index].m_price,
                    total_amount: data_po[index].total_amount,
                    tipe_order: data_po[index].tipe_order,
                    id_act: data_po[index].id_act,
                    users: data_po[index].users,
                    supplier: data_po[index].supplier,
                    variation: data_variationorder,
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

const getHistorisoselected = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const datas = [];

        const [data_po] = await connection.query(
            `SELECT tb_purchaseorder.*,SUM(qty) as qty,tb_supplier.supplier FROM tb_purchaseorder LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup WHERE tb_purchaseorder.id_ware='${body.idware}' AND tb_purchaseorder.id_produk='${body.idproduct}' AND tipe_order="SO_GUDANG" GROUP BY tb_purchaseorder.idpo ORDER BY tb_purchaseorder.id DESC`
        );

        for (let index = 0; index < data_po.length; index++) {
            const [data_variationorder] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE idpo='${data_po[index].idpo}' AND id_ware='${body.idware}' AND id_produk='${body.idproduct}' AND tipe_order="SO_GUDANG" GROUP BY size ORDER BY size DESC`
            );

            if (data_po[index].tipe_order === "TRANSFER") {
                const [get_ware] = await connection.query(
                    `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data_po[index].id_sup}'`
                );
                datas.push({
                    id: data_po[index].id,
                    idpo: data_po[index].idpo,
                    tanggal_receive: data_po[index].tanggal_receive,
                    id_spk_detail: data_po[index].id_spk_detail,
                    id_sup: data_po[index].id_sup,
                    id_produk: data_po[index].id_produk,
                    id_ware: data_po[index].id_ware,
                    qty: data_po[index].qty,
                    m_price: data_po[index].m_price,
                    total_amount: data_po[index].total_amount,
                    tipe_order: data_po[index].tipe_order,
                    id_act: data_po[index].id_act,
                    users: data_po[index].users,
                    supplier: get_ware,
                    variation: data_variationorder,
                });
            } else {
                datas.push({
                    id: data_po[index].id,
                    idpo: data_po[index].idpo,
                    tanggal_receive: data_po[index].tanggal_receive,
                    id_spk_detail: data_po[index].id_spk_detail,
                    id_sup: data_po[index].id_sup,
                    id_produk: data_po[index].id_produk,
                    id_ware: data_po[index].id_ware,
                    qty: data_po[index].qty,
                    m_price: data_po[index].m_price,
                    total_amount: data_po[index].total_amount,
                    tipe_order: data_po[index].tipe_order,
                    id_act: data_po[index].id_act,
                    users: data_po[index].users,
                    supplier: data_po[index].supplier,
                    variation: data_variationorder,
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

const stockOpname = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();
        const data = body.data;

        var total_qty = 0;
        var qty_all = 0;
        for (let index = 0; index < data.variasirestock.length; index++) {
            qty_all = qty_all + parseInt(data.variasirestock[index].stok_baru);
        }

        const [id_ware] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware='${data.id_gudang_pengirim}'`
        );

        const [cek_po] = await connection.query(
            `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
        );
        if (cek_po[0].idpo === null) {
            var idpo = tahun + "0001";
        } else {
            const get_last2 = cek_po[0].idpo;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var idpo = tahun + String(hasil).padStart(4, "0");
        }

        const [cek_act] = await connection.query(
            `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
        );
        if (cek_act[0].id_act === null) {
            var id_act = "0001";
        } else {
            const get_last2 = cek_act[0].id_act;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var id_act = String(hasil).padStart(4, "0");
        }

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

        const [get_product] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${data.id_produk}'`
        );

        const [get_sup] = await connection.query(
            `SELECT * FROM tb_supplier WHERE id_sup='${data.supplier_pobaru}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data.id_gudang_pengirim}'`
        );

        const id_area = id_ware[0].id_area
        const variasi = data.variasirestock
        for (let index = 0; index < variasi.length; index++) {
            if (variasi[index].stok_baru != 0) {
                var [getdatavariation_total] = await connection.query(
                    `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk='${data.id_produk}' AND id_ware='${data.id_gudang_pengirim}' AND size='${variasi[index].size}' ORDER BY id ASC`
                );

                var [get_modal_last] = await connection.query(
                    `SELECT m_price FROM tb_purchaseorder WHERE id_produk='${data.id_produk}' AND id_ware="${data.id_gudang_pengirim}" AND m_price != '0' ORDER BY id DESC LIMIT 1`
                );

                var [getdatavariation] = await connection.query(
                    `SELECT id_produk,id_ware,idpo,size,qty,id_area FROM tb_variation WHERE id_produk='${data.id_produk}' AND id_ware='${data.id_gudang_pengirim}' AND size='${variasi[index].size}' ORDER BY id ASC`
                );

                for (let x = 0; x < getdatavariation.length; x++) {

                    if (x === (getdatavariation.length - 1)) {
                        await connection.query(
                            `UPDATE tb_variation SET qty='${parseInt(getdatavariation_total[0].totalqty) + parseInt(variasi[index].stok_baru)}',idpo='${idpo}',id_act='${id_act}',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                        );
                    } else {
                        await connection.query(
                            `UPDATE tb_variation SET qty='0',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                        );
                    }

                    if (x === 0) {
                        // Add Variasi Order
                        await connection.query(
                            `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${getdatavariation[x].id_produk}','${idpo}','${getdatavariation[x].id_ware}','${getdatavariation[x].id_area}','${getdatavariation[x].id_ware}','${variasi[index].size}','${variasi[index].stok_baru}','${id_act}','SO_GUDANG','${body.users}','${tanggal}','${tanggal}')`
                        );

                        // Update Variation Old QTY
                        await connection.query(
                            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','STOCK OPNAME','${getdatavariation[x].id_ware}','-','${getdatavariation[x].id_produk}','${get_product[0].produk}','${idpo}','${variasi[index].size}','${variasi[index].stok_baru}','Barang Gudang','${getwarehouse[0].warehouse}','STOCK OPNAME','${body.users}','${tanggal}','${tanggal}')`
                        );
                        total_qty = total_qty + parseInt(variasi[index].stok_baru);
                    }
                }
            }
        }
        var total_amount = total_qty * parseInt(get_modal_last[0].m_price);

        await connection.query(
            `INSERT INTO tb_purchaseorder
            (idpo, tanggal_receive, id_sup, id_produk, id_ware, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
            VALUES ('${idpo}','${tanggal_skrg}','SO_GUDANG','${data.id_produk}','${data.id_gudang_pengirim}','${total_qty}','${get_modal_last[0].m_price}','${total_amount}','SO_GUDANG','${id_act}','${body.users}','${tanggal}','${tanggal}')`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const transferStok = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();
        const data = body;
        // console.log(body.user)
        var qty_all = 0;
        for (let index = 0; index < data.variasitransfer.length; index++) {
            qty_all = qty_all + parseInt(data.variasitransfer[index].stok_baru);
        }
        // console.log(data.variasitransfer);

        const [produk_cek] = await connection.query(
            `SELECT * FROM tb_produk WHERE id_produk='${data.idproduk}' AND id_ware='${data.gudang_pengirim}'`
        );

        // if (produk_cek > 0) {
        // } else {
        //     var [get_produk] = await connection.query(
        //         `SELECT * FROM tb_produk WHERE id_produk='${data.idproduk}' AND id_ware='${data.gudang_pengirim}'`
        //     );

        //     await connection.query(
        //         `INSERT INTO tb_produk
        //         (id_produk, id_ware, id_brand, id_category, tanggal_upload, produk, deskripsi, quality, n_price, r_price, g_price, img, users, created_at, updated_at)
        //         VALUES ('${data.idproduk}','${data.gudang_tujuan}','${get_produk[0].id_brand}','${get_produk[0].id_category}','${tanggal_skrg}','${get_produk[0].produk}','-','${get_produk[0].quality}','${get_produk[0].n_price}','${get_produk[0].r_price}','${get_produk[0].g_price}','${get_produk[0].img}','ADMIN','${tanggal}','${tanggal}')`
        //     );
        // }
        var total_qty = 0;
        var total_modal = 0;

        const [id_ware] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware='${data.gudang_tujuan}'`
        );

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

        const [cek_po] = await connection.query(
            `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
        );
        if (!cek_po[0].idpo) {
            var idpo = "10001"; // Jika belum ada data, mulai dari 0001
        } else {
            let lastNumber = parseInt(cek_po[0].idpo); // Ambil nomor terakhir sebagai angka
            lastNumber += 1; // Tambah 1

            const numLength = cek_po[0].idpo.length; // Panjang nomor sebelumnya
            var idpo = String(lastNumber).padStart(numLength, "0"); // Jaga format panjang angka
        }

        const [cek_act] = await connection.query(
            `SELECT MAX(CAST(id_act AS UNSIGNED)) as id_act FROM tb_purchaseorder`
        );
        if (cek_act[0].id_act === null) {
            var id_act = "0001";
        } else {
            const get_last2 = cek_act[0].id_act;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var id_act = String(hasil).padStart(4, "0");
        }

        const id_area = id_ware[0].id_area
        const variasi = data.variasitransfer
        var idponext = parseInt(idpo) + parseInt(1);

        const [get_products] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${data.idproduk}'`
        );

        for (let index = 0; index < variasi.length; index++) {

            if (variasi[index].stok_baru != 0) {
                var qty_transfer = variasi[index].stok_baru;

                // cek stock Variasi
                var [get_var] = await connection.query(
                    `SELECT id_produk,idpo,id_ware,size,qty,id_act,users FROM tb_variation WHERE id_produk='${data.idproduk}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND qty > '0' ORDER BY idpo ASC`
                );
                var [get_var_sum] = await connection.query(
                    `SELECT SUM(qty) as totalqty FROM tb_variation WHERE id_produk='${data.idproduk}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND qty > '0' ORDER BY idpo ASC`
                );

                var totalqty = get_var_sum[0].totalqty;
                var qty_baru = parseInt(totalqty) - parseInt(qty_transfer);

                var [get_warehouse] = await connection.query(
                    `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data.gudang_pengirim}'`
                );

                for (let i = 0; i < get_var.length; i++) {
                    var get_qty = get_var[i].qty;
                    var qty_baru_single = parseInt(get_qty) - parseInt(qty_transfer);


                    var [get_modal] = await connection.query(
                        `SELECT m_price FROM tb_purchaseorder WHERE id_produk='${data.idproduk}' AND id_ware="${data.gudang_pengirim}" ORDER BY id DESC LIMIT 1`
                    );

                    var [cek_size] = await connection.query(
                        `SELECT * FROM tb_variation WHERE idpo='${idpo}' AND id_ware='${data.gudang_tujuan}' AND id_produk='${data.idproduk}' AND size='${variasi[index].size}' `
                    );

                    if (i === (get_var.length - 1)) {
                        await connection.query(
                            `UPDATE tb_variation SET qty='${qty_baru}',updated_at='${tanggal}' WHERE id_produk='${data.idproduk}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND idpo='${get_var[i].idpo}'`
                        );
                    } else {
                        await connection.query(
                            `UPDATE tb_variation SET qty='0',updated_at='${tanggal}' WHERE id_produk='${data.idproduk}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND idpo='${get_var[i].idpo}'`
                        );
                    }

                    if (i === 0) {
                        if (cek_size.length > 0) {
                            // Update Variation QTY
                            var cekqty = parseInt(cek_size[0].qty) + parseInt(qty_transfer);
                            await connection.query(
                                `UPDATE tb_variation SET qty='${cekqty}',updated_at='${tanggal}' WHERE idpo='${idpo}' AND id_ware='${data.gudang_tujuan}' AND size='${variasi[index].size}' AND id_produk='${data.idproduk}'`
                            );

                            // Add Variasi Order
                            await connection.query(
                                `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${data.idproduk}','${idpo}','${data.gudang_pengirim}','${id_area}','${data.gudang_tujuan}','${variasi[index].size}','${qty_transfer}','${id_act}','TRANSFER IN','${data.user}','${tanggal}','${tanggal}')`
                            );

                            // Update Variation Old QTY
                            await connection.query(
                                `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','TRANSFER PRODUCT','${data.gudang_tujuan}','-','${data.idproduk}','${get_products[0].produk}','${idpo}','${variasi[index].size}','${qty_transfer}','Barang Gudang','${get_warehouse[0].warehouse}','TRANSFER IN','${data.user}','${tanggal}','${tanggal}')`
                            );
                        } else {
                            // Add Variasi
                            await connection.query(
                                `INSERT INTO tb_variation (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${data.idproduk}','${idpo}','${id_area}','${data.gudang_tujuan}','${variasi[index].size}','${qty_transfer}','${id_act}','${data.user}','${tanggal}','${tanggal}')`
                            );

                            // Add Variasi Order
                            await connection.query(
                                `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${data.idproduk}','${idpo}','${data.gudang_pengirim}','${id_area}','${data.gudang_tujuan}','${variasi[index].size}','${qty_transfer}','${id_act}','TRANSFER IN','${data.user}','${tanggal}','${tanggal}')`
                            );

                            // Update Variation Old QTY
                            await connection.query(
                                `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','TRANSFER PRODUCT','${data.gudang_tujuan}','-','${data.idproduk}','${get_products[0].produk}','${idpo}','${variasi[index].size}','${qty_transfer}','Barang Gudang','${get_warehouse[0].warehouse}','TRANSFER IN','${data.user}','${tanggal}','${tanggal}')`
                            );
                        }
                        total_qty = parseInt(total_qty) + parseInt(qty_transfer);
                    }
                    total_modal = parseInt(total_modal) + (parseInt(get_modal[0].m_price) * parseInt(qty_transfer));
                }
            }
        }

        var hasil_total_amount = parseInt(total_qty) * (parseInt(get_modal[0].m_price));
        // Add PO Transfer Gudang Pengiriim
        var hasil_qty = 0 - parseInt(total_qty);
        await connection.query(
            `INSERT INTO tb_purchaseorder
            (idpo, tanggal_receive, id_sup, id_produk, id_ware, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
            VALUES ('${idpo}','${tanggal_skrg}','${data.gudang_pengirim}','${data.idproduk}','${data.gudang_tujuan}','${total_qty}','${get_modal[0].m_price}','${hasil_total_amount}','TRANSFER IN','${id_act}','${data.user}','${tanggal}','${tanggal}')`
        );
        // 

        await connection.query(
            `INSERT INTO tb_transfer_keterangan
            (id_act, ket)
            VALUES ('${id_act}','${data.keterangan}')`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const print_Stockopname = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();
        const datas = [];

        const [data_produk] = await connection.query(
            `SELECT 
                tb_produk.id,
                tb_produk.id_produk,
                tb_produk.id_ware,
                tb_produk.produk,
                tb_brand.brand,
                tb_warehouse.warehouse,
                SUM(sub_variation.total_qty) AS total_qty,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'size', sub_variation.size,
                        'qty', sub_variation.total_qty
                    )
                ) AS variation
            FROM tb_produk
            LEFT JOIN (
                SELECT 
                    id, 
                    id_produk, 
                    id_ware, 
                    size, 
                    SUM(qty) AS total_qty
                FROM tb_variation
                GROUP BY id_produk, id_ware, size ORDER BY id DESC
            ) AS sub_variation
            ON tb_produk.id_produk = sub_variation.id_produk 
            AND tb_produk.id_ware = sub_variation.id_ware
            LEFT JOIN tb_brand ON tb_brand.id_brand = tb_produk.id_brand
            LEFT JOIN tb_warehouse ON tb_warehouse.id_ware = tb_produk.id_ware
            WHERE tb_produk.id_ware = '${body.id_ware}'
            GROUP BY 
                tb_produk.id_produk, 
                tb_produk.produk, 
                tb_produk.id_ware, 
                tb_brand.brand, 
                tb_warehouse.warehouse
                HAVING total_qty != 0
            ORDER BY tb_produk.id_brand ASC,sub_variation.id DESC`
        );
        for (let index = 0; index < data_produk.length; index++) {
            datas.push({
                id: data_produk[index].id,
                id_produk: data_produk[index].id_produk,
                id_ware: data_produk[index].id_ware,
                warehouse: data_produk[index].warehouse,
                produk: data_produk[index].produk,
                variation: JSON.parse(data_produk[index].variation),
                brand: data_produk[index].brand,
                total_qty: data_produk[index].total_qty,
                total: data_produk.length,
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

// const getPo = async (body) => {
//     const connection = await dbPool.getConnection();
//     console.log(body);

//     // -- Date and Basic Variables
//     const tanggal = body.date;
//     const myArray = tanggal.split(" to ");
//     let tipepo = body.Filter_Tipe_po;
//     let supplier = body.Filter_Supplier;
//     let users = body.Filter_Tipe_user;

//     // Determine start/end date
//     let tanggal_start, tanggal_end;
//     if (tanggal.length > 10) {
//         [tanggal_start, tanggal_end] = myArray;
//     } else {
//         tanggal_start = tanggal;
//         tanggal_end = tanggal;
//     }

//     // =====================================================
//     // ROLE-BASED FILTER
//     // =====================================================
//     // HEAD-AREA  => tb_warehouse.id_area = body.user_store
//     // HEAD-WAREHOUSE => tb_warehouse.id_ware = body.user_store
//     // else => no additional filter
//     let roleFilter = "";
//     if (body.user_role === "HEAD-AREA") {
//         roleFilter = ` AND tb_warehouse.id_area = '${body.user_store}' `;
//     } else if (body.user_role === "HEAD-WAREHOUSE") {
//         roleFilter = ` AND tb_warehouse.id_ware = '${body.user_store}' `;
//     }

//     // -----------------------------------
//     // Helper: build WHERE clause for "body.query === 'all'"
//     // -----------------------------------
//     function buildWhereClauseAll(tanggal_start, tanggal_end) {
//         let where = `
//         (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
//         AND tb_purchaseorder.qty > 0
//         AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
//         ${roleFilter}  -- <--- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
//       `;
//         // Filter by supplier
//         if (supplier !== "all") {
//             where += ` AND tb_purchaseorder.id_sup='${supplier}'`;
//         }
//         // Filter by user
//         if (users !== "all") {
//             where += ` AND tb_purchaseorder.users='${users}'`;
//         }
//         // Filter by tipepo
//         if (tipepo !== "all") {
//             where += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
//         }

//         return where;
//     }

//     // -----------------------------------
//     // Helper: build WHERE clause for "body.query !== 'all'"
//     // -----------------------------------
//     function buildWhereClauseQuery(tanggal_start, tanggal_end) {
//         let where = `
//         (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
//         AND tb_purchaseorder.qty > 0
//         AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
//         AND (
//           tb_purchaseorder.id_produk LIKE '%${body.query}%'
//           OR tb_produk.produk LIKE '%${body.query}%'
//         )
//         ${roleFilter}  -- <--- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
//       `;
//         // Filter by supplier
//         if (supplier !== "all") {
//             where += ` AND tb_purchaseorder.id_sup='${supplier}'`;
//         }
//         // Filter by user
//         if (users !== "all") {
//             where += ` AND tb_purchaseorder.users='${users}'`;
//         }
//         // Filter by tipepo
//         if (tipepo !== "all") {
//             where += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
//         }

//         return where;
//     }

//     // -----------------------------------
//     // Variables we will send to frontend
//     // -----------------------------------
//     let get_po = [];
//     let total_po = [];
//     let hasil_totalqty = 0;
//     let hasil_amount = 0;

//     try {
//         // 1. Build the WHERE clause
//         if (body.query === "all") {
//             // If user didn't search anything
//             const whereAll = buildWhereClauseAll(tanggal_start, tanggal_end);

//             // Use LEFT JOIN tb_warehouse in the main queries
//             [get_po] = await connection.query(`
//           SELECT 
//             DISTINCT tb_purchaseorder.*,
//             tb_purchaseorder.users, 
//             tb_purchaseorder.tanggal_receive
//           FROM tb_purchaseorder
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereAll}
//           GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
//           ORDER BY tb_purchaseorder.tanggal_receive DESC,tb_purchaseorder.users DESC
//         `);

//             [total_po] = await connection.query(`
//           SELECT COUNT(tb_purchaseorder.idpo) AS totalpo
//           FROM tb_purchaseorder
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereAll}
//           GROUP BY tb_purchaseorder.tanggal_receive,tb_purchaseorder.users
//         `);

//             const [total_qty_rows] = await connection.query(`
//           SELECT SUM(tb_purchaseorder.qty) AS totalqtys
//           FROM tb_purchaseorder
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereAll}
//           GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
//         `);

//             // compute hasil_totalqty
//             for (let row of total_qty_rows) {
//                 if (!row.totalqtys) {
//                     hasil_totalqty = "0";
//                 } else {
//                     hasil_totalqty = parseInt(hasil_totalqty) + parseInt(row.totalqtys);
//                 }
//             }

//             // capital_amount
//             const [capital_amount] = await connection.query(`
//           SELECT IFNULL(SUM(tb_purchaseorder.total_amount), 0) AS amount
//           FROM tb_purchaseorder
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereAll}
//         `);

//             for (let x = 0; x < capital_amount.length; x++) {
//                 if (!capital_amount[x].amount) {
//                     hasil_amount = "0";
//                 } else {
//                     hasil_amount = parseInt(capital_amount[x].amount);
//                 }
//             }
//         } else {
//             //  body.query !== "all"
//             const whereQuery = buildWhereClauseQuery(tanggal_start, tanggal_end);

//             [get_po] = await connection.query(`
//           SELECT 
//             tb_purchaseorder.*,
//             COUNT(tb_purchaseorder.idpo) AS totalpo,
//             SUM(tb_purchaseorder.qty) AS totalqtys,
//             tb_produk.produk
//           FROM tb_purchaseorder
//           LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereQuery}
//           GROUP BY tb_purchaseorder.tanggal_receive, tb_produk.users
//           ORDER BY tb_purchaseorder.tanggal_receive,tb_purchaseorder.users DESC
//         `);

//             [total_po] = await connection.query(`
//           SELECT 
//             tb_purchaseorder.*,
//             COUNT(DISTINCT tb_purchaseorder.idpo) AS totalpo,
//             SUM(DISTINCT tb_purchaseorder.qty) AS totalqtys,
//             tb_produk.produk
//           FROM tb_purchaseorder
//           LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereQuery}
//           GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
//         `);

//             // Calculate hasil_totalqty
//             for (let row of total_po) {
//                 if (!row.totalqtys) {
//                     hasil_totalqty = "0";
//                 } else {
//                     hasil_totalqty = parseInt(hasil_totalqty) + parseInt(row.totalqtys);
//                 }
//             }

//             // Calculate hasil_amount
//             for (let zxc = 0; zxc < total_po.length; zxc++) {
//                 const dateReceive = get_po[zxc]?.tanggal_receive;
//                 if (!dateReceive) continue;

//                 const [capital_amount] = await connection.query(`
//             SELECT 
//               IFNULL(SUM(DISTINCT tb_purchaseorder.total_amount), 0) AS amount
//             FROM tb_purchaseorder
//             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
//             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//             WHERE ${whereQuery}
//               AND tb_purchaseorder.tanggal_receive='${dateReceive}'
//             GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
//           `);

//                 if (capital_amount.length && capital_amount[0].amount) {
//                     hasil_amount = parseInt(hasil_amount) + parseInt(capital_amount[0].amount);
//                 }
//             }
//         }

//         // ---------------------------------
//         // Retrieving Details & Building Final Array
//         // ---------------------------------
//         const datas = [];
//         let created_at = null;

//         await connection.beginTransaction();

//         for (let index = 0; index < get_po.length; index++) {
//             let total_qty = 0;
//             let total_cost = 0;

//             // Build detail WHERE clause (simplified)
//             let detailWhere = `
//           (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
//           AND tb_purchaseorder.qty > 0
//           AND tb_purchaseorder.users='${get_po[index].users}'
//           AND tb_purchaseorder.tanggal_receive='${get_po[index].tanggal_receive}'
//           ${roleFilter}  -- HEAD-AREA or HEAD-WAREHOUSE filter
//         `;

//             // If query = all
//             if (body.query === "all") {
//                 if (supplier !== "all") {
//                     detailWhere += ` AND tb_purchaseorder.id_sup='${get_po[index].id_sup}'`;
//                 }
//                 if (users !== "all") {
//                     detailWhere += ` AND tb_purchaseorder.users='${get_po[index].users}'`;
//                 }
//                 if (tipepo !== "all") {
//                     detailWhere += ` AND tb_purchaseorder.tipe_order='${get_po[index].tipe_order}'`;
//                 }
//                 detailWhere += ` 
//             AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
//           `;
//             } else {
//                 // query != all
//                 detailWhere += `
//             AND (
//               tb_purchaseorder.id_produk LIKE '%${body.query}%'
//               OR tb_produk.produk LIKE '%${body.query}%'
//             )
//             AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
//           `;
//                 if (supplier !== "all") {
//                     detailWhere += ` AND tb_purchaseorder.id_sup='${get_po[index].id_sup}'`;
//                 }
//                 if (users !== "all") {
//                     detailWhere += ` AND tb_purchaseorder.users='${get_po[index].users}'`;
//                 }
//                 if (tipepo !== "all") {
//                     detailWhere += ` AND tb_purchaseorder.tipe_order='${get_po[index].tipe_order}'`;
//                 }
//             }

//             // Fetch detail
//             const [get_detail] = await connection.query(`
//           SELECT 
//             tb_purchaseorder.*,
//             tb_produk.produk,
//             tb_supplier.supplier,
//             tb_warehouse.warehouse
//           FROM tb_purchaseorder
//           LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
//           LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${detailWhere}
//           GROUP BY tb_purchaseorder.tanggal_receive,
//                    tb_purchaseorder.users,
//                    tb_purchaseorder.tipe_order,
//                    tb_purchaseorder.idpo
//           ORDER BY tb_purchaseorder.id DESC
//         `);

//             // Build inner data array
//             const datas2 = [];
//             for (let i = 0; i < get_detail.length; i++) {
//                 // Summaries
//                 let sumWhere = `
//             tb_purchaseorder.tanggal_receive='${get_detail[i].tanggal_receive}'
//             AND (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
//             AND tb_purchaseorder.tipe_order != 'DEFECT OUT'
//             AND tb_purchaseorder.qty > '0'
//             ${roleFilter}  -- HEAD-AREA or HEAD-WAREHOUSE filter
//           `;

//                 if (body.query === "all") {
//                     sumWhere += ` AND tb_purchaseorder.users='${get_detail[i].users}'`;
//                     if (supplier !== "all") {
//                         sumWhere += ` AND tb_purchaseorder.id_sup='${get_detail[i].id_sup}'`;
//                     }
//                     if (tipepo !== "all") {
//                         sumWhere += ` AND tb_purchaseorder.tipe_order='${get_detail[i].tipe_order}'`;
//                     }
//                 } else {
//                     // query != all
//                     sumWhere += `
//               AND tb_purchaseorder.users='${get_detail[i].users}'
//               AND (
//                 tb_purchaseorder.id_produk LIKE '%${body.query}%'
//                 OR tb_produk.produk LIKE '%${body.query}%'
//               )
//             `;
//                     if (supplier !== "all") {
//                         sumWhere += ` AND tb_purchaseorder.id_sup='${get_detail[i].id_sup}'`;
//                     }
//                     if (tipepo !== "all") {
//                         sumWhere += ` AND tb_purchaseorder.tipe_order='${get_detail[i].tipe_order}'`;
//                     }
//                 }

//                 const [get_total] = await connection.query(`
//             SELECT 
//               SUM(tb_purchaseorder.total_amount) AS hasil_amount,
//               SUM(tb_purchaseorder.qty) AS hasil_qty
//             FROM tb_purchaseorder
//             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
//             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//             WHERE ${sumWhere}
//             GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users, tb_purchaseorder.idpo
//           `);

//                 datas2.push({
//                     id: get_po[index].id,
//                     idpo: get_detail[i].idpo,
//                     tanggal_receive: get_detail[i].tanggal_receive,
//                     id_sup: get_detail[i].id_sup,
//                     id_produk: get_detail[i].id_produk,
//                     id_ware: get_detail[i].id_ware,
//                     qty: get_detail[i].qty,
//                     m_price: get_detail[i].m_price,
//                     total_amount: get_detail[i].total_amount,
//                     tipe_order: get_detail[i].tipe_order,
//                     id_act: get_detail[i].id_act,
//                     produk: get_detail[i].produk,
//                     gudang: get_detail[i].warehouse,
//                     supplier: get_detail[i].supplier,
//                 });

//                 if (get_total.length) {
//                     total_qty = total_qty + parseInt(get_detail[i].qty) || 0;
//                     total_cost = total_cost + parseInt(get_detail[i].total_amount) || 0;
//                 }
//             }

//             datas.push({
//                 tanggal: get_po[index].tanggal_receive,
//                 id_so: get_po[index].idpo,
//                 users: get_po[index].users,
//                 total_qty,
//                 total_cost,
//                 detail: datas2,
//             });

//             created_at = get_po[index].tanggal_receive;
//         }

//         await connection.commit();
//         await connection.release();

//         return {
//             datas,
//             total_po: get_po.length ? get_po.length : 0,
//             total_qty: hasil_totalqty,
//             capital_amount: hasil_amount ? hasil_amount : 0,
//             created_at,
//         };
//     } catch (error) {
//         console.log(error);
//         await connection.release();
//         return { error: error.message };
//     }
// };

// const getPo = async (body) => {
//     const connection = await dbPool.getConnection();
//     console.log(body);

//     // -- Date and Basic Variables
//     const tanggal = body.date;
//     const myArray = tanggal.split(" to ");
//     let tipepo = body.Filter_Tipe_po;
//     let supplier = body.Filter_Supplier;
//     let users = body.Filter_Tipe_user;

//     // Determine start/end date
//     let tanggal_start, tanggal_end;
//     if (tanggal.length > 10) {
//         [tanggal_start, tanggal_end] = myArray;
//     } else {
//         tanggal_start = tanggal;
//         tanggal_end = tanggal;
//     }

//     // =====================================================
//     // ROLE-BASED FILTER
//     // =====================================================
//     let roleFilter = "";
//     if (body.user_role === "HEAD-AREA") {
//         roleFilter = ` AND tb_warehouse.id_area = '${body.user_store}' `;
//     } else if (body.user_role === "HEAD-WAREHOUSE") {
//         roleFilter = ` AND tb_warehouse.id_ware = '${body.user_store}' `;
//     }

//     // =====================================================
//     // BRAND FILTER
//     // =====================================================
//     let brandFilter = "";
//     if (body.Brand !== "all") {
//         brandFilter = ` AND tb_warehouse.id_area = '${body.Brand}' `;
//     }

//     // -----------------------------------
//     // Helper: build WHERE clause for "body.query === 'all'"
//     // -----------------------------------
//     function buildWhereClauseAll(tanggal_start, tanggal_end) {
//         let where = `
//         (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
//         AND tb_purchaseorder.qty > 0
//         AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
//         ${roleFilter}  -- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
//         ${brandFilter} -- Append BRAND filter if any
//       `;
//         if (supplier !== "all") {
//             where += ` AND tb_purchaseorder.id_sup='${supplier}'`;
//         }
//         if (users !== "all") {
//             where += ` AND tb_purchaseorder.users='${users}'`;
//         }
//         if (tipepo !== "all") {
//             where += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
//         }
//         return where;
//     }

//     // -----------------------------------
//     // Variables we will send to frontend
//     // -----------------------------------
//     let get_po = [];
//     let hasil_totalqty = 0;
//     let hasil_amount = 0;

//     try {
//         const whereAll = buildWhereClauseAll(tanggal_start, tanggal_end);

//         // Main query to get PO data
//         [get_po] = await connection.query(`
//           SELECT 
//             DISTINCT tb_purchaseorder.*,
//             tb_purchaseorder.users, 
//             tb_purchaseorder.tanggal_receive
//           FROM tb_purchaseorder
//           LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//           WHERE ${whereAll}
//           GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
//           ORDER BY tb_purchaseorder.tanggal_receive DESC, tb_purchaseorder.users DESC
//         `);

//         // ---------------------------------
//         // Retrieving Details & Building Final Array
//         // ---------------------------------
//         const datas = [];
//         for (let index = 0; index < get_po.length; index++) {
//             let total_qty = 0;
//             let total_cost = 0;

//             // Build detail WHERE clause
//             let detailWhere = `
//               (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
//               AND tb_purchaseorder.qty > 0
//               AND tb_purchaseorder.users='${get_po[index].users}'
//               AND tb_purchaseorder.tanggal_receive='${get_po[index].tanggal_receive}'
//               ${roleFilter} -- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
//               ${brandFilter} -- Append BRAND filter if any
//             `;

//             if (supplier !== "all") {
//                 detailWhere += ` AND tb_purchaseorder.id_sup='${supplier}'`;
//             }
//             if (users !== "all") {
//                 detailWhere += ` AND tb_purchaseorder.users='${users}'`;
//             }
//             if (tipepo !== "all") {
//                 detailWhere += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
//             }

//             // Fetch detail
//             const [get_detail] = await connection.query(`
//               SELECT 
//                 tb_purchaseorder.*,
//                 tb_produk.produk,
//                 tb_supplier.supplier,
//                 tb_warehouse.warehouse
//               FROM tb_purchaseorder
//               LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
//               LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup
//               LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//               WHERE ${detailWhere}
//               GROUP BY tb_purchaseorder.tanggal_receive,
//                        tb_purchaseorder.users,
//                        tb_purchaseorder.tipe_order,
//                        tb_purchaseorder.idpo
//               ORDER BY tb_purchaseorder.id DESC
//             `);

//             // Build inner data array
//             const datas2 = [];
//             for (let i = 0; i < get_detail.length; i++) {
//                 datas2.push({
//                     idpo: get_detail[i].idpo,
//                     tanggal_receive: get_detail[i].tanggal_receive,
//                     id_sup: get_detail[i].id_sup,
//                     id_produk: get_detail[i].id_produk,
//                     id_ware: get_detail[i].id_ware,
//                     qty: get_detail[i].qty,
//                     m_price: get_detail[i].m_price,
//                     total_amount: get_detail[i].total_amount,
//                     tipe_order: get_detail[i].tipe_order,
//                     produk: get_detail[i].produk,
//                     gudang: get_detail[i].warehouse,
//                     supplier: get_detail[i].supplier,
//                 });

//                 total_qty += parseInt(get_detail[i].qty || 0);
//                 total_cost += parseInt(get_detail[i].total_amount || 0);
//             }

//             datas.push({
//                 tanggal: get_po[index].tanggal_receive,
//                 users: get_po[index].users,
//                 total_qty,
//                 total_cost,
//                 detail: datas2,
//             });

//             hasil_totalqty += total_qty;
//             hasil_amount += total_cost;
//         }

//         await connection.release();

//         return {
//             datas,
//             total_po: get_po.length,
//             total_qty: hasil_totalqty,
//             capital_amount: hasil_amount,
//         };
//     } catch (error) {
//         console.error(error);
//         await connection.release();
//         return { error: error.message };
//     }
// };

const getPo = async (body) => {
    const connection = await dbPool.getConnection();

    // -- Date and Basic Variables
    const tanggal = body.date;
    const myArray = tanggal.split(" to ");
    let tipepo = body.Filter_Tipe_po;
    let supplier = body.Filter_Supplier;
    let users = body.Filter_Tipe_user;
    let created_at_list = [];

    // Determine start/end date
    let tanggal_start, tanggal_end;
    if (tanggal.length > 10) {
        [tanggal_start, tanggal_end] = myArray;
    } else {
        tanggal_start = tanggal;
        tanggal_end = tanggal;
    }

    // =====================================================
    // ROLE-BASED FILTER
    // =====================================================
    let roleFilter = "";
    if (body.user_role === "HEAD-AREA") {
        roleFilter = ` AND tb_warehouse.id_area = '${body.user_store}' `;
    } else if (body.user_role === "HEAD-WAREHOUSE") {
        roleFilter = ` AND tb_warehouse.id_ware = '${body.user_store}' `;
    }

    // =====================================================
    // BRAND FILTER
    // =====================================================
    let brandFilter = "";
    if (body.Brand !== "all") {
        brandFilter = ` AND tb_warehouse.id_area = '${body.Brand}' `;
    }

    // -----------------------------------
    // Helper: build WHERE clause for "body.query === 'all'"
    // -----------------------------------
    function buildWhereClauseAll(tanggal_start, tanggal_end) {
        let where = `
        (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
        AND tb_purchaseorder.qty > 0
        AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
        ${roleFilter}  -- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
        ${brandFilter} -- Append BRAND filter if any
      `;
        if (supplier !== "all") {
            where += ` AND tb_purchaseorder.id_sup='${supplier}'`;
        }
        if (users !== "all") {
            where += ` AND tb_purchaseorder.users='${users}'`;
        }
        if (tipepo !== "all") {
            where += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
        }
        return where;
    }

    // -----------------------------------
    // Helper: build WHERE clause for "body.query !== 'all'"
    // -----------------------------------
    function buildWhereClauseQuery(tanggal_start, tanggal_end) {
        let where = `
        (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
        AND tb_purchaseorder.qty > 0
        AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
        AND (
          tb_purchaseorder.id_produk LIKE '%${body.query}%'
          OR tb_produk.produk LIKE '%${body.query}%'
        )
        ${roleFilter}  -- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
        ${brandFilter} -- Append BRAND filter if any
      `;
        if (supplier !== "all") {
            where += ` AND tb_purchaseorder.id_sup='${supplier}'`;
        }
        if (users !== "all") {
            where += ` AND tb_purchaseorder.users='${users}'`;
        }
        if (tipepo !== "all") {
            where += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
        }
        return where;
    }

    // -----------------------------------
    // Variables we will send to frontend
    // -----------------------------------
    let get_po = [];
    let hasil_totalqty = 0;
    let hasil_amount = 0;

    try {
        // Determine which WHERE clause to use based on body.query
        const whereClause =
            body.query === "all"
                ? buildWhereClauseAll(tanggal_start, tanggal_end)
                : buildWhereClauseQuery(tanggal_start, tanggal_end);

        // Main query to get PO data
        [get_po] = await connection.query(`
          SELECT 
            DISTINCT tb_purchaseorder.*,
            tb_purchaseorder.users, 
            tb_purchaseorder.tanggal_receive
          FROM tb_purchaseorder
          LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
          LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
          WHERE ${whereClause}
          GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
          ORDER BY tb_purchaseorder.tanggal_receive DESC, tb_purchaseorder.users DESC
        `);

        // ---------------------------------
        // Retrieving Details & Building Final Array
        // ---------------------------------
        const datas = [];
        for (let index = 0; index < get_po.length; index++) {
            let total_qty = 0;
            let total_cost = 0;

            // Build detail WHERE clause
            let detailWhere = `
              (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK')
              AND tb_purchaseorder.qty > 0
              AND tb_purchaseorder.users='${get_po[index].users}'
              AND tb_purchaseorder.tanggal_receive='${get_po[index].tanggal_receive}'
              ${roleFilter} -- Append HEAD-AREA or HEAD-WAREHOUSE filter if any
              ${brandFilter} -- Append BRAND filter if any
            `;

            if (body.query !== "all") {
                detailWhere += `
                  AND (
                    tb_purchaseorder.id_produk LIKE '%${body.query}%'
                    OR tb_produk.produk LIKE '%${body.query}%'
                  )
                `;
            }

            if (supplier !== "all") {
                detailWhere += ` AND tb_purchaseorder.id_sup='${supplier}'`;
            }
            if (users !== "all") {
                detailWhere += ` AND tb_purchaseorder.users='${users}'`;
            }
            if (tipepo !== "all") {
                detailWhere += ` AND tb_purchaseorder.tipe_order='${tipepo}'`;
            }

            // Fetch detail
            const [get_detail] = await connection.query(`
              SELECT 
                tb_purchaseorder.*,
                tb_produk.produk,
                tb_supplier.supplier,
                tb_warehouse.warehouse
              FROM tb_purchaseorder
              LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
              LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup
              LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
              WHERE ${detailWhere}
              GROUP BY tb_purchaseorder.tanggal_receive,
                       tb_purchaseorder.users,
                       tb_purchaseorder.tipe_order,
                       tb_purchaseorder.idpo
              ORDER BY tb_purchaseorder.id DESC
            `);

            // Build inner data array
            const datas2 = [];
            for (let i = 0; i < get_detail.length; i++) {
                datas2.push({
                    idpo: get_detail[i].idpo,
                    tanggal_receive: get_detail[i].tanggal_receive,
                    id_spk_detail: get_detail[i].id_spk_detail,
                    id_sup: get_detail[i].id_sup,
                    id_produk: get_detail[i].id_produk,
                    id_ware: get_detail[i].id_ware,
                    qty: get_detail[i].qty,
                    m_price: get_detail[i].m_price,
                    total_amount: get_detail[i].total_amount,
                    tipe_order: get_detail[i].tipe_order,
                    produk: get_detail[i].produk,
                    gudang: get_detail[i].warehouse,
                    supplier: get_detail[i].supplier,
                    id_act: get_detail[i].id_act,
                    idpo: get_detail[i].idpo,
                    created_at: get_detail[i].created_at,
                });

                total_qty += parseInt(get_detail[i].qty || 0);
                total_cost += parseInt(get_detail[i].total_amount || 0);
            }
            created_at_list.push(get_po[index].tanggal_receive);

            datas.push({
                tanggal: get_po[index].tanggal_receive,
                users: get_po[index].users,
                total_qty,
                total_cost,
                detail: datas2,
            });

            hasil_totalqty += total_qty;
            hasil_amount += total_cost;
        }
        const created_at = [...new Set(created_at_list)].join(", ");

        await connection.release();

        return {
            datas,
            total_po: get_po.length,
            total_qty: hasil_totalqty,
            capital_amount: hasil_amount,
            created_at, // Sekarang berupa string
        };
    } catch (error) {
        console.error(error);
        await connection.release();
        return { error: error.message };
    }
};

const getHistoripo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_historypo] = await connection.query(
            `SELECT * FROM tb_purchaseorder WHERE tipe_order != "TRANSFER" AND tipe_order != "SO_GUDANG" GROUP BY idpo ORDER BY id DESC LIMIT 1`
        );

        await connection.commit();
        await connection.release();

        return data_historypo;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const get_Sizepo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_getsize] = await connection.query(
            `SELECT *, SUM(qty) AS qty
             FROM tb_variationorder
             WHERE id_act='${body.id_act}'
             GROUP BY size
             ORDER BY 
             FIELD(size, 'XS', 'S', 'M', 'L', 'XL', 'XXL'),
             FIELD(size, '28', '29', '30', '31', '32','33', '34', '36', '38', '40')`
        );

        await connection.commit();
        await connection.release();
        return data_getsize;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const editPo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");


    const [cek_mutasi] = await connection.query(
        `SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`
    );
    const id_mutasi = cek_mutasi[0].id_mutasi === null
        ? "MT-00000001"
        : "MT-" + String(parseInt(cek_mutasi[0].id_mutasi.slice(-8)) + 1).padStart(8, "0");

    try {
        await connection.beginTransaction();
        const variasi = body.data.variasirestock;
        let total_qty = 0;

        const [produk_baru] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}'`
        );

        const [getpo] = await connection.query(
            `SELECT m_price, id_sup, idpo, tanggal_receive, id_spk, id_spk_detail FROM tb_purchaseorder WHERE id_act='${body.id_act}' LIMIT 1`
        );

        const [cekdetail] = await connection.query(
            `SELECT * FROM tb_variation WHERE id_act='${body.id_act}' LIMIT 1`
        );

        const [getsupplier] = await connection.query(
            `SELECT supplier FROM tb_supplier WHERE id_sup='${getpo[0].id_sup}'`
        );

        for (let index = 0; index < variasi.length; index++) {
            const size = variasi[index].size;
            const stokLama = parseInt(variasi[index].stok_lama);
            const stokBaru = parseInt(variasi[index].stok_baru);
            const selisih = stokBaru - stokLama;

            if (stokLama !== stokBaru) {
                const [getdatavariation_all] = await connection.query(
                    `SELECT id, qty, id_area FROM tb_variation WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}' AND size='${size}' AND qty != 0 ORDER BY id ASC`
                );

                let remainingSelisih = Math.abs(selisih);
                for (let x = 0; x < getdatavariation_all.length; x++) {
                    const { id, qty } = getdatavariation_all[x];

                    if (selisih > 0) { // Penambahan stok
                        const addQty = Math.min(remainingSelisih, stokBaru - stokLama);
                        await connection.query(
                            `UPDATE tb_variation SET qty=qty + ${addQty}, updated_at='${tanggal}' WHERE id=${id}`
                        );
                        remainingSelisih -= addQty;
                    } else if (selisih < 0) { // Pengurangan stok
                        const subtractQty = Math.min(remainingSelisih, qty);
                        await connection.query(
                            `UPDATE tb_variation SET qty=qty - ${subtractQty}, updated_at='${tanggal}' WHERE id=${id}`
                        );
                        remainingSelisih -= subtractQty;
                    }

                    if (remainingSelisih <= 0) break;
                }

                if (selisih > 0 && remainingSelisih > 0) {
                    // Jika stok baru lebih besar dan data tidak cukup, tambahkan baris baru
                    await connection.query(
                        `INSERT INTO tb_variation (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at) 
                        VALUES ('${getpo[0].tanggal_receive}','${body.idproduk}','${getpo[0].idpo}','${cekdetail[0].id_area}','${body.id_ware}','${size}','${remainingSelisih}','${body.id_act}', '${body.users}', '${tanggal}', '${tanggal}')`
                    );
                }

                await connection.query(
                    `UPDATE tb_variationorder SET qty='${stokBaru}', updated_at='${tanggal}' \
                    WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}' AND size='${size}' AND id_act='${body.id_act}'`
                );

                await connection.query(
                    `INSERT INTO tb_mutasistock (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at) \
                    VALUES ('${id_mutasi}', '${tanggal_skrg}', 'EDIT DATA PO', '${body.id_ware}', '-', '${body.idproduk}', '${produk_baru[0].produk}', '${getpo[0].idpo}', '${size}', '${stokBaru}', 'Barang Gudang', '${getsupplier[0].supplier}', 'EDIT DATA PO', '${body.users}', '${tanggal}', '${tanggal}')`
                );
            }

            total_qty += stokBaru;
        }

        const [getpovariationorder] = await connection.query(
            `SELECT SUM(qty) AS totals FROM tb_variationorder WHERE id_act='${body.id_act}'`
        );

        await connection.query(
            `UPDATE tb_purchaseorder SET total_amount='${parseInt(body.m_price) * parseInt(getpovariationorder[0].totals)}', qty='${getpovariationorder[0].totals}', m_price='${body.m_price}', updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
        );

        const [gettborder] = await connection.query(
            `SELECT m_price FROM tb_order WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}' AND m_price='0'`
        );

        for (let zzz = 0; zzz < gettborder.length; zzz++) {
            await connection.query(
                `UPDATE tb_order SET m_price='${body.m_price}' WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}' AND m_price='0'`
            );
        }

        // ✅ Update harga di tb_spk berdasarkan id_spk + id_spk_detail
        // Hanya jika PO ini terhubung ke SPK (restock dari proses produksi)
        const poSpkId = getpo[0]?.id_spk || null;
        const poSpkDetail = getpo[0]?.id_spk_detail || null;
        if (poSpkId && poSpkDetail && body.m_price) {
            await connection.query(
                `UPDATE tb_spk
                 SET harga = ?, updated_at = ?
                 WHERE id_spk = ?
                   AND id_spk_detail = ?
                   AND id_produk = ?
                   AND id_ware   = ?
                   AND id_sup    = ?`,
                [
                    parseInt(body.m_price) || 0,
                    tanggal,
                    poSpkId,
                    poSpkDetail,
                    body.idproduk,
                    body.id_ware,
                    getpo[0].id_sup,
                ]
            );

            // ✅ Update harga di tb_spk_reject berdasarkan id_produk + id_sup + id_spk_detail
            await connection.query(
                `UPDATE tb_spk_reject
                 SET harga    = ?,
                     subtotal = harga * qty_reject
                 WHERE id_produk    = ?
                   AND id_sup       = ?
                   AND id_spk_detail = ?`,
                [
                    parseInt(body.m_price) || 0,
                    body.idproduk,
                    getpo[0].id_sup,
                    poSpkDetail,
                ]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error(error);
    } finally {
        await connection.release();
    }
};

const deleteItem = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");


    const [cek_po] = await connection.query(
        `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
    );
    if (cek_po[0].idpo === null) {
        var idpo = tahun + "0001";
    } else {
        const get_last2 = cek_po[0].idpo;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var idpo = tahun + String(hasil).padStart(4, "0");
    }

    const [cek_act] = await connection.query(
        `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
    );
    if (cek_act[0].id_act === null) {
        var id_act = "0001";
    } else {
        const get_last2 = cek_act[0].id_act;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var id_act = String(hasil).padStart(4, "0");
    }

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

    try {
        await connection.beginTransaction();

        var [getpo] = await connection.query(
            `SELECT tb_variationorder.*,tb_purchaseorder.id_sup,tb_purchaseorder.qty AS totalqty,tb_purchaseorder.m_price FROM tb_variationorder LEFT JOIN tb_purchaseorder ON tb_variationorder.id_act = tb_purchaseorder.id_act WHERE tb_variationorder.id_act='${body.id_act}'  ORDER BY tb_variationorder.id ASC`
        );

        var [getpo_order] = await connection.query(
            `SELECT tb_variationorder.qty,tb_variationorder.id_sup,tb_variationorder.idpo FROM tb_variationorder LEFT JOIN tb_purchaseorder ON tb_variationorder.id_act = tb_purchaseorder.id_act WHERE tb_variationorder.id_act='${body.id_act}' ORDER BY tb_variationorder.id ASC`
        );

        var [get_var_sum] = await connection.query(
            `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk='${getpo[0].id_produk}' AND id_ware='${getpo[0].id_ware}' AND size='${getpo[0].size}' AND qty > '0' ORDER BY idpo ASC`
        );

        const [getproducts] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${getpo[0].id_produk}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${getpo[0].id_ware}'`
        );

        var totalqty = 0;
        for (let index = 0; index < getpo.length; index++) {
            totalqty = parseInt(totalqty) + parseInt(getpo_order[index].qty);
            if (getpo[index].qty < 0) {

                await connection.query(
                    `UPDATE tb_variation SET qty='${getpo_order[index].qty}',id_ware='${getpo_order[index].id_sup}',idpo='${getpo_order[index].idpo}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${getpo[index].size}'`
                );

                await connection.query(
                    `UPDATE tb_variationorder SET qty='0',tipe_order='CANCEL TRANSFER',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
                );
            } else {

                await connection.query(
                    `UPDATE tb_variation SET qty='${getpo_order[index].qty}',id_ware='${getpo_order[index].id_sup}',idpo='${getpo_order[index].idpo}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${getpo[index].size}'`
                );

                await connection.query(
                    `UPDATE tb_variationorder SET qty='0',tipe_order='CANCEL TRANSFER',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
                );
            }

            // // Update Variation Old QTY
            await connection.query(
                `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','CANCEL TRANSFER','${getpo[index].id_sup}','-','${getpo[index].id_produk}','${getproducts[0].produk}','${getpo[index].idpo}','${getpo[index].size}','${getpo[index].qty}','Barang Gudang','${getwarehouse[0].warehouse}','CANCEL TRANSFER','${body.users}','${tanggal}','${tanggal}')`
            );
        }
        await connection.query(
            `UPDATE tb_purchaseorder SET qty='${totalqty}',m_price='${getpo[0].m_price}',total_amount='0',tipe_order='CANCEL TRANSFER',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deletePo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM tb_variation WHERE idpo='${body.id_po}'`
        );

        await connection.query(
            `DELETE FROM tb_variationorder WHERE idpo='${body.id_po}'`
        );

        await connection.query(
            `DELETE FROM tb_purchaseorder WHERE idpo='${body.id_po}'`
        );

        await connection.commit();
        await connection.release();
        // console.log(body);
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getHistoriso = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_historyso] = await connection.query(
            `SELECT * FROM tb_purchaseorder WHERE tipe_order = "SO_GUDANG" GROUP BY idpo ORDER BY id DESC LIMIT 5`
        );

        await connection.commit();
        await connection.release();

        return data_historyso;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

// const getSo = async (body) => {
//     const connection = await dbPool.getConnection();
//     console.log(body);

//     const [tanggal_start, tanggal_end] = body.date.includes(" to ")
//         ? body.date.split(" to ")
//         : [body.date, body.date];

//     // Filtering conditions based on user role and store
//     let warehouseCondition = "";
//     if (body.user_role === "HEAD-AREA") {
//         warehouseCondition = `AND tb_warehouse.id_area = '${body.user_store}'`;
//     } else if (body.user_role === "HEAD-WAREHOUSE") {
//         warehouseCondition = `AND tb_warehouse.id_ware = '${body.user_store}'`;
//     }

//     // Query condition for 'query' field
//     const queryCondition = body.query !== "all"
//         ? `AND (tb_purchaseorder.id_produk LIKE '%${body.query}%' OR tb_produk.produk LIKE '%${body.query}%')`
//         : "";

//     try {
//         const getPoQuery = `
//             SELECT tb_purchaseorder.*, tb_warehouse.warehouse, tb_produk.produk 
//             FROM tb_purchaseorder 
//             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
//             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
//             WHERE tb_purchaseorder.tipe_order='SO_GUDANG' 
//             AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
//             ${queryCondition} 
//             ${warehouseCondition} 
//             GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users ORDER BY tb_purchaseorder.id DESC`;

//         const totalPoQuery = `
//             SELECT COUNT(DISTINCT tb_purchaseorder.idpo) as totalpo, 
//                    SUM(tb_purchaseorder.qty) as totalqtys 
//             FROM tb_purchaseorder 
//             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
//             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk  AND tb_purchaseorder.id_ware = tb_produk.id_ware
//             WHERE tb_purchaseorder.tipe_order='SO_GUDANG' 
//             AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
//             ${queryCondition} 
//             ${warehouseCondition}`;

//         const capitalAmountQuery = `
//             SELECT IFNULL(SUM(tb_purchaseorder.total_amount), 0) AS amount 
//             FROM tb_purchaseorder 
//             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
//             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk AND tb_purchaseorder.id_ware = tb_produk.id_ware 
//             WHERE tb_purchaseorder.tipe_order='SO_GUDANG' 
//             AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
//             ${queryCondition} 
//             ${warehouseCondition}`;

//         const [get_po] = await connection.query(getPoQuery);

//         const [total_po] = await connection.query(totalPoQuery);
//         const [capital_amount] = await connection.query(capitalAmountQuery);

//         const totalQty = total_po.reduce((sum, item) => sum + (parseInt(item.totalqtys) || 0), 0);
//         const totalAmount = parseInt(capital_amount[0].amount) || 0;

//         const datas = await Promise.all(
//             get_po.map(async (po) => {
//                 const getDetailQuery = `
//                     SELECT tb_purchaseorder.*, tb_warehouse.warehouse, tb_produk.produk 
//                     FROM tb_purchaseorder 
//                     LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
//                     LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
//                     WHERE tb_purchaseorder.tanggal_receive='${po.tanggal_receive}' AND tb_purchaseorder.users='${po.users}'  
//                     AND tb_purchaseorder.tipe_order='SO_GUDANG' 
//                     ${warehouseCondition} 
//                     GROUP BY tb_purchaseorder.id_act
//                     ORDER BY tb_purchaseorder.id DESC`;
//                 const [get_detail] = await connection.query(getDetailQuery);

//                 const detail = get_detail.map((detail) => ({
//                     ...detail,
//                 }));

//                 const totalQty = detail.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
//                 const totalCost = detail.reduce((sum, item) => sum + (parseInt(item.total_amount) || 0), 0);

//                 return {
//                     tanggal: po.tanggal_receive,
//                     users: po.users,
//                     id_so: po.idpo,
//                     total_qty: totalQty,
//                     total_cost: totalCost,
//                     detail,
//                 };
//             })
//         );

//         await connection.release();

//         return {
//             datas,
//             total_po: datas.length || 0,
//             total_qty: totalQty,
//             capital_amount: totalAmount,
//         };
//     } catch (error) {
//         console.error(error);
//         await connection.release();
//         throw error;
//     }
// };

const getSo = async (body) => {
    const connection = await dbPool.getConnection();

    const [tanggal_start, tanggal_end] = body.date.includes(" to ")
        ? body.date.split(" to ")
        : [body.date, body.date];

    // Filtering conditions based on user role and store
    let warehouseCondition = "";
    if (body.user_role === "HEAD-AREA") {
        warehouseCondition = `AND tb_warehouse.id_area = '${body.user_store}'`;
    } else if (body.user_role === "HEAD-WAREHOUSE") {
        warehouseCondition = `AND tb_warehouse.id_ware = '${body.user_store}'`;
    }

    // Filtering condition for Brand
    const brandCondition = body.Brand !== "all"
        ? `AND tb_warehouse.id_area = '${body.Brand}'`
        : "";

    // Query condition for 'query' field
    const queryCondition = body.query !== "all"
        ? `AND (tb_purchaseorder.id_produk LIKE '%${body.query}%' OR tb_produk.produk LIKE '%${body.query}%')`
        : "";

    let created_at_list = [];

    try {
        const getPoQuery = `
            SELECT tb_purchaseorder.*, tb_warehouse.warehouse, tb_produk.produk 
            FROM tb_purchaseorder 
            LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
            LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
            WHERE tb_purchaseorder.tipe_order='SO_GUDANG' 
            AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
            ${queryCondition} 
            ${warehouseCondition} 
            ${brandCondition} 
            GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users 
            ORDER BY tb_purchaseorder.id DESC`;

        const totalPoQuery = `
            SELECT COUNT(DISTINCT tb_purchaseorder.idpo) as totalpo, 
                   SUM(tb_purchaseorder.qty) as totalqtys 
            FROM tb_purchaseorder 
            LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
            LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk  AND tb_purchaseorder.id_ware = tb_produk.id_ware
            WHERE tb_purchaseorder.tipe_order='SO_GUDANG' 
            AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
            ${queryCondition} 
            ${warehouseCondition} 
            ${brandCondition}`;

        const capitalAmountQuery = `
            SELECT IFNULL(SUM(tb_purchaseorder.total_amount), 0) AS amount 
            FROM tb_purchaseorder 
            LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
            LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk AND tb_purchaseorder.id_ware = tb_produk.id_ware 
            WHERE tb_purchaseorder.tipe_order='SO_GUDANG' 
            AND tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
            ${queryCondition} 
            ${warehouseCondition} 
            ${brandCondition}`;

        const [get_po] = await connection.query(getPoQuery);

        const [total_po] = await connection.query(totalPoQuery);
        const [capital_amount] = await connection.query(capitalAmountQuery);
        const totalQty = total_po.reduce((sum, item) => sum + (parseInt(item.totalqtys) || 0), 0);
        const totalAmount = parseInt(capital_amount[0].amount) || 0;

        const datas = await Promise.all(
            get_po.map(async (po) => {
                const getDetailQuery = `
                    SELECT tb_purchaseorder.*, tb_warehouse.warehouse, tb_produk.produk 
                    FROM tb_purchaseorder 
                    LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware 
                    LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                    WHERE tb_purchaseorder.tanggal_receive='${po.tanggal_receive}' AND tb_purchaseorder.users='${po.users}'  
                    AND tb_purchaseorder.tipe_order='SO_GUDANG' 
                    ${warehouseCondition} 
                    ${brandCondition} 
                    GROUP BY tb_purchaseorder.id_act
                    ORDER BY tb_purchaseorder.id DESC`;
                const [get_detail] = await connection.query(getDetailQuery);

                const detail = get_detail.map((detail) => ({
                    ...detail,
                }));

                const totalQty = detail.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
                const totalCost = detail.reduce((sum, item) => sum + (parseInt(item.total_amount) || 0), 0);
                created_at_list.push(po.tanggal_receive);

                return {
                    tanggal: po.tanggal_receive,
                    users: po.users,
                    id_so: po.idpo,
                    total_qty: totalQty,
                    total_cost: totalCost,
                    detail,
                };
            })
        );
        const created_at = [...new Set(created_at_list)].join(", ");
        await connection.release();

        return {
            datas,
            total_po: datas.length || 0,
            total_qty: totalQty,
            capital_amount: totalAmount,
            created_at, // Sekarang berupa string
        };
    } catch (error) {
        console.error(error);
        await connection.release();
        throw error;
    }
};

const getProdukbarcode = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.role === "SUPER-ADMIN" || body.role === "HEAD-AREA") {
            var areas = body.area;
        } else if (body.role === "HEAD-WAREHOUSE") {
            var [cek_area] = await connection.query(
                `SELECT id_ware FROM tb_warehouse WHERE id_ware='${body.area}' GROUP BY id_ware`
            );
            var areas = cek_area[0].id_ware;
        } else {
            var [cek_store] = await connection.query(
                `SELECT id_ware FROM tb_store WHERE id_store='${body.area}' GROUP BY id_store`
            );
            var areas = cek_store[0].id_ware;
        }

        if (body.warehouse == "all") {
            var [get_produk] = await connection.query(
                `SELECT tb_produk.*,tb_warehouse.* FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware ORDER BY tb_produk.id DESC`
            );
        } else if (body.warehouse === "all_area") {
            var [get_produk] = await connection.query(
                `SELECT tb_produk.*,tb_warehouse.* FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${areas}' ORDER BY tb_produk.id DESC`
            );
        } else if (body.warehouse === "wares") {
            var [get_produk] = await connection.query(
                `SELECT tb_produk.*,tb_warehouse.* FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_ware='${areas}' ORDER BY tb_produk.id DESC`
            );
        } else {
            var [get_produk] = await connection.query(
                `SELECT tb_produk.*,tb_warehouse.* FROM tb_produk LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware WHERE tb_produk.id_ware='${body.warehouse}' ORDER BY tb_produk.id DESC`
            );
        }


        await connection.commit();
        await connection.release();

        return get_produk;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getWarehousebarcode = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_role] = await connection.query(
            `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
        );

        if (body.role === 'SUPER-ADMIN') {
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse`
            );
        } else if (body.role === 'HEAD-AREA') {
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_area='${data_role[0].id_store} '`
            );
        } else if (body.role === 'HEAD-WAREHOUSE') {
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_ware='${body.area}'`
            );
        } else {
            var [data_store] = await connection.query(
                `SELECT id_ware FROM tb_store WHERE id_store='${body.area}'`
            );
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_ware='${data_store[0].id_ware}'`
            );
        }

        await connection.commit();
        await connection.release();

        return data_warehouse;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getIdpo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [get_idpo] = await connection.query(
            `SELECT * FROM tb_purchaseorder WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' AND qty >= 0 ORDER BY id DESC`
        );

        await connection.commit();
        await connection.release();

        return get_idpo;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getSizebarcode = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_getsize] = await connection.query(
            `SELECT *,SUM(qty)as qty FROM tb_variationorder WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' AND idpo='${body.idpo}' AND qty >= 0 GROUP BY size`
        );

        await connection.commit();
        await connection.release();
        return data_getsize;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getStore_sales = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
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
                `SELECT * FROM tb_store WHERE id_area='${data_role[0].id_store} '`
            );
        } else {
            var [data_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_store='${data_role[0].id_store}'`
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

const getStore_sales_online = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_role] = await connection.query(
            `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
        );

        if (body.role === 'SUPER-ADMIN') {
            if (body.Brand === "all") {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE channel != 'OFFLINE STORE'`
                );
            } else {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE channel != 'OFFLINE STORE' AND id_area='${body.Brand}'`
                );
            }

        } else if (body.role === 'HEAD-AREA') {
            var [data_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_area='${body.store}' AND channel != 'OFFLINE STORE'`
            );
        } else if (body.role === 'HEAD-WAREHOUSE') {
            var [data_awal_store] = await connection.query(
                `SELECT id_area FROM tb_store WHERE id_ware='${body.store}' AND channel != 'OFFLINE STORE'`
            );
            for (let x = 0; x < data_awal_store.length; x++) {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_area='${data_awal_store[x].id_area}' AND channel != 'OFFLINE STORE'`
                );
            }
        } else {
            var [list_data_role] = await connection.query(
                `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.store}'`
            );
            for (let x = 0; x < list_data_role.length; x++) {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_store='${list_data_role[x].id_store}' AND channel != 'OFFLINE STORE' GROUP BY id_store`
                );
            }
        }

        var [data_brand] = await connection.query(
            `SELECT brand,id_area FROM tb_warehouse GROUP BY brand`
        );

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

const getstore_cashier_online = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_role] = await connection.query(
            `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
        );

        if (body.role === 'SUPER-ADMIN') {
            var [data_store] = await connection.query(
                `SELECT * FROM tb_store WHERE channel != 'OFFLINE STORE'`
            );
        } else if (body.role === 'HEAD-AREA') {
            var [data_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_area='${body.store}' AND channel != 'OFFLINE STORE'`
            );
        } else if (body.role === 'HEAD-WAREHOUSE') {
            var [data_awal_store] = await connection.query(
                `SELECT id_area FROM tb_store WHERE id_ware='${body.store}' AND channel != 'OFFLINE STORE'`
            );
            for (let x = 0; x < data_awal_store.length; x++) {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_area='${data_awal_store[x].id_area}' AND channel != 'OFFLINE STORE'`
                );
            }
        } else {
            var [list_data_role] = await connection.query(
                `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.store}'`
            );
            for (let x = 0; x < list_data_role.length; x++) {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_store='${list_data_role[x].id_store}' AND channel != 'OFFLINE STORE' GROUP BY id_store`
                );
            }
        }

        await connection.commit();
        await connection.release();
        return data_store;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getStore_dashboard = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_role] = await connection.query(
            `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
        );

        if (body.role === 'SUPER-ADMIN') {
            if (body.Brand === 'all') {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store`
                );
            } else {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_area='${body.Brand}'`
                );
            }
        } else if (body.role === 'HEAD-AREA') {
            var [data_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_area='${body.store}'`
            );
        } else if (body.role === 'HEAD-WAREHOUSE') {
            var [data_awal_store] = await connection.query(
                `SELECT id_area FROM tb_store WHERE id_ware='${body.store}'`
            );
            for (let x = 0; x < data_awal_store.length; x++) {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_area='${data_awal_store[x].id_area}'`
                );
            }
        } else {
            var [list_data_role] = await connection.query(
                `SELECT * FROM tb_karyawan WHERE role='${body.role}' AND id_store='${body.store}'`
            );
            for (let x = 0; x < list_data_role.length; x++) {
                var [data_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_store='${list_data_role[x].id_store}' GROUP BY id_store`
                );
            }
        }

        var [data_brands] = await connection.query(
            `SELECT brand,id_area FROM tb_warehouse GROUP BY brand`
        );

        await connection.commit();
        await connection.release();
        return { data_store, data_brands };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getWarehouse_sales = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

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
        } else if (body.role === 'HEAD-WAREHOUSE') {
            var [data_awal_ware] = await connection.query(
                `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.area}'`
            );
            for (let x = 0; x < data_awal_ware.length; x++) {
                var [data_ware] = await connection.query(
                    `SELECT * FROM tb_warehouse WHERE id_area='${data_awal_ware[x].id_area}'`
                );
            }
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

const getWarehouse_sales_online = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();
        const [data_role] = await connection.query(
            `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
        );

        if (body.role === 'SUPER-ADMIN') {
            var [data_ware] = await connection.query(
                `SELECT * FROM tb_warehouse`
            );
        } else {
            var [data_ware] = await connection.query(
                `SELECT tb_store.*,tb_warehouse.* FROM tb_store LEFT JOIN tb_warehouse ON tb_store.id_ware = tb_warehouse.id_ware WHERE tb_store.id_store='${data_role[0].id_store}'`
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

const getMutation = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const tanggal = body.date;
    const myArray = tanggal.split(" to ");

    if (tanggal.length > 10) {
        var tanggal_start = myArray[0];
        var tanggal_end = myArray[1];
    } else {
        var tanggal_start = tanggal;
        var tanggal_end = tanggal;
    }

    console.log("cek body", body);


    if (body.user_role === "HEAD-AREA") {
        var data_awal_settle = body.user_store;
    } else if (body.user_role === "HEAD-WAREHOUSE") {
        var [get_data_awal] = await connection.query(
            `SELECT id_area FROM warehouse WHERE id_ware='${body.user_store}' GROUP BY id_area`
        );
        for (let x = 0; x < get_data_awal.length; x++) {
            var data_awal_settle = get_data_awal[x].id_area;
        }
    }

    try {
        await connection.beginTransaction();
        const datas = [];

        if (body.user_role === "SUPER-ADMIN") {
            if (body.Brand === "all") {
                var [query] = await connection.query(
                    `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware 
                            LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store 
                            WHERE tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                );

                var [getstockawal] = await connection.query(
                    `SELECT DISTINCT stok_akhir 
                    FROM tb_settlement 
                    WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' 
                   ORDER BY tanggal DESC, updated_at DESC
                     LIMIT 1 OFFSET 1`
                );
                const totalStokAkhir_awal = getstockawal.reduce((sum, item) => sum + item.stok_akhir, 0);
                var totalStokAkhir = totalStokAkhir_awal;

                var [query_transaksi] = await connection.query(
                    `SELECT * FROM tb_mutasistock WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_mutasi`
                );

                var [total_barangmasuk] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND (mutasi='ADD_PRODUK' OR mutasi='RESTOCK') AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_in_refund] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='REFUND' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_in_cancel] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='CANCEL_ORDER' OR mutasi='DELETE_ORDER' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_in_retur] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='RETUR_IN' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_retur] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='RETUR_OUT' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_sales_online] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='SALES ONLINE' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_sales_toko] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='SALES RETAIL' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [get_stok_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_variation`
                );


                var [total_in_defect] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='DEFECT IN' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_defect] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE source='Barang Gudang' AND mutasi='DEFECT OUT' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );
            } else {
                var [query] = await connection.query(
                    `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware 
                            LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store 
                            WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                );

                var [getstockawal] = await connection.query(
                    `SELECT * FROM tb_settlement WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
                );

                var [getstockawal] = await connection.query(
                    `SELECT DISTINCT stok_akhir 
                     FROM tb_settlement 
                     WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' AND id_area='${body.Brand}'
                     ORDER BY id_area DESC`
                );
                const totalStokAkhir_awal = getstockawal.reduce((sum, item) => sum + item.stok_akhir, 0);
                var totalStokAkhir = totalStokAkhir_awal;

                var [query_transaksi] = await connection.query(

                    `SELECT * FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_mutasistock.id_mutasi`
                );

                var [total_barangmasuk] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND (tb_mutasistock.mutasi='ADD_PRODUK' OR tb_mutasistock.mutasi='RESTOCK') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_in_refund] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='REFUND' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_in_cancel] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='CANCEL_ORDER' OR tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_in_retur] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='RETUR_IN' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_retur] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='RETUR_OUT' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_sales_online] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='SALES ONLINE' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_sales_toko] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='SALES RETAIL' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [get_stok_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_variation WHERE id_area='${data_awal_settle}'`
                );

                var [total_in_defect] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='DEFECT IN' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );

                var [total_out_defect] = await connection.query(

                    `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.Brand}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='DEFECT OUT' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );
            }


        } else if (body.user_role === "HEAD-WAREHOUSE") {
            var [query] = await connection.query(
                `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware 
                        LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store 
                        WHERE tb_mutasistock.users='${body.user_login}' AND tb_mutasistock.id_ware='${body.user_store}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
            );

            var [getstockawal] = await connection.query(
                `SELECT * FROM tb_settlement WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
            );


            var [query_transaksi] = await connection.query(
                `SELECT * FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_mutasi`
            );

            var [total_barangmasuk] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND (mutasi='ADD_PRODUK' OR mutasi='RESTOCK') AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_refund] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='REFUND' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_cancel] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='CANCEL_ORDER' OR mutasi='DELETE_ORDER' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_retur] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='RETUR_IN' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_retur] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='RETUR_OUT' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_sales_online] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='SALES ONLINE' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_sales_toko] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='SALES RETAIL' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [get_stok_all] = await connection.query(
                `SELECT SUM(qty) as qty FROM tb_variation AND id_area='${data_awal_settle}'`
            );

            var [total_in_defect] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='DEFECT IN' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_defect] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE id_ware='${body.user_store}' AND source='Barang Gudang' AND mutasi='DEFECT OUT' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
        } else if (body.user_role === "HEAD-AREA") {
            var [query] = await connection.query(
                `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware 
                        LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store 
                        WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
            );

            var [getstockawal] = await connection.query(
                `SELECT DISTINCT stok_akhir 
                 FROM tb_settlement 
                 WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' AND id_area='${body.user_store}'
                 ORDER BY tanggal DESC, updated_at DESC
                     LIMIT 1 OFFSET 1`
            );
            const totalStokAkhir_awal = getstockawal.reduce((sum, item) => sum + item.stok_akhir, 0);
            var totalStokAkhir = totalStokAkhir_awal;


            var [query_transaksi] = await connection.query(

                `SELECT * FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_mutasistock.id_mutasi`
            );

            var [total_barangmasuk] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND (tb_mutasistock.mutasi='ADD_PRODUK' OR tb_mutasistock.mutasi='RESTOCK') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_refund] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='REFUND' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_cancel] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='CANCEL_ORDER' OR tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_retur] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='RETUR_IN' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_retur] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='RETUR_OUT' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_sales_online] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='SALES ONLINE' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_sales_toko] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='SALES RETAIL' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [get_stok_all] = await connection.query(
                `SELECT SUM(qty) as qty FROM tb_variation WHERE id_area='${data_awal_settle}'`
            );

            var [total_in_defect] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='DEFECT IN' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_defect] = await connection.query(

                `SELECT *,SUM(qty) as qty FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tb_mutasistock.source='Barang Gudang' AND tb_mutasistock.mutasi='DEFECT OUT' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
        } else {
            var [query] = await connection.query(
                `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware 
                        LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store 
                        WHERE tb_mutasistock.users='${body.user_login}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
            );

            var [getstockawal] = await connection.query(
                `SELECT * FROM tb_settlement WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
            );

            var [query_transaksi] = await connection.query(
                `SELECT * FROM tb_mutasistock WHERE  users='${body.user_login}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY id_mutasi`
            );

            var [total_barangmasuk] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND (mutasi='ADD_PRODUK' OR mutasi='RESTOCK') AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_refund] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='REFUND' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_cancel] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='CANCEL_ORDER' OR mutasi='DELETE_ORDER' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_in_retur] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='RETUR_IN' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_retur] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='RETUR_OUT' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_sales_online] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='SALES ONLINE' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_sales_toko] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='SALES RETAIL' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [get_stok_all] = await connection.query(
                `SELECT SUM(qty) as qty FROM tb_variation WHERE id_area='${body.user_store}'`
            );

            var [total_in_defect] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='DEFECT IN' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );

            var [total_out_defect] = await connection.query(
                `SELECT *,SUM(qty) as qty FROM tb_mutasistock WHERE users='${body.user_login}' AND source='Barang Gudang' AND mutasi='DEFECT OUT' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
        }

        datas.push({
            data_expense: query,
            total_transaksi: query_transaksi.length,
            stock_awal: getstockawal ? getstockawal : 0,
            total_barangmasuk: total_barangmasuk[0].qty,
            total_in_retur: total_in_retur[0].qty,
            total_in_refund: total_in_refund[0].qty,
            total_out_sales_online: total_out_sales_online[0].qty,
            total_out_sales_toko: total_out_sales_toko[0].qty,
            total_out_retur: total_out_retur[0].qty,
            total_in_cancel: total_in_cancel[0].qty,
            live_stok: get_stok_all[0].qty,
            total_in_defect: total_in_defect[0].qty,
            total_out_defect: total_out_defect[0].qty,
            totalStokAkhir: totalStokAkhir ? totalStokAkhir : 0,
        });

        await connection.commit();
        await connection.release();

        return datas;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const get_Asset = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    const id_ware = body.id_ware;
    const query = body.query;
    const brand = body.brand;
    const datas = [];
    // console.log("body", body);

    // === Kondisi Filter Brand ===
    let brandConditionProduk = "";     // Untuk tb_produk
    let brandConditionWarehouse = "";   // Untuk tb_warehouse
    let brandConditionPO = "";          // Untuk tb_purchaseorder
    let brandConditionVariation = "";   // Untuk tb_variation
    let brandConditionOrder = "";       // Untuk tb_order

    if (brand !== "all") {
        if (id_ware === "all") {
            brandConditionProduk =
                " AND tb_produk.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')";
        } else {
            brandConditionProduk =
                " AND (SELECT tb_warehouse.id_area FROM tb_warehouse WHERE tb_warehouse.id_ware = tb_produk.id_ware) = '" + brand + "'";
        }
        brandConditionWarehouse = " WHERE tb_warehouse.id_area = '" + brand + "'";
        brandConditionPO =
            " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')";
        brandConditionVariation =
            " AND tb_variation.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')";
        brandConditionOrder =
            " AND tb_order.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')";
    }
    // === End Kondisi Filter Brand ===

    try {
        await connection.beginTransaction();
        const datas2 = [];

        // --- COUNT PRODUK ---
        let countProdukQuery = "";
        if (id_ware === "all") {
            countProdukQuery = `SELECT * FROM tb_produk WHERE 1 ${brand !== "all" ? brandConditionProduk : ""} GROUP BY tb_produk.id_produk`;
        } else {
            countProdukQuery = `SELECT * FROM tb_produk WHERE tb_produk.id_ware='${id_ware}' ${brand !== "all" ? brandConditionProduk : ""} GROUP BY tb_produk.id_produk`;
        }
        const [countproduk] = await connection.query(countProdukQuery);

        let limitss =
            body.loadmorelimit === 1
                ? 20
                : body.loadmorelimit === 0
                    ? 0
                    : body.loadmorelimit * 20;
        const total_pages = countproduk.length / 20;

        // --- GET DATA WAREHOUSE ---
        const [get_wares] = await connection.query(
            `SELECT * FROM tb_warehouse ${brand !== "all" ? brandConditionWarehouse : ""} GROUP BY tb_warehouse.id_ware`
        );

        // === CASE 1: query === "all" ===
        if (query === "all") {
            // CASE 1a: id_ware === "all"
            if (id_ware === "all") {
                const baseProdukQuery = `SELECT tb_produk.*, SUM(tb_variation.qty) as sortbyqty 
                  FROM tb_produk 
                  LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk 
                    AND tb_produk.id_ware = tb_variation.id_ware
                  ${brand !== "all" ? "WHERE 1 " + brandConditionProduk : ""} 
                  GROUP BY tb_produk.id_produk`;
                let orderClause = "";
                if (body.urutan === "all") orderClause = " ORDER BY tb_produk.id_produk DESC";
                else if (body.urutan === "desc") orderClause = " ORDER BY SUM(tb_variation.qty) DESC";
                else orderClause = " ORDER BY SUM(tb_variation.qty) ASC";
                const limitClause = (countproduk.length < 20)
                    ? " LIMIT 20"
                    : ` LIMIT 20 OFFSET ${limitss}`;
                const [get_produk] = await connection.query(baseProdukQuery + orderClause + limitClause);

                // Agregat query untuk semua warehouse
                const [get_po_release_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                   WHERE tipe_order='RELEASE' ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_po_restock_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                   WHERE tipe_order='RESTOCK' ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_po_tfin_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                   WHERE tipe_order='TRANSFER IN' AND qty > '0' ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_po_tfout_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                   WHERE tipe_order='TRANSFER OUT' AND qty < '0' ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_sold_all] = await connection.query(
                    `SELECT SUM(qty) as total FROM tb_order 
                   LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
                   WHERE tb_invoice.status_pesanan != 'CANCEL' ${brand !== "all" ? brandConditionOrder : ""
                    }`
                );
                const [get_stok_all] = await connection.query(
                    `SELECT SUM(tb_variation.qty) as qty FROM tb_variation ${brand !== "all" ? "WHERE 1 " + brandConditionVariation : ""}`
                );
                const [get_assets_amount] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.total_amount) as total_amount FROM tb_purchaseorder 
                   LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                     AND tb_purchaseorder.id_ware = tb_produk.id_ware 
                   WHERE (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK' OR tb_purchaseorder.tipe_order='SO_GUDANG')
                   ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_sold_amount] = await connection.query(
                    `SELECT SUM(tb_order.m_price * tb_order.qty) as totalterjual FROM tb_invoice 
                   LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan 
                   WHERE tb_invoice.status_pesanan != 'CANCEL' ${brand !== "all" ? brandConditionOrder : ""
                    }`
                );
                const [get_po_stock_opname] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                   WHERE tipe_order='SO_GUDANG' ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_amount_dasar] = await connection.query(
                    `SELECT m_price, idpo, id_produk FROM tb_purchaseorder` +
                    (brand !== "all"
                        ? " WHERE tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    ) +
                    " ORDER BY tb_purchaseorder.id DESC"
                );
                let hitungtotalss_dasar = 0;
                for (let i = 0; i < get_amount_dasar.length; i++) {
                    const [realstok] = await connection.query(
                        `SELECT SUM(qty) as totalqty FROM tb_variation 
                     WHERE tb_variation.id_produk='${get_amount_dasar[i].id_produk}' 
                     AND tb_variation.idpo='${get_amount_dasar[i].idpo}'
                     GROUP BY tb_variation.id_produk`
                    );
                    hitungtotalss_dasar += parseInt(get_amount_dasar[i].m_price) *
                        parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                }

                // Looping tiap produk (CASE 1a)
                for (let i = 0; i < get_produk.length; i++) {
                    // Perhitungan stok hanya berdasarkan id_produk
                    const [stokRes] = await connection.query(
                        `SELECT SUM(qty) as totalqty FROM tb_variation 
                     WHERE tb_variation.id_produk='${get_produk[i].id_produk}'
                     GROUP BY tb_variation.id_produk`
                    );
                    let stokrealtime = (stokRes.length > 0 && stokRes[0].totalqty) ? stokRes[0].totalqty : 0;

                    // Perhitungan assets
                    let hitungtotalss = 0;
                    const [amountRes] = await connection.query(
                        `SELECT m_price, idpo FROM tb_purchaseorder 
                     WHERE tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""
                        } ORDER BY tb_purchaseorder.id DESC`
                    );
                    for (let j = 0; j < amountRes.length; j++) {
                        const [realstok] = await connection.query(
                            `SELECT SUM(qty) as totalqty FROM tb_variation 
                       WHERE tb_variation.id_produk='${get_produk[i].id_produk}' 
                       AND tb_variation.idpo='${amountRes[j].idpo}'
                       GROUP BY tb_variation.id_produk`
                        );
                        hitungtotalss +=
                            parseInt(amountRes[j].m_price) *
                            parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                    }

                    const [poRel] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='RELEASE' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poRes] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='RESTOCK' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poTfin] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='TRANSFER IN' AND qty > '0' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poTfout] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='TRANSFER OUT' AND qty < '0' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [soldRes] = await connection.query(
                        `SELECT SUM(qty) as total FROM tb_order 
                     LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
                     WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_order.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionOrder : ""}`
                    );
                    datas2.push({
                        produk: get_produk[i].produk,
                        warehouse: get_produk[i].warehouse,
                        id_ware: "ALL",
                        id_produk: get_produk[i].id_produk,
                        release: poRel[0].qty,
                        restock: poRes[0].qty,
                        transfer_in: poTfin[0].qty,
                        transfer_out: poTfout[0].qty,
                        sold: soldRes[0].total,
                        stock: stokrealtime,
                        assets: hitungtotalss
                    });
                }
                datas.push({
                    data_asset: datas2,
                    release: get_po_release_all[0].qty,
                    restock: get_po_restock_all[0].qty,
                    tf_in: get_po_tfin_all[0].qty || 0,
                    tf_out: get_po_tfout_all[0].qty || 0,
                    qty_assets: get_stok_all[0].qty,
                    getsoldall: get_sold_all[0].total,
                    nominal_assets: get_assets_amount[0].total_amount,
                    asset_bersih: hitungtotalss_dasar,
                    total: get_produk.length,
                    totalterjual: get_sold_amount[0].totalterjual,
                    stock_opname: parseInt(get_po_stock_opname[0].qty || 0)
                });
            } else {
                // CASE 1b: query === "all" & id_ware != "all"
                const baseProdukQuery = `SELECT tb_produk.*, SUM(tb_variation.qty) as sortbyqty 
            FROM tb_produk 
            LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk 
              AND tb_produk.id_ware = tb_variation.id_ware
            WHERE tb_produk.id_ware='${id_ware}' ${brand !== "all" ? brandConditionProduk : ""} 
            GROUP BY tb_produk.id_produk`;
                let orderClause = "";
                if (body.urutan === "all") orderClause = " ORDER BY tb_produk.id_produk DESC";
                else if (body.urutan === "desc") orderClause = " ORDER BY SUM(tb_variation.qty) DESC";
                else orderClause = " ORDER BY SUM(tb_variation.qty) ASC";
                const limitClause = (countproduk.length < 20) ? " LIMIT 20" : ` LIMIT 20 OFFSET ${limitss}`;
                const [get_produk] = await connection.query(baseProdukQuery + orderClause + limitClause);

                // Agregat untuk id_ware spesifik
                const [get_po_release_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='RELEASE' AND tb_purchaseorder.id_ware='${id_ware}'`
                );
                const [get_po_restock_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='RESTOCK' AND tb_purchaseorder.id_ware='${id_ware}'`
                );
                const [get_po_tfin_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='TRANSFER IN' AND qty > '0' AND tb_purchaseorder.id_ware='${id_ware}'`
                );
                const [get_po_tfout_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='TRANSFER OUT' AND qty < '0' AND tb_purchaseorder.id_ware='${id_ware}'`
                );
                const [get_sold_all] = await connection.query(
                    `SELECT SUM(qty) as total FROM tb_order 
             LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
             WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_order.id_ware='${id_ware}'`
                );
                const [get_stok_all] = await connection.query(
                    `SELECT SUM(tb_variation.qty) as qty FROM tb_variation 
             WHERE tb_variation.id_ware='${id_ware}'`
                );
                const [get_assets_amount] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.total_amount) as total_amount FROM tb_purchaseorder 
             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
               AND tb_purchaseorder.id_ware = tb_produk.id_ware 
             WHERE (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK' OR tb_purchaseorder.tipe_order='SO_GUDANG')
             AND tb_purchaseorder.id_ware='${id_ware}'`
                );
                const [get_sold_amount] = await connection.query(
                    `SELECT SUM(tb_order.m_price * tb_order.qty) as totalterjual FROM tb_invoice 
             LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan 
             WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_order.id_ware='${id_ware}'`
                );
                const [get_po_stock_opname] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='SO_GUDANG' AND tb_purchaseorder.id_ware='${id_ware}'`
                );
                const [get_amount_dasar] = await connection.query(
                    `SELECT m_price, idpo, id_produk FROM tb_purchaseorder 
             WHERE tb_purchaseorder.id_ware='${id_ware}' ORDER BY tb_purchaseorder.id DESC`
                );
                let hitungtotalss_dasar = 0;
                for (let i = 0; i < get_amount_dasar.length; i++) {
                    const [realstok] = await connection.query(
                        `SELECT SUM(qty) as totalqty FROM tb_variation 
               WHERE tb_variation.id_produk='${get_amount_dasar[i].id_produk}' 
               AND tb_variation.idpo='${get_amount_dasar[i].idpo}'
               AND tb_variation.id_ware='${id_ware}'
               GROUP BY tb_variation.id_produk`
                    );
                    hitungtotalss_dasar += parseInt(get_amount_dasar[i].m_price) *
                        parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                }
                // Looping tiap produk (CASE 1b)
                for (let x = 0; x < get_produk.length; x++) {
                    let stokQuery = `SELECT SUM(tb_variation.qty) as totalqty FROM tb_variation 
                               WHERE tb_variation.id_produk='${get_produk[x].id_produk}' AND tb_variation.id_ware='${id_ware}'` +
                        (brand !== "all"
                            ? " AND tb_variation.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                            : ""
                        ) +
                        " GROUP BY tb_variation.id_produk";
                    const [stokDetail] = await connection.query(stokQuery);
                    let stokrealtime = (stokDetail.length > 0 && stokDetail[0].totalqty)
                        ? stokDetail[0].totalqty
                        : 0;
                    const [poRel] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='RELEASE' AND tb_purchaseorder.id_produk='${get_produk[x].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poRes] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='RESTOCK' AND tb_purchaseorder.id_produk='${get_produk[x].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poTfin] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='TRANSFER IN' AND qty > '0' 
               AND tb_purchaseorder.id_produk='${get_produk[x].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poTfout] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='TRANSFER OUT' AND qty < '0' 
               AND tb_purchaseorder.id_produk='${get_produk[x].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [soldRes] = await connection.query(
                        `SELECT SUM(qty) as total FROM tb_order 
               LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
               WHERE tb_invoice.status_pesanan != 'CANCEL' 
               AND tb_order.id_produk='${get_produk[x].id_produk}'  
               AND tb_order.id_ware='${id_ware}' ${brand !== "all" ? brandConditionOrder : ""}`
                    );
                    let hitungtotalss = 0;
                    const [amountRes] = await connection.query(
                        `SELECT m_price, idpo FROM tb_purchaseorder 
               WHERE tb_purchaseorder.id_produk='${get_produk[x].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}' ${brand !== "all" ? brandConditionPO : ""} 
               ORDER BY tb_purchaseorder.id DESC`
                    );
                    for (let j = 0; j < amountRes.length; j++) {
                        const [realstok] = await connection.query(
                            `SELECT SUM(qty) as totalqty FROM tb_variation 
                 WHERE tb_variation.id_produk='${get_produk[x].id_produk}' 
                 AND tb_variation.idpo='${amountRes[j].idpo}'
                 GROUP BY tb_variation.id_produk`
                        );
                        hitungtotalss += parseInt(amountRes[j].m_price) *
                            parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                    }
                    datas2.push({
                        produk: get_produk[x].produk,
                        warehouse: get_produk[x].warehouse,
                        id_ware: id_ware,
                        id_produk: get_produk[x].id_produk,
                        release: poRel[0].qty,
                        restock: poRes[0].qty,
                        transfer_in: poTfin[0].qty,
                        transfer_out: poTfout[0].qty,
                        sold: soldRes[0].total,
                        stock: stokrealtime,
                        assets: hitungtotalss
                    });
                }
                datas.push({
                    data_asset: datas2,
                    release: get_po_release_all[0].qty,
                    restock: get_po_restock_all[0].qty,
                    tf_in: get_po_tfin_all[0].qty || 0,
                    tf_out: get_po_tfout_all[0].qty || 0,
                    qty_assets: get_stok_all[0].qty,
                    getsoldall: get_sold_all[0].total,
                    nominal_assets: get_assets_amount[0].total_amount,
                    asset_bersih: hitungtotalss_dasar,
                    total: get_produk.length,
                    totalterjual: get_sold_amount[0].totalterjual,
                    stock_opname: parseInt(get_po_stock_opname[0].qty || 0)
                });
            }
        } else {
            // ----- CASE 2: query != "all" -----
            if (id_ware === "all") {
                // CASE 2a: query != "all" & id_ware === "all"
                const baseProdukQuery = `SELECT tb_produk.*, SUM(tb_variation.qty) as sortbyqty 
                FROM tb_produk 
                LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk
                LEFT JOIN tb_order ON tb_produk.id_produk = tb_order.id_produk AND tb_produk.id_ware = tb_order.id_ware
                 LEFT JOIN tb_warehouse ON tb_produk.id_ware = tb_warehouse.id_ware
                AND tb_produk.id_ware = tb_variation.id_ware
                ${brand !== "all" ? "WHERE 1 " + brandConditionProduk + " AND " : "WHERE "} 
                (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                GROUP BY tb_produk.id_produk`;
                let orderClause = "";
                if (body.urutan === "all") orderClause = " ORDER BY tb_produk.id_produk DESC";
                else if (body.urutan === "desc") orderClause = " ORDER BY SUM(tb_variation.qty) DESC";
                else orderClause = " ORDER BY SUM(tb_variation.qty) ASC";
                const [get_produk] = await connection.query(baseProdukQuery + orderClause);
                for (let i = 0; i < get_produk.length; i++) {
                    const [stokRes] = await connection.query(
                        `SELECT SUM(tb_variation.qty) as totalqty FROM tb_variation 
                     WHERE tb_variation.id_produk='${get_produk[i].id_produk}'
                     GROUP BY tb_variation.id_produk`
                    );
                    let stokrealtime = (stokRes.length > 0 && stokRes[0].totalqty) ? stokRes[0].totalqty : 0;
                    const [poRel] = await connection.query(
                        `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='RELEASE' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poRes] = await connection.query(
                        `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='RESTOCK' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poTfin] = await connection.query(
                        `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='TRANSFER IN' AND qty > '0' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [poTfout] = await connection.query(
                        `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     WHERE tipe_order='TRANSFER OUT' AND qty < '0' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""}`
                    );
                    const [soldRes] = await connection.query(
                        `SELECT SUM(tb_order.qty) as total FROM tb_order 
                     LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
                     WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_order.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionOrder : ""}`
                    );
                    // Assets per produk
                    let hitungtotalss = 0;
                    const [amountRes] = await connection.query(
                        `SELECT m_price, idpo FROM tb_purchaseorder 
                     WHERE tb_purchaseorder.id_produk='${get_produk[i].id_produk}' ${brand !== "all" ? brandConditionPO : ""} 
                     ORDER BY tb_purchaseorder.id DESC`
                    );
                    for (let j = 0; j < amountRes.length; j++) {
                        const [realstok] = await connection.query(
                            `SELECT SUM(qty) as totalqty FROM tb_variation 
                       WHERE tb_variation.id_produk='${get_produk[i].id_produk}' 
                       AND tb_variation.idpo='${amountRes[j].idpo}'
                       GROUP BY tb_variation.id_produk`
                        );
                        hitungtotalss += parseInt(amountRes[j].m_price) *
                            parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                    }
                    datas2.push({
                        produk: get_produk[i].produk,
                        warehouse: get_produk[i].warehouse,
                        id_ware: "ALL",
                        id_produk: get_produk[i].id_produk,
                        release: poRel[0].qty,
                        restock: poRes[0].qty,
                        transfer_in: poTfin[0].qty,
                        transfer_out: poTfout[0].qty,
                        sold: soldRes[0].total,
                        stock: stokrealtime,
                        assets: hitungtotalss
                    });
                }
                const [get_po_release_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                    LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                    AND tb_purchaseorder.id_ware = tb_produk.id_ware
                    WHERE tb_purchaseorder.tipe_order='RELEASE'
                     AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_po_restock_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                    AND tb_purchaseorder.id_ware = tb_produk.id_ware
                    WHERE tb_purchaseorder.tipe_order='RESTOCK'
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ${brand !== "all" ? brandConditionPO : ""}`
                );

                const [get_po_tfin_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                    LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                    AND tb_purchaseorder.id_ware = tb_produk.id_ware
                    WHERE tb_purchaseorder.tipe_order='TRANSFER IN' AND tb_purchaseorder.qty > '0'
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_po_tfout_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                    AND tb_purchaseorder.id_ware = tb_produk.id_ware
                    WHERE tb_purchaseorder.tipe_order='TRANSFER OUT' AND tb_purchaseorder.qty < '0'
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_sold_all] = await connection.query(
                    `SELECT SUM(qty) as total FROM tb_order 
                   LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan
                    LEFT JOIN tb_produk ON tb_order.id_produk = tb_produk.id_produk 
                    AND tb_order.id_ware = tb_produk.id_ware
                   WHERE tb_invoice.status_pesanan != 'CANCEL'
                   AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                   ${brand !== "all" ? brandConditionOrder : ""}`
                );

                const [get_stok_all] = await connection.query(
                    `SELECT SUM(tb_variation.qty) as qty FROM tb_variation
                    LEFT JOIN tb_produk ON tb_variation.id_produk = tb_produk.id_produk AND tb_variation.id_ware = tb_produk.id_ware
                    LEFT JOIN tb_warehouse ON tb_variation.id_ware = tb_warehouse.id_ware
                    WHERE (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ${brand !== "all" ? brandConditionVariation : ""}`
                );

                const [get_assets_amount] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.total_amount) as total_amount FROM tb_purchaseorder 
                    LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
                    AND tb_purchaseorder.id_ware = tb_produk.id_ware 
                    LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
                    WHERE (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK' OR tb_purchaseorder.tipe_order='SO_GUDANG')
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ${brand !== "all" ? brandConditionPO : ""}`
                );
                const [get_sold_amount] = await connection.query(
                    `SELECT SUM(tb_order.m_price * tb_order.qty) as totalterjual FROM tb_invoice 
                   LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan 
                   WHERE tb_invoice.status_pesanan != 'CANCEL' 
                   AND (tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%')
                   ${brand !== "all" ? brandConditionOrder : ""}`
                );
                const [get_amount_dasar] = await connection.query(
                    `SELECT tb_purchaseorder.m_price, tb_purchaseorder.idpo, tb_purchaseorder.id_produk FROM tb_purchaseorder
                     LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk AND tb_purchaseorder.id_ware = tb_produk.id_ware
             WHERE (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    ) +
                    " ORDER BY tb_purchaseorder.id DESC"
                );

                let hitungtotalss_dasar = 0;
                for (let i = 0; i < get_amount_dasar.length; i++) {
                    const [realstok] = await connection.query(
                        `SELECT SUM(qty) as totalqty FROM tb_variation 
               WHERE tb_variation.id_produk='${get_amount_dasar[i].id_produk}' 
               AND tb_variation.idpo='${get_amount_dasar[i].idpo}'
               GROUP BY tb_variation.id_produk`
                    );
                    hitungtotalss_dasar += parseInt(get_amount_dasar[i].m_price) *
                        parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                }
                const [get_po_stock_opname] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='SO_GUDANG' ${brand !== "all" ? brandConditionPO : ""}`
                );
                datas.push({
                    data_asset: datas2,
                    release: get_po_release_all[0].qty,
                    restock: get_po_restock_all[0].qty,
                    tf_in: get_po_tfin_all[0].qty || 0,
                    tf_out: get_po_tfout_all[0].qty || 0,
                    qty_assets: get_stok_all[0].qty,
                    getsoldall: get_sold_all[0].total,
                    nominal_assets: get_assets_amount[0].total_amount,
                    asset_bersih: hitungtotalss_dasar, // Sesuaikan bila diperlukan
                    total: get_produk.length,
                    totalterjual: get_sold_amount[0].totalterjual,
                    stock_opname: parseInt(get_po_stock_opname[0].qty || 0)
                });
            } else {
                // CASE 2b: query != "all" & id_ware != "all"
                const baseProdukQuery = `SELECT tb_produk.*, SUM(tb_variation.qty) as sortbyqty 
            FROM tb_produk 
            LEFT JOIN tb_variation ON tb_produk.id_produk = tb_variation.id_produk 
              AND tb_produk.id_ware = tb_variation.id_ware
            WHERE tb_produk.id_ware='${id_ware}' ${brand !== "all" ? brandConditionProduk : ""} 
            AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
            GROUP BY tb_produk.id_produk`;
                let orderClause = "";
                if (body.urutan === "all") orderClause = " ORDER BY tb_produk.id_produk DESC";
                else if (body.urutan === "desc") orderClause = " ORDER BY SUM(tb_variation.qty) DESC";
                else orderClause = " ORDER BY SUM(tb_variation.qty) ASC";
                const limitClause = (countproduk.length < 20) ? " LIMIT 20" : ` LIMIT 20 OFFSET ${limitss}`;
                const [get_produk] = await connection.query(baseProdukQuery + orderClause + limitClause);

                const [get_po_release_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                    LEFT JOIN tb_produk ON tb_produk.id_produk = tb_purchaseorder.id_produk 
                    AND tb_produk.id_ware = tb_purchaseorder.id_ware
                    WHERE tb_purchaseorder.tipe_order='RELEASE' AND tb_purchaseorder.id_ware='${id_ware}'
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_po_restock_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder
                    LEFT JOIN tb_produk ON tb_produk.id_produk = tb_purchaseorder.id_produk 
                    AND tb_produk.id_ware = tb_purchaseorder.id_ware
                    WHERE tb_purchaseorder.tipe_order='RESTOCK' AND tb_purchaseorder.id_ware='${id_ware}'
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_po_tfin_all] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.qty) as qty FROM tb_purchaseorder 
                     LEFT JOIN tb_produk ON tb_produk.id_produk = tb_purchaseorder.id_produk 
                    AND tb_produk.id_ware = tb_purchaseorder.id_ware
                    WHERE tb_purchaseorder.tipe_order='TRANSFER IN' AND tb_purchaseorder.qty > '0' AND tb_purchaseorder.id_ware='${id_ware}'
                    AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
                    ` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_po_tfout_all] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='TRANSFER OUT' AND qty < '0' AND tb_purchaseorder.id_ware='${id_ware}'` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_sold_all] = await connection.query(
                    `SELECT SUM(qty) as total FROM tb_order 
             LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
             WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_order.id_ware='${id_ware}'
             AND (tb_order.produk LIKE '%${query}%' OR tb_order.id_produk LIKE '%${query}%')
             ` +
                    (brand !== "all"
                        ? " AND tb_order.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_stok_all] = await connection.query(
                    `SELECT SUM(tb_variation.qty) as qty FROM tb_variation 
                    LEFT JOIN tb_produk ON tb_variation.id_produk = tb_produk.id_produk AND tb_variation.id_ware = tb_produk.id_ware
             WHERE tb_variation.id_ware='${id_ware}' AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')` +
                    (brand !== "all"
                        ? " AND tb_variation.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_assets_amount] = await connection.query(
                    `SELECT SUM(tb_purchaseorder.total_amount) as total_amount FROM tb_purchaseorder 
             LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk 
             AND tb_purchaseorder.id_ware = tb_produk.id_ware 
             WHERE (tb_purchaseorder.tipe_order='RELEASE' OR tb_purchaseorder.tipe_order='RESTOCK' OR tb_purchaseorder.tipe_order='SO_GUDANG')
             AND tb_purchaseorder.id_ware='${id_ware}'
             AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')
             ` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    ) +
                    " GROUP BY tb_purchaseorder.id_ware"
                );
                const [get_sold_amount] = await connection.query(
                    `SELECT SUM(tb_order.m_price * tb_order.qty) as totalterjual FROM tb_invoice 
             LEFT JOIN tb_order ON tb_invoice.id_pesanan = tb_order.id_pesanan 
             WHERE tb_invoice.status_pesanan != 'CANCEL' AND tb_order.id_ware='${id_ware}'` +
                    (brand !== "all"
                        ? " AND tb_order.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_po_stock_opname] = await connection.query(
                    `SELECT SUM(qty) as qty FROM tb_purchaseorder WHERE tipe_order='SO_GUDANG' AND tb_purchaseorder.id_ware='${id_ware}'` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    )
                );
                const [get_amount_dasar] = await connection.query(
                    `SELECT tb_purchaseorder.m_price, tb_purchaseorder.idpo, tb_purchaseorder.id_produk FROM tb_purchaseorder
                     LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk AND tb_purchaseorder.id_ware = tb_produk.id_ware
             WHERE tb_purchaseorder.id_ware='${id_ware}' AND (tb_produk.produk LIKE '%${query}%' OR tb_produk.id_produk LIKE '%${query}%')` +
                    (brand !== "all"
                        ? " AND tb_purchaseorder.id_ware IN (SELECT tb_warehouse.id_ware FROM tb_warehouse WHERE tb_warehouse.id_area = '" + brand + "')"
                        : ""
                    ) +
                    " ORDER BY tb_purchaseorder.id DESC"
                );

                let hitungtotalss_dasar = 0;
                for (let i = 0; i < get_amount_dasar.length; i++) {
                    const [realstok] = await connection.query(
                        `SELECT SUM(qty) as totalqty FROM tb_variation 
               WHERE tb_variation.id_produk='${get_amount_dasar[i].id_produk}' 
               AND tb_variation.idpo='${get_amount_dasar[i].idpo}'
               GROUP BY tb_variation.id_produk`
                    );
                    hitungtotalss_dasar += parseInt(get_amount_dasar[i].m_price) *
                        parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                }
                for (let i = 0; i < get_produk.length; i++) {
                    const [stokRes] = await connection.query(
                        `SELECT SUM(qty) as totalqty FROM tb_variation 
               WHERE tb_variation.id_produk='${get_produk[i].id_produk}' AND tb_variation.id_ware='${id_ware}'
               GROUP BY tb_variation.id_produk`
                    );
                    let stokrealtime = (stokRes.length > 0 && stokRes[0].totalqty) ? stokRes[0].totalqty : 0;
                    const [poRel] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='RELEASE' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}'`
                    );
                    const [poRes] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='RESTOCK' AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}'`
                    );
                    const [poTfin] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='TRANSFER IN' AND qty > '0' 
               AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}'`
                    );
                    const [poTfout] = await connection.query(
                        `SELECT SUM(qty) as qty FROM tb_purchaseorder 
               WHERE tipe_order='TRANSFER OUT' AND qty < '0' 
               AND tb_purchaseorder.id_produk='${get_produk[i].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}'`
                    );
                    const [soldRes] = await connection.query(
                        `SELECT SUM(qty) as total FROM tb_order 
               LEFT JOIN tb_invoice ON tb_order.id_pesanan = tb_invoice.id_pesanan 
               WHERE tb_invoice.status_pesanan != 'CANCEL' 
               AND tb_order.id_produk='${get_produk[i].id_produk}'  
               AND tb_order.id_ware='${id_ware}'`
                    );
                    let hitungtotalss = 0;
                    const [amountRes] = await connection.query(
                        `SELECT m_price, idpo FROM tb_purchaseorder 
               WHERE tb_purchaseorder.id_produk='${get_produk[i].id_produk}' 
               AND tb_purchaseorder.id_ware='${id_ware}' 
               ORDER BY tb_purchaseorder.id DESC`
                    );
                    for (let j = 0; j < amountRes.length; j++) {
                        const [realstok] = await connection.query(
                            `SELECT SUM(qty) as totalqty FROM tb_variation 
                 WHERE tb_variation.id_produk='${get_produk[i].id_produk}' 
                 AND tb_variation.idpo='${amountRes[j].idpo}'
                 GROUP BY tb_variation.id_produk`
                        );
                        hitungtotalss += parseInt(amountRes[j].m_price) *
                            parseInt(realstok.length > 0 && realstok[0].totalqty ? realstok[0].totalqty : 0);
                    }
                    datas2.push({
                        produk: get_produk[i].produk,
                        warehouse: get_produk[i].warehouse,
                        id_ware: id_ware,
                        id_produk: get_produk[i].id_produk,
                        release: poRel[0].qty,
                        restock: poRes[0].qty,
                        transfer_in: poTfin[0].qty,
                        transfer_out: poTfout[0].qty,
                        sold: soldRes[0].total,
                        stock: stokrealtime,
                        assets: hitungtotalss
                    });
                }
                datas.push({
                    data_asset: datas2,
                    release: get_po_release_all[0].qty,
                    restock: get_po_restock_all[0].qty,
                    tf_in: get_po_tfin_all[0].qty || 0,
                    tf_out: get_po_tfout_all[0].qty || 0,
                    qty_assets: get_stok_all[0].qty,
                    getsoldall: get_sold_all[0].total,
                    nominal_assets: get_assets_amount[0].total_amount,
                    asset_bersih: hitungtotalss_dasar,
                    total: get_produk.length,
                    totalterjual: get_sold_amount[0].totalterjual,
                    stock_opname: parseInt(get_po_stock_opname[0].qty || 0)
                });
            }
        }

        await connection.commit();
        await connection.release();
        return {
            datas,
            total_pages: Math.round(total_pages),
            show_page: limitss
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getHistoripoasset = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    const datas = [];

    const id_ware = body.idware;
    const id_produk = body.idproduct;

    try {
        await connection.beginTransaction();

        if (id_ware === "ALL") {
            var [get_po] = await connection.query(
                `SELECT tb_purchaseorder.*,SUM(qty) as qty,tb_supplier.* FROM tb_purchaseorder LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup WHERE tb_purchaseorder.id_produk='${id_produk}' GROUP BY tb_purchaseorder.id_produk ORDER BY tb_purchaseorder.id DESC`
            );

            // var [get_size_histori] = await connection.query(
            //     `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE id_produk='${id_produk}' GROUP BY size ORDER BY size ASC`
            // );
        } else {
            var [get_po] = await connection.query(
                `SELECT tb_purchaseorder.*,SUM(qty) as qty,tb_supplier.* FROM tb_purchaseorder LEFT JOIN tb_supplier ON tb_purchaseorder.id_sup = tb_supplier.id_sup WHERE tb_purchaseorder.id_produk='${id_produk}' AND tb_purchaseorder.id_ware='${id_ware}' GROUP BY tb_purchaseorder.id_produk ORDER BY tb_purchaseorder.id DESC`
            );

            // var [get_size_histori] = await connection.query(
            //     `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE id_produk='${id_produk}' AND id_ware='${id_ware}' GROUP BY size ORDER BY size ASC`
            // );
        }

        for (let i = 0; i < get_po.length; i++) {
            if (id_ware === "ALL") {
                // var [get_size] = await connection.query(
                //     `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE id_produk='${id_produk}' GROUP BY size ORDER BY size ASC`
                // );

                var [get_size_ready] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${id_produk}' GROUP BY size ORDER BY size ASC`
                );
            } else {
                // var [get_size] = await connection.query(
                //     `SELECT *,SUM(qty) as qty FROM tb_variationorder WHERE id_produk='${id_produk}' id_ware='${id_ware}' GROUP BY size ORDER BY size ASC`
                // );

                var [get_size_ready] = await connection.query(
                    `SELECT *,SUM(qty) as qty FROM tb_variation WHERE id_produk='${id_produk}' AND id_ware='${id_ware}' GROUP BY size ORDER BY size ASC`
                );
            }

            var [get_ware] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_ware='${get_po[i].id_ware}'`
            );

            if (get_po[i].tipe_order === "TRANSFER") {
                var [get_ware] = await connection.query(
                    `SELECT * FROM tb_warehouse WHERE id_ware='${get_po[i].id_sup}'`
                );

                datas.push({
                    id: get_po[i].id,
                    idpo: get_po[i].idpo,
                    tanggal_receive: get_po[i].tanggal_receive,
                    id_sup: get_po[i].id_sup,
                    id_produk: get_po[i].id_produk,
                    id_ware: get_ware[0].warehouse,
                    qty: get_po[i].qty,
                    m_price: get_po[i].m_price,
                    total_amount: get_po[i].total_amount,
                    tipe_order: get_po[i].tipe_order,
                    id_act: get_po[i].id_act,
                    users: get_po[i].users,
                    supplier: get_ware[0].warehouse,
                    // variation: get_size,
                    variation_ready: get_size_ready,
                });
            } else {
                datas.push({
                    id: get_po[i].id,
                    idpo: get_po[i].idpo,
                    tanggal_receive: get_po[i].tanggal_receive,
                    id_sup: get_po[i].id_sup,
                    id_produk: get_po[i].id_produk,
                    id_ware: get_ware[0].warehouse,
                    qty: get_po[i].qty,
                    m_price: get_po[i].m_price,
                    total_amount: get_po[i].total_amount,
                    tipe_order: get_po[i].tipe_order,
                    id_act: get_po[i].id_act,
                    users: get_po[i].users,
                    supplier: get_po[i].supplier,
                    // variation: get_size,
                    variation_ready: get_size_ready,
                });
            }

        }


        await connection.commit();
        await connection.release();

        return {
            data_po: datas,
            // count_data_po: get_size_histori,
            total: get_po.length
        };

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const settlementStock = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        var [cek_areas] = await connection.query(
            `SELECT id_area FROM tb_warehouse GROUP BY id_area`
        );

        if (body.area === "SUPER-ADMIN") {
            for (let x = 0; x < cek_areas.length; x++) {
                var [get_variation] = await connection.query(
                    `SELECT SUM(qty) as qty,id_area FROM tb_variation WHERE id_area='${cek_areas[x].id_area}'`
                );
                for (let z = 0; z < get_variation.length; z++) {
                    await connection.query(
                        `INSERT INTO tb_settlement (tanggal, stok_akhir,id_area, created_at, updated_at)
                VALUES ('${tanggal_skrg}','${get_variation[z].qty}','${get_variation[z].id_area}','${tanggal}','${tanggal}')`
                    );
                }
                var hasil = 'SETTLE_SUKSES'
            }
        } else {
            const [getmutation] = await connection.query(
                `SELECT * FROM tb_mutasistock WHERE tanggal='${tanggal_skrg}'`
            );

            if (getmutation > 0) {
                var hasil = 'SETTLE_ADA'
            } else {
                await connection.query(
                    `INSERT INTO tb_settlement (tanggal, stok_akhir,id_area, created_at, updated_at)
            VALUES ('${tanggal_skrg}','${body.live_stok}','${body.area}','${tanggal}','${tanggal}')`
                );
                var hasil = 'SETTLE_SUKSES'
            }
        }


        await connection.commit();
        await connection.release();
        return hasil;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getRetur = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const tanggal = body.tanggal;
    const myArray = tanggal.split(" to ");

    if (tanggal.length > 10) {
        var tanggal_start = myArray[0];
        var tanggal_end = myArray[1];
    } else {
        var tanggal_start = tanggal;
        var tanggal_end = tanggal;
    }

    try {
        await connection.beginTransaction();

        let hasilpcs = 0;
        if (body.datechange === "dateinput") {
            if (body.query === "all") {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                        );
                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        LEFT JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        LEFT JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE tb_store.id_area='${body.Brand}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE tb_store.id_area='${body.area}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE tb_retur.id_store='${body.store}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_retur.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                }
            } else {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') ORDER BY tb_retur.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' ORDER BY tb_retur.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') AND tb_retur.id_store='${body.store}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_retur.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                }
            }
        } else {
            if (body.query === "all") {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                        );
                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE tb_store.id_area='${body.Brand}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                        );
                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE tb_store.id_area='${body.area}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE tb_retur.id_store='${body.store}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_retur.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                }
            } else {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') ORDER BY tb_retur.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' ORDER BY tb_retur.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' ORDER BY tb_retur.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_retur.*,tb_store.*,tb_mutasistock.tanggal as tanggal_input FROM tb_retur LEFT JOIN tb_store ON tb_retur.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_retur.id_store='${body.store}' AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%') ORDER BY tb_retur.id DESC`
                    );
                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur.qty_retur) AS qtyPcs
                        FROM tb_retur
                        JOIN tb_mutasistock
                        ON tb_retur.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur.id_produk = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur.id_store = tb_store.id_store
                        WHERE tb_retur.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur.id_pesanan LIKE '%${body.query}%' OR tb_retur.id_produk LIKE '%${body.query}%' OR tb_retur.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                }
            }
        }

        const capital_amount = getretur.reduce((sum, row) => sum + ((Number(row.m_price) || 0) * (Number(row.qty) || 0)), 0);

        await connection.commit();
        await connection.release();

        return {
            getretur,
            hasilpesanan: getretur.length || 0,
            hasilpcs: hasilpcs || 0,
            capital_amount,
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getRefund = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const tanggal = body.tanggal;
    const myArray = tanggal.split(" to ");
    if (tanggal.length > 10) {
        var tanggal_start = myArray[0];
        var tanggal_end = myArray[1];
    } else {
        var tanggal_start = tanggal;
        var tanggal_end = tanggal;
    }

    try {
        await connection.beginTransaction();

        let hasilpesanan = 0;
        let hasilpcs = 0;
        if (body.datechange === "dateinput") {
            if (body.query === "all") {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );


                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        LEFT JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        LEFT JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE tb_store.id_area='${body.Brand}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );

                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE tb_store.id_area='${body.Brand}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini


                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE tb_store.id_area='${body.area}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                    );


                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE tb_store.id_area='${body.area}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE tb_refund.id_store='${body.store}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                    );
                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE tb_refund.id_store='${body.store}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_refund.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                }
            } else {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );
                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') `
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );
                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' `
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                    );
                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' `
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_refund.id_store='${body.store}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                    );
                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_refund.id_store='${body.store}' `
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_refund.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                }
            }
        } else {
            if (body.query === "all") {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );

                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;

                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store  LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE tb_store.id_area='${body.Brand}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk,tb_refund.size ORDER BY tb_refund.id DESC`
                        );
                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE tb_store.id_area='${body.Brand}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}' `
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT 
                            tb_refund.*,
                            SUM(tb_refund.qty) AS qty,
                            tb_store.store,
                            MAX(tb_mutasistock.tanggal) AS tanggal_input
                        FROM tb_refund
                        LEFT JOIN tb_store 
                          ON tb_refund.id_store = tb_store.id_store
                        LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        WHERE tb_store.id_area='${body.area}'
                          AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'
                        GROUP BY tb_refund.id_pesanan, tb_refund.id_produk, tb_refund.size
                        ORDER BY tb_refund.id DESC`
                    );

                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk AND tb_mutasistock.qty > 0 WHERE tb_store.id_area='${body.area}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}' `
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE tb_refund.id_store='${body.store}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                    );
                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE tb_refund.id_store='${body.store}' AND (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_refund.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_refund.tanggal_refund BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                }
            } else {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );
                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') `
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getretur] = await connection.query(
                            `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                        );
                        var [totalPesanan] = await connection.query(
                            `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' `
                        );
                        hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk, tb_refund.size ORDER BY tb_refund.id DESC`
                    );
                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk AND tb_mutasistock.qty > 0 WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' `
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getretur] = await connection.query(
                        `SELECT tb_refund.*,SUM(tb_refund.qty) as qty,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock 
                          ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                         AND tb_refund.id_produk  = tb_mutasistock.id_produk
                         AND tb_refund.size       = tb_mutasistock.size
                         AND tb_mutasistock.qty   > 0
                         AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL') WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_refund.id_store='${body.store}' GROUP BY tb_refund.id_pesanan,tb_refund.id_produk ORDER BY tb_refund.id DESC`
                    );
                    var [totalPesanan] = await connection.query(
                        `SELECT COUNT(DISTINCT tb_refund.id_pesanan) as totalPesanan FROM tb_refund LEFT JOIN tb_store ON tb_refund.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan AND tb_refund.id_produk = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%') AND tb_refund.id_store='${body.store}' `
                    );
                    hasilpesanan = totalPesanan[0]?.totalPesanan || 0; // isi di sini

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_refund.qty) AS qtyPcs
                        FROM tb_refund
                        JOIN tb_mutasistock
                        ON tb_refund.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_refund.id_produk = tb_mutasistock.id_produk
                        AND tb_refund.size = tb_mutasistock.size
                        JOIN tb_store 
                        ON tb_refund.id_store = tb_store.id_store
                        WHERE tb_refund.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_refund.id_pesanan LIKE '%${body.query}%' OR tb_refund.id_produk LIKE '%${body.query}%' OR tb_refund.produk LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                }
            }
        }

        const capital_amount = getretur.reduce((sum, row) => sum + ((Number(row.m_price) || 0) * (Number(row.qty) || 0)), 0);

        await connection.commit();
        await connection.release();

        return {
            getretur,
            hasilpesanan: hasilpesanan || 0,
            hasilpcs: hasilpcs || 0,
            capital_amount,
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getNamaware = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_warehouse] = await connection.query(
            `SELECT tb_warehouse.warehouse,tb_area.kota FROM tb_warehouse LEFT JOIN tb_area ON tb_warehouse.id_area = tb_area.id_area WHERE tb_warehouse.id_area='${body.area}' GROUP BY tb_warehouse.id_area`
        );
        await connection.commit();
        await connection.release();
        return data_warehouse;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const get_upprice = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.role === "SUPER-ADMIN" && body.role === "HEAD-AREA") {
            var [getstores] = await connection.query(
                `SELECT id_area FROM tb_store WHERE id_store='${body.id_store}'`
            );
            for (let x = 0; x < getstores.length; x++) {
                var [data_upprice] = await connection.query(
                    `SELECT m_price,g_price,r_price,n_price,id_area FROM tb_area WHERE id_area='${getstores[x].id_area}'`
                );
                var m_price = data_upprice[0].m_price;
                var g_price = data_upprice[0].g_price;
                var r_price = data_upprice[0].r_price;
                var n_price = data_upprice[0].n_price;
            }
        } else {
            var [getstores] = await connection.query(
                `SELECT id_area FROM tb_store WHERE id_store='${body.area}'`
            );
            for (let x = 0; x < getstores.length; x++) {
                var [data_upprice] = await connection.query(
                    `SELECT m_price,g_price,r_price,n_price,id_area FROM tb_area WHERE id_area='${getstores[x].id_area}'`
                );
                var m_price = data_upprice[0].m_price;
                var g_price = data_upprice[0].g_price;
                var r_price = data_upprice[0].r_price;
                var n_price = data_upprice[0].n_price;
            }
        }


        await connection.commit();
        await connection.release();

        return {
            m_price,
            g_price,
            r_price,
            n_price,
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getHistoripotransfer = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_historypo] = await connection.query(
            `SELECT * FROM tb_purchaseorder WHERE tipe_order="TRANSFER" AND tipe_order != "SO_GUDANG" GROUP BY idpo ORDER BY id DESC LIMIT 1`
        );

        await connection.commit();
        await connection.release();

        return data_historypo;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getPotransfer = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    const [tanggal_start, tanggal_end] = body.date.includes(" to ")
        ? body.date.split(" to ")
        : [body.date, body.date];
    const { Filter_Tipe_po: tipepo, Filter_Supplier: supplier, Filter_Tipe_user: users, Filter_Tipe_warehouse: warehouse, query, user_role, user_store, Brand } = body;
    let created_at_list = [];
    try {
        await connection.beginTransaction();

        const baseCondition = `tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' AND tipe_order='TRANSFER IN'`;
        const queryConditions = [];

        if (warehouse !== "all") queryConditions.push(`tb_purchaseorder.id_sup='${warehouse}'`);
        if (query !== "all") queryConditions.push(`tb_purchaseorder.tanggal_receive='${query}'`);
        if (users !== "all") queryConditions.push(`tb_purchaseorder.users='${users}'`);

        // Add logic for Brand
        if (Brand !== "all") {
            queryConditions.push(`tb_warehouse.id_area='${Brand}'`);
        }

        // Role-based filtering
        if (user_role === "HEAD-AREA" || user_role === "HEAD-WAREHOUSE") {
            var area_ware = user_store.split('-')[0];
            if (area_ware == "WARE") {
                var [data_get_ware] = await connection.query(
                    `SELECT id_area FROM tb_warehouse WHERE id_ware='${body.user_store}' GROUP BY id_area`
                );
                var output_area_ware = data_get_ware[0].id_area;
            } else if (area_ware == "AREA") {
                var output_area_ware = body.user_store;
            }
            queryConditions.push(`tb_warehouse.id_area='${output_area_ware}'`);
        }

        const whereClause = queryConditions.length ? ` AND ${queryConditions.join(" AND ")}` : "";

        const [get_po] = await connection.query(
            `SELECT tb_purchaseorder.*
             FROM tb_purchaseorder
             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware
             WHERE ${baseCondition} ${whereClause}
             GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
             ORDER BY tb_purchaseorder.id DESC`
        );
        const [total_po] = await connection.query(
            `SELECT COUNT(tb_purchaseorder.idpo) as totalpo
             FROM tb_purchaseorder
             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware
             WHERE ${baseCondition} ${whereClause}
             GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users`
        );
        const [total_qty] = await connection.query(
            `SELECT SUM(tb_purchaseorder.qty) as totalqtys
             FROM tb_purchaseorder
             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware
             WHERE ${baseCondition} ${whereClause}
             GROUP BY tb_purchaseorder.tanggal_receive`
        );
        const [capital_amount] = await connection.query(
            `SELECT IFNULL(SUM(tb_purchaseorder.total_amount), 0) AS amount
             FROM tb_purchaseorder
             LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware
             WHERE ${baseCondition} ${whereClause}`
        );

        const datas = [];
        let total_qty_value = 0;
        let total_cost_value = 0;
        let totalQtyAll = 0;
        for (const po of get_po) {
            const detailQuery = `
                SELECT tb_purchaseorder.*, tb_produk.produk, gud_warehouse.warehouse as gudang, 
                       sup_warehouse.warehouse as supplier_transfer,tb_transfer_keterangan.ket
                FROM tb_purchaseorder
                LEFT JOIN tb_produk ON tb_purchaseorder.id_produk = tb_produk.id_produk
                LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware
                LEFT JOIN tb_warehouse as sup_warehouse ON tb_purchaseorder.id_sup = sup_warehouse.id_ware
                LEFT JOIN tb_warehouse as gud_warehouse ON tb_purchaseorder.id_ware = gud_warehouse.id_ware
                LEFT JOIN tb_transfer_keterangan ON tb_purchaseorder.id_act = tb_transfer_keterangan.id_act
                WHERE tb_purchaseorder.tanggal_receive='${po.tanggal_receive}'
                AND tb_purchaseorder.users='${po.users}'
                ${warehouse !== "all" ? `AND tb_purchaseorder.id_sup='${warehouse}'` : ""}
                ${Brand !== "all" ? `AND tb_warehouse.id_area='${Brand}'` : ""}
                AND tb_purchaseorder.tipe_order='TRANSFER IN'
                GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users, tb_purchaseorder.tipe_order, tb_purchaseorder.idpo
                ORDER BY tb_purchaseorder.id DESC
            `;

            const [details] = await connection.query(detailQuery);

            const [totals] = await connection.query(
                `SELECT SUM(tb_purchaseorder.total_amount) as hasil_amount, SUM(tb_purchaseorder.qty) as hasil_qty
                 FROM tb_purchaseorder
                 LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware
                 WHERE tb_purchaseorder.tanggal_receive='${po.tanggal_receive}' 
                 AND tb_purchaseorder.users='${po.users}' 
                 ${warehouse !== "all" ? `AND tb_purchaseorder.id_sup='${warehouse}'` : ""}
                 ${Brand !== "all" ? `AND tb_warehouse.id_area='${Brand}'` : ""}
                 AND tb_purchaseorder.tipe_order='TRANSFER IN'
                 GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users`
            );

            let totalQtys = 0;
            details.forEach((item) => {
                const totalQty = item.qty; // misalnya ini hasil totalQty tiap item
                totalQtys += totalQty;
                totalQtyAll += totalQty;
            });

            created_at_list.push(po.tanggal_receive);
            datas.push({
                tanggal: po.tanggal_receive,
                id_so: po.idpo,
                users: po.users,
                total_qty: totalQtys || 0,
                total_cost: totals?.hasil_amount || 0,
                detail: details,
            });

            total_qty_value += totals?.hasil_qty || 0;
            total_cost_value += totals?.hasil_amount || 0;
        }
        const created_at = [...new Set(created_at_list)].join(", ");

        await connection.commit();
        await connection.release();

        return {
            datas,
            total_po: total_po.length || 0,
            total_qty: totalQtyAll || 0,
            capital_amount: capital_amount?.[0]?.amount || 0,
            created_at, // Sekarang berupa string
        };
    } catch (error) {
        console.error(error);
        await connection.rollback();
        await connection.release();
        throw error;
    }
};

const getuserpo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.user_role === "SUPER-ADMIN") {
            var [get_user] = await connection.query(
                `SELECT users FROM tb_purchaseorder WHERE (tipe_order='RELEASE' OR tipe_order='RESTOCK') GROUP BY users ORDER BY users ASC`
            );
        } else if (body.user_role === "HEAD-AREA") {
            var [get_user] = await connection.query(
                `SELECT users FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_warehouse.id_ware = tb_purchaseorder.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND (tipe_order='RELEASE' OR tipe_order='RESTOCK') GROUP BY users ORDER BY users ASC`
            );
        } else {
            var [get_user] = await connection.query(
                `SELECT users FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_warehouse.id_ware = tb_purchaseorder.id_ware WHERE tb_warehouse.id_ware='${body.user_store}' AND (tipe_order='RELEASE' OR tipe_order='RESTOCK') GROUP BY users ORDER BY users ASC`
            );
        }

        var [get_brand] = await connection.query(
            `SELECT id_area,brand FROM tb_warehouse GROUP BY brand`
        );

        await connection.commit();
        await connection.release();

        return {
            get_user,
            get_brand
        }
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getusertransfer = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.user_role === "SUPER-ADMIN") {
            var [get_user] = await connection.query(
                `SELECT users FROM tb_purchaseorder GROUP BY users ORDER BY users ASC`
            );
        } else if (body.user_role === "HEAD-AREA") {
            var [get_user] = await connection.query(
                `SELECT users FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_warehouse.id_ware = tb_purchaseorder.id_ware WHERE tb_warehouse.id_area='${body.user_store}' GROUP BY users ORDER BY users ASC`
            );
        } else {
            var [get_user] = await connection.query(
                `SELECT users FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_warehouse.id_ware = tb_purchaseorder.id_ware WHERE tb_warehouse.id_ware='${body.user_store}' AND (tipe_order='RELEASE' OR tipe_order='RESTOCK') GROUP BY users ORDER BY users ASC`
            );
        }

        var [get_brand] = await connection.query(
            `SELECT id_area,brand FROM tb_warehouse GROUP BY brand`
        );


        await connection.commit();
        await connection.release();

        return {
            get_user,
            get_brand
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getstoredisplay = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.role === "SUPER-ADMIN") {
            var [get_store] = await connection.query(
                `SELECT * FROM tb_store ORDER BY id ASC`
            );
        } else if (body.role === "HEAD-AREA") {
            var [get_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_area='${body.store}' ORDER BY id ASC `
            );
        } else {
            var [get_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_store='${body.store}' ORDER BY id ASC`
            );
        }

        await connection.commit();
        await connection.release();

        return get_store;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const addDisplay = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.store === "all") {
            var [cek_id_store] = await connection.query(
                `SELECT * FROM tb_store ORDER BY id ASC`
            );

            var getidstore = cek_id_store[0].id_store;
        } else {
            var getidstore = body.store;
        }

        const [get_produk] = await connection.query(
            `SELECT * FROM tb_produk WHERE id_produk='${body.select_id_produk}' AND id_ware='${body.select_warehouse}'`
        );

        for (let x = 0; x < get_produk.length; x++) {
            await connection.query(
                `INSERT INTO displays (tanggal, id_produk, id_ware, id_store, brand, produk, size, qty, users, created_at, updated_at) VALUES 
                ('${tanggal_skrg}','${get_produk[x].id_produk}','${get_produk[x].id_ware}','${getidstore}','${get_produk[x].id_brand}','${get_produk[x].produk}','${body.select_size}','1','${body.user}','${tanggal}','${tanggal}')`
            );
        }

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deleteDisplay = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM displays WHERE id_produk='${body.id}' AND id_ware='${body.idware}'`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const cariwares = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    const datas = [];
    try {
        await connection.beginTransaction();

        const [cariwares] = await connection.query(
            `SELECT id_ware FROM tb_store WHERE id_store='${body.id_store}'`
        );
        for (let index = 0; index < cariwares.length; index++) {
            var [cariwares_nama] = await connection.query(
                `SELECT id_ware,warehouse,address FROM tb_warehouse WHERE id_ware='${cariwares[index].id_ware}'`
            );

            var cariwares2 = cariwares_nama[index].id_ware;
            var nama_warehouses = cariwares_nama[index].warehouse;
            var address = cariwares_nama[index].address;
        }

        datas.push({
            cariwares: cariwares2,
            nama_warehouses: nama_warehouses,
            address: address,
        });

        await connection.commit();
        await connection.release();
        return datas
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getwarehousetransfer = async (body) => {
    const connection = await dbPool.getConnection();

    const tanggal = body.date;
    const users = body.user_login;
    const myArray = tanggal.split(" to ");

    if (tanggal.length > 10) {
        var tanggal_start = myArray[0];
        var tanggal_end = myArray[1];
    } else {
        var tanggal_start = tanggal;
        var tanggal_end = tanggal;
    }
    try {
        await connection.beginTransaction();

        if (body.user_role === 'SUPER-ADMIN') {
            var [cariwares] = await connection.query(
                `SELECT tb_purchaseorder.id_sup,tb_warehouse.warehouse,tb_warehouse.brand FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware WHERE tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_purchaseorder.id_sup`
            );
        } else if (body.user_role === 'HEAD-AREA') {
            var [cariwares] = await connection.query(
                `SELECT tb_purchaseorder.id_sup,tb_warehouse.warehouse,tb_warehouse.brand FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware WHERE tb_warehouse.id_area='${body.user_store}' AND tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' GROUP BY tb_purchaseorder.id_sup`
            );
        } else {
            var [cariwares] = await connection.query(
                `SELECT tb_purchaseorder.id_sup,tb_warehouse.warehouse,tb_warehouse.brand FROM tb_purchaseorder LEFT JOIN tb_warehouse ON tb_purchaseorder.id_sup = tb_warehouse.id_ware WHERE tb_purchaseorder.users='${body.user_login}' AND tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}' AND users='${users}' GROUP BY tb_purchaseorder.id_sup`
            );
        }

        await connection.commit();
        await connection.release();

        return cariwares
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const cariwaresretur = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    const datas = [];
    try {
        await connection.beginTransaction();

        const [cariwares] = await connection.query(
            `SELECT id_ware,warehouse FROM tb_warehouse WHERE id_ware='${body.id_ware}'`
        );

        await connection.commit();
        await connection.release();
        return cariwares
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const transferStokdefect = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();
        const data = body;
        var qty_all = 0;
        for (let index = 0; index < data.variasitransfer.length; index++) {
            qty_all = qty_all + parseInt(data.variasitransfer[index].stok_baru);
        }

        var total_qty = 0;
        var total_modal = 0;

        const [id_ware] = await connection.query(
            `SELECT * FROM tb_warehouse WHERE id_ware='${data.gudang_tujuan}'`
        );

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

        const [cek_po] = await connection.query(
            `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
        );
        if (cek_po[0].idpo === null) {
            var idpo = tahun + "0001";
        } else {
            const get_last2 = cek_po[0].idpo;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var idpo = tahun + String(hasil).padStart(4, "0");
        }

        const [cek_act] = await connection.query(
            `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
        );
        if (cek_act[0].id_act === null) {
            var id_act = "0001";
        } else {
            const get_last2 = cek_act[0].id_act;
            const data_2 = get_last2.toString().slice(-4);
            const hasil = parseInt(data_2) + 1;
            var id_act = String(hasil).padStart(4, "0");
        }

        const id_area = id_ware[0].id_area
        const variasi = data.variasitransfer
        var idponext = parseInt(idpo) + parseInt(1);

        const [get_products] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${data.idproduk_lama}'`
        );

        const [get_products_new] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${data.idproduk_baru}'`
        );

        for (let index = 0; index < variasi.length; index++) {

            if (variasi[index].stok_baru != 0) {
                var qty_transfer = variasi[index].stok_baru;

                // cek stock Variasi produk lama
                var [get_var] = await connection.query(
                    `SELECT id_produk,idpo,id_ware,size,qty,id_act,users FROM tb_variation WHERE id_produk='${data.idproduk_lama}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND qty > '0' ORDER BY idpo ASC`
                );
                var [get_var_sum] = await connection.query(
                    `SELECT SUM(qty) as totalqty FROM tb_variation WHERE id_produk='${data.idproduk_lama}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND qty > '0' ORDER BY idpo ASC`
                );
                // end

                var totalqty = get_var_sum[0].totalqty ? get_var_sum[0].totalqty : 0;
                var qty_baru = parseInt(totalqty) - parseInt(qty_transfer);

                var [get_warehouse] = await connection.query(
                    `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data.gudang_pengirim}'`
                );

                var [get_warehouse_new] = await connection.query(
                    `SELECT warehouse FROM tb_warehouse WHERE id_ware='${data.gudang_tujuan}'`
                );

                for (let i = 0; i < get_var.length; i++) {
                    var get_qty = get_var[i].qty;
                    // var qty_baru_single = parseInt(get_qty) - parseInt(qty_transfer);

                    // cek harga Variasi produk lama
                    var [get_modal] = await connection.query(
                        `SELECT m_price FROM tb_purchaseorder WHERE id_produk='${data.idproduk_lama}' AND id_ware="${data.gudang_pengirim}" AND m_price != '0' ORDER BY id DESC LIMIT 1`
                    );
                    // end

                    if (i === (get_var.length - 1)) {

                        // update Variasi produk lama
                        await connection.query(
                            `UPDATE tb_variation SET qty='${qty_baru}',updated_at='${tanggal}' WHERE id_produk='${data.idproduk_lama}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND idpo='${get_var[i].idpo}'`
                        );
                        var idpolama = get_var[i].idpo;
                        // end
                    } else {
                        await connection.query(
                            `UPDATE tb_variation SET qty='0',updated_at='${tanggal}' WHERE id_produk='${data.idproduk_lama}' AND id_ware='${data.gudang_pengirim}' AND size='${variasi[index].size}' AND idpo='${get_var[i].idpo}'`
                        );
                    }

                    if (i === 0) {
                        total_qty = parseInt(total_qty) + parseInt(qty_transfer);

                        // Add Variasi
                        await connection.query(
                            `INSERT INTO tb_variation (tanggal, id_produk, idpo, id_area, id_ware, size, qty, id_act, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${data.idproduk_baru}','${idpo}','${id_area}','${data.gudang_tujuan}','${variasi[index].size}','${qty_transfer}','${id_act}','${data.users}','${tanggal}','${tanggal}')`
                        );

                        // Add Variasi Order
                        await connection.query(
                            `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${data.idproduk_baru}','${idpo}','${data.gudang_pengirim}','${id_area}','${data.gudang_tujuan}','${variasi[index].size}','${qty_transfer}','${id_act}','DEFECT IN','${data.users}','${tanggal}','${tanggal}')`
                        );

                        await connection.query(
                            `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                            VALUES ('${tanggal_skrg}','${data.idproduk_lama}','${idpo}','${data.gudang_tujuan}','${id_area}','${data.gudang_pengirim}','${variasi[index].size}','-${qty_transfer}','${id_act}','DEFECT OUT','${data.users}','${tanggal}','${tanggal}')`
                        );

                        // Update Variation Old QTY
                        await connection.query(
                            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','DEFECT PRODUCT','${data.gudang_pengirim}','-','${data.idproduk_lama}','${get_products[0].produk}','${idpo}','${variasi[index].size}','-${qty_transfer}','Barang Gudang','${get_warehouse[0].warehouse}','DEFECT OUT','${data.users}','${tanggal}','${tanggal}')`
                        );

                        await connection.query(
                            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','DEFECT PRODUCT','${data.gudang_tujuan}','-','${data.idproduk_baru}','${get_products_new[0].produk}','${idpo}','${variasi[index].size}','${qty_transfer}','Barang Gudang','${get_warehouse_new[0].warehouse}','DEFECT IN','${data.users}','${tanggal}','${tanggal}')`
                        );
                    }
                    total_modal = parseInt(total_modal) + (parseInt(get_modal[0].m_price) * parseInt(qty_transfer));
                }
            }
        }

        // var hasil_m_price = parseInt(total_modal) / parseInt(total_qty);
        var hasil_total_amount = parseInt(total_qty) * (parseInt(total_modal) / parseInt(total_qty));
        // Add PO Transfer Gudang Pengiriim
        await connection.query(
            `INSERT INTO tb_purchaseorder
            (idpo, tanggal_receive, id_sup, id_produk, id_ware, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
            VALUES ('${idpo}','${tanggal_skrg}','${data.gudang_pengirim}','${data.idproduk_baru}','${data.gudang_tujuan}','${total_qty}','${get_modal[0].m_price}','${hasil_total_amount}','DEFECT IN','${id_act}','${data.users}','${tanggal}','${tanggal}')`
        );

        await connection.query(
            `INSERT INTO tb_defect
            (tanggal_receive, id_act, idpo_old, id_produk_old, id_ware_old, idpo_new, id_produk_new, id_ware_new, qty, m_price, total_amount, users, created_at, updated_at)
            VALUES ('${tanggal_skrg}','${id_act}','${idpolama}','${data.idproduk_lama}','${data.gudang_pengirim}','${idpo}','${data.idproduk_baru}','${data.gudang_tujuan}','${total_qty}','${get_modal[0].m_price}','${hasil_total_amount}','${data.users}','${tanggal}','${tanggal}')`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.error("Error in transferStokdefect:", error);
        await connection.rollback(); // Jangan lupa rollback saat error
        await connection.release();
    }
};

const getusersales = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.user_role === "SUPER-ADMIN" || body.user_role === "HEAD-AREA") {
            var [get_user] = await connection.query(
                `SELECT name as users FROM tb_karyawan GROUP BY name ORDER BY name ASC`
            );
        } else {
            var [get_user] = await connection.query(
                `SELECT name as users FROM tb_karyawan WHERE name='${body.user_login}' GROUP BY name ORDER BY name ASC`
            );
        }

        await connection.commit();
        await connection.release();

        return get_user;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

// const getpodefect = async (body) => {
//     const connection = await dbPool.getConnection();
//     console.log(body);

//     // Ambil tanggal
//     const tanggal = body.date; // Contoh: "2025-01-03 to 2025-01-03"
//     const myArray = tanggal.split(" to ");
//     let tanggal_start = tanggal;
//     let tanggal_end = tanggal;
//     if (tanggal.length > 10) {
//         tanggal_start = myArray[0];
//         tanggal_end = myArray[1];
//     }

//     // Variabel filter
//     const queryDate = body.query;                 // 'all' atau tanggal tertentu
//     const tipepo = body.Filter_Tipe_po;           // 'all'
//     const supplier = body.Filter_Supplier;        // 'all'
//     const users = body.Filter_Tipe_user;          // 'all'
//     const warehouse = body.Filter_Tipe_warehouse; // 'all'

//     // Variabel role
//     const userRole = body.user_role;   // HEAD-AREA, HEAD-WAREHOUSE, dsb
//     const userStore = body.user_store; // 'AREA-185' dsb

//     // Penampung hasil
//     let getDefectGroup = [];
//     let total_po = [];
//     let total_qty_arr = [];
//     let capital_amount_arr = [];

//     // Nilai default
//     let hasil_amount = "0";
//     let sum_totalqty_po = 0; // total qty dari purchaseorder (tipe_order='DEFECT IN')

//     try {
//         await connection.beginTransaction();

//         /**
//          * -----------------------------------------------------
//          * 1) Siapkan LEFT JOIN tb_warehouse (filter HEAD-AREA, HEAD-WAREHOUSE)
//          * -----------------------------------------------------
//          */
//         // saya LEFT JOIN tb_defect dengan tb_warehouse 
//         // agar bisa filter sesuai userRole (HEAD-AREA => id_area, HEAD-WAREHOUSE => id_ware).
//         let joinWarehouse = `
//         LEFT JOIN tb_warehouse ON tb_defect.id_ware_new = tb_warehouse.id_ware
//       `;
//         let roleCondition = "";
//         if (userRole === "HEAD-AREA") {
//             roleCondition = ` AND tb_warehouse.id_area='${userStore}' `;
//         } else if (userRole === "HEAD-WAREHOUSE") {
//             roleCondition = ` AND tb_warehouse.id_ware='${userStore}' `;
//         }

//         /**
//          * -----------------------------------------------------
//          * 2) Rangkai kondisi WHERE untuk tb_defect
//          * -----------------------------------------------------
//          */
//         let dateRangeCondition = `tb_defect.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'`;
//         let specificDateCondition = "";
//         if (queryDate !== "all") {
//             specificDateCondition = ` AND tb_defect.tanggal_receive='${queryDate}' `;
//         }
//         let userCondition = "";
//         if (users !== "all") {
//             userCondition = ` AND tb_defect.users='${users}'`;
//         }
//         let warehouseCondition = "";
//         if (warehouse !== "all") {
//             warehouseCondition = ` AND tb_defect.id_ware_new='${warehouse}' `;
//         }

//         /**
//          * -----------------------------------------------------
//          * 3) Query utama: ambil grouping dari tb_defect
//          *    (Hanya data yang benar-benar ada defect-nya)
//          * -----------------------------------------------------
//          */
//         let sqlGetDefectGroup = `
//         SELECT 
//           tb_defect.tanggal_receive,
//           tb_defect.users
//         FROM tb_defect
//         ${joinWarehouse}
//         WHERE
//           ${dateRangeCondition}
//           ${specificDateCondition}
//           ${userCondition}
//           ${warehouseCondition}
//           ${roleCondition}
//         GROUP BY tb_defect.tanggal_receive, tb_defect.users
//         ORDER BY tb_defect.id DESC
//       `;
//         const [resDefectGroup] = await connection.query(sqlGetDefectGroup);
//         getDefectGroup = resDefectGroup;

//         /**
//          * -----------------------------------------------------
//          * 4) Dapatkan total_po, total_qty, capital_amount 
//          *    dari tb_purchaseorder (tipe_order='DEFECT IN' / 'DEFECT OUT')
//          * -----------------------------------------------------
//          */
//         // Perlu join dengan tb_warehouse juga agar filter HEAD-AREA / HEAD-WAREHOUSE berjalan
//         // (bisa saja sama persis approach di atas)
//         let joinWarehousePO = `
//         LEFT JOIN tb_warehouse ON tb_purchaseorder.id_ware = tb_warehouse.id_ware
//       `;
//         let roleConditionPO = "";
//         if (userRole === "HEAD-AREA") {
//             roleConditionPO = ` AND tb_warehouse.id_area='${userStore}' `;
//         } else if (userRole === "HEAD-WAREHOUSE") {
//             roleConditionPO = ` AND tb_warehouse.id_ware='${userStore}' `;
//         }

//         let dateRangeConditionPO = `tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'`;
//         let specificDateConditionPO = "";
//         if (queryDate !== "all") {
//             specificDateConditionPO = ` AND tb_purchaseorder.tanggal_receive='${queryDate}' `;
//         }
//         let userConditionPO = "";
//         if (users !== "all") {
//             userConditionPO = ` AND tb_purchaseorder.users='${users}' `;
//         }

//         let warehouseConditionPO = "";
//         if (warehouse !== "all") {
//             warehouseConditionPO = ` AND tb_purchaseorder.id_ware='${warehouse}' `;
//         }

//         // total_po => COUNT idpo (tipe_order='DEFECT IN')
//         let sqlTotalPo = `
//         SELECT COUNT(tb_purchaseorder.idpo) AS totalpo
//         FROM tb_purchaseorder
//         ${joinWarehousePO}
//         WHERE
//           tb_purchaseorder.tipe_order='DEFECT IN'
//           AND ${dateRangeConditionPO}
//           ${specificDateConditionPO}
//           ${userConditionPO}
//           ${warehouseConditionPO}
//           ${roleConditionPO}
//         GROUP BY tb_purchaseorder.tanggal_receive, tb_purchaseorder.users
//       `;

//         // total_qty => SUM(qty) (tipe_order='DEFECT IN')
//         let sqlTotalQty = `
//         SELECT SUM(tb_purchaseorder.qty) as totalqtys
//         FROM tb_purchaseorder
//         ${joinWarehousePO}
//         WHERE
//           tb_purchaseorder.tipe_order='DEFECT IN'
//           AND ${dateRangeConditionPO}
//           ${specificDateConditionPO}
//           ${userConditionPO}
//           ${warehouseConditionPO}
//           ${roleConditionPO}
//         GROUP BY tb_purchaseorder.tanggal_receive
//       `;

//         // capital_amount => sum(total_amount) (tipe_order='DEFECT IN' or 'DEFECT OUT') AND qty>0
//         let sqlCapital = `
//         SELECT IFNULL(SUM(tb_purchaseorder.total_amount),0) AS amount
//         FROM tb_purchaseorder
//         ${joinWarehousePO}
//         WHERE
//           (${dateRangeConditionPO})
//           ${specificDateConditionPO}
//           ${userConditionPO}
//           ${warehouseConditionPO}
//           ${roleConditionPO}
//           AND (tb_purchaseorder.tipe_order='DEFECT IN' OR tb_purchaseorder.tipe_order='DEFECT OUT')
//           AND tb_purchaseorder.qty>'0'
//       `;

//         const [resTotalPo] = await connection.query(sqlTotalPo);
//         const [resTotalQty] = await connection.query(sqlTotalQty);
//         const [resCapital] = await connection.query(sqlCapital);

//         total_po = resTotalPo || [];
//         total_qty_arr = resTotalQty || [];
//         capital_amount_arr = resCapital || [];

//         // capital_amount
//         if (capital_amount_arr.length > 0) {
//             if (!capital_amount_arr[0].amount) {
//                 hasil_amount = "0";
//             } else {
//                 hasil_amount = capital_amount_arr[0].amount;
//             }
//         }

//         // total_qty purchaseorder
//         let sumQty = 0;
//         total_qty_arr.forEach((row) => {
//             if (row.totalqtys) sumQty += parseInt(row.totalqtys, 10);
//         });
//         sum_totalqty_po = sumQty;

//         /**
//          * -----------------------------------------------------
//          * 5) Loop data getDefectGroup lalu detail dari tb_defect
//          * -----------------------------------------------------
//          */
//         const datas = [];
//         let sum_total_qty_defect = 0;

//         for (let i = 0; i < getDefectGroup.length; i++) {
//             const grp = getDefectGroup[i];
//             // grp => { tanggal_receive, users }

//             // Query detail tb_defect
//             let sqlDefectDetail = `
//           SELECT 
//             tb_defect.*,
//             tb_produk.produk AS produk_old_name
//           FROM tb_defect
//           LEFT JOIN tb_produk ON tb_defect.id_produk_old = tb_produk.id_produk
//           WHERE
//             tb_defect.tanggal_receive='${grp.tanggal_receive}'
//             AND tb_defect.users='${grp.users}'
//             AND tb_defect.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
//         `;
//             // Filter warehouse
//             if (warehouse !== "all") {
//                 sqlDefectDetail += ` AND tb_defect.id_ware_new='${warehouse}' `;
//             }
//             // Filter area/warehouse (roleCondition)
//             if (roleCondition) {
//                 // saya join tb_warehouse lagi 
//                 // tapi lebih simpel query 2x, atau gunakan subquery
//                 // Agar singkat, saya abaikan join tambahan di detail,
//                 // karena data warehouse 'lama' biasanya di id_ware_old
//                 // Silakan disesuaikan. 
//             }

//             sqlDefectDetail += `
//           GROUP BY id_produk ORDER BY tb_defect.id DESC
//         `;
//             const [resDefectDetail] = await connection.query(sqlDefectDetail);
//             if (!resDefectDetail.length) {
//                 // Kalau detail benar-benar kosong, skip
//                 continue;
//             }

//             // Summation qty & cost (untuk group ini)
//             let total_qty_inThisLoop = 0;
//             let total_cost_inThisLoop = 0;

//             // saya bisa ambil sum langsung dari tb_defect
//             let sqlSumDefect = `
//           SELECT 
//             SUM(total_amount) AS hasil_amount,
//             SUM(qty) AS hasil_qty
//           FROM tb_defect
//           WHERE
//             tanggal_receive='${grp.tanggal_receive}'
//             AND users='${grp.users}'
//         `;
//             if (warehouse !== "all") {
//                 sqlSumDefect += ` AND id_ware='${warehouse}' `;
//             }

//             const [sumDefectRow] = await connection.query(sqlSumDefect);
//             if (sumDefectRow.length > 0) {
//                 total_qty_inThisLoop = parseInt(sumDefectRow[0].hasil_qty || 0, 10);
//                 total_cost_inThisLoop = parseInt(sumDefectRow[0].hasil_amount || 0, 10);
//             }

//             sum_total_qty_defect += total_qty_inThisLoop;

//             // Membangun detail
//             const datas2 = [];
//             for (let d = 0; d < resDefectDetail.length; d++) {
//                 const rowD = resDefectDetail[d];

//                 // Dapatkan nama produk_new
//                 let produkNew = "";
//                 if (rowD.id_produk_new) {
//                     const [checkProdukNew] = await connection.query(`
//               SELECT produk FROM tb_produk WHERE id_produk='${rowD.id_produk_new}'
//             `);
//                     if (checkProdukNew.length) {
//                         produkNew = checkProdukNew[0].produk;
//                     }
//                 }

//                 // Dapatkan gudang lama (id_ware_old)
//                 let getsware = "";
//                 const [resWare] = await connection.query(`
//             SELECT warehouse
//             FROM tb_warehouse
//             WHERE id_ware='${rowD.id_ware_old}'
//           `);

//                 if (resWare.length > 0) {
//                     getsware = resWare[0].warehouse;
//                 }


//                 // Dapatkan supplier_transfer
//                 let supplier_transfer = "";
//                 const [resSupplierTransfer] = await connection.query(`
//             SELECT tb_warehouse.warehouse
//             FROM tb_warehouse
//             LEFT JOIN tb_defect ON tb_warehouse.id_ware = tb_defect.id_ware_new
//             WHERE tb_defect.id_ware_new='${rowD.id_ware_old}'
//           `);
//                 if (resSupplierTransfer.length) {
//                     supplier_transfer = resSupplierTransfer[0].warehouse;
//                 }

//                 datas2.push({
//                     id: rowD.id,
//                     idpo: rowD.idpo_old,
//                     idpo_new: rowD.idpo_new,
//                     tanggal_receive: rowD.tanggal_receive,
//                     id_sup: rowD.id_ware_old,
//                     id_produk: rowD.id_produk_old,
//                     id_produk_new: rowD.id_produk_new,
//                     id_ware: rowD.id_ware_old,
//                     id_ware_new: rowD.id_ware_new,
//                     qty: rowD.qty,
//                     m_price: rowD.m_price,
//                     total_amount: rowD.total_amount,
//                     id_act: rowD.id_act,
//                     produk_old: rowD.produk_old_name,
//                     produk_new: produkNew,
//                     gudang: getsware,
//                     supplier: supplier_transfer,
//                 });
//             }


//             // Untuk menampilkan ID PO di FE, Anda mungkin perlu join tb_defect dengan tb_purchaseorder
//             // atau cari "idpo" di rowD.idpo_old dsb. 
//             // Di sini, saya asumsikan "idpo_old" mewakili ID PO aslinya.  

//             // Bangun object
//             datas.push({
//                 tanggal: grp.tanggal_receive,
//                 // Mungkin id_so ambil dari defect (misal rowD.idpo_old) -> pertama di resDefectDetail
//                 // Jika butuh, bisa ambil:
//                 id_so: resDefectDetail[0]?.idpo_old || "",
//                 users: grp.users,
//                 total_qty: total_qty_inThisLoop,
//                 total_cost: total_cost_inThisLoop,
//                 detail: datas2,
//             });
//         }

//         // created_at => boleh ambil dari row terakhir di getDefectGroup
//         let created_at = "";
//         if (getDefectGroup.length > 0) {
//             // Tergantung definisi "created_at" yang Anda inginkan
//             // misal dari rowDefect terakhir
//             created_at = getDefectGroup[getDefectGroup.length - 1].tanggal_receive;
//         }

//         // total_po => jumlah baris group di resTotalPo
//         const total_po_count = total_po.length;

//         await connection.commit();
//         await connection.release();

//         // Return ke FE
//         return {
//             datas,
//             total_po: total_po_count || 0,
//             total_qty: sum_total_qty_defect || 0,          // total qty (tb_defect)
//             total_qty_purchaseorder: sum_totalqty_po || 0, // total qty (tipe_order='DEFECT IN', tb_purchaseorder)
//             capital_amount: hasil_amount || 0,
//             created_at: created_at,
//         };
//     } catch (error) {
//         console.error(error);
//         await connection.release();
//         throw error;
//     }
// };

const getpodefect = async (body) => {
    const connection = await dbPool.getConnection();
    // Ambil tanggal
    const tanggal = body.date;
    const [tanggal_start, tanggal_end] = tanggal.includes(" to ") ? tanggal.split(" to ") : [tanggal, tanggal];

    // Variabel filter
    const queryDate = body.query;
    const users = body.Filter_Tipe_user;
    const brand = body.Brand;

    // Variabel role
    const userRole = body.user_role;
    const userStore = body.user_store;

    // Penampung hasil
    let getDefectGroup = [];
    let total_po = [];
    let total_qty_arr = [];
    let capital_amount_arr = [];
    let created_at_list = [];

    let hasil_amount = "0";
    let sum_totalqty_po = 0;

    try {
        await connection.beginTransaction();

        // LEFT JOIN untuk tb_warehouse
        const joinWarehouse = `LEFT JOIN tb_warehouse AS warehouse_new ON tb_defect.id_ware_new = warehouse_new.id_ware`;
        const roleCondition = userRole === "HEAD-AREA"
            ? `AND warehouse_new.id_area='${userStore}'`
            : userRole === "HEAD-WAREHOUSE"
                ? `AND warehouse_new.id_ware='${userStore}'`
                : "";

        // Kondisi WHERE
        const dateRangeCondition = `tb_defect.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'`;
        const specificDateCondition = queryDate !== "all" ? `AND tb_defect.tanggal_receive='${queryDate}'` : "";
        const userCondition = users !== "all" ? `AND tb_defect.users='${users}'` : "";
        const brandCondition = brand === "all"
            ? ""
            : `AND warehouse_new.id_area='${brand}'`; // Menggunakan alias warehouse_new untuk id_area

        // Query utama
        const sqlGetDefectGroup = `
        SELECT 
          tb_defect.tanggal_receive,
          tb_defect.users
        FROM tb_defect
        ${joinWarehouse}
        WHERE
          ${dateRangeCondition}
          ${specificDateCondition}
          ${userCondition}
          ${roleCondition}
          ${brandCondition}
        GROUP BY tb_defect.tanggal_receive, tb_defect.users
        ORDER BY tb_defect.id DESC
      `;
        const [resDefectGroup] = await connection.query(sqlGetDefectGroup);
        getDefectGroup = resDefectGroup;

        // Query untuk total_po, total_qty, dan capital_amount
        const joinWarehousePO = `LEFT JOIN tb_warehouse AS warehouse_po ON tb_purchaseorder.id_ware = warehouse_po.id_ware`;
        const roleConditionPO = userRole === "HEAD-AREA"
            ? `AND warehouse_po.id_area='${userStore}'`
            : userRole === "HEAD-WAREHOUSE"
                ? `AND warehouse_po.id_ware='${userStore}'`
                : "";

        const dateRangeConditionPO = `tb_purchaseorder.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'`;
        const specificDateConditionPO = queryDate !== "all" ? `AND tb_purchaseorder.tanggal_receive='${queryDate}'` : "";
        const userConditionPO = users !== "all" ? `AND tb_purchaseorder.users='${users}'` : "";
        const brandConditionPO = brand === "all"
            ? ""
            : `AND warehouse_po.id_area='${brand}'`; // Menggunakan alias warehouse_po untuk id_area

        const sqlTotalPo = `
        SELECT COUNT(tb_purchaseorder.idpo) AS totalpo
        FROM tb_purchaseorder
        ${joinWarehousePO}
        WHERE
          tb_purchaseorder.tipe_order='DEFECT IN'
          AND ${dateRangeConditionPO}
          ${specificDateConditionPO}
          ${userConditionPO}
          ${roleConditionPO}
          ${brandConditionPO}
      `;
        const sqlTotalQty = `
        SELECT SUM(tb_purchaseorder.qty) as totalqtys
        FROM tb_purchaseorder
        ${joinWarehousePO}
        WHERE
          tb_purchaseorder.tipe_order='DEFECT IN'
          AND ${dateRangeConditionPO}
          ${specificDateConditionPO}
          ${userConditionPO}
          ${roleConditionPO}
          ${brandConditionPO}
      `;
        const sqlCapital = `
        SELECT IFNULL(SUM(tb_purchaseorder.total_amount),0) AS amount
        FROM tb_purchaseorder
        ${joinWarehousePO}
        WHERE
          (${dateRangeConditionPO})
          ${specificDateConditionPO}
          ${userConditionPO}
          ${roleConditionPO}
          ${brandConditionPO}
          AND (tb_purchaseorder.tipe_order='DEFECT IN' OR tb_purchaseorder.tipe_order='DEFECT OUT')
          AND tb_purchaseorder.qty>'0'
      `;

        const [resTotalPo] = await connection.query(sqlTotalPo);
        const [resTotalQty] = await connection.query(sqlTotalQty);
        const [resCapital] = await connection.query(sqlCapital);

        total_po = resTotalPo || [];
        total_qty_arr = resTotalQty || [];
        capital_amount_arr = resCapital || [];

        hasil_amount = capital_amount_arr.length > 0 && capital_amount_arr[0].amount ? capital_amount_arr[0].amount : "0";
        sum_totalqty_po = total_qty_arr.reduce((sum, row) => sum + (parseInt(row.totalqtys, 10) || 0), 0);

        // Loop data getDefectGroup untuk detail
        const datas = [];
        let sum_total_qty_defect = 0;

        for (const grp of getDefectGroup) {
            created_at_list.push(grp.tanggal_receive);
            const sqlDefectDetail = `
            SELECT
              tb_defect.*,
              tb_produk.produk AS produk_old_name,
              tb_produk_new.produk AS produk_new_name,
              warehouse_old.warehouse AS gudang_awal,
              warehouse_new.warehouse AS gudang_tujuan,
              COALESCE(NULLIF(tb_defect.harga, 0), MAX(po_old.m_price), 0) AS harga_final
            FROM tb_defect
            LEFT JOIN tb_produk ON tb_defect.id_produk_old = tb_produk.id_produk
            LEFT JOIN tb_produk AS tb_produk_new ON tb_defect.id_produk_new = tb_produk_new.id_produk
            LEFT JOIN tb_warehouse AS warehouse_old ON tb_defect.id_ware_old = warehouse_old.id_ware
            LEFT JOIN tb_warehouse AS warehouse_new ON tb_defect.id_ware_new = warehouse_new.id_ware
            LEFT JOIN tb_purchaseorder AS po_old ON po_old.idpo = tb_defect.idpo_old
            WHERE
              tb_defect.tanggal_receive='${grp.tanggal_receive}'
              AND tb_defect.users='${grp.users}'
              AND tb_defect.tanggal_receive BETWEEN '${tanggal_start}' AND '${tanggal_end}'
              ${roleCondition}
              ${brandCondition}
              GROUP BY tb_defect.id_act
            ORDER BY tb_defect.id DESC
          `;
            const [resDefectDetail] = await connection.query(sqlDefectDetail);
            if (!resDefectDetail.length) continue;

            const total_qty_inThisLoop = resDefectDetail.reduce((sum, row) => sum + row.qty, 0);
            const total_cost_inThisLoop = resDefectDetail.reduce((sum, row) => sum + row.total_amount, 0);

            sum_total_qty_defect += total_qty_inThisLoop;

            datas.push({
                tanggal: grp.tanggal_receive,
                users: grp.users,
                total_qty: total_qty_inThisLoop,
                total_cost: total_cost_inThisLoop,
                created_at: grp.tanggal_receive,
                detail: resDefectDetail.map(row => ({
                    id: row.id,
                    id_act: row.id_act,
                    idpo: row.idpo_old,
                    idpo_new: row.idpo_new,
                    tanggal_receive: row.tanggal_receive,
                    id_produk_old: row.id_produk_old,
                    id_produk_new: row.id_produk_new,
                    id_ware_old: row.id_ware_old,
                    id_ware_new: row.id_ware_new,
                    qty: row.qty,
                    m_price: row.m_price,
                    total_amount: row.total_amount,
                    produk_old: row.produk_old_name,
                    produk_new: row.produk_new_name,
                    gudang_awal: row.gudang_awal,
                    gudang_tujuan: row.gudang_tujuan,
                    status: row.status || 'BELUM DIKIRIM',
                    tanggal_dikirim: row.tanggal_dikirim
                        ? date.format(new Date(row.tanggal_dikirim), "YYYY-MM-DD")
                        : null,
                    harga: Number(row.harga_final) || 0,
                })),
            });
        }
        const created_at = [...new Set(created_at_list)].join(", ");
        await connection.commit();
        await connection.release();

        return {
            datas,
            total_po: total_po[0]?.totalpo || 0,
            total_qty: sum_total_qty_defect || 0,
            total_qty_purchaseorder: sum_totalqty_po || 0,
            capital_amount: hasil_amount || 0,
            created_at,
        };
    } catch (error) {
        console.error(error);
        await connection.release();
        throw error;
    }
};

const getsizereturmodel = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_sizereturmodel] = await connection.query(
            `SELECT *,SUM(qty)as qty FROM tb_variation WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}' GROUP BY size`
        );

        const [harga_baru] = await connection.query(
            `SELECT r_price FROM tb_produk WHERE id_produk='${body.idproduct}' AND id_ware='${body.idware}'`
        );
        for (let zz = 0; zz < harga_baru.length; zz++) {
            var hasil_hargabaru = harga_baru[zz].r_price;
        }

        const [harga_lama] = await connection.query(
            `SELECT r_price FROM tb_produk WHERE id_produk='${body.id_produk_old}' AND id_ware='${body.id_ware_old}'`
        );
        for (let zx = 0; zx < harga_lama.length; zx++) {
            var hasil_hargalama = harga_lama[zx].r_price;
        }

        var selisihharga = parseInt(hasil_hargabaru) - parseInt(hasil_hargalama);

        if (selisihharga < 0) {
            var statusselisih = "no";
        } else {
            var statusselisih = "yes";
        }


        await connection.commit();
        await connection.release();

        return {
            data_sizereturmodel,
            selisihharga,
            statusselisih,
        };

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getproduktukarmodel = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    const query = body.query;
    const warehouse = body.id_ware;

    try {
        await connection.beginTransaction();

        if (warehouse === "all") {
            if (query != "all") {

            } else {
                var [get_product] = await connection.query(
                    `SELECT * FROM tb_produk GROUP BY id_produk ORDER BY id DESC`
                );
            }
        } else {
            if (query != "all") {

            } else {
                var [get_product] = await connection.query(
                    `SELECT * FROM tb_produk WHERE id_ware='${warehouse}' GROUP BY id_produk ORDER BY id DESC`
                );
            }
        }

        await connection.commit();
        await connection.release();

        return get_product;

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const tukermodel = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const id_pesanan = body.id_pesanan;
    const id_produk_old = body.id_produk_old;
    const id_produk_new = body.id_produk_new;
    const id_ware_old = body.id_ware_old;
    const id_ware_new = body.id_ware_new;
    const size_old = body.size_old;
    const size_new = body.size_new;
    const qty_retur = body.qty_retur;
    const selisih_nominal = body.selisih;
    const users = body.users;

    const [get_produk_old] = await connection.query(
        `SELECT * FROM tb_produk WHERE id_produk='${id_produk_old}'`
    );

    const [get_produk_new] = await connection.query(
        `SELECT * FROM tb_produk WHERE id_produk='${id_produk_new}'`
    );

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

    try {
        await connection.beginTransaction();

        const [cek_produk_lama] = await connection.query(
            `SELECT r_price FROM tb_produk WHERE id_produk='${id_produk_old}' AND id_ware='${body.id_ware_old}' GROUP BY id_produk`
        );

        const [cek_produk_baru] = await connection.query(
            `SELECT r_price FROM tb_produk WHERE id_produk='${id_produk_new}' AND id_ware='${body.id_ware_new}' GROUP BY id_produk`
        );

        var [data_invoice] = await connection.query(
            `SELECT amount FROM tb_invoice WHERE id_pesanan='${body.id_pesanan}'`
        );
        for (let zx = 0; zx < data_invoice.length; zx++) {
            var hasil_invoice = data_invoice[zx].amount;
        }

        var [data_order_lama] = await connection.query(
            `SELECT diskon_item,subtotal,qty,selling_price FROM tb_order WHERE id_pesanan='${body.id_pesanan}' AND id_produk='${body.id_produk_old}'`
        );
        for (let zz = 0; zz < data_order_lama.length; zz++) {
            var data_order_lama_sellingprice = parseInt(data_order_lama[zz].selling_price) * parseInt(body.qty_retur);
            var kurang_produk_lama = parseInt(hasil_invoice) - parseInt(data_order_lama_sellingprice);
        }

        for (let zx = 0; zx < cek_produk_baru.length; zx++) {
            var plus_produk_baru = parseInt(cek_produk_baru[zx].r_price) * parseInt(body.qty_retur);
        }

        if (cek_produk_baru[0].r_price < cek_produk_lama[0].r_price) {
            return "Kurang";
        } else {
            // Proses Penambahan Barang Retur
            const [get_produk_grup] = await connection.query(
                `SELECT * FROM tb_order WHERE id_pesanan='${id_pesanan}' AND id_produk='${id_produk_old}' AND  size='${size_old}' GROUP BY id_produk,size`
            );

            const tanggal_order_get = get_produk_grup[0].tanggal_order;
            const id_pesanan_get = get_produk_grup[0].id_pesanan;
            const id_brand_get = get_produk_grup[0].id_brand;
            const id_store_get = get_produk_grup[0].id_store;
            const id_produk_get = get_produk_grup[0].id_produk;
            const produk_get = get_produk_grup[0].produk;
            const img_get = get_produk_grup[0].img;
            const quality_get = get_produk_grup[0].quality;
            const harga_jual = get_produk_grup[0].selling_price;
            const diskon_item = get_produk_grup[0].diskon_item;
            const idpo = get_produk_grup[0].idpo;



            // cek stock Variasi
            const [get_var] = await connection.query(
                `SELECT * FROM tb_variation WHERE id_produk='${id_produk_new}' AND id_ware='${id_ware_new}' AND  size='${size_new}' AND qty > '0' GROUP BY size ORDER BY idpo ASC`
            );
            // End cek stock Variasi

            const qty_sales = qty_retur;

            for (let i = 0; i < get_var.length; i++) {
                var get_qty = get_var[i].qty;
                var qty_baru = parseInt(get_qty) - parseInt(qty_sales);

                var [get_modal] = await connection.query(
                    `SELECT m_price FROM tb_purchaseorder WHERE idpo='${get_var[i].idpo}' AND id_produk='${id_produk_new}'`
                );

                var [get_produkss] = await connection.query(
                    `SELECT * FROM tb_produk WHERE id_produk='${id_produk_new}'`
                );

                if (qty_baru >= 0) {
                    await connection.query(
                        `INSERT INTO tb_order (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at) 
                    VALUES ('${tanggal_order_get}','${id_pesanan_get}','${id_store_get}','${id_produk_new}','Barang Gudang','${get_produkss[0].img}','${get_produkss[0].produk}','${get_produkss[0].id_brand}','${get_var[i].id_ware}','${get_var[i].idpo}','${get_produkss[0].quality}','${get_var[i].size}','${qty_sales}','${get_modal[0].m_price}','${cek_produk_baru[0].r_price}','${diskon_item}','${parseInt(cek_produk_baru[0].r_price) * parseInt(qty_sales)}','${users}','${tanggal}','${tanggal}')`
                    );

                    //  Update Variation Old QTY
                    await connection.query(
                        `UPDATE tb_variation SET qty='${qty_baru}',updated_at='${tanggal}' WHERE id_produk='${id_produk_new}' AND id_ware='${get_var[i].id_ware}' AND size='${get_var[i].size}' AND idpo='${get_var[i].idpo}'`
                    );
                    //

                } else {
                    if (qty_baru < 0) {
                        var qty_sisa = 0;
                    }

                    await connection.query(
                        `INSERT INTO tb_order (tanggal_order, id_pesanan, id_store, id_produk, source, img, produk, id_brand, id_ware, idpo, quality, size, qty, m_price, selling_price, diskon_item, subtotal, users, created_at, updated_at) 
                    VALUES ('${tanggal_order_get}','${id_pesanan_get}','${id_store_get}','${id_produk_new}','Barang Gudang','${get_produkss[0].img}','${get_produkss[0].produk}','${get_produkss[0].id_brand}','${get_var[i].id_ware}','${get_var[i].idpo}','${get_produkss[0].quality}','${get_var[i].size
                        }','${get_var[i].qty}','${get_modal[0].m_price}','${cek_produk_baru[0].r_price}','${diskon_item}','${parseInt(cek_produk_baru[0].r_price) * parseInt(get_var[i].qty)}','${users}','${tanggal}','${tanggal}')`
                    );

                    //  Update Variation Old QTY
                    await connection.query(
                        `UPDATE tb_variation SET qty='${qty_sisa}',updated_at='${tanggal}' WHERE id_produk='${id_produk_new}' AND id_ware='${get_var[i].id_ware}' AND size='${get_var[i].size}' AND idpo='${get_var[i].idpo}'`
                    );
                    //
                    qty_sales = parseInt(qty_sales) - parseInt(get_var[i].qty);

                }
                await connection.query(
                    `INSERT INTO tb_mutasistock
                (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan_get}','${body.id_ware_new}','${id_store_get}','${body.id_produk_new}','${get_produkss[0].produk}','${get_var[i].idpo}','${body.size_new}','${qty_retur}','Barang Gudang','${body.id_ware_old}','CHANGE PRODUCT IN','${body.users}','${tanggal}','${tanggal}')`
                );
            }
            // End Proses Retur

            // Proses Pengembalian Barang Retur Gudang
            const [get_dataorder] = await connection.query(
                `SELECT * FROM tb_order WHERE id_pesanan='${id_pesanan}' AND id_produk='${id_produk_old}' AND size='${size_old}' AND source='Barang Gudang' ORDER BY idpo ASC`
            );

            var qty_sisa = 0;

            for (let x = 0; x < get_dataorder.length; x++) {

                if (get_dataorder[x].source === "Barang Gudang") {
                    qty_sisa = parseInt(qty_retur) - parseInt(get_dataorder[x].qty);
                    sisa_qty_order = parseInt(get_dataorder[x].qty) - parseInt(qty_retur);

                    if (qty_sisa > 0) {
                        var [get_qty_old] = await connection.query(
                            `SELECT * FROM tb_variation WHERE id_produk='${id_produk_old}' AND id_ware='${id_ware_old}' AND size='${size_old}' AND idpo='${get_dataorder[x].idpo}'`
                        );

                        //  Update Variation Old QTY
                        await connection.query(
                            `UPDATE tb_variation SET qty='${parseInt(get_qty_old[0].qty) + parseInt(get_dataorder[x].qty)}',updated_at='${tanggal}' WHERE id_produk='${id_produk_old}' AND id_ware='${id_ware_old}' AND size='${size_old}' AND idpo='${get_dataorder[x].idpo}'`
                        );
                        //

                        if (sisa_qty_order > 0) {
                            await connection.query(
                                `UPDATE tb_order SET qty='${sisa_qty_order}',subtotal='${parseInt(get_dataorder[x].selling_price) * parseInt(sisa_qty_order)}',updated_at='${tanggal}' WHERE id='${get_dataorder[x].id}'`
                            );
                        } else {
                            await connection.query(
                                `DELETE FROM tb_order WHERE id='${get_dataorder[x].id}'`
                            );
                        }

                        qty_retur = parseInt(qty_retur) - parseInt(get_dataorder[x].qty);
                    } else {
                        var [get_qty_old] = await connection.query(
                            `SELECT * FROM tb_variation WHERE id_produk='${id_produk_old}' AND id_ware='${id_ware_old}' AND size='${size_old}' AND idpo='${get_dataorder[x].idpo}'`
                        );

                        //  Update Variation Old QTY
                        await connection.query(
                            `UPDATE tb_variation SET qty='${parseInt(get_qty_old[0].qty) + parseInt(qty_retur)}',updated_at='${tanggal}' WHERE id_produk='${id_produk_old}' AND id_ware='${id_ware_old}' AND size='${size_old}' AND idpo='${get_dataorder[x].idpo}'`
                        );
                        //

                        if (sisa_qty_order > 0) {
                            await connection.query(
                                `UPDATE tb_order SET qty='${sisa_qty_order}',subtotal='${parseInt(get_dataorder[x].selling_price) * parseInt(sisa_qty_order)}',updated_at='${tanggal}' WHERE id='${get_dataorder[x].id}'`
                            );
                        } else {
                            await connection.query(
                                `DELETE FROM tb_order WHERE id='${get_dataorder[x].id}'`
                            );
                        }
                    }

                    await connection.query(
                        `INSERT INTO tb_mutasistock
                    (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                    VALUES ('${id_mutasi}','${tanggal_skrg}','${id_pesanan_get}','${body.id_ware_old}','${id_store_get}','${body.id_produk_old}','${get_dataorder[x].produk}','${get_dataorder[x].idpo}','${body.size_old}','-${qty_retur}','Barang Gudang','${body.id_ware_new}','CHANGE PRODUCT OUT','${body.users}','${tanggal}','${tanggal}')`
                    );
                }

            }
            await connection.query(
                `UPDATE tb_invoice SET amount='${parseInt(kurang_produk_lama) + parseInt(plus_produk_baru)}',total_amount='${parseInt(kurang_produk_lama) + parseInt(plus_produk_baru)}',selisih='${selisih_nominal}',updated_at='${tanggal}' WHERE id_pesanan='${id_pesanan_get}'`
            );

            await connection.query(
                `INSERT INTO tb_retur_model (tanggal_retur, id_pesanan, id_ware_old, id_produk_old, produk_old, size_lama_old, id_ware_new, id_produk_new, produk_new, size_new, qty_retur, selisih_nominal, keterangan, source, id_store, users, created_at, updated_at) 
            VALUES ('${tanggal_skrg}','${id_pesanan_get}','${id_ware_old}','${id_produk_old}','${get_produk_old[0].produk}','${size_old}','${id_ware_new}','${id_produk_new}','${get_produk_new[0].produk}','${size_new}','${qty_retur}','${selisih_nominal}','TUKAR MODEL','Barang Gudang','${id_store_get}','${users}','${tanggal}','${tanggal}')`
            );
        }

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getreturmodel = async (body) => {
    const connection = await dbPool.getConnection();

    const tanggal = body.tanggal;
    const myArray = tanggal.split(" to ");

    if (tanggal.length > 10) {
        var tanggal_start = myArray[0];
        var tanggal_end = myArray[1];
    } else {
        var tanggal_start = tanggal;
        var tanggal_end = tanggal;
    }

    try {
        await connection.beginTransaction();

        let hasilpcs = 0;
        if (body.datechange === "dateinput") {
            if (body.query === "all") {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        LEFT JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        LEFT JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_store.id_area='${body.Brand}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_store.id_area='${body.area}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_store.id_store='${body.store}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_retur_model.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                }
            } else {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')
                        AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all_area") {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') AND tb_store.id_store='${body.store}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_retur_model.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                }
            }
        } else {
            if (body.query === "all") {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_store.id_area='${body.Brand}' AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all") {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_store.id_area='${body.area}' AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND tb_store.id_store='${body.store}' AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_retur_model.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND tb_retur_model.tanggal_retur BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                    );
                    hasilpcs = qtyPcs;
                }
            } else {
                if (body.store === "all") {
                    if (body.Brand === "all") {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    } else {
                        var [getreturmodel] = await connection.query(
                            `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' ORDER BY tb_retur_model.id DESC`
                        );

                        const [[{ qtyPcs }]] = await connection.query(
                            `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                        );
                        hasilpcs = qtyPcs;
                    }
                } else if (body.store === "all") {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getreturmodel] = await connection.query(
                        `SELECT tb_retur_model.*,tb_store.store,tb_mutasistock.tanggal as tanggal_input FROM tb_retur_model LEFT JOIN tb_store ON tb_retur_model.id_store = tb_store.id_store LEFT JOIN tb_mutasistock ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk WHERE (tb_mutasistock.mutasi='SALES ONLINE' OR tb_mutasistock.mutasi='SALES RETAIL') AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%') AND tb_store.id_store='${body.store}' ORDER BY tb_retur_model.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_retur_model.qty_retur) AS qtyPcs
                        FROM tb_retur_model
                        JOIN tb_mutasistock
                        ON tb_retur_model.id_pesanan = tb_mutasistock.id_pesanan
                        AND tb_retur_model.id_produk_old = tb_mutasistock.id_produk
                        JOIN tb_store 
                        ON tb_retur_model.id_store = tb_store.id_store
                        WHERE tb_retur_model.id_store='${body.store}' AND tb_mutasistock.mutasi IN ('SALES ONLINE','SALES RETAIL')
                        AND (tb_retur_model.id_pesanan LIKE '%${body.query}%' OR tb_retur_model.id_produk_new LIKE '%${body.query}%' OR tb_retur_model.produk_new LIKE '%${body.query}%')`
                    );
                    hasilpcs = qtyPcs;
                }
            }
        }

        const capital_amount = getreturmodel.reduce((sum, row) => sum + ((Number(row.m_price) || 0) * (Number(row.qty) || 0)), 0);

        await connection.commit();
        await connection.release();

        return {
            getreturmodel,
            hasilpesanan: getreturmodel.length || 0,
            hasilpcs: hasilpcs || 0,
            capital_amount,
        };

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getdeleteorder = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const tanggal = body.tanggal;
    const myArray = tanggal.split(" to ");

    if (tanggal.length > 10) {
        var tanggal_start = myArray[0];
        var tanggal_end = myArray[1];
    } else {
        var tanggal_start = tanggal;
        var tanggal_end = tanggal;
    }

    try {
        await connection.beginTransaction();

        let hasilpcs = 0;
        if (body.query === "all") {
            if (body.store === "all") {
                if (body.Brand === "all") {
                    var [getdeleteorder] = await connection.query(
                        `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getdeleteorder] = await connection.query(
                        `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                    );
                    hasilpcs = qtyPcs;
                }
            } else if (body.store === "all_area") {
                var [getdeleteorder] = await connection.query(
                    `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                );

                const [[{ qtyPcs }]] = await connection.query(
                    `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi='DELETE_ORDER' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                );
                hasilpcs = qtyPcs;
            } else {
                var [getdeleteorder] = await connection.query(
                    `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_mutasistock.mutasi='DELETE_ORDER' AND tb_store.id_store='${body.store}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                );

                const [[{ qtyPcs }]] = await connection.query(
                    `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE tb_mutasistock.mutasi='DELETE_ORDER' AND tb_store.id_store='${body.store}' AND tb_mutasistock.tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY tb_mutasistock.id DESC`
                );
                hasilpcs = qtyPcs;
            }
        } else {
            if (body.store === "all") {
                if (body.Brand === "all") {
                    var [getdeleteorder] = await connection.query(
                        `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_mutasistock.mutasi='DELETE_ORDER' ORDER BY tb_mutasistock.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_mutasistock.mutasi='DELETE_ORDER' ORDER BY tb_mutasistock.id DESC`
                    );
                    hasilpcs = qtyPcs;
                } else {
                    var [getdeleteorder] = await connection.query(
                        `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi='DELETE_ORDER' ORDER BY tb_mutasistock.id DESC`
                    );

                    const [[{ qtyPcs }]] = await connection.query(
                        `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.Brand}' AND tb_mutasistock.mutasi='DELETE_ORDER' ORDER BY tb_mutasistock.id DESC`
                    );
                    hasilpcs = qtyPcs;
                }

            } else if (body.store === "all_area") {
                var [getdeleteorder] = await connection.query(
                    `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi='DELETE_ORDER' ORDER BY tb_mutasistock.id DESC`
                );

                const [[{ qtyPcs }]] = await connection.query(
                    `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_store.id_area='${body.area}' AND tb_mutasistock.mutasi='DELETE_ORDER' ORDER BY tb_mutasistock.id DESC`
                );
                hasilpcs = qtyPcs;
            } else {
                var [getdeleteorder] = await connection.query(
                    `SELECT tb_mutasistock.*,tb_store.store,tb_warehouse.warehouse FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_mutasistock.mutasi='DELETE_ORDER' AND tb_store.id_store='${body.store}' ORDER BY tb_mutasistock.id DESC`
                );

                const [[{ qtyPcs }]] = await connection.query(
                    `SELECT SUM(tb_mutasistock.qty) as qtyPcs FROM tb_mutasistock LEFT JOIN tb_store ON tb_mutasistock.id_store = tb_store.id_store LEFT JOIN tb_warehouse ON tb_mutasistock.id_ware = tb_warehouse.id_ware WHERE (tb_mutasistock.id_pesanan LIKE '%${body.query}%' OR tb_mutasistock.id_produk LIKE '%${body.query}%' OR tb_mutasistock.produk LIKE '%${body.query}%') AND tb_mutasistock.mutasi='DELETE_ORDER' AND tb_store.id_store='${body.store}' ORDER BY tb_mutasistock.id DESC`
                );
                hasilpcs = qtyPcs;
            }
        }

        const capital_amount = getdeleteorder.reduce((sum, row) => sum + ((Number(row.m_price) || 0) * (Number(row.qty) || 0)), 0);

        await connection.commit();
        await connection.release();

        return {
            getdeleteorder,
            hasilpesanan: getdeleteorder.length || 0,
            hasilpcs: hasilpcs || 0,
            capital_amount,
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

/**
 * update_defect_status — toggle status BELUM DIKIRIM / SUDAH DIKIRIM KE VENDOR
 * body: { id, status }
 */
const update_defect_status = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        if (!body.id) throw new Error("id wajib diisi");
        const newStatus = body.status || 'BELUM DIKIRIM';
        const tanggalDikirim = newStatus === 'SUDAH DIKIRIM KE VENDOR' ? tanggal2 : null;
        await connection.query(
            `UPDATE tb_defect SET status = ?, tanggal_dikirim = ? WHERE id = ?`,
            [newStatus, tanggalDikirim, body.id]
        );
        await connection.commit();
        return { success: true, id: body.id, status: newStatus, tanggal_dikirim: tanggalDikirim };
    } catch (error) {
        await connection.rollback();
        console.error("update_defect_status error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * bulk_update_defect_status — update status massal untuk banyak id sekaligus
 * body: { ids: number[], status: string }
 */
const bulk_update_defect_status = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        const ids = body.ids;
        if (!ids || !ids.length) throw new Error("ids wajib diisi");
        const newStatus = body.status || 'BELUM DIKIRIM';
        const tanggalDikirim = newStatus === 'SUDAH DIKIRIM KE VENDOR' ? tanggal2 : null;
        const placeholders = ids.map(() => '?').join(',');
        await connection.query(
            `UPDATE tb_defect SET status = ?, tanggal_dikirim = ? WHERE id IN (${placeholders})`,
            [newStatus, tanggalDikirim, ...ids]
        );
        await connection.commit();
        return { success: true, updated: ids.length, status: newStatus };
    } catch (error) {
        await connection.rollback();
        console.error("bulk_update_defect_status error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * update_defect_harga — simpan harga per item defect
 * body: { id, harga }
 */
const update_defect_harga = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        if (!body.id) throw new Error("id wajib diisi");
        await connection.query(
            `UPDATE tb_defect SET harga = ? WHERE id = ?`,
            [Number(body.harga) || 0, body.id]
        );
        return { success: true };
    } catch (error) {
        console.error("update_defect_harga error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

const editPo_defect = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const id_act_edit = body.id_act;
    const idpo_old = body.idpo;
    const idpo_new = body.idpo_new;
    const id_produk_old = body.idproduk;
    const id_produk_new = body.idproduk_new;
    const m_price = body.m_price;
    const id_ware_old = body.id_ware;
    const id_ware_new = body.id_ware_new;
    const users = body.users;
    const data = body.data;

    const [cek_po] = await connection.query(
        `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
    );
    if (cek_po[0].idpo === null) {
        var idpo = tahun + "0001";
    } else {
        const get_last2 = cek_po[0].idpo;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var idpo = tahun + String(hasil).padStart(4, "0");
    }

    const [cek_act] = await connection.query(
        `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
    );
    if (cek_act[0].id_act === null) {
        var id_act = "0001";
    } else {
        const get_last2 = cek_act[0].id_act;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var id_act = String(hasil).padStart(4, "0");
    }

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

    try {
        await connection.beginTransaction();

        var [getdefect] = await connection.query(
            `SELECT id_act,idpo_old,id_produk_old,id_ware_old,idpo_new,id_produk_new,id_ware_new,qty,m_price FROM tb_defect WHERE id_act='${id_act_edit}'`
        );

        const [getproducts] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${id_produk_new}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${id_ware_old}'`
        );

        var variasi = data.variasirestock;
        var totalqty = 0;

        for (let index = 0; index < variasi.length; index++) {
            totalqty = parseInt(totalqty) + parseInt(variasi[index].stok_baru);
            var stock_edit = parseInt(variasi[index].stok_lama) - parseInt(variasi[index].stok_baru);

            var [get_var_sum_old] = await connection.query(
                `SELECT size,qty,idpo FROM tb_variation WHERE id_produk='${id_produk_old}' AND id_ware='${id_ware_old}' AND size='${variasi[index].size}' AND idpo='${idpo_old}' ORDER BY idpo ASC`
            );
            for (let xx = 0; xx < get_var_sum_old.length; xx++) {
                await connection.query(
                    `UPDATE tb_variation SET qty='${parseInt(get_var_sum_old[xx].qty) + parseInt(stock_edit)}',updated_at='${tanggal}' WHERE idpo='${get_var_sum_old[xx].idpo}' AND size='${variasi[index].size}'`
                );
            }
            await connection.query(
                `UPDATE tb_variation SET qty='${variasi[index].stok_baru}',updated_at='${tanggal}' WHERE id_act='${id_act_edit}' AND size='${variasi[index].size}'`
            );

            await connection.query(
                `UPDATE tb_variationorder SET qty='${variasi[index].stok_baru}',tipe_order='EDIT DEFECT',users='${users}',updated_at='${tanggal}' WHERE id_act='${id_act_edit}' AND size='${variasi[index].size}'`
            );

            // Update Variation Old QTY
            await connection.query(
                `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','EDIT DEFECT','${id_ware_new}','-','${id_produk_old}','${getproducts[0].produk}','${idpo_old}','${variasi[index].size}','${variasi[index].stok_baru}','Barang Gudang','${getwarehouse[0].warehouse}','EDIT DEFECT','${users}','${tanggal}','${tanggal}')`
            );
        }

        var total_amount = parseInt(totalqty) * parseInt(getdefect[0].m_price);
        await connection.query(
            `UPDATE tb_purchaseorder SET qty='${totalqty}',m_price='${getdefect[0].m_price}',total_amount='${total_amount}',tipe_order='EDIT DEFECT',users='${users}',updated_at='${tanggal}' WHERE id_act='${id_act_edit}'`
        );

        await connection.query(
            `UPDATE tb_defect SET qty='${totalqty}',m_price='${getdefect[0].m_price}',total_amount='${total_amount}',users='${users}',updated_at='${tanggal}' WHERE id_act='${id_act_edit}'`
        );

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deleteItemdefect = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

    const [cek_po] = await connection.query(
        `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
    );
    if (cek_po[0].idpo === null) {
        var idpo = tahun + "0001";
    } else {
        const get_last2 = cek_po[0].idpo;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var idpo = tahun + String(hasil).padStart(4, "0");
    }

    const [cek_act] = await connection.query(
        `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
    );
    if (cek_act[0].id_act === null) {
        var id_act = "0001";
    } else {
        const get_last2 = cek_act[0].id_act;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var id_act = String(hasil).padStart(4, "0");
    }

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

    try {
        await connection.beginTransaction();

        var [getdefect] = await connection.query(
            `SELECT id_act,idpo_old,id_produk_old,id_ware_old,idpo_new,id_produk_new,id_ware_new,qty,m_price FROM tb_defect WHERE id_act='${body.id_act}'`
        );

        var [getpo] = await connection.query(
            `SELECT tb_variationorder.*,tb_purchaseorder.id_sup,tb_purchaseorder.qty AS totalqty,tb_purchaseorder.m_price FROM tb_variationorder LEFT JOIN tb_purchaseorder ON tb_variationorder.id_act = tb_purchaseorder.id_act WHERE tb_variationorder.id_act='${body.id_act}' ORDER BY tb_variationorder.id ASC`
        );

        var [getpo_order] = await connection.query(
            `SELECT tb_variationorder.qty,tb_variationorder.id_sup,tb_variationorder.idpo FROM tb_variationorder LEFT JOIN tb_purchaseorder ON tb_variationorder.id_act = tb_purchaseorder.id_act WHERE tb_variationorder.id_act='${body.id_act}' ORDER BY tb_variationorder.id ASC`
        );

        const [getproducts] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${getdefect[0].id_produk_old}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${getdefect[0].id_ware_old}'`
        );

        var totalqty = 0;
        for (let index = 0; index < getpo.length; index++) {
            totalqty = totalqty + getpo[index].qty;

            var [get_var_sum_old] = await connection.query(
                `SELECT size,qty,idpo FROM tb_variation WHERE id_produk='${getdefect[0].id_produk_old}' AND id_ware='${getdefect[0].id_ware_old}' AND size='${getpo[index].size}' AND idpo='${getdefect[0].idpo_old}' ORDER BY idpo ASC`
            );
            for (let xx = 0; xx < get_var_sum_old.length; xx++) {
                await connection.query(
                    `UPDATE tb_variation SET qty='${parseInt(getpo_order[index].qty) + parseInt(get_var_sum_old[xx].qty)}',updated_at='${tanggal}' WHERE idpo='${get_var_sum_old[xx].idpo}' AND size='${getpo[index].size}'`
                );


            }
            await connection.query(
                `UPDATE tb_variation SET qty='0',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${getpo[index].size}'`
            );


            await connection.query(
                `UPDATE tb_variationorder SET qty='0',tipe_order='CANCEL DEFECT',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
            );

            await connection.query(
                `UPDATE tb_purchaseorder SET qty='${totalqty}',m_price='${getpo[index].m_price}',total_amount='0',tipe_order='CANCEL DEFECT',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
            );

            // Update Variation Old QTY
            await connection.query(
                `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','CANCEL DEFECT','${getdefect[0].id_ware_new}','-','${getdefect[0].id_produk_old}','${getproducts[0].produk}','${getdefect[0].idpo_old}','${getpo[index].size}','${getpo[index].qty}','Barang Gudang','${getwarehouse[0].warehouse}','CANCEL DEFECT','${body.users}','${tanggal}','${tanggal}')`
            );

            await connection.query(
                `DELETE FROM tb_defect WHERE id_act='${body.id_act}'`
            );
        }

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const get_Sizepodefect = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_getsize] = await connection.query(
            `SELECT *,SUM(qty)as qty FROM tb_variationorder WHERE id_act='${body.id_act}' AND (tipe_order='DEFECT IN' OR tipe_order='EDIT DEFECT') AND qty > 0 GROUP BY size`
        );

        await connection.commit();
        await connection.release();
        return data_getsize;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const editstockopname = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

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

    try {
        await connection.beginTransaction();
        var variasi = body.data.variasirestock;
        var total_qty = 0;

        const [produk_baru] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${body.id_ware}'`
        );

        const [getpo] = await connection.query(
            `SELECT m_price FROM tb_purchaseorder WHERE id_act='${body.id_act}'`
        );

        for (let index = 0; index < variasi.length; index++) {
            var [getdatavariation_total] = await connection.query(
                `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}' AND size='${variasi[index].size}' AND qty != 0 ORDER BY id ASC`
            );

            var [getdatavariation] = await connection.query(
                `SELECT id_produk,id_ware,idpo,size,qty,id_area FROM tb_variation WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}' AND size='${variasi[index].size}' AND qty != 0 ORDER BY id ASC`
            );

            var selisih = parseInt(variasi[index].stok_baru) - parseInt(variasi[index].stok_lama);
            if (variasi[index].stok_baru != variasi[index].stok_lama) {
                for (let x = 0; x < getdatavariation.length; x++) {

                    if (x === (getdatavariation.length - 1)) {
                        if (selisih < 0) {
                            await connection.query(
                                `UPDATE tb_variation SET qty='${parseInt(getdatavariation_total[0].totalqty) + parseInt(selisih)}',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                            );
                        } else {
                            await connection.query(
                                `UPDATE tb_variation SET qty='${parseInt(getdatavariation_total[0].totalqty) + parseInt(selisih)}',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                            );
                        }
                    } else {
                        await connection.query(
                            `UPDATE tb_variation SET qty='0',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                        );
                    }

                    if (x === 0) {
                        await connection.query(
                            `UPDATE tb_variationorder SET qty='${variasi[index].stok_baru}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${variasi[index].size}' AND id_ware='${getdatavariation[x].id_ware}'`
                        );

                        // Update Variation Old QTY
                        await connection.query(
                            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','EDIT STOCK OPNAME','${getdatavariation[x].id_ware}','-','${getdatavariation[x].id_produk}','${produk_baru[0].produk}','${body.idpo}','${variasi[index].size}','${variasi[index].stok_baru}','Barang Gudang','${getwarehouse[0].warehouse}','EDIT STOCK OPNAME','${body.users}','${tanggal}','${tanggal}')`
                        );
                        total_qty = total_qty + parseInt(variasi[index].stok_baru);
                    }
                }
            }
        }

        await connection.query(
            `UPDATE tb_purchaseorder SET total_amount='${parseInt(getpo[0].m_price) * parseInt(total_qty)}',qty='${total_qty}',m_price='${getpo[0].m_price}',updated_at='${tanggal}' WHERE id_produk='${body.idproduk}' AND id_act='${body.id_act}' AND id_ware='${body.id_ware}'`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deleteitemso = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");


    const [cek_po] = await connection.query(
        `SELECT MAX(idpo) as idpo FROM tb_purchaseorder`
    );
    if (cek_po[0].idpo === null) {
        var idpo = tahun + "0001";
    } else {
        const get_last2 = cek_po[0].idpo;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var idpo = tahun + String(hasil).padStart(4, "0");
    }

    const [cek_act] = await connection.query(
        `SELECT MAX(id_act) as id_act FROM tb_purchaseorder`
    );
    if (cek_act[0].id_act === null) {
        var id_act = "0001";
    } else {
        const get_last2 = cek_act[0].id_act;
        const data_2 = get_last2.toString().slice(-4);
        const hasil = parseInt(data_2) + 1;
        var id_act = String(hasil).padStart(4, "0");
    }

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

    try {
        await connection.beginTransaction();

        var [getpo] = await connection.query(
            `SELECT tb_variationorder.*,tb_purchaseorder.id_sup,tb_purchaseorder.qty AS totalqty,tb_purchaseorder.m_price FROM tb_variationorder LEFT JOIN tb_purchaseorder ON tb_variationorder.id_act = tb_purchaseorder.id_act WHERE tb_variationorder.id_act='${body.id_act}'  ORDER BY tb_variationorder.id ASC`
        );

        var [getpo_order] = await connection.query(
            `SELECT tb_variationorder.qty,tb_variationorder.id_sup,tb_variationorder.idpo FROM tb_variationorder LEFT JOIN tb_purchaseorder ON tb_variationorder.id_act = tb_purchaseorder.id_act WHERE tb_variationorder.id_act='${body.id_act}' ORDER BY tb_variationorder.id ASC`
        );

        var [get_var_sum] = await connection.query(
            `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk='${getpo[0].id_produk}' AND id_ware='${getpo[0].id_ware}' AND size='${getpo[0].size}' AND qty > '0' ORDER BY idpo ASC`
        );

        const [getproducts] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${getpo[0].id_produk}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${getpo[0].id_ware}'`
        );

        var totalqty = 0;
        for (let index = 0; index < getpo.length; index++) {
            totalqty = parseInt(totalqty) + parseInt(getpo_order[index].qty);

            if (getpo[index].qty < 0) {

                await connection.query(
                    `UPDATE tb_variation SET qty='${parseInt(get_var_sum[0].totalqty ? get_var_sum[0].totalqty : 0) - parseInt(getpo_order[index].qty)}',id_ware='${getpo_order[index].id_sup}',idpo='${getpo_order[index].idpo}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${getpo[index].size}'`
                );

                await connection.query(
                    `UPDATE tb_variationorder SET qty='0',tipe_order='CANCEL SO',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
                );
            } else {

                await connection.query(
                    `UPDATE tb_variation SET qty='${parseInt(get_var_sum[0].totalqty ? get_var_sum[0].totalqty : 0) - parseInt(getpo_order[index].qty)}',idpo='${getpo_order[index].idpo}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${getpo[index].size}'`
                );

                await connection.query(
                    `UPDATE tb_variationorder SET qty='0',tipe_order='CANCEL SO',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
                );
            }
            // // Update Variation Old QTY
            await connection.query(
                `INSERT INTO tb_mutasistock
            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
            VALUES ('${id_mutasi}','${tanggal_skrg}','CANCEL SO','${getpo[index].id_sup}','-','${getpo[index].id_produk}','${getproducts[0].produk}','${getpo[index].idpo}','${getpo[index].size}','${getpo[index].qty}','Barang Gudang','${getwarehouse[0].warehouse}','CANCEL SO','${body.users}','${tanggal}','${tanggal}')`
            );
        }
        await connection.query(
            `UPDATE tb_purchaseorder SET qty='${totalqty}',m_price='${getpo[0].m_price}',total_amount='0',tipe_order='CANCEL SO',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
        );

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const edittransfer = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");

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

    try {
        await connection.beginTransaction();
        var variasi = body.data.variasirestock;
        var total_qty = 0;

        const [produk_baru] = await connection.query(
            `SELECT produk FROM tb_produk WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_ware}'`
        );

        const [getwarehouse] = await connection.query(
            `SELECT warehouse FROM tb_warehouse WHERE id_ware='${body.id_sup}'`
        );

        const [getpo] = await connection.query(
            `SELECT m_price FROM tb_purchaseorder WHERE id_act='${body.id_act}'`
        );

        for (let index = 0; index < variasi.length; index++) {

            var [getdatavariation_total] = await connection.query(
                `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_sup}' AND size='${variasi[index].size}' AND qty != 0 ORDER BY id ASC`
            );

            var [getdatavariation] = await connection.query(
                `SELECT id_produk,id_ware,idpo,size,qty,id_area FROM tb_variation WHERE id_produk='${body.idproduk}' AND id_ware='${body.id_sup}' AND size='${variasi[index].size}' AND qty != 0 ORDER BY id ASC`
            );

            var selisih = parseInt(variasi[index].stok_lama) - parseInt(variasi[index].stok_baru);

            if (variasi[index].stok_baru != variasi[index].stok_lama) {

                for (let x = 0; x < getdatavariation.length; x++) {
                    if (x === (getdatavariation.length - 1)) {
                        if (selisih < 0) {
                            await connection.query(
                                `UPDATE tb_variation SET qty='${parseInt(getdatavariation_total[0].totalqty) + parseInt(selisih)}',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                            );
                        } else {
                            await connection.query(
                                `UPDATE tb_variation SET qty='${parseInt(getdatavariation_total[0].totalqty) + parseInt(selisih)}',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                            );
                        }
                    } else {
                        await connection.query(
                            `UPDATE tb_variation SET qty='0',updated_at='${tanggal}' WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}' AND size='${getdatavariation[x].size}'`
                        );
                    }
                    await connection.query(
                        `UPDATE tb_variation SET qty='${variasi[index].stok_baru}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND id_ware='${body.id_ware}' AND size='${getdatavariation[x].size}'`
                    );

                    if (x === 0) {
                        await connection.query(
                            `UPDATE tb_variationorder SET qty='${variasi[index].stok_baru}',updated_at='${tanggal}' WHERE id_act='${body.id_act}' AND size='${variasi[index].size}' AND id_ware='${body.id_ware}'`
                        );
                        // Update Variation Old QTY
                        await connection.query(
                            `INSERT INTO tb_mutasistock
                            (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                            VALUES ('${id_mutasi}','${tanggal_skrg}','EDIT TRANSFER','${body.id_ware}','-','${getdatavariation[x].id_produk}','${produk_baru[0].produk}','${getdatavariation[x].idpo}','${variasi[index].size}','${variasi[index].stok_baru}','Barang Gudang','${getwarehouse[0].warehouse}','EDIT TRANSFER','${body.users}','${tanggal}','${tanggal}')`
                        );
                        total_qty = parseInt(total_qty) + parseInt(variasi[index].stok_baru);
                    }
                }
            }
        }

        await connection.query(
            `UPDATE tb_transfer_keterangan SET ket='${body.ket}' WHERE id_act='${body.id_act}'`
        );

        if (total_qty != 0) {
            await connection.query(
                `UPDATE tb_purchaseorder SET total_amount='${parseInt(body.m_price) * parseInt(total_qty)}',qty='${total_qty}',m_price='${body.m_price}',updated_at='${tanggal}' WHERE id_act='${body.id_act}'`
            );
        }

        await connection.commit();
        await connection.release();
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deleteitempo = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");

    try {
        await connection.beginTransaction();

        // 1. Ambil data purchase order yang akan dihapus berdasarkan id_act
        const [poRecords] = await connection.query(
            `SELECT * FROM tb_purchaseorder WHERE id_act = ?`,
            [body.id_act]
        );
        if (poRecords.length === 0) {
            throw new Error("Purchase order tidak ditemukan");
        }
        const poRecord = poRecords[0];

        // 2. Ambil semua data variation order terkait PO (dengan qty tidak 0)
        const [variationOrders] = await connection.query(
            `SELECT * FROM tb_variationorder WHERE id_act = ? AND qty != 0`,
            [body.id_act]
        );

        // 3. Untuk tiap variation order, update tabel tb_variation untuk mengurangi qty
        for (const vo of variationOrders) {
            await connection.query(
                `UPDATE tb_variation 
           SET qty = qty - ?, updated_at = ? 
           WHERE id_produk = ? AND id_ware = ? AND size = ? AND id_act = ?`,
                [vo.qty, tanggal, vo.id_produk, vo.id_ware, vo.size, body.id_act]
            );
        }

        // 4. Lakukan soft delete pada data di tb_purchaseorder dan tb_variationorder
        //    dengan mengupdate field yang relevan.
        await connection.query(
            `UPDATE tb_purchaseorder 
         SET total_amount = 0, qty = 0, tipe_order = 'DELETE PO', updated_at = ? 
         WHERE id_act = ?`,
            [tanggal, body.id_act]
        );
        await connection.query(
            `UPDATE tb_variationorder 
         SET qty = 0, tipe_order = 'DELETE PO', updated_at = ? 
         WHERE id_act = ?`,
            [tanggal, body.id_act]
        );

        // 5. Insert data mutasi ke tb_mutasistock untuk mencatat penghapusan PO
        //    Ambil nilai id_mutasi terakhir agar bisa di-generate secara berurutan
        const [cekMutasi] = await connection.query(
            `SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`
        );
        let nextMutasiNumber;
        if (!cekMutasi[0].id_mutasi) {
            nextMutasiNumber = 1;
        } else {
            const lastId = cekMutasi[0].id_mutasi;
            const numberPart = parseInt(lastId.toString().slice(-8));
            nextMutasiNumber = numberPart + 1;
        }

        // Untuk setiap variation order, insert satu record mutasi
        for (const vo of variationOrders) {
            const id_mutasi = "MT-" + String(nextMutasiNumber).padStart(8, "0");
            nextMutasiNumber++;

            // Dapatkan nama produk dari tabel tb_produk (jika ada)
            const [produkResult] = await connection.query(
                `SELECT produk FROM tb_produk WHERE id_produk = ? AND id_ware = ?`,
                [vo.id_produk, vo.id_ware]
            );
            const produkName = produkResult.length > 0 ? produkResult[0].produk : "";

            // Dapatkan nama supplier dari tabel tb_supplier (jika ada)
            const [supplierResult] = await connection.query(
                `SELECT supplier FROM tb_supplier WHERE id_sup = ?`,
                [poRecord.id_sup]
            );
            const supplierName = supplierResult.length > 0 ? supplierResult[0].supplier : "";

            await connection.query(
                `INSERT INTO tb_mutasistock 
           (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_mutasi,
                    tanggal_skrg,
                    'DELETE PO',       // id_pesanan – bisa disesuaikan sesuai kebutuhan
                    vo.id_ware,
                    '-',               // id_store; diset sebagai '-' atau bisa diganti
                    vo.id_produk,
                    produkName,
                    poRecord.idpo,
                    vo.size,
                    vo.qty,
                    'Barang Gudang',   // source
                    supplierName,
                    'DELETE PO',       // mutasi
                    body.users,
                    tanggal,
                    tanggal
                ]
            );
        }

        await connection.commit();
        connection.release();
        return { success: true };
    } catch (error) {
        console.error("Error in deleteitempo:", error);
        await connection.rollback();
        connection.release();
        return { success: false, error: error.message };
    }
};

const getstore_api = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    try {
        await connection.beginTransaction();

        const [data_store] = await connection.query(
            `SELECT * FROM tb_store ORDER BY id ASC`
        );

        await connection.commit();
        await connection.release();

        return data_store;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const cekbeforeorder = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    try {
        await connection.beginTransaction();
        const datas = [];

        const [getProduk] = await connection.query(
            `SELECT tb_produk.produk,tb_produk.img,tb_produk.r_price,tb_produk.g_price,tb_warehouse.warehouse FROM tb_produk LEFT JOIN tb_warehouse ON tb_warehouse.id_ware = tb_produk.id_ware WHERE tb_produk.id_produk='${body.id_produk}' AND tb_produk.id_ware='${body.id_ware}'`
        );
        const [getVar] = await connection.query(
            `SELECT SUM(qty) as qty FROM tb_variation WHERE id_produk='${body.id_produk}' AND id_ware='${body.id_ware}' AND size='${body.size}'`
        );

        datas.push({
            produk: getProduk[0].produk,
            img: getProduk[0].img,
            harga_jual: getProduk[0].g_price,
            source: "Gudang : " + getProduk[0].warehouse,
            qty_ready: getVar[0].qty,
        });

        await connection.commit();
        await connection.release();

        return datas;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const cekbeforeordermassal = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        const result = body.result;

        // Buat array id_produk, id_ware, dan size untuk query batch
        const queries = result.map(item => `('${item.id_produk}', '${item.id_ware}', '${item.size}')`).join(',');

        // Query untuk menghitung SUM(qty) sebagai qty_ready
        const sumQuery = `
            SELECT 
                tb_produk.id_produk,
                tb_produk.id_ware,
                tb_variation.size,
                SUM(tb_variation.qty) AS qty_ready
            FROM tb_produk
            LEFT JOIN tb_variation 
                ON tb_variation.id_produk = tb_produk.id_produk 
                AND tb_variation.id_ware = tb_produk.id_ware
            WHERE (tb_produk.id_produk, tb_produk.id_ware, tb_variation.size) IN (${queries})
            GROUP BY tb_produk.id_produk, tb_produk.id_ware, tb_variation.size;
        `;

        // Eksekusi query untuk menghitung SUM(qty)
        const [sumRows] = await connection.query(sumQuery);

        // Query untuk mengambil data produk dan warehouse
        const productQuery = `
            SELECT 
                tb_produk.produk, 
                tb_produk.img, 
                tb_produk.r_price, 
                tb_produk.g_price, 
                tb_warehouse.warehouse, 
                tb_variation.size, 
                tb_produk.id_produk,
                tb_produk.id_ware
            FROM tb_produk
            LEFT JOIN tb_warehouse 
                ON tb_warehouse.id_ware = tb_produk.id_ware 
            LEFT JOIN tb_variation 
                ON tb_variation.id_produk = tb_produk.id_produk 
                AND tb_variation.id_ware = tb_produk.id_ware
            WHERE (tb_produk.id_produk, tb_produk.id_ware, tb_variation.size) IN (${queries})
        `;

        // Eksekusi query untuk mengambil data produk dan warehouse
        const [productRows] = await connection.query(productQuery);

        // Buat array untuk menyimpan hasil akhir
        const datas = [];

        // Iterasi setiap item di result
        result.forEach(item => {

            // Cari data yang sesuai dari hasil query SQL (produk dan warehouse)
            const matchedProductRow = productRows.find(
                row =>
                    row.id_produk === item.id_produk &&
                    row.id_ware === item.id_ware &&
                    row.size === item.size
            );

            // Cari data SUM(qty) yang sesuai dari hasil query SUM
            const matchedSumRow = sumRows.find(
                row =>
                    row.id_produk === item.id_produk &&
                    row.id_ware === item.id_ware &&
                    row.size === item.size
            );

            // Jika data ditemukan, gabungkan dengan item dari result
            if (matchedProductRow && matchedSumRow) {
                datas.push({
                    id_produk: item.id_produk,
                    id_ware: item.id_ware,
                    id_store: item.id_store,
                    produk: matchedProductRow.produk,
                    size: item.size,
                    img: item.gambar_produk || matchedProductRow.img,
                    // harga_jual: parseInt(matchedProductRow.r_price) + parseInt(25000),
                    harga_jual: matchedProductRow.g_price,
                    source: "Gudang : " + matchedProductRow.warehouse,
                    qty_ready: matchedSumRow.qty_ready, // Ambil qty_ready dari hasil SUM(qty)
                    qtysales: item.quantity,
                    no_pesanan: item.no_pesanan,
                    total_amount: item.total_amount,
                    morethan: item.morethan,
                });
            } else {
                // Jika data tidak ditemukan, tetap masukkan item dari result dengan nilai default
                datas.push({
                    id_produk: item.id_produk,
                    id_ware: item.id_ware,
                    id_store: item.id_store,
                    produk: null,
                    size: item.size,
                    img: item.gambar_produk || null,
                    harga_jual: null,
                    source: null,
                    qty_ready: 0, // Default value jika data tidak ditemukan
                    qtysales: item.quantity,
                    no_pesanan: item.no_pesanan,
                    total_amount: item.total_amount,
                    morethan: item.morethan,
                });
            }
        });

        // Grup berdasarkan no_pesanan
        const groupedData = datas.reduce((acc, item) => {
            if (!acc[item.no_pesanan]) {
                acc[item.no_pesanan] = {
                    no_pesanan: item.no_pesanan,
                    total_qtysales: 0,
                    total_amount: item.total_amount,
                    items: [],
                };
            }
            acc[item.no_pesanan].total_qtysales += item.qtysales;
            acc[item.no_pesanan].items.push({
                ...item,
                morethan: item.morethan
            });
            return acc;
        }, {});

        const resultGrouped = Object.values(groupedData);

        await connection.release();

        return resultGrouped;
    } catch (error) {
        console.error(error);
        await connection.release();
        throw error;
    }
};

// const cekbeforeordermassal = async (body) => {
//     const connection = await dbPool.getConnection();
//     try {
//         const result = body.result;

//         // Buat array id_produk, id_ware, dan size untuk query batch
//         const queries = result.map(item => `('${item.id_produk}', '${item.id_ware}', '${item.size}')`).join(',');

//         // Query untuk menghitung SUM(qty) sebagai qty_ready
//         const sumQuery = `
//             SELECT 
//                 tb_produk.id_produk,
//                 tb_produk.id_ware,
//                 tb_variation.size,
//                 SUM(tb_variation.qty) AS qty_ready
//             FROM tb_produk
//             LEFT JOIN tb_variation 
//                 ON tb_variation.id_produk = tb_produk.id_produk 
//                 AND tb_variation.id_ware = tb_produk.id_ware
//             WHERE (tb_produk.id_produk, tb_produk.id_ware, tb_variation.size) IN (${queries})
//             GROUP BY tb_produk.id_produk, tb_produk.id_ware, tb_variation.size;
//         `;

//         // Query untuk mengambil data produk dan warehouse
//         const productQuery = `
//             SELECT 
//                 tb_produk.produk, 
//                 tb_produk.img, 
//                 tb_produk.r_price, 
//                 tb_produk.g_price, 
//                 tb_warehouse.warehouse, 
//                 tb_variation.size, 
//                 tb_produk.id_produk,
//                 tb_produk.id_ware
//             FROM tb_produk
//             LEFT JOIN tb_warehouse 
//                 ON tb_warehouse.id_ware = tb_produk.id_ware 
//             LEFT JOIN tb_variation 
//                 ON tb_variation.id_produk = tb_produk.id_produk 
//                 AND tb_variation.id_ware = tb_produk.id_ware
//             WHERE (tb_produk.id_produk, tb_produk.id_ware, tb_variation.size) IN (${queries})
//         `;

//         // Eksekusi kedua query secara paralel untuk efisiensi
//         const [[sumRows], [productRows]] = await Promise.all([
//             connection.query(sumQuery),
//             connection.query(productQuery)
//         ]);

//         // Buat Map untuk data productRows dan sumRows agar lookup lebih cepat
//         const productMap = new Map();
//         productRows.forEach(row => {
//             const key = `${row.id_produk}_${row.id_ware}_${row.size}`;
//             productMap.set(key, row);
//         });

//         const sumMap = new Map();
//         sumRows.forEach(row => {
//             const key = `${row.id_produk}_${row.id_ware}_${row.size}`;
//             sumMap.set(key, row);
//         });

//         // Buat array untuk menyimpan hasil akhir
//         const datas = [];

//         // Iterasi setiap item di result, gunakan Map untuk lookup data yang sesuai
//         result.forEach(item => {
//             const key = `${item.id_produk}_${item.id_ware}_${item.size}`;
//             const matchedProductRow = productMap.get(key);
//             const matchedSumRow = sumMap.get(key);

//             if (matchedProductRow && matchedSumRow) {
//                 datas.push({
//                     id_produk: item.id_produk,
//                     id_ware: item.id_ware,
//                     id_store: item.id_store,
//                     produk: matchedProductRow.produk,
//                     size: item.size,
//                     img: matchedProductRow.img,
//                     // harga_jual: parseInt(matchedProductRow.r_price) + parseInt(25000),
//                     harga_jual: matchedProductRow.g_price,
//                     source: "Gudang : " + matchedProductRow.warehouse,
//                     qty_ready: matchedSumRow.qty_ready, // Ambil qty_ready dari hasil SUM(qty)
//                     qtysales: item.quantity,
//                     no_pesanan: item.no_pesanan,
//                     total_amount: item.total_amount,
//                     morethan: item.morethan,
//                 });
//             } else {
//                 // Jika data tidak ditemukan, tetap masukkan item dengan nilai default
//                 datas.push({
//                     id_produk: item.id_produk,
//                     id_ware: item.id_ware,
//                     id_store: item.id_store,
//                     produk: null,
//                     size: item.size,
//                     img: null,
//                     harga_jual: null,
//                     source: null,
//                     qty_ready: 0, // Default value jika data tidak ditemukan
//                     qtysales: item.quantity,
//                     no_pesanan: item.no_pesanan,
//                     total_amount: item.total_amount,
//                     morethan: item.morethan,
//                 });
//             }
//         });

//         // Grup berdasarkan no_pesanan
//         const groupedData = datas.reduce((acc, item) => {
//             if (!acc[item.no_pesanan]) {
//                 acc[item.no_pesanan] = {
//                     no_pesanan: item.no_pesanan,
//                     total_qtysales: 0,
//                     total_amount: item.total_amount,
//                     items: [],
//                 };
//             }
//             acc[item.no_pesanan].total_qtysales += item.qtysales;
//             acc[item.no_pesanan].items.push({
//                 ...item,
//                 morethan: item.morethan
//             });
//             return acc;
//         }, {});

//         const resultGrouped = Object.values(groupedData);

//         await connection.release();

//         return resultGrouped;
//     } catch (error) {
//         console.error(error);
//         await connection.release();
//         throw error;
//     }
// };

const getstore_history = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        if (body.role === "SUPER-ADMIN") {
            if (body.Brand == "all") {
                var [get_store] = await connection.query(
                    `SELECT * FROM tb_store ORDER BY id ASC`
                );
            } else {
                var [get_store] = await connection.query(
                    `SELECT * FROM tb_store WHERE id_area='${body.Brand}' ORDER BY id ASC`
                );
            }
        } else if (body.role === "HEAD-AREA") {
            var [get_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_area='${body.store}' ORDER BY id ASC `
            );
        } else {
            var [get_store] = await connection.query(
                `SELECT * FROM tb_store WHERE id_store='${body.store}' ORDER BY id ASC`
            );
        }

        var [get_brand] = await connection.query(
            `SELECT brand,id_area FROM tb_warehouse GROUP BY brand`
        );

        await connection.commit();
        await connection.release();

        return {
            get_store,
            get_brand
        };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const getpendingapi = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [get_pending] = await connection.query(
            `SELECT * FROM history_order_api ORDER BY id ASC`
        );
        const [count_pending] = await connection.query(
            `SELECT COUNT(id) as countId FROM history_order_api GROUP BY id_pesanan ORDER BY id ASC`
        );

        await connection.commit();
        await connection.release();

        return { get_pending, count_pending };
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const cek_namaproduk = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [get_produk] = await connection.query(
            `SELECT id_produk,produk FROM tb_produk GROUP BY id_produk ORDER BY id ASC `
        );

        await connection.commit();
        await connection.release();

        return get_produk;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const cekarea_sync = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const [getwwares] = await connection.query(
            `SELECT id_area FROM tb_store WHERE id_ware='${body.id_ware}' `
        );

        const [getares] = await connection.query(
            `SELECT id_ware,ip FROM tb_store WHERE id_area='${getwwares[0].id_area}' GROUP BY id_ware`
        );

        await connection.commit();
        await connection.release();

        return getares;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const get_spk = async (body) => {
    const connection = await dbPool.getConnection();
    const isManualDate = body.isManualDate === true;


    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    function getArrivalRangeFromSpkName(spkName) {
        const re = /(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\s+(\d{4})/i;
        const m = String(spkName || "").match(re);
        if (!m) return null;

        const monLabel = m[1];
        const year = Number(m[2]);
        const monIdx = monthLabels.findIndex(x => x.toLowerCase() === monLabel.toLowerCase());
        if (monIdx < 0 || !Number.isFinite(year)) return null;

        const start = new Date(year, monIdx, 1);
        const end = new Date(year, monIdx + 1, 0);

        const pad = (n) => String(n).padStart(2, "0");
        const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

        return { startDateArrival: fmt(start), endDateArrival: fmt(end) };
    }

    const arrivalCacheBySpkName = {};
    // bentuk: arrivalCacheBySpkName[spkName][`${id_produk}_${id_ware}`] = { list, total }
    // ===============================
    // 🔥 RESOLVE FINAL WAREHOUSE
    // ===============================
    let finalWarehouse = null;

    if (body.role === "SUPER-ADMIN") {

        // jika FE kirim warehouse → pakai
        if (body.warehouse && body.warehouse !== "all") {
            finalWarehouse = body.warehouse;
        } else {
            // default pertama kali load
            finalWarehouse = "WARE-0001";
        }

    } else if (body.role === "HEAD-AREA") {

        // jika FE mengirim warehouse → pakai itu
        if (body.warehouse && body.warehouse !== "all") {

            // validasi warehouse tsb memang milik area ini
            const [[valid]] = await connection.query(
                `
            SELECT id_ware 
            FROM tb_warehouse
            WHERE id_ware = ?
              AND id_area = ?
            LIMIT 1
            `,
                [body.warehouse, body.area]
            );

            if (!valid) {
                throw new Error("Warehouse tidak termasuk area anda");
            }

            finalWarehouse = body.warehouse;

        } else {
            // fallback → warehouse pertama area tsb
            const [[ware]] = await connection.query(
                `
            SELECT id_ware
            FROM tb_warehouse
            WHERE id_area = ?
            ORDER BY id_ware ASC
            LIMIT 1
            `,
                [body.area]
            );

            if (!ware) {
                throw new Error("Warehouse tidak ditemukan untuk area ini");
            }

            finalWarehouse = ware.id_ware;
        }
    } else {

        // ✅ FIX
        if (!body.id_ware) {
            throw new Error("id_ware wajib dikirim");
        }

        finalWarehouse = body.id_ware;
    }

    // ===============================
    // 🔥 AMBIL DATA MULTIPLIER BULAN
    // ===============================
    const [spkMonthRows] = await connection.query(`
        SELECT 
            id_spk_month,
            multiplier
        FROM spk_month
        ORDER BY multiplier ASC
    `);

    const multiplier = spkMonthRows.map(r => ({
        id: r.id_spk_month,
        multiplier: Number(r.multiplier),
    }));

    let startDate = null;
    let endDate = null;

    /**
  * ==================================================
  * 1️⃣ JIKA USER MANUAL PILIH TANGGAL
  * ==================================================
  */
    if (
        isManualDate &&
        body.dateRange &&
        body.dateRange.includes("to")
    ) {
        const splitFE = body.dateRange.split(" to ");

        startDate = splitFE[0];
        endDate = splitFE[1];

    }

    /**
     * ==================================================
     * 2️⃣ AUTO MODE (FIRST LOAD / REFRESH)
     * ==================================================
     */
    if (!startDate || !endDate) {

        const [[spkExist]] = await connection.query(`
        SELECT id_spk FROM tb_spk_list LIMIT 1
    `);

        // ===============================
        // ✅ SUDAH ADA SPK
        // ===============================
        if (spkExist) {

            const [[spkDate]] = await connection.query(`
            SELECT dateSelected
            FROM tb_spk_date
            ORDER BY id DESC
            LIMIT 1
        `);

            if (spkDate?.dateSelected) {

                const splitDB = spkDate.dateSelected.split(" to ");

                if (splitDB.length === 2) {
                    startDate = splitDB[0];
                    endDate = splitDB[1];

                }
            }
        }

        // ===============================
        // ❌ BELUM ADA SPK → DEFAULT 30 HARI
        // ===============================
        if (!startDate || !endDate) {

            startDate = date.format(
                date.addDays(new Date(), -30),
                "YYYY-MM-DD"
            );

            endDate = date.format(
                new Date(),
                "YYYY-MM-DD"
            );
        }
    }


    try {
        let whereClause = "";
        let orderByClause = `
            ORDER BY 
                stock DESC,
                p.produk ASC
        `;

        if (body.sortMode === "sales_desc") {
            orderByClause = `
                ORDER BY 
                    peak_sales DESC,
                    stock DESC,
                    p.produk ASC
            `;
        }

        if (body.sortMode === "stock_desc") {
            orderByClause = `
                ORDER BY 
                    stock DESC,
                    peak_sales DESC,
                    p.produk ASC
            `;
        }

        if (body.sortMode === "stock_asc") {
            orderByClause = `
                ORDER BY 
                    stock ASC,
                    peak_sales DESC,
                    p.produk ASC
            `;
        }

        const params = [];

        /* =====================================================
           ✅ FILTER WAREHOUSE
        ====================================================== */
        if (finalWarehouse) {
            whereClause = "WHERE p.id_ware = ?";
            params.push(finalWarehouse);
        }

        /* =====================================================
           ✅ FILTER CATEGORY (TAMBAHAN SAJA)
        ====================================================== */
        if (body.Category && body.Category !== "all") {
            if (whereClause) {
                whereClause += " AND p.id_category = ?";
            } else {
                whereClause = "WHERE p.id_category = ?";
            }
            params.push(body.Category);
        }

        const [rows] = await connection.query(
            `
            SELECT 
                p.id_produk,
                p.id_ware,
                p.produk,
                w.warehouse AS warehouse,

                COALESCE(stock_data.stock, 0) AS stock,
                COALESCE(peak_sales_data.peak_sales, 0) AS peak_sales,

                -- 🔥 HEADER SPK
                spk.id_spk,
                spk.nama AS spk_nama,
                spk.id_sup AS spk_id_sup,
                sup.supplier AS spk_supplier,
                COALESCE(spk.qty,0) AS spk_qty,
                spk.harga AS spk_harga,
                spk.id_spk_detail AS spk_id_spk_detail,
                spk.created_at AS spk_created_at,

                -- 🔥 DETAIL SIZE
                spk_list.size AS spk_size,
                COALESCE(spk_list.qty,0) AS spk_size_qty,

                -- SPK UTAMA
                spk_utama.id_spk AS spk_utama_id,
                spk_utama.nama AS spk_utama_nama,
                COALESCE(spk_utama.qty,0) AS spk_utama_qty,
                spk_utama.created_at AS spk_utama_created_at

            FROM tb_produk p

            LEFT JOIN tb_category c
                ON c.id_category = p.id_category

            LEFT JOIN tb_warehouse w
                ON w.id_ware = p.id_ware

            LEFT JOIN (
                SELECT id_produk, id_ware, SUM(qty) AS stock
                FROM tb_variation
                GROUP BY id_produk, id_ware
            ) stock_data
                ON stock_data.id_produk = p.id_produk
            AND stock_data.id_ware = p.id_ware

            LEFT JOIN (
                SELECT 
                    x.id_produk,
                    x.id_ware,
                    MAX(x.total_qty) AS peak_sales
                FROM (
                    SELECT 
                        o.id_produk,
                        o.id_ware,
                        DATE_FORMAT(o.tanggal_order, '%Y-%m') AS ym,
                        SUM(o.qty) AS total_qty
                    FROM tb_order o
                    WHERE o.tanggal_order >= DATE_FORMAT(
                        DATE_SUB(CURDATE(), INTERVAL 3 MONTH),
                        '%Y-%m-01'
                    )
                    GROUP BY 
                        o.id_produk,
                        o.id_ware,
                        DATE_FORMAT(o.tanggal_order, '%Y-%m')
                ) x
                GROUP BY x.id_produk, x.id_ware
            ) peak_sales_data
                ON peak_sales_data.id_produk = p.id_produk
            AND peak_sales_data.id_ware = p.id_ware

            LEFT JOIN tb_spk spk
                ON spk.id_produk = p.id_produk
            AND spk.id_ware = p.id_ware
            AND (spk.is_deleted IS NULL OR spk.is_deleted = 0)

            LEFT JOIN tb_supplier sup
                ON sup.id_sup = spk.id_sup

            LEFT JOIN tb_spk_list spk_list
                ON spk_list.id_spk   = spk.id_spk
            AND spk_list.id_produk = p.id_produk
            AND spk_list.id_ware   = p.id_ware
            AND spk_list.id_sup    = spk.id_sup

            LEFT JOIN tb_spk_utama spk_utama
                ON spk_utama.id_produk = p.id_produk
            AND spk_utama.id_ware = p.id_ware

            ${whereClause}

            ${orderByClause}
            `,
            params
        );

        // ambil semua nama kolom PO yang muncul di result
        const spkNames = Array.from(
            new Set(rows.map(r => r.spk_nama).filter(Boolean))
        );

        // untuk tiap kolom SPK, hitung arrival stok berdasarkan relasi po.id_spk -> tb_spk.id_spk
        for (const spkName of spkNames) {
            const [arrRows] = await connection.query(
                `
                SELECT
                    vo.id_produk,
                    vo.id_ware,
                    vo.size,
                    spk.nama AS spk_nama,
                    po.id_sup,
                    SUM(vo.qty) AS qty
                FROM tb_variationorder vo
                LEFT JOIN tb_purchaseorder po
                    ON po.idpo = vo.idpo
                    AND po.id_produk = vo.id_produk
                    AND po.id_ware = vo.id_ware
                LEFT JOIN tb_spk spk
                    ON spk.id_spk = po.id_spk
                    AND spk.id_produk = vo.id_produk
                    AND spk.id_ware = vo.id_ware
                    AND spk.id_sup = po.id_sup
                WHERE vo.id_ware = ?
                  AND vo.qty > 0
                  AND (
                    po.tipe_order = 'RESTOCK'
                    OR vo.tipe_order = 'RESTOCK'
                  )
                  AND spk.nama = ?
                GROUP BY vo.id_produk, vo.id_ware, vo.size, spk.nama, po.id_sup
                `,
                [
                    finalWarehouse,
                    spkName
                ]
            );

            // bentuk baru: mapArrival[`${id_produk}_${id_ware}`][id_sup] = { list, total }
            const mapArrival = {};
            for (const r of arrRows) {
                const key = `${r.id_produk}_${r.id_ware}`;
                const supId = r.id_sup || "NO_SUPPLIER";

                if (!mapArrival[key]) mapArrival[key] = {};
                if (!mapArrival[key][supId]) mapArrival[key][supId] = { list: [], total: 0 };

                const q = Number(r.qty) || 0;
                mapArrival[key][supId].list.push({ size: r.size, qty: q });
                mapArrival[key][supId].total += q;
            }

            arrivalCacheBySpkName[spkName] = mapArrival;
        }

        const [variationRows] = await connection.query(`
            SELECT 
                id_produk,
                id_ware,
                size,
                SUM(qty) AS qty
            FROM tb_variation
            WHERE id_ware = ?
            GROUP BY id_produk, id_ware, size
        `, [finalWarehouse]);

        const [variationSoldRows] = await connection.query(`
        SELECT 
            id_produk,
            id_ware,
            size,
            SUM(qty) AS qty
        FROM tb_order
        WHERE id_ware = ?
        AND tanggal_order >= DATE_FORMAT(
            DATE_SUB(CURDATE(), INTERVAL 3 MONTH),
            '%Y-%m-01'
        )
        GROUP BY id_produk, id_ware, size
    `, [finalWarehouse]);

        const variationMap = {};
        const variationSoldMap = {};
        variationRows.forEach(v => {
            const key = `${v.id_produk}_${v.id_ware}`;

            if (!variationMap[key]) {
                variationMap[key] = {
                    list: [],
                    total: 0
                };
            }

            const qty = Number(v.qty) || 0;

            variationMap[key].list.push({
                size: v.size,
                qty: qty
            });

            // ✅ TOTAL AKUMULASI
            variationMap[key].total += qty;
        });

        variationSoldRows.forEach(v => {
            const key = `${v.id_produk}_${v.id_ware}`;

            if (!variationSoldMap[key]) {
                variationSoldMap[key] = {
                    list: [],
                    total: 0
                };
            }

            const qty = Number(v.qty) || 0;

            variationSoldMap[key].list.push({
                size: v.size,
                qty: qty
            });

            // ✅ TOTAL SOLD
            variationSoldMap[key].total += qty;
        });

        let peakSalesUtamaMap = {};
        let peakSalesUtamaVariationMap = {};

        if (startDate && endDate) {

            const [peakUtamaRows] = await connection.query(`
                WITH monthly_sales AS (
                SELECT
                    id_produk,
                    id_ware,
                    DATE_FORMAT(tanggal_order, '%Y-%m') AS ym,
                    SUM(qty) AS total_qty
                FROM tb_order
                WHERE tanggal_order BETWEEN ? AND ?
                GROUP BY id_produk, id_ware, ym
            ),

            peak_month AS (
                SELECT
                    id_produk,
                    id_ware,
                    MAX(total_qty) AS peak_sales_utama
                FROM monthly_sales
                GROUP BY id_produk, id_ware
            ),

            peak_month_selected AS (
                SELECT
                    m.id_produk,
                    m.id_ware,
                    m.ym,
                    p.peak_sales_utama
                FROM monthly_sales m
                JOIN peak_month p
                    ON p.id_produk = m.id_produk
                AND p.id_ware = m.id_ware
                AND p.peak_sales_utama = m.total_qty
            )

            SELECT
                o.id_produk,
                o.id_ware,
                o.size,
                SUM(o.qty) AS qty,
                pm.peak_sales_utama
            FROM tb_order o
            JOIN peak_month_selected pm
                ON pm.id_produk = o.id_produk
            AND pm.id_ware = o.id_ware
            AND DATE_FORMAT(o.tanggal_order, '%Y-%m') = pm.ym
            GROUP BY
                o.id_produk,
                o.id_ware,
                o.size;
            `, [
                startDate, endDate,
                startDate, endDate
            ]);

            // ============================
            // 1️⃣ LOOP DATA RAW PER SIZE
            // ============================
            peakUtamaRows.forEach(r => {
                const key = `${r.id_produk}_${r.id_ware}`;

                peakSalesUtamaMap[key] = Number(r.peak_sales_utama) || 0;

                if (!peakSalesUtamaVariationMap[key]) {
                    peakSalesUtamaVariationMap[key] = {
                        list: [],
                        total: 0
                    };
                }

                const qty = Number(r.qty) || 0;

                peakSalesUtamaVariationMap[key].list.push({
                    size: r.size,
                    qty
                });

                peakSalesUtamaVariationMap[key].total += qty;
            });

            // ============================
            // 2️⃣ NORMALISASI KE TOTAL PEAK
            // ============================
            Object.keys(peakSalesUtamaVariationMap).forEach(key => {

                const totalVariationQty =
                    peakSalesUtamaVariationMap[key].total;

                const target =
                    peakSalesUtamaMap[key];

                // safety
                if (!totalVariationQty || !target) return;

                peakSalesUtamaVariationMap[key].list =
                    peakSalesUtamaVariationMap[key].list.map(v => ({
                        ...v,
                        qty: Math.round(
                            (v.qty / totalVariationQty) * target
                        )
                    }));

                peakSalesUtamaVariationMap[key].total =
                    peakSalesUtamaVariationMap[key].list.reduce(
                        (s, v) => s + v.qty,
                        0
                    );
            });
        }


        const map = {};

        rows.forEach(r => {
            const key = `${r.id_produk}_${r.id_ware}`;

            if (!map[key]) {
                map[key] = {
                    id_produk: r.id_produk,
                    id_ware: r.id_ware,
                    produk: r.produk,
                    warehouse: r.warehouse,
                    stock: r.stock,
                    // ✅ TETAP LOGIC LAMA
                    peak_sales: Number(r.peak_sales) || 0,

                    // ✅ KHUSUS DATE RANGE
                    peak_sales_utama: peakSalesUtamaMap[key] || 0,
                    peak_sales_utama_variation: peakSalesUtamaVariationMap[key] || { list: [], total: 0 },

                    // ✅ TAMBAHAN BARU
                    Rincian_variasi: variationMap[key] || { list: [], total: 0 },
                    Rincian_variasi_sold: variationSoldMap[key] || { list: [], total: 0 },
                    spk: {},
                    spkUTAMA: {},
                    arrival_stok: {}
                };
            }

            if (r.spk_nama) {

                if (!map[key].spk[r.spk_nama]) {
                    map[key].spk[r.spk_nama] = {
                        id_spk: r.id_spk,
                        created_at: r.spk_created_at,
                        totalqty: 0,
                        Variasi_list: {}
                    };
                }

                const supplierKey = String(r.spk_id_sup || "NO_SUPPLIER");

                if (!map[key].spk[r.spk_nama].Variasi_list[supplierKey]) {
                    map[key].spk[r.spk_nama].Variasi_list[supplierKey] = {
                        id_spk: r.id_spk,
                        id_sup: r.spk_id_sup || null,
                        supplier: r.spk_supplier || null,
                        totalqty: Number(r.spk_qty) || 0,
                        harga: r.spk_harga != null ? Number(r.spk_harga) : null,
                        id_spk_detail: r.spk_id_spk_detail || null,
                        created_at: r.spk_created_at,
                        list: [],
                        total: 0
                    };

                    map[key].spk[r.spk_nama].totalqty += Number(r.spk_qty) || 0;
                }

                // ✅ isi arrival stok per kolom PO (spk_nama), nested per supplier
                // bentuk: arrival_stok[spk_nama][id_sup] = { list, total }
                if (!map[key].arrival_stok[r.spk_nama]) {
                    map[key].arrival_stok[r.spk_nama] = {};
                }
                const arrivalSupKey = String(r.spk_id_sup || "NO_SUPPLIER");
                if (!map[key].arrival_stok[r.spk_nama][arrivalSupKey]) {
                    const arrivalObj =
                        arrivalCacheBySpkName?.[r.spk_nama]?.[key]?.[arrivalSupKey] || { list: [], total: 0 };
                    map[key].arrival_stok[r.spk_nama][arrivalSupKey] = arrivalObj;
                }

                // ✅ isi size per supplier
                if (r.spk_size) {
                    const qty = Number(r.spk_size_qty) || 0;

                    const exist = map[key]
                        .spk[r.spk_nama]
                        .Variasi_list[supplierKey]
                        .list
                        .find(v => v.size === r.spk_size);

                    if (!exist) {
                        map[key].spk[r.spk_nama].Variasi_list[supplierKey].list.push({ size: r.spk_size, qty });
                        map[key].spk[r.spk_nama].Variasi_list[supplierKey].total += qty;
                    }
                }
            }

            if (r.spk_utama_nama) {
                map[key].spkUTAMA[r.spk_utama_nama] = {
                    id_spk: r.spk_utama_id,
                    qty: Number(r.spk_utama_qty) || 0,
                    created_at: r.spk_utama_created_at   // ✅ BENAR
                };
            }
        });

        return {
            multiplier,
            data: Object.values(map)
        };

    } catch (error) {
        console.error("get_spk error:", error);
        throw error;
    } finally {
        connection.release();
    }
};

const create_column_spk = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const nama = body?.nama?.trim();
        const warehouse = body?.warehouse;

        if (!nama) throw new Error("Nama PO wajib diisi");
        if (!warehouse) throw new Error("Warehouse wajib diisi");

        // 1️⃣ CEK DUPLIKAT NAMA SPK DI WAREHOUSE
        const [cek] = await connection.query(
            `SELECT 1 FROM tb_spk WHERE nama = ? AND id_ware = ? LIMIT 1`,
            [nama, warehouse]
        );

        // if (cek.length > 0) {
        //     throw new Error("Nama SPK sudah ada di warehouse ini");
        // }

        // 2️⃣ AMBIL SEMUA SUPPLIER
        const [supplierRows] = await connection.query(
            `
            SELECT id_sup
            FROM tb_supplier
            ORDER BY id ASC
            `
        );

        if (supplierRows.length === 0) {
            throw new Error("Data supplier tidak ditemukan");
        }

        // 3️⃣ GENERATE id_spk BARU
        const newIdSpk = uuidv4();

        // 4️⃣ INSERT SEMUA PRODUK DI WAREHOUSE TERSEBUT x SEMUA SUPPLIER
        let totalInserted = 0;

        for (const supplier of supplierRows) {
            const [result] = await connection.query(
                `
                INSERT INTO tb_spk (id_spk, nama, qty, id_produk, id_ware, id_sup, id_spk_detail)
                SELECT
                    ?,
                    ?,
                    0,
                    p.id_produk,
                    p.id_ware,
                    ?,
                    NULL
                FROM tb_produk p
                WHERE p.id_ware = ?
                `,
                [newIdSpk, nama, supplier.id_sup, warehouse]
            );

            totalInserted += Number(result.affectedRows) || 0;
        }

        await connection.commit();

        return {
            success: true,
            message: "Kolom PO berhasil dibuat",
            data: {
                id_spk: newIdSpk,
                nama,
                warehouse,
                total_supplier: supplierRows.length,
                total_row: totalInserted
            }
        };

    } catch (error) {
        await connection.rollback();
        console.error("create_column_spk error:", error);

        return {
            success: false,
            message: error.message || "Terjadi kesalahan server"
        };
    } finally {
        connection.release();
    }
};

const edit_qty_spk = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            id_spk,
            id_sup,
            spk_nama,
            id_produk,
            id_ware,
            qty,
            variations,
            id_spk_detail,
        } = body;

        const spkDetail = id_spk_detail || null;

        if (!id_produk || !id_ware || !spk_nama || !id_sup) {
            throw new Error("Parameter tidak lengkap");
        }

        let spkId = id_spk;

        // =====================================================
        // 1️⃣ AMBIL HEADER SPK SESUAI SUPPLIER JIKA BELUM ADA
        // =====================================================
        if (!spkId) {
            const [rows] = await connection.query(
                `
                SELECT id_spk
                FROM tb_spk
                WHERE nama = ?
                  AND id_produk = ?
                  AND id_ware = ?
                  AND id_sup = ?
                LIMIT 1
                `,
                [spk_nama, id_produk, id_ware, id_sup]
            );

            if (rows.length === 0) {
                spkId = uuidv4();

                await connection.query(
                    `
                    INSERT INTO tb_spk
                    (id_spk, nama, qty, id_produk, id_ware, id_sup, id_spk_detail)
                    VALUES (?, ?, 0, ?, ?, ?, NULL)
                    `,
                    [spkId, spk_nama, id_produk, id_ware, id_sup]
                );
            } else {
                spkId = rows[0].id_spk;
            }
        }

        // =====================================================
        // 2️⃣ MODE SIZE
        // =====================================================
        if (Array.isArray(variations)) {
            await connection.query(
                `
                DELETE FROM tb_spk_list
                WHERE id_spk = ?
                  AND id_produk = ?
                  AND id_ware = ?
                  AND id_sup = ?
                `,
                [spkId, id_produk, id_ware, id_sup]
            );

            let totalQty = 0;

            for (const v of variations) {
                const qtyVal = Number(v.qty) || 0;
                totalQty += qtyVal;

                await connection.query(
                    `
                    INSERT INTO tb_spk_list
                    (id_spk, id_produk, id_ware, id_sup, size, qty, id_spk_detail)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,
                    [spkId, id_produk, id_ware, id_sup, v.size, qtyVal, spkDetail]
                );
            }

            await connection.query(
                `
                UPDATE tb_spk
                SET qty = ?, id_spk_detail = ?, updated_at = NOW()
                WHERE id_spk = ?
                  AND id_produk = ?
                  AND id_ware = ?
                  AND id_sup = ?
                `,
                [totalQty, spkDetail, spkId, id_produk, id_ware, id_sup]
            );
        }

        // =====================================================
        // 3️⃣ MODE TANPA SIZE
        // =====================================================
        else {
            await connection.query(
                `
                UPDATE tb_spk
                SET qty = ?, id_spk_detail = ?, updated_at = NOW()
                WHERE id_spk = ?
                  AND id_produk = ?
                  AND id_ware = ?
                  AND id_sup = ?
                `,
                [Number(qty) || 0, spkDetail, spkId, id_produk, id_ware, id_sup]
            );
        }

        await connection.commit();

        return {
            success: true,
            message: "SPK berhasil diperbarui",
            data: {
                id_spk: spkId,
                id_sup,
                id_produk,
                id_ware,
                spk_nama
            }
        };

    } catch (error) {
        await connection.rollback();
        console.error("edit_qty_spk error:", error);

        return {
            success: false,
            message: error.message
        };
    } finally {
        connection.release();
    }
};

const edit_spk_name = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const { id_spk, nama } = body;

        if (!id_spk || !nama?.trim()) {
            throw new Error("Parameter tidak lengkap");
        }

        // ❗️Cegah nama duplikat
        const [cek] = await connection.query(
            `SELECT 1 FROM tb_spk WHERE nama = ? AND id_spk != ? LIMIT 1`,
            [nama, id_spk]
        );

        if (cek.length > 0) {
            throw new Error("Nama PO sudah digunakan");
        }

        const [res] = await connection.query(
            `
            UPDATE tb_spk
            SET nama = ?, updated_at = NOW()
            WHERE id_spk = ?
            `,
            [nama.trim(), id_spk]
        );

        await connection.commit();

        return {
            success: true,
            message: "Nama PO berhasil diubah",
            affected: res.affectedRows
        };
    } catch (err) {
        await connection.rollback();
        return {
            success: false,
            message: err.message
        };
    } finally {
        connection.release();
    }
};

const delete_spk = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();


        const { id_spk } = body;
        if (!id_spk) throw new Error("id_spk wajib");

        // 1. Delete from tb_spk_list
        await connection.query(
            `DELETE FROM tb_spk_list WHERE id_spk = ?`,
            [id_spk]
        );

        // 2. Delete from tb_spk_reject
        await connection.query(
            `DELETE FROM tb_spk_reject WHERE id_spk = ?`,
            [id_spk]
        );

        // 3. Delete from tb_spk_payment
        await connection.query(
            `DELETE FROM tb_spk_payment WHERE id_spk = ?`,
            [id_spk]
        );

        // 4. Delete from tb_spk
        const [res] = await connection.query(
            `DELETE FROM tb_spk WHERE id_spk = ?`,
            [id_spk]
        );

        await connection.commit();

        return {
            success: true,
            message: "PO berhasil dihapus permanen",
            affected: res.affectedRows
        };
    } catch (err) {
        await connection.rollback();
        return {
            success: false,
            message: err.message
        };
    } finally {
        connection.release();
    }
};

/**
 * delete_spk_temp — soft delete PO (sembunyikan dari frontend, data tetap di DB)
 * body: { id_spk }
 */
const delete_spk_temp = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const { id_spk } = body;
        if (!id_spk) throw new Error("id_spk wajib");

        await connection.query(
            `UPDATE tb_spk SET is_deleted = 1 WHERE id_spk = ?`,
            [id_spk]
        );

        await connection.commit();

        return {
            success: true,
            message: "PO berhasil disembunyikan (temporary delete)"
        };
    } catch (err) {
        await connection.rollback();
        return {
            success: false,
            message: err.message
        };
    } finally {
        connection.release();
    }
};

const edit_qty_spk_utama = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const { id_produk, id_ware, nama, qty } = body;

        // ✅ VALIDASI
        if (!id_produk || !id_ware || !nama) {
            throw new Error("Parameter tidak lengkap");
        }

        // ✅ UPDATE QTY
        const [result] = await connection.query(
            `
            UPDATE tb_spk_utama
            SET qty = ?, updated_at = NOW()
            WHERE id_produk = ?
              AND id_ware = ?
              AND nama = ?
            `,
            [qty ?? 0, id_produk, id_ware, nama]
        );

        // ⚠️ Optional: cek jika row tidak ditemukan
        if (result.affectedRows === 0) {
            throw new Error("Data PO Utama tidak ditemukan");
        }

        await connection.commit();

        return {
            success: true,
            message: "Qty PO Utama berhasil diperbarui",
            affected: result.affectedRows
        };

    } catch (err) {
        await connection.rollback();
        console.error("edit_qty_spk_utama error:", err);

        return {
            success: false,
            message: err.message || "Gagal update qty PO Utama"
        };

    } finally {
        connection.release();
    }
};

const x_month = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const { id_spk_month, multiplier } = body;

        // ============================
        // VALIDASI
        // ============================
        if (!id_spk_month) {
            throw new Error("id_spk_month wajib dikirim");
        }

        if (multiplier === undefined || multiplier === null) {
            throw new Error("multiplier wajib diisi");
        }

        const multiplierValue = Number(multiplier);

        if (isNaN(multiplierValue) || multiplierValue <= 0) {
            throw new Error("Multiplier harus angka lebih dari 0");
        }

        // ============================
        // UPDATE MULTIPLIER
        // ============================
        const [result] = await connection.query(
            `
            UPDATE spk_month
            SET 
                multiplier = ?,
                updated_at = NOW()
            WHERE id_spk_month = ?
            `,
            [multiplierValue, id_spk_month]
        );

        if (result.affectedRows === 0) {
            throw new Error("Data multiplier tidak ditemukan");
        }

        await connection.commit();

        return {
            success: true,
            message: "Multiplier berhasil diperbarui",
            data: {
                id_spk_month,
                multiplier: multiplierValue
            }
        };

    } catch (err) {
        await connection.rollback();

        console.error("x_month error:", err);

        return {
            success: false,
            message: err.message || "Gagal update multiplier"
        };
    } finally {
        connection.release();
    }
};

const getwarehouseSPK = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        await connection.beginTransaction();

        const [data_role] = await connection.query(
            `SELECT * FROM tb_karyawan WHERE role='${body.role}'`
        );

        if (body.role === 'SUPER-ADMIN') {
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse`
            );
        } else if (body.role === 'HEAD-AREA') {
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_area='${body.area} '`
            );
        } else if (body.role === 'HEAD-WAREHOUSE') {
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_ware='${body.area}'`
            );
        } else {
            var [data_store] = await connection.query(
                `SELECT id_ware FROM tb_store WHERE id_store='${body.area}'`
            );
            var [data_warehouse] = await connection.query(
                `SELECT * FROM tb_warehouse WHERE id_ware='${data_store[0].id_ware}'`
            );
        }

        await connection.commit();
        await connection.release();

        return data_warehouse;
    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const save_dateSelected = async (body) => {
    const connection = await dbPool.getConnection();

    const tanggal = date.format(new Date(), "YYYY-MM-DD HH:mm:ss");

    try {
        await connection.beginTransaction();

        const { dateSelected } = body;

        if (!dateSelected) {
            throw new Error("dateSelected wajib dikirim");
        }

        // 🔥 OPTIONAL:
        // hapus data lama → supaya cuma 1 date aktif
        await connection.query(
            `DELETE FROM tb_spk_date`
        );

        // ✅ INSERT DATE RANGE BARU
        await connection.query(
            `
            INSERT INTO tb_spk_date
            (dateSelected)
            VALUES (?)
            `,
            [
                dateSelected
            ]
        );

        await connection.commit();
        await connection.release();

        // ✅ RETURN KE FRONTEND
        return {
            success: true,
            message: "Tanggal SPK berhasil disimpan",
            data: {
                dateSelected
            }
        };

    } catch (error) {
        await connection.rollback();
        await connection.release();

        return {
            success: false,
            message: error.message || "Gagal menyimpan tanggal"
        };
    }
};

const getSelectedDate = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        // 🔍 ambil tanggal terakhir
        const [[row]] = await connection.query(`
            SELECT dateSelected
            FROM tb_spk_date
            ORDER BY id DESC
            LIMIT 1
        `);

        await connection.commit();
        await connection.release();

        // ✅ jika tidak ada data
        if (!row || !row.dateSelected) {
            return {
                success: true,
                dateSelected: null
            };
        }

        // ✅ jika ada data
        return {
            success: true,
            dateSelected: row.dateSelected
        };

    } catch (error) {
        console.error("getSelectedDate error:", error);
        await connection.release();

        return {
            success: false,
            dateSelected: null,
            message: error.message
        };
    }
};

const getProduction = async (body) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(`
            SELECT 
                id_spk,
                nama,
                SUM(qty) AS qty,
                id_ware,
                MAX(created_at) AS created_at,
                MAX(updated_at) AS updated_at
            FROM tb_spk
            GROUP BY id_spk, nama, id_ware
            ORDER BY created_at DESC
        `);

        await connection.commit();
        await connection.release();

        return {
            success: true,
            data_production: rows
        };

    } catch (error) {
        console.error("getProduction error:", error);
        await connection.rollback();
        await connection.release();

        return {
            success: false,
            data: [],
            message: error.message
        };
    }
};


// ================================================================
// PAYMENT & REJECT FUNCTIONS
// ================================================================

/**
 * save_spk_harga — simpan harga satuan ke tb_spk
 * body: { id_spk, id_produk, id_ware, id_sup, harga }
 */
const save_spk_harga = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.query(
            `UPDATE tb_spk
             SET harga = ?
             WHERE id_spk = ? AND id_produk = ? AND id_ware = ? AND id_sup = ?`,
            [
                Number(body.harga) || 0,
                body.id_spk,
                body.id_produk,
                body.id_ware,
                body.id_sup,
            ]
        );
        return { success: true, message: "Harga berhasil disimpan" };
    } catch (error) {
        console.error("save_spk_harga error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * get_spk_payment_summary — summary payment + reject untuk 1 PO (id_spk)
 * body: { id_spk }
 * Returns:
 *   products[]   — detail produk dengan qty, harga, subtotal, total_reject, net_subtotal
 *   rejects[]    — detail reject per produk per size
 *   payments[]   — history pembayaran
 *   totalBruto, totalRejectAmount, totalBayar, totalSudahBayar, sisaBayar
 */
const get_spk_payment_summary = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        // 1. Produk di PO ini — qty dari tb_purchaseorder tipe_order='RESTOCK'
        //    Harga diambil dari tb_spk (sudah di-update saat restock)
        //    Sort by tanggal masuk (tanggal_receive terbaru dari restock)
        const [spkRows] = await connection.query(
            `SELECT
                s.id_produk,
                s.id_ware,
                s.id_sup,
                s.id_spk_detail,
                COALESCE(sup.supplier, s.id_sup, '-')              AS supplier,
                COALESCE(SUM(po.qty), 0)                           AS qty,
                COALESCE(s.harga, 0)                               AS harga,
                (COALESCE(SUM(po.qty), 0) * COALESCE(s.harga, 0)) AS subtotal,
                COALESCE(p.produk, s.id_produk)                    AS produk,
                MAX(po.tanggal_receive)                             AS last_restock_date
             FROM tb_spk s
             LEFT JOIN tb_supplier sup
                    ON sup.id_sup   = s.id_sup
             LEFT JOIN tb_produk p
                    ON p.id_produk  = s.id_produk
                   AND p.id_ware    = s.id_ware
             LEFT JOIN tb_purchaseorder po
                    ON po.id_spk    = s.id_spk
                   AND po.id_produk = s.id_produk
                   AND po.id_ware   = s.id_ware
                   AND po.id_sup    = s.id_sup
                   AND po.tipe_order = 'RESTOCK'
             WHERE s.id_spk = ?
             GROUP BY s.id_produk, s.id_ware, s.id_sup, s.id_spk_detail, sup.supplier, s.harga, p.produk
             HAVING qty > 0
             ORDER BY sup.supplier ASC, MAX(po.tanggal_receive) DESC, p.produk ASC`,
            [body.id_spk]
        );

        // 2. Reject per (id_produk, id_ware, id_sup, size) — hanya status SUDAH DIKIRIM
        const [rejectRows] = await connection.query(
            `SELECT
                id_reject, id_produk, id_ware, id_sup, size,
                qty_reject, keterangan, created_at
             FROM tb_spk_reject
             WHERE id_spk = ? AND status = 'SUDAH DIKIRIM'
             ORDER BY id_sup, id_produk, size`,
            [body.id_spk]
        );

        // 3. Payment per supplier — qualify kolom id_sup dengan alias tabel
        const [payments] = await connection.query(
            `SELECT
                p.id_payment,
                p.id_sup,
                COALESCE(sup.supplier, p.id_sup, '-') AS supplier,
                p.jumlah_bayar,
                p.tanggal_bayar,
                p.keterangan,
                p.users,
                p.created_at
             FROM tb_spk_payment p
             LEFT JOIN tb_supplier sup ON sup.id_sup = p.id_sup
             WHERE p.id_spk = ?
             ORDER BY p.created_at DESC`,
            [body.id_spk]
        );

        // 4. Kumpulkan daftar supplier unik dari produk (hanya yang qty > 0)
        const supplierMap = {};
        spkRows.forEach((r) => {
            if (!supplierMap[r.id_sup]) {
                supplierMap[r.id_sup] = r.supplier;
            }
        });

        // 5. Bangun struktur per supplier
        let grandBruto = 0;
        let grandReject = 0;
        let grandBayar = 0;
        let grandSudah = 0;

        const suppliersData = Object.entries(supplierMap).map(([id_sup, supplierName]) => {
            // produk supplier ini
            const supProducts = spkRows.filter((r) => r.id_sup === id_sup);

            // reject supplier ini — per (id_produk, id_ware)
            const supRejects = rejectRows.filter((r) => r.id_sup === id_sup);
            const rejectByProduk = {};
            supRejects.forEach((r) => {
                const key = `${r.id_produk}_${r.id_ware}`;
                rejectByProduk[key] = (rejectByProduk[key] || 0) + Number(r.qty_reject || 0);
            });

            // attach reject ke produk
            let totalBruto = 0;
            let totalRejectAmount = 0;
            const products = supProducts.map((r) => {
                const key = `${r.id_produk}_${r.id_ware}`;
                const rejectQty = rejectByProduk[key] || 0;
                const rejectAmount = rejectQty * Number(r.harga || 0);
                const netSubtotal = Number(r.subtotal || 0) - rejectAmount;
                totalBruto += Number(r.subtotal || 0);
                totalRejectAmount += rejectAmount;
                return { ...r, subtotal: Number(r.subtotal), rejectQty, rejectAmount, netSubtotal, last_restock_date: r.last_restock_date || null };
            });

            // payment supplier ini
            const supPayments = payments.filter((p) => p.id_sup === id_sup);
            const totalSudahBayar = supPayments.reduce((s, p) => s + Number(p.jumlah_bayar || 0), 0);
            const totalBayar = totalBruto - totalRejectAmount;
            const sisaBayar = totalBayar - totalSudahBayar;

            grandBruto += totalBruto;
            grandReject += totalRejectAmount;
            grandBayar += totalBayar;
            grandSudah += totalSudahBayar;

            return {
                id_sup,
                supplier: supplierName,
                products,
                rejects: supRejects,
                payments: supPayments,
                totalBruto,
                totalRejectAmount,
                totalBayar,
                totalSudahBayar,
                sisaBayar,
            };
        });

        return {
            success: true,
            data: {
                suppliers: suppliersData,
                grandBruto,
                grandReject,
                grandBayar,
                grandSisa: grandBayar - grandSudah,
                grandSudah,
            },
        };
    } catch (error) {
        console.error("get_spk_payment_summary error:", error);
        return { success: false, message: error.message, data: null };
    } finally {
        connection.release();
    }
};

/**
 * get_supplier_payment_list — list semua supplier dengan total payment (ganti get_spk_list per supplier)
 * body: { id_ware }
 */
const get_supplier_payment_list = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        const id_ware = body.id_ware || null;
        const wareCondition = id_ware && id_ware !== 'all' ? `AND s.id_ware = ?` : '';
        const params = id_ware && id_ware !== 'all' ? [id_ware] : [];

        // Semua produk per supplier dengan qty dari purchaseorder RESTOCK
        const [prodRows] = await connection.query(`
            SELECT
                s.id_sup,
                COALESCE(sup.supplier, s.id_sup, '-') AS supplier,
                w.warehouse,
                COUNT(DISTINCT s.id_spk) AS total_spk,
                COALESCE(SUM(po.qty), 0) AS total_qty,
                COALESCE(SUM(po.qty * COALESCE(s.harga, 0)), 0) AS total_bruto
            FROM tb_spk s
            LEFT JOIN tb_supplier sup ON sup.id_sup = s.id_sup
            LEFT JOIN tb_warehouse w ON w.id_ware = s.id_ware
            LEFT JOIN tb_purchaseorder po
                ON po.id_spk = s.id_spk AND po.id_produk = s.id_produk
                AND po.id_ware = s.id_ware AND po.id_sup = s.id_sup
                AND po.tipe_order = 'RESTOCK'
            WHERE (s.is_deleted IS NULL OR s.is_deleted = 0)
            ${wareCondition}
            GROUP BY s.id_sup, sup.supplier, w.warehouse
            HAVING total_qty > 0
            ORDER BY sup.supplier ASC
        `, params);

        // Reject yang sudah dikirim — per supplier
        // UNION dari tb_spk_reject + tb_defect — CONVERT + COLLATE agar seragam
        const [rejectRows] = await connection.query(`
            SELECT CONVERT(r.id_sup USING utf8mb4) COLLATE utf8mb4_general_ci AS id_sup,
                   CAST(r.qty_reject AS SIGNED)    AS qty_reject,
                   COALESCE(s.harga, 0)            AS harga
            FROM tb_spk_reject r
            LEFT JOIN tb_spk s ON s.id_spk = r.id_spk AND s.id_produk = r.id_produk
                AND s.id_ware = r.id_ware AND s.id_sup = r.id_sup
            WHERE r.id_sup IS NOT NULL
              AND r.status IN ('SUDAH DIKIRIM', 'SUDAH DIKIRIM KE VENDOR')
            UNION ALL
            SELECT CONVERT(po.id_sup USING utf8mb4) COLLATE utf8mb4_general_ci AS id_sup,
                   CAST(d.qty AS SIGNED)             AS qty_reject,
                   COALESCE(NULLIF(d.harga, 0), d.m_price, 0) AS harga
            FROM tb_defect d
            INNER JOIN tb_purchaseorder po ON po.idpo = d.idpo_old
            WHERE po.id_sup IS NOT NULL
              AND d.status IN ('SUDAH DIKIRIM', 'SUDAH DIKIRIM KE VENDOR')
        `);

        // Payment per supplier
        const [paymentRows] = await connection.query(`
            SELECT id_sup, COALESCE(SUM(jumlah_bayar), 0) AS sudah_bayar
            FROM tb_spk_payment
            GROUP BY id_sup
        `);

        const rejectBySup = {};
        rejectRows.forEach(r => {
            rejectBySup[r.id_sup] = (rejectBySup[r.id_sup] || 0) + (Number(r.qty_reject || 0) * Number(r.harga || 0));
        });

        const payBySup = {};
        paymentRows.forEach(p => {
            payBySup[p.id_sup] = Number(p.sudah_bayar || 0);
        });

        const data = prodRows.map(row => {
            const totalBruto = Number(row.total_bruto || 0);
            const totalReject = rejectBySup[row.id_sup] || 0;
            const netBayar = totalBruto - totalReject;
            const sudahBayar = payBySup[row.id_sup] || 0;
            const sisaBayar = netBayar - sudahBayar;
            return {
                id_sup: row.id_sup,
                supplier: row.supplier,
                warehouse: row.warehouse,
                total_spk: Number(row.total_spk || 0),
                total_qty: Number(row.total_qty || 0),
                total_bruto: totalBruto,
                total_reject: totalReject,
                net_bayar: netBayar,
                sudah_bayar: sudahBayar,
                sisa_bayar: sisaBayar,
            };
        });

        return { success: true, data };
    } catch (error) {
        console.error('get_supplier_payment_list error:', error);
        return { success: false, data: [], message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * get_supplier_payment_detail — detail per supplier: semua produk lintas id_spk + reject + payment
 * body: { id_sup }
 * Reject hanya yang status = SUDAH DIKIRIM / SUDAH DIKIRIM KE VENDOR
 */
const get_supplier_payment_detail = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        if (!body.id_sup) throw new Error('id_sup wajib');
        const id_sup = body.id_sup;

        // ── 1. Semua produk supplier ini lintas id_spk ──────────────────────
        const [spkRows] = await connection.query(`
            SELECT
                s.id_spk,
                s.nama AS spk_nama,
                s.id_produk,
                s.id_ware,
                s.id_sup,
                s.id_spk_detail,
                COALESCE(sup.supplier, s.id_sup, '-') AS supplier,
                COALESCE(SUM(po.qty), 0)              AS qty,
                COALESCE(s.harga, 0)                  AS harga,
                COALESCE(p.produk, s.id_produk)       AS produk,
                MAX(po.tanggal_receive)                AS last_restock_date
            FROM tb_spk s
            LEFT JOIN tb_supplier sup ON sup.id_sup = s.id_sup
            LEFT JOIN tb_produk p     ON p.id_produk = s.id_produk AND p.id_ware = s.id_ware
            LEFT JOIN tb_purchaseorder po
                ON po.id_spk = s.id_spk AND po.id_produk = s.id_produk
                AND po.id_ware = s.id_ware AND po.id_sup = s.id_sup
                AND po.tipe_order = 'RESTOCK'
            WHERE s.id_sup = ?
              AND (s.is_deleted IS NULL OR s.is_deleted = 0)
            GROUP BY s.id_spk, s.nama, s.id_produk, s.id_ware, s.id_sup,
                     s.id_spk_detail, sup.supplier, s.harga, p.produk
            HAVING qty > 0
            ORDER BY s.id_spk_detail DESC, p.produk ASC
        `, [id_sup]);

        // ── 2. Defect qty dari tb_defect (untuk Final Qty = Qty - defect) ───
        const [defectRows] = await connection.query(`
            SELECT
                po.id_spk,
                po.id_produk,
                po.id_ware,
                SUM(d.qty) AS defect_qty
            FROM tb_defect d
            INNER JOIN tb_purchaseorder po ON po.idpo = d.idpo_old
            WHERE po.id_sup = ?
              AND d.status IN ('SUDAH DIKIRIM', 'SUDAH DIKIRIM KE VENDOR')
            GROUP BY po.id_spk, po.id_produk, po.id_ware
        `, [id_sup]);

        // ── 3. Reject nominal dari tb_spk_reject (deduct dari Subtotal) ─────
        const [rejectRows] = await connection.query(`
            SELECT
                r.id_spk, r.id_produk, r.id_ware, r.size,
                CAST(r.qty_reject AS SIGNED) AS qty_reject,
                COALESCE(s.harga, 0)         AS harga
            FROM tb_spk_reject r
            LEFT JOIN tb_spk s ON s.id_spk = r.id_spk AND s.id_produk = r.id_produk
                AND s.id_ware = r.id_ware AND s.id_sup = r.id_sup
            WHERE r.id_sup = ?
              AND r.status IN ('SUDAH DIKIRIM', 'SUDAH DIKIRIM KE VENDOR')
        `, [id_sup]);

        // ── 4. Payment ───────────────────────────────────────────────────────
        const [payments] = await connection.query(`
            SELECT p.id_payment, p.id_spk, p.id_sup,
                   p.jumlah_bayar, p.tanggal_bayar, p.keterangan, p.users, p.created_at
            FROM tb_spk_payment p
            WHERE p.id_sup = ?
            ORDER BY p.created_at DESC
        `, [id_sup]);

        // ── 5. Reject history — per produk per tanggal (untuk Rincian Reject) ─────
        const [rejectHistory] = await connection.query(`
            SELECT
                r.id_spk,
                r.id_produk,
                r.id_ware,
                r.keterangan,
                COALESCE(p.produk, r.id_produk)  AS produk_name,
                COALESCE(s.id_spk_detail, '–')   AS id_spk_detail,
                r.tanggal_dikirim,
                SUM(CAST(r.qty_reject AS SIGNED)) AS total_qty,
                COALESCE(s.harga, 0)              AS harga,
                SUM(COALESCE(r.subtotal, CAST(r.qty_reject AS SIGNED) * COALESCE(s.harga, 0))) AS total_nominal
            FROM tb_spk_reject r
            LEFT JOIN tb_spk s  ON s.id_spk = r.id_spk AND s.id_produk = r.id_produk
                                AND s.id_ware = r.id_ware AND s.id_sup = r.id_sup
            LEFT JOIN tb_produk p ON p.id_produk = r.id_produk AND p.id_ware = r.id_ware
            WHERE r.id_sup = ?
              AND r.status IN ('SUDAH DIKIRIM', 'SUDAH DIKIRIM KE VENDOR')
            GROUP BY r.id_spk, r.id_produk, r.id_ware, r.keterangan, p.produk,
                     s.id_spk_detail, s.harga, r.tanggal_dikirim
            ORDER BY r.tanggal_dikirim DESC
        `, [id_sup]);

        // ── Build defect map: key → total defect qty ─────────────────────────
        const defectMap = {};
        defectRows.forEach(d => {
            const key = `${d.id_spk}_${d.id_produk}_${d.id_ware}`;
            defectMap[key] = (defectMap[key] || 0) + Number(d.defect_qty || 0);
        });

        // ── Build reject nominal map: key → { qty, amount, sizes } ──────────
        const rejectMap = {};
        rejectRows.forEach(r => {
            const key = `${r.id_spk}_${r.id_produk}_${r.id_ware}`;
            if (!rejectMap[key]) rejectMap[key] = { qty: 0, amount: 0, sizes: [] };
            rejectMap[key].qty += Number(r.qty_reject || 0);
            rejectMap[key].amount += Number(r.qty_reject || 0) * Number(r.harga || 0);
            if (r.size) rejectMap[key].sizes.push({ size: r.size, qty_reject: Number(r.qty_reject) });
        });

        // ── Build products with new calc ─────────────────────────────────────
        let grandBruto = 0;
        let grandDefectAmount = 0;
        let grandRejectNominal = 0;

        const products = spkRows.map(r => {
            const key = `${r.id_spk}_${r.id_produk}_${r.id_ware}`;
            const qty = Number(r.qty || 0);
            const harga = Number(r.harga || 0);
            const defectQty = defectMap[key] || 0;
            const rj = rejectMap[key] || { qty: 0, amount: 0, sizes: [] };

            const finalQty = Math.max(0, qty - defectQty);
            const bruto = qty * harga;           // original (sebelum potongan)
            const subtotal = finalQty * harga;      // setelah potong defect
            const rejectNominal = rj.amount;             // potongan dari tb_spk_reject
            const netSubtotal = subtotal - rejectNominal;

            grandBruto += bruto;
            grandDefectAmount += defectQty * harga;
            grandRejectNominal += rejectNominal;

            return {
                id_spk: r.id_spk,
                spk_nama: r.spk_nama,
                id_spk_detail: r.id_spk_detail,
                id_produk: r.id_produk,
                id_ware: r.id_ware,
                id_sup: r.id_sup,
                produk: r.produk,
                last_restock_date: r.last_restock_date,
                qty,
                harga,
                defectQty,
                finalQty,
                bruto,
                subtotal,
                rejectNominal,
                rejectSizes: rj.sizes,
                netSubtotal,
            };
        });

        const grandSubtotal = grandBruto - grandDefectAmount;
        const grandBayar = grandSubtotal - grandRejectNominal;
        const totalSudahBayar = payments.reduce((s, p) => s + Number(p.jumlah_bayar || 0), 0);
        const grandSisa = grandBayar - totalSudahBayar;

        return {
            success: true,
            data: {
                id_sup,
                products,
                payments,
                rejects: rejectHistory,
                grandBruto,
                grandDefectAmount,
                grandSubtotal,
                grandRejectNominal,
                grandBayar,
                totalSudahBayar,
                grandSisa,
            },
        };
    } catch (error) {
        console.error('get_supplier_payment_detail error:', error);
        return { success: false, data: null, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * add_spk_payment — tambah pembayaran ke supplier tertentu
 * body: { id_spk (optional), id_sup, jumlah_bayar, tanggal_bayar, keterangan, users }
 */
const add_spk_payment = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        if (!body.id_sup) throw new Error("id_sup (supplier) wajib diisi");
        if (!body.jumlah_bayar || Number(body.jumlah_bayar) <= 0)
            throw new Error("Jumlah bayar harus lebih dari 0");

        const id_payment = uuidv4();
        const id_spk_val = body.id_spk || null;
        await connection.query(
            `INSERT INTO tb_spk_payment
                (id_payment, id_spk, id_sup, jumlah_bayar, tanggal_bayar, keterangan, users)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id_payment,
                id_spk_val,
                body.id_sup,
                Number(body.jumlah_bayar),
                body.tanggal_bayar || null,
                body.keterangan || null,
                body.users || null,
            ]
        );

        return { success: true, message: "Pembayaran berhasil ditambahkan", id_payment };
    } catch (error) {
        console.error("add_spk_payment error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * delete_spk_payment — hapus satu payment record
 * body: { id_payment }
 */
const delete_spk_payment = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        if (!body.id_payment) throw new Error("id_payment wajib diisi");
        await connection.query(
            `DELETE FROM tb_spk_payment WHERE id_payment = ?`,
            [body.id_payment]
        );
        return { success: true, message: "Pembayaran berhasil dihapus" };
    } catch (error) {
        console.error("delete_spk_payment error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * add_spk_reject — simpan qty reject per size untuk 1 produk + 1 supplier dalam 1 PO
 * body: { id_spk, id_spk_detail, id_produk, id_ware, id_sup, rejects: [{size, qty_reject}], keterangan }
 * Behaviour: DELETE existing (per produk+supplier+spk+detail) + INSERT baru (replace mode)
 */
const add_spk_reject = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        if (!body.id_produk) throw new Error("id_produk wajib diisi");

        const spkDetail = body.id_spk_detail || null;

        // Jika id_spk tidak diberikan, cari dari id_spk_detail + id_produk + id_ware
        let resolvedIdSpk = body.id_spk || null;
        if (!resolvedIdSpk && spkDetail) {
            const [spkRows] = await connection.query(
                `SELECT id_spk FROM tb_spk WHERE id_spk_detail = ? AND id_produk = ? AND id_ware = ? LIMIT 1`,
                [spkDetail, body.id_produk, body.id_ware]
            );
            if (spkRows.length > 0) {
                resolvedIdSpk = spkRows[0].id_spk;
            } else {
                // id_spk_detail tidak ditemukan di tb_spk → ini reject lama, skip pencatatan
                await connection.commit();
                return { success: true, skipped: true, message: "id_spk_detail tidak ditemukan di tb_spk, reject tidak dicatat" };
            }
        }

        if (!resolvedIdSpk) {
            await connection.commit();
            return { success: true, skipped: true, message: "Tidak ada id_spk, reject tidak dicatat" };
        }

        // Ambil harga dari tb_spk untuk produk ini
        let harga = 0;
        const [spkHargaRows] = await connection.query(
            `SELECT harga FROM tb_spk WHERE id_spk = ? AND id_produk = ? AND id_ware = ? LIMIT 1`,
            [resolvedIdSpk, body.id_produk, body.id_ware]
        );
        if (spkHargaRows.length > 0) {
            harga = Number(spkHargaRows[0].harga || 0);
        }

        // Hapus reject lama untuk produk+supplier+spk+detail ini
        let deleteQuery = `DELETE FROM tb_spk_reject WHERE id_spk = ? AND id_produk = ? AND id_ware = ?`;
        const deleteParams = [resolvedIdSpk, body.id_produk, body.id_ware];
        if (body.id_sup) { deleteQuery += ` AND id_sup = ?`; deleteParams.push(body.id_sup); }
        if (spkDetail) { deleteQuery += ` AND id_spk_detail = ?`; deleteParams.push(spkDetail); }
        await connection.query(deleteQuery, deleteParams);

        // Insert baru (hanya size dengan qty > 0)
        const rejects = (body.rejects || []).filter((r) => Number(r.qty_reject) > 0);
        for (const r of rejects) {
            const id_reject = uuidv4();
            const qty = Number(r.qty_reject);
            const subtotal = qty * harga;
            await connection.query(
                `INSERT INTO tb_spk_reject
                    (id_reject, id_spk, id_spk_detail, id_produk, id_ware, id_sup, size, qty_reject, harga, subtotal, keterangan)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_reject,
                    resolvedIdSpk,
                    spkDetail,
                    body.id_produk,
                    body.id_ware,
                    body.id_sup || null,
                    r.size,
                    qty,
                    harga,
                    subtotal,
                    body.keterangan || null,
                ]
            );
        }

        await connection.commit();
        return { success: true, message: "Data reject berhasil disimpan" };
    } catch (error) {
        await connection.rollback();
        console.error("add_spk_reject error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

// ================================================================
// SPK REJECT LIST (tb_spk_reject) — for pagedefectReject
// ================================================================

/**
 * get_spk_reject_list — ambil semua data tb_spk_reject
 * body: { date, query, Filter_Tipe_user, Filter_Tipe_warehouse, Brand, user_role, user_store }
 * Returns: rows with id_reject, id_spk, id_spk_detail, produk, warehouse, supplier, size,
 *          qty_reject, status, tanggal_dikirim, keterangan, harga (dari tb_spk), created_at
 * Grouped by date (created_at)
 */
const get_spk_reject_list = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        const date = body.date || null;
        const query = body.query !== "all" ? body.query : null;
        const filterUser = body.Filter_Tipe_user !== "all" ? body.Filter_Tipe_user : null;
        const filterWare = body.Filter_Tipe_warehouse !== "all" ? body.Filter_Tipe_warehouse : null;
        const brand = body.Brand !== "all" ? body.Brand : null;
        const filterSupplier = body.filterSupplier && body.filterSupplier !== "all" ? body.filterSupplier : null;
        const user_role = body.user_role || "";
        const user_store = body.user_store || "";

        let whereClause = "WHERE 1=1";
        const params = [];

        // Date range filter — based on r.created_at
        if (date && date.includes(" to ")) {
            const [start, end] = date.split(" to ");
            whereClause += " AND DATE(r.created_at) BETWEEN ? AND ?";
            params.push(start, end);
        }

        if (filterUser) {
            whereClause += " AND r.users = ?";
            params.push(filterUser);
        }
        if (filterWare) {
            whereClause += " AND r.id_ware = ?";
            params.push(filterWare);
        }
        if (brand) {
            whereClause += " AND w.id_area = ?";
            params.push(brand);
        }
        if (filterSupplier) {
            whereClause += " AND sup.supplier = ?";
            params.push(filterSupplier);
        }
        if (query) {
            whereClause += " AND (p.produk LIKE ? OR r.id_spk_detail LIKE ? OR r.id_spk LIKE ?)";
            const q = `%${query}%`;
            params.push(q, q, q);
        }
        // role-based warehouse filter
        if (user_role && user_role !== "SUPER-ADMIN" && user_role !== "HEAD-AREA") {
            whereClause += " AND r.id_ware = ?";
            params.push(user_store);
        }

        const [rows] = await connection.query(
            `SELECT
                MIN(r.id) AS id,
                GROUP_CONCAT(r.id_reject ORDER BY r.id SEPARATOR ',') AS id_rejects,
                MIN(r.id_spk) AS id_spk,
                r.id_spk_detail,
                r.id_produk,
                MIN(r.id_ware) AS id_ware,
                MIN(r.id_sup) AS id_sup,
                SUM(r.qty_reject) AS qty_reject,
                MIN(r.harga) AS harga,
                SUM(r.subtotal) AS subtotal,
                MIN(r.status) AS status,
                r.tanggal_dikirim,
                MIN(r.keterangan) AS keterangan,
                MIN(r.users) AS users,
                MAX(r.created_at) AS created_at,
                COALESCE(MIN(p.produk), r.id_produk) AS produk,
                COALESCE(MIN(w.warehouse), MIN(r.id_ware)) AS warehouse,
                COALESCE(MIN(sup.supplier), MIN(r.id_sup), '-') AS supplier
             FROM tb_spk_reject r
             LEFT JOIN tb_produk p  ON p.id_produk = r.id_produk AND p.id_ware = r.id_ware
             LEFT JOIN tb_warehouse w ON w.id_ware = r.id_ware
             LEFT JOIN tb_supplier sup ON sup.id_sup = r.id_sup
             ${whereClause}
             GROUP BY r.tanggal_dikirim, r.id_spk_detail, r.id_produk
             ORDER BY MIN(r.id) DESC`,
            params
        );

        // Group by tanggal_dikirim (bukan created_at agar tidak terpengaruh timezone server)
        const grouped = {};
        rows.forEach(row => {
            const dateKey = row.tanggal_dikirim
                ? (() => {
                    const d = row.tanggal_dikirim;
                    if (typeof d === 'string') return d.slice(0, 10);
                    if (d instanceof Date) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${y}-${m}-${day}`;
                    }
                    return 'unknown';
                })()
                : "unknown";
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    tanggal: dateKey,
                    users: row.users,
                    detail: [],
                };
            }
            grouped[dateKey].detail.push({
                id_rejects: row.id_rejects ? String(row.id_rejects).split(',') : [],
                id_spk: row.id_spk,
                id_spk_detail: row.id_spk_detail,
                id_produk: row.id_produk,
                id_ware: row.id_ware,
                id_sup: row.id_sup,
                qty_reject: Number(row.qty_reject || 0),
                status: row.status || 'BELUM DIKIRIM',
                tanggal_dikirim: row.tanggal_dikirim
                    ? (() => {
                        const d = row.tanggal_dikirim;
                        if (typeof d === 'string') return d.slice(0, 10);
                        if (d instanceof Date) {
                            const y = d.getFullYear();
                            const m = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            return `${y}-${m}-${day}`;
                        }
                        return null;
                    })()
                    : null,
                keterangan: row.keterangan,
                users: row.users,
                created_at: row.created_at,
                produk: row.produk,
                warehouse: row.warehouse,
                supplier: row.supplier,
                harga: Number(row.harga || 0),
                subtotal: Number(row.subtotal || 0),
            });
        });

        const datas = Object.values(grouped);
        const total_reject = rows.length;
        const total_qty = rows.reduce((s, r) => s + Number(r.qty_reject || 0), 0);


        return { success: true, datas, total_reject, total_qty };
    } catch (error) {
        console.error("get_spk_reject_list error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * update_spk_reject_status — toggle status BELUM DIKIRIM / SUDAH DIKIRIM
 * body: { id_reject, status }
 */
const update_spk_reject_status = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        const newStatus = body.status || 'BELUM DIKIRIM';
        const nowJakarta = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const tanggalDikirim = newStatus === 'BELUM DIKIRIM' ? null : date.format(nowJakarta, "YYYY-MM-DD");
        await connection.query(
            `UPDATE tb_spk_reject SET status = ?, tanggal_dikirim = ? WHERE id_reject = ?`,
            [newStatus, tanggalDikirim, body.id_reject]
        );
        return { success: true, id_reject: body.id_reject, status: newStatus, tanggal_dikirim: tanggalDikirim };
    } catch (error) {
        console.error("update_spk_reject_status error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * bulk_update_spk_reject_status — update status massal
 * body: { ids: [id_reject,...], status }
 */
const bulk_update_spk_reject_status = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        const ids = body.ids || [];
        if (!ids.length) return { success: true };
        const newStatus = body.status || 'BELUM DIKIRIM';
        const nowJakarta = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const nowStr = date.format(nowJakarta, "YYYY/MM/DD HH:mm:ss");
        const tanggalDikirim = newStatus === 'BELUM DIKIRIM' ? null : date.format(nowJakarta, "YYYY-MM-DD");
        const placeholders = ids.map(() => "?").join(",");

        if (newStatus === 'SUDAH DIKIRIM') {
            // Update status + perbarui created_at + updated_at + tanggal_dikirim ke waktu sekarang
            await connection.query(
                `UPDATE tb_spk_reject
                 SET status = ?, tanggal_dikirim = ?, created_at = ?, updated_at = ?
                 WHERE id_reject IN (${placeholders})`,
                [newStatus, tanggalDikirim, nowStr, nowStr, ...ids]
            );
        } else {
            // Reset ke belum dikirim — tanggal_dikirim = NULL, updated_at = now
            await connection.query(
                `UPDATE tb_spk_reject
                 SET status = ?, tanggal_dikirim = NULL, updated_at = ?
                 WHERE id_reject IN (${placeholders})`,
                [newStatus, nowStr, ...ids]
            );
        }
        return { success: true };
    } catch (error) {
        console.error("bulk_update_spk_reject_status error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * delete_spk_reject_item — hapus 1 row tb_spk_reject
 * body: { id_reject }
 */
const delete_spk_reject_item = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.query(`DELETE FROM tb_spk_reject WHERE id_reject = ?`, [body.id_reject]);
        return { success: true };
    } catch (error) {
        console.error("delete_spk_reject_item error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * get_spk_reject_sizes — ambil rincian size untuk satu grup (tanggal_dikirim, id_spk_detail, id_produk)
 * body: { id_spk_detail, id_produk, tanggal_dikirim }
 */
const get_spk_reject_sizes = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        // tanggal_dikirim bisa NULL (item BELUM DIKIRIM) → sesuaikan kondisi query
        const hasTanggal = body.tanggal_dikirim != null && body.tanggal_dikirim !== "";

        const [rows] = await connection.query(
            `SELECT r.size, SUM(r.qty_reject) AS qty_reject, r.harga, SUM(r.subtotal) AS subtotal
             FROM tb_spk_reject r
             WHERE r.id_spk_detail = ? AND r.id_produk = ?
               AND ${hasTanggal ? "DATE(r.tanggal_dikirim) = ?" : "r.tanggal_dikirim IS NULL"}
               AND r.status != 'DELETE REJECT'
             GROUP BY r.size, r.harga
             ORDER BY CAST(r.size AS UNSIGNED) ASC, r.size ASC`,
            hasTanggal
                ? [body.id_spk_detail, body.id_produk, body.tanggal_dikirim]
                : [body.id_spk_detail, body.id_produk]
        );
        return { success: true, sizes: rows };
    } catch (error) {
        console.error("get_spk_reject_sizes error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * delete_spk_reject_group — soft-delete grup reject:
 *   kembalikan stok ke tb_variation + catat reversal di tb_purchaseorder / tb_variationorder / tb_mutasistock
 *   lalu set status = 'DELETE REJECT' di tb_spk_reject (tidak hard-delete)
 * body: { id_spk_detail, id_produk, tanggal_dikirim, users }
 */
const delete_spk_reject_group = async (body) => {
    const connection = await dbPool.getConnection();
    const nowJakarta = new Date(Date.now() + 7 * 60 * 60 * 1000);
    // const tanggal = date.format("YYYY/MM/DD HH:mm:ss");
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    // const tanggal_skrg = date.format(nowJakarta, "YYYY-MM-DD");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(nowJakarta, "YY");
    try {
        await connection.beginTransaction();

        // 1. Ambil semua rows reject grup ini (skip yang sudah DELETE REJECT)
        const [rejectRows] = await connection.query(
            `SELECT * FROM tb_spk_reject
             WHERE id_spk_detail = ? AND id_produk = ? AND DATE(tanggal_dikirim) = ?
               AND status != 'DELETE REJECT'
             ORDER BY created_at ASC`,
            [body.id_spk_detail, body.id_produk, body.tanggal_dikirim]
        );
        if (rejectRows.length === 0) throw new Error("Data reject tidak ditemukan atau sudah dihapus");

        const firstRow = rejectRows[0];
        const id_ware = firstRow.id_ware;
        const id_sup = firstRow.id_sup;
        const resolvedIdSpk = firstRow.id_spk;
        const harga = Number(firstRow.harga || 0);

        // 2. Bangun sizeMap dari body.rejects jika ada (pilihan per-size dari frontend),
        //    kalau tidak ada → proses semua size dari DB (backward compat)
        let sizeMap = {};
        if (body.rejects && Array.isArray(body.rejects) && body.rejects.length > 0) {
            for (const r of body.rejects) {
                if (Number(r.qty_reject) > 0) {
                    sizeMap[r.size] = Number(r.qty_reject);
                }
            }
        } else {
            for (const row of rejectRows) {
                if (!sizeMap[row.size]) sizeMap[row.size] = 0;
                sizeMap[row.size] += Number(row.qty_reject || 0);
            }
        }
        if (Object.keys(sizeMap).length === 0) throw new Error("Tidak ada size yang dipilih");

        // 3. Generate idpo, id_act, id_mutasi
        const [cek_po] = await connection.query(`SELECT MAX(idpo) as idpo FROM tb_purchaseorder`);
        const idpo = cek_po[0].idpo === null
            ? tahun + "0001"
            : tahun + String(parseInt(cek_po[0].idpo.toString().slice(-4)) + 1).padStart(4, "0");

        const [cek_act] = await connection.query(`SELECT MAX(id_act) as id_act FROM tb_purchaseorder`);
        const id_act = cek_act[0].id_act === null
            ? "0001"
            : String(parseInt(cek_act[0].id_act.toString().slice(-4)) + 1).padStart(4, "0");

        const [cek_mutasi] = await connection.query(`SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`);
        let mutasiNumber = cek_mutasi[0].id_mutasi === null
            ? 1
            : parseInt(cek_mutasi[0].id_mutasi.toString().slice(-8)) + 1;

        // 4. Nama produk & warehouse
        const [get_product] = await connection.query(`SELECT produk FROM tb_produk WHERE id_produk = ?`, [body.id_produk]);
        const [getwarehouse] = await connection.query(`SELECT warehouse FROM tb_warehouse WHERE id_ware = ?`, [id_ware]);
        const produkName = get_product[0]?.produk || body.id_produk;
        const wareName = getwarehouse[0]?.warehouse || id_ware;

        // 5. Proses per size — kembalikan stok ke tb_variation
        let total_qty = 0;

        for (const [size, requestedQty] of Object.entries(sizeMap)) {
            if (requestedQty <= 0) continue;

            // Hitung qty tersedia di DB untuk size ini
            const rowsForSize = rejectRows.filter(r => r.size === size);
            const availableQty = rowsForSize.reduce((s, r) => s + Number(r.qty_reject || 0), 0);
            const qty = Math.min(Number(requestedQty), availableQty); // tidak boleh lebih dari tersedia
            if (qty <= 0) continue;

            const [getdatavariation_total] = await connection.query(
                `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk = ? AND id_ware = ? AND size = ?`,
                [body.id_produk, id_ware, size]
            );
            const [getdatavariation] = await connection.query(
                `SELECT id_produk, id_ware, idpo, size, qty, id_area FROM tb_variation
                 WHERE id_produk = ? AND id_ware = ? AND size = ? ORDER BY id ASC`,
                [body.id_produk, id_ware, size]
            );

            const totalqty = parseInt(getdatavariation_total[0]?.totalqty) || 0;
            const newTotal = totalqty + qty; // kembalikan stok

            for (let x = 0; x < getdatavariation.length; x++) {
                if (x === getdatavariation.length - 1) {
                    await connection.query(
                        `UPDATE tb_variation SET qty = ?, idpo = ?, id_act = ?, updated_at = ?
                         WHERE id_produk = ? AND id_ware = ? AND size = ? AND idpo = ?`,
                        [newTotal, idpo, id_act, tanggal,
                            getdatavariation[x].id_produk, getdatavariation[x].id_ware,
                            getdatavariation[x].size, getdatavariation[x].idpo]
                    );
                } else {
                    await connection.query(
                        `UPDATE tb_variation SET qty = 0, updated_at = ?
                         WHERE id_produk = ? AND id_ware = ? AND size = ? AND idpo = ?`,
                        [tanggal,
                            getdatavariation[x].id_produk, getdatavariation[x].id_ware,
                            getdatavariation[x].size, getdatavariation[x].idpo]
                    );
                }

                if (x === 0) {
                    // tb_variationorder — tipe DELETE REJECT, qty positif (reversal)
                    await connection.query(
                        `INSERT INTO tb_variationorder
                         (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DELETE REJECT', ?, ?, ?)`,
                        [tanggal_skrg, getdatavariation[x].id_produk, idpo, id_sup,
                            getdatavariation[x].id_area, getdatavariation[x].id_ware,
                            size, qty, id_act, body.users || null, tanggal, tanggal]
                    );

                    // tb_mutasistock
                    const id_mutasi = "MT-" + String(mutasiNumber).padStart(8, "0");
                    mutasiNumber++;
                    await connection.query(
                        `INSERT INTO tb_mutasistock
                         (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                         VALUES (?, ?, 'DELETE REJECT', ?, '-', ?, ?, ?, ?, ?, 'Barang Gudang', ?, 'DELETE REJECT', ?, ?, ?)`,
                        [id_mutasi, tanggal_skrg, getdatavariation[x].id_ware,
                            getdatavariation[x].id_produk, produkName, idpo,
                            size, qty, wareName, body.users || null, tanggal, tanggal]
                    );

                    total_qty += qty;
                }
            }

            // 6a. Mark rows tb_spk_reject untuk size ini sebagai DELETE REJECT
            //     dari terlama ke terbaru, sampai qty terpenuhi
            let remaining = qty;
            for (const row of rowsForSize) {
                if (remaining <= 0) break;
                const rowQty = Number(row.qty_reject || 0);
                if (rowQty <= remaining) {
                    // Seluruh qty row ini habis → DELETE row
                    await connection.query(
                        `DELETE FROM tb_spk_reject WHERE id_reject = ?`,
                        [row.id_reject]
                    );
                    remaining -= rowQty;
                } else {
                    // Partial: kurangi qty_reject row ini
                    const newQty = rowQty - remaining;
                    if (newQty <= 0) {
                        // Hasilnya 0 → DELETE juga
                        await connection.query(
                            `DELETE FROM tb_spk_reject WHERE id_reject = ?`,
                            [row.id_reject]
                        );
                    } else {
                        // Masih ada sisa → UPDATE qty saja
                        await connection.query(
                            `UPDATE tb_spk_reject SET qty_reject = ?, subtotal = ? * harga, updated_at = ? WHERE id_reject = ?`,
                            [newQty, newQty, tanggal, row.id_reject]
                        );
                    }
                    remaining = 0;
                }
            }
        }

        // 6b. tb_purchaseorder — reversal DELETE REJECT (1 baris total semua size)
        const total_amount = total_qty * harga;
        await connection.query(
            `INSERT INTO tb_purchaseorder
             (idpo, tanggal_receive, id_sup, id_produk, id_ware, id_spk, id_spk_detail, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DELETE REJECT', ?, ?, ?, ?)`,
            [idpo, tanggal_skrg, id_sup, body.id_produk, id_ware,
                resolvedIdSpk, body.id_spk_detail, total_qty, harga, total_amount,
                id_act, body.users || null, tanggal, tanggal]
        );

        await connection.commit();
        return { success: true };
    } catch (error) {
        console.error("delete_spk_reject_group error:", error);
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * update_spk_reject_harga — update harga & subtotal pada 1 baris tb_spk_reject
 * body: { id_reject, harga }
 */
const update_spk_reject_harga = async (body) => {
    const connection = await dbPool.getConnection();
    try {
        const { id_reject, harga } = body;
        if (!id_reject || harga === undefined) throw new Error('id_reject dan harga wajib diisi');
        const hargaNum = Number(harga);
        if (isNaN(hargaNum) || hargaNum < 0) throw new Error('Harga tidak valid');

        // Ambil qty_reject untuk hitung subtotal
        const [[row]] = await connection.query(
            `SELECT qty_reject FROM tb_spk_reject WHERE id_reject = ?`, [id_reject]
        );
        if (!row) throw new Error('Data reject tidak ditemukan');

        const subtotal = Number(row.qty_reject) * hargaNum;
        await connection.query(
            `UPDATE tb_spk_reject SET harga = ?, subtotal = ?, updated_at = NOW() WHERE id_reject = ?`,
            [hargaNum, subtotal, id_reject]
        );
        return { success: true, harga: hargaNum, subtotal };
    } catch (error) {
        console.error('update_spk_reject_harga error:', error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

/**
 * update_spk_reject_harga_group — update harga & subtotal; opsi kembalikan stok untuk size tertentu
 * body: { id_spk_detail, id_produk, tanggal_dikirim, harga, sizeAdjustments?, users? }
 * sizeAdjustments: [{ size, qty_reject }]  → qty_reject = jumlah yang DIKEMBALIKAN ke stok
 */
const update_spk_reject_harga_group = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const nowJakarta = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const tahun = date.format(nowJakarta, "YY");
    try {
        await connection.beginTransaction();

        const { id_spk_detail, id_produk, tanggal_dikirim, harga, hargaChanged, sizeAdjustments, users } = body;
        if (!id_spk_detail || !id_produk || harga === undefined)
            throw new Error('Parameter tidak lengkap');
        const hargaNum = Number(harga);
        if (isNaN(hargaNum) || hargaNum < 0) throw new Error('Harga tidak valid');

        // 1. Ambil rows aktif grup ini
        const hasTanggal = tanggal_dikirim != null && tanggal_dikirim !== "";
        const [rejectRows] = await connection.query(
            `SELECT * FROM tb_spk_reject
             WHERE id_spk_detail = ? AND id_produk = ?
               AND ${hasTanggal ? "DATE(tanggal_dikirim) = ?" : "tanggal_dikirim IS NULL"}
               AND status != 'DELETE REJECT'
             ORDER BY created_at ASC`,
            hasTanggal ? [id_spk_detail, id_produk, tanggal_dikirim] : [id_spk_detail, id_produk]
        );
        if (rejectRows.length === 0) throw new Error('Data reject tidak ditemukan');

        const firstRow = rejectRows[0];
        const id_ware = firstRow.id_ware;
        const id_sup = firstRow.id_sup;
        const resolvedIdSpk = firstRow.id_spk;

        // 2. Update harga & subtotal — hanya jika harga benar-benar berubah
        if (hargaChanged !== false) {
            // 2a. Update tb_spk_reject
            await connection.query(
                `UPDATE tb_spk_reject
                 SET harga = ?, subtotal = qty_reject * ?, updated_at = ?
                 WHERE id_spk_detail = ? AND id_produk = ?
                   AND ${hasTanggal ? "DATE(tanggal_dikirim) = ?" : "tanggal_dikirim IS NULL"}
                   AND status != 'DELETE REJECT'`,
                hasTanggal
                    ? [hargaNum, hargaNum, tanggal, id_spk_detail, id_produk, tanggal_dikirim]
                    : [hargaNum, hargaNum, tanggal, id_spk_detail, id_produk]
            );

            // 2b. Update tb_purchaseorder — m_price & total_amount untuk baris existing
            //     WHERE id_produk AND id_ware AND id_spk_detail (harga per id_spk_detail bisa berbeda)
            await connection.query(
                `UPDATE tb_purchaseorder
                 SET m_price = ?, total_amount = qty * ?, updated_at = ?
                 WHERE id_produk = ? AND id_ware = ? AND id_spk_detail = ?`,
                [hargaNum, hargaNum, tanggal, id_produk, id_ware, id_spk_detail]
            );
        }

        // 3. Proses sizeAdjustments — kembalikan stok ke tb_variation (hanya jika qty benar-benar berubah)
        if (Array.isArray(sizeAdjustments) && sizeAdjustments.length > 0) {
            const [cek_po] = await connection.query(`SELECT MAX(idpo) as idpo FROM tb_purchaseorder`);
            const idpo = cek_po[0].idpo === null
                ? tahun + "0001"
                : tahun + String(parseInt(cek_po[0].idpo.toString().slice(-4)) + 1).padStart(4, "0");

            const [cek_act] = await connection.query(`SELECT MAX(id_act) as id_act FROM tb_purchaseorder`);
            const id_act = cek_act[0].id_act === null
                ? "0001"
                : String(parseInt(cek_act[0].id_act.toString().slice(-4)) + 1).padStart(4, "0");

            const [cek_mutasi] = await connection.query(`SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`);
            let mutasiNumber = cek_mutasi[0].id_mutasi === null
                ? 1
                : parseInt(cek_mutasi[0].id_mutasi.toString().slice(-8)) + 1;

            const [get_product] = await connection.query(`SELECT produk FROM tb_produk WHERE id_produk = ?`, [id_produk]);
            const [getwarehouse] = await connection.query(`SELECT warehouse FROM tb_warehouse WHERE id_ware = ?`, [id_ware]);
            const produkName = get_product[0]?.produk || id_produk;
            const wareName = getwarehouse[0]?.warehouse || id_ware;

            let total_qty = 0;

            for (const adj of sizeAdjustments) {
                const { size, qty_reject: returnQty } = adj;
                if (!size || Number(returnQty) <= 0) continue;
                const qty = Number(returnQty);

                // Ambil data variasi
                const [getdatavariation_total] = await connection.query(
                    `SELECT SUM(qty) AS totalqty FROM tb_variation WHERE id_produk = ? AND id_ware = ? AND size = ?`,
                    [id_produk, id_ware, size]
                );
                const [getdatavariation] = await connection.query(
                    `SELECT id_produk, id_ware, idpo, size, qty, id_area FROM tb_variation
                     WHERE id_produk = ? AND id_ware = ? AND size = ? ORDER BY id ASC`,
                    [id_produk, id_ware, size]
                );
                const totalqty = parseInt(getdatavariation_total[0]?.totalqty) || 0;
                const newTotal = totalqty + qty;

                for (let x = 0; x < getdatavariation.length; x++) {
                    if (x === getdatavariation.length - 1) {
                        await connection.query(
                            `UPDATE tb_variation SET qty = ?, idpo = ?, id_act = ?, updated_at = ?
                             WHERE id_produk = ? AND id_ware = ? AND size = ? AND idpo = ?`,
                            [newTotal, idpo, id_act, tanggal,
                                getdatavariation[x].id_produk, getdatavariation[x].id_ware,
                                getdatavariation[x].size, getdatavariation[x].idpo]
                        );
                    } else {
                        await connection.query(
                            `UPDATE tb_variation SET qty = 0, updated_at = ?
                             WHERE id_produk = ? AND id_ware = ? AND size = ? AND idpo = ?`,
                            [tanggal, getdatavariation[x].id_produk, getdatavariation[x].id_ware,
                                getdatavariation[x].size, getdatavariation[x].idpo]
                        );
                    }
                    if (x === 0) {
                        await connection.query(
                            `INSERT INTO tb_variationorder
                             (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'EDIT REJECT', ?, ?, ?)`,
                            [tanggal_skrg, getdatavariation[x].id_produk, idpo, id_sup,
                                getdatavariation[x].id_area, getdatavariation[x].id_ware,
                                size, qty, id_act, users || null, tanggal, tanggal]
                        );
                        const id_mutasi = "MT-" + String(mutasiNumber).padStart(8, "0");
                        mutasiNumber++;
                        await connection.query(
                            `INSERT INTO tb_mutasistock
                             (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                             VALUES (?, ?, 'EDIT REJECT', ?, '-', ?, ?, ?, ?, ?, 'Barang Gudang', ?, 'EDIT REJECT', ?, ?, ?)`,
                            [id_mutasi, tanggal_skrg, getdatavariation[x].id_ware,
                                id_produk, produkName, idpo,
                                size, qty, wareName, users || null, tanggal, tanggal]
                        );
                        total_qty += qty;
                    }
                }

                // Kurangi qty_reject di tb_spk_reject dari terlama → terbaru
                const rowsForSize = rejectRows.filter(r => r.size === size);
                let remaining = qty;
                for (const row of rowsForSize) {
                    if (remaining <= 0) break;
                    const rowQty = Number(row.qty_reject || 0);
                    if (rowQty <= remaining) {
                        await connection.query(
                            `DELETE FROM tb_spk_reject WHERE id_reject = ?`, [row.id_reject]
                        );
                        remaining -= rowQty;
                    } else {
                        const newQty = rowQty - remaining;
                        await connection.query(
                            `UPDATE tb_spk_reject SET qty_reject = ?, subtotal = ? * harga, updated_at = ? WHERE id_reject = ?`,
                            [newQty, newQty, tanggal, row.id_reject]
                        );
                        remaining = 0;
                    }
                }
            }

            // Catat di tb_purchaseorder
            if (total_qty > 0) {
                const total_amount = total_qty * hargaNum;
                await connection.query(
                    `INSERT INTO tb_purchaseorder
                     (idpo, tanggal_receive, id_sup, id_produk, id_ware, id_spk, id_spk_detail, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EDIT REJECT', ?, ?, ?, ?)`,
                    [idpo, tanggal_skrg, id_sup, id_produk, id_ware,
                        resolvedIdSpk, id_spk_detail, total_qty, hargaNum, total_amount,
                        id_act, users || null, tanggal, tanggal]
                );
            }
        }

        await connection.commit();
        return { success: true, harga: hargaNum };
    } catch (error) {
        console.error('update_spk_reject_harga_group error:', error);
        await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

// ================================================================
// WRITE-OFF REJECT — kurangi stok + catat tb_spk_reject
// ================================================================

/**
 * writeoff_reject — Write-Off: kurangi stok tb_variation + catat tb_spk_reject
 * Mengikuti pola stockOpname: generate idpo baru, merge semua variation rows per size,
 * insert variationorder + mutasistock + purchaseorder + spk_reject
 */
const writeoff_reject = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal_skrg = date.format(new Date(), "YYYY-MM-DD");
    const tahun = date.format(new Date(), "YY");
    try {
        console.log("body reject : ", body);

        await connection.beginTransaction();

        if (!body.id_produk) throw new Error("id_produk wajib diisi");
        if (!body.id_spk_detail) throw new Error("id_spk_detail wajib diisi");

        const spkDetail = body.id_spk_detail;

        // 1. Cari id_spk, id_sup, harga dari tb_spk via id_spk_detail
        //    Jika body.id_sup dikirim dari frontend, filter juga by id_sup
        const supplierFromBody = body.id_sup || null;
        const spkQuery = supplierFromBody
            ? `SELECT id_spk, id_sup, harga FROM tb_spk
               WHERE id_spk_detail = ? AND id_produk = ? AND id_ware = ? AND id_sup = ? LIMIT 1`
            : `SELECT id_spk, id_sup, harga FROM tb_spk
               WHERE id_spk_detail = ? AND id_produk = ? AND id_ware = ? LIMIT 1`;
        const spkParams = supplierFromBody
            ? [spkDetail, body.id_produk, body.id_ware, supplierFromBody]
            : [spkDetail, body.id_produk, body.id_ware];

        const [spkRows] = await connection.query(spkQuery, spkParams);
        if (spkRows.length === 0) {
            const err = new Error("Data Production tidak matching! ID SPK Detail tidak ditemukan di tb_spk.");
            err.code = "SPK_NOT_MATCHING";
            throw err;
        }
        const resolvedIdSpk = spkRows[0].id_spk;
        const id_sup = supplierFromBody || spkRows[0].id_sup || null;
        let harga = Number(spkRows[0].harga || 0);

        // Jika harga dari tb_spk = 0, cek tb_spk_reject untuk harga terakhir yg pernah dipakai
        if (harga === 0) {
            const [prevReject] = await connection.query(
                `SELECT harga FROM tb_spk_reject
                 WHERE id_spk_detail = ? AND id_produk = ? AND harga > 0
                 ORDER BY created_at DESC LIMIT 1`,
                [spkDetail, body.id_produk]
            );
            if (prevReject.length > 0) {
                harga = Number(prevReject[0].harga);
            }
        }

        // 2. Generate idpo, id_act, id_mutasi — pola sama dengan stockOpname
        const [cek_po] = await connection.query(`SELECT MAX(idpo) as idpo FROM tb_purchaseorder`);
        let idpo;
        if (cek_po[0].idpo === null) {
            idpo = tahun + "0001";
        } else {
            const data_2 = cek_po[0].idpo.toString().slice(-4);
            idpo = tahun + String(parseInt(data_2) + 1).padStart(4, "0");
        }

        const [cek_act] = await connection.query(`SELECT MAX(id_act) as id_act FROM tb_purchaseorder`);
        let id_act;
        if (cek_act[0].id_act === null) {
            id_act = "0001";
        } else {
            const data_2 = cek_act[0].id_act.toString().slice(-4);
            id_act = String(parseInt(data_2) + 1).padStart(4, "0");
        }

        const [cek_mutasi] = await connection.query(`SELECT MAX(id_mutasi) as id_mutasi FROM tb_mutasistock`);
        let id_mutasi;
        if (cek_mutasi[0].id_mutasi === null) {
            id_mutasi = "MT-" + "00000001";
        } else {
            const data_2 = cek_mutasi[0].id_mutasi.toString().slice(-8);
            id_mutasi = "MT-" + String(parseInt(data_2) + 1).padStart(8, "0");
        }

        // 3. Info produk & warehouse
        const [get_product] = await connection.query(`SELECT produk FROM tb_produk WHERE id_produk='${body.id_produk}'`);
        const [getwarehouse] = await connection.query(`SELECT warehouse FROM tb_warehouse WHERE id_ware='${body.id_ware}'`);
        const produkName = get_product[0]?.produk || body.id_produk;
        const wareName = getwarehouse[0]?.warehouse || body.id_ware;

        // 5. Proses setiap size — pola identik stockOpname
        const rejects = (body.rejects || []).filter(r => Number(r.qty_reject) > 0);
        let total_qty = 0;

        for (const r of rejects) {
            const qty = Number(r.qty_reject);
            const subtotal = qty * harga;

            // Ambil semua variation rows (sama dengan stockOpname — bukan hanya qty > 0)
            const [getdatavariation_total] = await connection.query(
                `SELECT SUM(qty) AS totalqty FROM tb_variation
                 WHERE id_produk='${body.id_produk}' AND id_ware='${body.id_ware}' AND size='${r.size}' ORDER BY id ASC`
            );
            const [getdatavariation] = await connection.query(
                `SELECT id_produk, id_ware, idpo, size, qty, id_area FROM tb_variation
                 WHERE id_produk='${body.id_produk}' AND id_ware='${body.id_ware}' AND size='${r.size}' ORDER BY id ASC`
            );

            const totalqty = parseInt(getdatavariation_total[0].totalqty) || 0;
            const newTotal = totalqty - qty;  // kurangi stok

            for (let x = 0; x < getdatavariation.length; x++) {
                if (x === (getdatavariation.length - 1)) {
                    // Baris terakhir: set ke total baru (merge semua ke 1 row)
                    await connection.query(
                        `UPDATE tb_variation SET qty='${newTotal < 0 ? 0 : newTotal}', idpo='${idpo}', id_act='${id_act}', updated_at='${tanggal}'
                         WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}'
                           AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                    );
                } else {
                    // Baris lain: set 0
                    await connection.query(
                        `UPDATE tb_variation SET qty='0', updated_at='${tanggal}'
                         WHERE id_produk='${getdatavariation[x].id_produk}' AND id_ware='${getdatavariation[x].id_ware}'
                           AND size='${getdatavariation[x].size}' AND idpo='${getdatavariation[x].idpo}'`
                    );
                }

                if (x === 0) {
                    // tb_variationorder — tipe REJECT, qty negatif
                    await connection.query(
                        `INSERT INTO tb_variationorder (tanggal, id_produk, idpo, id_sup, id_area, id_ware, size, qty, id_act, tipe_order, users, created_at, updated_at)
                         VALUES ('${tanggal_skrg}','${getdatavariation[x].id_produk}','${idpo}','${id_sup}','${getdatavariation[x].id_area}','${getdatavariation[x].id_ware}','${r.size}','-${qty}','${id_act}','REJECT','${body.users}','${tanggal}','${tanggal}')`
                    );

                    // tb_mutasistock
                    await connection.query(
                        `INSERT INTO tb_mutasistock
                         (id_mutasi, tanggal, id_pesanan, id_ware, id_store, id_produk, produk, id_po, size, qty, source, id_sup, mutasi, users, created_at, updated_at)
                         VALUES ('${id_mutasi}','${tanggal_skrg}','REJECT WRITE-OFF','${getdatavariation[x].id_ware}','-','${getdatavariation[x].id_produk}','${produkName}','${idpo}','${r.size}','-${qty}','Barang Gudang','${wareName}','REJECT','${body.users}','${tanggal}','${tanggal}')`
                    );

                    total_qty += qty;
                }
            }

            // tb_spk_reject — status langsung SUDAH DIKIRIM karena write-off = aksi langsung
            const id_reject = uuidv4();
            await connection.query(
                `INSERT INTO tb_spk_reject
                    (id_reject, id_spk, id_spk_detail, id_produk, id_ware, id_sup, size, qty_reject, harga, subtotal, status, tanggal_dikirim, keterangan, users, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'BELUM DIKIRIM', ?, ?, ?, ?, ?)`,
                [id_reject, resolvedIdSpk, spkDetail,
                    body.id_produk, body.id_ware, id_sup,
                    r.size, qty, harga, subtotal,
                    tanggal_skrg,
                    body.keterangan || 'WRITE-OFF REJECT',
                    body.users || null,
                    tanggal, tanggal]
            );
        }

        // 6. tb_purchaseorder — tipe REJECT (total negatif)
        const total_amount = total_qty * harga;
        await connection.query(
            `INSERT INTO tb_purchaseorder
             (idpo, tanggal_receive, id_sup, id_produk, id_ware, id_spk, id_spk_detail, qty, m_price, total_amount, tipe_order, id_act, users, created_at, updated_at)
             VALUES ('${idpo}','${tanggal_skrg}','${id_sup}','${body.id_produk}','${body.id_ware}','${resolvedIdSpk}','${spkDetail}','-${total_qty}','${harga}','-${total_amount}','REJECT','${id_act}','${body.users}','${tanggal}','${tanggal}')`
        );

        await connection.commit();
        return { success: true, message: "Write-Off berhasil, stok dikurangi dan reject dicatat" };
    } catch (error) {
        await connection.rollback();
        console.error("writeoff_reject error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
};

// ================================================================
// END PAYMENT & REJECT FUNCTIONS
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
    update_defect_status,
    bulk_update_defect_status,
    update_defect_harga,
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

/**
 * getSpkDetailList — ambil daftar id_spk_detail terbaru untuk produk + warehouse tertentu
 * body: { idproduct, idware }
 */
async function getSpkDetailList(body) {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT DISTINCT id_spk_detail, MAX(updated_at) AS last_updated
             FROM tb_spk
             WHERE id_produk = ? AND id_ware = ? AND id_spk_detail IS NOT NULL AND id_spk_detail != ''
             GROUP BY id_spk_detail
             ORDER BY MAX(updated_at) DESC`,
            [body.idproduct, body.idware]
        );
        return rows;
    } catch (error) {
        console.error("getSpkDetailList error:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * getSizeRestockBySpk — ambil rincian size dari tb_variationorder untuk restock
 * body: { id_spk, id_produk, id_ware, id_sup }
 */
async function getSizeRestockBySpk(body) {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT vo.size, SUM(vo.qty) AS qty
             FROM tb_variationorder vo
             INNER JOIN tb_purchaseorder po
                ON po.idpo      = vo.idpo
               AND po.id_produk = vo.id_produk
               AND po.id_ware   = vo.id_ware
               AND po.id_sup    = vo.id_sup
             WHERE po.id_spk    = ?
               AND po.id_produk = ?
               AND po.id_ware   = ?
               AND po.id_sup    = ?
               AND po.tipe_order = 'RESTOCK'
             GROUP BY vo.size
             ORDER BY vo.size ASC`,
            [body.id_spk, body.id_produk, body.id_ware, body.id_sup]
        );
        return rows;
    } catch (error) {
        console.error("getSizeRestockBySpk error:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * getSizeBySpkDetail — ambil size list dari tb_spk_list berdasarkan id_spk_detail + produk + warehouse
 * body: { idproduct, idware, id_spk_detail }
 */
async function getSizeBySpkDetail(body) {
    const connection = await dbPool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT sl.size, SUM(sl.qty) AS qty
             FROM tb_spk_list sl
             INNER JOIN tb_spk s
                ON s.id_spk    = sl.id_spk
               AND s.id_produk = sl.id_produk
               AND s.id_ware   = sl.id_ware
               AND s.id_sup    = sl.id_sup
             WHERE sl.id_produk = ? AND sl.id_ware = ? AND s.id_spk_detail = ?
             GROUP BY sl.size
             ORDER BY sl.size ASC`,
            [body.idproduct, body.idware, body.id_spk_detail]
        );
        return rows;
    } catch (error) {
        console.error("getSizeBySpkDetail error:", error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * get_spk_list — daftar semua PO unik beserta ringkasan payment
 * body: { id_ware? }   — opsional, jika diisi filter per warehouse
 */
async function get_spk_list(body) {
    const connection = await dbPool.getConnection();
    try {
        // 1. Ambil semua PO unik
        let whereClause = "";
        const params = [];
        if (body.id_ware && body.id_ware !== "all") {
            whereClause = "WHERE s.id_ware = ?";
            params.push(body.id_ware);
        }

        const [spkRows] = await connection.query(
            `SELECT
                s.id_spk,
                MAX(s.nama)              AS po_nama,
                s.id_ware,
                MAX(w.warehouse)         AS warehouse,
                COUNT(DISTINCT s.id_sup) AS jumlah_supplier,
                MAX(s.created_at)        AS created_at
             FROM tb_spk s
             LEFT JOIN tb_warehouse w ON w.id_ware = s.id_ware
             ${whereClause}
             GROUP BY s.id_spk, s.id_ware
             ORDER BY MAX(s.created_at) DESC`,
            params
        );

        if (spkRows.length === 0) {
            return { success: true, data: [] };
        }

        // 2. Untuk setiap PO, hitung total berdasarkan data RESTOCK (tb_purchaseorder)
        const allIdSpk = spkRows.map(r => r.id_spk);
        const placeholders = allIdSpk.map(() => "?").join(",");

        // total bruto + total qty: dari tb_purchaseorder WHERE tipe_order='RESTOCK'
        const [brutoQtyRows] = await connection.query(
            `SELECT
                id_spk,
                COALESCE(SUM(qty), 0)            AS total_qty,
                COALESCE(SUM(qty * m_price), 0)  AS total_bruto
             FROM tb_purchaseorder
             WHERE id_spk IN (${placeholders})
               AND tipe_order = 'RESTOCK'
             GROUP BY id_spk`,
            allIdSpk
        );

        // total reject amount: qty_reject × harga dari tb_spk
        const [rejectRows] = await connection.query(
            `SELECT
                r.id_spk,
                COALESCE(SUM(r.qty_reject * COALESCE(s.harga, 0)), 0) AS total_reject
             FROM tb_spk_reject r
             LEFT JOIN tb_spk s
                    ON s.id_spk    = r.id_spk
                   AND s.id_produk = r.id_produk
                   AND s.id_ware   = r.id_ware
                   AND s.id_sup    = r.id_sup
             WHERE r.id_spk IN (${placeholders})
             GROUP BY r.id_spk`,
            allIdSpk
        );

        // total sudah bayar
        const [payRows] = await connection.query(
            `SELECT id_spk, COALESCE(SUM(jumlah_bayar), 0) AS sudah_bayar
             FROM tb_spk_payment
             WHERE id_spk IN (${placeholders})
             GROUP BY id_spk`,
            allIdSpk
        );

        // nama supplier per PO (GROUP_CONCAT) — hanya supplier yang ada restock-nya
        const [supNameRows] = await connection.query(
            `SELECT
                po.id_spk,
                GROUP_CONCAT(DISTINCT COALESCE(sup.supplier, po.id_sup) ORDER BY COALESCE(sup.supplier, po.id_sup) ASC SEPARATOR ', ') AS supplier_names
             FROM tb_purchaseorder po
             LEFT JOIN tb_supplier sup ON sup.id_sup = po.id_sup
             WHERE po.id_spk IN (${placeholders})
               AND po.tipe_order = 'RESTOCK'
             GROUP BY po.id_spk`,
            allIdSpk
        );

        // index maps
        const brutoMap = {};
        const qtyMap = {};
        brutoQtyRows.forEach(r => {
            brutoMap[r.id_spk] = Number(r.total_bruto || 0);
            qtyMap[r.id_spk] = Number(r.total_qty || 0);
        });
        const rejectMap = {};
        rejectRows.forEach(r => { rejectMap[r.id_spk] = Number(r.total_reject || 0); });
        const payMap = {};
        payRows.forEach(r => { payMap[r.id_spk] = Number(r.sudah_bayar || 0); });
        const supNameMap = {};
        supNameRows.forEach(r => { supNameMap[r.id_spk] = r.supplier_names || "-"; });

        const data = spkRows.map(r => {
            const bruto = brutoMap[r.id_spk] || 0;
            const reject = rejectMap[r.id_spk] || 0;
            const netBayar = bruto - reject;
            const sudah = payMap[r.id_spk] || 0;
            return {
                id_spk: r.id_spk,
                po_nama: r.po_nama,
                id_ware: r.id_ware,
                warehouse: r.warehouse,
                supplier_names: supNameMap[r.id_spk] || "-",
                total_qty: qtyMap[r.id_spk] || 0,
                created_at: r.created_at,
                total_bruto: bruto,
                total_reject: reject,
                net_bayar: netBayar,
                sudah_bayar: sudah,
                sisa_bayar: netBayar - sudah,
            };
        });

        return { success: true, data };
    } catch (error) {
        console.error("get_spk_list error:", error);
        return { success: false, message: error.message, data: [] };
    } finally {
        connection.release();
    }
}
