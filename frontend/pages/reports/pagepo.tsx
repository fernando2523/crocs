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
import Items from "@/components/menu";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
let Numbering = new Intl.NumberFormat("id-ID");

export default function PageSo() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_purchase, setdatapo] = useState([]);
  const [totalpo, settotalpo] = useState(0);
  const [total_qty, settotal_qty] = useState(0);
  const [capital_amount, setcapitalamount] = useState(0);
  const [data_supplier, setdatasupplier] = useState([]);
  const [data_users, setdatausers]: any = useState([]);
  const [data_brand, setdatabrand]: any = useState([]);
  const [showtoday, setdatatoday]: any = useState([]);

  useEffect(() => {
    loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
    getsupplier();
    getusers(user_login, user_role, user_store);
    return () => { };
  }, []);

  async function loaddatapo(query: any, tanggal: any, Filter_Tipe_po: any, Filter_Supplier: any, Filter_Tipe_user: any, user_role: any, user_store: any, Brand: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getpo`,
      data: {
        query: query,
        date: tanggal,
        Filter_Tipe_po: Filter_Tipe_po,
        Filter_Supplier: Filter_Supplier,
        Filter_Tipe_user: Filter_Tipe_user,
        user_role: user_role,
        user_store: user_store,
        Brand: Brand,
      },
    })
      .then(function (response) {
        setdatapo(response.data.result.datas);
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

  async function getusers(user_login: any, user_role: any, user_store: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getuserpo`,
      data: {
        user_login: user_login,
        user_role: user_role,
        user_store: user_store,
      },
    })
      .then(function (response) {
        setdatausers(response.data.result.get_user);
        setdatabrand(response.data.result.get_brand);
        if (
          "SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role")
        ) {
        } else {
          setValue("Filter_Tipe_user", response.data.result.get_user[0].users);
          loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, response.data.result.get_user[0].users, user_role, user_store, Brand);
        }
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_users: any = [];
  if (!isLoading) {
    data_users.map((account: any, index: number) => {
      list_users.push(
        <option key={index} value={account.users}>{account.users}</option>
      )
    })
  }

  const list_brand: any = [];
  if (!isLoading) {
    data_brand.map((brand: any, index: number) => {
      list_brand.push(
        <option key={index} value={brand.id_area}>{brand.brand}</option>
      )
    })
  }

  async function getsupplier() {
    setisLoading(true);
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getsupplier`,
    })
      .then(function (response) {
        setdatasupplier(response.data.data_supplier);
        setisLoading(false);
        // console.log(response.data.data_supplier);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_supplier: any = [];
  if (!isLoading) {
    data_supplier.map((area: any, index: number) => {
      list_supplier.push(
        <option key={index} value={area.id_sup}>{area.supplier}</option>
      )
    })
  }

  const [Brand, setBrand] = useState("all");
  const [Filter_Supplier, setFilter_Supplier] = useState("all");
  const [Filter_Tipe_po, setFilter_Tipe_po] = useState("all");
  if ("SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role")) {
    var [Filter_Tipe_user, setFilter_Tipe_user] = useState("all");
  } else {
    var [Filter_Tipe_user, setFilter_Tipe_user] = useState(Cookies.get("auth_name"));
  }

  const [user_login, setFilter_user_login] = useState(Cookies.get("auth_name"));
  const [user_role, setFilter_user_role] = useState(Cookies.get("auth_role"));
  const [user_store, setFilter_user_store] = useState(Cookies.get("auth_store"));

  const [value, setValues]: any = useState();
  const handleValueChange = (newValue: any) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate(startDate + " to " + lastDate);
    } else {
      setDate(newValue.startDate + " to " + newValue.endDate);
      loaddatapo(Query, newValue.startDate + " to " + newValue.endDate, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
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
      loaddatapo("all", date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
    } else {
      setQuery(e.target.value);
      loaddatapo(e.target.value, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
    }
  }

  async function keyDown(event: any) {
    if (event.key == 'Enter') {
      if (Query != "all") {
        loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
      }
    }
  }
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
      .post(`http://localhost:4000/v1/deletepo`, {
        id_po: id_po,
      })
      .then(function (response) {
        loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
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
      .post(`http://localhost:4000/v1/deleteitempo`, {
        id_act: id_act,
        users: Name,
      })
      .then(function (response) {
        loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
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

  // const [m_price, setm_price] = React.useState("");
  const [edit_id, setedit_id] = React.useState("");
  const [edit_idproduk, setedit_idproduk] = React.useState("");
  const [edit_produk, setedit_produk] = React.useState("");
  const [edit_id_ware, setid_ware] = React.useState("");
  const [edit_idpo, setedit_idpo] = React.useState("");
  const [gudang, setgudang] = React.useState(null);
  const [Name, setName] = useState(Cookies.get("auth_name"));


  async function showrepeatModal(
    id: any,
    id_produk: any,
    produk: any,
    idpo: any,
    id_act: any,
    gudang: any,
    m_price: any,
    id_ware: any,
    created_at: any,
    index: number
  ) {
    // console.log("id_produk", id_produk);
    // console.log("produk", produk);
    // console.log("idpo", idpo);
    // console.log("id_act", id_act);
    // console.log("gudang", gudang);
    // console.log("m_price", m_price);
    // console.log("id_ware", id_ware);
    // console.log("created_at", created_at);

    setedit_id(id);
    setedit_idproduk(id_produk);
    setedit_produk(produk);
    setedit_idpo(idpo);
    setgudang(gudang);
    setid_act(id_act);
    setid_ware(id_ware);
    unregister("variasirestock");
    setValue("m_price", Rupiah.format(m_price));
    await axios
      .post(`http://localhost:4000/v1/get_sizepo`, {
        id_act: id_act,
      })
      .then(function (response) {
        setdatasize(response.data.result);
        console.log("response.data.result", response.data.result);


        // console.log(response.data.result)
        setrepeatModal(true);
      });
  }

  const onSubmitedit = async (data: any) => {
    var m_price = data.m_price.replace(/\D/g, "");
    var qty_all = 0;
    for (let index = 0; index < data.variasirestock.length; index++) {
      qty_all = qty_all + parseInt(data.variasirestock[index].stok_baru);
    }

    if (qty_all === 0) {
      toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
    } else if (m_price === null || m_price === "") {
      toast.warning("Harga Modal Tidak Boleh Kosong", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
    } else {
      await axios
        .post(`http://localhost:4000/v1/editpo`, {
          data: data,
          id_act: id_act,
          idpo: edit_idpo,
          idproduk: edit_idproduk,
          id_ware: edit_id_ware,
          m_price: m_price,
          users: Name,
        })
        .then(function (response) {
          loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
          unregister("variasirestock");
        });

      toast.success("Update Berhasil", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });

      setrepeatModal(false);
    }
  };

  const list_so: any = [];

  if (!isLoading) {
    data_purchase.map((data_so: any, index: any) => {
      return list_so.push(
        <tbody key={index} className="group text-xs">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ||
            "HEAD-AREA" === Cookies.get("auth_role") ||
            "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
            <>
              <tr className="">
                <td
                  className="p-0 pt-4 h-full text-sm"
                  colSpan={11}
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
                    {/* {index + 1} - {data_so.tanggal} #
                    <span className="text-blue-600 pr-1">{data_so.id_so}</span> */}
                  </div>
                </td>
              </tr>
            </>
          )}
          {data_so.detail.map((item: any, index: any) => {
            return (
              <tr key={index} className="py-2">
                <td className="p-0 pl-5 bg-white h-full w-[3%]">
                  <div className="flex flex-wrap justify-center items-center h-full border font-bold">
                    {index + 1}
                  </div>
                </td>
                <td className="p-0 bg-white h-full w-[10%]">
                  <div className="flex flex-wrap justify-center items-center h-full border">
                    {item.id_spk_detail}
                  </div>
                </td>
                <td className="p-0 bg-white h-full w-[10%]">
                  <div className="flex flex-wrap justify-center items-center h-full border">
                    {item.id_produk}
                  </div>
                </td>
                <td className="p-0 h-full w-[30%]">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.produk}
                  </div>
                </td>

                <td className="p-0 h-full w-[5%]">
                  <div className="flex flex-wrap gap-4 pt-1.5 justify-center items-center h-full bg-white px-4 border">
                    <button
                      onClick={() => {
                        showrepeatModal(
                          item.id,
                          item.id_produk,
                          item.produk,
                          item.idpo,
                          item.id_act,
                          item.gudang,
                          item.m_price,
                          item.id_ware,
                          item.created_at,
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
                    {item.gudang}
                  </div>
                </td>
                <td className="p-0 h-full">
                  <div className="flex flex-wrap justify-center items-center h-full bg-white px-4 border">
                    {item.supplier}
                  </div>
                </td>
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
            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
              <>
                <td className="p-0 bg-white h-full" colSpan={8}>
                  <div className="flex flex-wrap justify-center items-center h-full"></div>
                </td>
              </>) :
              <>
                <td className="p-0 bg-white h-full" colSpan={7}>
                  <div className="flex flex-wrap justify-center items-center h-full"></div>
                </td>
              </>}
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
            <td className="p-0 h-full" colSpan={11}>
              <div className="flex flex-wrap items-center h-full bg-white pb-10 pl-[0.8%] rounded-b-lg"></div>
            </td>
          </tr>
        </tbody>
      );
    });
  }

  return (
    <div className="p-5 h-[100%] max-h-full overflow-y-auto">
      <div className="font-bold text-2xl border-b border-[#2125291A] h-10 mb-5">
        Report Order
      </div>

      <div className="mt-3 mb-5">
        {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
          <>
            <div className=" flex flex-row mt-0 gap-3 text-black">
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Purchase Order
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
        ) : "HEAD-AREA" === Cookies.get("auth_role") ? (
          <>
            <div className=" flex flex-row mt-0 gap-3 text-black">
              <div className="grow bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Purchase Order
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
          </>
        ) : null}
      </div>

      <ToastContainer className="mt-[50px]" />

      <div className="flex flex-row items-center content-center mb-3 gap-2">
        <div className="shadow grow rounded-lg flex flex-row text-center content-center">
          <input

            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setQuery("all");
                loaddatapo("all", date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
              }
            }}
            onKeyDown={keyDown}
            disabled={isLoading}
            className="h-[45px] grow text-sm border-0 pr-3 pl-5 text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Search ID Product Or Product Name..."
          />

          <button
            type="button"
            disabled={isLoading}
            className="rounded-r-lg bg-white basis-1/8  text-gray-700 font-medium px-5  hover:bg-gray-200"
            onClick={() => {
              // console.log(Query)
              if (Query != "all") {
                loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, Brand);
              }
            }}
          >
            <div className="my-auto">
              {isLoading === true ? (
                <>
                  <fa.FaArrowsAlt size={17} className={`${isLoading ? "animate-spin" : ""}  text-gray-700`} />
                </>
              ) : (
                <>
                  <fa.FaSearch size={17} className={`${isLoading ? "animate-spin" : ""}  text-gray-700`} />
                </>
              )}
            </div>
          </button>
        </div>

        {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
          <>
            <div className="h-[45px] grow text-sm border-0 text-gray-700 focus:outline-none rounded-l-lg" >
              <select
                value={Brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, Filter_Tipe_user, user_role, user_store, e.target.value);

                }}
                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                <option value="all">All Brand</option>
                {list_brand}
              </select>
            </ div>
          </>
        ) : null}


        < div className="h-[45px] grow text-sm border-0 text-gray-700 focus:outline-none rounded-l-lg" >
          <select
            value={Filter_Supplier}
            onChange={(e) => {
              setFilter_Supplier(e.target.value);
              loaddatapo(Query, date, Filter_Tipe_po, e.target.value, Filter_Tipe_user, user_role, user_store, Brand);

            }}
            className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
            <option value="all">All Supplier</option>
            {list_supplier}
          </select>
        </ div>

        {/* < div className="h-[45px] grow text-sm border-0 text-gray-700 focus:outline-none rounded-l-lg" >
          <select
            value={Filter_Tipe_po}
            onChange={(e) => {
              setFilter_Tipe_po(e.target.value);
              loaddatapo(Query, date, e.target.value, Filter_Supplier, Filter_Tipe_user, user_role, user_store,Brand);
            }}
            className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
            <option value="all">All Type</option>
            <option value="RELEASE">RELEASE</option>
            <option value="RESTOCK">RESTOCK</option>
          </select>
        </ div> */}

        <div className="h-[45px] grow text-sm border-0 text-gray-700 focus:outline-none rounded-l-lg">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ||
            "HEAD-AREA" === Cookies.get("auth_role") ? (
            <>
              <select
                value={Filter_Tipe_user}
                onChange={(e) => {
                  setFilter_Tipe_user(e.target.value);
                  loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, e.target.value, user_role, user_store, Brand);

                }}
                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                <option value="all">All Users</option>
                {list_users}
              </select>
            </>) : (<>
              <select
                value={Filter_Tipe_user}
                onChange={(e) => {
                  setFilter_Tipe_user(e.target.value);
                  loaddatapo(Query, date, Filter_Tipe_po, Filter_Supplier, e.target.value, user_role, user_store, Brand);
                }}
                disabled={true}
                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                {/* <option value="all">All Users</option> */}
                {list_users}
              </select>
            </>)}
        </div>

        <div className="shadow grow rounded-lg flex flex-row items-center justify-end bg-white ">
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
                placeholder={startDate + "-" + lastDate}
                readOnly={true}
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
                placeholder="Search date"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>)}
        </div>
      </div >

      <table className="table bg-transparent h-px mb-4 text-sm w-full">
        <thead className="bg-[#323232] text-white ">
          <tr className="rounded-lg">
            <th className="pl-2 py-3 rounded-l-lg">No</th>
            <th className="py-3">ID SPK</th>
            <th className="py-3">Code</th>
            <th className="py-3">Product</th>

            <th className="py-3">Act</th>

            <th className="py-3">Type</th>
            <th className="py-3">Warehouse</th>
            <th className="py-3">Supplier</th>
            <th className="py-3">Qty</th>
            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
              <>
                <th className="py-3">Cost</th>
                <th className="py-3 rounded-r-lg">Sub Total</th>
              </>
            ) : null}
          </tr>
        </thead>

        {list_so}
      </table>

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
        ) : null
      }

      {
        alldelModal ? (
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
                      Semua Data ID Purchase Order {id_po} akan dihapus?
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
        ) : null
      }

      {
        repeatModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="mb-[40px] mx-auto w-[40%]">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                  {/*header*/}
                  <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                    <span className="text-base font-semibold">
                      Edit Qty Report Order : {edit_produk} | {gudang} | Code : {id_act} <span hidden>{edit_id_ware}</span>
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

                                  {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
                                    <>
                                      <th className="py-2 rounded-l-lg">Size</th>
                                      <th className="py-2">Total Stock Before</th>
                                      <th className="py-2 rounded-r-lg">
                                        Total New Stock
                                      </th>
                                    </>
                                  ) : (
                                    <>
                                      <th className="py-2 rounded-l-lg">Size</th>
                                      <th className="py-2">Total New Stock</th>
                                      {/* <th className="py-2 rounded-r-lg">
                                  Total SO Baru
                                </th> */}
                                    </>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="group rounded-lg text-xs">
                                {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                                  <>
                                    <tr className="border-b">
                                      <td className="text-lg text-right justify-center items-center pt-3 pr-3 pb-3">
                                        <span className="-mb-2">Harga Modal :</span>
                                      </td>
                                      <td className="pt-3 pb-3">
                                        <CurrencyInput
                                          className={`"border-red-400" : ""
                                    } border h-[25px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                          placeholder="Masukan Harga Beli"
                                          decimalsLimit={2}
                                          groupSeparator="."
                                          decimalSeparator=","
                                          prefix="Rp "
                                          {...register("m_price", {
                                            required: true,
                                          })}
                                        />
                                      </td>
                                    </tr>
                                  </>
                                ) : null}
                                {datasize.map((datasizes, index) => {
                                  return (
                                    <tr key={index} className="rounded-lg h-auto mt-7">

                                      {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
                                        <>
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
                                          <td className="pt-2 p-0">
                                            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                              <input
                                                min={0}
                                                defaultValue={datasizes.qty}
                                                // {...register(
                                                //   `variasirestock.${index}.stok_baru`,
                                                //   { required: true }
                                                // )}
                                                {...register(`variasirestock.${index}.stok_baru`,
                                                  {
                                                    required: true, onChange: (e: any) => {
                                                      if (e.target.value === "") {
                                                        var n = 0;
                                                      } else {
                                                        var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                      }
                                                      setValue(`variasirestock.${index}.stok_baru`, n)
                                                    }
                                                  })}
                                                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                type="number"
                                                placeholder="Size"
                                              />
                                            </div>
                                          </td>
                                        </>
                                      ) : (
                                        <>
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
                                        </>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>

                            <div className="h-[10%] mt-6 gap-4 w-full flex flex-row items-end justify-start">
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

                                  {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                                    <>
                                      <th className="py-2 rounded-l-lg">Size</th>
                                      <th className="py-2">Total Stock Before</th>
                                      <th className="py-2 rounded-r-lg">
                                        Total New Stock
                                      </th>
                                    </>
                                  ) : (
                                    <>
                                      <th className="py-2 rounded-l-lg">Size</th>
                                      <th className="py-2">Total New Stock</th>
                                      {/* <th className="py-2 rounded-r-lg">
                                  Total SO Baru
                                </th> */}
                                    </>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="group rounded-lg text-xs">
                                {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                                  <>
                                    <tr className="border-b">
                                      <td className="text-lg text-right justify-center items-center pt-3 pr-3 pb-3">
                                        <span className="-mb-2">Harga Modal :</span>
                                      </td>
                                      <td className="pt-3 pb-3">
                                        <CurrencyInput
                                          className={`"border-red-400" : ""
                                    } border h-[25px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                          placeholder="Masukan Harga Beli"
                                          decimalsLimit={2}
                                          groupSeparator="."
                                          decimalSeparator=","
                                          prefix="Rp "
                                          {...register("m_price", {
                                            required: true,
                                          })}
                                        />
                                      </td>
                                    </tr>
                                  </>
                                ) : null}
                                {datasize.map((datasizes, index) => {
                                  return (
                                    <tr key={index} className="rounded-lg h-auto mt-7">

                                      {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                                        <>
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
                                          <td className="pt-2 p-0">
                                            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                              <input
                                                min={0}
                                                defaultValue={datasizes.qty}
                                                // {...register(
                                                //   `variasirestock.${index}.stok_baru`,
                                                //   { required: true }
                                                // )}
                                                {...register(`variasirestock.${index}.stok_baru`,
                                                  {
                                                    required: true, onChange: (e: any) => {
                                                      if (e.target.value === "") {
                                                        var n = 0;
                                                      } else {
                                                        var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                      }
                                                      setValue(`variasirestock.${index}.stok_baru`, n)
                                                    }
                                                  })}
                                                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                type="number"
                                                placeholder="Size"
                                              />
                                            </div>
                                          </td>
                                        </>
                                      ) : (
                                        <>
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
                                        </>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>

                            <div className="h-[10%] mt-6 gap-4 w-full flex flex-row items-end justify-start">
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
        ) : null
      }
    </div >

  );
}
