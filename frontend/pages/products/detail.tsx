import * as fa from "react-icons/fa";
import Image from "next/image";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { useRouter } from "next/router";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import { Collapse } from "react-collapse";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import CurrencyInput from 'react-currency-input-field';
import axios from 'axios';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Details() {
    const router = useRouter();

    return (
        <div className="p-5">
            <div className="flex flex-wrap items-center gap-4 mb-4 border-b pb-3">
                <button className="bg-gray-200 p-2 rounded-lg" onClick={() => router.back()}>
                    <fa.FaChevronLeft size={13} />
                </button>
                <span className="font-bold text-xl">Details</span>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 grow h-auto content-start">
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">
                        <div className="grid grid-rows-3 items-center">
                            <div className="font-medium text-base border-b pb-3">
                                Informasi Stok Opname
                            </div>

                            <div className="font-bold text-base text-black">
                                asd
                            </div>
                        </div>

                    </a>

                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/restock.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                            </div>

                            <div className="font-medium pt-1.5 text-base text-gray-400">
                                Restock
                            </div>

                            <div className="font-bold text-xl text-black">
                            </div>
                        </div>

                    </a>
                </div>
            </div>

        </div>
    );
}
