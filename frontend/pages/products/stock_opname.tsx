import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";

export default function StockOpname() {
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (openSize === index) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

    const produk: any = [];

    for (let index = 0; index < 5; index++) {
        produk.push(
            <tbody key={index} className="group hover:shadow-lg rounded-lg">
                <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-wrap justify-center items-center h-full bg-white rounded-tl-lg rounded-bl-lg">
                            {index + 1}
                        </div>
                    </td>
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-row gap-4 items-center h-full bg-white pl-4 py-3">
                            05 Apr 23 - 00:47
                        </div>
                    </td>
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 ">
                            <button className="cursor-pointer text-green-600 font-medium hover:underline">712678</button>
                        </div>
                    </td>
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                            10
                        </div>
                    </td>
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                            Gudang Utama
                        </div>
                    </td>
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                            Stok Sendiri
                        </div>
                    </td>
                    <td className="p-0 pt-4 h-full">
                        <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 rounded-tr-lg rounded-br-lg">
                            {/* <button className="text-blue-500">
                                <i className="fi fi-rr-edit text-center text-lg"></i>
                            </button>
                            <button className="text-red-500">
                                <i className="fi fi-rr-trash text-center text-lg"></i>
                            </button> */}
                        </div>
                    </td>
                </tr>
            </tbody>
        )

    }

    return (
        <div className="p-5">
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Stok Opname
            </div>

            <div className="flex flex-wrap items-center content-center mb-6">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input className="h-[45px] border-0 w-[300px]  pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari nama, SKU, atau scan barcode..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="ml-auto flex flex-row items-center justify-end">
                    <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        <Link href='/products/add_stok_opname'>Buat Stok Opname</Link>
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </div>

            </div>

            <table className="table bg-transparent h-px mb-4 text-sm w-full">

                <thead className="bg-[#DDE4F0] text-gray-800">
                    <tr className="rounded-lg">
                        <th className="pl-2 py-3 rounded-l-lg">
                            No.
                        </th>
                        <th className="py-3 text-start pl-4">
                            Tanggal Stok Opname
                        </th>
                        <th className="py-3">
                            ID Stok Opname
                        </th>
                        <th className="py-3">
                            Produk
                        </th>
                        <th className="py-3">
                            Gudang
                        </th>
                        <th className="py-3">
                            Keterangan
                        </th>
                        <th className="py-3 rounded-r-lg">
                            {/* Action */}
                        </th>
                    </tr>
                </thead>

                {produk}

            </table>
        </div>
    );
}
