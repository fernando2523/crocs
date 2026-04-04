import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import {
    compareAsc,
    format,
    subDays,
    lastDayOfMonth,
    startOfMonth,
    startOfWeek,
    lastDayOfWeek
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import useSWR from 'swr';
import axios from 'axios';
import CurrencyInput from 'react-currency-input-field';
const fetcher = (url: string) => fetch(url).then(res => res.json());

let Rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function NotaBarang() {
    const [value, setValues]: any = useState();
    const handleValueChange = (newValue: any) => {
        if (newValue.startDate === null || newValue.endDate === null) {
            setDate(startDate + " to " + lastDate);
        } else {
            setDate(newValue.startDate + " to " + newValue.endDate);
        }

        setValues(newValue);
    }
    const startDate = "2023-01-01";
    const lastDate = format(lastDayOfMonth(new Date()), 'yyyy-MM-dd');
    const [date, setDate] = useState(startDate + " to " + lastDate);

    const today: any = "Hari Ini";
    const yesterday: any = "Kemarin";
    const currentMonth: any = "Bulan ini";
    const pastMonth: any = "Bulan Kemarin";
    const mingguinistart: any = format(startOfWeek(new Date()), "yyyy-MM-dd");
    const mingguiniend: any = format(lastDayOfWeek(new Date()), "yyyy-MM-dd");
    const minggukemarinstart: any = format(subDays(startOfWeek(new Date()), 7), "yyyy-MM-dd");
    const minggukemarinend: any = format(subDays(lastDayOfWeek(new Date()), 7), "yyyy-MM-dd");
    const todayDate: any = format(new Date(), "yyyy-MM-dd");

    const [Query, setQuery] = useState("all");
    const [Store, setStore] = useState("all");
    const [Size, setSize] = useState("all");
    const [Filter_Supplier, setFilter_Supplier] = useState("all");
    const [Filter_Status, setFilter_Status] = useState("all");
    const [Filter_Payment, setFilter_Payment] = useState("all");
    const [filter, setfilter] = useState(false);

    function querySet(e: any) {
        if (e.target.value === "") {
            setQuery("all");
        } else {
            setQuery(e.target.value);
        }
    }

    const { data, error, isLoading, mutate } = useSWR(`https://apitest.lokigudang.com/get_notabarang_retur/${Query}/${Store}/${date}/${Filter_Supplier}/${Filter_Status}/${Filter_Payment}/${Size}`, fetcher);

    const { data: report_data, error: report_error, isLoading: report_isLoading, mutate: report_mutate } = useSWR(`https://apitest.lokigudang.com/get_nota_return/${Store}/${date}/${Filter_Supplier}/${Filter_Status}/${Filter_Payment}/${Size}`, fetcher);

    if (!report_isLoading && !report_error) {
        var nota_paid = Rupiah.format(report_data.nota_paid);
        var nota_pending = Rupiah.format(report_data.nota_pending);
        var qty_paid = report_data.qty_paid;
        var qty_pending = report_data.qty_pending;
    }


    const { data: brand_data, error: brand_error, isLoading: brand_isLoading, mutate: brand_mutate } = useSWR(`https://apitest.lokigudang.com/getbrand`, fetcher);

    const list_brand: any = [];

    if (!brand_isLoading && !brand_error) {
        brand_data.data_brand.map((area: any, index: number) => {
            list_brand.push(
                <option key={index} value={area.id_brand}>{area.brand}</option>
            )
        })
    }

    const { data: size_data, error: size_error, isLoading: size_isLoading, mutate: size_mutate } = useSWR(`https://apitest.lokigudang.com/getsizenota`, fetcher);

    const list_size: any = [];

    if (!size_isLoading && !size_error) {
        size_data.data_size.map((size: any, index: number) => {
            list_size.push(
                <option key={index} value={size.size}>{size.size}</option>
            )
        })
    }

    const { data: store_data, error: store_error, isLoading: store_isLoading } = useSWR(`https://apitest.lokigudang.com/getstore`, fetcher);
    let list_store: any = [];
    if (!store_isLoading && !store_error) {
        store_data.data_store.map((store: any, index: number) => {
            list_store.push(
                <option key={index} value={store.store}>{store.store}</option>
            )
        })
    } else {
        var data_store: any = [];
    }

    const { data: category_data, error: category_error, isLoading: category_isLoading, mutate: category_mutate } = useSWR(`https://apitest.lokigudang.com/getcategory`, fetcher);

    const list_category: any = [];

    if (!category_isLoading && !category_error) {
        category_data.data_cat.map((area: any, index: number) => {
            list_category.push(
                <option key={index} value={area.id_category}>{area.category}</option>
            )
        })
    }

    const { data: supplier_data, error: supplier_error, isLoading: supplier_isLoading, mutate: supplier_mutate } = useSWR(`https://apitest.lokigudang.com/getsupplier`, fetcher);

    const list_supplier: any = [];

    if (!supplier_isLoading && !supplier_error) {
        supplier_data.data_supplier.map((area: any, index: number) => {
            list_supplier.push(
                <option key={index} value={area.id_sup}>{area.supplier}</option>
            )
        })
    }

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://apitest.lokigudang.com/getwarehouse`, fetcher);

    const list_warehouse: any = [];

    if (!warehouse_isLoading && !warehouse_error) {
        warehouse_data.data_ware.map((area: any, index: number) => {
            list_warehouse.push(
                <option key={index} value={area.id_ware}>{area.warehouse}</option>
            )
        })
    }

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (openSize === index) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

    const { register, resetField, setValue, handleSubmit, watch, formState: { errors } } = useForm({
        // defaultValues: {

        // }
    });

    const [showModal, setShowModal] = React.useState(false);

    const onSubmit = async (data: any) => {
        await axios.post("https://apitest.lokigudang.com/savenota", {
            data: data
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();
        });

        console.log(data);

        toast.success("Data telah disimpan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        resetField('produk');
        resetField('harga_beli');
        resetField('harga_jual');
        resetField('warehouse');
        resetField('quality');
        resetField('supplier');
        resetField('kategori');
        resetField('size');
        resetField('stok');
        resetField('payment');
        resetField('deskripsi');
        resetField('brand');

        setShowModal(false);
    };

    async function update_payment_satuan(id: any) {
        await axios.post(`https://apitest.lokigudang.com/editpaymentsatuan`, {
            id: id,
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();

            toast.success("Data telah diupdate", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        });
    }

    async function updatepayemnt_massal() {
        await axios.post(`https://apitest.lokigudang.com/editpaymentmassal`, {
            data: dataChecked,
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();
            clear_select();
            toast.success("Data telah diupdate", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        });
    }


    const [delModal, setdelModal] = React.useState(false);
    const [produk_name, setproduk_name] = React.useState("");
    const [iddel, setiddel] = React.useState("");

    function openDelModal(id: any, produk: any) {
        setiddel(id);
        setproduk_name(produk);
        setdelModal(true);
    }

    async function deleteData() {
        await axios.post("https://apitest.lokigudang.com/deleteNota", {
            id: iddel
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();
            setdelModal(false);

            toast.success("Data telah dihapus", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        });
    }

    const list_produk: any = [];
    const [checked, setChecked]: any = useState([]);
    const [dataChecked, setdataChecked]: any = useState([]);
    const total_amount: any = checked.reduce((a: any, v: any) => a = a + parseInt(v.harga_beli), 0);

    function clear_select() {
        var updatedList = [...checked];
        var updatedList2 = [...dataChecked];
        for (let i = 0; i < checked.length; i++) {
            updatedList.splice(checked.indexOf(checked[i]['id']), 1);
            updatedList2.splice(dataChecked.indexOf(dataChecked[i]['id']), 1);
            setChecked(updatedList);
            setdataChecked(updatedList2);
            checked[i]['inputs'].checked = false;
        }
    }

    const handleCheck = (event: any, harga_beli: any) => {
        var updatedList = [...checked];
        var updatedList2 = [...dataChecked];
        if (event.target.checked) {
            updatedList = [...checked, {
                inputs: event.target,
                id: event.target.value,
                harga_beli: harga_beli,
            }];

            updatedList2 = [...dataChecked, {
                id: event.target.value,
                harga_beli: harga_beli,
            }];
        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
            updatedList2.splice(dataChecked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
        setdataChecked(updatedList2);
    };

    if (!isLoading && !error) {
        data.data_notabarang.map((data_produk: any, index: any) => {
            return (
                list_produk.push(
                    <tbody key={index} className="group hover:shadow-lg rounded-lg">
                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pl-5 pr-2 rounded-l-lg">
                                    {function () {
                                        if (data_produk.payment === "PENDING") {
                                            return (
                                                <input className="cursor-pointer" value={data_produk.id} type="checkbox"
                                                    onChange={(e) => {
                                                        handleCheck(e, data_produk.m_price)
                                                    }} />
                                            )
                                        } else {
                                            return (
                                                <input value={data_produk.id} type="checkbox" disabled />
                                            )
                                        }
                                    }()}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-row gap-4 items-center h-full bg-white py-4 pl-4">
                                    {/* <Image
                                        className="max-w-[80px] max-h-[80px] rounded"
                                        src={data_produk.img}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    /> */}
                                    <div className="flex flex-col justify-center">
                                        <div className="text-sm">{data_produk.produk}</div>
                                        <div className="text-[12px]">Harga Beli Satuan : <b className="text-blue-600">{Rupiah.format(data_produk.m_price)}</b></div>
                                        <div className="text-[12px]">{data_produk.id_nota} | {data_produk.tanggal_upload}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 ">
                                    {data_produk.size}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.qty}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {function () {
                                        let text = data_produk.deskripsi;
                                        const myArray = text.split("-");
                                        return (
                                            <>
                                                {myArray[0]}
                                            </>
                                        )
                                    }()}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {function () {
                                        let text = data_produk.deskripsi;
                                        const myArray = text.split("-");
                                        return (
                                            <>
                                                {myArray[1]}
                                            </>
                                        )
                                    }()}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.warehouse[0].warehouse}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.supplier[0].supplier}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.status_pesanan}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {function () {
                                        if (data_produk.payment === "PENDING") {
                                            return (
                                                <button
                                                    onClick={() => {
                                                        update_payment_satuan(data_produk.id);
                                                    }}
                                                    className="text-red-500 font-bold">
                                                    {data_produk.payment}
                                                </button>
                                            )
                                        } else {
                                            return (
                                                <span className="text-blue-500 font-bold">{data_produk.payment}</span>
                                            )
                                        }
                                    }()}

                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 rounded-r-lg">
                                    <button
                                        onClick={() => {
                                            showeditModal(data_produk.id, data_produk.produk, data_produk.m_price, data_produk.payment, data_produk.qty, data_produk.id_sup, data_produk.size);
                                        }}
                                        className="text-blue-500">
                                        <i className="fi fi-rr-edit text-center text-lg"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            openDelModal(data_produk.id, data_produk.produk);
                                        }}
                                        className="text-red-500">
                                        <i className="fi fi-rr-trash text-center text-lg"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>


                    </tbody>
                )
            )
        })
    }

    const [editModal, seteditModal] = React.useState(false);
    const [edit_produk, setedit_produk] = React.useState("");
    const [edit_supplier, setedit_supplier] = React.useState("");
    const [edit_size, setedit_size] = React.useState("");
    const [edit_hargabeli, setedit_hargabeli] = React.useState("");
    const [edit_payment, setedit_payment] = React.useState("");
    const [edit_qty, setedit_qty] = React.useState("");
    const [id, setid] = React.useState(null);

    function showeditModal(id: any, produk: any, hargabeli: any, payment: any, qty: any, supplier: any, size: any) {
        setid(id);
        setedit_produk(produk);
        setedit_hargabeli(hargabeli);
        setedit_payment(payment);
        setedit_qty(qty);
        setedit_supplier(supplier);
        setedit_size(size);

        seteditModal(true);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios.post(`https://apitest.lokigudang.com/editnota`, {
            id: id,
            edit_produk: edit_produk,
            edit_hargabeli: edit_hargabeli,
            edit_payment: edit_payment,
            edit_qty: edit_qty,
            edit_supplier: edit_supplier,
            edit_size: edit_size,
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();

            toast.success("Data telah diupdate", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            seteditModal(false);
        });
    };

    return (
        <>
            <div className={`${checked.length > 0 ? "bottom-0" : "bottom-[-100px]"} w-[86%] fixed duration-300`}>
                <div className="w-full bg-[#DDE4F0] font-bold border px-5 py-4 flex justify-start gap-3 items-center text-xs">
                    <div className="w-[80%]">Data Dipilih : {String(checked.length)}, Total Amount : {Rupiah.format(total_amount)}</div>

                    <div className="">
                        <button
                            onClick={() => clear_select()}
                            className="p-2.5 rounded-lg font-bold text-white bg-orange-500">
                            CLEAR SELECTED
                        </button>
                    </div>

                    <div className="">
                        <button
                            onClick={() => updatepayemnt_massal()}
                            className="p-2.5 rounded-lg font-bold text-white bg-blue-500">
                            UPDATE PAYMENT
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="font-bold text-2xl border-b border-[#2125291A] h-10 mb-3">
                    Daftar Nota Barang
                </div>

                <ToastContainer className="mt-[50px]" />

                <div className="grid grid-cols-4 gap-3 grow h-auto content-start mb-5">
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 h-[90px] items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/dibayar.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                            </div>

                            <div className="font-medium pt-2 text-base text-green-600">
                                Nota Sudah Dibayar
                            </div>

                            <div className="font-bold text-xl text-green-600">
                                {nota_paid ? nota_paid : 0}
                            </div>
                        </div>

                    </a>

                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 h-[90px] items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/boxes.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                {/* <div>
            <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
        </div> */}
                            </div>

                            <div className="font-medium pt-2 text-base text-green-600">
                                Qty
                            </div>

                            <div className="font-bold text-xl text-green-600">
                                {qty_paid ? qty_paid : 0}
                            </div>
                        </div>

                    </a>

                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 h-[90px] items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/belum-dibayar.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                            </div>

                            <div className="font-medium pt-2 text-base text-red-400">
                                Nota Belum Dibayar
                            </div>

                            <div className="font-bold text-xl text-red-400">
                                {nota_pending ? nota_pending : 0}
                            </div>
                        </div>

                    </a>

                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 h-[90px] items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/boxes.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                            </div>

                            <div className="font-medium pt-2 text-base text-red-400">
                                Qty
                            </div>

                            <div className="font-bold text-xl text-red-400">
                                {qty_pending ? qty_pending : 0}
                            </div>
                        </div>

                    </a>
                </div>

                <div className="flex flex-wrap items-center content-center mb-3 gap-3">
                    <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                        <input
                            onChange={(e) => {
                                querySet(e);
                            }}
                            className="h-[45px] text-sm border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari Nama Produk atau ID Pesanan..." />

                        <button type="button" className="rounded-r-lg bg-white h-[45px] text-gray-700 font-medium px-5">
                            <div className="my-auto">
                                <fa.FaSearch size={17} className="text-gray-700" />
                            </div>
                        </button>
                    </div>

                    <div
                        onClick={() => setfilter(filter ? false : true)}
                        className="flex flex-warp items-center bg-blue-500 rounded-lg px-3 cursor-pointer">
                        <button className="py-3 rounded-lg mr-2 font-bold text-white bg-blue-500">
                            Filter Data
                        </button>
                        <fa.FaFilter size={12} className="text-white" />
                    </div>

                    <div className="shadow rounded-lg ml-auto w-[250px] flex flex-row items-center justify-end bg-white ">
                        <Datepicker
                            primaryColor="blue"
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
                                            end: mingguiniend
                                        },
                                    },
                                    minggukemarin: {
                                        text: "Minggu Kemarin",
                                        period: {
                                            start: minggukemarinstart,
                                            end: minggukemarinend
                                        },
                                    },
                                    currentMonth: currentMonth,
                                    pastMonth: pastMonth,
                                    alltime: {
                                        text: "Semua",
                                        period: {
                                            start: "2023-01-01",
                                            end: todayDate
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
                    </div>


                </div>

                <Collapse isOpened={filter}>
                    <div className="grid grid-cols-5 pb-4 pt-1 px-2 gap-3">
                        <div className="flex text-sm flex-col items-start gap-1 justify-end">
                            <label>Filter By Toko</label>
                            <select
                                value={Store}
                                onChange={(e) => {
                                    setStore(e.target.value);
                                }}
                                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                                <option value="all">All Store</option>
                                {list_store}
                            </select>
                        </div>

                        <div className="flex text-sm flex-col items-start gap-1 justify-end">
                            <label>Filter By Supplier</label>
                            <select
                                value={Filter_Supplier}
                                onChange={(e) => {
                                    setFilter_Supplier(e.target.value);
                                }}
                                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                                <option value="all">All Supplier</option>
                                {list_supplier}
                            </select>
                        </div>

                        <div className="flex text-sm flex-col items-start gap-1 justify-end">
                            <label>Filter By Status Pesanan</label>
                            <select
                                value={Filter_Status}
                                onChange={(e) => {
                                    setFilter_Status(e.target.value);
                                }}
                                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                                <option value="all">All Status</option>
                                <option value="SELESAI">SELESAI</option>
                                <option value="SEDANG DIKIRIM">SEDANG DIKIRIM</option>
                            </select>
                        </div>

                        <div className="flex text-sm flex-col items-start gap-1 justify-end">
                            <label>Filter By Status Pembayaran</label>
                            <select
                                value={Filter_Payment}
                                onChange={(e) => {
                                    setFilter_Payment(e.target.value);
                                }}
                                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                                <option value="all">All Pembayaran</option>
                                <option value="PAID">PAID</option>
                                <option value="PENDING">PENDING</option>
                            </select>
                        </div>

                        <div className="flex text-sm flex-col items-start gap-1 justify-end">
                            <label>Filter By Size</label>
                            <select
                                value={Size}
                                onChange={(e) => {
                                    setSize(e.target.value);
                                }}
                                className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                                <option value="all">All Size</option>
                                {list_size}
                            </select>
                        </div>
                    </div>
                </Collapse>

                <table className="table bg-transparent h-px mb-4 text-sm w-full">

                    <thead className="bg-[#DDE4F0] text-gray-800">
                        <tr className="rounded-lg">
                            <th className="pl-2 py-3 rounded-l-lg">
                                #
                            </th>
                            <th className="py-3">
                                No.
                            </th>
                            <th className="py-3">
                                Produk & Harga
                            </th>
                            <th className="py-3">
                                Varian
                            </th>
                            <th className="py-3">
                                Stok
                            </th>
                            <th className="py-3">
                                ID Pesanan
                            </th>
                            <th className="py-3">
                                Store
                            </th>
                            <th className="py-3">
                                Gudang
                            </th>
                            <th className="py-3">
                                Supplier
                            </th>
                            <th className="py-3">
                                Status Barang
                            </th>
                            <th className="py-3">
                                Status Pembayaran
                            </th>
                            <th className="py-3 rounded-r-lg">
                                Action
                            </th>
                        </tr>
                    </thead>

                    {list_produk}

                </table>

                {
                    showModal ? (
                        <>
                            <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                            <span className="text-xl font-semibold">
                                                Tambah Produk
                                            </span>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 flex-auto">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                            </form>
                                            <div className="pb-5 h-[auto]">
                                                <div className="grid grid-cols-2 gap-5 justify-center content-center items-start">
                                                    <div>
                                                        <div className="mb-3">Nama Produk</div>
                                                        <input
                                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                            type="text"
                                                            placeholder="Masukan Produk"
                                                            {...register("produk", { required: false })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="mb-3">Harga Beli</div>
                                                        <input
                                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                            type="number"
                                                            defaultValue={0}
                                                            placeholder="Masukan Harga Beli"
                                                            {...register("harga_beli", { required: false })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Brand</div>
                                                        <select {...register("brand", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                            <option value="">Pilih Brand</option>
                                                            {list_brand}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <div className="mb-3">Harga Jual</div>
                                                        <input
                                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                            type="number"
                                                            defaultValue={0}
                                                            placeholder="Masukan Harga Jual"
                                                            {...register("harga_jual", { required: false })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Warehouse</div>
                                                        <select {...register("warehouse", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                            <option value="">Pilih Warehouse</option>
                                                            {list_warehouse}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <div className="mb-3">Quality</div>
                                                        <select {...register("quality", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                            <option value="">Pilih Quality</option>
                                                            <option value="IMPORT">IMPORT</option>
                                                            <option value="LOKAL">LOKAL</option>
                                                            <option value="ORIGINAL">ORIGINAL</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Supplier</div>
                                                        <select {...register("supplier", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                            <option value="">Pilih Supplier</option>
                                                            {list_supplier}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Kategori</div>
                                                        <select {...register("kategori", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                            <option value="">Pilih Kategori</option>
                                                            {list_category}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Size</div>
                                                        <input {...register(`size`, { required: false })}
                                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                            placeholder="Masukan Size"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Qty</div>
                                                        <input defaultValue={0} {...register(`stok`, { required: false })}
                                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`} type="number"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="mb-3">Pembayaran</div>
                                                        <select {...register("payment", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                            <option value="">Pilih Pembayaran</option>
                                                            <option value="PENDING">PENDING</option>
                                                            <option value="PAID">PAID</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <div className="text-base mb-3">Deskripsi</div>
                                                        <textarea {...register("deskripsi", { required: false })} rows={5} className="resize-none bg-white h-[140px] rounded-lg w-full py-3 px-5 text-gray-700 focus:outline-none border text-base "></textarea>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => {
                                                    resetField('produk');
                                                    resetField('harga_beli');
                                                    resetField('harga_jual');
                                                    resetField('warehouse');
                                                    resetField('quality');
                                                    resetField('supplier');
                                                    resetField('kategori');
                                                    resetField('size');
                                                    resetField('stok');
                                                    resetField('payment');
                                                    resetField('deskripsi');
                                                    resetField('brand');
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

                {editModal ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <span className="text-xl font-semibold">
                                            Edit Barang Luar
                                        </span>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">

                                        <div className="text-sm">
                                            <label>Nama Produk</label>
                                            <input
                                                onChange={(e) => {
                                                    setedit_produk(e.target.value);
                                                }}
                                                value={edit_produk}
                                                className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                                                type="text"
                                                placeholder="Masukan Nama Produk" />
                                        </div>

                                        <div className="text-sm mt-6">
                                            <label>Supplier</label>
                                            <div className="mt-2 flex flex-wrap items-center justify-end">
                                                <select
                                                    onChange={(e) => {
                                                        setedit_supplier(e.target.value)
                                                    }}
                                                    value={edit_supplier}
                                                    className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm" placeholder="Pilih Store">
                                                    <option value="">Pilih Supplier</option>
                                                    {list_supplier}
                                                </select>
                                                <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                            </div>
                                        </div>

                                        <div className="text-sm mt-6">
                                            <label>Size</label>
                                            <input
                                                onChange={(e) => {
                                                    setedit_size(e.target.value);
                                                }}
                                                value={edit_size}
                                                className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                                                type="text"
                                                placeholder="Masukan Size" />
                                        </div>

                                        <div className="text-sm mt-6">
                                            <label>Harga Beli</label>
                                            <CurrencyInput
                                                onChange={(e) => {
                                                    var values = e.target.value.replace(/\D/g, "");
                                                    setedit_hargabeli(values);
                                                }}
                                                groupSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                defaultValue={edit_hargabeli}
                                                // value={edit_hargabeli}
                                                className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                                                type="text"
                                                placeholder="Masukan Harga Beli" />
                                        </div>

                                        <div className="text-sm mt-6">
                                            <label>Status Pembayaran</label>
                                            <div className="mt-2 flex flex-wrap items-center justify-end">
                                                <select
                                                    onChange={(e) => {
                                                        setedit_payment(e.target.value)
                                                    }}
                                                    value={edit_payment}
                                                    className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm" placeholder="Pilih Store">
                                                    <option value="">Pilih Payment</option>
                                                    <option value="PAID">PAID</option>
                                                    <option value="PENDING">PENDING</option>

                                                </select>
                                                <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                            </div>
                                        </div>
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
                ) : null}

                {
                    delModal ? (
                        <>
                            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                            <span className="text-sm font-semibold">
                                                Warning
                                            </span>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 flex-auto">
                                            <p className="text-sm font-semibold">
                                                Produk {produk_name} akan dihapus?
                                            </p>
                                            <p className="text-sm italic text-red-400">
                                                *Data penjualan akan tetap ada
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

            </div >

        </>
    );
}
