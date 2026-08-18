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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import Cookies from "js-cookie";
import { BeakerIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import {
  ArchiveRestore,
  BadgeDollarSign,
  BadgeDollarSignIcon,
  Banknote,
  BarChart4,
  BookKey,
  Box,
  Boxes,
  Check,
  ChevronsUpDown,
  Coffee,
  Coins,
  Container,
  DollarSign,
  DollarSignIcon,
  Dumbbell,
  FileStack,
  Package,
  UserRound,
  WarehouseIcon,
} from "lucide-react";
let Numbering = new Intl.NumberFormat("id-ID");

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function PageSo() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_so, setdataso] = useState([]);
  const [data_brand, setdatabrand] = useState([]);
  const [totalpo, settotalpo] = useState(0);
  const [total_qty, settotal_qty] = useState(0);
  const [capital_amount, setcapitalamount] = useState(0);
  const [showtoday, setdatatoday]: any = useState([]);

  useEffect(() => {
    loaddataso(Query, date, user_role, user_store, Brand);
    getbrand();
    return () => { };
  }, []);

  async function loaddataso(query: any, tanggal: any, user_role: any, user_store: any, Brand: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/getso`,
      data: {
        query: query,
        date: tanggal,
        user_role: user_role,
        user_store: user_store,
        Brand: Brand,
      },
    })
      .then(function (response) {
        setdataso(response.data.result.datas);
        setdatatoday(response.data.result.created_at);
        settotalpo(response.data.result.total_po);
        settotal_qty(response.data.result.total_qty);
        setcapitalamount(response.data.result.capital_amount);
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

  const [Brand, setBrand] = useState("all");
  const [value, setValues]: any = useState();
  const handleValueChange = (newValue: any) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate(startDate + " to " + lastDate);
    } else {
      setDate(newValue.startDate + " to " + newValue.endDate);
      loaddataso(Query, newValue.startDate + " to " + newValue.endDate, user_role, user_store, Brand);
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

  const [Query, setQuery] = useState("all");

  function querySet(e: any) {
    if (e.target.value === "") {
      setQuery("all");
      loaddataso("all", date, user_role, user_store, Brand);
    } else {
      setQuery(e.target.value);
      loaddataso(e.target.value, date, user_role, user_store, Brand);
    }
  }

  async function keyDown(event: any) {
    if (event.key == 'Enter') {
      if (Query != "all") {
        loaddataso(Query, date, user_role, user_store, Brand);
      }
    }
  }
  // const { data, error, isLoading, mutate } = useSWR(`https://apitest.lokigudang.com/get_so/${Query}/${date}`, fetcher);

  const [openSize, setopenSize] = useState(null);

  function toogleActive(index: any) {
    if (openSize === index) {
      setopenSize(null);
    } else {
      setopenSize(index);
    }
  }

  const {
    register,
    resetField,
    setValue,
    handleSubmit,
    watch,
    unregister,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    // }
  });

  const [datasize, setdatasize] = React.useState([]);
  const [data_po, setdata_po]: any = React.useState([]);
  const [tipepo, settipepo] = React.useState("");
  const [tipeso, settipeso] = React.useState("");

  const [alldelModal, setalldelModal] = React.useState(false);
  const [id_po, setid_po] = React.useState(null);

  const [delModal, setdelModal] = React.useState(false);
  const [id, setid] = React.useState(null);
  const [idware, setidware] = React.useState(null);
  const [id_act, setid_act] = React.useState(null);
  const [produk_name, setproduk_name] = useState(null);

  function showalldeleteModal(id_po: any, index: number) {
    setid_po(id_po);
    setalldelModal(true);
  }

  async function alldeleteData() {
    await axios
      .post(`https://api.gudangsandal.com/v1/deletepo`, {
        id_po: id_po,
      })
      .then(function (response) {
        loaddataso(Query, date, user_role, user_store, Brand);
      });

    toast.success("Data berhasil dihapus", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setalldelModal(false);
  }

  function showdeleteModal(
    id_produk: any,
    produk: any,
    id_ware: any,
    id_act: any,
    index: number
  ) {
    setid(id_produk);
    setidware(id_ware);
    setproduk_name(produk);
    setid_act(id_act);
    setdelModal(true);
  }

  async function deleteData() {
    await axios
      .post(`https://api.gudangsandal.com/v1/deleteitemso`, {
        id_act: id_act,
        users: Name,
      })
      .then(function (response) {
        loaddataso(Query, date, user_role, user_store, Brand);
      });

    toast.success("Data berhasil dihapus", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setdelModal(false);
  }

  const [repeatModal, setrepeatModal] = React.useState(false);
  const [repeatProduct, setrepeatProduct] = React.useState("");

  const [edit_idproduk, setedit_idproduk] = React.useState("");
  const [edit_produk, setedit_produk] = React.useState("");
  const [edit_idpo, setedit_idpo] = React.useState("");
  const [gudang, setgudang] = React.useState(null);
  const [id_ware, setidwares] = React.useState(null);
  const [Name,] = useState(Cookies.get("auth_name"));
  const [user_role,] = useState(Cookies.get("auth_role"));
  const [user_store,] = useState(Cookies.get("auth_store"));

  async function showrepeatModal(
    id_produk: any,
    produk: any,
    idpo: any,
    id_act: any,
    gudang: any,
    id_ware: any,
    index: number
  ) {
    setedit_idproduk(id_produk);
    setedit_produk(produk);
    setedit_idpo(idpo);
    setgudang(gudang);
    setidwares(id_ware);
    setid_act(id_act);

    unregister("variasirestock");

    await axios
      .post(`https://api.gudangsandal.com/v1/get_sizepo`, {
        id_act: id_act,
      })
      .then(function (response) {
        setdatasize(response.data.result);
        setrepeatModal(true);
      });
  }

  const onSubmitedit = async (data: any) => {
    var qty_all = 0;
    for (let index = 0; index < data.variasirestock.length; index++) {
      qty_all = qty_all + parseInt(data.variasirestock[index].stok_baru);
    }

    await axios
      .post(`https://api.gudangsandal.com/v1/editstockopname`, {
        data: data,
        id_act: id_act,
        idpo: edit_idpo,
        idproduk: edit_idproduk,
        id_ware: id_ware,
        users: Name,
      })
      .then(function (response) {
        loaddataso(Query, date, user_role, user_store, Brand);
        // mutate();
        unregister("variasirestock");
      });

    toast.success("Update Berhasil", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setrepeatModal(false);
  };

  const list_so: any = [];

  if (!isLoading) {
    data_so.map((data_so: any, index: any) => {
      return list_so.push(
        <tbody key={index} className="group text-xs">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ||
            "HEAD-AREA" === Cookies.get("auth_role") ? (
            <>
              <tr className="">
                <td
                  className="p-0 pt-4 h-full text-sm font-semibold"
                  colSpan={10}
                >
                  <div className="flex flex-row h-full bg-white pb-3 pt-5 pl-5 rounded-t-lg">
                    <div className="basis-1/2 font-semibold">
                      {index + 1} ) {format(new Date(data_so.tanggal), 'dd-MM-yyyy')}
                      {/* #
                    <span className="text-blue-600 pr-1">{data_so.id_so}</span>{" "} */}
                      {/* {" "}|{" "} */}
                      {/* <button
                        onClick={() => showalldeleteModal(data_so.id_so, index)}
                        className="text-xs pt-1 pl-1 text-red-400"
                      >
                        <i className="fi fi-ss-cross-circle text-center"></i>
                      </button> */}
                    </div>
                    <div className="basis-1/2 text-right -mb-2 mr-5">
                      Users : <span className="font-semibold">{data_so.users}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr className="">
                <td
                  className="p-0 pt-4 h-full text-sm font-semibold"
                  colSpan={10}
                >
                  <div className="flex flex-wrap items-center h-full bg-white pb-3 pt-5 pl-5 rounded-t-lg">
                    {index + 1} - {data_so.tanggal} #
                    <span className="text-blue-600 pr-1">{data_so.id_so}</span>
                  </div>
                </td>
              </tr>
            </>
          )}

          {data_so.detail.map((item: any, index: any) => {
            return (
              <tr key={index} className="py-2">
                <td className="p-0 pl-5 bg-white h-full w-[3%]">
                  <div className="flex flex-wrap justify-center items-center h-full border">
                    {index + 1}
                  </div>
                </td>
                <td className="p-0 bg-white h-full w-[3%]">
                  <div className="flex flex-wrap justify-center items-center h-full border">
                    {item.id_act}
                  </div>
                </td>
                <td className="p-0 h-full w-[7%]">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.id_produk}
                  </div>
                </td>
                <td className="p-0 h-full w-[30%]">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.produk}
                  </div>
                </td>

                <td className="p-0 h-full">
                  <div className="flex flex-wrap gap-4 pt-1.5 justify-center items-center h-full bg-white px-4 border">
                    <button
                      onClick={() => {
                        showrepeatModal(
                          item.id_produk,
                          item.produk,
                          data_so.id_so,
                          item.id_act,
                          item.gudang,
                          item.id_ware,
                          index
                        );
                      }}
                      className="text-blue-500"
                    >
                      <i className="fi fi-rr-edit text-center text-sm"></i>
                    </button>
                    {showtoday === startDate ?
                      (
                        <>
                          {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
                            <>
                              <button
                                onClick={() =>
                                  showdeleteModal(
                                    item.id_produk,
                                    item.produk,
                                    item.id_ware,
                                    item.id_act,
                                    index
                                  )
                                }
                                className="text-red-500"
                              >
                                <i className="fi fi-rr-trash text-center text-sm"></i>
                              </button>
                            </>
                          ) : null}
                        </>
                      )
                      :
                      (
                        <>
                          {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                            <>
                              <button
                                onClick={() =>
                                  showdeleteModal(
                                    item.id_produk,
                                    item.produk,
                                    item.id_ware,
                                    item.id_act,
                                    index
                                  )
                                }
                                className="text-red-500"
                              >
                                <i className="fi fi-rr-trash text-center text-sm"></i>
                              </button>
                            </>
                          ) : null}
                        </>
                      )}

                  </div>
                </td>

                <td className="p-0 h-full">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.tipe_order}
                  </div>
                </td>
                <td className="p-0 h-full">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.warehouse}
                  </div>
                </td>
                {/* <td className="p-0 h-full">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.supplier}
                  </div>
                </td> */}
                <td className="p-0 h-full">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.qty}
                  </div>
                </td>
                {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                  <>
                    <td className="p-0 h-full">
                      <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                        {Rupiah.format(item.m_price)}
                      </div>
                    </td>
                    <td className="p-0 pr-5 bg-white h-full">
                      <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white px-4 border">
                        {Rupiah.format(item.total_amount)}
                      </div>
                    </td>
                  </>
                ) : null}
              </tr>
            );
          })}

          <tr className="py-2 font-bold">
            <td className="p-0 bg-white h-full" colSpan={7}>
              <div className="flex flex-wrap justify-center items-center h-full"></div>
            </td>
            <td className="p-0 h-full">
              <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border py-2">
                {data_so.total_qty}
              </div>
            </td>
            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
              <>
                <td className="p-0 h-full">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    TOTAL COST
                  </div>
                </td>
                <td className="p-0 pr-5 bg-white h-full">
                  <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white px-4 border">
                    {Rupiah.format(data_so.total_cost)}
                  </div>
                </td>
              </>
            ) : null}
          </tr>

          <tr className="">
            <td className="p-0 h-full" colSpan={10}>
              <div className="flex flex-wrap items-center h-full bg-white pb-10 pl-[0.8%] rounded-b-lg"></div>
            </td>
          </tr>
        </tbody>
      );
    });
  }

  return (
    <div className="p-5">
      <div className="font-bold text-2xl border-b border-[#2125291A] h-10 mb-5">
        History Stock Opname
      </div>

      <div className="mt-3 mb-5">
        {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
          <>
            <div className=" flex flex-row mt-0 gap-3 text-black">
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Stock Opname
                </div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-2xl font-semibold py-0 px-5">
                    {Numbering.format(totalpo) ? Numbering.format(totalpo) : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <ClipboardDocumentIcon className="h-10 w-10 -mt-3 text-black text-right" />
                  </div>
                </div>
              </div>
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Qty
                </div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-2xl font-semibold py-0 px-5">
                    {Numbering.format(total_qty) ? Numbering.format(total_qty) : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <Container className="h-10 w-10 -mt-3 text-black text-right" />
                  </div>
                </div>
              </div>
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  CAPITAL AMOUNT
                </div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-2xl font-semibold py-0 px-5">
                    {Rupiah.format(capital_amount) ? Rupiah.format(capital_amount) : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <DollarSign className="h-10 w-10 -mt-3 text-black text-right" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : "HEAD-AREA" === Cookies.get("auth_role") ?
          (<>
            <div className=" flex flex-row mt-0 gap-3 text-black">
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Stock Opname
                </div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-2xl font-semibold py-0 px-5">
                    {Numbering.format(totalpo) ? Numbering.format(totalpo) : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <ClipboardDocumentIcon className="h-10 w-10 -mt-3 text-black text-right" />
                  </div>
                </div>
              </div>
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Qty
                </div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-2xl font-semibold py-0 px-5">
                    {Numbering.format(total_qty) ? Numbering.format(total_qty) : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <Container className="h-10 w-10 -mt-3 text-black text-right" />
                  </div>
                </div>
              </div>
            </div>
          </>) : null
        }
      </div>

      <ToastContainer className="mt-[50px]" />

      <div className="flex flex-wrap items-center content-center mb-3 gap-3">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setQuery("all");
                loaddataso("all", date, user_role, user_store, Brand);
              }
            }}
            onKeyDown={keyDown}
            disabled={isLoading}
            className="h-[45px] text-sm border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Search Product Or ID Order..."
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
            <div className="h-[45px] basis-1/6 text-sm border-0 text-gray-700 focus:outline-none rounded-l-lg" >
              <select
                value={Brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  loaddataso(Query, date, user_role, user_store, e.target.value);
                }}
                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                <option value="all">All Brand</option>
                {list_brand}
              </select>
            </ div>
          </>
        ) : null}


        <div className="shadow rounded-lg ml-auto w-[250px] flex flex-row items-center justify-end bg-white ">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
            <>
              <Datepicker
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
                        start: "2024-01-01",
                        end: todayDate,
                      },
                    },
                  },
                  footer: {
                    cancel: "Close",
                    apply: "Apply",
                  },
                }}
                placeholder="Select Date"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>) : (<>
              <Datepicker
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
                placeholder="Select Date"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>)}
        </div>
      </div>

      <table className="table bg-transparent h-px mb-4 text-sm w-full">
        <thead className="bg-[#323232] text-white">
          <tr className="rounded-lg">
            <th className="pl-2 py-3 rounded-l-lg">No</th>
            <th className="py-3">Code</th>
            <th className="py-3">ID Product</th>
            <th className="py-3">Product</th>

            <th className="py-3">Act</th>

            <th className="py-3">Type</th>
            <th className="py-3">Warehouse</th>
            {/* <th className="py-3">Supplier</th> */}
            <th className="py-3">Qty</th>
            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
              <>
                <th className="py-3">Harga Beli</th>
                <th className="py-3 rounded-r-lg">SUB TOTAL</th>
              </>
            ) : null}
          </tr>
        </thead>

        {list_so}
      </table>

      {delModal ? (
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
                  <p className="text-sm font-semibold">
                    Data {produk_name}, Code : {id_act} akan dihapus?
                  </p>
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
      ) : null}

      {alldelModal ? (
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
                  <p className="text-sm font-semibold">
                    Semua Data ID SO {id_po} akan dihapus?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setalldelModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => alldeleteData()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {repeatModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="mb-[40px] mx-auto w-[40%]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-base font-semibold">
                    Edit Qty SO : {edit_produk} | {gudang} | Code : {id_act}
                  </span>
                </div>

                {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                {showtoday === startDate ?
                  (
                    <>
                      <div className="px-6 gap-4 flex flex-auto h-[auto]">
                        <div className="text-sm w-full pb-10 flex flex-col">
                          <table className="table table-auto bg-transparent text-sm mt-3">
                            <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                              <tr className="">
                                <th className="py-2 rounded-l-lg">Size</th>
                                {/* <th className="py-2">Total SO Lama</th> */}

                                <th className="py-2 rounded-r-lg">
                                  Total SO Baru
                                </th>

                              </tr>
                            </thead>

                            <tbody className="group rounded-lg text-xs">
                              {datasize.map((datasizes, index) => {
                                return (
                                  <tr key={index} className="rounded-lg h-auto mt-7">
                                    <td className="pt-2 p-0">
                                      <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                        <input
                                          readOnly
                                          defaultValue={datasizes.size}
                                          {...register(
                                            `variasirestock.${index}.size`,
                                            { required: true }
                                          )}
                                          className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                          type="text"
                                        />
                                      </div>
                                    </td>
                                    <td className="pt-2 p-0" hidden>
                                      <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                        <input
                                          readOnly
                                          defaultValue={datasizes.qty}
                                          {...register(
                                            `variasirestock.${index}.stok_lama`,
                                            { required: true }
                                          )}
                                          className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                          type="number"
                                        />
                                      </div>
                                    </td>

                                    {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
                                      <>
                                        <td className="pt-2 p-0">
                                          <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                            <input
                                              min={0}
                                              defaultValue={datasizes.qty}
                                              {...register(
                                                `variasirestock.${index}.stok_baru`,
                                                { required: true }
                                              )}
                                              className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                              type="number"
                                              placeholder="Size"
                                            />
                                          </div>
                                        </td>
                                      </>
                                    ) : (
                                      <td className="pt-2 p-0">
                                        <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                          <input
                                            readOnly
                                            defaultValue={datasizes.qty}
                                            {...register(
                                              `variasirestock.${index}.stok_lama`,
                                              { required: true }
                                            )}
                                            className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                            type="number"
                                          />
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          <div className="h-[10%] mt-10 gap-4 w-full items-end justify-start flex flex-row">
                            <button
                              className="bg-red-500 grow text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => {
                                setrepeatModal(false);
                              }}
                            >
                              Close
                            </button>
                            {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
                              <>
                                <button
                                  className="bg-emerald-500 grow text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={handleSubmit(onSubmitedit)}
                                >
                                  Save Changes
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </>
                  )
                  :
                  (
                    <>
                      <div className="px-6 gap-4 flex flex-auto h-[auto]">
                        <div className="text-sm w-full pb-10 flex flex-col">
                          <table className="table table-auto bg-transparent text-sm mt-3">
                            <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                              <tr className="">
                                <th className="py-2 rounded-l-lg">Size</th>
                                {/* <th className="py-2">Total SO Lama</th> */}

                                <th className="py-2 rounded-r-lg">
                                  Total SO Baru
                                </th>

                              </tr>
                            </thead>

                            <tbody className="group rounded-lg text-xs">
                              {datasize.map((datasizes, index) => {
                                return (
                                  <tr key={index} className="rounded-lg h-auto mt-7">
                                    <td className="pt-2 p-0">
                                      <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                        <input
                                          readOnly
                                          defaultValue={datasizes.size}
                                          {...register(
                                            `variasirestock.${index}.size`,
                                            { required: true }
                                          )}
                                          className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                          type="text"
                                        />
                                      </div>
                                    </td>
                                    <td className="pt-2 p-0" hidden>
                                      <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                        <input
                                          readOnly
                                          defaultValue={datasizes.qty}
                                          {...register(
                                            `variasirestock.${index}.stok_lama`,
                                            { required: true }
                                          )}
                                          className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                          type="number"
                                        />
                                      </div>
                                    </td>

                                    {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                                      <>
                                        <td className="pt-2 p-0">
                                          <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                            <input
                                              min={0}
                                              defaultValue={datasizes.qty}
                                              {...register(
                                                `variasirestock.${index}.stok_baru`,
                                                { required: true }
                                              )}
                                              className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                              type="number"
                                              placeholder="Size"
                                            />
                                          </div>
                                        </td>
                                      </>
                                    ) : (
                                      <td className="pt-2 p-0">
                                        <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                          <input
                                            readOnly
                                            defaultValue={datasizes.qty}
                                            {...register(
                                              `variasirestock.${index}.stok_lama`,
                                              { required: true }
                                            )}
                                            className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                            type="number"
                                          />
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          <div className="h-[10%] mt-10 gap-4 w-full items-end justify-start flex flex-row">
                            <button
                              className="bg-red-500 grow text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => {
                                setrepeatModal(false);
                              }}
                            >
                              Close
                            </button>
                            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                              <>
                                <button
                                  className="bg-emerald-500 grow text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={handleSubmit(onSubmitedit)}
                                >
                                  Save Changes
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </>
                  )}


              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
