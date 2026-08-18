import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { table } from "console";
import TableRows from "../../components/tablerows";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { stringify } from "querystring";
import { compareAsc, format } from "date-fns";
import { redirect } from "next/dist/server/api-utils";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import Cookies from "js-cookie";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function AddOrder() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_store, setdatastore] = useState([]);
  const [data_ware, setdataware] = useState([]);
  const [data_supplier, setdatasupplier] = useState([]);
  const [data_product, setdataproductsales] = useState([]);
  const [data_kasir, setdatakasir] = useState([]);
  const [data_reseller, setdatareseller] = useState([]);
  const [data_upprice_m_price, setdataupprice_m_price]: any = useState(0);
  const [data_upprice_g_price, setdataupprice_g_price]: any = useState(0);
  const [data_upprice_r_price, setdataupprice_r_price]: any = useState(0);
  const [data_upprice_n_price, setdataupprice_n_price]: any = useState(0);
  const [addPayment, setaddPayment] = useState(false);

  const {
    register,
    control,
    resetField,
    setValue,
    trigger,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({});

  const router = useRouter();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [timestampss, settimestamp] = useState(format(new Date(), "yyyy-MM-dd HH:mm:ss"));

  useEffect(() => {
    getstore(Role, idstore);
    getwarehouse(Role, area);
    getsupplier();
    getkasir(idstore, Users);
    getreseller();
    getupprice(Store, idstore, Role);
    //   loaddataproductsales(Query);
    return () => { };
  }, [watch]);

  async function getreseller() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getresellersales`,
    })
      .then(function (response) {
        setdatareseller(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_reseller: any = [];
  data_reseller.map((reseller: any, index: number) => {
    list_reseller.push(
      <option key={index} value={reseller.nama}>
        {reseller.nama}
      </option>
    );
  });

  async function getupprice(Store: any, idstore: any, Role: any) {
    await axios
      .post(`http://localhost:4000/v1/get_upprice`, {
        id_store: Store,
        area: idstore,
        role: Role,
      })
      .then(function (response) {
        setdataupprice_m_price(response.data.result.m_price);
        setdataupprice_g_price(response.data.result.g_price);
        setdataupprice_r_price(response.data.result.r_price);
        setdataupprice_n_price(response.data.result.n_price);
      });
  }

  const [Users, setUsers] = useState(Cookies.get("auth_name"));
  async function getkasir(idstore: any, users: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getkasir`,
      data: {
        idstore: idstore,
        users: Users,
      },
    })
      .then(function (response) {
        setdatakasir(response.data.result);
        setValue("kasir", response.data.result[0].name);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_kasir: any = [];
  data_kasir.map((kasir: any, index: number) => {
    list_kasir.push(
      <option key={index} value={kasir.name}>
        {kasir.name}
      </option>
    );
  });

  const list_store: any = [];
  const fixed_store: any = [];

  async function getstore(role: any, idstore: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getStore_salesretail`,
      data: {
        role: role,
        store: idstore,
      },
    })
      .then(function (response) {
        setdatastore(response.data.result.data_store);
        console.log(response.data.result);
        if (
          "SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role") ||
          "HEAD-WAREHOUSE" === Cookies.get("auth_role")
        ) {
        } else {
          setValue("store", response.data.result[0].id_store);
          loaddataproductsales(Query, response.data.result[0].id_store, Role, area);
          getwaress(response.data.result[0].id_store);
          setNameStore(response.data.result[0].store);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  data_store.map((store: any, index: number) => {
    list_store.push(
      <option key={index} data-nameStore={store.store} value={store.id_store}>
        {store.store}
      </option>
    );
    fixed_store.push(
      <option key={index} data-nameStore={store.store} value={store.id_store}>
        {store.store}
      </option>
    );
  });

  async function getwarehouse(role: any, area: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getwarehouse_sales`,
      data: {
        role: role,
        area: area,
      },
    })
      .then(function (response) {
        setdataware(response.data.result);
        if (
          "SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role")
        ) {
        } else {
          setValue("warehouse", response.data.result[0].id_ware);
          setdataidware(response.data.result[0].id_ware)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [barcode, setbarcode] = useState("");
  const [get_idware, setdataidware]: any = useState("");
  const list_warehouse: any = [];
  if (!isLoading) {
    data_ware.map((area: any, index: number) => {
      list_warehouse.push(
        <option key={index} value={area.id_ware}>
          {area.warehouse}
        </option>
      );
      // console.log(list_warehouse)
    });
  }

  async function getsupplier() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getsupplier`,
    })
      .then(function (response) {
        setdatasupplier(response.data.data_supplier);
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

  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [idstore, setIdstore] = useState(Cookies.get("auth_store"));
  const [Query, setQuery] = useState("all");
  const [QuerySearch, setQuerySearch] = useState("");
  const [cekbarcode, setcekbarcode] = useState("STOP");
  const [cekbarcodestatus, setcekbarcodestatus] = useState("SOLD_OUT");
  const [area, setarea] = useState((Cookies.get("auth_store")));
  const [Store, setStore] = useState("");
  if ("SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role")) {
    var [NameStore, setNameStore]: any = useState("");
  } else {
    var [NameStore, setNameStore]: any = useState("");
  }
  const [getidstores, setgetidstores]: any = useState("");
  const [cariwaress, setcariwares] = useState("");
  const [cariwaress_nama, setcariwares_nama] = useState("");
  const [address, setaddresswares] = useState("");


  function querySet(e: any) {
    if (e.target.value === "") {
      setQuery("all");
      loaddataproductsales("all", Store, Role, area);
    } else {
      setQuery(e.target.value);
      loaddataproductsales(e.target.value, Store, Role, area);
    }
  }

  async function keyDown(event: any) {
    if (event.key == 'Enter') {
      if (Query != "all") {
        loaddataproductsales(Query, Store, Role, area);
      }
    }
  }

  async function loaddataproductsales(query: any, id_store: any, role: any, area: any) {
    // setisLoading(true);
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/products_salesretail`,
      data: {
        query: query,
        role: role,
        area: area,
      },
    })
      .then(function (response) {
        setdataproductsales(response.data.result);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const list_product: any = [];

  {
    if (!isLoading) {
      data_product.map((data_produk: any, index: any) => {
        list_product.push(
          <div key={index}>
            {(function () {
              if (data_produk.stok === "External") {
                return (
                  <>
                    <div
                      onDoubleClick={() =>
                        openaddmodalexternal(
                          data_produk.img,
                          data_produk.produk,
                          data_produk.id_produk,
                          data_produk.stok,
                          data_produk.variation_sales[0].size,
                          data_produk.variation_sales[0].qty
                        )
                      }
                      className=" bg-white h-fit shadow-lg cursor-pointer rounded-lg pb-1"
                    >
                      <div className="aspect-square flex items-center">
                        <Image
                          className="w-[100%] h-auto p-7 m-auto rounded-t-lg"
                          src={`http://localhost:4000/public/images/${data_produk.img}`}
                          alt="Picture of the author"
                          width={300}
                          height={300}
                          placeholder="blur"
                          blurDataURL={"/box.png"}
                        />
                      </div>

                      <div className="text-xs px-2 my-2 pt-1 flex flex-col text-center gap-1">
                        <div className="font-medium line-clamp-1 h-5">
                          Size {data_produk.variation_sales[0].size} |{" "}
                          {data_produk.produk}
                        </div>
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div
                      onDoubleClick={() =>
                        openaddmodal(
                          data_produk.img,
                          data_produk.produk,
                          data_produk.n_price,
                          data_produk.r_price,
                          data_produk.g_price,
                          data_produk.id_produk,
                          data_produk.stok,
                        )
                      }
                      className=" bg-white h-fit shadow-lg cursor-pointer rounded-lg pb-1"
                    >
                      {/* {JSON.stringify(data_produk.id_ware)} */}
                      <div className="aspect-square flex items-center">
                        <Image
                          className="w-[100%] h-[100%] m-auto rounded-t-lg"
                          src={`http://localhost:4000/public/images/${data_produk.img}`}
                          alt="Picture of the author"
                          width={300}
                          height={300}
                          placeholder="blur"
                          blurDataURL={"/box.png"}
                        />
                      </div>

                      <div className="text-xs px-2 my-2 pt-1 flex flex-col text-center gap-1">
                        <div className="font-medium line-clamp-1 h-5">
                          {data_produk.produk}
                        </div>
                      </div>
                    </div >
                  </>
                );
              }
            })()
            }
          </div >
        );
      });
    }
  }

  const [pilih_warehouse, setpilih_warehouse] = React.useState("close");
  const [datasize, setdatasize] = React.useState([]);
  const [warehouseList, setWarehouseList] = React.useState<{ id_ware: string; warehouse: string; total_qty: number }[]>([]);
  const [modalWare, setModalWare] = React.useState("");
  const [display_id_produk, setdisplay_id_produk] = React.useState([]);
  const [display_id_ware, setdisplay_id_ware] = React.useState([]);
  const [display_size, setdisplay_size] = React.useState([]);

  async function getwaress(e: any) {
    await axios
      .post(`http://localhost:4000/v1/cariwares`, {
        id_store: e,
      })
      .then(function (response) {
        setcariwares(response.data.result[0].cariwares);
        setcariwares_nama(response.data.result[0].nama_warehouses);
        setaddresswares(response.data.result[0].address);
      });

  }

  const [get_displayed, setgetdisplayed] = React.useState("display_false");
  async function getdisplayed(e: any) {
    setgetdisplayed(e.target.value);
  }

  async function getStock(idware: any, idproduk: any) {
    setpilih_warehouse("loading");
    setsizeSelected(null);
    setstokReady(0);
    setaddmodal_submit(true);
    setaddmodal_qty(1);

    const targetWare = idware || cariwaress;
    setModalWare(targetWare);
    setaddmodal_warehouse(targetWare);
    await axios
      .post(`http://localhost:4000/v1/getsizesales`, {
        idware: targetWare,
        idproduct: idproduk,
      })
      .then(function (response) {
        setpilih_warehouse("open");
        setdatasize(response.data.result.datasize);
        setdisplay_id_produk(response.data.result.display_id_produk);
        setdisplay_id_ware(response.data.result.display_id_ware);
        setdisplay_size(response.data.result.display_size);
        if (response.data.result.warehouse_list) {
          setWarehouseList(response.data.result.warehouse_list);
        }
      });
  }

  const [sizeSelected, setsizeSelected] = React.useState(null);
  const [stokReady, setstokReady] = React.useState(0);

  function setQty(type: any) {
    if (type === "plus") {
      if (addmodal_qty < stokReady) {
        setaddmodal_qty(addmodal_qty + 1);
      } else {
        toast.warning("Jumlah Melebihi Stok Yang Tersedia!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 2000,
        });
      }
    } else if (type === "min") {
      if (addmodal_qty > 1) {
        setaddmodal_qty(addmodal_qty - 1);
      }
    }
  }

  const list_size: any = [];

  const [typemodal, settypemodal] = React.useState("");

  {
    for (let index = 0; index < datasize.length; index++) {


      if (datasize[index].qty > 0) {
        if (typemodal === "barcode") {
          list_size.push(
            <div
              key={index}
              className={`${sizeSelected === datasize[index].size
                ? "bg-blue-500 text-white border-blue-500"
                : display_size === datasize[index].size && display_id_ware === datasize[index].id_ware && display_id_produk === datasize[index].id_produk
                  ? "bg-red-500 text-white"
                  : "text-gray-500 border-gray-500"} font-medium py-2 text-center rounded-lg border  cursor-pointer`}
            >
              {datasize[index].size} = {datasize[index].qty}
            </div>
          );
        } else {

          list_size.push(
            <div
              onClick={() => {
                setsizeSelected(datasize[index].size);
                setstokReady(parseInt(datasize[index].qty));
                setaddmodal_submit(false);
                setaddmodal_qty(1);
                setdisplaysvalue(display_size === datasize[index].size && display_id_ware === datasize[index].id_ware && display_id_produk === datasize[index].id_produk ? false : true);
              }}
              key={index}
              className={`${sizeSelected === datasize[index].size
                ? "bg-blue-500 text-white"
                : display_size === datasize[index].size && display_id_ware === datasize[index].id_ware && display_id_produk === datasize[index].id_produk
                  ? "bg-red-500 text-white"
                  : "text-blue-500"} font-medium py-2 text-center rounded-lg border border-blue-500 cursor-pointer`}
            >
              {datasize[index].size} = {datasize[index].qty}
            </div>
          );
        }
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

  const [rowsData, setRowsData] = useState([]);
  const [totalQty, settotalQty] = useState(0);
  //   const totalInvoice = (rowsData.reduce((total, currentItem) => total = total + currentItem.subtotal, 0));
  const total_hargaJual = rowsData.reduce(
    (total, currentItem) =>
      (total = total + currentItem.harga_jual * currentItem.qty),
    0
  );

  const total_diskonItem = rowsData.reduce(
    (total, currentItem) =>
      (total = total + currentItem.diskon_item * currentItem.qty),
    0
  );

  const [DiskonNota, setDiskonNota] = React.useState(0);
  const [BiayaLain, setBiayaLain] = React.useState(0);

  const grandTotal =
    total_hargaJual - total_diskonItem + BiayaLain - DiskonNota;

  const [isVisible, setIsVisible] = useState(true)

  async function scanBarcode(
    addmodal_idproduk: any,
    sizeSelected: any,
    addmodal_warehouse: any,
    addmodal_diskon: any,
    addmodal_qty: any,
    stokReady: any,
    addprodukharga_jual: any,
  ) {
    await axios
      .post(`http://localhost:4000/v1/cekbarcode`, {
        idware: addmodal_warehouse,
        idproduct: addmodal_idproduk,
      })
      .then(function (response) {
        setcekbarcode(response.data.result.hasil_cekbarcode);
        axios
          .post(`http://localhost:4000/v1/salesproductbarcode`, {
            idware: addmodal_warehouse,
            size: sizeSelected,
            idproduct: addmodal_idproduk,
          })
          .then(function (response) {
            if (response.data.result === "sold_out") {
              toast.error(
                "The size you want is out of stock",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: 2000,
                }
              );
            } else {
              if (
                !rowsData.find(
                  (item) =>
                    item.idproduk === addmodal_idproduk &&
                    item.size === sizeSelected &&
                    item.id_ware === response.data.result.id_ware
                )
              ) {
                const rowsInput = {
                  produk: response.data.result.produk,
                  idproduk: addmodal_idproduk,
                  size: sizeSelected,
                  harga_beli: response.data.result.datas[0].harga_beli,
                  qty_ready: stokReady,
                  qty: addmodal_qty,
                  img: response.data.result.img,
                  source: cariwaress_nama,
                  id_ware: response.data.result.id_ware,
                  // start di tambahin jamed
                  diskon_item: addmodal_diskon,
                  harga_jual: addprodukharga_jual,
                  // end baru di tambahin jamed
                  payment: "PAID",
                };
                // setdatahargajual(response.data.result.get_hargajual[0].r_price);
                setRowsData([...rowsData, rowsInput]);
                settotalQty(totalQty + 1);

                toast.success("Product Added Successfully", {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: 2000,
                });
                setaddmodal(false);
                setbarcode("");
                setaddmodalbarcode(false);
              } else {
                setbarcode("");
                toast.info(
                  "Products of the same size have been added before",
                  {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                    autoClose: 2000,
                  }
                );
              }
            }

          });
      });
  }

  function addProduk(
    produk: any,
    idproduk: any,
    size: any,
    harga_beli: any,
    harga_jual: any,
    img: any,
    qty: any,
    source: any,
    qty_ready: any,
    id_ware: any,
    diskon_item: any
  ) {
    if (!rowsData.find(
      (item) =>
        item.idproduk === idproduk &&
        item.size === size &&
        item.id_ware === id_ware
    )
    ) {
      const rowsInput = {
        produk: produk,
        idproduk: idproduk,
        size: size,
        harga_beli: harga_beli,
        harga_jual: harga_jual,
        qty_ready: qty_ready,
        qty: qty,
        img: img,
        source: source,
        id_ware: id_ware,
        payment: "PAID",
        diskon_item: diskon_item,
        // subtotal: parseInt(harga_jual) * parseInt(qty),
        // subdiskon: parseInt(harga_jual) * parseInt(qty),
      };
      setRowsData([...rowsData, rowsInput]);
      settotalQty(totalQty + qty);

      toast.success("Product Added Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
      setaddmodal(false);
      setaddmodalexternal(false);
      setaddmodalbarcode(false);
    } else {
      toast.info("Produk dengan size yang sama telah ditambahkan sebelumnya", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
    }
  }

  function addProdukluar(
    payment: any,
    produk: any,
    idproduk: any,
    size: any,
    harga_beli: any,
    img: any,
    qty: any,
    source: any,
    qty_ready: any,
    id_ware: any
  ) {
    if (
      produk === "" ||
      size === "" ||
      id_ware === "" ||
      payment === "" ||
      harga_beli < 1
    ) {
      toast.warning("Mohon Isi Data dengan Lengkap", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else {
      const rowsInput = {
        produk: produk,
        idproduk: idproduk,
        size: size,
        harga_beli: harga_beli,
        qty_ready: qty_ready,
        qty: qty,
        img: img,
        source: source,
        id_ware: id_ware,
        payment: payment,
      };
      setRowsData([...rowsData, rowsInput]);
      settotalQty(totalQty + qty);

      toast.success("Product Added Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });

      setaddproduk(false);
      setaddproduk_produk("");
      setaddproduk_size("");
      setaddproduk_qty(1);
      setaddproduk_supplier("");
      setaddproduk_hargabeli("0");
    }
  }

  function addProdukEksternal(
    produk: any,
    idproduk: any,
    size: any,
    qty: any,
    source: any,
    qty_ready: any
  ) {
    if (
      !rowsData.find(
        (item) =>
          item.idproduk === idproduk &&
          item.size === size &&
          item.id_ware === "STOKAN"
      )
    ) {
      const rowsInput = {
        produk: produk,
        idproduk: idproduk,
        size: size,
        harga_beli: 0,
        qty_ready: qty_ready,
        qty: qty,
        img: "box.png",
        source: source,
        id_ware: "STOKAN",
        payment: "STOKAN",
      };
      setRowsData([...rowsData, rowsInput]);
      settotalQty(totalQty + qty);

      toast.success("Product Added Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });

      setaddmodalexternal(false);
    } else {
      toast.info("Produk dengan size yang sama telah ditambahkan sebelumnya", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
    }
  }

  const deleteTableRows = (index: number, qty: any) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
    settotalQty(totalQty - qty);

    if (rowsData.length - 1 === 0) {
      setBiayaLain(0);
      setDiskonNota(0);
    }
  };

  const table_product: any = [];

  function setQttable(type: any, index: any) {
    if (type === "plus") {
      if (rowsData[index].qty_ready != "nolimit") {
        if (rowsData[index].qty < rowsData[index].qty_ready) {
          const rowsInput = [...rowsData];
          rowsData[index].qty = rowsData[index].qty + 1;
          setRowsData(rowsInput);
          settotalQty(totalQty + 1);
        }
      } else {
        const rowsInput = [...rowsData];
        rowsData[index].qty = rowsData[index].qty + 1;
        setRowsData(rowsInput);
        settotalQty(totalQty + 1);
      }
    } else if (type === "min") {
      if (rowsData[index].qty > 1) {
        const rowsInput = [...rowsData];
        rowsData[index].qty = rowsData[index].qty - 1;
        setRowsData(rowsInput);
        settotalQty(totalQty - 1);
      }
    }
  }

  {
    for (let index = 0; index < rowsData.length; index++) {
      table_product.push(
        <div key={index} className="flex flex-wrap gap-1 border-b">
          {(function () {
            if (rowsData[index].source === "Barang Luar") {
              return (
                <div className="w-[15%] rounded-lg ">
                  <div className="aspect-square flex items-center">
                    <Image
                      className="w-[100%] h-[100%] m-auto rounded-lg"
                      src={`/open-box.png`}
                      alt="Picture of the author"
                      width={200}
                      height={200}
                      placeholder="blur"
                      blurDataURL={"/open-box.png"}
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div className="w-[12%] rounded-lg  bg-cyan-100 self-center">
                  <div className="aspect-square flex items-center">
                    <Image
                      className="w-[100%] h-[100%] m-auto rounded-lg"
                      src={`http://localhost:4000/public/images/${rowsData[index].img}`}
                      alt="Picture of the author"
                      width={200}
                      height={200}
                      placeholder="blur"
                      blurDataURL={"/open-box.png"}
                    />
                  </div>
                </div>
              );
            }
          })()}
          <div className="grow flex flex-col items-start gap-1 justify-center mb-2 mt-1 ml-2">
            <span className="text-sm font-bold">{rowsData[index].produk} : <span className="w-24 py-0 px-1 border border-orange-500 rounded font-bold text-orange-700 hover:bg-orange-700 hover:text-white">{rowsData[index].size}</span></span>
            <span className="text-sm font-regular">
              {/* <span className="font-bold">Price Item</span>&nbsp;{" : "} */}
              {Rupiah.format(rowsData[index].harga_jual)} x <span className="font-bold">{rowsData[index].qty}</span> - <span className="text-orange-500">({Rupiah.format(rowsData[index].diskon_item * rowsData[index].qty)})</span> =  <span className="font-bold">{Rupiah.format(
                (rowsData[index].harga_jual - rowsData[index].diskon_item) *
                rowsData[index].qty
              )}</span>
            </span>
            {/* <span className="text-sm font-regular">
              <span className="font-bold">Qty</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" : "}
              {rowsData[index].qty}
            </span> */}
            {/* <span className="text-sm font-regular text-orange-400">
              <span className="font-bold">Disc Item</span>&nbsp;&nbsp;{" : "}
              {Rupiah.format(rowsData[index].diskon_item * rowsData[index].qty)}
            </span>
            <span className="text-sm font-medium">
              <span className="font-bold">Total Price</span>{" : "}
              {Rupiah.format(
                (rowsData[index].harga_jual - rowsData[index].diskon_item) *
                rowsData[index].qty
              )}
            </span> */}
            {/* <span className="text-xs ">

              <span className="font-bold text-red-500">Variant :{" "} {rowsData[index].size}</span> |{" "}
              <a className="text-blue">{rowsData[index].source}</a>
            </span> */}
            <div className="text-xs flex flex-wrap items-center">
              <button
                onClick={() => {
                  setQttable("min", index);
                }}
                className="w-7 py-1 border border-blue-300 rounded font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                -
              </button>
              <div className="font-bold py-1 w-7 text-center border rounded mx-2">
                {rowsData[index].qty}
              </div>
              <button
                onClick={() => {
                  setQttable("plus", index);
                }}
                className="w-7 py-1 border border-blue-300 rounded font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                +
              </button>
              <span className="font-medium pl-2">{rowsData[index].source}</span>
            </div>
          </div>

          <div className="place-self-center">
            <button
              onClick={() => {
                deleteTableRows(index, rowsData[index].qty);
              }}
              className="text-red-500"
            >
              <i className="fi fi-rr-trash text-center text-lg"></i>
            </button>
          </div>
        </div>
      );
    }
  }

  const [addmodal, setaddmodal] = React.useState(false);
  const [addmodalbarcode, setaddmodalbarcode] = React.useState(false);
  const [addmodal_img, setaddmodal_img] = React.useState("");
  const [addmodal_produk, setaddmodal_produk] = React.useState("");
  const [addmodal_idproduk, setaddmodal_idproduk] = React.useState("");
  const [addmodal_submit, setaddmodal_submit] = React.useState(true);
  const [addmodal_qty, setaddmodal_qty] = React.useState(1);
  const [addmodal_warehouse, setaddmodal_warehouse] = React.useState("");
  const [addmodal_diskon, setaddmodal_diskon] = React.useState(0);
  const [addproduk, setaddproduk] = React.useState(false);

  const [paymentMethod, setpaymentMethod] = React.useState("PAID");

  const [addproduk_produk, setaddproduk_produk] = React.useState("");
  const [addproduk_size, setaddproduk_size] = React.useState("");
  const [addproduk_qty, setaddproduk_qty] = React.useState(1);
  const [addproduk_supplier, setaddproduk_supplier] = React.useState("");
  const [addproduk_hargabeli, setaddproduk_hargabeli] = React.useState("0");
  const [addproduk_payment, setaddproduk_payment] = React.useState("");
  const [addprodukharga_jual, setaddprodukharga_jual] = React.useState(0);

  const [addmodalexternal, setaddmodalexternal] = React.useState(false);
  const [displaysvalue, setdisplaysvalue] = React.useState(true);
  const [sizeext, setsizeext] = React.useState("");
  const [sizeextqty, setsizeextqty] = React.useState("0");

  function setQtymanual(type: any) {
    if (type === "plus") {
      setaddproduk_qty(addproduk_qty + 1);
    } else if (type === "min") {
      if (addproduk_qty > 1) {
        setaddproduk_qty(addproduk_qty - 1);
      }
    }
  }

  async function openaddmodalbarcode(e: any) {
    if (e.target.value.length >= 12) {
      let text = e.target.value;
      const data = text.split(".");
      const scan_id_produk = data[0];
      const scan_size = data[1];

      const type_customer = getValues("customer");
      const reseller = getValues("reseller");

      getStock(get_idware, data[0]);

      if (
        "SUPER-ADMIN" === Cookies.get("auth_role") ||
        "HEAD-AREA" === Cookies.get("auth_role")
      ) {
      } else {
        getStock(get_idware, data[0]);
      }
      setsizeSelected(data[1])
      setaddmodal_warehouse(cariwaress);
      settypemodal("barcode");

      await axios
        .post(`http://localhost:4000/v1/cekbarcode`, {
          idware: cariwaress,
          idproduct: data[0],
          size: data[1],
        })
        .then(function (response) {
          setcekbarcode(response.data.result);
          setcekbarcodestatus(response.data.result.hasil_cekbarcode);
          if (response.data.result.hasil_cekbarcode === "GO") {
            axios
              .post(`http://localhost:4000/v1/getsizesales`, {
                idware: cariwaress,
                idproduct: data[0],
                size: data[1],
              })
              .then(function (response) {
                setdatasize(response.data.result.datasize);
                setstokReady(response.data.result.get_stokready);
                setdisplay_id_produk(response.data.result.display_id_produk);
                setdisplay_id_ware(response.data.result.display_id_ware);
                setdisplay_size(response.data.result.display_size);
              });

            setdisplaysvalue(display_size === scan_size && display_id_produk === scan_id_produk ? false : true);

            if (type_customer === "") {
              toast.info(
                "Please Select Type Customer..",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: 2000,
                }
              );
              setbarcode("");
            } else {
              if (type_customer === "Retail") {
                setaddmodal_img(response.data.result.cek_produk[0].img);
                setaddmodal_produk(response.data.result.cek_produk[0].produk);
                setaddmodal_idproduk(response.data.result.cek_produk[0].id_produk);
                setaddmodal_qty(1);
                setaddmodal_submit(false);
                setaddmodalbarcode(true);
                setaddmodal_diskon(0);


                if (type_customer === "Retail") {
                  setaddprodukharga_jual(parseInt(response.data.result.cek_produk[0].n_price) + parseInt(data_upprice_n_price ? data_upprice_n_price : 0));
                } else if (type_customer === "Reseller") {
                  setaddprodukharga_jual(parseInt(response.data.result.cek_produk[0].r_price) + parseInt(data_upprice_r_price ? data_upprice_r_price : 0));
                } else if (type_customer === "Grosir") {
                  setaddprodukharga_jual(parseInt(response.data.result.cek_produk[0].g_price) + parseInt(data_upprice_g_price ? data_upprice_g_price : 0));
                }
              } else {
                if (reseller === "") {
                  toast.info(
                    "Please Select Reseller..",
                    {
                      position: toast.POSITION.TOP_RIGHT,
                      pauseOnHover: false,
                      autoClose: 2000,
                    }
                  );
                  setbarcode("");
                } else {
                  setaddmodal_img(response.data.result.cek_produk[0].img);
                  setaddmodal_produk(response.data.result.cek_produk[0].produk);
                  setaddmodal_idproduk(response.data.result.cek_produk[0].id_produk);
                  setaddmodal_qty(1);
                  setaddmodal_submit(false);
                  setaddmodalbarcode(true);
                  setaddmodal_diskon(0);

                  if (type_customer === "Retail") {
                    setaddprodukharga_jual(parseInt(response.data.result.cek_produk[0].n_price) + parseInt(data_upprice_n_price ? data_upprice_n_price : 0));
                  } else if (type_customer === "Reseller") {
                    setaddprodukharga_jual(parseInt(response.data.result.cek_produk[0].r_price) + parseInt(data_upprice_r_price ? data_upprice_r_price : 0));
                  } else if (type_customer === "Grosir") {
                    setaddprodukharga_jual(parseInt(response.data.result.cek_produk[0].g_price) + parseInt(data_upprice_g_price ? data_upprice_g_price : 0));
                  }
                }
              }
            }
          } else {
            toast.info(
              "This product is not valid..",
              {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
              }
            );
            setbarcode("")
          }
        });
    }
  }



  async function openaddmodal(
    img: any,
    produk: any,
    n_price: any,
    r_price: any,
    g_price: any,
    idproduk: any,
    source: any

  ) {
    const type_customer = getValues("customer");
    const reseller = getValues("reseller");
    setaddmodal_warehouse(cariwaress);
    setWarehouseList([]);
    setModalWare(cariwaress);
    settypemodal("dbclick");
    if (type_customer === "") {
      alert("Mohon Pilih Tipe Customer");
    } else {
      if (type_customer === "Retail") {
        setaddmodal_img(img);
        setaddmodal_produk(produk);
        setaddmodal_idproduk(idproduk);
        setaddmodal_qty(1);
        setaddmodal_submit(true);
        setpilih_warehouse("close");
        setaddmodal(true);
        setaddmodal_diskon(0);
        setaddprodukharga_jual(parseInt(n_price) + parseInt(data_upprice_n_price ? data_upprice_n_price : 0));
        getStock(cariwaress, idproduk);
      } else {
        if (reseller === "") {
          alert("Mohon Pilih Reseller");
        } else {
          setaddmodal_img(img);
          setaddmodal_produk(produk);
          setaddmodal_idproduk(idproduk);
          setaddmodal_qty(1);
          setaddmodal_submit(true);
          setpilih_warehouse("close");
          setaddmodal(true);
          setaddmodal_diskon(0);

          if (type_customer === "Reseller") {
            setaddprodukharga_jual(parseInt(r_price) + parseInt(data_upprice_r_price ? data_upprice_r_price : 0));
          } else if (type_customer === "Grosir") {
            setaddprodukharga_jual(parseInt(g_price) + parseInt(data_upprice_g_price ? data_upprice_g_price : 0));
          }
          getStock(cariwaress, idproduk);
        }
      }
    }


  }

  function openaddmodalexternal(
    img: any,
    produk: any,
    idproduk: any,
    source: any,
    sizeexternal: any,
    sizeexternalqty: any
  ) {
    setaddmodal_img(img);
    setaddmodal_produk(produk);
    setaddmodal_idproduk(idproduk);
    setsizeext(sizeexternal);
    setsizeextqty(sizeexternalqty);
    setsizeSelected(null);
    setaddmodal_qty(1);
    setaddmodal_submit(true);

    setaddmodalexternal(true);
  }

  // const [Reseller, setdatareseller] = React.useState(0);
  const [TotalPembayaran, setTotalPembayaran] = React.useState(0);
  const [TombolTambahOrder, setTombolTambahOrder] = React.useState(false);

  const [v_cash, setv_cash] = React.useState(0);
  const [v_bca, setv_bca] = React.useState(0);
  const [v_qris, setv_qris] = React.useState(0);
  const [print_reseller, setgetreseller] = React.useState("");
  // const [timestampss, blob_print_sales_timestapmp] = React.useState("");



  const onSavesales = async (data: any) => {
    const payment = v_cash + v_bca + v_qris;
    let details: any = [];

    for (let index = 0; index < rowsData.length; index++) {
      details.push(
        {
          produk: rowsData[index]['produk'],
          size: rowsData[index]['size'],
          qty: rowsData[index]['qty'],
          subtotal: parseInt(rowsData[index]['harga_jual']) * parseInt(rowsData[index]['qty']),
          diskon: rowsData[index]['diskon_item'],
        }
      )
    }

    if (rowsData.length < 1) {
      toast.warning("Produk Belum Ditambahkan", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else {
      if (paymentMethod === "PAID") {
        if (payment < grandTotal) {
          toast.warning("Nominal Pembayaran tidak sesuai", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
          });
        } else {
          setaddPayment(false);
          setgetreseller(data.reseller);
          await axios
            .post(`http://localhost:4000/v1/inputsalesretail`, {
              data: rowsData,
              tanggal: date,
              id_store: data.store,
              total_amount: grandTotal,
              reseller: data.reseller,
              customer: data.customer,
              kasir: data.kasir,
              biayalain: BiayaLain,
              diskon_nota: DiskonNota,
              cash: v_cash,
              bca: v_bca,
              qris: v_qris,
              payment_method: paymentMethod,
              status_display: get_displayed,
            })
            .then(function (response) {
              if (response.data.result === "undermodal") {
                toast.warning("Harga Jual Terlalu Rendah", {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: 2000,
                });
                setTombolTambahOrder(false);
              } else {
                if (data.customer === "Retail") {
                  toast.success("Order Ditambahkan", {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                    autoClose: 2000,
                    onClose: () => {
                      blob_print_sales(response.data.result[0].id_invoice)
                    }
                  });
                } else {
                  toast.success("Order Ditambahkan", {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                    autoClose: 2000,
                    onClose: () => {
                      blob_print_sales(response.data.result[0].id_invoice)
                    }
                  });
                }
              }
            });
        }
      } else {
        setaddPayment(false);
        await axios
          .post(`http://localhost:4000/v1/inputsalesretail`, {
            data: rowsData,
            tanggal: date,
            id_store: data.store,
            total_amount: grandTotal,
            reseller: data.reseller,
            customer: data.customer,
            kasir: data.kasir,
            biayalain: BiayaLain,
            diskon_nota: DiskonNota,
            cash: v_cash,
            bca: v_bca,
            qris: v_qris,
            payment_method: paymentMethod,
            status_display: get_displayed,
          })
          .then(function (response) {
            if (response.data.result === "undermodal") {
              toast.warning("Harga Jual Terlalu Rendah", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
              });
              setTombolTambahOrder(false);
            } else {
              toast.success("Order Ditambahkan", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
                onClose: () =>
                  router.replace("/order_reseller/shipping_reseller_pending"),
              });
            }
          });
      }
    }

    async function blob_print_sales(id_invoice: any) {
      await axios
        .post(`https://4mediakreatif.site/print_sales`, {
          data_items: {
            id_invoice: id_invoice,
            store: NameStore,
            address: address,
            tanggal: date,
            payment: "PAID",
            qty: "1",
            grandtotal: grandTotal,
            bca: v_bca,
            cash: v_cash,
            mandiri: "0",
            qris: v_qris,
            timestamp: timestampss,
            users: Cookies.get("auth_name"),
            reseller: print_reseller,
            details: details,
          }
        }, {
          withCredentials: false,
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          //Create a Blob from the PDF Stream
          const file = new Blob(
            [response.data],
            { type: 'application/pdf' });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);

          router.replace("/report/shipping_reseller")
        });
    }
  };

  return (
    <>
      <ToastContainer className="mt-[50px]" />
      <div className="grid grid-cols-[1fr_33%] h-full w-full">
        <div className="h-full flex flex-col">
          {addmodal ? (
            <div className="w-full bg-[#7c7c7c46] h-full z-10 fixed grid grid-cols-[1fr_43%]">
              <div className="mt-[10%] mx-auto w-[70%] h-fit bg-white rounded-lg">
                <div className="text-sm border-b p-3 px-4">
                  <div className="font-medium">
                    {addmodal_produk} | {Rupiah.format(addprodukharga_jual)}
                    {/* {addmodal_warehouse} */}
                  </div>
                </div>

                <div className="grid grid-cols-[40%_1fr]">
                  <div className="p-5 flex items-center">
                    <div>
                      <Image
                        className="w-[100%] h-auto m-auto rounded-lg"
                        src={`http://localhost:4000/public/images/${addmodal_img}`}
                        alt="Picture of the author"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-l p-5 ">
                    <div className="text-sm" style={{ display: isVisible ? "block" : "none" }}>
                      <label>Warehouse:</label>
                      <div className="mt-1 flex flex-wrap items-center justify-end">
                        {/* {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                              "HEAD-AREA" === Cookies.get("auth_role") ? (
                              <>
                                <select
                                  onChange={(e) => getStock(e, "")}
                                  className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                                  placeholder="Pilih Warehouse"
                                >
                                  <option value="">Pilih Warehouse</option>
                                  {list_warehouse}
                                </select>
                                <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                              </>
                            ) : (
                              <> */}
                        {/* Warehouse chips — klik untuk ganti gudang */}
                        {warehouseList.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {warehouseList.map((w) => (
                              <button
                                key={w.id_ware}
                                type="button"
                                onClick={() => getStock(w.id_ware, addmodal_idproduk)}
                                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${modalWare === w.id_ware
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-blue-500 border-blue-400 hover:bg-blue-50"
                                  }`}
                              >
                                {w.warehouse} <span className="opacity-70">({w.total_qty})</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 py-1 px-2 border rounded-lg">
                            {cariwaress_nama}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-sm mt-2">
                      <label>Size:</label>
                      {(function () {
                        if (pilih_warehouse === "close") {
                          return (
                            <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                              Mohon Pilih Warehouse
                            </div>
                          );
                        } else if (pilih_warehouse === "loading") {
                          return (
                            <div className="w-[100%] py-3 text-center border rounded-lg mt-2 flex flex-auto items-center justify-center">
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                              Processing...
                            </div>
                          );
                        } else if (pilih_warehouse === "open") {
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
                        }
                      })()}
                    </div>

                    {/* {datasize[0].id_produk === display_id_produk && datasize[0].id_ware === display_id_ware && datasize[0].size === display_size ? (
                      <> */}
                    <div className="text-sm mt-2" hidden={displaysvalue}>
                      <div className="mb-2">Displays : </div>
                      <div className="text-sm flex flex-wrap items-center">
                        <select
                          onChange={(e) => getdisplayed(e)}
                          className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                        >
                          <option value="display_false">Not Displayed</option>
                          <option value="display_true">Displayed</option>
                        </select>
                        <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5 ml-1 "></i>
                      </div>
                    </div>
                    {/* </>) : null} */}

                    <div className="text-sm mt-2">
                      <div className="mb-2">Qty:</div>
                      <div className="text-sm flex flex-wrap items-center">
                        <button
                          onClick={() => {
                            setQty("min");
                          }}
                          disabled={addmodal_submit}
                          className={`${addmodal_submit === true
                            ? "bg-gray-500"
                            : "bg-blue-500"
                            } text-white w-10 py-2 border rounded font-bold`}
                        >
                          -
                        </button>
                        <div className="font-bold py-2 w-10 text-center border rounded mx-2">
                          {addmodal_qty}
                        </div>
                        <button
                          onClick={() => {
                            setQty("plus");
                          }}
                          disabled={addmodal_submit}
                          className={`${addmodal_submit === true
                            ? "bg-gray-500"
                            : "bg-blue-500"
                            } text-white w-10 py-2 border rounded font-bold`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-sm">
                      <label>Diskon:</label>
                      <div className="mt-1 flex flex-wrap items-center justify-end">
                        <select
                          value={addmodal_diskon}
                          onChange={(e: any) => {
                            setaddmodal_diskon(e.target.value);
                          }}
                          className={`${addmodal_diskon ? "bg-gray-500" : "bg-blue-500"
                            } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                          placeholder="Masukan Diskon"
                        >
                          <option value="0">Masukan Nominal Diskon Item</option>
                          <option value="5000">Rp 5.000</option>
                          <option value="10000">Rp 10.000</option>
                          <option value="15000">Rp 15.000</option>
                          <option value="20000">Rp 20.000</option>
                          <option value="25000">Rp 25.000</option>
                          <option value="30000">Rp 30.000</option>
                          <option value="35000">Rp 35.000</option>
                          <option value="40000">Rp 40.000</option>
                          <option value="45000">Rp 45.000</option>
                          <option value="50000">Rp 50.000</option>
                          <option value="55000">Rp 55.000</option>
                        </select>
                        <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                      </div>
                    </div>



                    <div className="text-sm border-t py-3 mt-5 flex flex-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setaddmodal(false)}
                        className="rounded-lg bg-white hover:bg-gray-300 border-2 h-[45px] w-[100%] text-black "
                      >
                        Close
                      </button>

                      <button
                        onClick={() => {
                          if (addmodal_warehouse === "") {
                            addProduk(
                              addmodal_produk,
                              addmodal_idproduk,
                              sizeSelected,
                              200000,
                              addprodukharga_jual,
                              addmodal_img,
                              addmodal_qty,
                              "Barang Gudang",
                              stokReady,
                              get_idware,
                              addmodal_diskon
                            );
                          } else {
                            addProduk(
                              addmodal_produk,
                              addmodal_idproduk,
                              sizeSelected,
                              200000,
                              addprodukharga_jual,
                              addmodal_img,
                              addmodal_qty,
                              "Barang Gudang",
                              stokReady,
                              addmodal_warehouse,
                              addmodal_diskon
                            );
                          }
                        }}
                        type="button"
                        disabled={addmodal_submit}
                        className={`${addmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-600 hover:bg-blue-800"
                          } rounded-lg  h-[45px] w-[100%] text-white`}
                      >
                        Tambah Ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {addmodalbarcode ? (
            <div className="w-full bg-[#7c7c7c46] h-full z-10 fixed grid grid-cols-[1fr_43%]">
              <div className="mt-[10%] mx-auto w-[70%] h-fit bg-white rounded-lg">
                <div className="text-sm border-b p-3 px-4">
                  <div className="font-medium">
                    {addmodal_produk} | {Rupiah.format(addprodukharga_jual)}
                    {/* {addmodal_warehouse} */}
                  </div>
                </div>

                <div className="grid grid-cols-[40%_1fr]">
                  <div className="p-5 flex items-center">
                    <div>
                      <Image
                        className="w-[100%] h-auto m-auto rounded-lg"
                        src={`http://localhost:4000/public/images/${addmodal_img}`}
                        alt="Picture of the author"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-l p-5 ">
                    <div className="text-sm" style={{ display: isVisible ? "block" : "none" }}>
                      <label>Warehouse:</label>
                      <div className="mt-1 flex flex-wrap items-center justify-end">
                        {/* {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                              "HEAD-AREA" === Cookies.get("auth_role") ? (
                              <>
                                <select
                                  onChange={(e) => getStock(e, "")}
                                  className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                                  placeholder="Pilih Warehouse"
                                >
                                  <option value="">Pilih Warehouse</option>
                                  {list_warehouse}
                                </select>
                                <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                              </>
                            ) : (
                              <> */}
                        {/* Warehouse chips — klik untuk ganti gudang */}
                        {warehouseList.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {warehouseList.map((w) => (
                              <button
                                key={w.id_ware}
                                type="button"
                                onClick={() => getStock(w.id_ware, addmodal_idproduk)}
                                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${modalWare === w.id_ware
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-blue-500 border-blue-400 hover:bg-blue-50"
                                  }`}
                              >
                                {w.warehouse} <span className="opacity-70">({w.total_qty})</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 py-1 px-2 border rounded-lg">
                            {cariwaress_nama}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-sm mt-2">
                      <label>Size:</label>
                      {(function () {
                        if (pilih_warehouse === "close") {
                          return (
                            <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                              Mohon Pilih Warehouse
                            </div>
                          );
                        } else if (pilih_warehouse === "loading") {
                          return (
                            <div className="w-[100%] py-3 text-center border rounded-lg mt-2 flex flex-auto items-center justify-center">
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                              Processing...
                            </div>
                          );
                        } else if (pilih_warehouse === "open") {
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
                        }
                      })()}
                    </div>

                    <div className="text-sm mt-2" hidden={displaysvalue}>
                      <div className="mb-2">Displays : </div>
                      <div className="text-sm flex flex-wrap items-center">
                        <select
                          onChange={(e) => getdisplayed(e)}
                          className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm"
                        >
                          <option value="display_false">Not Displayed</option>
                          <option value="display_true">Displayed</option>
                        </select>
                        <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5 ml-1 "></i>
                      </div>
                    </div>

                    <div className="text-sm mt-2">
                      <div className="mb-2">Qty:</div>
                      <div className="text-sm flex flex-wrap items-center">
                        <button
                          onClick={() => {
                            setQty("min");
                          }}
                          disabled={addmodal_submit}
                          className={`${addmodal_submit === true
                            ? "bg-gray-500"
                            : "bg-blue-500"
                            } text-white w-10 py-2 border rounded font-bold`}
                        >
                          -
                        </button>
                        <div className="font-bold py-2 w-10 text-center border rounded mx-2">
                          {addmodal_qty}
                        </div>
                        <button
                          onClick={() => {
                            setQty("plus");
                          }}
                          disabled={addmodal_submit}
                          className={`${addmodal_submit === true
                            ? "bg-gray-500"
                            : "bg-blue-500"
                            } text-white w-10 py-2 border rounded font-bold`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-sm">
                      <label>Diskon:</label>
                      <div className="mt-1 flex flex-wrap items-center justify-end">
                        <select
                          value={addmodal_diskon}
                          onChange={(e: any) => {
                            setaddmodal_diskon(e.target.value);
                          }}
                          className={`${addmodal_diskon ? "bg-gray-500" : "bg-blue-500"
                            } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                          placeholder="Masukan Diskon"
                        >
                          <option value="">Masukan Nominal Diskon Item</option>
                          <option value="5000">Rp 5.000</option>
                          <option value="10000">Rp 10.000</option>
                          <option value="20000">Rp 20.000</option>
                          <option value="30000">Rp 30.000</option>
                          <option value="40000">Rp 40.000</option>
                          <option value="50000">Rp 50.000</option>
                        </select>
                        <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                      </div>
                    </div>



                    <div className="text-sm border-t py-3 mt-5 flex flex-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setaddmodalbarcode(false)}
                        className="rounded-lg bg-white hover:bg-gray-300 border-2 h-[45px] w-[100%] text-black "
                      >
                        Close
                      </button>

                      <button
                        onClick={() => {
                          if (addmodal_warehouse === "") {
                            scanBarcode(
                              addmodal_idproduk,
                              sizeSelected,
                              get_idware,
                              addmodal_diskon,
                              addmodal_qty,
                              stokReady,
                              addprodukharga_jual,
                            );
                          } else {
                            scanBarcode(
                              addmodal_idproduk,
                              sizeSelected,
                              addmodal_warehouse,
                              addmodal_diskon,
                              addmodal_qty,
                              stokReady,
                              addprodukharga_jual,
                            );
                          }
                        }}
                        type="button"
                        disabled={addmodal_submit}
                        className={`${addmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-600 hover:bg-blue-800"
                          } rounded-lg  h-[45px] w-[100%] text-white`}
                      >
                        Tambah Ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {addmodalexternal ? (
            <div className="w-full bg-[#7c7c7c46] h-full z-10 fixed grid grid-cols-[1fr_43%]">
              <div className="mt-[10%] mx-auto w-[70%] h-fit bg-white rounded-lg">
                <div className="text-sm border-b p-3 px-4">
                  <div className="font-medium">
                    {addmodal_produk} | Size {sizeext}
                  </div>
                </div>

                <div className="grid grid-cols-[40%_1fr]">
                  <div className="p-5 flex items-center">
                    <div>
                      <Image
                        className="w-[100%] h-auto m-auto rounded-lg"
                        src={`http://localhost:4000/public/images/${addmodal_img}`}
                        alt="Picture of the author"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-l p-5 ">
                    <div className="text-sm">
                      <label>Size:</label>
                      <div className="mt-1 grid grid-cols-5 gap-2 text-xs content-start">
                        <div
                          onClick={() => {
                            setsizeSelected(sizeext);
                            setstokReady(parseInt(sizeextqty));
                            setaddmodal_submit(false);
                            setaddmodal_qty(1);
                          }}
                          className={`${sizeSelected === sizeext
                            ? "bg-blue-500 text-white"
                            : "text-blue-500"
                            } font-medium py-2 text-center rounded-lg border border-blue-500 cursor-pointer`}
                        >
                          {sizeext} = {sizeextqty}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm mt-2">
                      <div className="mb-2">Qty:</div>
                      <div className="text-sm flex flex-wrap items-center">
                        <button
                          onClick={() => {
                            setQty("min");
                          }}
                          disabled={addmodal_submit}
                          className={`${addmodal_submit === true
                            ? "bg-gray-500"
                            : "bg-blue-500"
                            } text-white w-10 py-2 border rounded font-bold`}
                        >
                          -
                        </button>
                        <div className="font-bold py-2 w-10 text-center border rounded mx-2">
                          {addmodal_qty}
                        </div>
                        <button
                          onClick={() => {
                            setQty("plus");
                          }}
                          disabled={addmodal_submit}
                          className={`${addmodal_submit === true
                            ? "bg-gray-500"
                            : "bg-blue-500"
                            } text-white w-10 py-2 border rounded font-bold`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-sm border-t py-3 mt-5 flex flex-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setaddmodalexternal(false)}
                        className="rounded-lg bg-white hover:bg-gray-300 border-2 h-[45px] w-[100%] text-black "
                      >
                        Close
                      </button>

                      <button
                        onClick={() => {
                          addProdukEksternal(
                            addmodal_produk,
                            addmodal_idproduk,
                            sizeext,
                            addmodal_qty,
                            "BARANG EXTERNAL",
                            sizeextqty
                          );
                        }}
                        type="button"
                        disabled={addmodal_submit}
                        className={`${addmodal_submit === true
                          ? "bg-gray-500"
                          : "bg-blue-600 hover:bg-blue-800"
                          } rounded-lg  h-[45px] w-[100%] text-white`}
                      >
                        Tambah Ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {addproduk ? (
            <div className="w-full bg-[#7c7c7c46] h-full z-10 fixed grid grid-cols-[1fr_43%]">
              <div className="mt-[10%] mx-auto w-[70%] h-fit bg-white rounded-lg">
                <div className="flex flex-col gap-2 border-l p-5 mt-2">
                  <div className="text-sm">
                    <label>Nama Produk</label>
                    <input
                      onChange={(e) => {
                        setaddproduk_produk(e.target.value);
                      }}
                      value={addproduk_produk}
                      className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                      type="text"
                      placeholder="Masukan Nama Produk"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-1 content-start">
                    <div className="text-sm">
                      <label>Size</label>
                      <input
                        onChange={(e) => {
                          setaddproduk_size(e.target.value);
                        }}
                        value={addproduk_size}
                        className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                        type="text"
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
                          className="w-10 py-2 border border-blue-300 rounded font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          -
                        </button>
                        <div className="font-bold py-2 grow text-center border rounded mx-2">
                          {addproduk_qty}
                        </div>
                        <button
                          onClick={() => {
                            setQtymanual("plus");
                          }}
                          className="w-10 py-2 border border-blue-300 rounded font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-sm">
                      <label>Supplier</label>
                      <div className="mt-2 flex flex-wrap items-center justify-end">
                        <select
                          onChange={(e) => {
                            setaddproduk_supplier(e.target.value);
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

                    <div className="text-sm">
                      <label>Harga Beli</label>
                      <CurrencyInput
                        onChange={(e) => {
                          var values = e.target.value.replace(/\D/g, "");
                          setaddproduk_hargabeli(values);
                        }}
                        defaultValue={0}
                        decimalsLimit={2}
                        groupSeparator="."
                        decimalSeparator=","
                        prefix="Rp "
                        // value={addproduk_hargabeli}
                        className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                        type="text"
                        placeholder="Masukan Harga Beli"
                      />
                    </div>

                    <div className="text-sm">
                      <label>Status Pembayaran</label>
                      <div className="mt-2 flex flex-wrap items-center justify-end">
                        <select
                          onChange={(e) => {
                            setaddproduk_payment(e.target.value);
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
                  </div>

                  <div className="text-sm border-t pt-5 mt-10 flex flex-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setaddproduk(false)}
                      className="rounded-lg bg-white hover:bg-gray-300 border-2 h-[45px] w-[100%] text-black "
                    >
                      Close
                    </button>

                    <button
                      onClick={() => {
                        addProdukluar(
                          addproduk_payment,
                          addproduk_produk,
                          "NOTA",
                          addproduk_size,
                          addproduk_hargabeli,
                          "default",
                          addproduk_qty,
                          "Barang Luar",
                          "nolimit",
                          addproduk_supplier
                        );
                      }}
                      type="button"
                      className="rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] w-[100%] text-white "
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {fixed_store.length != 0 ? (
            <>
              <div className="h-[5%] p-5">
                <span className="text-xl font-bold">Add Sales Offline</span>
              </div>
              {/* <div className="p-5">{JSON.stringify(rowsData)}</div> */}
              <div className="p-5 hidden">{JSON.stringify(watch())}</div>
              <div className="px-4 grid grid-cols-2 gap-3 mb-3 pt-0">
                <div>
                  {/* <span className="font-bold">Tanggal Order</span> */}
                  <div className="rounded-lg ml-auto w-full mt-2 flex flex-row items-center justify-end h-[42px]">
                    <Flatpickr
                      className="text-start h-full rounded-lg w-full bg-white py-2.5 px-5 text-gray-700 focus:outline-none border"
                      value={date}
                      disabled={true}
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

                <div>
                  {/* <span className="font-bold">Store Channel</span> */}
                  <div className="flex flex-wrap items-center mt-2 justify-end">
                    {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                      "HEAD-AREA" === Cookies.get("auth_role") ||
                      "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                      <>
                        <select
                          {...register("store", {
                            required: true,
                            onChange: (e) => {
                              if (e.target.value === "") {
                                setdataproductsales([]);
                              } else {
                                loaddataproductsales("all", e.target.value, Role, area);
                              }
                              setStore(e.target.value);
                              setQuery("all");
                              setQuerySearch("");
                              getupprice(e.target.value, e.target.value, e.target.value);
                              setNameStore(e.target[e.target.selectedIndex].getAttribute('data-namestore'))
                              setbarcode("");
                              getwaress(e.target.value);
                              setRowsData([]);
                              setDiskonNota(0);
                              setBiayaLain(0);
                              settotalQty(0);
                              setValue("customer", "");
                              setValue("reseller", "");
                              setdisplaysvalue(true);
                            },
                          })}
                          className={`${errors.store ? "border-red-400" : ""
                            } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                          placeholder="Pilih Store"
                        >
                          <option value={""}>Select Store Channel</option>
                          {list_store}
                        </select>
                      </>
                    ) : (
                      <>
                        {fixed_store.length != 0 ? (
                          <>
                            <select
                              {...register("store", { required: true })}
                              className={`${errors.store ? "border-red-400" : ""
                                } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                              placeholder="Pilih Store"
                            >
                              {fixed_store}
                            </select>
                          </>
                        ) : (
                          <>
                            <select
                              {...register("store", { required: true })}
                              className={`${errors.store ? "border-red-400" : ""
                                } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                              placeholder="Pilih Store"
                            >
                              <option value="">
                                Only for Retail Store Employees
                              </option>
                            </select>
                          </>
                        )}
                      </>
                    )}
                    <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                  </div>
                  {errors.store && (
                    <div className="text-sm italic">This field is required</div>
                  )}
                </div>
              </div>
              <div className="px-4 grid grid-cols-3 gap-3 mb-4 items-center -mt-1">
                {/* <span className="font-bold">Store Channel</span> */}
                <div className="flex flex-wrap items-center mt-2 justify-end">
                  <select
                    {...register("kasir", {
                      required: true,
                      onChange: () => {
                        setValue("customer", "");
                        setValue("reseller", "");
                      },
                    })}
                    className={`${errors.kasir ? "border-red-400" : ""
                      } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                    placeholder="Pilih kasir"
                  >
                    {/* <option value="">Pilih Kasir</option> */}
                    {list_kasir}
                  </select>
                  <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                </div>
                {errors.kasir && (
                  <div className="text-sm italic">This field is required</div>
                )}

                <div className="flex flex-wrap items-center mt-2 justify-end">
                  <select
                    disabled={getValues("kasir") === "" ? true : false}
                    {...register("customer", {
                      required: true,
                      onChange: () => {
                        setValue("reseller", "");
                        setRowsData([]);
                        setDiskonNota(0);
                        setBiayaLain(0);
                        settotalQty(0);
                        setbarcode("");
                        setdisplaysvalue(true);
                      },
                    })}
                    className={`${errors.customer ? "border-red-400" : ""
                      } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                    placeholder="Select customer"
                  >
                    <option value="">Pilih Customer</option>
                    <option value="Retail">Retail</option>
                    <option value="Reseller">Reseller</option>
                    <option value="Grosir">Grosir</option>
                  </select>
                  <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                </div>
                {errors.customer && (
                  <div className="text-sm italic">This field is required</div>
                )}

                <div className="flex flex-wrap items-center mt-2 justify-end">
                  <input
                    disabled={
                      getValues("customer") != "Retail" &&
                        getValues("customer") != ""
                        ? false
                        : true
                    }
                    {...register("reseller", {
                      required: false,
                      onChange: () => {
                        setbarcode("");
                        setdisplaysvalue(true);
                      },
                    })}
                    className={`${errors.reseller ? "border-red-400" : ""
                      } appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                    placeholder="Masukan Nama Reseller"
                  >
                    {/* <option value="">input Reseller</option>
                    {list_reseller} */}
                  </input>
                  {/* <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i> */}
                </div>
                {errors.reseller && (
                  <div className="text-sm italic">This field is required</div>
                )}
              </div>
              <div className="px-4 flex flex-row gap-3 mb-5 items-center">
                <div className="shadow grow rounded-lg  flex flex-row text-center content-center">
                  <input
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (e.target.value === "") {
                        setQuery("all");
                        loaddataproductsales("all", Store, Role, area);
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
                      if (Query != "all") {
                        loaddataproductsales(Query, Store, Role, area);
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
              </div>
              {(function () {
                if (list_product.length > 0) {
                  return (
                    <div className="px-4 h-[500px] grow grid grid-cols-6 content-start gap-3 overscroll-y-auto overflow-x-hidden scrollbar-none pb-20">
                      {list_product}
                    </div>
                  );
                } else {
                  return (
                    <div className="mx-4 h-[500px] grow pb-20 flex items-center justify-center">
                      <div className="grid grid-flow-row auto-rows-max items-center justify-center text-center gap-1 m-auto">
                        <Image
                          className="w-[70px] h-auto m-auto"
                          src="/open-box.png"
                          alt="Picture of the author"
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={"/open-box.png"}
                        />
                        <span className="text-gray-400">
                          Product does not exist, please select Store..
                        </span>
                      </div>
                    </div>
                  );
                }
              })()}

            </>)
            :
            (<>

            </>)}
        </div>

        {fixed_store.length != 0 ? (
          <>
            <div className="bg-white h-full py-5 px-4 flex flex-col gap-2 z-10">
              <div className="h-[5vh] pb-14 border-b flex flex-wrap items-center gap-3">
                <div className="font-medium text-base">Detail Items</div>
                <div className="grow">
                  <div className="col-span-4 flex flex-wrap items-center justify-end">
                    <input
                      value={barcode}
                      disabled={getValues("store") === "" ? true : false || getValues("customer") === "" ? true : false}
                      onChange={(e) => {
                        openaddmodalbarcode(e);
                        setbarcode(e.target.value)
                        setIsVisible(false);
                      }}
                      className="h-auto bg-white rounded-lg w-full py-2 px-5 pr-12 text-gray-700 focus:outline-none border text-base"
                      type="text"
                      placeholder="Scan Barcode"
                    />
                    <i className="fi fi-rr-barcode-read w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                  </div>
                </div>
              </div>

              <div className="h-[100px] grow overscroll-y-auto overflow-x-hidden scrollbar-none">
                {(function () {
                  if (rowsData.length > 0) {
                    return <>{table_product}</>;
                  } else {
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="grid grid-flow-row auto-rows-max items-center justify-center text-center gap-1">
                          <Image
                            className="w-[70px] h-auto m-auto"
                            src="/open-box.png"
                            alt="Picture of the author"
                            width={100}
                            height={100}
                            placeholder="blur"
                            blurDataURL={"/open-box.png"}
                          />
                          <span className="text-gray-400">
                            No products added yet..
                          </span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              <div className="h-[auto] flex flex-col gap-3 justify-end">
                <div className="grid grid-cols-2 border-b pb-2">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">Items</span>
                  </div>

                  <div className="text-end">
                    <span className="text-sm font-bold">
                      {rowsData.length} (Items)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b pb-2">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">
                      Quantity
                    </span>
                  </div>

                  <div className="text-end">
                    <span className="text-sm font-bold">{totalQty} (Pcs)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">
                      Sub Total
                    </span>
                  </div>

                  <div className="text-end">
                    <label className="text-sm font-bold">Rp</label>
                    <CurrencyInput
                      readOnly={true}
                      //   onChange={(e) => {
                      //     var values = e.target.value.replace(/\D/g, "");
                      //     setTotalPembayaran(parseInt(values));
                      //   }}
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      value={total_hargaJual}
                      className="text-sm font-bold h-auto bg-white w-[65%] py-2 px-5 text-black focus:outline-none border-b border-gray-300"
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">
                      Total Discount Item
                    </span>
                  </div>

                  <div className="text-end">
                    <label className="text-sm font-bold">Rp</label>
                    <CurrencyInput
                      readOnly={true}
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      value={total_diskonItem}
                      className="text-sm font-bold h-auto bg-white w-[65%] py-2 px-5 text-black focus:outline-none border-b border-gray-300"
                      type="text"
                    />
                  </div>
                </div>

                {/* <div className="grid grid-cols-2">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">
                      Other Costs
                    </span>
                  </div>

                  <div className="text-end">
                    <label className="text-sm font-bold">Rp</label>
                    <CurrencyInput
                      onChange={(e) => {
                        var values = e.target.value.replace(/\D/g, "");
                        if (values === "") {
                          setBiayaLain(0);
                        } else {
                          setBiayaLain(parseInt(values));
                        }
                      }}
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      value={BiayaLain}
                      className="text-sm font-bold h-auto bg-white w-[65%] py-2 px-5 text-black focus:outline-none border-b border-gray-300"
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">
                      Discount Nota
                    </span>
                  </div>

                  <div className="text-end">
                    <label className="text-sm font-bold">Rp</label>
                    <CurrencyInput
                      onChange={(e) => {
                        var values = e.target.value.replace(/\D/g, "");
                        if (values === "") {
                          setDiskonNota(0);
                        } else {
                          setDiskonNota(parseInt(values));
                        }
                      }}
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      value={DiskonNota}
                      className="text-sm font-bold h-auto bg-white w-[65%] py-2 px-5 text-black focus:outline-none border-b border-gray-300"
                      type="text"
                    />
                  </div>
                </div> */}

                <div className="grid grid-cols-2 mb-5">
                  <div className="my-auto">
                    <span className="text-sm font-medium text-gray-500">
                      Total Payment
                    </span>
                  </div>

                  <div className="text-end">
                    <label className="text-sm font-bold">Rp</label>
                    <CurrencyInput
                      readOnly={true}
                      //   onChange={(e) => {
                      //     var values = e.target.value.replace(/\D/g, "");
                      //     setTotalPembayaran(parseInt(values));
                      //   }}
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      value={grandTotal}
                      className="text-sm font-bold h-auto bg-white w-[65%] py-2 px-5 text-black focus:outline-none border-b border-gray-300"
                      type="text"
                    />
                  </div>
                </div>

                <button
                  //   onClick={handleSubmit(onSavesales)}
                  onClick={() => {
                    setv_cash(0);
                    setv_bca(0);
                    setv_qris(0);
                    setpaymentMethod("PAID");
                    if (rowsData.length < 1) {
                      alert("belum ada produk di tambahkan");
                    } else {
                      setaddPayment(true);
                    }
                    console.log(rowsData)
                  }}
                  disabled={TombolTambahOrder}
                  type="button"
                  className={`${TombolTambahOrder
                    ? "bg-gray-600"
                    : "bg-lime-600 hover:bg-lime-800"
                    } rounded-lg  h-[50px] w-[100%] text-white gap-2 content-center`}
                >
                  Checkout
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={TombolTambahOrder}
                  className={`${TombolTambahOrder ? "bg-gray-200" : "bg-white hover:bg-gray-300"
                    } rounded-lg  border-2 h-[50px] w-[100%] text-black gap-2 content-center`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>)
          :
          (<>

          </>)}
        {addPayment ? (
          <div className="w-full bg-[#7c7c7c46] h-full z-10 fixed grid grid-cols-[1fr_30%]">
            <div className="mt-[10%] mx-auto w-[70%] h-fit bg-white rounded-lg">
              <div className="text-sm border-b p-3 px-4">
                <div className="font-medium">Payment</div>
              </div>

              <div className="text-center font-bold text-4xl mt-4 text-lime-700">
                {Rupiah.format(grandTotal)}
              </div>
              <div
                className={`${getValues("customer") != "Retail" ? "" : "hidden"
                  } p-5`}
              >
                <span className="font-bold text-md">PAYMENT METHOD</span>
                <select
                  defaultValue={paymentMethod}
                  onChange={(e) => {
                    setv_cash(0);
                    setv_bca(0);
                    setv_qris(0);
                    setpaymentMethod(e.target.value);
                  }}
                  className={`appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-base`}
                  placeholder="Pilih kasir"
                  hidden={true}
                >
                  <option selected value="PAID">
                    PAID
                  </option>
                  {/* <option value="PENDING">PENDING</option> */}
                </select>
              </div>

              {paymentMethod === "PAID" ? (
                <>
                  <div className="flex flex-row">
                    <div className="basis-1/6 text-xl font-bold p-5 text-lime-500 ">
                      <div className="">
                        <Image
                          className="w-[60%] h-[25%] m-auto"
                          src={`http://localhost:4000/public/images/cashnew.png`}
                          alt="Picture of the author"
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={"/box.png"}
                        />
                      </div>
                    </div>
                    <div className="basis-full text-xl font-regular p-5">
                      <CurrencyInput
                        onChange={(e) => {
                          var values = e.target.value.replace(/\D/g, "");
                          if (values === "") {
                            setv_cash(0);
                          } else {
                            setv_cash(parseInt(values));
                          }
                        }}
                        defaultValue={0}
                        decimalsLimit={2}
                        groupSeparator="."
                        decimalSeparator=","
                        value={v_cash}
                        className="h-auto rounded-lg w-full bg-white pl-2 text-gray-700 focus:outline-none border"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div className="basis-1/6 text-xl font-bold p-5 text-blue-600">
                      <div className="">
                        <Image
                          className="w-[60%] h-[25%] m-auto"
                          src={`http://localhost:4000/public/images/logodebit.png`}
                          alt="Picture of the author"
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={"/box.png"}
                        />
                      </div>
                    </div>
                    <div className="basis-full text-xl font-regular p-5">
                      <CurrencyInput
                        onChange={(e) => {
                          var values = e.target.value.replace(/\D/g, "");
                          if (values === "") {
                            setv_bca(0);
                          } else {
                            setv_bca(parseInt(values));
                          }
                        }}
                        defaultValue={0}
                        decimalsLimit={2}
                        groupSeparator="."
                        decimalSeparator=","
                        value={v_bca}
                        className="h-auto rounded-lg w-full bg-white pl-2 text-gray-700 focus:outline-none border"
                        type="text"
                      />
                    </div>
                  </div>
                  {/* <div className="flex flex-row">
                    <div className="basis-1/6 text-xl font-bold p-5 text-cyan-500">
                      <div className="-mt-2">
                        <Image
                          className="w-[40%] h-[25%] m-auto"
                          src={`http://localhost:4000/public/images/qris.jpeg`}
                          alt="Picture of the author"
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={"/box.png"}
                        />
                      </div>
                    </div>
                    <div className="basis-full text-xl font-regular p-5">
                      <CurrencyInput
                        onChange={(e) => {
                          var values = e.target.value.replace(/\D/g, "");
                          if (values === "") {
                            setv_qris(0);
                          } else {
                            setv_qris(parseInt(values));
                          }
                        }}
                        defaultValue={0}
                        decimalsLimit={2}
                        groupSeparator="."
                        decimalSeparator=","
                        value={v_qris}
                        className="h-auto rounded-lg w-full bg-white pl-2 text-gray-700 focus:outline-none border"
                        type="text"
                      />
                    </div>
                  </div> */}
                </>
              ) : null}
              <div className="grid grid-cols-2 p-5">
                <button
                  type="button"
                  onClick={() => {
                    setaddPayment(false);
                  }}
                  className={`bg-red-500 rounded-lg  border-2 h-[50px] w-[100%] gap-2 content-center text-white font-medium`}
                >
                  CANCEL {paymentMethod}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit(onSavesales)}
                  className={`bg-lime-600 rounded-lg  border-2 h-[50px] w-[100%] gap-2 content-center text-white font-medium`}
                >
                  PAY
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
