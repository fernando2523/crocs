import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from 'date-fns';
import Link from "next/link";
import { count } from "console";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import useSWR from 'swr';
import styles from '../../styles/Table.module.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Shipping() {
    // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

    const [Query, setQuery] = useState("all");

    function querySet(e: any) {
        if (e.target.value === "") {
            setQuery("all");
        } else {
            setQuery(e.target.value);
        }

    }

    const { data, error, isLoading } = useSWR(`https://apitest.lokigudang.com/orders/0/10/SELESAI/${Query}`, fetcher);

    const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [start, setStart] = useState(30);
    const [hasMore, setHasMore] = useState(true);

    const list_order: any = [];

    if (!isLoading && !error) {
        data.orders.map((order: any, index: number) => {
            return (
                list_order.push(
                    <div key={order.id} className="hover:shadow-md w-full h-auto bg-white rounded-lg text-sm">
                        <div className="flex flex-1 w-full h-auto border-b py-4 px-4">
                            <div className="grow">Cust. <b>{order.customer}</b> | {order.sales_channel}</div>
                            <div className="text-start">No. Pesanan {order.id_pesanan}</div>
                        </div>

                        <div className="h-auto p-4 py-6 items-center justify-start flex flex-wrap">
                            <div className="w-[3%] ml-3">
                                {index + 1}.
                            </div>

                            <div className="flex flex-col w-[36%] gap-2">
                                {(function (rows: any, i, len) {
                                    while (++i <= len) {
                                        rows.push(
                                            <div key={i} className="flex justify-start items-start gap-7">
                                                <Image
                                                    className="max-w-[60px] rounded-lg max-h-[60px]"
                                                    // src="/produk.jpg"
                                                    src={`https://lokigudang.com/apiupload/${order.details_order[i - 1].img}`}
                                                    alt="product-1"
                                                    height="500"
                                                    width="500"
                                                    priority
                                                />
                                                <div className="flex flex-col gap-2 grow">
                                                    <span>{order.details_order[i - 1].produk}</span>
                                                    <span className="text-xs text-gray-500">Variasi {order.details_order[i - 1].size}</span>
                                                </div>

                                                <div className="mx-20">
                                                    <span>x{order.details_order[i - 1].qty}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return rows;
                                })([], 0, order.details_order.length)}
                            </div>

                            <div className="text-start w-[20%] flex flex-col">
                                <span>Rp{order.total_amount}</span>
                                <span>{order.payment.length < 1 ? "Belum ada Pembayaran" : ""}</span>
                            </div>

                            <div className="w-[20%]">
                                <span>{order.status_pesanan}</span>
                            </div>

                            <div className="w-[20%]">
                                <span>{order.catatan}</span>
                            </div>

                        </div>

                        {/* <div className="flex flex-wrap justify-end gap-3 p-4 border-t">
                            <button className="bg-white border-2 border-blue-400 h-auto rounded-lg py-1.5 px-3 grid grid-flow-row">
                                <span className="text-blue-500 text-sm font-medium">Selesaikan Pesanan</span>
                            </button>
                        </div> */}

                    </div>
                )
            )
        })
    }


    const CustomMaterialPagination = ({ rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage }: any) => (
        <div className="bg-white border-t px-3 py-2 flex flex-wrap justify-start h-14 items-center">
            <div className="grow">
                Menampilkan {String(currentPage)}-{String(Math.ceil(rowCount / 10))} dari {String(rowCount)} items
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal" onClick={({ }) => onChangePage(currentPage === 1 ? currentPage : currentPage - 1)}>Back</button>
                <button className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal" onClick={({ }) => onChangePage(currentPage + 1)}>Next</button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">Order Selesai</div>

            <div className="flex flex-wrap items-center content-center">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    {/* <button type="button" className="rounded-l-lg bg-gray-200 hover:bg-gray-300 h-[50px] text-gray-700 font-medium px-4 flex flex-wrap gap-2 content-center">
                        <span>Order ID</span>
                        <div className="my-auto">
                            <fa.FaChevronDown size={10} className="text-gray-700" />
                        </div>
                    </button> */}

                    <input onChange={(e) => querySet(e)} className="h-[50px] border-0 w-[280px] py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Pencarian..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[50px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end">
                    <Flatpickr
                        className="text-gray-500 h-[50px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
                        // value={date}
                        placeholder="Select Date Range"
                        options={{
                            mode: "range",
                            dateFormat: "d/m/Y",
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

                    <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-4"></i>
                </div>

                <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[50px] text-white px-4 flex flex-wrap gap-2 content-center">
                    <Link href='/order/add_order'>Tambah Order</Link>
                    <div className="my-auto">
                        <fa.FaPlus size={13} className="text-white" />
                    </div>
                </button>
            </div>

            <div className="font-medium text-black py-4">
                <span>{list_order.length} order ditampilkan</span>
            </div>

            <table className="table bg-transparent h-px mb-4 text-sm w-full">
                <thead className="bg-white text-gray-800">
                    <tr className="rounded-lg">
                        <th className="pl-2 py-3 rounded-l-lg w-[5%] text-start">
                            <span className="ml-3">No.</span>
                        </th>
                        <th className="pl-2 py-3 w-[35%] text-start">
                            Produk
                        </th>
                        <th className="py-3 w-[20%] text-start">
                            Total Pembayaran
                        </th>
                        <th className="py-3 w-[20%] text-start">
                            Status
                        </th>
                        <th className="py-3 w-[20%] rounded-r-lg text-start">
                            Catatan
                        </th>
                    </tr>
                </thead>
            </table>

            <div className="grid grid-cols-1 gap-4 w-full h-auto pb-10">
                {list_order}
            </div>

            {/* <div className="mb-20">
                <DataTable
                    className="items-center"
                    columns={columns}
                    data={list_order}
                    // selectableRows
                    pagination
                    paginationComponent={CustomMaterialPagination}
                />
            </div> */}

        </div>
    );
}
