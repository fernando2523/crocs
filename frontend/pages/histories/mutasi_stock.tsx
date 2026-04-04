import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import {
  compareAsc,
  format,
  subDays,
  lastDayOfMonth,
  startOfMonth,
  startOfWeek,
  lastDayOfWeek,
  endOfDay,
  startOfDay,
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import Cookies from "js-cookie";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function MutasiStock() {
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const [data_mutasi, setdatamutasi]: any = useState([]);
  const [data_brand, setdatabrand]: any = useState([]);


  useEffect(() => {
    loaddatamutasi(date, user_login, user_role, user_store, Brand);
    // getbrand();
    return () => { };
  }, []);

  const [role, setRole] = useState(Cookies.get("auth_role"));
  const [area, setIdstore] = useState(Cookies.get("auth_store"));
  const [Brand, setBrand] = useState("all");


  async function loaddatamutasi(date: any, user_login: any, user_role: any, user_store: any, Brand: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/getmutation`,
      data: {
        date: date,
        user_login: user_login,
        user_role: user_role,
        user_store: user_store,
        Brand: Brand,
      },
    })
      .then(function (response) {
        setdatamutasi(response.data.result[0]);
        getbrand()
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getbrand() {
    setisLoading(true);
    await axios({
      method: "get",
      url: `https://api.gudangsandal.com/v1/getso_brand`,
    })
      .then(function (response) {
        setdatabrand(response.data.result);
        console.log(response.data.result);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const list_brand: any = [];
  if (!isLoading) {
    data_brand.map((brand: any, index: number) => {
      list_brand.push(
        <option key={index} value={brand.id_area}>{brand.brand}</option>
      )
    })
  }

  let created_at = format(new Date(), 'h:mm:ss a');

  if ("SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role")) {
    var columns: any = [
      {
        name: "No.",
        selector: (row: { id: any }) => row.id,
        width: "3.8%",
      },
      {
        name: "Tanggal",
        selector: (row: { tanggal: any }) => format(new Date(row.tanggal), 'dd-MM-yyyy'),
        width: "5%",
      },
      {
        name: "Jam",
        selector: (row: { created_at: any }) => row.created_at,
        width: "5%",
      },
      {
        name: "Mutasi",
        selector: (row: { mutasi: any }) => row.mutasi,
        width: "10%",
      },
      {
        name: "ID Pesanan",
        selector: (row: { id_pesanan: any }) => row.id_pesanan,
        sortable: true,
        width: "9%",
      },
      {
        name: "ID Produk",
        selector: (row: { id_produk: any }) => row.id_produk,
        width: "7%",
      },
      {
        name: "Produk",
        selector: (row: { produk: any }) => row.produk,
        width: "14%",
      },
      {
        name: "ID PO",
        selector: (row: { id_po: any }) => row.id_po,
        width: "5%",
      },
      {
        name: "Size",
        selector: (row: { size: any }) => row.size,
        width: "5%",
      },
      {
        name: "Qty",
        selector: (row: { qty: any }) => row.qty,
        width: "5%",
      },
      {
        name: "Warehouse",
        selector: (row: { id_ware: any }) => row.id_ware,
        width: "7%",
      },
      {
        name: "Store",
        selector: (row: { id_store: any }) => row.id_store,
        width: "7%",
      },
      {
        name: "Source Transfer",
        selector: (row: { source: any }) => row.source,
        width: "12%",
      },
      {
        name: "Users",
        selector: (row: { users: any }) => row.users,
        width: "5%",
      },
    ];
  } else {
    var columns: any = [
      {
        name: "No.",
        selector: (row: { id: any }) => row.id,
        width: "3.8%",
      },
      {
        name: "Tanggal",
        selector: (row: { tanggal: any }) => row.tanggal,
        width: "10%",
      },
      {
        name: "Jam",
        selector: (row: { created_at: any }) => row.created_at,
        width: "10%",
      },
      {
        name: "Mutasi",
        selector: (row: { mutasi: any }) => row.mutasi,
        width: "10%",
      },
      {
        name: "ID Pesanan",
        selector: (row: { id_pesanan: any }) => row.id_pesanan,
        sortable: true,
        width: "9%",
      },
      {
        name: "ID Produk",
        selector: (row: { id_produk: any }) => row.id_produk,
        width: "7%",
      },
      {
        name: "Produk",
        selector: (row: { produk: any }) => row.produk,
        width: "20%",
      },
      {
        name: "ID PO",
        selector: (row: { id_po: any }) => row.id_po,
        width: "5%",
      },
      {
        name: "Size",
        selector: (row: { size: any }) => row.size,
        width: "5%",
      },
      {
        name: "Qty",
        selector: (row: { qty: any }) => row.qty,
        width: "5%",
      },
      {
        name: "Warehouse",
        selector: (row: { id_ware: any }) => row.id_ware,
        width: "7%",
      },
      // {
      //   name: "Store",
      //   selector: (row: { id_store: any }) => row.id_store,
      //   width: "7%",
      // },
      // {
      //   name: "Source Transfer",
      //   selector: (row: { source: any }) => row.source,
      //   width: "12%",
      // },
      {
        name: "Users",
        selector: (row: { users: any }) => row.users,
        width: "5%",
      },
    ];
  }



  const list_expense: any = [];

  const [value, setValues]: any = useState();

  const handleValueChange = (newValue: any) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate(startDate + " to " + lastDate);
    } else {
      setDate(newValue.startDate + " to " + newValue.endDate);
      loaddatamutasi(newValue.startDate + " to " + newValue.endDat, user_login, user_role, user_store, Brand);
    }

    setValues(newValue);
  };
  const startDate = format(startOfDay(new Date()), "yyyy-MM-dd");
  const lastDate = format(endOfDay(new Date()), "yyyy-MM-dd");
  const [date, setDate] = useState(startDate + " to " + lastDate);
  const [dateNows, setdateNows] = useState(startDate + " to " + lastDate);

  const today: any = "Hari Ini";
  const yesterday: any = "Kemarin";
  const currentMonth: any = "Bulan ini";
  const pastMonth: any = "Bulan Kemarin";
  const mingguinistart: any = format(startOfWeek(new Date()), "yyyy-MM-dd");
  const mingguiniend: any = format(lastDayOfWeek(new Date()), "yyyy-MM-dd");
  const break2month: any = format(subDays(lastDayOfWeek(new Date()), 66), "yyyy-MM-dd");
  const minggukemarinstart: any = format(
    subDays(startOfWeek(new Date()), 7),
    "yyyy-MM-dd"
  );
  const minggukemarinend: any = format(
    subDays(lastDayOfWeek(new Date()), 7),
    "yyyy-MM-dd"
  );
  const todayDate: any = format(new Date(), "yyyy-MM-dd");

  const [Store, setStore] = useState("all");
  const [user_login, setFilter_user_login] = useState(Cookies.get("auth_name"));
  const [user_role, setFilter_user_role] = useState(Cookies.get("auth_role"));
  const [user_store, setFilter_user_store] = useState(Cookies.get("auth_store"));
  // const { data, error, mutate } = useSWR(`https://apitest.lokigudang.com/getmutation/${Store}/${date}`, fetcher);

  // const { data: store_data, error: store_error, isLoading: store_isLoading, mutate: store_mutate } = useSWR(`https://apitest.lokigudang.com/getstore`, fetcher);
  // const list_store: any = [];
  // if (!store_isLoading && !store_error) {
  //     store_data.data_store.map((store: any, index: number) => {
  //         list_store.push(
  //             <option key={index} value={store.id_store}>{store.store}</option>
  //         )
  //     })
  // }

  if (!isLoading) {
    var total_transaksi = data_mutasi.total_transaksi;
    var stock_awal =
      data_mutasi.stock_awal && data_mutasi.stock_awal.length > 0
        ? data_mutasi.stock_awal.stok_akhir
        : (data_mutasi.stock_awal && data_mutasi.stock_awal.length === null)
          ? data_mutasi.stock_awal.stok_akhir
          : "0";
    var tanggal_settle =
      data_mutasi.stock_awal.length > 0 ? data_mutasi.stock_awal.tanggal : "0";
    var total_barangmasuk = data_mutasi.total_barangmasuk;
    var total_in_retur = data_mutasi.total_in_retur;
    var total_in_refund = data_mutasi.total_in_refund;
    var total_out_sales = data_mutasi.total_out_sales;
    var total_out_retur = data_mutasi.total_out_retur;
    var total_in_cancel = data_mutasi.total_in_cancel;
    var total_out_sales_online = data_mutasi.total_out_sales_online;
    var total_out_sales_toko = data_mutasi.total_out_sales_toko;
    var live_stok = data_mutasi.live_stok;
    var total_in_defect = data_mutasi.total_in_defect;
    var total_out_defect = data_mutasi.total_out_defect;
    var totalStokAkhir = data_mutasi.totalStokAkhir;

    data_mutasi.data_expense.map((data_expense: any, index: number) => {
      return list_expense.push({
        id: index + 1,
        mutasi: (
          <div>
            {(function () {
              if (data_expense.mutasi === "SALES ONLINE") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-up text-center text-base pt-1 text-green-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-green-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-green-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "SALES RETAIL") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-up text-center text-base pt-1 text-green-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-green-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-green-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "ADD_PRODUK") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-up text-center text-base pt-1 text-blue-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-blue-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-blue-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "RETUR_OUT") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-up text-center text-base pt-1 text-blue-400 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-blue-400 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-blue-400 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "RETUR_IN") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-red-700 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-red-700 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-red-700 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "RESTOCK") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-lime-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-lime-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-lime-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "TRANSFER IN") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-lime-700 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-lime-700 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-lime-700 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "TRANSFER OUT") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-red-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-red-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-red-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "DEFECT IN") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-lime-700 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-lime-700 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-lime-700 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "DEFECT OUT") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-red-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-red-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-red-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "CHANGE PRODUCT IN") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-orange-600 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-orange-600 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-orange-600 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else if (data_expense.mutasi === "CHANGE PRODUCT OUT") {
                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-orange-600 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-orange-600 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-orange-600 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              } else {

                return (
                  <div className="flex flex-row items-center gap-1.5">
                    <i className="fi fi-rr-arrow-circle-down text-center text-base pt-1 text-red-500 font-bold"></i>
                    <div className="grid grid-rows-2 py-1">
                      <div className="text-red-500 font-bold text-xs">
                        {data_expense.mutasi}
                      </div>
                      <div className="text-red-500 font-normal text-xs">
                        {data_expense.id_mutasi}
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        ),
        tanggal: data_expense.tanggal,
        created_at: format(new Date(data_expense.created_at), 'h:mm:ss a'),
        id_pesanan: data_expense.id_pesanan,
        id_ware: data_expense.warehouse,
        id_store: data_expense.store > 0 ? "-" : data_expense.store,
        id_produk: data_expense.id_produk,
        produk: data_expense.produk,
        id_po: data_expense.id_po,
        size: data_expense.size,
        qty: data_expense.qty,
        source: (
          <div className="grid grid-rows-2 ">
            {/* <div>{data_expense.source}</div> */}
            <div>{data_expense.id_sup}</div>
          </div>
        ),
        users: data_expense.users,
      });
    });
  }

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = list_expense.filter((list_expense: any) => {
    return (
      list_expense.id_pesanan
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_expense.produk
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_expense.users
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase())
    );
  });

  const CustomMaterialPagination = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    onChangeRowsPerPage,
    currentPage,
  }: any) => (
    <div className="bg-white border-t px-3 py-2 flex flex-wrap justify-start h-14 items-center">
      <div className="grow">
        Menampilkan {String(currentPage)}-{String(Math.ceil(rowCount / 25))}{" "}
        dari {String(rowCount)} items
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal"
          onClick={({ }) =>
            onChangePage(currentPage === 1 ? currentPage : currentPage - 1)
          }
        >
          Back
        </button>
        <button
          className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal"
          onClick={({ }) => onChangePage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );

  async function settlement_stock(live_stok: any, area: any) {
    console.log(live_stok);
    console.log(area);

    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/settlement_stock`,
      data: {
        live_stok: live_stok,
        area: area,
      },
    })
      .then(function (response) {
        console.log(response.data);
        if (response.data === "SETTLE_ADA") {
          toast.warning("Gagal Settle, Sudah ada Transaksi Hari Ini", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
          });
        } else {
          toast.success("Data berhasil Update", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // async function settlement_stock() {
  //     await axios.post(`https://api.gudangsandal.com/v1/settlement_stock/${live_stok}`)
  //         .then(function (response) {
  //             console.log(response);
  //             // mutate();

  //         });
  // }

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center h-12 border-b border-[#2125291A] pb-5 mb-5">
        <button
          className="bg-gray-200 p-3 rounded-lg mr-6 "
          onClick={() => router.back()}
        >
          <fa.FaChevronLeft size={13} />
        </button>
        <span className="font-bold text-xl">Mutasi Stock</span>
      </div>
      {/* <div className="font-bold text-2xl border-b border-[#2125291A] h-12 mb-5">
        Pengeluaran Toko
      </div> */}

      <ToastContainer className="mt-[50px]" />

      <div className="flex flex-wrap items-center content-center mb-4">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Search Product or ID Order"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <button
            type="button"
            className="rounded-r-lg bg-white h-[45px] text-gray-700 font-medium px-5"
          >
            <div className="my-auto">
              <fa.FaSearch size={17} className="text-gray-700" />
            </div>
          </button>
        </div>
        {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
          <>
            <div className="h-[45px] basis-1/6 ml-3 text-sm border-0 text-gray-700 focus:outline-none rounded-l-lg" >
              <select
                value={Brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  loaddatamutasi(date, user_login, user_role, user_store, e.target.value);
                }}
                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                <option value="all">All Brand</option>
                {list_brand}
              </select>
            </ div>
          </>
        ) : null}

        {/* <div className="flex text-sm ml-3 flex-row items-center w-[20%] justify-end">
                    <select
                        value={Store}
                        onChange={(e) => {
                            setStore(e.target.value);
                        }}
                        className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                        <option value="all">All Store</option>
                        {list_store}
                    </select>
                </div> */}

        <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
            <>
              <Datepicker
                displayFormat="DD-MM-YYYY"
                primaryColor="black"
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
                showFooter={true}
                configs={{
                  shortcuts: {
                    today: today,
                    yesterday: yesterday,
                    mingguini: {
                      text: "Minggu Ini",
                      period: {
                        start: mingguinistart,
                        end: mingguiniend,
                      },
                    },
                    minggukemarin: {
                      text: "Minggu Kemarin",
                      period: {
                        start: minggukemarinstart,
                        end: minggukemarinend,
                      },
                    },
                    currentMonth: currentMonth,
                    pastMonth: pastMonth,
                    alltime: {
                      text: "Semua",
                      period: {
                        start: "2023-01-01",
                        end: todayDate,
                      },
                    },
                  },
                  footer: {
                    cancel: "Close",
                    apply: "Apply",
                  },
                }}
                placeholder="Pilih Tanggal"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>) : (<>
              <Datepicker
                displayFormat="DD-MM-YYYY"
                primaryColor="blue"
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
                showFooter={true}
                minDate={new Date(break2month)}
                configs={{
                  shortcuts: {
                    today: today,
                    yesterday: yesterday,
                    mingguini: {
                      text: "Minggu Ini",
                      period: {
                        start: mingguinistart,
                        end: mingguiniend,
                      },
                    },
                    minggukemarin: {
                      text: "Minggu Kemarin",
                      period: {
                        start: minggukemarinstart,
                        end: minggukemarinend,
                      },
                    },
                    currentMonth: currentMonth,
                    pastMonth: pastMonth,
                    // alltime: {
                    //   text: "Semua",
                    //   period: {
                    //     start: "2023-01-01",
                    //     end: todayDate,
                    //   },
                    // },
                  },
                  footer: {
                    cancel: "Close",
                    apply: "Apply",
                  },
                }}
                placeholder="Pilih Tanggal"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>)}
        </div>

        {/* <div className="ml-auto flex flex-row items-center justify-end">
                    <button className="cursor-pointer ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Tambah Pengeluaran
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </div> */}
      </div>

      <div>
        {"SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role") ||
          "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
          <>
            <div className="grid grid-cols-3 gap-5 grow h-auto content-start mb-1">
              <div className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white flex px-5 py-5 items-center group">
                <div className="flex flex-1 items-center">
                  <div className="grid grid-rows-3 h-full items-center w-[60%]">
                    <div className="flex content-center items-center justify-start">
                      <div className="grow">
                        <Image
                          className="w-[36px] h-[36px] max-w-full max-h-full"
                          src="/packages.png"
                          alt="Picture of the author"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>

                    <div className="font-medium text-sm text-gray-400">
                      Previous Stock (Settle {tanggal_settle})
                    </div>

                    <div className="font-bold text-xl text-black">
                      {totalStokAkhir} Pcs
                    </div>
                  </div>

                  <div className="grid grid-rows-2 gap-1">
                    {"HEAD-AREA" === Cookies.get("auth_role") || "SUPER-ADMIN" === Cookies.get("auth_role") ?
                      (
                        <>
                          <span className="font-bold text-sm text-gray-500">
                            LIVE STOCK {live_stok} PCS
                          </span>

                          <button
                            type="button"
                            className={`${date === dateNows
                              ? "bg-blue-600 hover:bg-blue-800"
                              : "bg-gray-500"
                              } shadow rounded-lg h-[35px] w-full text-white content-center -mt-2`}
                            disabled={date === dateNows ? false : true}
                            onClick={() => {
                              settlement_stock(live_stok, area);
                            }}
                          >
                            Settle Stock
                          </button>
                          <span className="font-bold text-sm text-gray-500 text-center italic">
                            {format(new Date(startDate), 'dd-MM-yyyy')}
                          </span>
                        </>
                      ) :
                      null
                    }

                  </div>
                </div>
              </div>

              <div className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white flex px-5 py-5 items-center group">
                <div className="grid grid-rows-3 h-full items-center">
                  <div className="flex content-center items-center justify-start">
                    <div className="grow">
                      <Image
                        className="w-[36px] h-[36px] max-w-full max-h-full"
                        src="/clock.png"
                        alt="Picture of the author"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>

                  <div className="font-medium text-sm text-gray-400">
                    Total Transaction
                  </div>

                  <div className="font-bold text-xl text-black">
                    {total_transaksi ? total_transaksi : 0} Transaction
                  </div>
                </div>
              </div>

              <div className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white flex px-5 py-5 items-center group">
                <div className="grid grid-rows-3 h-full items-center">
                  <div className="flex content-center items-center justify-start">
                    <div className="grow">
                      <Image
                        className="w-[36px] h-[36px] max-w-full max-h-full"
                        src="/inventory.png"
                        alt="Picture of the author"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>

                  <div className="font-medium text-sm text-gray-400">
                    Incoming goods
                  </div>

                  <div className="font-bold text-xl text-black">
                    {total_barangmasuk ? total_barangmasuk : 0} Pcs
                  </div>
                </div>
              </div>
            </div>
          </>) : null}
        <div className="flex flex-row gap-5 grow h-auto content-start mb-4">
          <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
            <div className="grid grid-rows-3 h-full items-center">
              <div className="flex content-center items-center justify-start">
                <div className="grow">
                  <Image
                    className="w-[36px] h-[36px] max-w-full max-h-full"
                    src="/download.png"
                    alt="Picture of the author"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="font-medium text-sm text-gray-400">
                Cancel/Deleted Order
              </div>

              <div className="font-bold text-xl text-black">
                {total_in_cancel ? total_in_cancel : 0} Pcs
              </div>
            </div>
          </a>

          <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
            <div className="grid grid-rows-3 h-full items-center">
              <div className="flex content-center items-center justify-start">
                <div className="grow">
                  <Image
                    className="w-[36px] h-[36px] max-w-full max-h-full"
                    src="/download.png"
                    alt="Picture of the author"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="font-medium text-sm text-gray-400">
                Refund In
              </div>

              <div className="font-bold text-xl text-black">
                {total_in_refund ? total_in_refund : 0} Pcs
              </div>
            </div>
          </a>

          <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
            <div className="grid grid-rows-3 h-full items-center">
              <div className="flex content-center items-center justify-start">
                <div className="grow">
                  <Image
                    className="w-[36px] h-[36px] max-w-full max-h-full"
                    src="/download.png"
                    alt="Picture of the author"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="font-medium text-sm text-gray-400">
                Return In
              </div>

              <div className="font-bold text-xl text-black">
                {total_in_retur ? total_in_retur : 0} Pcs
              </div>
            </div>
          </a>

          <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
            <div className="grid grid-rows-3 h-full items-center">
              <div className="flex content-center items-center justify-start">
                <div className="grow">
                  <Image
                    className="w-[36px] h-[36px] max-w-full max-h-full"
                    src="/up-arrow.png"
                    alt="Picture of the author"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="font-medium text-sm text-gray-400">
                Retur Out
              </div>

              <div className="font-bold text-xl text-black">
                {total_out_retur ? total_out_retur : 0} Pcs
              </div>
            </div>
          </a>

          <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
            <div className="grid grid-rows-3 h-full items-center">
              <div className="flex content-center items-center justify-start">
                <div className="grow">
                  <Image
                    className="w-[36px] h-[36px] max-w-full max-h-full"
                    src="/download.png"
                    alt="Picture of the author"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <div className="font-medium text-sm text-gray-400">
                Defect In
              </div>

              <div className="font-bold text-xl text-black">
                {total_in_defect ? total_in_defect : 0} Pcs
              </div>
            </div>
          </a>

          {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
            <>
              <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
                <div className="grid grid-rows-3 h-full items-center">
                  <div className="flex content-center items-center justify-start">
                    <div className="grow">
                      <Image
                        className="w-[36px] h-[36px] max-w-full max-h-full"
                        src="/up-arrow.png"
                        alt="Picture of the author"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>

                  <div className="font-medium text-sm text-gray-400">Sales Online</div>

                  <div className="font-bold text-xl text-black">
                    {total_out_sales_online ? total_out_sales_online : 0} Pcs
                  </div>
                </div>
              </a>

              <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
                <div className="grid grid-rows-3 h-full items-center">
                  <div className="flex content-center items-center justify-start">
                    <div className="grow">
                      <Image
                        className="w-[36px] h-[36px] max-w-full max-h-full"
                        src="/up-arrow.png"
                        alt="Picture of the author"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>

                  <div className="font-medium text-sm text-gray-400">Sales Store Retail</div>

                  <div className="font-bold text-xl text-black">
                    {total_out_sales_toko ? total_out_sales_toko : 0} Pcs
                  </div>

                </div>
              </a>
            </>) : (<>
              {"OFFLINE STORE" === Cookies.get("auth_channel") ? (
                <>
                  <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
                    <div className="grid grid-rows-3 h-full items-center">
                      <div className="flex content-center items-center justify-start">
                        <div className="grow">
                          <Image
                            className="w-[36px] h-[36px] max-w-full max-h-full"
                            src="/up-arrow.png"
                            alt="Picture of the author"
                            width={100}
                            height={100}
                          />
                        </div>
                      </div>

                      <div className="font-medium text-sm text-gray-400">Sales Store Retail</div>

                      <div className="font-bold text-xl text-black">
                        {total_out_sales_toko ? total_out_sales_toko : 0} Pcs
                      </div>

                    </div>
                  </a>
                </>) : null}
              {"OFFLINE STORE" != Cookies.get("auth_channel") ? (
                <>
                  <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-[90%] bg-white px-5 py-5 group">
                    <div className="grid grid-rows-3 h-full items-center">
                      <div className="flex content-center items-center justify-start">
                        <div className="grow">
                          <Image
                            className="w-[36px] h-[36px] max-w-full max-h-full"
                            src="/up-arrow.png"
                            alt="Picture of the author"
                            width={100}
                            height={100}
                          />
                        </div>
                      </div>

                      <div className="font-medium text-sm text-gray-400">Sales Online</div>

                      <div className="font-bold text-xl text-black">
                        {total_out_sales_online ? total_out_sales_online : 0} Pcs
                      </div>
                    </div>
                  </a>
                </>) : null}
            </>)}
        </div>
      </div>

      <div className="mb-20">
        <DataTable
          className="items-center"
          columns={columns}
          data={filteredItems}
          pagination
          paginationComponent={CustomMaterialPagination}
          paginationPerPage={25}
          fixedHeader={true}
        />
      </div>
    </div>
  );
}