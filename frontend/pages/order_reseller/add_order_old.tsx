import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Select from 'react-select';
import { table } from "console";
import TableRows from "../../components/tablerows";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { stringify } from "querystring";
import { compareAsc, format } from 'date-fns';
import { redirect } from "next/dist/server/api-utils"; import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(res => res.json());
import axios from 'axios';

// export async function getServerSideProps() {
//     const response = await fetch('https://dummyjson.com/products?limit=30&skip=0');
//     const dataProducts = await response.json();

//     return {
//         props: {
//             dataProducts
//         }
//     };
// }

// export default function AddOrder({ dataProducts: dataProduct_ }: any) {
export default function AddOrder() {
    const [dataProduct, setData] = useState([]);
    const [showModal, setShowModal] = React.useState(false);

    const { data, error, isLoading } = useSWR(`https://apitest.lokigudang.com/getstore`, fetcher);

    let list_store: any = [];

    if (!isLoading && !error) {
        data.data_store.map((store: any, index: number) => {
            list_store.push(
                <option key={index} value={store.id_store}>{store.store}</option>
            )
        })
    } else {
        var data_store: any = [];
    }

    async function focusSearch(event: any) {
        if (event.target.value === '') {
            setLoadData('standby');
        } else {
            setLoadData('searching');
            await axios.get(`https://apitest.lokigudang.com/products_sales/${event.target.value}`).then(function (response) {
                // console.log(response.data);
                const newDataProduct = response.data;
                setData(newDataProduct.product);
                setLoadData('showing');
            });
            // const req = await fetch(`https://apitest.lokigudang.com/products/${event.target.value}`,
            //     {
            //         method: 'GET',
            //         headers: {
            //             'Access-Control-Allow-Origin': '*',
            //         },
            //     }
            // );
        }
    }

    // const size = useRef([]);

    let productList: any = [];
    {
        dataProduct.map((product: any) => {
            for (let index = 0; index <= product.variation_sales.length - 1; index++) {
                productList.push(
                    <div key={product.id + product.variation_sales[index].size} className="flex flex-warp gap-5 items-center py-4 w-full hover:bg-gray-100 px-3">
                        <div className="h-[70px] w-[70px] rounded-lg">
                            <Image
                                className='m-auto max-w-[100%] max-h-[100%]'
                                src={`https://lokigudang.com/apiupload/${product.img}`}
                                alt='product-1'
                                height="500"
                                width="500"
                                priority
                            />
                        </div>
                        <div className="h-auto grow w-fit text-sm grid grid-rows-2">
                            <span>{product.produk}</span>
                            <div className="flex flex-wrap gap-2">
                                <div className="border border-blue-700 text-blue-700 w-fit px-2 py-1 rounded-lg font-medium">
                                    size {product.variation_sales[index].size}
                                </div>

                                <div className={`${product.stok === 'Internal' ? "border-green-700 text-green-700" : "border-orange-700 text-orange-700"} border w-fit px-2 py-1 rounded-lg font-medium`}>
                                    {product.stok}
                                </div>
                            </div>
                        </div>
                        <div className="text-end">
                            {(function () {
                                if (product.variation_sales[index].qty < 1) {
                                    return (
                                        <button className="py-2 px-3 rounded-lg bg-gray-500 text-white text-xs" disabled>
                                            Stok Kosong
                                        </button>
                                    )
                                } else {
                                    return (
                                        <button className="py-2 px-3 rounded-lg bg-blue-700 text-white text-xs"
                                            onClick={() => addProduk(
                                                index,
                                                product.produk,
                                                product.id_produk,
                                                product.variation_sales[index].size,
                                                product.n_price,
                                                product.img,
                                                product.id_brand,
                                                product.quality,
                                            )}>
                                            Tambahkan
                                        </button>
                                    )
                                }
                            })()}

                        </div>
                    </div>
                )

            }
        })
    }

    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const router = useRouter();

    const [showProduct_, setshowProduct_] = useState(false);
    const [LoadData, setLoadData] = useState('standby');

    function showProduct() {
        setshowProduct_(true);
    }

    const inputRef = useRef(null);
    const searchInput = useRef(null);
    const total_penjualan = useRef(null);

    const id_pesanan = useRef(null);
    const id_store = useRef(null);
    const customer = useRef(null);
    const catatan = useRef(null);

    const [rowsData, setRowsData] = useState([]);

    const [idEdit, setidEdit] = useState(null);

    const [totalQty, settotalQty] = useState(0);

    const editTools = useRef([]);
    const editButton = useRef([]);

    function editToolsButton(index: any) {
        if (editTools.current[index].classList.contains('hidden')) {
            setidEdit(index);
            editTools.current[index].classList.remove('hidden');
            editTools.current[index].classList.add('block');
        } else {
            editTools.current[index].classList.remove('block');
            editTools.current[index].classList.add('hidden');
        }
    }

    function addProduk(index: any, produk: any, idproduk: any, size: any, harga: any, img: any, id_brand: any, quality: any) {
        if (!rowsData.find(item => item.idproduk === idproduk && item.size === size)) {
            // if (stok < 1) {
            //     toast.warning("Maaf, Stok Size " + size + " Tidak Tersedia", {
            //         position: toast.POSITION.TOP_RIGHT,
            //         pauseOnHover: false,
            //         autoClose: 2000,
            //     });
            // } else {
            const rowsInput = {
                produk: produk,
                idproduk: idproduk,
                quality: quality,
                id_brand: id_brand,
                size: size,
                harga: harga,
                discount_item: 0,
                qty: 1,
                subtotal: harga * 1,
                img: img
            }
            setRowsData([...rowsData, rowsInput]);
            searchInput.current.value = "";
            setshowProduct_(false);
            setLoadData('standby');

            settotalQty(totalQty + 1);
            // }
        } else {
            toast.info("Produk dengan size yang sama telah ditambahkan sebelumnya", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
            searchInput.current.value = "";
            setshowProduct_(false);
            setLoadData('standby');
        }
    }

    const deleteTableRows = (index: number) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
        settotalQty(totalQty - 1);
        setidEdit(null);
        editTools.current[index].classList.remove('block');
        editTools.current[index].classList.add('hidden');
    }

    const handleChange = (index: any, e: any) => {
        const rowsInput = [...rowsData];
        rowsData[index].discount_item = e.target.value;
        setRowsData(rowsInput);
    }

    const handleChange2 = (index: any, e: any) => {
        const rowsInput = [...rowsData];
        rowsData[index].subtotal = (rowsData[index].harga * rowsData[index].qty) - e.target.value;
        setRowsData(rowsInput);

        toast.success("Discount Update", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });
    }

    const handleChangeharga = (index: any, e: any) => {
        const rowsInput = [...rowsData];
        rowsData[index].harga = e.target.value;
        setRowsData(rowsInput);
    }

    const handleChange2harga = (index: any, e: any) => {
        const rowsInput = [...rowsData];
        rowsData[index].subtotal = (e.target.value * rowsData[index].qty) - rowsData[index].discount_item;
        setRowsData(rowsInput);

        toast.success("Harga Update", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });
    }

    useEffect(() => {
        let handler = (e: any) => {
            if (!inputRef.current.contains(e.target)) {
                searchInput.current.value = "";
                setshowProduct_(false);
                setLoadData('standby');
            }

            if (rowsData.length > 0 && idEdit != null) {
                if (!editTools.current[idEdit].contains(e.target) && !editButton.current[idEdit].contains(e.target)) {
                    editTools.current[idEdit].classList.remove('block');
                    editTools.current[idEdit].classList.add('hidden');
                    setidEdit(null);
                }
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };

    })

    const totalInvoice = (rowsData.reduce((total, currentItem) => total = total + currentItem.subtotal, 0));

    const [discountNota, setdiscountNota] = useState(0);
    const [biayaLainnya, setbiayaLainnya] = useState(0);

    const totalamount = totalInvoice - discountNota - biayaLainnya;

    function DiskonNota(value: any) {
        setdiscountNota(value);
    }

    function BiayaLain(value: any) {
        setbiayaLainnya(value);
    }


    async function saveSales() {
        let res = await fetch("https://apitest.lokigudang.com/saveSales", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: rowsData,
                id_pesanan: id_pesanan.current.value,
                tanggal: date,
                id_store: id_store.current.value,
                customer: customer.current.value,
                diskon_nota: discountNota,
                biaya_lainnya: biayaLainnya,
                total_amount: total_penjualan.current.value,
                catatan: catatan.current.value,
            }),
        });
        let resJson = await res.json();

        toast.success("Penjualan telah disimpan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
            onClose: () => router.back(),
        });
        setRowsData([]);
        setDate(format(new Date(), 'yyyy-MM-dd'));
        id_store.current.value = "";
        customer.current.value = "";
        catatan.current.value = "";
        id_pesanan.current.value = "";
        setdiscountNota(0);
        setbiayaLainnya(0);
        settotalQty(0);
    }

    return (
        <div>
            <div className="border-b border-[#2125291A] h-16 mb-7">
                <div className="flex flex-wrap items-center">
                    <button className="bg-gray-200 p-4 rounded-lg mr-6 " onClick={() => router.back()}>
                        <fa.FaChevronLeft size={13} />
                    </button>
                    <span className="font-bold text-3xl">Tambah Order</span>
                </div>

            </div>
            {/* {JSON.stringify(rowsData) + date + "/" + totalamount} */}
            <ToastContainer className="mt-[50px]" />

            <div className="flex flex-nowrap gap-5">
                <div className="bg-white h-fit rounded-lg p-5">
                    <div className="mb-3">
                        <span className="font-bold">Nama Penerima</span>
                        <input ref={customer} className="h-auto rounded-lg focus:bg-white w-full bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Nama Penerima" />
                    </div>

                    <div className="mb-3">
                        <span className="font-bold">ID Pesanan</span>
                        <input ref={id_pesanan} className="h-auto rounded-lg w-full focus:bg-white bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Masukan ID Pesanan" />
                    </div>

                    <div className="mb-3">
                        <span className="font-bold">Store Channel</span>
                        {/* <input className="h-auto rounded-lg w-full bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Pilih Store" /> */}
                        <div className="flex flex-wrap items-center mt-2 justify-end">
                            <select ref={id_store} className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-zinc-100 py-2 px-5 focus:outline-none border text-base" placeholder="Pilih Store">
                                <option value="">Pilih Store Channel</option>
                                {list_store}
                            </select>
                            <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>

                    </div>

                    <div className="mb-3">
                        <span className="font-bold">Tanggal Order</span>
                        <div className="rounded-lg ml-auto w-full mt-2 flex flex-row items-center justify-end">
                            <Flatpickr
                                className="text-start h-full rounded-lg w-full bg-zinc-100 py-2.5 px-5 text-gray-700 focus:outline-none border"
                                value={date}
                                placeholder="Pilih Tanggal Order"
                                options={{
                                    mode: "single",
                                    dateFormat: "Y-m-d",
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

                            <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>
                    </div>

                    <div className="mb-3">
                        <span className="font-bold">Note</span>
                        <textarea ref={catatan} rows={5} className="resize-none focus:bg-white h-auto rounded-lg w-full bg-zinc-100 py-3 px-5 mt-2 text-gray-700 focus:outline-none border text-base "></textarea>
                    </div>
                </div>

                <div className="grow rounded-lg grid grid-flow-row auto-rows-max gap-5">

                    <div className="bg-white h-auto rounded-lg p-5 w-full" ref={inputRef}>
                        <div className="flex flex-wrap items-center justify-end">
                            <input onFocus={showProduct} ref={searchInput} onChange={focusSearch} className="h-auto focus:bg-white rounded-lg w-full bg-zinc-100 py-2 px-5 pr-12 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Cari Produk" />
                            <i className="fi fi-rr-barcode-read w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>
                        <div className={`${showProduct_ ? 'block' : 'hidden'} w-full relative `}>
                            {(function () {
                                if (LoadData === 'standby') {
                                    return (
                                        <div className="p-4 h-auto bg-white absolute w-full rounded shadow overscroll-y-auto overflow-x-hidden">
                                            <span>Belum ada produk ditampilkan...</span>
                                        </div>
                                    );
                                } else if (LoadData === 'searching') {
                                    return (
                                        <div className="p-4 h-auto bg-white absolute w-full rounded shadow overscroll-y-auto overflow-x-hidden">
                                            <div className="animate-pulse flex flex-warp gap-5 items-center">
                                                <div className="bg-gray-200 h-[45px] w-[45px]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[40%]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[50%]"></div>
                                            </div>
                                            <div className="animate-pulse flex flex-warp gap-5 items-center mt-4">
                                                <div className="bg-gray-200 h-[45px] w-[45px]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[40%]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[50%]"></div>
                                            </div>
                                            <div className="animate-pulse flex flex-warp gap-5 items-center mt-4">
                                                <div className="bg-gray-200 h-[45px] w-[45px]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[40%]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[50%]"></div>
                                            </div>
                                        </div>
                                    );
                                } else if (LoadData === 'showing') {
                                    return (
                                        <div className="h-auto max-h-[300px] bg-white  absolute w-full rounded shadow z-10 ">
                                            <div className="h-full max-h-[300px] overscroll-y-auto overflow-x-hidden scrollbar-none">
                                                {productList}
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>

                    <div className="bg-white h-auto rounded-lg py-5 px-10">
                        <div className="mt-1 pb-5">
                            <span className="font-bold">Orderan</span>
                            <table className="w-full mt-2">
                                <thead className="">
                                    <tr>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-auto">Nama</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[10%]">Size</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[7%]">Qty</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[10%]">Harga</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[13%]">Discount Item</th>
                                        <th className=" text-gray-500 text-xs text-end py-2 w-[10%]">Total</th>
                                        <th className=" text-gray-500 text-xs text-end py-2 w-[7%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-black font-medium text-sm">

                                    {rowsData.length > 0 ?
                                        <TableRows
                                            handleChange2={handleChange2}
                                            handleChangeharga={handleChangeharga}
                                            handleChange2harga={handleChange2harga}
                                            editButton={editButton}
                                            rowsData={rowsData}
                                            deleteTableRows={deleteTableRows}
                                            handleChange={handleChange}
                                            editTools={editTools}
                                            editToolsButton={editToolsButton}
                                        />
                                        :
                                        <tr className="h-[200px]">
                                            <td colSpan={7}>
                                                <div className="grid grid-flow-row auto-rows-max items-center justify-center text-center gap-1">
                                                    <Image
                                                        className="w-[70px] h-auto m-auto"
                                                        src="/open-box.png"
                                                        alt="Picture of the author"
                                                        width={100}
                                                        height={100}
                                                        placeholder="blur"
                                                        blurDataURL={'/open-box.png'}
                                                    />
                                                    <span className="text-gray-400">Belum ada produk ditambahkan</span>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tbody className="text-black border-[#2125291A] font-medium text-sm">
                                    <tr className="border-b">
                                        <td className="py-2" colSpan={5}>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5" colSpan={2}>
                                            <span className="">Subtotal</span>
                                        </td>
                                        <td className="py-2.5 text-start">
                                            <span className="">{totalQty}</span>
                                        </td>
                                        <td className="py-2.5 text-end" colSpan={3}>
                                            <span className="">Rp{totalInvoice}</span>
                                        </td>
                                        <td className="py-2.5 px-3 text-end">
                                            <button className="">
                                                <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>

                                <tbody className="text-black border-b border-t border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-2.5" colSpan={5}>
                                            <span className="">Diskon Nota</span>
                                        </td>
                                        <td className="py-2.5 text-end">
                                            <input
                                                className="w-full focus:outline-none"
                                                value={discountNota}
                                                type="number"
                                                min={0}
                                                onChange={(e) => DiskonNota(parseInt(e.target.value))}
                                            // onBlur={(e) => handleChange2(e)}
                                            />
                                            {/* <span className="text-red-500 font-bold">(Rp{totalInvoice})</span> */}
                                        </td>
                                        <td className="py-2.5 px-3 text-end">
                                            <button className="">
                                                <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>

                                <tbody className="text-black border-b border-t border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-2.5" colSpan={5}>
                                            <span className="">Biaya Lainnya</span>
                                        </td>
                                        <td className="py-2.5 text-end">
                                            <input
                                                className="w-full focus:outline-none"
                                                value={biayaLainnya}
                                                type="number"
                                                min={0}
                                                onChange={(e) => BiayaLain(parseInt(e.target.value))}
                                            // onBlur={(e) => handleChange2(e)}
                                            />
                                            {/* <span className="">Rp{totalInvoice}</span> */}
                                        </td>
                                        <td className="py-2.5 px-3 text-end">
                                            <button className="">
                                                <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody className="text-black border-b border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-5" colSpan={5}>
                                            <span className="font-bold">TOTAL MODAL</span>
                                        </td>
                                        <td className="py-5 text-end">
                                            <span className="font-bold text-xl text-blue-600">Rp{totalamount}</span>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody className="text-black border-b border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-5" colSpan={4}>
                                            <span className="font-bold">TOTAL PEMBAYARAN</span>
                                        </td>
                                        <td className="py-5 text-end" colSpan={3}>
                                            <input ref={total_penjualan}
                                                className="h-auto rounded-lg w-full focus:bg-white bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base"
                                                type="text"
                                                placeholder="Total Pembayaran" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white h-[150px] rounded-lg">

                    </div>

                    <div className="flex flex-wrap pb-10 gap-4">
                        <button className="bg-transparent border-2 text-blue-700 border-blue-700 p-2 rounded-lg w-1/2">
                            Simpan dan Tambah Order Baru
                        </button>

                        <button className="bg-blue-700 text-white border-2 border-blue-700 hover:bg-blue-800 hover:border-blue-800 p-2 rounded-lg grow" onClick={saveSales}>
                            Simpan Order
                        </button>
                    </div>
                </div>



            </div >
        </div>
    );
}
