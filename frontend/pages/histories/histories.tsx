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

export default function Histories() {
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [isLoading, setisLoading] = useState(true);
    const [data_asset, setdataasset]: any = useState([]);
    const [data_ware, setdataware] = useState([]);
    const [total_qty, settotal_qty] = useState(0);
    const [total_qty_defect, settotal_qty_defect] = useState(0);
    const [total_qty_real, settotal_qty_real] = useState(0);
    const [total_qty_terjual, settotal_qty_terjual] = useState(0);
    const [Query, setQuery] = useState("all");
    const [Brand, setBrand] = useState("all");

    useEffect(() => {
        loaddatahistories(Warehouse, Query, loadmorelimit, Urutan, Brand);
        getwarehouse();
        return () => { };
    }, []);

    async function loaddatahistories(warehouse: any, query: any, loadmorelimit: any, Urutan: any, Brand: any) {
        setisLoading(true);
        await axios({
            method: "post",
            url: `http://localhost:4000/v1/histories_recap`,
            data: {
                id_ware: warehouse,
                query: query,
                loadmorelimit: loadmorelimit,
                urutan: Urutan,
                brand: Brand,
            },
        })
            .then(function (response) {
                console.log(response.data.result);

                setdataasset(response.data.result.data);
                setshow_page(response.data.result.show_page);
                settotal_pages(response.data.result.total_pages);
                settotal_qty(response.data.result.total_qty);
                settotal_qty_defect(response.data.result.total_qty_defect);
                settotal_qty_real(response.data.result.total_qty_real);
                settotal_qty_terjual(response.data.result.total_qty_terjual);
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
            url: `http://localhost:4000/v1/getwarehouse`,
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
                loaddatahistories(Warehouse, Query, loadmorelimit, Urutan, Brand);
            }
        }
    }
    let total_selisih_fisik = 0;

    const list_produk: any = [];

    if (!isLoading && data_asset?.length > 0) {
        var product_counts = data_asset.length;
        data_asset.forEach((item: any, index: number) => {
            const {
                produk,
                id_produk,
                id_ware,
                warehouse,
                total_qty = 0,
                total_qty_terjual = 0,
                total_qty_real = 0,
                total_qty_defect = 0,
                total_qty_transfer = 0,
            } = item;

            const sisa_teori = (total_qty) - total_qty_terjual - total_qty_transfer;
            const selisih_fisik = total_qty_real - sisa_teori;

            total_selisih_fisik += selisih_fisik;

            list_produk.push(
                <div key={index}>
                    <div className="flex flex-wrap mb-2 group hover:shadow-lg ">
                        <div className="bg-white flex flex-row basis-full h-[full] rounded-lg items-center group-hover:drop-shadow-primary transition-filter px-5 py-5">
                            <div className="basis-6/12 text-left ml-5 font-medium">
                                {produk} | {id_produk}
                            </div>
                            <div className="basis-1/6 text-center">{warehouse}</div>
                            <div className="basis-1/6 text-center">{(total_qty + total_qty_defect) - total_qty_transfer}</div>
                            <div className="basis-1/6 text-center">{total_qty_terjual}</div>
                            <div className="basis-1/6 text-center">{sisa_teori}</div>
                            <div className="basis-1/6 text-center">{total_qty_real}</div>
                            <div className="basis-1/6 text-center">{selisih_fisik}</div>
                            <div className="basis-1/6 text-center">
                                <button
                                    onClick={() => showModalDetail(id_produk, id_ware, produk)}
                                    className="text-blue-500"
                                >
                                    <i className="fi fi-rr-eye text-center text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    const [dataDetail, setDataDetail]: any = React.useState([]);
    const [IdWare, setIdWare]: any = React.useState("");
    const [IDProduct, setIDProduct]: any = React.useState("");
    const [Produk, setProduk]: any = React.useState("");

    async function showModalDetail(id_produk: any, id_ware: any, produk: any) {
        setIDProduct(id_produk);
        setIdWare(id_ware);
        setProduk(produk);

        await axios
            .post(`http://localhost:4000/v1/getHistoryDetail`, {
                id_ware: id_ware,
                id_produk: id_produk,
            })
            .then(function (response) {
                setDataDetail(response.data.result);
                console.log("detail", response.data.result);

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
    const [total_pages, settotal_pages]: any = useState(0);

    async function loadmore(e: any) {
        console.log(e);

        setisLoading(true);
        await axios({
            method: "post",
            url: `http://localhost:4000/v1/histories_recap`,
            data: {
                id_ware: Warehouse,
                query: Query,
                loadmorelimit: e,
                urutan: Urutan,
                brand: Brand,
            },
        })
            .then(function (response) {
                setdataasset(response.data.result.data);
                setshow_page(response.data.result.show_page);
                settotal_pages(response.data.result.total_pages);
                setgopage(0);
                setisLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (
        <div className="p-5">
            <div className="font-bold text-2xl border-b border-[#2125291A] h-12 mb-4">
                Histories Tracking
            </div>

            <div className="flex flex-row gap-3 grow h-auto content-start">
                {[
                    {
                        label: "Total Data",
                        value: total_qty,
                    },
                    {
                        label: "Total Terjual",
                        value: total_qty_terjual,
                    },
                    {
                        label: "Total Real Stok",
                        value: total_qty_real,
                    },
                    {
                        label: "Total Selisih Stok",
                        value: total_qty - total_qty_terjual - total_qty_real,
                    },
                ].map((item, index) => (
                    <a
                        key={index}
                        className="hover:shadow-[0px_3px_11px_1px_#2125291A] grow rounded-xl h-auto bg-white px-5 py-5 group"
                    >
                        <div className="grid grid-rows-3 items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/release.png"
                                        alt="icon"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            </div>
                            <div className="font-medium pt-1.5 text-base text-gray-400">{item.label}</div>
                            <div className="font-bold text-md text-black">{item.value || 0}</div>
                        </div>
                    </a>
                ))}
            </div>

            <div className="rounded-lg mt-4 gap-3 w-auto flex flex-row text-center content-center">
                <div className="shadow grow rounded-lg  flex flex-row text-center content-center">
                    <input
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value === "") {
                                setQuery("all");
                                loaddatahistories(Warehouse, "all", loadmorelimit, Urutan, Brand);
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
                                loaddatahistories(Warehouse, Query, loadmorelimit, Urutan, Brand);
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
                        loaddatahistories(Warehouse, Query, loadmorelimit, e.target.value, Brand);
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
                        loaddatahistories(e.target.value, Query, loadmorelimit, Urutan, Brand);
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
                    <div className="basis-6/12 text-left">Product</div>
                    <div className="basis-1/6 text-center">Warehouse</div>
                    <div className="basis-1/6 text-center">Histories Stock</div>
                    <div className="basis-1/6 text-center">Sold</div>
                    <div className="basis-1/6 text-center">Total</div>
                    <div className="basis-1/6 text-center">Stock Real</div>
                    <div className="basis-1/6 text-center">Selisih</div>
                    <div className="basis-1/6 text-center">Act</div>
                </div>

            </div>
            <div className="items-center content-center mb-3 mt-3 gap-10">
                {!isLoading && !isNaN(show_page) && data_asset.length > 0 ? (
                    list_produk
                ) : (
                    <div className="w-[100%] py-3 text-center mt-10">
                        Products are not yet available, please select a warehouse..
                    </div>
                )}
            </div>

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="mx-auto w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%] ">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        {IDProduct} - {Produk}
                                    </span>

                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-red-500"
                                    >
                                        <i className="fi fi-br-cross-small text-center text-xl"></i>
                                    </button>
                                </div>

                                <div className="p-6 gap-4 flex flex-auto h-full">
                                    <div className="grow flex flex-col justify-start">
                                        <div className="h-[full] w-full">
                                            <div className="h-[100%] overscroll-y-auto overflow-x-hidden scrollbar-none">
                                                <div className="overflow-auto max-h-[90vh] overflow-y-auto">
                                                    <table className="min-w-full text-xs text-left border border-collapse border-black">
                                                        <thead className="bg-black text-white font-bold">
                                                            <tr>
                                                                <th className="border border-black px-2 py-1 text-center">TANGGAL</th>
                                                                <th className="border border-black px-2 py-1 text-center">TIPE</th>
                                                                <th className="border border-black px-2 py-1 text-center">USERS</th>
                                                                <th className="border border-black px-2 py-1 text-center">SIZE</th>
                                                                <th className="border border-black px-2 py-1 text-center">INPUT</th>
                                                                <th className="border border-black px-2 py-1 text-center">SOLD</th>
                                                                <th className="border border-black px-2 py-1 text-center">INPUT (-) SOLD</th>
                                                                <th className="border border-black px-2 py-1 text-center">REAL</th>
                                                                <th className="border border-black px-2 py-1 text-center">SELISIH</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dataDetail.length > 0 &&
                                                                Object.entries(
                                                                    dataDetail.reduce((acc: any, curr: any) => {
                                                                        if (!acc[curr.size]) acc[curr.size] = [];
                                                                        acc[curr.size].push(curr);
                                                                        return acc;
                                                                    }, {})
                                                                ).map((entry, sizeIndex) => {
                                                                    const [size, items] = entry as [string, any[]];
                                                                    return (
                                                                        <React.Fragment key={sizeIndex}>
                                                                            {items.map((item, index) => (
                                                                                <tr key={`${size}-${index}`}>
                                                                                    <td className="border border-black px-2 py-1 text-center">{item.tanggal_varor}</td>
                                                                                    <td className="border border-black px-2 py-1 text-center">{item.tipe_order}</td>
                                                                                    <td className="border border-black px-2 py-1 text-center">{item.users || "Gudang"}</td>
                                                                                    <td className="border border-black px-2 py-1 text-center">{item.size}</td>
                                                                                    <td className={`border border-black px-2 py-1 text-center ${item.qty == 0 ? "bg-red-100 text-red-700 font-bold" : ""}`}>
                                                                                        {item.qty}
                                                                                    </td>
                                                                                    {/* QTY SOLD */}
                                                                                    {index === 0 && (
                                                                                        <td className="border border-black px-2 py-1 text-center" rowSpan={items.length}>
                                                                                        </td>
                                                                                    )}
                                                                                    {index === 0 && (
                                                                                        <td className="border border-black px-2 py-1 text-center" rowSpan={items.length}>
                                                                                        </td>
                                                                                    )}
                                                                                    {/* QTY REAL */}
                                                                                    {index === 0 && (
                                                                                        <td className="border border-black px-2 py-1 text-center" rowSpan={items.length}>
                                                                                        </td>
                                                                                    )}
                                                                                    {/* SELISIH */}
                                                                                    {index === 0 && (
                                                                                        <td className="border border-black px-2 py-1 text-center" rowSpan={items.length}>
                                                                                        </td>
                                                                                    )}
                                                                                </tr>
                                                                            ))}
                                                                            <tr className="bg-yellow-100 font-bold">
                                                                                <td className="border text-black border-black px-2 py-1 text-right" colSpan={3}>
                                                                                    Total Size :
                                                                                </td>
                                                                                <td className="border border-black px-2 py-1 text-center">{size}</td>

                                                                                {/* Total QTY */}
                                                                                <td className="border border-black px-2 py-1 text-center">
                                                                                    {(() => {
                                                                                        const totalQty = items.reduce((sum, curr) => sum + (parseInt(curr.qty) || 0), 0);
                                                                                        return totalQty;
                                                                                    })()}
                                                                                </td>

                                                                                {/* Qty Terjual */}
                                                                                <td className="border border-black px-2 py-1 text-center">
                                                                                    {parseInt(items[0].qty_terjual || "0")}
                                                                                </td>

                                                                                {/* Qty Input - Terjual */}
                                                                                <td className="border bg-gray-100 border-black px-2 py-1 text-center">
                                                                                    {(() => {
                                                                                        const totalQty = items.reduce((sum, curr) => sum + (parseInt(curr.qty) || 0), 0);
                                                                                        const terjual = parseInt(items[0].qty_terjual || "0");
                                                                                        return totalQty - terjual;
                                                                                    })()}
                                                                                </td>

                                                                                {/* Qty Real */}
                                                                                <td className="border border-black px-2 py-1 text-center">
                                                                                    {parseInt(items[0].qty_real || "0")}
                                                                                </td>

                                                                                {/* Selisih */}
                                                                                <td className="border border-black px-2 py-1 text-center">
                                                                                    {(() => {
                                                                                        const totalQty = items.reduce((sum, curr) => sum + (parseInt(curr.qty) || 0), 0);
                                                                                        const terjual = parseInt(items[0].qty_terjual || "0");
                                                                                        const real = parseInt(items[0].qty_real || "0");
                                                                                        return (totalQty - terjual) - real;
                                                                                    })()}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                        </tbody>
                                                    </table>
                                                </div>
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

            {data_asset.length > 0 && total_pages > 1 && (
                <div className="mt-6 flex flex-col items-center gap-2 text-gray-600">
                    <div className="font-medium">
                        Show Page {show_page + 1} of {total_pages}
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                const groupStart = Math.floor((show_page - 10) / 10) * 10;
                                const newPage = Math.max(0, groupStart);
                                setno(newPage + 1);
                                loadmore(newPage * 20);
                            }}
                            disabled={show_page < 10}
                            className="px-3 py-1 rounded bg-white border hover:bg-gray-100"
                        >
                            Prev
                        </button>
                        {Array.from({ length: Math.min(10, total_pages - Math.floor(show_page / 10) * 10) }, (_, i) => {
                            const page = Math.floor(show_page / 10) * 10 + i;
                            return (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setno(page + 1);
                                        loadmore(page * 20);
                                    }}
                                    className={`px-3 py-1 rounded border ${page === show_page ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-100"}`}
                                >
                                    {page + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => {
                                const groupStart = Math.floor(show_page / 10) * 10 + 10;
                                const newPage = Math.min(total_pages - 1, groupStart);
                                setno(newPage + 1);
                                loadmore(newPage * 20);
                            }}
                            disabled={show_page >= total_pages - 10}
                            className="px-3 py-1 rounded bg-white border hover:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Go to page:</span>
                        <input
                            type="number"
                            className="w-16 px-2 py-1 border rounded text-center"
                            value={gopage}
                            min={1}
                            max={total_pages}
                            onChange={(e) => {
                                const val = Math.max(1, Math.min(total_pages, Number(e.target.value) || 1));
                                setgopage(val);
                                setValue("gopagego", val);
                            }}
                        />
                        <button
                            onClick={() => {
                                const target = Math.max(1, Math.min(total_pages, gopage));
                                setno(target);
                                loadmore((target - 1) * 20);
                            }}
                            className="px-3 py-1 bg-white border rounded hover:bg-gray-100 font-bold"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
