import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useEffect, useRef, useState } from "react";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import axios from "axios";
import {
  compareAsc,
  format,
  subDays,
  lastDayOfMonth,
  startOfMonth,
  startOfWeek,
  lastDayOfWeek,
  startOfYear,
  startOfDay,
  endOfDay,
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import Cookies from "js-cookie";
import { BeakerIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { Banknote } from "lucide-react";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
let Numbering = new Intl.NumberFormat("id-ID");

export default function Refund() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_refund, setlist_refund]: any = useState([]);
  const [total_pesanan, setlist_refund_pesanan]: any = useState([]);
  const [total_pcs, setlist_refund_pcs]: any = useState([]);
  const [capital_amount, setcapitalamount] = useState(0);
  const [data_store, setdatastore] = useState([]);
  const [data_brand, setdatabrand] = useState([]);

  async function getdatarefund(tanggal: any, Store: any, Role: any, area: any, Query: any, datechange: any, Brand: any) {
    await axios
      .post("http://localhost:4000/v1/getrefund", {
        tanggal: tanggal,
        store: Store,
        role: Role,
        area: area,
        query: Query,
        datechange: datechange,
        Brand: Brand,
      })
      .then(function (response) {
        // handle success
        setlist_refund(response.data.result.getretur);
        setlist_refund_pesanan(response.data.result.hasilpesanan);
        setlist_refund_pcs(response.data.result.hasilpcs);
        setcapitalamount(response.data.result.capital_amount || 0);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  const [Query, setQuery] = useState("all");
  if ("HEAD-AREA" === Cookies.get("auth_role")) {
    var [Store, setStore] = useState(("all_area"));
  } else if (("SUPER-ADMIN" === Cookies.get("auth_role"))) {
    var [Store, setStore] = useState(("all"));
  } else {
    var [Store, setStore] = useState(Cookies.get("auth_store"));
  }

  const [Brand, setBrand] = useState("all");
  const [datechange, setdatechange] = useState("dateact");
  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [area, setarea] = useState((Cookies.get("auth_store")));

  useEffect(() => {
    getdatarefund(date, Store, Role, area, Query, datechange, Brand);
    getstore(Role, area, Brand);
  }, []);

  async function getstore(Role: any, area: any, Brand: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getstore_history`,
      data: {
        role: Role,
        store: area,
        Brand: Brand,
      },
    })
      .then(function (response) {
        setdatastore(response.data.result.get_store);
        setdatabrand(response.data.result.get_brand);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const list_store: any = [];
  if (isLoading) {
    data_store.map((data_store: any, index: number) => {
      list_store.push(
        <option key={index} value={data_store.id_store}>
          {data_store.store}
        </option>
      );
    });
  }
  const list_brand: any = [];
  if (isLoading) {
    data_brand.map((brand: any, index: number) => {
      list_brand.push(
        <option key={index} value={brand.id_area}>
          {brand.brand}
        </option>
      );
    });
  }

  const list_produk: any = [];
  let product_counts = 0;
  if (isLoading) {
    // Group data_refund by id_pesanan
    const grouped: { [id_pesanan: string]: any[] } = data_refund.reduce((acc: any, curr: any) => {
      if (!acc[curr.id_pesanan]) acc[curr.id_pesanan] = [];
      acc[curr.id_pesanan].push(curr);
      return acc;
    }, {});
    const id_pesanan_keys = Object.keys(grouped);
    product_counts = data_refund.length;
    let no_urut = 1;
    // Helper for run-length encoding for a field in a group
    const getRunLengths = (arr: any[], field: string, formatDate?: boolean) => {
      const result: { value: any, start: number, length: number }[] = [];
      let i = 0;
      while (i < arr.length) {
        let val = arr[i][field];
        if (formatDate) val = format(new Date(val), 'dd-MM-yyyy');
        let len = 1;
        for (let j = i + 1; j < arr.length; j++) {
          let nextVal = arr[j][field];
          if (formatDate) nextVal = format(new Date(nextVal), 'dd-MM-yyyy');
          if (nextVal === val) len++;
          else break;
        }
        result.push({ value: val, start: i, length: len });
        i += len;
      }
      return result;
    };
    id_pesanan_keys.forEach((id_pesanan) => {
      const group = grouped[id_pesanan];
      // Compute run-length encodings for each merge field
      const tanggal_refund_runs = getRunLengths(group, 'tanggal_refund', true);
      const tanggal_input_runs = getRunLengths(group, 'tanggal_input', true);
      const id_pesanan_runs = getRunLengths(group, 'id_pesanan');
      const keterangan_runs = getRunLengths(group, 'keterangan');
      const users_runs = getRunLengths(group, 'users');
      // For fast lookup: for each row, store {rowSpan, showCell} for each field
      const buildCellMap = (runs: { start: number, length: number }[]) => {
        const map: { [idx: number]: { rowSpan: number, showCell: boolean } } = {};
        runs.forEach(run => {
          for (let i = run.start; i < run.start + run.length; i++) {
            map[i] = {
              rowSpan: run.length,
              showCell: i === run.start
            };
          }
        });
        return map;
      };
      const tanggal_refund_map = buildCellMap(tanggal_refund_runs);
      const tanggal_input_map = buildCellMap(tanggal_input_runs);
      const id_pesanan_map = buildCellMap(id_pesanan_runs);
      const keterangan_map = buildCellMap(keterangan_runs);
      const users_map = buildCellMap(users_runs);
      group.forEach((data_refund: any, idx: number) => {
        list_produk.push(
          <tr
            key={data_refund.id_pesanan + '-' + idx}
            className={`border text-[12px] ${group.length > 1 ? 'bg-yellow-50' : 'bg-white hover:bg-gray-50'}`}
          >
            {idx === 0 && (
              <td className="py-2 px-2 text-center w-14" rowSpan={group.length}>
                {no_urut++}
              </td>
            )}
            {tanggal_refund_map[idx].showCell && (
              <td className="py-2 px-2 text-center w-36" rowSpan={tanggal_refund_map[idx].rowSpan}>
                {format(new Date(data_refund.tanggal_refund), 'dd-MM-yyyy')}
              </td>
            )}
            {tanggal_input_map[idx].showCell && (
              <td className="py-2 px-2 text-center w-36" rowSpan={tanggal_input_map[idx].rowSpan}>
                {format(new Date(data_refund.tanggal_input), 'dd-MM-yyyy')}
              </td>
            )}
            {id_pesanan_map[idx].showCell && (
              <td className="py-2 px-2 text-center w-32" rowSpan={id_pesanan_map[idx].rowSpan}>
                {data_refund.id_pesanan}
              </td>
            )}
            <td className="py-2 px-2 text-center w-32">{data_refund.id_produk}</td>
            <td className="py-2 px-2 text-center w-32">{data_refund.store}</td>
            <td className="py-2 px-2 text-left min-w-[260px]">{data_refund.produk}</td>
            <td className="py-2 px-2 text-center w-28">{data_refund.size}</td>
            <td className="py-2 px-2 text-center w-28">{data_refund.qty}</td>
            {keterangan_map[idx].showCell && (
              <td className="py-2 px-2 text-center w-40" rowSpan={keterangan_map[idx].rowSpan}>
                {data_refund.keterangan}
              </td>
            )}
            {users_map[idx].showCell && (
              <td className="py-2 px-2 text-center w-32" rowSpan={users_map[idx].rowSpan}>
                {data_refund.users}
              </td>
            )}
          </tr>
        );
      });
    });
  }

  const [value, setValues]: any = useState({
    startDate: format(startOfDay(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
  });

  const handleValueChange = (newValue: any) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate(startDate + " to " + lastDate);
      getdatarefund(startDate + " to " + lastDate, Store, Role, area, Query, datechange, Brand);
    } else {
      setDate(newValue.startDate + " to " + newValue.endDate);
      getdatarefund(newValue.startDate + " to " + newValue.endDate, Store, Role, area, Query, datechange, Brand);
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



  function querySet(e: any) {
    if (e.target.value === "") {
      setQuery("all");
      getdatarefund(date, Store, Role, area, "all", datechange, Brand);
    } else {
      setQuery(e.target.value);
      getdatarefund(date, Store, Role, area, e.target.value, datechange, Brand);

    }
  }


  return (
    <div className="p-5">
      <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-2">
        Refund
      </div>

      <ToastContainer className="mt-[25px]" />

      <div className="mt-3 mb-5">
        <div className=" flex flex-row mt-0 gap-3 text-black">
          <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
            <div className="text-md font-semibold py-4  px-5">
              Total Pesanan
            </div>
            <div className="flex flex-row text-left  mt-2">
              <div className="basis-full text-2xl font-semibold py-0 px-5">
                {Numbering.format(total_pesanan) ? Numbering.format(total_pesanan) : 0}
              </div>
              <div className=" basis-auto mt-1 mx-5">
                <ClipboardDocumentIcon className="h-10 w-10 -mt-3 text-black text-right" />
              </div>
            </div>
          </div>
          <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
            <div className="text-md font-semibold py-4  px-5">
              Total Qty
            </div>
            <div className="flex flex-row text-left  mt-2">
              <div className="basis-full text-2xl font-semibold py-0 px-5">
                {Numbering.format(total_pcs) ? Numbering.format(total_pcs) : 0}
              </div>
              <div className=" basis-auto mt-1 mx-5">
                <ClipboardDocumentIcon className="h-10 w-10 -mt-3 text-black text-right" />
              </div>
            </div>
          </div>
          <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
            <div className="text-md font-semibold py-4  px-5">
              Capital Amount
            </div>
            <div className="flex flex-row text-left  mt-2">
              <div className="basis-full text-2xl font-semibold py-0 px-5">
                {Rupiah.format(capital_amount) ? Rupiah.format(capital_amount) : "Rp 0"}
              </div>
              <div className=" basis-auto mt-1 mx-5">
                <Banknote className="h-10 w-10 -mt-3 text-black text-right" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center content-center mb-6">
        <div className="basis-1/6 rounded-lg w-auto flex flex-row text-center content-center">
          <input
            onChange={(e) => {
              querySet(e);
            }}
            className="h-[45px] border-0 w-[100%] py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Search..."
          />

          <button
            type="button"
            className="rounded-r-lg bg-white hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5"
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
                  getdatarefund(date, Store, Role, area, Query, datechange, e.target.value);
                  getstore(Role, area, e.target.value);
                }}
                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                <option value="all">All Brand</option>
                {list_brand}
              </select>
            </ div>
          </>
        ) : null}

        <select
          value={Store}
          onChange={(e) => {
            setStore(e.target.value);
            getdatarefund(date, e.target.value, Role, area, Query, datechange, Brand);
          }}
          className={`ml-3 appearance-none border h-[45px] basis-1/6 px-5 text-gray-700 focus:outline-none rounded-lg`}
        >
          {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
            <>
              <option value="all">All Store</option>
              {list_store}
            </>
          ) : (
            <>
              {list_store}
            </>
          )}
        </select>

        <select
          value={datechange}
          onChange={(e) => {
            setdatechange(e.target.value);
            getdatarefund(date, Store, Role, area, Query, e.target.value, Brand);
          }}
          className={`ml-3 appearance-none border h-[45px] basis-1/6 px-5 text-gray-700 focus:outline-none rounded-lg`}
        >
          <option value="dateact">Tanggal Refund</option>
          <option value="dateinput">Tanggal Input</option>
        </select>

        <div className="basis-1/4 ml-auto">
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



      </div>
      <div className="items-center content-center mb-3 mt-3 scroll-m-96 overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead className="bg-[#323232] text-white text-[12px]">
            <tr>
              <th className="py-2 px-2 text-center w-14">No.</th>
              <th className="py-2 px-2 text-center w-36">Date Refund</th>
              <th className="py-2 px-2 text-center w-36">Date Input</th>
              <th className="py-2 px-2 text-center w-32">ID Order</th>
              <th className="py-2 px-2 text-center w-32">ID Product</th>
              <th className="py-2 px-2 text-center w-32">Store</th>
              <th className="py-2 px-2 text-left">Product</th>
              <th className="py-2 px-2 text-center w-28">Size</th>
              <th className="py-2 px-2 text-center w-28">Qty</th>
              <th className="py-2 px-2 text-center w-40">Information</th>
              <th className="py-2 px-2 text-center w-32">Users</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {product_counts < 1 ? (
              <tr>
                <td colSpan={11} className="py-6 text-center text-gray-600">
                  Products are not yet available, please select a warehouse..
                </td>
              </tr>
            ) : (
              list_produk
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
