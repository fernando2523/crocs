import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import {
  compareAsc,
  format,
  subDays,
  lastDayOfMonth,
  startOfMonth,
  startOfWeek,
  lastDayOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import Link from "next/link";
import { count } from "console";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import useSWR from "swr";
import styles from "../../styles/Table.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Icons from "react-icons/fa";
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
  User,
  UserRound,
} from "lucide-react";
import Cookies from "js-cookie";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import Select from "react-select";

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

export default function Shipping() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_order, setdataorder] = useState([]);
  const [count_order, setdatacount_selesai]: any = useState([]);
  const [data_header, setdataheader]: any = useState([]);
  const [data_ware, setdataware] = useState([]);
  const [data_store, setdatastore] = useState([]);
  const [data_brand, setdatabrand] = useState([]);
  const [data_supplier, setdatasupplier] = useState([]);
  const [data_users, setdatausers]: any = useState([]);
  const [data_produk, setdataproduk] = useState([]);

  const [header_sales, setdataheader_sales]: any = useState([]);
  const [header_qty_sales, setdataheader_qty_sales]: any = useState([]);
  const [header_subtotal, setdataheader_subtotal]: any = useState([]);
  const [header_omzet, setdataheader_omzet]: any = useState([]);
  const [header_modal, setdataheader_modal]: any = useState([]);
  const [header_net_sales, setdataheader_net_sales]: any = useState([]);
  const [header_selesai, setdataheader_selesai]: any = useState([]);

  const [valueSync, setValueSync] = useState({
    startDate: null,
    endDate: null
  });
  var [StoreSync, setStoreSync] = useState("");
  var [list_getshopid, setgetshopid]: any = useState([]);
  // var [getordersync, setgetordersync]: any = useState([]);

  useEffect(() => {
    loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
    // getheaderpesanan(status_pesanan, Query, Store, date, area, Filter_Tipe_user,statusdate);
    // ordercount(Store, date, area, Filter_Tipe_user);
    getwarehouse(Role, area);
    getstore(Role, area, Brand);
    getsupplier();
    // getusers(user_login, user_role);
    loaddataproduk(Query, Store);
    return () => { };
  }, []);

  async function loaddataorder(
    status_pesanan: any,
    query: any,
    store: any,
    date: any,
    area: any,
    Filter_Tipe_user: any,
    statusdate: any,
    Brand: any,
  ) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/order`,
      data: {
        status_pesanan: status_pesanan,
        query: query,
        store: store,
        date: date,
        area: area,
        users: Filter_Tipe_user,
        statusdate: statusdate,
        Brand: Brand,
      },
    })
      .then(function (response) {
        setdataorder(response.data.result.datas);
        setdatacount_selesai(response.data.result.selesai);
        setdataheader_sales(response.data.result.sales);
        setdataheader_qty_sales(response.data.result.qty_sales);
        setdataheader_subtotal(response.data.result.subtotal);
        setdataheader_omzet(response.data.result.omzet);
        setdataheader_modal(response.data.result.modal);
        setdataheader_net_sales(response.data.result.net_sales);
        setdataheader_selesai(response.data.result.selesai);
        setdatatoday(response.data.result.today);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (!isLoading) {
    var count_selesai = setdatacount_selesai;
    var modal = Rupiah.format(header_modal);
    var net_sales = Rupiah.format(header_net_sales);
    var omzet = Rupiah.format(header_omzet);
    var subtotal = Rupiah.format(header_subtotal);
    var qty_sales = header_qty_sales;
    var sales = header_sales;

  }

  const [user_login, setFilter_user_login] = useState(Cookies.get("auth_name"));
  const [user_role, setFilter_user_role] = useState(Cookies.get("auth_role"));
  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [value, setValue]: any = useState();
  const handleValueChange = (newValue: any) => {
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate(startDate + " to " + lastDate);
    } else {
      setDate(newValue.startDate + " to " + newValue.endDate);
      loaddataorder(
        status_pesanan,
        Query,
        Store,
        newValue.startDate + " to " + newValue.endDate, area, Filter_Tipe_user, ("click"), Brand
      );
    }
    setValue(newValue);
  };
  const cektoday = new Date();
  const cekHariIni = format(cektoday, 'yyyy-MM-dd');
  const [datatoday, setdatatoday] = useState(cekHariIni);

  const startDate = format(startOfDay(new Date()), "yyyy-MM-dd");
  const lastDate = format(endOfDay(new Date()), "yyyy-MM-dd");
  const [date, setDate] = useState(startDate + " to " + lastDate);
  const [statusdate, setstatusdate] = useState("noclick");

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
  const [Query, setQuery] = useState("all");

  if ("HEAD-AREA" === Cookies.get("auth_role") || "HEAD-WAREHOUSE" === Cookies.get("auth_role")) {
    var [Store, setStore] = useState(("all_area"));
  } else if (("SUPER-ADMIN" === Cookies.get("auth_role"))) {
    var [Store, setStore] = useState(("all"));
  } else {
    var [Store, setStore] = useState(Cookies.get("auth_store"));
  }

  var [Brand, setBrand] = useState("all");


  const [Filter_Tipe_user, setFilter_Tipe_user] = useState("all");

  const [area, setarea] = useState((Cookies.get("auth_store")));
  const [Name, setName] = useState(Cookies.get("auth_name"));


  function querySet(e: any) {
    if (e.target.value === "") {
      setQuery("all");
      loaddataorder(status_pesanan, "all", Store, date, area, Filter_Tipe_user, statusdate, Brand);
    } else {
      setQuery(e.target.value);
      loaddataorder(status_pesanan, e.target.value, Store, date, area, Filter_Tipe_user, statusdate, Brand);
    }
  }

  async function keyDown(event: any) {
    if (event.key == 'Enter') {
      if (Query != "all") {
        loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
      }
    }
  }

  const [tabactive, settabactive] = React.useState("SELESAI");
  const [status_pesanan, setstatus_pesanan] = React.useState("SELESAI");
  const [isDisabled, setIsDisabled] = useState(false);

  function tabActive(select: any) {
    setdataorder([]);
    settabactive(select);
    setstatus_pesanan(select);
    loaddataorder(select, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
    // getheaderpesanan(select, Query, Store, date, area, Filter_Tipe_user);
    // ordercount(Store, date, area, Filter_Tipe_user);
  }

  async function sycnorder(data: any) {

    await axios({
      method: "post",
      url: `http://localhost:4000/v1/syncorder`,
      data: {
        data: data,
      },
    })
      .then(function (response) {

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getorder() {
    await axios({
      method: "POST",
      url: '/api/getorder',
      data: {
        request_uri: '/openapi/order/v2/list-order',
        params: {
          createSince: new Date(valueSync.startDate + ' 00:00:00').toISOString(),
          createTo: new Date(valueSync.endDate + ' 23:59:59').toISOString(),
          shopIdList: StoreSync,
        },
      },
    })
      .then(function (response) {
        sycnorder(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  async function getshopid() {
    await axios({
      method: "POST",
      url: '/api/getshopid',
      data: {
        request_uri: '/openapi/shop/v1/list',
      },
    })
      .then(function (response) {
        setgetshopid(response.data)
        // console.log(response.data)
        setopenmodalsync(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const list_shop: any = [];
  if (!isLoading) {
    list_getshopid.map((shop: any, index: number) => {
      list_shop.push(
        <option key={index} value={shop.shopId}>
          {shop.name}
        </option>
      );

    });
  }

  async function getwarehouse(role: any, area: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/gudangretur`,
      data: {
        role: role,
        area: area,
      },
    })
      .then(function (response) {
        setdataware(response.data.result);
        // console.log(response.data)
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

  async function getstore(role: any, area: any, Brand: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getstore_sales_online`,
      data: {
        role: role,
        store: area,
        Brand: Brand,
      },
    })
      .then(function (response) {
        setdatastore(response.data.result.data_store);
        setdatabrand(response.data.result.data_brand);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_store: any = [];
  const fixed_store: any = [];
  if (!isLoading) {
    data_store.map((store: any, index: number) => {
      list_store.push(
        <option key={index} value={store.id_store}>
          {store.store}
        </option>
      );
      fixed_store.push(
        <span key={index}>{store.id_store}</span>
      );
    });
  }

  const list_brand: any = [];
  if (!isLoading) {
    data_brand.map((brand: any, index: number) => {
      list_brand.push(
        <option key={index} value={brand.id_area}>
          {brand.brand}
        </option>
      );
    });
  }

  const [returLuarModal, setreturLuarModal] = React.useState(false);
  const [LuarProduk, setLuarProduk] = React.useState("");
  const [LuarIdPesanan, setLuarIdPesanan] = React.useState("");
  const [LuarIdProduk, setLuarIdProduk] = React.useState("");
  const [LuarSize, setLuarSize] = React.useState("");
  const [LuarSizeold, setLuarSizeold] = React.useState("");
  const [LuarOldQty, setLuarOldQty] = React.useState(0);
  const [LuarSupplier, setLuarSupplier] = React.useState("");
  const [LuarHargaBeli, setLuarHargaBeli] = React.useState(0);
  const [LuarPayment, setLuarPayment] = React.useState("");
  const [LuarStatusBarangRetur, setLuarStatusBarangRetur] = React.useState("");
  const [LuarQtyNew, setLuarQtyNew] = React.useState(1);
  const [returLuarBTN, setreturLuarBTN] = React.useState(false);

  async function openReturLuarModal(
    produk: any,
    id_produk: any,
    size: any,
    qty: any,
    source: any,
    id_pesanan: any,
    idpo: any,
    id_ware: any
  ) {
    setLuarSizeold(size);
    setreturLuarBTN(false);
    setreturLuarModal(true);
    setLuarProduk(produk);
    setLuarOldQty(qty);
    setLuarSupplier("");
    setLuarIdPesanan(id_pesanan);
    setLuarIdProduk(id_produk);
    setLuarSize("");
    setLuarHargaBeli(0);
    setLuarQtyNew(1);
  }

  function setQtymanualluar(type: any) {
    if (type === "plus") {
      if (LuarQtyNew >= LuarOldQty) {
        toast.warning("Jumlah Melebihi Stok Pesanan!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 2000,
        });
      } else {
        setLuarQtyNew(LuarQtyNew + 1);
      }
    } else if (type === "min") {
      if (LuarQtyNew > 1) {
        setLuarQtyNew(LuarQtyNew - 1);
      }
    }
  }

  async function sumbitReturLuar() {
    if (
      LuarSupplier === "" ||
      LuarSize === "" ||
      LuarHargaBeli < 1 ||
      LuarPayment === "" ||
      LuarStatusBarangRetur === ""
    ) {
      toast.warning("Mohon Lengkapi Data", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else {
      setreturLuarBTN(true);
      await axios
        .post(`http://localhost:4000/v1/returLuar`, {
          LuarProduk: LuarProduk,
          LuarSize: LuarSize,
          LuarOldQty: LuarOldQty,
          LuarSupplier: LuarSupplier,
          LuarHargaBeli: LuarHargaBeli,
          LuarQtyNew: LuarQtyNew,
          LuarIdPesanan: LuarIdPesanan,
          LuarIdProduk: LuarIdProduk,
          LuarPayment: LuarPayment,
          LuarSizeold: LuarSizeold,
          StatusBarangRetur: LuarStatusBarangRetur,
        })
        .then(function (response) {
          // console.log(response.data);
          // mutate();
          // count_mutate();
          setreturLuarModal(false);

          toast.success("Data berhasil Retur", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
          });
        });
    }
  }

  const [returModal, setreturModal] = React.useState(false);
  const [id_produkretur, setid_produkretur] = React.useState("");
  const [produkretur, setprodukretur] = React.useState("");
  const [sizeretur, setsizeretur] = React.useState("");
  const [qtyoldretur, setqtyoldretur] = React.useState(0);
  const [SourceRetur, setSourceRetur] = React.useState("");
  const [Id_pesanan, setId_pesanan] = React.useState("");
  const [old_ware, setold_ware] = React.useState("");
  const [cari_idwares, setcaridiwares] = React.useState("");
  const [cari_namawares, setcarinamawares] = React.useState("");

  const [pilih_warehouse, setpilih_warehouse] = React.useState("close");
  const [datasize, setdatasize] = React.useState([]);
  const [sizeSelected, setsizeSelected] = React.useState(null);
  const [stokReady, setstokReady] = React.useState(0);
  const [returmodal_qty, setreturmodal_qty] = React.useState(1);
  const [returmodal_submit, setreturmodal_submit] = React.useState(true);
  const [Returware, setReturware] = React.useState(true);

  const [returidpo, setreturidpo] = React.useState("");

  const list_size: any = [];

  {
    for (let index = 0; index < datasize.length; index++) {
      if (datasize[index].qty > 0) {
        list_size.push(
          <div
            onClick={() => {
              setsizeSelected(datasize[index].size);
              setstokReady(parseInt(datasize[index].qty));
              setreturmodal_qty(1);
              setreturmodal_submit(false);
            }}
            key={index}
            className={`${sizeSelected === datasize[index].size
              ? "bg-blue-500 text-white"
              : "text-blue-500"
              } font-medium py-2 text-center rounded-lg border border-blue-500 cursor-pointer`}
          >
            {datasize[index].size} = {datasize[index].qty}
          </div>
        );
      } else {
        list_size.push(
          <div
            key={index}
            className=" text-gray-500 font-medium py-2 text-center rounded-lg border border-gray-500"
          >
            {datasize[index].size} = {datasize[index].qty}
          </div>
        );
      }
    }
  }

  const {
    register,
    unregister,
    control,
    resetField,
    reset,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //     produk: '',
    //     brand: '',
    //     warehouse: '',
    //     supplier: '',
    //     harga_beli: '',
    //     harga_jual: '',
    //     quality: '',
    //     kategori: '',
    //     deskripsi: '',
    //     img: '',
    // }
  });

  // async function getStock(id_ware: any) {
  //   // setpilih_warehouse("loading");
  //   setsizeSelected(null);
  //   setstokReady(0);
  //   setreturmodal_qty(1);
  //   setreturmodal_submit(true);
  //   setReturware(id_ware);

  //   // if (id_ware === "") {
  //   //   setpilih_warehouse("close");
  //   // } else {
  //   await axios
  //     .post(`http://localhost:4000/v1/getsizeretur`, {
  //       idware: id_ware,
  //       idproduct: id_produkretur,
  //       size: sizeretur,
  //     })
  //     .then(function (response) {
  //       setdatasize(response.data.result);
  //       console.log(response.data.result);
  //     });
  //   // }
  // }

  function setQty(type: any) {
    if (type === "plus") {
      if (returmodal_qty < stokReady) {
        if (returmodal_qty >= qtyoldretur) {
          toast.warning("Jumlah Melebihi Stok Pesanan!", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
          });
        } else {
          setreturmodal_qty(returmodal_qty + 1);
        }
      } else {
        toast.warning("Jumlah Melebihi Stok Yang Tersedia!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 2000,
        });
      }
    } else if (type === "min") {
      if (returmodal_qty > 1) {
        setreturmodal_qty(returmodal_qty - 1);
      }
    }
  }

  const [TukerModelProduk, setTukerModelProduk] = React.useState("");
  const [TukerModelIDProduk, setTukerModelIDProduk] = React.useState("");
  const [warehouse_tukarmodel, setwarehouse_tukarmodel] = React.useState("");
  const [selisih, setselisih] = React.useState("0");
  const [minimalselisih, setminimalselisih] = React.useState(0);
  const [statusselisih, setstatusselisih] = React.useState("no");
  const [idpesanantukermodel, setidpesanantukermodel] = React.useState("");


  const [returTukerModel, setreturTukerModel] = React.useState(false);
  const [tukermodel_submit, settukermodel_submit] = React.useState(true);

  async function openTukerModel(
    produk: any,
    id_produk: any,
    size: any,
    qty: any,
    source: any,
    id_pesanan: any,
    idpo: any,
    id_ware: any
  ) {
    setidpesanantukermodel(id_pesanan);

    setid_produkretur(id_produk);
    setprodukretur(produk);
    setsizeretur(size);
    setqtyoldretur(qty);
    setSourceRetur(source);
    setId_pesanan(id_pesanan);
    setold_ware(id_ware);
    setreturidpo(idpo);

    setreturmodal_qty(1);
    setTukerModelIDProduk(null);
    setpilih_warehouse("close");
    setwarehouse_tukarmodel("");
    setqtyoldretur(qty);
    settukermodel_submit(false);
    setreturTukerModel(true);
    setselisih("0");
  }

  async function sumbitTukerModel() {
    settukermodel_submit(true);
    var newselisih = selisih.replace(/\D/g, "");
    if (TukerModelIDProduk === null || TukerModelIDProduk === "" || sizeSelected === null || sizeSelected === "") {
      toast.warning("Product & Variasi Pengganti Tidak Boleh Kosong", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
      settukermodel_submit(false);
    } else if (statusselisih === "no") {
      toast.warning("Harga Product Pengganti Harus Lebih Besar Dari Product Awal", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
      settukermodel_submit(false);
    } else if (parseInt(newselisih) < minimalselisih) {
      toast.warning("Nominal Selisih Kurang Dari Estimasi !!", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
      settukermodel_submit(false);
    } else {
      // console.log(returidpo)
      // console.log(id_produkretur)
      // console.log(TukerModelIDProduk)
      // console.log(old_ware)
      // console.log(warehouse_tukarmodel)
      // console.log(sizeretur)
      // console.log(sizeSelected)
      // console.log(returmodal_qty)
      // console.log(Id_pesanan)
      // console.log(selisih)
      // console.log(Name)
      await axios
        .post(`http://localhost:4000/v1/tukermodel`, {
          idpo_old: returidpo,
          id_produk_old: id_produkretur,
          id_produk_new: TukerModelIDProduk,
          id_ware_old: old_ware,
          id_ware_new: warehouse_tukarmodel,
          size_old: sizeretur,
          size_new: sizeSelected,
          qty_retur: returmodal_qty,
          id_pesanan: Id_pesanan,
          selisih: newselisih,
          users: Name,
        })
        .then(function (response) {
          console.log(response.data.result)
          if (response.data.result === "Kurang") {
            toast.warning("Harga Produk Penganti Lebih Murah Dari Produk Awal", {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: 1000,
            });
            settukermodel_submit(false);
          } else {
            loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
            settukermodel_submit(false);
            setreturTukerModel(false);
            getStockTukarModel("", "");

            toast.success("Change Product Success !!", {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: 1000,
            });
          }
        });
    }
  }

  async function getStockTukarModel(id_ware: any, id_produk: any) {
    setpilih_warehouse("loading");
    setsizeSelected(null);
    setstokReady(0);
    setreturmodal_qty(1);
    setreturmodal_submit(true);
    // console.log(e.target.value);
    setReturware(id_ware);

    // if (e.target.value === "") {
    //   setpilih_warehouse("close");
    // } else {
    await axios
      .post(`http://localhost:4000/v1/getsizereturmodel`, {
        idware: id_ware,
        idproduct: id_produk,
        size: sizeretur,
        id_produk_old: id_produkretur,
        id_ware_old: old_ware,
        id_pesanan: idpesanantukermodel,
        // qty_retur: returmodal_qty,
      })
      .then(function (response) {
        setpilih_warehouse("open");
        setdatasize(response.data.result.data_sizereturmodel);
        setminimalselisih(response.data.result.selisihharga);
        setstatusselisih(response.data.result.statusselisih);
      });
    // }
  }


  async function openReturModal(
    produk: any,
    id_produk: any,
    size: any,
    qty: any,
    source: any,
    id_pesanan: any,
    idpo: any,
    id_ware: any
  ) {
    await axios
      .post(`http://localhost:4000/v1/cariwaresretur`, {
        id_ware: id_ware,
      })
      .then(function (response) {
        setcaridiwares(response.data.result[0].id_ware)
        setcarinamawares(response.data.result[0].warehouse)
      });

    setsizeSelected(null);
    setstokReady(0);
    setreturmodal_qty(1);
    setreturmodal_submit(true);

    setReturware(id_ware);

    await axios
      .post(`http://localhost:4000/v1/getsizeretur`, {
        idware: id_ware,
        idproduct: id_produk,
        size: size,
      })
      .then(function (response) {
        // setpilih_warehouse("open");
        setdatasize(response.data.result);
        console.log(response.data.result);
      });

    setid_produkretur(id_produk);
    setprodukretur(produk);
    setsizeretur(size);
    setqtyoldretur(qty);
    setSourceRetur(source);
    setId_pesanan(id_pesanan);
    setold_ware(id_ware);

    setreturmodal_qty(1);
    setreturmodal_submit(true);
    setpilih_warehouse("close");
    setreturidpo(idpo);
    setreturModal(true);
  }

  async function sumbitRetur() {
    setIsDisabled(true);
    await axios
      .post(`http://localhost:4000/v1/retur`, {
        id_pesanan: Id_pesanan,
        id_produk: id_produkretur,
        produk: produkretur,
        size_old: sizeretur,
        qty_old: qtyoldretur,
        source: SourceRetur,
        size_new: sizeSelected,
        qty_new: returmodal_qty,
        old_id_ware: old_ware,
        new_id_ware: Returware,
        idpo: returidpo,
        users: Name,
      })
      .then(function (response) {
        toast.success("Data berhasil Update", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 1000,
        });
        loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
        setreturModal(false);
        setIsDisabled(false);
      });
  }

  const [openmodalsync, setopenmodalsync] = useState(false);
  const [refundModal, setrefundModal] = useState(false);
  const [idRefundProduct, setidRefundProduct] = useState(null);
  const [btnrefund, setbtnrefund] = useState(false);

  async function openrefundModal(
    produk: any,
    id_produk: any,
    size: any,
    qty: any,
    source: any,
    id_pesanan: any,
    idpo: any,
    id_ware: any,
    id: any
  ) {
    setbtnrefund(false);
    setrefundModal(true);
    setreturmodal_submit(false);

    setid_produkretur(id_produk);
    setaddproduk_produk(produk);
    setaddproduk_size(size);
    setrefund_oldqty(qty);
    setSourceRetur(source);
    setId_pesanan(id_pesanan);
    setidRefundProduct(id);
    setaddproduk_qty(1);
    setreturidpo(idpo);
  }

  async function sumbitrefund() {
    setIsDisabled(true);

    await axios
      .post(`http://localhost:4000/v1/refund`, {
        id_produk: id_produkretur,
        produk: addproduk_produk,
        size: addproduk_size,
        old_qty: refund_oldqty,
        source: SourceRetur,
        id_pesanan: Id_pesanan,
        id: idRefundProduct,
        qty_refund: addproduk_qty,
        idpo: returidpo,
        users: Name,
      })
      .then(function (response) {
        toast.success("Data berhasil Refund", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 1000,
        });
        loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
        // getheaderpesanan(status_pesanan, Query, Store, date, area, Filter_Tipe_user,statusdate);
        // ordercount(Store, date, area, Filter_Tipe_user);
        setIsDisabled(false);
        setrefundModal(false);
      });
  }

  const [addproduk_produk, setaddproduk_produk] = React.useState("");
  const [addproduk_size, setaddproduk_size] = React.useState("");
  const [addproduk_qty, setaddproduk_qty] = React.useState(1);
  const [refund_oldqty, setrefund_oldqty] = React.useState(1);
  const [addproduk_supplier, setaddproduk_supplier] = React.useState("");
  const [addproduk_hargabeli, setaddproduk_hargabeli] = React.useState("0");

  function setQtymanual(type: any) {
    if (type === "plus") {
      if (addproduk_qty >= refund_oldqty) {
        toast.warning("Jumlah Melebihi Stok Pesanan!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 2000,
        });
      } else {
        setaddproduk_qty(addproduk_qty + 1);
      }
    } else if (type === "min") {
      if (addproduk_qty > 1) {
        setaddproduk_qty(addproduk_qty - 1);
      }
    }
  }

  async function getsupplier() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getsupplier`,
    })
      .then(function (response) {
        setdatasupplier(response.data.data_supplier);
        // console.log(response.data.data_warehouse)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // const {
  //   data: supplier_data,
  //   error: supplier_error,
  //   isLoading: supplier_isLoading,
  //   mutate: supplier_mutate,
  // } = useSWR(`https://apitest.lokigudang.com/getsupplier`, fetcher);
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



  const [start, setStart] = useState(30);
  const [hasMore, setHasMore] = useState(true);

  const list_order: any = [];


  if (!isLoading) {

    data_order.map((order: any, index: number) => {

      return list_order.push(

        <div className="shadow hover:shadow-md bg-white border"
          key={index}>
          <div className="flex flex-row h-[full] items-center justify-center content-center border text-[11px]">
            <div className="basis-20 h-full text-center content-center">
              <span>{1 + index++}</span>
            </div>

            <div className={`${order.type_customer === "Reseller"
              ? "text-lime-600"
              : "text-cyan-600"
              }  text-center basis-56 h-full content-center `}>
              {order.type_customer} <br></br>
              <span className="text-black">
                {format(new Date(order.tanggal_order), "dd MMMM, Y")}<br></br>
                {format(new Date(order.created_at), 'h:mm:ss a')}
              </span>
            </div>

            <div className=" text-center basis-64 h-full content-center">
              <span className="font-semibold">{order.store}</span><br></br>
              {order.id_pesanan}<br></br>

              {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                <>
                  <button
                    onClick={() => hapus_pesanan(order.id_pesanan, index)}
                    className="text-[9px] text-red-500 hover:underline font-bold rounded-lg"
                  >
                    DELETE SALES
                  </button>
                </>) :
                cekHariIni === format(new Date(order.tanggal_order), "yyyy-MM-dd") && "HEAD-AREA" === Cookies.get("auth_role") || "HEAD-STORE" === Cookies.get("auth_role") ?
                  (<>
                    <button
                      onClick={() => hapus_pesanan(order.id_pesanan, index)}
                      className="text-[9px] text-red-500 hover:underline font-bold rounded-lg"
                    >
                      DELETE SALES
                    </button>
                  </>) : null
              }
            </div>
            <div className="basis-1/12  text-center h-full content-center">
              {order.users}
            </div>

            <div className="basis-full  text-left h-full content-center">
              {(function (rows: any, i, len) {
                while (++i <= len) {
                  rows.push(
                    <div key={i} >
                      <div className="flex flex-row grow">
                        <div className="grow px-2">
                          {order.details_order[i - 1].produk} :  {order.details_order[i - 1].id_produk}
                          {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") || "HEAD-STORE" === Cookies.get("auth_role") ? (
                            <>
                              {(function (
                                produk: any,
                                id_produk: any,
                                size: any,
                                qty: any,
                                source: any,
                                id_pesanan: any,
                                idpo: any,
                                id_ware: any,
                                id: any
                              ) {
                                if (tabactive != "CANCEL") {
                                  if (source === "Barang Gudang") {
                                    return (
                                      <div>
                                        <button
                                          onClick={() => {
                                            openReturModal(
                                              produk,
                                              id_produk,
                                              size,
                                              qty,
                                              source,
                                              id_pesanan,
                                              idpo,
                                              id_ware
                                            );
                                          }}
                                          className="text-[9px] text-blue-500 font-bold"
                                        >
                                          Return Size
                                        </button>
                                        <span> | </span>
                                        <button
                                          onClick={() =>
                                            openrefundModal(
                                              produk,
                                              id_produk,
                                              size,
                                              qty,
                                              source,
                                              id_pesanan,
                                              idpo,
                                              id_ware,
                                              id
                                            )
                                          }
                                          className="text-[9px] text-red-500 font-bold"
                                        >
                                          Refund
                                        </button>
                                        <span> | </span>
                                        <button
                                          onClick={() => {
                                            openTukerModel(
                                              produk,
                                              id_produk,
                                              size,
                                              qty,
                                              source,
                                              id_pesanan,
                                              idpo,
                                              id_ware
                                            );
                                          }}
                                          className="text-[9px] text-orange-500 font-bold"
                                        >
                                          Change Product
                                        </button>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div>
                                        <button
                                          onClick={() => {
                                            openReturLuarModal(
                                              produk,
                                              id_produk,
                                              size,
                                              qty,
                                              source,
                                              id_pesanan,
                                              idpo,
                                              id_ware
                                            );
                                          }}
                                          className="text-[9px] text-blue-500 font-bold"
                                        >
                                          Tukar Size
                                        </button>
                                        <span> | </span>
                                        <button
                                          onClick={() =>
                                            openrefundModal(
                                              produk,
                                              id_produk,
                                              size,
                                              qty,
                                              source,
                                              id_pesanan,
                                              idpo,
                                              id_ware,
                                              id
                                            )
                                          }
                                          className="text-[9px] text-red-500 font-bold"
                                        >
                                          Refund
                                        </button>
                                        <span> | </span>
                                        <button
                                          onClick={() => {
                                            openTukerModel(
                                              produk,
                                              id_produk,
                                              size,
                                              qty,
                                              source,
                                              id_pesanan,
                                              idpo,
                                              id_ware
                                            );
                                          }}
                                          className="text-[9px] text-orange-500 font-bold"
                                        >
                                          Change Product
                                        </button>
                                      </div>
                                    );
                                  }
                                }
                              })(
                                order.details_order[i - 1].produk,
                                order.details_order[i - 1].id_produk,
                                order.details_order[i - 1].size,
                                order.details_order[i - 1].qty,
                                order.details_order[i - 1].source,
                                order.id_pesanan,
                                order.details_order[i - 1].idpo,
                                order.details_order[i - 1].id_ware,
                                order.details_order[i - 1].id
                              )}
                            </>) : null}
                        </div>
                        <div className="basis-28  text-center content-center">
                          {order.details_order[i - 1].size}
                        </div>
                        <div className="basis-16  text-center content-center">
                          {order.details_order[i - 1].qty}
                        </div>
                        <div className="basis-28  text-center content-center">
                          {Rupiah.format(order.details_order[i - 1].selling_price)}
                        </div>
                        {/* <div className="grow  w-[10%] text-center">
                          {Rupiah.format(order.details_order[i - 1].diskon_item)}
                        </div> */}
                        <div className="basis-1/12 text-center content-center">
                          {Rupiah.format(order.details_order[i - 1].subtotal)}
                        </div>
                        <div className="basis-1/12 text-center content-center">
                          -
                        </div>
                        {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                          <>
                            <div className="basis-1/12 text-center content-center">
                              {Rupiah.format(order.details_order[i - 1].m_price)}
                            </div>
                            <div className="basis-1/12 text-center content-center">
                              {Rupiah.format(parseInt(order.details_order[i - 1].subtotal) - parseInt(order.details_order[i - 1].m_price))}
                            </div>
                          </>) : null}
                      </div>

                    </div>
                  );
                }
                return rows;
              })([], 0, order.details_order.length)}
            </div>

            {/* <div className="basis-1/12 text-center h-full border-r content-center">
              {Rupiah.format(order.subtotalstandar)}
            </div> */}
          </div>

          <div className="flex flex-row h-[full] items-center justify-center content-center text-[11px]">
            <div className="basis-56 text-gray-100 pl-5">

            </div>
            <div className="basis-20 text-gray-100">
              s
            </div>
            <div className="basis-64 text-gray-100">
              s
            </div>
            <div className="basis-1/12 text-gray-100">
              s
            </div>


            <div className="basis-full font-bold h-full text-[10px] content-center flex flex-row">
              <div className="grow  text-gray-100">
                s
              </div>
              <div className="basis-28 text-center">
                Grand Total :
              </div>
              <div className="basis-16 text-center">
                {order.qty}
              </div>
              <div className="basis-28 bg-white-100 text-white">
                s
              </div>
              <div className="basis-1/12 text-center">
                {Rupiah.format(order.subtotalakhir)}
              </div>
              <div className="basis-1/12 text-center">
                {Rupiah.format(order.subtotalstandar)}
              </div>
              {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                <>
                  <div className="basis-1/12 text-center">
                    {Rupiah.format(order.modalakhir)}
                  </div>
                  <div className="basis-1/12 text-center">
                    {Rupiah.format(order.subtotalstandar - order.modalakhir)}
                  </div>
                </>) : null}
            </div>
          </div>
        </div >

      );
    });

    var count_orders = list_order.length;
  }

  const [selesaiOrdermodal, setselesaiOrdermodal] = React.useState(false);
  const [cancelOrderModal, setcancelOrderModal] = React.useState(false);
  const [hapuspesanan, sethapuspesanan] = React.useState(false);
  const [id_pesanan, setid_pesanan] = React.useState(null);

  function hapus_pesanan(id_pesanan: any, index: number) {
    setid_pesanan(id_pesanan);
    sethapuspesanan(true);
  }

  function showSelesaimodal(id_pesanan: any, index: number) {
    setid_pesanan(id_pesanan);
    setselesaiOrdermodal(true);
  }

  function showCancelmodal(id_pesanan: any, index: number) {
    setid_pesanan(id_pesanan);
    setcancelOrderModal(true);
  }

  async function updatePesanan(status: any) {
    await axios
      .post(`http://localhost:4000/v1/updatepesanan`, {
        id_pesanan: id_pesanan,
        status,
      })
      .then(function (response) {
        loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
        // getheaderpesanan(status_pesanan, Query, Store, date, area, Filter_Tipe_user,statusdate);
        // ordercount(Store, date, area, Filter_Tipe_user);
        toast.success("Data berhasil Update", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 2000,
        });

        setselesaiOrdermodal(false);
        setcancelOrderModal(false);
      });
  }

  async function deletePesanan() {
    await axios
      .post(`http://localhost:4000/v1/deletepesanan`, {
        id_pesanan: id_pesanan,
        status: tabactive,
        users: Name,
      })
      .then(function (response) {
        toast.success("Data berhasil dihapus", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 2000,
        });
        loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
        sethapuspesanan(false);
      });
  }

  async function loaddataproduk(query: any, store: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getproduktukarmodel`,
      data: {
        query: "all",
        id_ware: "all",
      },
    })
      .then(function (response) {
        setdataproduk(response.data.result);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const options: any = [];

  if (!isLoading) {
    data_produk.map((produk: any, index: number) => {
      return options.push({
        value: produk.produk + "#" + produk.id_produk,
        // label: produk.produk,
        label: (
          <div className="flex gap-2 py-2 items-center">
            <Image
              className="rounded border w-[65px] h-auto p-2"
              src={`http://localhost:4000/public/images/${produk.img}`}
              alt="product-1"
              height="500"
              width="500"
              priority
            />
            <span>
              {produk.produk}
            </span>
          </div>
        ),
      });
    });
  }


  return (

    <div className="p-5">
      <ToastContainer className="mt-[50px]" />

      <div className="h-[5%]">
        <span className="text-xl font-bold">List Order Sales Online</span>
      </div>

      <div className="mt-3 mb-4">
        <div className=" flex flex-row mt-0 gap-3 text-black">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
            <>
              <div className="basis-1/6 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">
                  Total Order
                </div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {sales ? sales + " Order" : "0 Order"}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <ClipboardDocumentIcon className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>

              <div className="basis-1/6 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">Qty Order</div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {qty_sales ? qty_sales + " Pcs" : "0 Pcs"}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <Box className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>

              <div className="basis-1/6 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">Selling Price</div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {subtotal ? subtotal : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <DollarSignIcon className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>

              <div className="basis-1/6 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">Omzet</div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {omzet ? omzet : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <DollarSignIcon className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>

              <div className="basis-1/6 bg-red-300 border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">Cost</div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {modal ? modal : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <ArchiveRestore className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>

              <div className="basis-1/6 bg-lime-300 border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                <div className="text-md font-semibold py-4  px-5">Margin</div>
                <div className="flex flex-row text-left  mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {net_sales ? net_sales : 0}
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <BookKey className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {cekHariIni === datatoday ? (
                <>
                  <div className="basis-1/4 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                    <div className="text-md font-semibold py-4  px-5">
                      Total Order
                    </div>
                    <div className="flex flex-row text-left  mt-2">
                      <div className="basis-full text-lg font-semibold py-0 px-5">
                        {sales ? sales + " Order" : "0 Order"}
                      </div>
                      <div className=" basis-auto mt-1 mx-5">
                        <ClipboardDocumentIcon className="h-6 w-6 text-black text-right" />
                      </div>
                    </div>
                  </div>

                  <div className="basis-1/4 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                    <div className="text-md font-semibold py-4  px-5">Qty Order</div>
                    <div className="flex flex-row text-left  mt-2">
                      <div className="basis-full text-lg font-semibold py-0 px-5">
                        {qty_sales ? qty_sales + " Pcs" : "0 Pcs"}
                      </div>
                      <div className=" basis-auto mt-1 mx-5">
                        <Box className="h-6 w-6 text-black text-right" />
                      </div>
                    </div>
                  </div>

                  <div className="basis-1/4 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                    <div className="text-md font-semibold py-4  px-5">Selling Price</div>
                    <div className="flex flex-row text-left  mt-2">
                      <div className="basis-full text-lg font-semibold py-0 px-5">
                        {subtotal ? subtotal : 0}
                      </div>
                      <div className=" basis-auto mt-1 mx-5">
                        <DollarSignIcon className="h-6 w-6 text-black text-right" />
                      </div>
                    </div>
                  </div>

                  <div className="basis-1/4 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                    <div className="text-md font-semibold py-4  px-5">Omzet</div>
                    <div className="flex flex-row text-left  mt-2">
                      <div className="basis-full text-lg font-semibold py-0 px-5">
                        {omzet ? omzet : 0}
                      </div>
                      <div className=" basis-auto mt-1 mx-5">
                        <DollarSignIcon className="h-6 w-6 text-black text-right" />
                      </div>
                    </div>
                  </div>
                </>
              ) :
                <>
                  <div className="basis-1/2 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                    <div className="text-md font-semibold py-4  px-5">
                      Total Order
                    </div>
                    <div className="flex flex-row text-left  mt-2">
                      <div className="basis-full text-lg font-semibold py-0 px-5">
                        {sales ? sales + " Order" : "0 Order"}
                      </div>
                      <div className=" basis-auto mt-1 mx-5">
                        <ClipboardDocumentIcon className="h-6 w-6 text-black text-right" />
                      </div>
                    </div>
                  </div>

                  <div className="basis-1/2 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                    <div className="text-md font-semibold py-4  px-5">Qty Order</div>
                    <div className="flex flex-row text-left  mt-2">
                      <div className="basis-full text-lg font-semibold py-0 px-5">
                        {qty_sales ? qty_sales + " Pcs" : "0 Pcs"}
                      </div>
                      <div className=" basis-auto mt-1 mx-5">
                        <Box className="h-6 w-6 text-black text-right" />
                      </div>
                    </div>
                  </div>
                </>
              }
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center content-center mb-4">
        <div className="shadow grow rounded-lg w-auto flex flex-row text-center content-center">
          {/* <button type="button" className="rounded-l-lg bg-gray-200 hover:bg-gray-300 h-[50px] text-gray-700 font-medium px-4 flex flex-wrap gap-2 content-center">
                        <span>Order ID</span>
                        <div className="my-auto">
                            <fa.FaChevronDown size={10} className="text-gray-700" />
                        </div>
                    </button> */}

          <input
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setQuery("all");
                loaddataorder(status_pesanan, "all", Store, date, area, Filter_Tipe_user, statusdate, Brand);
              }
            }}
            onKeyDown={keyDown}
            className="h-[45px] border-0 w-[100%] py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Search..."
          />

          <button
            type="button"
            disabled={isLoading}
            className={`rounded-r-lg bg-white basis-1/8 hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5`}
            onClick={() => {
              if (Query != "all") {
                loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, Brand);
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
        {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
          <>
            <div className="flex text-sm flex-row items-center w-[20%] justify-end">
              <select
                value={Brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  loaddataorder(status_pesanan, Query, Store, date, area, Filter_Tipe_user, statusdate, e.target.value);
                  getstore(Role, area, e.target.value);
                }}
                className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
              >
                {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                  <>
                    <option value="all">All Brand</option>
                    {list_brand}
                  </>
                ) : null}
              </select>
            </div>
          </>
        ) : null}

        <div className="flex text-sm flex-row items-center w-[20%] justify-end">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ||
            "HEAD-AREA" === Cookies.get("auth_role") ||
            "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
            <>
              <select
                value={Store}
                onChange={(e) => {
                  setStore(e.target.value);
                  loaddataorder(status_pesanan, Query, e.target.value, date, area, Filter_Tipe_user, statusdate, Brand);
                }}
                className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
              >
                {"HEAD-AREA" != Cookies.get("auth_role") ||
                  "HEAD-WAREHOUSE" === Cookies.get("auth_role") ||
                  "HEAD-STORE" === Cookies.get("auth_role") ||
                  "CASHIER" === Cookies.get("auth_role") ? (
                  <>
                    <option value="all">All Store</option>
                  </>
                ) : (
                  <>
                    <option value="all_area">All Store</option>
                  </>
                )}
                {list_store}
              </select>
            </>
          ) : (
            <>
              <select
                value={Store}
                onChange={(e) => {
                  setStore(e.target.value);
                }}
                className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
              >
                {list_store}
              </select>
            </>
          )}
        </div>

        <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end bg-white">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
            <>
              <Datepicker
                displayFormat="DD-MM-YYYY"
                primaryColor="blue"
                value={value}
                onChange={handleValueChange}
                // onChange={(e) => {
                //   handleValueChange(e);
                //   setstatusdate("click");
                // }}
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
                        start: "2024-01-01",
                        end: todayDate,
                      },
                    },
                  },
                  footer: {
                    cancel: "Close",
                    apply: "Apply",
                  },
                }}
                placeholder="Select Date"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>) :
            (<>
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
                placeholder="Select Date"
                inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
              />
            </>)}
          {/* <Flatpickr
                        className="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
                        value={date}
                        placeholder="Select Date Range"
                        options={{
                            mode: "range",
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

                    <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4  mr-4"></i> */}
        </div>

        {/* <button
          type="button"
          className="shadow rounded-lg bg-red-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
          onClick={() => {
            getshopid();
          }}
        >
          Sync Order From Marketplace
          <div className="my-auto">
            <fa.FaPlus size={13} className="text-white" />
          </div>
        </button> */}

        <Link href="/cashier/add_order">
          <button
            type="button"
            className="shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
          >
            Add Order Sales Online
            <div className="my-auto">
              <fa.FaPlus size={13} className="text-white" />
            </div>
          </button>
        </Link>
      </div>

      <div className="my-4 mt-3 py-2 px-5 flex flex-warp items-center bg-white rounded-lg h-[50px]">
        {/* <button
          onClick={() => tabActive("PERLU_PROSES")}
          disabled={isLoading}
          className={`${tabactive === "PERLU_PROSES"
            ? "border-blue-500 text-blue-500 border-b-4 font-bold"
            : "text-black"
            } text-sm px-3 h-[50px]`}
        >
          Perlu Diproses {count_selesai}
        </button>

        <button
          onClick={() => tabActive("TELAH_DI_PROSES")}
          disabled={isLoading}
          className={`${tabactive === "TELAH_DI_PROSES"
            ? "border-blue-500 text-blue-500 border-b-4 font-bold"
            : "text-black"
            } text-sm px-3 h-[50px]`}
        >
          Telah Diproses {count_selesai}
        </button> */}

        <button
          onClick={() => tabActive("SELESAI")}
          disabled={isLoading}
          className={`${tabactive === "SELESAI"
            ? "border-blue-500 text-blue-500 border-b-4 font-bold"
            : "text-black"
            } text-sm px-3 h-[50px]`}
        >
          Selesai {header_selesai}
        </button>

        <div className="font-medium text-black text-sm grow text-end px-5">
          {header_selesai} Show Order
        </div>
      </div>

      <div className="shadow hover:shadow-md w-full h-auto border bg-white">
        <div className="">
          <div className="flex flex-row h-[35px] items-center text-[10px]">
            <div className="basis-20 text-center font-bold h-full content-center">
              No.
            </div>
            <div className="basis-56 font-bold text-center h-full content-center">
              Date Time
            </div>
            <div className="basis-64 font-bold text-center h-full content-center">
              Detail
            </div>
            <div className="basis-1/12 font-bold text-center h-full content-center">
              Users
            </div>

            <div className="basis-full font-bold text-left h-full content-center flex flex-row">
              <div className="pl-2 grow content-center ">Product</div>
              <div className="pl-2 basis-28 content-center text-center">Size</div>
              <div className="pl-2 basis-16 content-center text-center">Qty</div>
              <div className="pl-2 basis-28 content-center text-center">Price</div>
              <div className="pl-2 basis-1/12 content-center text-center">Subtotal</div>
              <div className="pl-2 basis-1/12 content-center text-center">Payment</div>
              {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                <>
                  <div className="pl-2 basis-1/12 content-center text-center">Cost</div>
                  <div className="pl-2 basis-1/12 content-center text-center">Profit</div>
                </>) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {(function () {
          if (count_orders < 1) {
            return (
              <div className="w-[100%] py-3 text-center">
                Data not yet available, please select date or store..
              </div>
            );
          } else {
            return list_order;
          }
        })()}
      </div>

      {selesaiOrdermodal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Update Pesanan {id_pesanan}
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <span className="text-sm font-semibold">
                    Ingin Merubah Status Pesanan Jadi Selesai?
                  </span>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setselesaiOrdermodal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => updatePesanan("SELESAI")}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {cancelOrderModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Update Pesanan {id_pesanan}
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <span className="text-sm font-semibold">
                    Ingin Merubah Status Pesanan Jadi Cancel?
                  </span>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setcancelOrderModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => updatePesanan("CANCEL")}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {returModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Tukar Size -{" "}
                    {produkretur +
                      " | Size " +
                      sizeretur +
                      " | Qty " +
                      qtyoldretur}
                  </span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex-auto">
                  <div className="text-sm">
                    <label>Warehouse:</label>
                    <div className="mt-1 flex flex-wrap items-center justify-end">
                      <select
                        className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                        placeholder="Pilih Store"
                        disabled={true}
                      >
                        <option value="">{cari_namawares}</option>
                      </select>
                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                    </div>
                  </div>

                  <div className="text-sm mt-3">
                    <label>Size:</label>
                    {(function () {
                      if (list_size.length > 0) {
                        return (
                          <div className="mt-1 grid grid-cols-5 gap-2 text-xs content-start">
                            {list_size}
                          </div>
                        );
                      } else {
                        return (
                          <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                            Stok Belum Tersedia
                          </div>
                        );
                      }
                    })()}
                  </div>

                  <div className="text-sm mt-3">
                    <div className="mb-2">Qty:</div>
                    <div className="text-sm flex flex-wrap items-center">
                      <button
                        onClick={() => {
                          setQty("min");
                        }}
                        disabled={returmodal_submit}
                        className={`${returmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-500"
                          } text-white w-10 py-2 border rounded font-bold`}
                      >
                        -
                      </button>
                      <div className="font-bold py-2 w-10 text-center border rounded mx-2">
                        {returmodal_qty}
                      </div>
                      <button
                        onClick={() => {
                          setQty("plus");
                        }}
                        disabled={returmodal_submit}
                        className={`${returmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-500"
                          } text-white w-10 py-2 border rounded font-bold`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setreturModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${returmodal_submit ? "bg-gray-500" : "bg-green-500"
                      } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => sumbitRetur()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {refundModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Refund Produk -{" "}
                    {"Size " + addproduk_size + " | Qty " + addproduk_qty}
                  </span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex items-center flex-auto gap-4">
                  <div className="grow">
                    <div className="mb-2">Produk:</div>
                    <input
                      value={addproduk_produk}
                      className="h-auto rounded-lg w-full bg-white py-2 px-5 text-gray-700 focus:outline-none border"
                      type="text"
                      readOnly
                      placeholder="Masukan Size"
                    />
                  </div>

                  <div className="text-sm">
                    <div className="mb-2">Qty:</div>
                    <div className="text-sm flex flex-wrap items-center">
                      <button
                        onClick={() => {
                          setQtymanual("min");
                        }}
                        disabled={returmodal_submit}
                        className={`${returmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-500"
                          } text-white w-10 py-2 border rounded font-bold`}
                      >
                        -
                      </button>
                      <div className="font-bold py-2 w-10 text-center border rounded mx-2">
                        {addproduk_qty}
                      </div>
                      <button
                        onClick={() => {
                          setQtymanual("plus");
                        }}
                        disabled={returmodal_submit}
                        className={`${returmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-500"
                          } text-white w-10 py-2 border rounded font-bold`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="relative text-sm p-6 -mt-5 flex items-center flex-auto gap-4">
                      <div className="grow">
                        <div className="mb-3">Biaya Refund</div>
                        <CurrencyInput
                          className={`${errors.biaya_refund ? "border-red-400" : ""
                            } border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          placeholder="Masukan Total Amount dari channel Olshop"
                          defaultValue={0}
                          decimalsLimit={2}
                          groupSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          {...register("biaya_refund", {
                            required: true,
                          })}
                        />
                      </div>
                    </div> */}

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setrefundModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${btnrefund ? "bg-gray-500" : "bg-green-500"
                      } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => sumbitrefund()}
                  >
                    Refund
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {returLuarModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Tukar Size Barang Luar -{" "}
                    {LuarProduk +
                      " | Size " +
                      LuarSize +
                      " | Qty " +
                      LuarOldQty}
                  </span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex-auto">
                  <div className="text-sm">
                    <label>Nama Produk</label>
                    <input
                      value={LuarProduk}
                      readOnly
                      className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                      type="text"
                      placeholder="Masukan Nama Produk"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-sm mt-3">
                      <label>Size Baru</label>
                      <input
                        value={LuarSize}
                        onChange={(e) => {
                          setLuarSize(e.target.value);
                        }}
                        className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                        type="text"
                        placeholder="Masukan Size"
                      />
                    </div>

                    <div className="text-sm mt-3">
                      <div className="mb-2">Qty:</div>
                      <div className="text-sm flex flex-wrap items-center">
                        <button
                          onClick={() => {
                            setQtymanualluar("min");
                          }}
                          className="w-10 py-2 border border-blue-300 rounded font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          -
                        </button>
                        <div className="font-bold py-2 grow text-center border rounded mx-2">
                          {LuarQtyNew}
                        </div>
                        <button
                          onClick={() => {
                            setQtymanualluar("plus");
                          }}
                          className="w-10 py-2 border border-blue-300 rounded font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm mt-3">
                    <label>Supplier</label>
                    <div className="mt-2 flex flex-wrap items-center justify-end">
                      <select
                        onChange={(e) => {
                          setLuarSupplier(e.target.value);
                        }}
                        className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                        placeholder="Pilih Store"
                      >
                        <option value="">Pilih Supplier</option>
                        {list_supplier}
                      </select>
                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                    </div>
                  </div>

                  <div className="text-sm mt-3">
                    <label>Harga Beli</label>
                    <input
                      onChange={(e) => {
                        setLuarHargaBeli(parseInt(e.target.value));
                      }}
                      value={LuarHargaBeli}
                      className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                      type="number"
                      placeholder="Masukan Harga Beli"
                    />
                  </div>

                  <div className="text-sm my-3">
                    <label>Status Pembayaran</label>
                    <div className="mt-2 flex flex-wrap items-center justify-end">
                      <select
                        onChange={(e) => {
                          setLuarPayment(e.target.value);
                        }}
                        className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                        placeholder="Pilih Store"
                      >
                        <option value="">Pilih Payment</option>
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                      </select>
                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                    </div>
                  </div>
                  <div className="text-sm">
                    <label>Status Barang Retur</label>
                    <div className="mt-2 flex flex-wrap items-center justify-end">
                      <select
                        onChange={(e) => {
                          setLuarStatusBarangRetur(e.target.value);
                        }}
                        className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                        placeholder="Pilih Store"
                      >
                        <option value="">Pilih Status Barang Retur</option>
                        <option value="STOKAN">STOKAN</option>
                        <option value="RETURN">DIKEMBALIKAN KE SUPPLIER</option>
                      </select>
                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setreturLuarModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={` ${returLuarBTN ? "bg-gray-500" : "bg-green-500"
                      } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    disabled={returLuarBTN}
                    onClick={() => sumbitReturLuar()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {hapuspesanan ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Delete Pesanan {id_pesanan}
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <span className="text-sm font-semibold">
                    Mohon Konfirmasi untuk Penghapusan Data?
                  </span>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      sethapuspesanan(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => deletePesanan()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {returTukerModel ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Change Product
                  </span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex-auto">
                  <div className="text-sm">
                    <label>Produk:</label>
                    <div className="mt-1 flex flex-wrap items-center justify-end">
                      <Select
                        className="w-full"
                        options={options}
                        onChange={(e: any) => {
                          setTukerModelProduk(e.value.split("#")[0]);
                          setTukerModelIDProduk(e.value.split("#")[1]);
                          setwarehouse_tukarmodel(old_ware);
                          getStockTukarModel(old_ware, e.value.split("#")[1]);
                        }}
                        placeholder="Pilih Produk"
                      />
                    </div>
                  </div>

                  <div className="text-sm mt-3">
                    <label>Size:</label>
                    {(function () {

                      if (list_size.length > 0) {
                        return (
                          <div className="mt-1 grid grid-cols-5 gap-2 text-xs content-start">
                            {list_size}
                          </div>
                        );
                      } else {
                        return (
                          <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                            Stok Belum Tersedia
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* <div className="text-sm mt-3">
                    <div className="mb-2">*Qty hanya 1</div>
                    <div className="text-sm flex flex-wrap items-center">
                      <button
                        onClick={() => {
                          setQty("min");
                        }}
                        disabled={true}
                        className={`${returmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-500"
                          } text-white w-10 py-2 border rounded font-bold`}
                      >
                        -
                      </button>
                      <div className="font-bold py-2 w-10 text-center border rounded mx-2">
                        {returmodal_qty}
                      </div>
                      <button
                        onClick={() => {
                          setQty("plus");
                        }}
                        disabled={true}
                        className={`${returmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-500"
                          } text-white w-10 py-2 border rounded font-bold`}
                      >
                        +
                      </button>
                    </div>
                  </div> */}

                  <div className="text-sm mt-4">
                    <label className="mb-4">Minimal Selisih :</label>
                    <span
                      className={`${minimalselisih < 0
                        ? "text-red-500"
                        : "text-black"
                        } mb-4`}
                    > {Numbering.format(minimalselisih)}</span>

                  </div>
                  <div className="text-sm mt-4">
                    <label className="mb-4">Selisih Harga &nbsp;&nbsp;&nbsp;: </label>
                    <CurrencyInput
                      onChange={(e) => {
                        var values = e.target.value.replace(/\D/g, "");
                        if (values === "") {
                          setselisih("0");
                        } else {
                          setselisih(values);
                        }
                      }}
                      value={selisih}
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      className="text-sm font-bold h-auto bg-white w-[65%] py-2 px-5 text-black focus:outline-none border-b border-gray-300"
                      type="text"
                    />
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setreturTukerModel(false);
                      getStockTukarModel("", "");
                      setselisih("0");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${tukermodel_submit ? "bg-gray-500" : "bg-green-500"
                      } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    disabled={tukermodel_submit}
                    onClick={() => sumbitTukerModel()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {openmodalsync ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">
                    Sync Order From Marketplace
                  </span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex-auto">
                  <div className="text-sm">
                    <label>Produk:</label>
                    <div className="mt-1 flex flex-wrap items-center justify-end">
                      <select
                        value={StoreSync}
                        onChange={(e) => {
                          setStoreSync(e.target.value);
                        }}
                        className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
                      >
                        <option value="">Silahkan Pilih</option>
                        {list_shop}
                      </select>
                    </div>
                  </div>

                  <div className="text-sm mt-4">
                    <label className="mb-4">TANGGAL AWAL &nbsp;&nbsp;&nbsp;: </label>
                    <Datepicker
                      useRange={false}
                      value={valueSync}
                      onChange={newValue => setValueSync(newValue)}
                    />
                  </div>

                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setopenmodalsync(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${tukermodel_submit ? "bg-gray-500" : "bg-green-500"
                      } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    // disabled={tukermodel_submit}
                    onClick={() => {
                      console.log(new Date(valueSync.startDate + ' 00:00:00').toISOString());
                      console.log(new Date(valueSync.endDate + ' 23:59:59').toISOString());
                      getorder()
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>

  );
}
