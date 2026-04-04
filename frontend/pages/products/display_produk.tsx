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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
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
import { query } from "express";
import Cookies from "js-cookie";
import { el } from "date-fns/locale";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});


export default function DaftarProduk() {
    const [isLoading, setisLoading]: any = useState(true);
    const [data_produk, setdataproduk] = useState([]);
    const [data_ware, setdataware] = useState([]);
    const [data_warenow, setdatastore_warehouse] = useState([]);
    const [data_store, setdatastore] = useState([]);
    const [total_produk, setdatatotalproduk] = useState(0);
    const [sum_produk, setdatasumproduk] = useState(0);
    const [data_category, setdatacategory] = useState([]);
    const [data_brand, setdatabrand] = useState([]);
    const [data_supplier, setdatasupplier] = useState([]);
    const [data_historypo, setdatahistorypo] = useState([]);
    const [data_historypo_transfer, setdatahistoryptransfer] = useState([]);
    const [data_so, setdataso] = useState([]);
    const [storenow, setStorenow] = useState([]);
    const [loadmorelimit, setloadmore]: any = useState(0);
    const [show_page, setshow_page]: any = useState(1);
    const [gopage, setgopage]: any = useState(1);
    const [total_pages, settotal_pages]: any = useState([]);
    const [nos_count, setno]: any = useState(1);

    useEffect(() => {
        getstore(Role, area);
        getwarehouse(Role, area);
        loaddataproduk(Store, Query, area, Role, loadmorelimit);
        getcategory();
        getbrand();
        getsupplier();
        gethistoripo();
        gethistoriso();
    }, []);

    async function loaddataproduk(store: any, query: any, area: any, Role: any, loadmorelimit: any) {
        setisLoading(true);
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/getprodukdisplay`,
            data: {
                store: store,
                query: query,
                area: area,
                role: Role,
                loadmorelimit: loadmorelimit,
            },
        })
            .then(function (response) {
                setdataproduk(response.data.result.datas);
                settotal_pages(response.data.result.total_pages);
                setshow_page(response.data.result.show_page / 20);
                setloadmore(response.data.result.datas.length);
                setisLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    async function getwarehouse(Role: any, area: any) {
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/getwarehousedisplayproduct`,
            data: {
                role: Role,
                store: area,
                idware: getwaress,
            },
        })
            .then(function (response) {
                setdataware(response.data.result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function getstore(Role: any, area: any) {
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/getstoredisplay`,
            data: {
                role: Role,
                store: area,
            },
        })
            .then(function (response) {
                setdatastore(response.data.result);
                setStorenow(response.data.result[0].id_store);
                setdatastore_warehouse(response.data.result[0].id_ware);
                if (
                    "SUPER-ADMIN" === Cookies.get("auth_role") ||
                    "HEAD-AREA" === Cookies.get("auth_role")
                ) {
                } else {
                    setValue("store", response.data.result[0].id_store);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [Query, setQuery] = useState("all");
    const list_query: any = [];
    const filter_query = list_query.filter((list_query: any) => {
        return list_query.produk
            .toLocaleLowerCase()
            .includes(Query.toLocaleLowerCase());
    });

    const [Warehouse, setWarehouse] = useState("all");
    if ("SUPER-ADMIN" === Cookies.get("auth_role")) {
        var [Store, setStore] = useState("all");
    } else if ("HEAD-AREA" === Cookies.get("auth_role")) {
        var [Store, setStore] = useState("all_area");
    } else {
        var [Store, setStore] = useState(Cookies.get("auth_store"));
    }

    const [Role, setRole] = useState(Cookies.get("auth_role"));
    const [Name, setName] = useState(Cookies.get("auth_name"));
    const [area, setarea] = useState((Cookies.get("auth_store")));
    const [getwaress, setgetwares] = useState((""));
    const [isDisabled, setIsDisabled] = useState(false);

    function querySet(e: any) {
        if (e.target.value === "") {
            setQuery("all");
            loaddataproduk(Store, "all", area, Role, loadmorelimit);
        } else {
            setQuery(e.target.value);
            loaddataproduk(Store, e.target.value, area, Role, loadmorelimit);
        }
    }

    async function keyDown(event: any) {
        if (event.key == 'Enter') {
            if (Query != "all") {
                loaddataproduk(Store, Query, area, Role, 0);
            }
        }
    }

    const [warehouse_so, setwarehouse_so] = useState("");

    const list_warehouse: any = [];
    const list_warehouse_so: any = [];

    const [notwarehouse, setnotwarehouse] = useState(null);

    if (!isLoading) {
        data_ware.map((data_ware: any, index: number) => {
            list_warehouse.push(
                <option key={index} value={data_ware.id_ware}>
                    {data_ware.warehouse}
                </option>
            );

            list_warehouse_so.push(
                <option key={index} value={data_ware.id_ware}>
                    {data_ware.warehouse}
                </option>
            );
        });
    }

    const list_store: any = [];
    if (!isLoading) {
        data_store.map((data_store: any, index: number) => {
            list_store.push(
                <option key={index} value={data_store.id_store}>
                    {data_store.store}
                </option>
            );
        });
    }

    async function getsupplier() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/getsupplier`,
        })
            .then(function (response) {
                setdatasupplier(response.data.data_supplier);
                // console.log(response.data.data_warehouse)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const list_supplier: any = [];
    if (!isLoading) {
        data_supplier.map((area: any, index: number) => {
            list_supplier.push(
                <option key={index} value={area.id_sup}>
                    {area.supplier}
                </option>
            );
        });
    }

    async function gethistoripo() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/gethistoripo`,
        })
            .then(function (response) {
                setdatahistorypo(response.data.result);
                // console.log(response.data.result)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const list_po: any = [];
    if (!isLoading) {
        data_historypo.map((historipo: any, index: number) => {
            list_po.push(
                <option key={index} value={historipo.idpo}>
                    {historipo.tanggal_receive} - {historipo.tipe_order} -{" "}
                    {historipo.idpo}
                </option>
            );
        });
    }

    async function gethistoriso() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/gethistoriso`,
        })
            .then(function (response) {
                setdataso(response.data.result);
                // console.log(response.data.result)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const list_so: any = [];
    if (!isLoading) {
        data_so.map((historiso: any, index: number) => {
            list_so.push(
                <option key={index} value={historiso.idpo}>
                    {historiso.tanggal_receive} - {historiso.tipe_order} -{" "}
                    {historiso.idpo}
                </option>
            );
        });
    }

    async function getcategory() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/getcategory`,
        })
            .then(function (response) {
                setdatacategory(response.data.data_category);
                // console.log(response.data.data_warehouse)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const list_category: any = [];
    if (!isLoading) {
        data_category.map((area: any, index: number) => {
            list_category.push(
                <option key={index} value={area.id_category}>
                    {area.category}
                </option>
            );
        });
    }

    async function getbrand() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/getbrand`,
        })
            .then(function (response) {
                setdatabrand(response.data.data_brand);
                // console.log(response.data.data_warehouse)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const list_brand: any = [];
    if (!isLoading) {
        data_brand.map((area: any, index: number) => {
            list_brand.push(
                <option key={index} value={area.id_brand}>
                    {area.brand}
                </option>
            );
        });
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
        control,
        unregister,
        resetField,
        setValue,
        handleSubmit,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm({

    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variasi",
    });

    const [showModal, setShowModal] = React.useState(false);
    const [repeatModal, setrepeatModal] = React.useState(false);
    const [stockopname, setstockopname] = React.useState(false);
    const [showModalPrintSO, setshowModalPrintSO] = React.useState(false);
    const [transferModal, settransferModal] = React.useState(false);
    const [delModal, setdelModal] = React.useState(false);
    const [editModal, seteditModal] = React.useState(false);

    const [id, setid] = React.useState(null);
    const [idware, setidware] = React.useState(null);
    const [img, setimg] = React.useState(null);

    async function showeditModal(
        id: any,
        id_produk: any,
        produk: any,
        brand: any,
        id_ware: any,
        index: number
    ) {

        await axios
            .post(`https://api.gudangsandal.com/v1/getsizesales`, {
                idware: id_ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                setdatasize(response.data.result.datasize);
            });

        setgetwares(id_ware);
        setid(id);
        setValue("edit_id_produk", id_produk);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("select_warehouse", id_ware);
        setShowModal(true);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios
            .post(`https://api.gudangsandal.com/v1/add_display`, {
                select_id_produk: data.edit_id_produk,
                select_warehouse: data.select_warehouse,
                select_size: data.select_size,
                user: Name,
                store: Store,
            }).then(function (response) {
                loaddataproduk(Store, Query, area, Role, loadmorelimit);
                getwarehouse(Role, area);
                getstore(Role, area);
                toast.success("Data telah diupdate", {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                    autoClose: 2000,
                });

                resetField("select_warehouse");
                resetField("select_size");
                setShowModal(false);
            });
    };

    const [transferproduct, settransferproduct] = React.useState("");
    const [idtransferproduct, setidtransferproduct] = React.useState("");
    const [waretransferproduct, setwaretransferproduct] = React.useState("");

    async function showtransferModal(
        id: any,
        produk: any,
        id_produk: any,
        brand: any,
        kategori: any,
        kualitas: any,
        harga: any,
        img: any,
        variation: any,
        gudang_pengirim: any,
        ware: any,
        index: number
    ) {
        settransferproduct(produk);
        setidtransferproduct(id_produk);
        setwaretransferproduct(ware);
        setnotwarehouse(ware);

        clearErrors();
        setValue("transferwaretujuan", "");
        setValue("gudangpengirim", gudang_pengirim);

        await axios
            .post(`https://api.gudangsandal.com/v1/getsizesales`, {
                idware: ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                unregister("variasitransfer");
                setdatasize(response.data.result.datasize);
                settransferModal(true);
            });
    }

    const onSubmitTransfer = async (data: any) => {
        setIsDisabled(true);
        var qty_all = 0;
        for (let index = 0; index < data.variasitransfer.length; index++) {
            qty_all = qty_all + parseInt(data.variasitransfer[index].stok_baru);
        }

        if (qty_all < 1) {
            toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        } else {
            await axios
                .post(`https://api.gudangsandal.com/v1/transferstok`, {
                    idproduk: idtransferproduct,
                    gudang_pengirim: waretransferproduct,
                    gudang_tujuan: data.transferwaretujuan,
                    variasitransfer: data.variasitransfer,
                    user: Name,
                })
                .then(function (response) {
                    loaddataproduk(Store, Query, area, Role, loadmorelimit);
                    setIsDisabled(false);
                    // gethistoripotransfer();
                });
            setIsDisabled(false);

            toast.success("Transfer berhasil", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            settransferModal(false);
        }
    };

    const [repeatProduct, setrepeatProduct] = React.useState("");
    const [datasize, setdatasize] = React.useState([]);
    const [data_po, setdata_po]: any = React.useState([]);
    const [tipepo, settipepo] = React.useState("");
    const [tipeso, settipeso] = React.useState("");
    const [gudang, setgudang] = React.useState(null);

    const [list_hargabeli, setlist_hargabeli]: any = React.useState([]);

    async function showstockopname(
        id: any,
        produk: any,
        id_produk: any,
        brand: any,
        kategori: any,
        kualitas: any,
        harga: any,
        img: any,
        variation: any,
        gudang_pengirim: any,
        ware: any,
        index: number
    ) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("id_produk", id_produk);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("harga_beli", 0);
        setValue("id_gudang_pengirim", ware);
        setValue("gudang_pengirim", gudang_pengirim);

        clearErrors();
        settipeso("");
        setValue("tipe_so", "");
        setValue("harga_beli_so", "");

        setgudang(gudang_pengirim);
        setrepeatProduct(produk);

        unregister("variasirestock");

        await axios
            .post(`https://api.gudangsandal.com/v1/gethargabeliso`, {
                idware: ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                setlist_hargabeli(response.data.result);
            });

        await axios
            .post(`https://api.gudangsandal.com/v1/getsizesales`, {
                idware: ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                unregister("variasirestock");
                setdatasize(response.data.result.datasize);
            });

        await axios
            .post(`https://api.gudangsandal.com/v1/gethistorisoselected`, {
                idware: ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                setdata_po(response.data.result);
            });
        // historiso_mutate();
        setstockopname(true);

        setProduk(index);
    }

    const onSubmitSO = async (data: any) => {
        setIsDisabled(true);
        var qty_all = 0;
        for (let index = 0; index < data.variasirestock.length; index++) {
            qty_all = qty_all + parseInt(data.variasirestock[index].stok_gudang);
        }
        // console.log(data)
        if (qty_all === 0) {
            toast.warning("Jumlah Di Gudang Tidak Boleh Kosong", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        } else {
            await axios
                .post(`https://api.gudangsandal.com/v1/stockopname`, {
                    data: data,
                    users: Name,
                })
                .then(function (response) {
                    // console.log(response.data);
                    // mutate();
                    loaddataproduk(Store, Query, area, Role, loadmorelimit);
                    unregister("variasirestock");
                });

            toast.success("Repeat berhasil", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            setstockopname(false);
        }
    };

    async function showrepeatModal(
        id: any,
        produk: any,
        id_produk: any,
        brand: any,
        kategori: any,
        kualitas: any,
        harga: any,
        img: any,
        variation: any,
        gudang_pengirim: any,
        ware: any,
        index: number
    ) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("id_produk", id_produk);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("harga_beli", 0);
        setValue("id_gudang_pengirim", ware);
        setValue("gudang_pengirim", gudang_pengirim);
        setimg(`https://api.gudangsandal.com/public/images/${img}`);
        clearErrors();
        settipepo("");
        setValue("tipe_po", "");
        setValue("supplier_pobaru", "");

        setgudang(gudang_pengirim);
        setrepeatProduct(produk);

        unregister("variasirestock");

        await axios
            .post(`https://api.gudangsandal.com/v1/getsizesales`, {
                idware: ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                unregister("variasirestock");
                setdatasize(response.data.result.datasize);
                // console.log(response.data.result.datasize);
            });

        await axios
            .post(`https://api.gudangsandal.com/v1/gethistoriposelected`, {
                idware: ware,
                idproduct: id_produk,
            })
            .then(function (response) {
                setdata_po(response.data.result);
                // console.log(response.data.result);
            });

        setrepeatModal(true);

        setProduk(index);
    }

    const onSubmitRepeat = async (data: any) => {
        setIsDisabled(true);
        var qty_all = 0;
        for (let index = 0; index < data.variasirestock.length; index++) {
            qty_all = qty_all + parseInt(data.variasirestock[index].stok_baru);
        }

        if (qty_all < 1) {
            toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        } else {
            await axios
                .post(`https://api.gudangsandal.com/v1/repeatstok`, {
                    data: data,
                    users: Name,
                })
                .then(function (response) {
                    // console.log(response.data);
                    loaddataproduk(Store, Query, area, Role, loadmorelimit);
                    setValue("harga_beli_repeat", null);
                    unregister("variasirestock");
                    setIsDisabled(false);
                });

            toast.success("Repeat berhasil", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            setrepeatModal(false);
        }
    };

    function showdeleteModal(
        id_produk: any,
        produk: any,
        id_ware: any,
        index: number
    ) {
        setid(id_produk);
        setidware(id_ware);
        setproduk_name(produk);
        setdelModal(true);
    }

    async function deleteData() {
        await axios
            .post(`https://api.gudangsandal.com/v1/delete_display`, { id, idware })
            .then(function (response) {
                loaddataproduk(Store, Query, area, Role, loadmorelimit);
                getwarehouse(Role, area);
                getstore(Role, area);
            });

        toast.success("Data berhasil dihapus", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        setdelModal(false);
    }

    const [Count, setCount] = useState(0);
    const [Produk, setProduk] = useState(0);
    const [produk_name, setproduk_name] = useState(null);
    const list_produk: any = [];

    if (!isLoading) {
        var product_counts = data_produk.length;
        data_produk.map((data_produk: any, index: any) => {
            return list_produk.push(
                <tbody key={index} className="group hover:shadow-lg rounded-lg">
                    <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                        {/* <td className="p-0 pt-4 h-full">
                            <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 pl-5 rounded-lg">
                                {index + 1}
                            </div>
                        </td> */}
                        <td className="p-0 pt-4 h-full">
                            <div className="flex flex-row gap-4 items-center h-full bg-white pt-5 pb-3 pl-4">
                                <div className="aspect-square max-w-[80px] rounded flex items-center">
                                    <Image
                                        className="w-[100%] h-full rounded"
                                        src={`https://api.gudangsandal.com/public/images/${data_produk.img}`}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-xs">
                                        #{data_produk.id_produk} | {data_produk.brand[0]["brand"]}
                                    </div>
                                    <div className="text-base">{data_produk.produk}</div>

                                </div>
                            </div>
                        </td>

                        <td className="p-0 pt-4 h-full">
                            <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                {data_produk.warehouse[0]["warehouse"]}
                            </div>
                        </td>

                        <td className="p-0 pt-4 h-full">
                            <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                {/* <div className="font-bold">DISPLAYED SIZE : 44</div> */}
                                {data_produk.display.length > 0 ? (
                                    <>
                                        <div className="font-bold text-lime-600">DISPLAYED SIZE : {data_produk.display[0]["size"]}</div>
                                    </>
                                ) :
                                    (
                                        <>
                                            <div className="font-bold text-red-400">NOT DISPLAYED</div>

                                        </>
                                    )
                                }
                            </div>
                        </td>


                        <td className="p-0 pt-4 h-full">
                            <div className="h-full bg-white flex flex-col gap-1 justify-center items-center  rounded-tr-lg">
                                <div className="flex flex-warp h-[full] text-xs font-bold gap-4 justify-center items-center px-4 ">
                                    {data_produk.display.length > 0 ? (
                                        <>
                                            <button
                                                className="text-red-500"
                                                onClick={() =>
                                                    showdeleteModal(
                                                        data_produk.id_produk,
                                                        data_produk.produk,
                                                        data_produk.id_ware,
                                                        index
                                                    )
                                                }
                                            >
                                                <i className="fi fi-rr-trash text-center"></i>
                                            </button>
                                        </>
                                    ) :
                                        (
                                            <>
                                                <button
                                                    className="text-blue-500"
                                                    onClick={() =>
                                                        showeditModal(
                                                            data_produk.id,
                                                            data_produk.id_produk,
                                                            data_produk.produk,
                                                            data_produk.id_brand,
                                                            data_produk.id_ware,
                                                            index
                                                        )
                                                    }
                                                >
                                                    <i className="fi fi-rr-edit text-center"></i>
                                                </button>

                                            </>
                                        )
                                    }

                                </div>

                            </div>
                        </td>

                    </tr>

                    <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                        <td className="p-0 h-full">
                            <div className="h-full bg-white px-4 "></div>
                        </td>
                        <td className="p-0 h-full" colSpan={7}>
                            <div className="pr-6 bg-white rounded-br-lg ">
                                <div className="flex items-center h-full"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            );
        });
    }

    async function loadmore(e: any) {
        setisLoading(true);
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/getprodukdisplay`,
            data: {
                store: Store,
                query: Query,
                area: area,
                role: Role,
                loadmorelimit: e,
            },
        })
            .then(function (response) {
                setdataproduk(response.data.result.datas);
                setshow_page(response.data.result.show_page / 20);
                setgopage(0)
                setisLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [selectedImage, setSelectedImage] = useState(null);

    const inputRef = useRef(null);

    const handleClick = async () => {
        inputRef.current.click();
        // await trigger();
    };

    const imageChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    async function printSo() {
        if (warehouse_so === "") {
            toast.warning("Harap Pilih Gudang", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        } else {
            // window.open(`https://api.gudangsandal.com/v1/print_stockopname/${warehouse_so}`, '_blank');
            window.open(`/print/${warehouse_so}`);
        }
    }

    return (
        <div className="p-5">
            <div className="font-bold text-3xl">Display Store</div>

            {/* <span> {JSON.stringify(datasize)}</span> */}

            {/* <ToastContainer className="mt-[50px]" />
            {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                "HEAD-AREA" === Cookies.get("auth_role") ||
                "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                <>
                    <div className="mt-3 mb-5">
                        <div className=" flex flex-row mt-0 gap-3 text-black">
                            <div className="basis-1/2 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                                <div className="text-md font-semibold py-4  px-5">
                                    Total Artikel
                                </div>
                                <div className="flex flex-row text-left  mt-2">
                                    <div className="basis-full text-2xl font-semibold py-0 px-5">
                                        {total_produk ? total_produk : 0} Artikel
                                    </div>
                                    <div className=" basis-auto mt-1 mx-5">
                                        <ClipboardDocumentIcon className="h-10 w-10 -mt-3 text-black text-right" />
                                    </div>
                                </div>
                            </div>
                            <div className="basis-1/2 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                                <div className="text-md font-semibold py-4  px-5">
                                    Total Qty
                                </div>
                                <div className="flex flex-row text-left  mt-2">
                                    <div className="basis-full text-2xl font-semibold py-0 px-5">
                                        {sum_produk ? sum_produk : 0} Qty
                                    </div>
                                    <div className=" basis-auto mt-1 mx-5">
                                        <Box className="h-10 w-10 -mt-3 text-black text-right" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null} */}

            <div className="flex flex-wrap items-center content-center mb-6 mt-4">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value === "") {
                                setQuery("all");
                                loaddataproduk(Store, "all", area, Role, 0);
                            }
                        }}
                        onKeyDown={keyDown}
                        disabled={isLoading}
                        className="h-[45px] border-0 w-[280px] py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg"
                        type="text"
                        placeholder="Searching..."
                    />

                    <button
                        type="button"
                        disabled={isLoading}
                        className={`rounded-r-lg bg-white hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5`}
                        onClick={() => {
                            // console.log(Query)
                            if (Query != "all") {
                                loaddataproduk(Store, Query, area, Role, 0);
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
                {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") ? (
                    <>
                        <select
                            value={Store}
                            onChange={(e) => {
                                setStore(e.target.value);
                                loaddataproduk(e.target.value, Query, area, Role, loadmorelimit - 20);
                            }}
                            className={`ml-3 appearance-none border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
                        >
                            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                                <>
                                    <option value="all">All Store</option>
                                    {list_store}
                                </>
                            ) : (
                                <>
                                    <option value="all_area">All Store</option>
                                    {list_store}
                                </>
                            )}
                        </select>
                    </>
                ) : (
                    <>
                        <select
                            value={Store}
                            onChange={(e) => {
                                setStore(e.target.value);
                                loaddataproduk(e.target.value, Query, area, Role, loadmorelimit - 20);
                            }}
                            className={`ml-3 appearance-none border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
                        >
                            {list_store}
                        </select>
                    </>
                )}


                {/* <div className="ml-auto flex flex-row items-center justify-end">
                    {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                        "HEAD-AREA" === Cookies.get("auth_role") ||
                        "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                        <>
                            <button
                                onClick={() => {
                                    setwarehouse_so("");
                                    setshowModalPrintSO(true);
                                }}
                                type="button"
                                className="ml-3 shadow rounded-lg bg-green-600 hover:bg-green-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
                            >
                                Print Daftar SO
                                <div className="my-auto">
                                    <fa.FaPlus size={13} className="text-white" />
                                </div>
                            </button>
                        </>
                    ) : null}

                    {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                        "HEAD-AREA" === Cookies.get("auth_role") ||
                        "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                        <>
                            <Link href="add_produk">
                                <button
                                    type="button"
                                    className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
                                >
                                    Tambah Produk
                                    <div className="my-auto">
                                        <fa.FaPlus size={13} className="text-white" />
                                    </div>
                                </button>
                            </Link>
                        </>
                    ) : null}
                </div> */}
            </div>

            <table className="table bg-transparent h-px mb-4 text-sm w-full">
                <thead className="bg-[#323232] text-white">
                    <tr className="rounded-lg">


                        {/* <th className="pl-2 py-3 rounded-l-lg">No.</th> */}
                        <th className="py-3 text-left pl-4">Produk</th>
                        {/* <th className="py-3">Stok</th>
                                <th className="py-3">Varian</th> */}
                        <th className="py-3">Warehouse</th>
                        <th className="py-3">Display</th>
                        <th className="py-3 border-r-lg" colSpan={2}>Act</th>

                    </tr>
                </thead>
                {(function () {
                    if (product_counts < 1) {
                        return (
                            <tbody>
                                <tr>
                                    <td colSpan={7}>
                                        <div className="w-[100%] py-3 text-center mt-10">
                                            Produk Belum Tersedia, Silahkan Pilih Gudang
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    } else {
                        return list_produk;
                    }
                })()}
            </table>



            {showModal ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100vh]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">Add Product Display</span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex flex-auto gap-6">


                                    <div className="grow">
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                ID Produk
                                            </label>
                                            <input
                                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                disabled={true}
                                                {...register("edit_id_produk", { required: true })}
                                            />
                                            {errors.edit_id_produk && (
                                                <div className="mt-1 text-sm italic">
                                                    This field is required
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                Nama Produk
                                            </label>
                                            <input
                                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                disabled={true}
                                                {...register("edit_produk", { required: false })}
                                            />
                                            {errors.edit_produk && (
                                                <div className="mt-1 text-sm italic">
                                                    This field is required
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                Brand
                                            </label>
                                            <select
                                                {...register("edit_brand", { required: false })}
                                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                disabled={true}
                                            >
                                                {list_brand}
                                            </select>
                                            {errors.edit_brand && (
                                                <div className="mt-1 text-sm italic">
                                                    This field is required
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                Warehouse
                                            </label>
                                            <select
                                                {...register("select_warehouse", { required: false })}
                                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                disabled={true}
                                            >
                                                {/* <option value="">Pilih Warehouse</option> */}
                                                {list_warehouse}
                                            </select>
                                            {errors.select_warehouse && (
                                                <div className="mt-1 text-sm italic">
                                                    This field is required
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                SIZE
                                            </label>
                                            <select
                                                {...register("select_size", { required: false })}
                                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                            >
                                                {(function (rows: any, i, len) {
                                                    while (++i <= datasize.length) {
                                                        if (datasize[i - 1].qty > 0) {
                                                            rows.push(
                                                                <option key={i} value={datasize[i - 1].size}>{datasize[i - 1].size}</option>
                                                            );
                                                        }
                                                    }
                                                    return rows;
                                                })([], 0, + 1)}
                                            </select>

                                        </div>


                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setShowModal(false);
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

            {repeatModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="mb-[40px] mx-auto w-[60%]">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        Restock : {repeatProduct} | {gudang}
                                    </span>
                                </div>

                                {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                                {/*body*/}
                                <div className="p-6 gap-4 flex flex-auto h-[auto]">
                                    <div className="w-[33%] text-sm flex flex-col">
                                        {/* <div className="flex flex-wrap items-center justify-end">
                      <select
                        {...register("tipe_po", { required: true })}
                        onChange={(e) => {
                          settipepo(e.target.value);
                          setValue("history_po", "");
                          setValue("supplier_pobaru", "");
                        }}
                        className={`${errors.tipe_po ? "border-red-500 border-2" : "border"
                          } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      >
                        <option value="">Tipe Purchase order</option>
                        <option value="PO_BARU">PO Baru</option>
                        <option value="PO_LANJUTAN">PO Lanjutan</option>
                      </select>
                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                    </div>
                    {errors.tipe_po && (
                      <div className="mt-1 text-sm italic">
                        This field is required
                      </div>
                    )}

                    {(function () {
                      if (tipepo === "PO_LANJUTAN") {
                        return (
                          <div>
                            <div className="mt-4 flex flex-wrap items-center justify-end">
                              <select
                                {...register("history_po", { required: true })}
                                className={`${errors.history_po
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              >
                                <option value="">Pilih Data PO</option>
                                {list_po}
                              </select>
                              <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                            </div>
                            {errors.history_po && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </div>
                        );
                      }
                    })()} */}

                                        <div>
                                            <div className="flex flex-wrap items-center justify-end">
                                                <select
                                                    {...register("supplier_pobaru", { required: true })}
                                                    className={`${errors.supplier_pobaru
                                                        ? "border-red-500 border-2"
                                                        : "border"
                                                        } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                >
                                                    <option value="">Pilih Supplier PO</option>
                                                    {list_supplier}
                                                </select>
                                                <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                            </div>
                                            {errors.supplier_pobaru && (
                                                <div className="mt-1 text-sm italic">
                                                    This field is required
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-start gap-3">
                                            <div className="h-[30px] flex items-center text-sm font-medium text-black">
                                                Harga Beli :
                                            </div>
                                            <CurrencyInput
                                                className={`${errors.harga_beli_repeat
                                                    ? "border-red-500 border-2"
                                                    : "border"
                                                    } h-[30px] grow pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                placeholder="Masukan Harga Beli"
                                                defaultValue={0}
                                                decimalsLimit={2}
                                                groupSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                {...register("harga_beli_repeat", {
                                                    required: true,
                                                    // onChange(event) {
                                                    //     setValue("harga_beli_repeat", event.target.value.replace(/\D/g, ""))
                                                    // },
                                                })}
                                            />
                                        </div>

                                        {errors.harga_beli_repeat && (
                                            <div className="mt-1 text-sm italic">
                                                This field is required
                                            </div>
                                        )}

                                        <div className="grow">
                                            <table className="table table-auto bg-transparent text-sm mt-3">
                                                <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                                                    <tr className="">
                                                        <th className="py-2 rounded-l-lg">Size</th>
                                                        <th className="py-2">Stok Gudang</th>
                                                        <th className="py-2 rounded-r-lg">Stok Baru</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="group rounded-lg text-xs">
                                                    {datasize.map((datasizes, index) => {
                                                        return (
                                                            <tr
                                                                key={index}
                                                                className="rounded-lg h-auto mt-7"
                                                            >
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
                                                                            className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                                            type="number"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input
                                                                            min={0}
                                                                            defaultValue={0}
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
                                                                            placeholder="aaa"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>

                                            {/* <button
                                                onClick={() => {
                                                    append({ size: null, stok_baru: 0 });
                                                    setCount(Count + 1);
                                                }}
                                                type="button" className="mt-3 mx-2 m-auto border-none rounded-lg bg-blue-600 hover:bg-blue-800 h-[30px] text-white px-2 flex flex-wrap gap-2 content-center">
                                                <div className="my-auto">
                                                    <fa.FaPlus size={13} className="text-white" />
                                                </div>
                                            </button> */}
                                        </div>

                                        <div className="h-[10%] mt-6 w-full grid grid-cols-2 items-end justify-start">
                                            <button
                                                className="bg-red-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setValue("harga_beli", null);
                                                    // batas = 0;
                                                    // setCount(batas);
                                                    setrepeatModal(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleSubmit(onSubmitRepeat)}
                                                disabled={isDisabled}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grow flex flex-col justify-start">
                                        <div className="h-[500px] w-full pb-10">
                                            <div className="text-xs flex flex-auto text-center mb-2 font-bold">
                                                <div className="border py-1.5 w-[40%] rounded-l-lg">
                                                    Detail
                                                </div>
                                                {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                                                    "HEAD-AREA" === Cookies.get("auth_role") ? (
                                                    <>
                                                        <div className="border py-1.5 grow">
                                                            Total Pembelian
                                                        </div>
                                                    </>
                                                ) : null}
                                                <div className="border py-1.5 w-[40%] rounded-r-lg">
                                                    Size
                                                </div>
                                            </div>

                                            {/* {JSON.stringify(data_po)} */}

                                            <div className="h-[100%] overscroll-y-auto overflow-x-hidden scrollbar-none pb-20">
                                                {(function () {
                                                    if (data_po.length > 0) {
                                                        return data_po.map((datapo: any, index: any) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="h-auto flex flex-auto text-xs items-center border rounded-lg px-2 py-2 mb-2"
                                                                >
                                                                    <div className="w-[40%] grid grid-rows-5 pl-4">
                                                                        <div className="grid grid-cols-3">
                                                                            <span>Tanggal</span>
                                                                            <span className="col-span-2">
                                                                                : {datapo.tanggal_receive}
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3">
                                                                            <span>ID PO</span>
                                                                            <span className="col-span-2 font-bold text-violet-600">
                                                                                : {datapo.idpo}
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3">
                                                                            <span>Tipe PO</span>
                                                                            <span className="col-span-2 font-bold">
                                                                                : {datapo.tipe_order}
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3">
                                                                            <span>Supplier</span>
                                                                            <span className="col-span-2">
                                                                                : {datapo.supplier}
                                                                            </span>
                                                                        </div>
                                                                        {"SUPER-ADMIN" ===
                                                                            Cookies.get("auth_role") ||
                                                                            "HEAD-AREA" === Cookies.get("auth_role") ? (
                                                                            <>
                                                                                <div className="grid grid-cols-3">
                                                                                    <span>Harga Satuan</span>
                                                                                    <span className="col-span-2">
                                                                                        : {Rupiah.format(datapo.m_price)}
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        ) : null}
                                                                        <div className="grid grid-cols-3">
                                                                            <span>Quantity</span>
                                                                            <span className="col-span-2">
                                                                                : {datapo.qty}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                                                                        "HEAD-AREA" === Cookies.get("auth_role") ? (
                                                                        <>
                                                                            <div className="grow text-center font-bold">
                                                                                {Rupiah.format(datapo.total_amount)}
                                                                            </div>
                                                                        </>
                                                                    ) : null}
                                                                    <div className="w-[40%] text-center grid grid-cols-4 px-2 gap-1">
                                                                        {(function () {
                                                                            return datapo.variation.map(
                                                                                (variation: any, indexs: any) => {
                                                                                    return (
                                                                                        <div
                                                                                            key={indexs}
                                                                                            className={`${variation.qty > 0
                                                                                                ? "bg-lime-600 text-white font-bold"
                                                                                                : "bg-red-600 text-white font-bold"
                                                                                                } border rounded px-2`}
                                                                                        >
                                                                                            {variation.size}={variation.qty}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                {/* <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    {JSON.stringify(watch())}
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setValue("harga_beli", null);
                                            batas = 0;
                                            setCount(batas);
                                            unregister('variasi');
                                            setrepeatModal(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmit(onSubmitRepeat)}
                                    >
                                        Save Changes
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {transferModal ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative mt-[50px] mb-[40px] mx-auto w-[60%]">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        Transfer Stock : {transferproduct}
                                    </span>
                                </div>

                                {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                                {/*body*/}
                                <div className="p-6 gap-4 flex flex-auto h-[auto]">
                                    <div className="w-[33%] text-sm flex flex-col pb-3">
                                        <div className="grow">
                                            <div className="">
                                                <label className="text-xs">Gudang Pengirim</label>
                                                <input
                                                    readOnly
                                                    {...register("gudangpengirim", { required: true })}
                                                    className={`${errors.gudangpengirim
                                                        ? "border-red-500 border-2"
                                                        : "border"
                                                        } appearance-none border h-[30px] mt-2 w-[100%] pr-3 pl-5 text-gray-700 focus:outline-none rounded-lg`}
                                                ></input>
                                            </div>

                                            <div className="mt-3">
                                                <label className="text-xs">Gudang Penerima</label>
                                                <div className="mt-2 flex flex-wrap items-center justify-end">
                                                    <select
                                                        {...register("transferwaretujuan", {
                                                            required: true,
                                                        })}
                                                        className={`${errors.transferwaretujuan
                                                            ? "border-red-500 border-2"
                                                            : "border"
                                                            } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                    >
                                                        <option value="">Pilih Gudang Penerima</option>
                                                        {list_warehouse}
                                                    </select>
                                                    <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                                </div>
                                                {errors.transferwaretujuan && (
                                                    <div className="mt-1 text-sm italic">
                                                        This field is required
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grow">
                                        <table className="table table-auto bg-transparent text-sm w-full">
                                            <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                                                <tr className="">
                                                    <th className="py-2 rounded-l-lg">Size</th>
                                                    <th className="py-2">Stok Gudang</th>
                                                    <th className="py-2 rounded-r-lg">Stok Transfer</th>
                                                </tr>
                                            </thead>

                                            <tbody className="group rounded-lg text-xs">
                                                {datasize.map((datasizes, index) => {
                                                    return (
                                                        <tr key={index} className="rounded-lg h-auto mt-7">
                                                            <td className="pt-2 p-0">
                                                                <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                    <input
                                                                        readOnly
                                                                        defaultValue={datasizes.size}
                                                                        {...register(
                                                                            `variasitransfer.${index}.size`,
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
                                                                        className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                                        type="number"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="pt-2 p-0">
                                                                <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                    <input
                                                                        min={0}
                                                                        defaultValue={0}
                                                                        // {...register(
                                                                        //   `variasitransfer.${index}.stok_baru`,
                                                                        //   { required: true }
                                                                        // )}
                                                                        {...register(`variasitransfer.${index}.stok_baru`,
                                                                            {
                                                                                required: true, onChange: (e: any) => {
                                                                                    if (e.target.value === "") {
                                                                                        var n = 0;
                                                                                    } else {
                                                                                        var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                                                    }
                                                                                    setValue(`variasitransfer.${index}.stok_baru`, n)
                                                                                }
                                                                            })}
                                                                        className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                                        type="number"
                                                                        placeholder="Size"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        <div className="h-[10%] py-2 mt-3 w-full grid grid-cols-2 items-end justify-start">
                                            <button
                                                className="bg-red-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    settransferModal(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleSubmit(onSubmitTransfer)}
                                                disabled={isDisabled}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {delModal ? (
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
                                        Produk {produk_name} akan dihapus?
                                    </p>
                                    <p className="text-sm italic text-red-400">
                                        *Hapus Display Stok {produk_name}
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
            ) : null}

            {stockopname ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="mb-[10px] mx-auto w-[60%]">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        Stock Opname : {repeatProduct} | {gudang}
                                    </span>
                                </div>

                                {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                                {/*body*/}
                                <div className="p-6 gap-4 flex flex-auto h-[auto]">
                                    <div className="w-[48%] text-sm flex flex-col">
                                        {/* <div className="flex flex-wrap items-center justify-end">
                      <select
                        {...register("tipe_so", { required: true })}
                        onChange={(e) => {
                          settipeso(e.target.value);
                          setValue("history_po", "");
                        }}
                        className={`${errors.tipe_so ? "border-red-500 border-2" : "border"
                          } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      >
                        <option value="">Tipe Stock Opname</option>
                        <option value="SO_BARU">SO Baru</option>
                        <option value="SO_LANJUTAN">SO Lanjutan</option>
                      </select>
                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                    </div>
                    {errors.tipe_so && (
                      <div className="mt-1 text-sm italic">
                        This field is required
                      </div>
                    )} */}

                                        {/* {(function () {
                      if (tipeso === "SO_LANJUTAN") {
                        return (
                          <div>
                            <div className="mt-4 flex flex-wrap items-center justify-end">
                              <select
                                {...register("history_po", { required: true })}
                                className={`${errors.history_po
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              >
                                <option value="">Pilih Data SO</option>
                                {list_so}
                              </select>
                              <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                            </div>
                            {errors.history_po && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </div>
                        );
                      }
                    })()}
                    {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                      "HEAD-AREA" === Cookies.get("auth_role") ? (
                      <>
                        <div className="mt-4 flex flex-wrap items-center justify-end">
                          <select
                            {...register("harga_beli_so", { required: true })}
                            className={`${errors.harga_beli_so
                              ? "border-red-500 border-2"
                              : "border"
                              } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          >
                            <option value="">Pilih Harga Beli</option>
                            {(function () {
                              return list_hargabeli.map(
                                (historipo: any, index: number) => {
                                  return (
                                    <option
                                      key={index}
                                      value={historipo.m_price}
                                    >
                                      {Rupiah.format(historipo.m_price)} (
                                      {historipo.tanggal_receive})
                                    </option>
                                  );
                                }
                              );
                            })()}
                          </select>
                          <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>
                        {errors.harga_beli_so && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          className="mt-4 flex flex-wrap items-center justify-end"
                          hidden
                        >
                          {(function () {
                            return list_hargabeli.map(
                              (historipo: any, index: number) => {
                                return (
                                  <input
                                    {...register("harga_beli_so")}
                                    key={index}
                                    hidden
                                    value={0}
                                    className={`appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                  ></input>
                                );
                              }
                            );
                          })()}
                        </div>
                      </>
                    )} */}
                                        <div className="grow">
                                            <table className="table table-auto bg-transparent text-sm mt-3">
                                                <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                                                    <tr className="">
                                                        <th className="py-2 w-[16%] rounded-l-lg">Size</th>
                                                        <th className="py-2">Jumlah Di Sistem</th>
                                                        <th className="py-2">
                                                            Jumlah Di Gudang
                                                            <span className="text-red-600">*</span>
                                                        </th>
                                                        <th className="py-2 rounded-r-lg">
                                                            Jumlah Stok Opname
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="group rounded-lg text-xs">
                                                    {datasize.map((datasizes, index) => {
                                                        return (
                                                            <tr
                                                                key={index}
                                                                className="rounded-lg h-auto mt-7"
                                                            >
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input
                                                                            readOnly
                                                                            defaultValue={datasizes.size}
                                                                            {...register(
                                                                                `variasirestock.${index}.size`,
                                                                                { required: true }
                                                                            )}
                                                                            className="text-center h-[100%] border w-[100%] mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input
                                                                            readOnly
                                                                            defaultValue={datasizes.qty}
                                                                            className="text-center h-[100%] border bg-orange-100 w-[100%] mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input
                                                                            defaultValue={0}
                                                                            // disableGroupSeparators={true}
                                                                            type="text"
                                                                            min={0}
                                                                            className="text-center h-[100%] border w-[100%] mx-2 text-gray-700 focus:outline-none rounded-lg"
                                                                            {...register(`variasirestock.${index}.stok_gudang`,
                                                                                {
                                                                                    required: true, onChange: (e: any) => {
                                                                                        if (e.target.value === "") {
                                                                                            var n = 0;
                                                                                            var x = 0;
                                                                                        } else {
                                                                                            var n = parseInt(e.target.value.replace(/\D/g, ''), 10) - datasizes.qty;
                                                                                            var x = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                                                        }
                                                                                        setValue(`variasirestock.${index}.stok_baru`, n)
                                                                                        setValue(`variasirestock.${index}.stok_gudang`, x)
                                                                                    }
                                                                                })}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input
                                                                            readOnly
                                                                            defaultValue={0}
                                                                            {...register(
                                                                                `variasirestock.${index}.stok_baru`,
                                                                                { required: true }
                                                                            )}
                                                                            className="text-center h-[100%] border w-[100%] mx-2 bg-green-100 text-gray-700 focus:outline-none rounded-lg"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="h-[10%] mt-6 w-full grid grid-cols-2 items-end justify-start">
                                            <button
                                                className="bg-red-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => {
                                                    setValue("harga_beli", null);
                                                    setstockopname(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleSubmit(onSubmitSO)}
                                                disabled={isDisabled}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grow flex flex-col justify-start">
                                        <div className="h-[500px] w-full pb-10">
                                            <div className="text-xs flex flex-auto text-center mb-2 font-bold">
                                                <div className="border py-1.5 w-[35%] rounded-l-lg">
                                                    Detail
                                                </div>
                                                <div className="border py-1.5 w-[65%] rounded-r-lg">
                                                    Size
                                                </div>
                                            </div>

                                            {/* {JSON.stringify(data_po)} */}

                                            <div className="h-[100%] overscroll-y-auto overflow-x-hidden scrollbar-none pb-20">
                                                {(function () {
                                                    if (data_po.length > 0) {
                                                        return data_po.map((datapo: any, index: any) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="h-auto flex flex-auto text-xs items-center border rounded-lg px-2 py-2 mb-2"
                                                                >
                                                                    <div className="w-[35%] grid grid-rows-3 pl-4">
                                                                        <div className="grid grid-cols-3">
                                                                            <span>Tanggal</span>
                                                                            <span className="col-span-2">
                                                                                : {datapo.tanggal_receive}
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3">
                                                                            <span>ID SO</span>
                                                                            <span className="col-span-2 font-bold text-violet-600">
                                                                                : {datapo.idpo}
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3">
                                                                            <span>Quantity</span>
                                                                            <span className="col-span-2">
                                                                                : {datapo.qty}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="w-[65%] text-center grid grid-cols-4 px-2 gap-1">
                                                                        {(function () {
                                                                            return datapo.variation.map(
                                                                                (variation: any, indexs: any) => {
                                                                                    return (
                                                                                        <div
                                                                                            key={indexs}
                                                                                            // className="border rounded px-2"
                                                                                            className={`${variation.qty != 0
                                                                                                ? "bg-lime-600 text-white font-bold"
                                                                                                : "bg-red-600 text-white font-bold"
                                                                                                } border rounded px-2`}
                                                                                        >
                                                                                            {variation.size}{" = "}{variation.qty}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    } else {
                                                        return (
                                                            <div className="w-full text-center h-full mt-5">
                                                                Belum Ada Stock Opname
                                                            </div>
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

            {showModalPrintSO ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[50vh]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">Print Daftar SO</span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex flex-auto gap-6">
                                    <select
                                        value={warehouse_so}
                                        onChange={(e) => {
                                            setwarehouse_so(e.target.value);
                                        }}
                                        className={`ml-3 appearance-none border h-[45px] w-[100%] px-5 text-gray-700 focus:outline-none rounded-lg`}
                                    >
                                        <option value="">Pilih Warehouse</option>
                                        {list_warehouse_so}
                                    </select>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setshowModalPrintSO(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => printSo()}
                                    >
                                        Print Daftar SO
                                    </button>
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
