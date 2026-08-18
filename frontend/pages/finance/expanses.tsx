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
  startOfDay,
  endOfDay,
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
import Cookies from "js-cookie";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
let Numbering = new Intl.NumberFormat("id-ID");

export default function Expense() {
  const router = useRouter();

  const [isLoading, setisLoading]: any = useState(true);
  const [data_expense, setdataexpense] = useState([]);
  const [data_store, setdatastore] = useState([]);
  const [detail_expense, setdetailexpense] = useState(0);
  const [totals_amount, settotalamount] = useState(0);

  useEffect(() => {
    loaddataexpense(Store, date, Role, area);
    getstore(Role, area);
  }, []);

  async function loaddataexpense(id_store: any, tanggal: any, Role: any, area: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/getexpense`,
      data: {
        id_store: id_store,
        date: tanggal,
        role: Role,
        area: area,
      },
    })
      .then(function (response) {
        setdataexpense(response.data.result.data_expense);
        setdetailexpense(response.data.result.total_transaksi);
        settotalamount(response.data.result.total_amount);
        setisLoading(false);
        // console.log(response.data.result.total_amount)
        // console.log(tanggal)
        // console.log(id_store)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function getstore(Role: any, area: any) {
    await axios
      .post(`https://api.gudangsandal.com/v1/getstoreexpense`, {
        role: Role,
        area: area,
      })
      .then(function (response) {
        setdatastore(response.data.result);
        if (
          "SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role")
        ) {
        } else {
          setValue("id_store", response.data.result[0].id_store);
          loaddataexpense(Store, date, Role, area);
        }
      });
  }

  const columns: any = [
    {
      name: "Tanggal",
      selector: (row: { tanggal: any }) => row.tanggal,
    },
    {
      name: "ID Expense",
      selector: (row: { id_expense: any }) => row.id_expense,
    },
    {
      name: "Deskripsi",
      selector: (row: { deskripsi: any }) => row.deskripsi,
    },
    {
      name: "Store",
      selector: (row: { id_store: any }) => row.id_store,
    },
    {
      name: "Amount",
      selector: (row: { amount: any }) => row.amount,
    },
    {
      name: "Quantity",
      selector: (row: { qty: any }) => row.qty,
    },
    {
      name: "Total Amount",
      selector: (row: { total_amount: any }) => row.total_amount,
    },
    {
      name: "Action",
      selector: (row: { action: any }) => row.action,
    },
  ];

  const list_expense: any = [];

  const [value, setValues]: any = useState();
  const handleValueChange = (newValue: any) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate(startDate + " to " + lastDate);
    } else {
      setDate(newValue.startDate + " to " + newValue.endDate);
      loaddataexpense(Store, newValue.startDate + " to " + newValue.endDate, Role, area);
    }

    setValues(newValue);
  };
  const startDate = format(startOfDay(new Date()), "yyyy-MM-dd");
  const lastDate = format(endOfDay(new Date()), "yyyy-MM-dd");
  const [date, setDate] = useState(startDate + " to " + lastDate);

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

  const list_store: any = [];
  if (!isLoading) {
    data_store.map((store: any, index: number) => {
      list_store.push(
        <option key={index} value={store.id_store}>
          {store.store}
        </option>
      );
    });
  }

  const {
    register,
    resetField,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      deskripsi: "",
      amount: 0,
      qty: 1,
      total_amount: 0,
      id_store: "ALL-STORE",
      edit_id_store: "ALL-STORE",
      edit_deskripsi: "",
      edit_amount: 0,
      edit_qty: 1,
      edit_total_amount: 0,
    },
  });

  const [showModal, setShowModal] = React.useState(false);
  const [delModal, setdelModal] = React.useState(false);
  const [editModal, seteditModal] = React.useState(false);
  const [Deskripsi, setDeskripsi] = React.useState(null);
  const [id, setid] = React.useState(null);

  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [area, setarea] = useState((Cookies.get("auth_store")));


  function hitungAmount() {
    var jumlah = getValues("amount") * getValues("qty");
    setValue("total_amount", jumlah);
  }

  function hitungAmountedit() {
    var jumlah = getValues("edit_amount") * getValues("edit_qty");
    setValue("edit_total_amount", jumlah);
  }

  const onSubmit = async (data: any) => {
    await axios
      .post("https://api.gudangsandal.com/v1/addexpense", data)
      .then(function (response) {
        loaddataexpense(Store, date, Role, area);
        console.log(response.data);
      });

    toast.success("Data telah disimpan", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    resetField("deskripsi");
    resetField("amount");
    resetField("qty");
    resetField("total_amount");
    setShowModal(false);
  };

  function showeditModal(
    id: any,
    deskripsi: any,
    amount: any,
    qty: any,
    total_amount: any,
    index: number,
    id_store: any
  ) {
    setid(id);
    setValue("edit_deskripsi", deskripsi);
    setValue("edit_amount", amount);
    setValue("edit_qty", qty);
    setValue("edit_total_amount", total_amount);
    setValue("edit_id_store", id_store);
    seteditModal(true);
  }

  const onSubmitUpdate = async (data: any) => {
    await axios
      .post(`https://api.gudangsandal.com/v1/editexpense`, { data, id })
      .then(function (response) {
        // console.log(response.data);
        loaddataexpense(Store, date, Role, area);
      });

    toast.success("Data telah diupdate", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    seteditModal(false);
  };

  function showdeleteModal(id: any, index: number) {
    setid(id);
    setDeskripsi(list_expense[index].deskripsi);
    setdelModal(true);
  }

  async function deleteData() {
    await axios
      .post(`https://api.gudangsandal.com/v1/deleteexpense`, { id })
      .then(function (response) {
        // console.log(response.data);
        loaddataexpense(Store, date, Role, area);
      });

    toast.success("Data berhasil dihapus", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setdelModal(false);
  }

  if (!isLoading) {
    data_expense.map((data_expense: any, index: number) => {
      return list_expense.push({
        id: index,
        tanggal: data_expense.tanggal,
        id_expense: data_expense.id_expense,
        deskripsi: data_expense.deskripsi,
        amount: Rupiah.format(data_expense.amount),
        qty: data_expense.qty,
        total_amount: Rupiah.format(data_expense.total_amount),
        id_store:
          data_expense.id_store === "ALL-STORE"
            ? "ALL-STORE"
            : data_expense.store,
        action: (
          <div className="flex flex-warp gap-4">
            <button
              className="text-blue-500"
              onClick={() =>
                showeditModal(
                  data_expense.id,
                  data_expense.deskripsi,
                  data_expense.amount,
                  data_expense.qty,
                  data_expense.total_amount,
                  index,
                  data_expense.id_store
                )
              }
            >
              <i className="fi fi-rr-edit text-center text-xl"></i>
            </button>
            <button
              className="text-red-500"
              onClick={() => showdeleteModal(data_expense.id, index)}
            >
              <i className="fi fi-rr-trash text-center text-xl"></i>
            </button>
          </div>
        ),
      });
    });
  }

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = list_expense.filter((list_expense: any) => {
    return (
      list_expense.tanggal
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_expense.id_expense
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_expense.deskripsi
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_expense.id_store
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
        Menampilkan {String(currentPage)}-{String(Math.ceil(rowCount / 20))}{" "}
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

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center h-12 border-b border-[#2125291A] pb-5 mb-5">
        <button
          className="bg-gray-200 p-3 rounded-lg mr-6 "
          onClick={() => router.back()}
        >
          <fa.FaChevronLeft size={13} />
        </button>
        <span className="font-bold text-xl">Pengeluaran Toko</span>
      </div>

      <div className="flex flex-wrap items-center content-center mb-4">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Cari data Expense"
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

        <div className="flex text-sm ml-3 flex-row items-center w-[20%] justify-end">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ||
            "HEAD-AREA" === Cookies.get("auth_role") ? (
            <>
              <select
                value={Store}
                onChange={(e) => {
                  setStore(e.target.value);
                  loaddataexpense(e.target.value, date, Role, area);
                }}
                className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
              >
                <option value="ALL-STORE">All Store</option>
                {list_store}
              </select>
            </>
          ) : (
            <>
              <select
                value={Store}
                onChange={(e) => {
                  setStore(e.target.value);
                }}
                className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
              >
                {list_store}
              </select>
            </>
          )}
        </div>

        <div className="shadow rounded-lg ml-3 w-[290px] flex flex-row items-center justify-end">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
            <>
              <Datepicker
                displayFormat="DD-MM-YYYY"
                primaryColor="blue"
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
                showFooter={true}
                // minDate={new Date(break2month)}
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

        <div className="ml-auto flex flex-row items-center justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
          >
            Tambah Pengeluaran
            <div className="my-auto">
              <fa.FaPlus size={13} className="text-white" />
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 grow h-auto content-start mb-1">
        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">
          <div className="grid grid-rows-3 h-full items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/shopping-cart.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>
            </div>

            <div className="font-medium text-sm text-gray-400">
              Total Transaksi
            </div>

            <div className="font-bold text-xl text-black">
              {detail_expense ? detail_expense : 0} Transaksi
            </div>
          </div>
        </a>

        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">
          <div className="grid grid-rows-3 h-full items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/expenses.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>
            </div>

            <div className="font-medium text-sm text-gray-400">
              Total Amount
            </div>

            <div className="font-bold text-xl text-black">
              {totals_amount ? Rupiah.format(totals_amount) : 0}
            </div>
          </div>
        </a>
      </div>

      <div className="mb-20">
        <DataTable
          className="items-center"
          columns={columns}
          data={filteredItems}
          pagination
          paginationComponent={CustomMaterialPagination}
          paginationPerPage={20}
        />
      </div>

      {
        showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <span className="text-xl font-semibold">
                      Tambah Data Expense
                    </span>
                  </div>
                  {/*body*/}
                  <div className="relative p-3 px-4 flex-auto">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">Tanggal</label>
                      <Flatpickr
                        className="text-start h-full rounded-lg w-full py-2.5 px-5 text-gray-700 focus:outline-none border"
                        value={date}
                        placeholder="Pilih Tanggal Order"
                        options={{
                          mode: "single",
                          dateFormat: "Y-m-d",
                          enableTime: false,
                          // disable: [
                          //   function (date) {
                          //     return !(date.getDate() % 8);
                          //   }
                          // ]
                          onClose: function (selectedDates, dateStr, instance) {
                            setDate(dateStr);
                          },
                        }}

                      />
                    </div> */}
                      <div className="mt-0">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Store
                        </label>
                        {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                          "HEAD-AREA" === Cookies.get("auth_role") ? (
                          <>
                            <select
                              className={`${errors.id_store ? "border-red-500 border-2" : "border"
                                } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              {...register("id_store", { required: true })}
                            >
                              <>
                                <option value="ALL-STORE" >All Store</option>
                              </>
                              {list_store}
                            </select>
                            {errors.id_store && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <select
                              className={`${errors.id_store ? "border-red-500 border-2" : "border"
                                } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              {...register("id_store", { required: true })}
                            >
                              {list_store}
                            </select>
                            {errors.id_store && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Deskripsi
                        </label>
                        <input
                          className={`${errors.deskripsi
                            ? "border-red-500 border-2"
                            : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="text"
                          placeholder="Masukan Deskripsi"
                          // ref={req_brand}
                          defaultValue=""
                          {...register("deskripsi", { required: true })}
                        />
                        {errors.deskripsi && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Amount
                        </label>
                        <input
                          className={`${errors.amount ? "border-red-500 border-2" : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="number"
                          placeholder="Masukan Amount"
                          defaultValue="0"
                          prefix="Rp "
                          {...register("amount", {
                            // required: true,
                            // onChange: () => hitungAmount(),
                            required: true, onChange: (e: any) => {
                              if (e.target.value === "") {
                                var n = 0;
                              } else {
                                var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                              }
                              setValue(`amount`, n),
                                hitungAmount()
                            }
                          })}
                        />
                        {errors.amount && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Quantity
                        </label>
                        <input
                          className={`${errors.qty ? "border-red-500 border-2" : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="number"
                          placeholder="Masukan Quantity"
                          // ref={req_brand}
                          defaultValue=""
                          {...register("qty", {
                            required: true, onChange: (e: any) => {
                              if (e.target.value === "") {
                                var n = 0;
                              } else {
                                var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                              }
                              setValue(`qty`, n),
                                hitungAmount()
                            }
                          })}
                        />
                        {errors.qty && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Total Amount
                        </label>
                        <input
                          className={`${errors.total_amount
                            ? "border-red-500 border-2"
                            : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="number"
                          readOnly
                          placeholder="Masukan Total Amount"
                          // ref={req_brand}
                          defaultValue=""
                          {...register("total_amount", { required: true })}
                        />
                        {errors.total_amount && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        resetField("deskripsi");
                        resetField("amount");
                        resetField("qty");
                        resetField("total_amount");
                        setShowModal(false);
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null
      }

      {
        editModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <span className="text-xl font-semibold">
                      Edit Data Expense
                    </span>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                      {/* <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">Tanggal</label>
                      <Flatpickr
                        className="text-start h-full rounded-lg w-full py-2.5 px-5 text-gray-700 focus:outline-none border"
                        value={date}
                        placeholder="Pilih Tanggal Order"
                        options={{
                          mode: "single",
                          dateFormat: "Y-m-d",
                          enableTime: false,
                          // disable: [
                          //   function (date) {
                          //     return !(date.getDate() % 8);
                          //   }
                          // ]
                          onClose: function (selectedDates, dateStr, instance) {
                            setDate(dateStr);
                          },
                        }}

                      />
                    </div> */}
                      <div className="mt-0">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Deskripsi
                        </label>
                        <input
                          className={`${errors.edit_deskripsi
                            ? "border-red-500 border-2"
                            : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="text"
                          placeholder="Masukan Deskripsi"
                          // ref={req_brand}
                          defaultValue=""
                          {...register("edit_deskripsi", { required: true })}
                        />
                        {errors.edit_deskripsi && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Store
                        </label>

                        {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                          "HEAD-AREA" === Cookies.get("auth_role") ? (
                          <>
                            <select
                              className={`${errors.edit_id_store ? "border-red-500 border-2" : "border"
                                } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              {...register("edit_id_store", { required: true })}
                            >
                              <>
                                <option value="ALL-STORE">All Store</option>
                              </>
                              {list_store}
                            </select>
                            {errors.edit_id_store && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <select
                              className={`${errors.edit_id_store ? "border-red-500 border-2" : "border"
                                } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              {...register("edit_id_store", { required: true })}
                            >
                              {list_store}
                            </select>
                            {errors.edit_id_store && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Amount
                        </label>
                        <input
                          className={`${errors.edit_amount
                            ? "border-red-500 border-2"
                            : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="number"
                          placeholder="Masukan Amount"
                          // ref={req_brand}
                          defaultValue=""
                          {...register("edit_amount", {
                            required: true, onChange: (e: any) => {
                              if (e.target.value === "") {
                                var n = 0;
                              } else {
                                var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                              }
                              setValue(`edit_amount`, n),
                                hitungAmountedit()
                            }
                          })}
                        />
                        {errors.edit_amount && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Quantity
                        </label>
                        <input
                          className={`${errors.edit_qty ? "border-red-500 border-2" : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="number"
                          placeholder="Masukan Quantity"
                          // ref={req_brand}
                          defaultValue=""
                          {...register("edit_qty", {
                            required: true, onChange: (e: any) => {
                              if (e.target.value === "") {
                                var n = 0;
                              } else {
                                var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                              }
                              setValue(`edit_qty`, n),
                                hitungAmountedit()
                            }
                          })}
                        />
                        {errors.edit_qty && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Total Amount
                        </label>
                        <input
                          className={`${errors.edit_total_amount
                            ? "border-red-500 border-2"
                            : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          type="number"
                          placeholder="Masukan Total Amount"
                          readOnly
                          // ref={req_brand}
                          defaultValue=""
                          {...register("edit_total_amount", { required: true })}
                        />
                        {errors.edit_total_amount && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        seteditModal(false);
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleSubmit(onSubmitUpdate)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null
      }

      {
        delModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <span className="text-sm font-semibold">Warning</span>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <span className="text-sm font-semibold">
                      Data Expense {Deskripsi} akan dihapus?
                    </span>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => {
                        setdelModal(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => deleteData()}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null
      }
    </div >
  );
}
