import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { compareAsc, format } from 'date-fns'
import Cookies from "js-cookie";
import axios from 'axios';
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

    const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy'));

    const router = useRouter();

    const [Username, setUsername]: any = useState(null);
    const [Name, setName]: any = useState(null);
    const [id, setid]: any = useState(null);

    //hook useEffect
    useEffect(() => {
        { Cookies.get('auth') ? setUsername(Cookies.get('auth_username')) : setUsername("") }
        { Cookies.get('auth') ? setName(Cookies.get('auth_name')) : setUsername("") }
        { Cookies.get('auth') ? setid(Cookies.get('auth_idusername')) : setUsername("") }
    }, []);

    const [Password, setPassword]: any = useState("");

    async function updatePass() {
        await axios.post(`http://localhost:4000/v1/updatepassword`, {
            id: id,
            password: Password,
        }).then(function (response) {
            // console.log(response.data);
            toast.info("Password Berhasil diubah, Silahkan Login Kembali", {
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: false,
                autoClose: 800,
            });
            Cookies.remove('auth')
            Cookies.remove('auth_idusername')
            Cookies.remove('auth_username')
            Cookies.remove('auth_password')
            Cookies.remove('auth_role')
            router.reload();
        });
    }

    return (
        <div className="p-5">
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">General Setting</div>

            <ToastContainer className="mt-[50px]" />

            <div className="mx-auto w-[50%]">
                <div className="mt-6">
                    <label className="block mb-2 ml-1 text-[20px] text-sm font-medium text-black">Username</label>
                    <input
                        className={`"border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        value={Username ? Username : ""}
                        readOnly
                    />
                </div>

                <div className="mt-6">
                    <label className="block mb-2 ml-1 text-[20px] text-sm font-medium text-black">Nama</label>
                    <input
                        className={`"border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        value={Name ? Name : ""}
                        readOnly
                    />
                </div>

                <div className="mt-6">
                    <label className="block mb-2 ml-1 text-[20px] text-sm font-medium text-black">Password</label>
                    <input
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        className={`"border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="password"
                        placeholder="*****"
                        value={Password}
                    />
                </div>

                <div className="mt-6 justify-end flex flex-1">
                    <button
                        onClick={(e) => updatePass()}
                        className="cursor-pointer ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Simpan
                        <div className="my-auto">
                            <fa.FaSave size={13} className="text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
