const dbPool = require("../config/database");

const date = require("date-and-time");
const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
const tanggalinput = date.format(new Date(), "YYYYMMDD");
const { generateFromEmail } = require("unique-username-generator");

const getExpense = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
    const tanggalinput = date.format(new Date(), "YYYYMMDD");

    const tanggal = body.date;
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

        if (body.id_store == "all") {
            if (body.role === "SUPER-ADMIN" || body.role === "HEAD-AREA") {
                var [data_expense] = await connection.query(
                    `SELECT tb_expense.*,tb_store.store FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
                );
                var [total_transaksi] = await connection.query(
                    `SELECT COUNT(id) AS aa FROM tb_expense WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );
                var [total_amount] = await connection.query(
                    `SELECT SUM(total_amount) AS total_amount FROM tb_expense WHERE tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );
            } else {
                var [data_expense] = await connection.query(
                    `SELECT tb_expense.*,tb_store.store FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tb_expense.id_store='${body.area}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
                );
                var [total_transaksi] = await connection.query(
                    `SELECT COUNT(id) AS aa FROM tb_expense WHERE id_store='${body.area}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );
                var [total_amount] = await connection.query(
                    `SELECT SUM(total_amount) AS total_amount FROM tb_expense WHERE id_store='${body.area}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
                );
            }
        } else {
            var [data_expense] = await connection.query(
                `SELECT tb_expense.*,tb_store.store FROM tb_expense LEFT JOIN tb_store ON tb_expense.id_store = tb_store.id_store WHERE tb_expense.id_store='${body.id_store}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}' ORDER BY id DESC`
            );
            var [total_transaksi] = await connection.query(
                `SELECT COUNT(id) AS aa FROM tb_expense WHERE tb_expense.id_store='${body.id_store}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
            var [total_amount] = await connection.query(
                `SELECT SUM(total_amount) AS total_amount FROM tb_expense WHERE tb_expense.id_store='${body.id_store}' AND tanggal BETWEEN '${tanggal_start}' AND '${tanggal_end}'`
            );
        }

        await connection.commit();
        await connection.release();

        return {
            total_transaksi: total_transaksi[0].aa,
            total_amount: total_amount[0].total_amount,
            data_expense
        };

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const addExpense = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
    const tanggalinput = date.format(new Date(), "YYYYMMDD");
    try {
        await connection.beginTransaction();

        var rubahnama = body.deskripsi.split(" ");
        for (let xxx = 0; xxx < rubahnama.length; xxx++) {
            rubahnama[xxx] = rubahnama[xxx][0].toUpperCase() + rubahnama[xxx].substring(1);
        }
        var hasil_deskripsi = rubahnama.join(" ")

        const [cek_expense] = await connection.query(
            `SELECT MAX(id_expense) as id_expense FROM tb_expense`
        );
        if (cek_expense[0].id_expense === null) {
            var id_expense = tanggalinput + "-0001";
        } else {
            const get_last2 = cek_expense[0].id_expense.split("-");
            const data_2 = parseInt(get_last2[1]) + 1;
            var id_expense = tanggalinput + "-" + String(data_2).padStart(4, "0");
        }

        await connection.query(
            `INSERT INTO tb_expense
            (tanggal, id_expense, id_store, deskripsi, amount, qty, total_amount, created_at, updated_at)
            VALUES ('${tanggal2}','${id_expense}','${body.id_store}','${hasil_deskripsi}','${body.amount}','${body.qty}','${body.total_amount}','${tanggal}','${tanggal}')`
        );

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const editExpense = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
    const tanggalinput = date.format(new Date(), "YYYYMMDD");
    try {
        await connection.beginTransaction();

        await connection.query(
            `UPDATE tb_expense SET deskripsi='${body.data.edit_deskripsi}',id_store='${body.data.edit_id_store}',amount='${body.data.edit_amount}',qty='${body.data.edit_qty}',total_amount='${body.data.edit_total_amount}',updated_at='${tanggal}' WHERE id='${body.id}'`
        );

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

const deleteExpense = async (body) => {
    const connection = await dbPool.getConnection();
    const tanggal = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
    const tanggal2 = date.format(new Date(), "YYYY-MM-DD");
    const tanggalinput = date.format(new Date(), "YYYYMMDD");
    try {
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM tb_expense WHERE id='${body.id}'`
        );

        await connection.commit();
        await connection.release();

    } catch (error) {
        console.log(error);
        await connection.release();
    }
};

module.exports = {
    getExpense,
    addExpense,
    editExpense,
    deleteExpense
};
