import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import axios from "axios";
import { Key } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

export default function Expense() {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [isLoading, setisLoading] = useState(true);
    const [data_asset, setdataasset]: any = useState([]);
    const [data_ware, setdataware] = useState([]);
    const [Query, setQuery] = useState("all");

    useEffect(() => {
        loaddataasset(Warehouse, Query, loadmorelimit, Urutan);
        getwarehouse();
        return () => { };
    }, []);

    async function loaddataasset(warehouse: any, query: any, loadmorelimit: any, Urutan: any) {
        setisLoading(true);
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/get_asset`,
            data: {
                id_ware: warehouse,
                query: query,
                loadmorelimit: loadmorelimit,
                urutan: Urutan,
            },
        })
            .then(function (response) {
                setdataasset(response.data.result.datas[0]);
                setshow_page(response.data.result.show_page / 20);
                settotal_pages(response.data.result.total_pages);
                setisLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [Warehouse, setWarehouse] = useState("all");
    const [Urutan, setUrutan] = useState("all");
    async function getwarehouse() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/getwarehouse`,
        })
            .then(function (response) {
                setdataware(response.data.data_warehouse);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const list_warehouse: any = [];
    if (!isLoading) {
        data_ware.map((area: any, index: number) => {
            list_warehouse.push(
                <option key={index} value={area.id_ware}>
                    {area.warehouse}
                </option>
            );
        });
    }

    async function keyDown(event: any) {
        if (event.key == 'Enter') {
            if (Query != "all") {
                loaddataasset(Warehouse, Query, loadmorelimit, Urutan);
            }
        }
    }

    const list_produk: any = [];

    if (!isLoading) {
        var product_counts = data_asset.length;
        var release = data_asset.release;
        var restock = data_asset.restock;
        var tf_in = data_asset.tf_in;
        var stock_opname = data_asset.stock_opname;
        var tf_out = data_asset.tf_out;
        var qty_assets = data_asset.qty_assets;
        var getsoldall = data_asset.getsoldall;
        var nominal_assets = Rupiah.format(data_asset.nominal_assets);
        var assetbersih = Rupiah.format(parseInt(data_asset.nominal_assets) - parseInt(data_asset.totalterjual));
        var no_urut = 1;
        data_asset.data_asset.map((data_asset: any, index: number) => {
            return list_produk.push(
                <div key={index}>
                    <div className="flex flex-wrap mb-2 group hover:shadow-lg ">
                        <div className="bg-white flex flex-row basis-full h-[full] rounded-lg items-center group-hover:drop-shadow-primary transition-filter px-5 py-5">
                            {/* <div className="grow mr-5 text-center">
                {no_urut++}
              </div> */}
                            <div className="basis-44 text-center">{data_asset.id_produk}</div>
                            <div className="grow text-left ml-5 font-medium">
                                {data_asset.produk}
                            </div>
                            <div className="basis-1/6 text-center">{data_asset.warehouse}</div>
                            <div className="basis-1/6 text-center">{data_asset.stock ? data_asset.stock : 0}</div>
                            <div className="basis-1/6 text-center">
                                <button
                                    onClick={() =>
                                        show_po(
                                            data_asset.produk,
                                            data_asset.id_produk,
                                            data_asset.id_ware
                                        )
                                    }
                                    className="text-blue-500"
                                >
                                    <i className="fi fi-rr-eye text-center text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div >
                </div >
            );
        });
    }

    const [data_po, setdata_po]: any = React.useState([]);
    const [Product, setProduct]: any = React.useState("");
    const [IDProduct, setIDProduct]: any = React.useState("");

    async function show_po(produk: any, idproduk: any, id_ware: any) {
        setProduct(produk);
        setIDProduct(idproduk);

        await axios
            .post(`https://api.gudangsandal.com/v1/gethistoripoasset`, {
                idware: id_ware,
                idproduct: idproduk,
            })
            .then(function (response) {
                setdata_po(response.data.result);
                setShowModal(true);
            });
    }

    const {
        register,
        resetField,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            deskripsi: "",
            amount: "",
            qty: "",
            total_amount: "",
            edit_deskripsi: "",
            edit_amount: "",
            edit_qty: "",
            edit_total_amount: "",
            gopagego: 0,
        },
    });

    const [showModal, setShowModal] = React.useState(false);
    const [show_page, setshow_page]: any = useState(1);
    const [loadmorelimit, setloadmore]: any = useState(0);
    const [nos_count, setno]: any = useState(1);
    const [gopage, setgopage]: any = useState(1);
    const [total_pages, settotal_pages]: any = useState([]);

    async function loadmore(e: any) {
        console.log(e);

        setisLoading(true);
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/get_asset`,
            data: {
                id_ware: Warehouse,
                query: Query,
                loadmorelimit: e,
                urutan: Urutan,
            },
        })
            .then(function (response) {
                setdataasset(response.data.result.datas[0]);
                setshow_page(response.data.result.show_page / 20);
                setgopage(0)
                setisLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (
        <div className="p-5">
            <div className="font-bold text-2xl border-b border-[#2125291A] h-12 mb-4">
                Product Sort By A - Z
            </div>

            <div className="rounded-lg mt-4 gap-3 w-auto flex flex-row text-center content-center">
                <div className="shadow grow rounded-lg  flex flex-row text-center content-center">
                    <input
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value === "") {
                                setQuery("all");
                                loaddataasset(Warehouse, "all", loadmorelimit, Urutan);
                            }
                        }}
                        onKeyDown={keyDown}
                        disabled={isLoading}
                        className="h-[45px] border-0 grow py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg"
                        type="text"
                        placeholder="Search..."
                    />

                    <button
                        type="button"
                        disabled={isLoading}
                        className={`rounded-r-lg bg-white basis-1/8 hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5`}
                        onClick={() => {
                            // console.log(Query)
                            if (Query != "all") {
                                loaddataasset(Warehouse, Query, loadmorelimit, Urutan);
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

                <select
                    value={Urutan}
                    onChange={(e) => {
                        setUrutan(e.target.value);
                        loaddataasset(Warehouse, Query, loadmorelimit, e.target.value);
                    }}
                    className={`appearance-none grow border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
                >
                    <option value="all">Basic Stock</option>
                    <option value="asc">Least Stock A - Z</option>
                    <option value="desc">Most Stock Z - A</option>
                </select>

                <select
                    value={Warehouse}
                    onChange={(e) => {
                        setWarehouse(e.target.value);
                        loaddataasset(e.target.value, Query, loadmorelimit, Urutan);
                    }}
                    className={`appearance-none border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
                >
                    <option value="all">All Warehouse</option>
                    {list_warehouse}
                </select>
            </div>

            <div className="items-center content-center mb-3 mt-3 gap-10 scroll-m-96">

                <div className="bg-[#323232] flex flex-row h-[40px] rounded-lg font-bold text-white items-center px-5">
                    {/* <div className="grow mr-5 text-center">No.</div> */}
                    <div className="basis-44 text-center">ID Product</div>
                    <div className="grow text-left ml-5">Product</div>
                    <div className="basis-1/6 text-center">Warehouse</div>
                    <div className="basis-1/6 text-center">Stock</div>
                    <div className="basis-1/6 text-center">Act</div>
                </div>

            </div>
            <div className="items-center content-center mb-3 mt-3 gap-10">
                {(function () {
                    if (product_counts < 1) {
                        return (
                            <div className="w-[100%] py-3 text-center mt-10">
                                Products are not yet available, please select a warehouse..
                            </div>
                        );
                    } else {
                        return list_produk;
                    }
                })()}
            </div>

            {/* <div className="mb-20 mt-3">
        <DataTable
          className="items-center text-center"
          columns={columns}
          // data={filteredItems}
          pagination
          paginationComponent={CustomMaterialPagination}
          paginationPerPage={20}
        />
      </div> */}

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="mx-auto w-[30%]">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%] ">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        {IDProduct} - {Product}
                                    </span>

                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-red-500"
                                    >
                                        <i className="fi fi-br-cross-small text-center text-xl"></i>
                                    </button>
                                </div>

                                <div className="p-6 gap-4 flex flex-auto h-[auto]">
                                    <div className="grow flex flex-col justify-start">
                                        <div className="h-[full] w-full">
                                            <div className="text-xs flex flex-auto text-center mb-2 font-bold">
                                                <div className="border py-1.5 w-[100%] rounded-lg bg-[#323232] text-white">
                                                    Stock Ready
                                                </div>
                                            </div>

                                            <div className="h-[100%] overscroll-y-auto overflow-x-hidden scrollbar-none">
                                                {(function () {
                                                    if (data_po.data_po.length > 0) {
                                                        return data_po.data_po.map(
                                                            (datapo: any, index: any) => {
                                                                var total_size = 0;
                                                                var total_size_ready = 0;
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="h-auto flex flex-auto text-xs items-center border rounded-lg px-2 py-2 mb-2"
                                                                    >
                                                                        <div className="w-[100%] text-center flex flex-col px-3 gap-2">
                                                                            <div className="grid grid-cols-3 gap-1">
                                                                                {(function () {
                                                                                    return datapo.variation_ready.map(
                                                                                        (variation: any, indexs: any) => {
                                                                                            total_size_ready =
                                                                                                total_size_ready +
                                                                                                parseInt(variation.qty);
                                                                                            if (variation.qty > 0) {
                                                                                                return (
                                                                                                    <div
                                                                                                        key={indexs}
                                                                                                        className="bg-green-500 text-white rounded px-2 py-0.5"
                                                                                                    >
                                                                                                        {variation.size}=
                                                                                                        {variation.qty}
                                                                                                    </div>
                                                                                                );
                                                                                            } else {
                                                                                                return (
                                                                                                    <div
                                                                                                        key={indexs}
                                                                                                        className="bg-red-300 text-white rounded px-2 py-0.5"
                                                                                                    >
                                                                                                        {variation.size}=
                                                                                                        {variation.qty}
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                })()}
                                                                            </div>
                                                                            <div className="border rounded-lg px-2 py-1 bg-[#323232] text-white font-bold">
                                                                                Total Qty :{" "}
                                                                                <b>{total_size_ready}</b> Pcs
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {Query === "all" ? (
                <>
                    <div className="grow mb-2 font-medium text-center text-gray-500 justify-center items-center">
                        {show_page === 0 ? (
                            <>
                                Show Page {1} - From Page {total_pages}
                            </>) : (
                            <>
                                Show Page {show_page + 1} - From Page {total_pages}
                            </>
                        )}
                    </div>
                    <div className="mt-3 text-center flex flex-row mb-4 justify-center items-center ">
                        <div className="flex flex-row shadow-2xl">
                            {/* <ul className="basis-1/6">
                <li className="grow font-medium text-lg  bg-white hover:bg-gray-100 cursor-pointer h-[35px] w-[35px] text-gray-500 rounded-l-3xl">
                  <button
                    className="pt-0.5"
                    onClick={(e) => {
                      if (nos_count <= 5) {
                        setno(1)
                        loadmore(0)
                      } else {
                        setno(nos_count - 5)
                        loadmore(nos_count - 5)
                      }
                    }}
                  >{"<<"}</button>
                </li>
              </ul> */}
                            <ul className="basis-1/6">
                                <li className="grow font-medium bg-white hover:bg-gray-100 cursor-pointer h-[35px] w-[70px] text-md pt-1 text-gray-500 rounded-l-3xl border-l-0 border-t-0 border-b-0">
                                    <button
                                        className="pt-0.5"
                                        onClick={(e) => {
                                            if (nos_count <= 1) {
                                                setno(1)
                                                loadmore(0)
                                            } else {
                                                setno(nos_count - 1)
                                                loadmore(nos_count - 1)
                                            }
                                        }}
                                    >{"< Prev"}</button>
                                </li>
                            </ul>
                            {(function (rows: any, i) {
                                for (let x = show_page; x < total_pages; x++) {
                                    if (x % 2 === 1) {
                                        if (show_page === x) {
                                            var nos_count_ganjil = x;
                                            var nos_count = nos_count_ganjil;
                                        }
                                    } else {
                                        if (show_page === x) {
                                            var nos_count_genap = x;
                                            var nos_count = nos_count_genap;
                                        }
                                    }
                                }
                                if (nos_count === 0) {
                                    nos_count = 1;
                                } else {
                                    nos_count;
                                }

                                for (let index = nos_count; index < total_pages; index++) {
                                    if (index < (6 + show_page)) {
                                        rows.push(
                                            <ul key={index} className="flex flex-row basis-1/6 items-center">

                                                <li className="basis-1/8 font-medium   bg-white hover:bg-gray-100 cursor-pointer  h-[35px] w-[35px] text-gray-500 ">
                                                    <button
                                                        className="pt-1.5"
                                                        onClick={(e) => {
                                                            setno(index - 1)
                                                            loadmore(index - 1)
                                                        }}
                                                    >{nos_count++}</button>
                                                </li>
                                            </ul>
                                        );
                                    } else if (index < (6 - show_page)) {
                                        rows.push(
                                            <ul key={index} className="flex flex-row basis-1/6 items-center">

                                                <li className="basis-1/8 font-medium  w-[50px] mx-2 bg-white hover:bg-gray-100 cursor-pointer text-gray-500 ">
                                                    <button
                                                        className="pt-1.5"
                                                        onClick={(e) => {
                                                            setno(index - 1)
                                                            loadmore(index - 1)
                                                        }}
                                                    >{nos_count++}</button>
                                                </li>
                                            </ul>
                                        );
                                    }
                                }

                                return rows;
                            })([], 0)}
                            <ul className="basis-1/6">
                                <li className="grow font-medium bg-white hover:bg-gray-100  cursor-pointer h-[35px] w-[70px] text-md pt-1 text-gray-500 rounded-r-3xl border-r-0 border-t-0 border-b-0">
                                    <button
                                        className="pt-0.5"
                                        onClick={(e) => {
                                            if (nos_count >= total_pages) {
                                                setno(total_pages)
                                                loadmore(total_pages)
                                            } else {
                                                if (show_page === 0) {
                                                    setno((nos_count + 1) - 1)
                                                    loadmore((nos_count + 1) - 1)
                                                } else {
                                                    setno(nos_count + 1)
                                                    loadmore(nos_count + 1)
                                                }
                                            }
                                        }}
                                    >
                                        {"Next >"}
                                    </button>
                                </li>
                            </ul>
                            {/* <ul className="basis-1/6">
                <li className="grow font-medium text-lg  bg-white hover:bg-gray-100 cursor-pointer h-[35px] w-[35px] text-gray-500">
                  <button
                    className="pt-0.5"
                    onClick={(e) => {
                      if (nos_count >= total_pages) {
                        setno(total_pages)
                        loadmore(total_pages)
                      } else {
                        setno(nos_count + 5)
                        loadmore(nos_count + 5)
                      }
                    }}
                  >{">>"}</button>
                </li>
              </ul> */}
                        </div>
                    </div>
                    <div className="mt-3 text-center flex flex-row mb-4 justify-center items-center ">
                        <div className="flex flex-row text-center justify-center items-center  text-gray-500">
                            <span className="font-medium mr-2">in total {total_pages} pages to</span>
                            <input type="text" className="w-[75px] border rounded-md px-3 py-1 text-center"
                                value={gopage}
                                {...register(`gopagego`, {
                                    onChange: (e: any) => {
                                        if (e.target.value === "") {
                                            var n = 0;
                                        } else {
                                            var n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                                        }
                                        setValue(`gopagego`, n);
                                        setgopage(e.target.value)
                                    },
                                })}
                            ></input>
                            <span className="font-medium ml-2">page</span>
                            <button className="bg-white px-3 py-1 ml-2 border rounded-md font-bold hover:bg-gray-100 cursor-pointer"
                                onClick={(e) => {
                                    if (gopage > total_pages) {
                                        toast.warning("Number of pages more than available", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 500,
                                        });
                                    } else if (gopage === 0) {
                                        setno(0)
                                        loadmore(0)
                                    } else {
                                        setno(gopage - 1)
                                        loadmore(gopage - 1)
                                    }
                                }}
                            >Confirm</button>
                        </div>
                    </div>
                </>) : null}
        </div>
    );
}
