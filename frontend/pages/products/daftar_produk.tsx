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
import { Button } from "rsuite";
import { scrollTop } from "rsuite/esm/DOMHelper";
import { tree } from "next/dist/build/templates/app-page";
import { clear, log } from "console";
import Select from "react-select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});


export default function DaftarProduk() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_produk, setdataproduk] = useState([]);
  const [total_pages, settotal_pages]: any = useState([]);
  const [show_page, setshow_page]: any = useState(1);
  // const [per_page, setper_page]: any = useState([]);
  const [data_ware, setdataware] = useState([]);
  const [data_ware_edit, setdataware_edit] = useState([]);
  const [data_ware_edit_transfer, setdataware_edit_transfer] = useState([]);
  const [total_produk, setdatatotalproduk] = useState(0);
  const [sum_produk, setdatasumproduk] = useState(0);
  const [data_category, setdatacategory] = useState([]);
  const [data_brand, setdatabrand] = useState([]);
  const [data_supplier, setdatasupplier] = useState([]);
  const [data_production, setdataproduction] = useState([]);
  const [spkDetailListRepeat, setSpkDetailListRepeat] = useState<string[]>([]);
  const [data_historypo, setdatahistorypo] = useState([]);
  const [data_historypo_transfer, setdatahistoryptransfer] = useState([]);
  const [data_so, setdataso] = useState([]);
  const [collapse_name, setcollapse_name] = useState(true);
  const [Urutan, setUrutan] = useState("all");
  const [warehouseApi, setwarehouseapi]: any = useState([]);
  const [SelectwarehouseApi, setSelectwarehouseapi]: any = useState([]);
  const [productapi, setproductapi]: any = useState([]);
  const [stockpromo, setstockpromo]: any = useState([]);
  const [stockpromo_Auto, setstockpromo_Auto]: any = useState([]);
  const [stockpromoside, setstockpromoside]: any = useState([]);
  const [Brand, setBrand] = useState("all");
  const [parameter, setparameter] = useState(null);
  const [data_brand_all, setdatabrand_all] = useState([]);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  async function getbrand() {
    await axios({
      method: "get",
      url: `https://api.gudangsandal.com/v1/getbrand`,
    })
      .then(function (response) {
        setdatabrand(response.data.data_brand);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    loaddataproduk(Warehouse, Query, area, Role, loadmorelimit, Urutan, Brand);
    getwarehouse(Role, area, parameter);
    getcategory();
    getbrand();
    getsupplier();
    gethistoripo();
    gethistoriso();
    getproductAPI();
    getProduction();
  }, []);



  async function getstockpromo(detailvar: any) {
    let rinciansize: any = [];
    const id_ware_list: any = ["WARE-0001", "WARE-0002"];

    detailvar.forEach((item: any) => {
      const { id_produk, size, id_ware, qty } = item;
      if (qty > 0) {
        id_ware_list.forEach((element: any) => {
          rinciansize.push(id_produk + "." + size + "." + element)
        });
      }
    });

    try {
      const warehouseResponse = await axios({
        method: "POST",
        url: "/api/getwarehouse",
        data: {
          request_uri: "/openapi/warehouse/v1/search",
          params: {
            warehouseStatus: "ENABLE",
            warehouseType: "MY_STORE", // disesuaikan dari struktur hasil
          },
        },
      });
      const warehouselist = warehouseResponse.data.data.content;
      // Gabungkan rinciansize dengan warehouselist berdasarkan kode warehouse
      const combined = rinciansize.map((rincian: any) => {
        const parts = rincian.split('.');
        const code = parts[2]; // kode warehouse di posisi ketiga
        const warehouse = warehouselist.find((w: any) => w.code === code);
        return {
          id: warehouse ? warehouse.id : null,
          rincian,
        };
      });
      // console.log("combined", combined);

      const stockPromoPromises = warehouselist.map((warehouse: any) => {
        return { warehouseId: warehouse.id };
      });

      await axios({
        method: "POST",
        url: "/api/getstockpromo",
        data: {
          request_uri: "/openapi/warehouse-inventory/v1/sku/list",
          params: {
            combined: combined,
          },
        },
      })
        .then(function (response) {
          // Aggregate stocks across all warehouses by SKU and size
          const allSizes = ["28", "29", "30", "31", "32", "33", "34", "36", "38", "40"];
          const allSizeLabels = ["XS", "S", "M", "L", "XL", "XXL"];
          interface StockEntry { availableStock: number; promotionStock: number; }
          const aggregated: Record<string, Record<string, StockEntry>> = {};

          // Flatten items from every warehouse and sum stocks
          Object.values(response.data as Record<string, any[]>).flat().forEach(item => {
            const sku = item.masterSku;
            const size = item.size;
            if (!aggregated[sku]) aggregated[sku] = {};
            if (!aggregated[sku][size]) aggregated[sku][size] = { availableStock: 0, promotionStock: 0 };
            aggregated[sku][size].availableStock = item.availableStock;
            aggregated[sku][size].promotionStock += item.promotionStock;
          });

          // Build sizesync array aggregated by SKU
          const sizesync: { masterSku: string; stocks: { size: string; availableStock: number; promotionStock: number; }[] }[] = [];
          Object.entries(aggregated).forEach(([sku, sizeMap]) => {
            // Determine if sizes are numeric or label-based
            const sampleSize = Object.keys(sizeMap)[0];
            const isNumericSize = !isNaN(Number(sampleSize));
            const combinedSizes = isNumericSize ? allSizes : allSizeLabels;
            // Map sizes into sorted stock entries
            const stocks = combinedSizes.map(size => {
              const entry = sizeMap[size] || { availableStock: 0, promotionStock: 0 };
              return { size, availableStock: entry.availableStock, promotionStock: entry.promotionStock };
            }).sort((a, b) => parseInt(a.size) - parseInt(b.size));
            sizesync.push({ masterSku: sku, stocks });
          });
          setstockpromo(sizesync)
        })
        .catch(function (error) {
          console.log(error);
        });

    } catch (error) {
      console.error("Gagal ambil stok promo:", error);
    }
  }

  async function getwarehouseAPI(id_ware: any) {
    console.log("baru", id_ware);

    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/cekarea_sync`,
      data: {
        id_ware: id_ware,
      },
    })
      .then(function (response) {
        const cekAreaResult = response.data.result[0].ip;
        const hasilSplit = cekAreaResult.split(" ");

        axios({
          method: "POST",
          url: "/api/getwarehouse",
          data: {
            request_uri: "/openapi/warehouse/v1/search",
            params: {
              warehouseCode: "001",
              warehouseName: "DefaultWarehouse",
              warehouseStatus: "ENABLE",
              warehouseType: "MY_WAREHOUSE",
            },
          },
        })
          .then(function (response) {
            setwarehouseapi(response.data.data.content);

            const matchedWarehouse = response.data.data.content.filter((item: any) =>
              item.name.toLowerCase().includes(hasilSplit[0].toLowerCase())
            );
            console.log("matchedWarehouse", matchedWarehouse);

            if (matchedWarehouse) {
              setwarehouseapi(matchedWarehouse);
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const list_warehouseAPI: any = [];
  if (!isLoading) {
    warehouseApi.map((shop: any, index: number) => {
      list_warehouseAPI.push(
        <option key={index} value={`${shop.id}#${shop.code}`}>
          {shop.name}
        </option>
      );
    });
  }

  async function getproductAPI() {
    await axios({
      method: "POST",
      url: "/api/getproductListApi",
      data: {
        request_uri: "/openapi/product/master/v1/list",
      },
    })
      .then(function (response) {
        setproductapi(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function loaddataproduk(id_ware: any, query: any, area: any, Role: any, loadmorelimit: any, Urutan: any, Brand: any) {
    // setisLoading(true);
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/getproduk`,
      data: {
        id_ware: id_ware,
        query: query,
        area: area,
        role: Role,
        loadmorelimit: loadmorelimit,
        urutan: Urutan,
        brand: Brand,
      },
    })
      .then(function (response) {
        setdataproduk(response.data.result.datas);
        settotal_pages(response.data.result.total_pages);
        setshow_page(response.data.result.show_page / 20);
        setloadmore(response.data.result.datas.length);
        setdatatotalproduk(response.data.result.total_artikel);
        setdatasumproduk(response.data.result.sum_artikel);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getwarehouse(Role: any, area: any, parameter: any) {
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/getwarehouse_product`,
      data: {
        area: area,
        role: Role,
      },
    })
      .then(function (response) {
        setdataware(response.data.data_warehouse.data_warehouse);
        setdatabrand_all(response.data.data_warehouse.data_brand);

        if (parameter === null) {
          setdataware_edit(response.data.data_warehouse.data_warehouse);
        } else {
          const filteredData = response.data.data_warehouse.data_warehouse.filter(
            (item: any) => item.id_ware !== parameter
          );
          const filteredDataDefect = response.data.data_warehouse.data_warehouse.filter(
            (item: any) => item.id_ware === parameter
          );
          setdataware_edit_transfer(filteredDataDefect);
          setdataware_edit(filteredData);
        }


        if ("SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") || "HEAD-WAREHOUSE" === Cookies.get("auth_role")) {
        } else {
          setValue("Warehouse", response.data.data_warehouse[0].id_ware);
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

  if ("SUPER-ADMIN" === Cookies.get("auth_role")) {
    var [Warehouse, setWarehouse] = useState("all");
  } else if ("HEAD-AREA" === Cookies.get("auth_role") || "HEAD-WAREHOUSE" === Cookies.get("auth_role")) {
    var [Warehouse, setWarehouse] = useState("all_area");
  } else {
    var [Warehouse, setWarehouse] = useState((Cookies.get("auth_store")));
  }

  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [Name, setName] = useState(Cookies.get("auth_name"));
  const [area, setarea] = useState((Cookies.get("auth_store")));
  const [isDisabled, setIsDisabled] = useState(false);

  function querySet(e: any) {
    if (e.target.value === "") {
      setQuery("all");
      loaddataproduk(Warehouse, "all", area, Role, loadmorelimit, Urutan, Brand);
    } else {
      setQuery(e.target.value);
      loaddataproduk(Warehouse, e.target.value, area, Role, loadmorelimit, Urutan, Brand);
    }
  }

  async function keyDown(event: any) {
    if (event.key == 'Enter') {
      if (Query != "all") {
        loaddataproduk(Warehouse, Query, area, Role, 0, Urutan, Brand);
      }
    }
  }

  const [warehouse_so, setwarehouse_so] = useState("");

  const list_warehouse: any = [];
  const list_warehouse_edit: any = [];
  const list_warehouse_edit_transfer: any = [];
  const list_warehouse_so: any = [];
  // const list_warehouse_defect: any = [];

  const [notwarehouse, setnotwarehouse] = useState(null);

  const list_brand_all: any = [];
  if (!isLoading) {
    data_brand_all.map((brand: any, index: number) => {
      list_brand_all.push(
        <option key={index} value={brand.id_area}>
          {brand.brand}
        </option>
      );
    });
  }

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

  if (!isLoading) {
    data_ware_edit.map((data_ware: any, index: number) => {
      list_warehouse_edit.push(
        <option key={index} value={data_ware.id_ware}>
          {data_ware.warehouse}
        </option>
      );
    });

    data_ware_edit_transfer.map((data_ware: any, index: number) => {
      list_warehouse_edit_transfer.push(
        <option key={index} value={data_ware.id_ware}>
          {data_ware.warehouse}
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

  async function getProduction() {
    await axios({
      method: "get",
      url: `https://api.gudangsandal.com/v1/getproduction`,
    })
      .then(function (response) {
        setdataproduction(response.data.result.data_production);
        console.log(response.data.result.data_production)
      })
      .catch(function (error) {
        console.log(error);
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
    // defaultValues: {
    //     edit_produk: '',
    //     edit_brand: '',
    //     edit_kategori: '',
    //     edit_kualitas: '',
    //     edit_harga: '',
    // }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variasi",
  });

  const [showModal, setShowModal] = React.useState(false);
  const [repeatModal, setrepeatModal] = React.useState(false);
  const [editstocksync, seteditstocksync] = React.useState(false);
  const [stockopname, setstockopname] = React.useState(false);
  const [showModalPrintSO, setshowModalPrintSO] = React.useState(false);
  const [transferModal, settransferModal] = React.useState(false);
  const [delModal, setdelModal] = React.useState(false);
  const [editModal, seteditModal] = React.useState(false);
  const [transferdefectModal, settransferdefectModal] = React.useState(false);

  const [id, setid] = React.useState(null);
  const [idware, setidware] = React.useState(null);
  const [img, setimg] = React.useState(null);

  function showeditModal(
    id: any,
    produk: any,
    brand: any,
    kategori: any,
    kualitas: any,
    g_price: any,
    r_price: any,
    n_price: any,
    img: any,
    index: number
  ) {
    setid(id);
    setValue("edit_produk", produk);
    setValue("edit_brand", brand);
    setValue("edit_kategori", kategori);
    setValue("edit_kualitas", kualitas);
    setValue("edit_g_price", g_price);
    setValue("edit_r_price", r_price);
    setValue("edit_n_price", n_price);
    setValue("file", img);
    setShowModal(true);
    setimg(`https://api.gudangsandal.com/public/images/${img}`);
  }

  const onSubmitUpdate = async (data: any) => {
    setisLoading(true)

    let formData = new FormData();
    formData.append("id", id);
    formData.append("edit_produk", data.edit_produk);
    formData.append("edit_brand", data.edit_brand);
    formData.append("edit_quality", data.edit_kualitas);
    formData.append("edit_kategori", data.edit_kategori);
    formData.append("edit_g_price", data.edit_g_price);
    formData.append("edit_r_price", data.edit_r_price);
    formData.append("edit_n_price", data.edit_n_price);
    formData.append("file", selectedImage);
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/editproduk`,
      headers: {
        "content-type": "multipart/form-data",
      },
      data: formData,
    }).then(function (response) {
      loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
      setSelectedImage(null);
      setimg(null);
      setisLoading(false)
      toast.success("Data telah diupdate", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 500,
      });
      resetField("edit_produk");
      resetField("edit_brand");
      resetField("edit_kategori");
      resetField("edit_kualitas");
      resetField("edit_harga");
      resetField("file");
      setShowModal(false);
    });
  };

  const [transferproduct, settransferproduct] = React.useState("");
  const [idtransferproduct, setidtransferproduct] = React.useState("");
  const [waretransferproduct, setwaretransferproduct] = React.useState("");
  const [transferdefectproduct, settransferproductdefect] = React.useState("");
  const [idtransferproductdefect, setidtransferproductdefect] = React.useState("");
  const [waretransferproductdefect, setwaretransferproductdefect] = React.useState("");
  const [DefectModelProduk, setdefectModelProduk] = React.useState("");
  const [DefectModelIDProduk, setdefectModelIDProduk] = React.useState("");
  const [gudangdefectawal, setgudangdefectawal] = React.useState(null);
  const [gudangdefectawal_id_ware, setgudangdefectawal_id_ware] = React.useState(null);

  // ── SPK selection for defect → tb_spk_reject ──────────────────
  const [defectSpkList, setDefectSpkList] = React.useState<any[]>([]);
  const [selectedDefectSpk, setSelectedDefectSpk] = React.useState<any>(null);
  const [defectSpkDetail, setDefectSpkDetail] = React.useState("");
  const [defectSupplier, setDefectSupplier] = React.useState("");
  // ── Tipe defect: "defect" = pindah qty (tb_defect), "defect_reject" = potongan production (tb_spk_reject) ──
  const [defectType, setDefectType] = React.useState<"defect_reject" | "defect">("defect_reject");

  // ── Tipe restock: "production" = konek SPK (wajib id_spk_detail), "manual" = bebas ──
  const [restockType, setRestockType] = React.useState<"production" | "manual">("production");
  const [selectedSpkDetailRepeat, setSelectedSpkDetailRepeat] = React.useState("");

  async function loadDefectSpkList(id_ware: string) {
    try {
      const res = await axios.post("https://api.gudangsandal.com/v1/get_spk_list", { id_ware });
      setDefectSpkList(res.data?.result?.data || []);
    } catch { /* ignore */ }
  }

  const options: any = [];

  if (!isLoading) {
    data_produk.map((produk: any, index: number) => {
      return options.push({
        value: produk.produk + "#" + produk.id_produk,
        // label: produk.produk,
        label: (
          <div className="flex gap-2 py-2 items-center">
            {gudangdefectawal === produk.warehouse[0].warehouse ?
              (
                <>
                  <Image
                    className="rounded border w-[65px] h-auto p-2"
                    src={`https://api.gudangsandal.com/public/images/${produk.img}`}
                    alt="product-1"
                    height="500"
                    width="500"
                    priority
                  />
                  <span>
                    {produk.produk} - Gudang : {gudangdefectawal}
                  </span>
                </>
              ) : null}
          </div>
        ),
      });
    });
  }

  async function showtransferdefectModal(
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
    settransferproductdefect(produk);
    setidtransferproductdefect(id_produk);
    setwaretransferproductdefect(ware);
    setnotwarehouse(ware);
    setgudangdefectawal(gudang_pengirim);
    setgudangdefectawal_id_ware(ware);

    // Reset id_spk_detail input + supplier + defect type (default: Write-Off)
    setDefectSpkDetail("");
    setDefectSupplier("");
    setDefectType("defect_reject");

    clearErrors();
    setValue("defect_transferwaretujuan", "");
    setValue("defect_gudangpengirim", gudang_pengirim);

    await axios
      .post(`https://api.gudangsandal.com/v1/getsizesales`, {
        idware: ware,
        idproduct: id_produk,
      })
      .then(function (response) {
        unregister("variasitransfer");
        setdatasize(response.data.result.datasize);
        settransferdefectModal(true);
      });
  }

  const onSubmitTransferdefect = async (data: any) => {

    setIsDisabled(true);

    if (defectType === "defect_reject") {
      // ── DEFECT REJECT: catat ke tb_spk_reject, tidak pindah stok ──────────────
      if (!defectSpkDetail || !defectSpkDetail.trim()) {
        toast.warning("ID SPK Detail wajib diisi untuk Defect Reject", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1500,
        });
        setIsDisabled(false);
        return;
      }
      if (!defectSupplier) {
        toast.warning("Supplier wajib dipilih untuk Defect Reject", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1500,
        });
        setIsDisabled(false);
        return;
      }

      const rejectList = (data.variasitransferdefect || [])
        .filter((v: any) => Number(v.stok_baru) > 0)
        .map((v: any) => ({ size: v.size, qty_reject: Number(v.stok_baru) }));

      if (rejectList.length === 0) {
        toast.warning("Qty Reject tidak boleh kosong", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1500,
        });
        setIsDisabled(false);
        return;
      }

      const res = await axios.post("https://api.gudangsandal.com/v1/writeoff_reject", {
        id_spk_detail: defectSpkDetail.trim(),
        id_sup: defectSupplier,
        id_produk: idtransferproductdefect,
        id_ware: waretransferproductdefect,
        keterangan: "WRITE-OFF REJECT",
        rejects: rejectList,
        users: Name,
      });
      console.log("res.data", res.data.result.success);

      if (res.data.result.success === false) {
        toast.error(res.data.message || "Data Production tidak matching!", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 4000,
        });
        setIsDisabled(false);
        return;
      } else {
        toast.success("Write-Off berhasil, stok dikurangi dan reject dicatat", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1000,
        });
      }
      loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
      setValue("variasitransferdefect", "");
      settransferdefectModal(false);
      setIsDisabled(false);

    } else {
      // ── DEFECT BIASA: pindah qty ke produk lain (tb_defect) ──────────────────────
      var warehousetujuan = gudangdefectawal_id_ware;

      if (warehousetujuan === "") {
        toast.warning("Gudang Tujuan Tidak Boleh Kosong", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1000,
        });
        setIsDisabled(false);
        return;
      }

      var qty_all = 0;
      var sisastok = "proses";
      for (let index = 0; index < data.variasitransferdefect.length; index++) {
        var hitungsisa = data.variasitransferdefect[index].stok_lama - data.variasitransferdefect[index].stok_baru;
        qty_all = qty_all + parseInt(data.variasitransferdefect[index].stok_baru);
        if (data.variasitransferdefect[index].stok_baru > 0 && hitungsisa < 0) {
          sisastok = "batalkan";
        }
      }

      if (qty_all < 1) {
        toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1000,
        });
        setIsDisabled(false);
      } else if (sisastok === "batalkan") {
        toast.warning("Jumlah Tidak Boleh Melebihi Qty yang Tersedia", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1000,
        });
        setIsDisabled(false);
      } else if (DefectModelIDProduk === "" || DefectModelIDProduk === null) {
        toast.warning("Product Tujuan Tidak Boleh Kosong", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1000,
        });
        setIsDisabled(false);
      } else {
        await axios
          .post(`https://api.gudangsandal.com/v1/transferstokdefect`, {
            idproduk_lama: idtransferproductdefect,
            idproduk_baru: DefectModelIDProduk,
            gudang_pengirim: waretransferproductdefect,
            gudang_tujuan: warehousetujuan,
            variasitransfer: data.variasitransferdefect,
            users: Name,
          })
          .then(function (response) {
            loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
            setValue("variasitransferdefect", "");
          });

        setIsDisabled(false);
        toast.success("Transfer Defect Berhasil", {
          position: toast.POSITION.TOP_RIGHT, pauseOnHover: false, autoClose: 1000,
        });
        settransferdefectModal(false);
      }
    }

  };

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

  // State untuk modal atur notifikasi
  const [showAturNotif, setShowAturNotif] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);


  async function showaturnotif(
    id: any,
    produk: any,
    id_produk: any,
    variation: any,
    ware: any,
    index: number
  ) {
    // Extract only size and qty from variation array
    const simplifiedVariation = variation.map((item: any) => ({
      size: item.size,
      qty: item.qty,
      qty_new: 0,
    }));

    setSelectedNotif({
      id,
      produk,
      id_produk,
      variation: simplifiedVariation,
      ware,
      index,
    });
    setShowAturNotif(true); // membuka modal
  }

  const onSubmitAturNotif = async () => {
    try {
      const payload = {
        id_produk: selectedNotif.id_produk,
        id_ware: selectedNotif.ware,
        produk: selectedNotif.produk,
        stok_minimum: selectedNotif.variation
          .filter((item: any) => parseInt(item.qty) !== 0 || item.qty !== '0')
          .map((item: any) => ({
            size: item.size,
            qty: item.qty,
            qty_new: item.qty_new,
          })),
      };

      const response = await axios.post("https://api.gudangsandal.com/v1/setstoknotif_manual", payload);
      console.log("response.data", response.data);

      if (response.data.result.success === true) {
        toast.success("Berhasil Menambahkan Alert Stok.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 500,
        });
      } else {
        toast.error("Gagal menyimpan notifikasi", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 500,
        });
      }

      setShowAturNotif(false);
    } catch (error) {
      console.error("Gagal atur notifikasi:", error);
      toast.error("Terjadi kesalahan saat menyimpan");
    }
  };

  async function showAuto_editstoksync(id_produk: any, detail: any, id_ware: any) {
    let warehouseList: any[] = [];

    const ipResult = await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/cekarea_sync`,
      data: {
        id_ware: id_ware,
      },
    });

    const hasilSplit = ipResult.data.result[0].ip.split(" ");

    const matchedWarehouse = await axios({
      method: "POST",
      url: "/api/getwarehouse",
      data: {
        request_uri: "/openapi/warehouse/v1/search",
        params: {
          warehouseCode: "001",
          warehouseName: "DefaultWarehouse",
          warehouseStatus: "ENABLE",
          warehouseType: "MY_WAREHOUSE",
        },
      },
    }).then((response) => {
      console.log("response.data.data.content", response.data.data.content);


      return response.data.data.content.filter((item: any) =>
        item.name.toLowerCase().includes(hasilSplit[0].toLowerCase())
      );
    });

    if (matchedWarehouse && matchedWarehouse.length > 0) {
      const warehouseListMapped = matchedWarehouse.map((item: any) => ({
        id: item.id,
        code: item.code,
      }));
      warehouseList = warehouseListMapped;
    }
    console.log("warehouseList (id + code):", warehouseList);
    // warehouseList = warehouseList.slice(0, 1);

    // Refactor groupedStockList to be an array of objects instead of an object keyed by warehouse id
    const groupedStockList: any[] = [];

    const product = productapi.find((product: any) => product.spu === id_produk);

    product.variationBriefs.forEach((vars: any) => {
      const productItem = detail.find((d: any) => d.size === vars.sku.split('.')[1]);

      if (productItem) {
        const skuParts = vars.sku.split('.');
        warehouseList.forEach((warehouse: any) => {
          let existing = groupedStockList.find((entry) => entry.warehouseId === warehouse.id);
          if (!existing) {
            existing = { warehouseId: warehouse.id, stockList: [] };
            groupedStockList.push(existing);
          }

          existing.stockList.push({
            masterSku: `${skuParts[0]}.${skuParts[1]}.${warehouse.code}`,
            action: "OVER_WRITE",
            quantity: parseInt(productItem.qty),
            warehouseId: warehouse.id,
            shelfInventoryId: "",
            remark: "from openapi"
          });
        });
      }
    });

    // Print each stockList as { stockList: [...] }
    groupedStockList.forEach((entry) => {
      console.log("✅ stockList:", { stockList: entry.stockList });
    });
    console.log(groupedStockList);


    await axios({
      method: "POST",
      url: "/api/getsyncstock_auto",
      data: {
        request_uri: "/openapi/v1/oms/stock/available-stock/update",
        params: {
          groupedStockList: groupedStockList,
        },
      },
    })
      .then(function (response) {
        console.log("response.data", response.data);
        if (
          response.data.status === "success" &&
          Array.isArray(response.data.results) &&
          response.data.results.every((r: any) => r.response.code === "SUCCESS")
        ) {
          toast.success("✅ Semua stock berhasil disesuaikan ke marketplace", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 750,
          });
        } else {
          toast.error("❌ Beberapa atau seluruh stock gagal disesuaikan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 750,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const onSubmitTransfer = async (data: any) => {
    console.log("data transfer:", data);

    setIsDisabled(true);
    var qty_all = 0;
    for (let index = 0; index < data.variasitransfer.length; index++) {
      var hitungsisa = data.variasitransfer[index].stok_lama - data.variasitransfer[index].stok_baru;
      qty_all = qty_all + parseInt(data.variasitransfer[index].stok_baru);

      if (data.variasitransfer[index].stok_baru > 0) {
        if (hitungsisa < 0) {
          if (hitungsisa < 0) {
            var sisastok = "batalkan";
          } else {
            var sisastok = "proses";
          }
        } else {
          var sisastok = "proses";
        }
      }
    }

    if (qty_all < 1) {
      toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
      setIsDisabled(false);
    } else if (sisastok === "batalkan") {
      toast.warning("Jumlah Tidak Boleh Melebihi Qty yang Tersedia", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 1000,
      });
      setIsDisabled(false);
    } else {
      await axios
        .post(`https://api.gudangsandal.com/v1/transferstok`, {
          idproduk: idtransferproduct,
          gudang_pengirim: waretransferproduct,
          gudang_tujuan: data.transferwaretujuan,
          variasitransfer: data.variasitransfer,
          keterangan: data.keterangan,
          user: Name,
        })
        .then(function (response) {
          loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
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
  const [restockAPI_produk, setrestockAPI_produk] = React.useState("");
  const [restockAPI_id_produk, setrestockAPI_id_produk] = React.useState("");
  const [restockAPI_id_ware, setrestockAPI_id_ware] = React.useState("");
  const [datasize, setdatasize] = React.useState([]);
  const [datasize_sync, setdatasize_sync] = React.useState([]);
  const [data_po, setdata_po]: any = React.useState([]);
  const [data_po_sync, setdata_po_sync]: any = React.useState([]);
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

    await axios
      .post(`https://api.gudangsandal.com/v1/stockopname`, {
        data: data,
        users: Name,
      })
      .then(function (response) {
        loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
        unregister("variasirestock");
        setIsDisabled(false);
        toast.success("Repeat berhasil", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 1000,
        });
        setstockopname(false);
      });
    // }
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
    setSpkDetailListRepeat([]);
    setRestockType("production");
    setSelectedSpkDetailRepeat("");

    unregister("variasirestock");

    const [sizeRes, histPoRes, spkDetailRes] = await Promise.all([
      axios.post(`https://api.gudangsandal.com/v1/getsizesales`, { idware: ware, idproduct: id_produk }),
      axios.post(`https://api.gudangsandal.com/v1/gethistoriposelected`, { idware: ware, idproduct: id_produk }),
      axios.post(`https://api.gudangsandal.com/v1/get_spk_detail_list`, { idware: ware, idproduct: id_produk }),
    ]);

    unregister("variasirestock");
    setdatasize(sizeRes.data.result.datasize);
    setdata_po(histPoRes.data.result);
    const detailRows: any[] = spkDetailRes.data.result || [];
    setSpkDetailListRepeat(detailRows.map((r: any) => r.id_spk_detail));

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
      setIsDisabled(false);
      return;
    }

    if (restockType === "production" && !selectedSpkDetailRepeat) {
      toast.warning("ID SPK Detail wajib diisi untuk Restock Production", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });
      setIsDisabled(false);
      return;
    }

    try {
      const response = await axios.post(`https://api.gudangsandal.com/v1/repeatstok`, {
        data: data,
        users: Name,
        restockType: restockType,
        id_spk_detail: restockType === "production" ? selectedSpkDetailRepeat : null,
      });

      if (response.data?.error === "SPK_NOT_MATCHING") {
        toast.error(response.data.message || "Data Production tidak matching!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 3000,
        });
        setIsDisabled(false);
        return;
      }

      loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
      setValue("harga_beli_repeat", null);
      unregister("variasirestock");
      setIsDisabled(false);

      toast.success("Restock berhasil", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 2000,
      });

      setrepeatModal(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Data Production tidak matching!";
      toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 3000,
      });
      setIsDisabled(false);
    }
  };

  async function showeditstocksync(
    id_produk: any,
    id_ware: any,
    produk: any,
    warehouse: any,
    detail: any,
  ) {
    setValue("edit_id_produk", id_produk);
    unregister("variasirestock_sync");
    setrestockAPI_produk(produk);
    setrestockAPI_id_produk(id_produk);
    setrestockAPI_id_ware(id_ware);
    setgudang(warehouse);

    await axios
      .post(`https://api.gudangsandal.com/v1/getsizesales`, {
        idware: id_ware,
        idproduct: id_produk,
      })
      .then(function (response) {
        unregister("variasirestock_sync");
        setdatasize_sync(response.data.result.datasize);
        console.log("datasize", response.data.result.datasize);
      });

    await axios
      .post(`https://api.gudangsandal.com/v1/gethistoriposelected`, {
        idware: id_ware,
        idproduct: id_produk,
      })
      .then(function (response) {
        setdata_po(response.data.result);
        console.log("show var", response.data.result);

        // console.log(response.data.result);
      });

    seteditstocksync(true);

    // setProduk(index);
  }

  const onSubmiteditsync = async (data: any) => {

    const shopId = SelectwarehouseApi.split("#")[0];
    const idWare = SelectwarehouseApi.split("#")[1];
    console.log("shopId 1", shopId);
    console.log("idWare 2", idWare);

    if (SelectwarehouseApi === "non_select" || SelectwarehouseApi.length === 0) {
      toast.warning("Harap pilih warehouse terlebih dahulu", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 750,
      });
    } else {
      const id_produk = data.edit_id_produk;
      const detail = data.variasirestock_sync;

      const product = productapi.find((product: any) => product.spu === id_produk);

      let stockList: any = [];
      product.variationBriefs.forEach((vars: any) => {
        const product = detail.find((details: any) => details.size === vars.sku.split('.')[1]);

        if (product.size === vars.sku.split('.')[1]) {
          const skuParts = vars.sku.split('.');
          stockList.push({
            masterSku: skuParts[0] + "." + skuParts[1] + "." + idWare,
            action: "OVER_WRITE",
            quantity: product.stok_baru,
            warehouseId: shopId,
            shelfInventoryId: "",
            remark: "from openapi",
          });
        }
      });
      console.log("stockList", stockList);

      await axios({
        method: "POST",
        url: "/api/getsyncstock",
        data: {
          request_uri: "/openapi/v1/oms/stock/available-stock/update",
          params: {
            stockList: stockList,
          },
        },
      })
        .then(function (response) {
          console.log("hasil sync", response.data);

          if (response.data.code === "SUCCESS") {
            toast.success("Stock Marketplace Telah Disesuaikan", {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: 750,
            });
          } else {
            toast.error("Stock Marketplace Gagal Disesuaikan", {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: 750,
            });
          }

        })
        .catch(function (error) {
          console.log(error);
        });
      setSelectwarehouseapi("non_select");
      seteditstocksync(false);
      loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
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
      .post(`https://api.gudangsandal.com/v1/deleteproduk`, { id, idware })
      .then(function (response) {
        loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
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

  <style jsx>{`
        input.no-spinner::-webkit-outer-spin-button,
        input.no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input.no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>

  if (!isLoading) {
    var product_counts = data_produk.length;
    var no_urut = 1;
    data_produk.map((data_produk: any, index: any) => {
      return list_produk.push(
        <div key={index} >
          <div className="flex flex-wrap mb-2 group hover:shadow-lg ">
            <div className="bg-white flex flex-row basis-full h-[full] rounded-tl-lg rounded-tr-lg items-center group-hover:drop-shadow-primary transition-filter px-5">
              {/* <div className="grow mr-5">
                {no_urut++}
              </div> */}
              <div className="grow w-[30%] flex flex-row items-center h-full pt-2 pb-1 pl-2">
                {screenSize.width > 1200 ? (
                  <>
                    <div className="aspect-square max-w-[80px] rounded  items-center">
                      <Image
                        className="w-[100%] h-full rounded"
                        src={`https://api.gudangsandal.com/public/images/${data_produk.img}`}
                        alt="product-1"
                        height="500"
                        width="500"
                        priority
                      />
                    </div>
                  </>) : null}
                <div className="flex flex-col ml-2">
                  <div className="text-xs">
                    #{data_produk.id_produk} | {data_produk.brand[0]["brand"]} |  {data_produk.category[0]["category"]}

                    <span>
                      {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                        "HEAD-AREA" === Cookies.get("auth_role") ||
                        "HEAD-WAREHOUSE" === Cookies.get("auth_role") ||
                        "HEAD-STORE" === Cookies.get("auth_role") ||
                        "CASHIER" === Cookies.get("auth_role") ? (
                        <>
                          <button
                            className="text-blue-500 mx-2"
                            onClick={() =>
                              showeditModal(
                                data_produk.id,
                                data_produk.produk,
                                data_produk.id_brand,
                                data_produk.id_category,
                                data_produk.quality,
                                data_produk.g_price,
                                data_produk.r_price,
                                data_produk.n_price,
                                data_produk.img,
                                index
                              )
                            }
                          >
                            <i className="fi fi-rr-edit text-center"></i>
                          </button>
                        </>) : null}
                      {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                        "HEAD-AREA" === Cookies.get("auth_role") ? (
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
                      ) : null}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {data_produk.produk}
                  </div>
                  {/* <div className="text-xs flex flex-row">
                    <div className="basis-1">Warehouse </div> <div className="grow">&nbsp;: {data_produk.warehouse[0].warehouse}</div>

                  </div> */}
                  <div className="text-xs flex flex-row">
                    <div className="basis-16">Grosir</div> <div className="basis-1/2">&nbsp;: {Rupiah.format(parseInt(data_produk.g_price) + parseInt(data_produk.upprice_g_price))}</div>
                  </div>
                  <div className="text-xs flex flex-row">
                    <div className="basis-16"> Reseller</div> <div className="basis-1/2">&nbsp;: {Rupiah.format(parseInt(data_produk.r_price) + parseInt(data_produk.upprice_r_price))}</div>
                  </div>
                  <div className="text-xs mb-1 flex flex-row">
                    <div className="basis-16"> Normal</div> <div className="basis-1/2">&nbsp;: {Rupiah.format(parseInt(data_produk.n_price) + parseInt(data_produk.upprice_n_price))}</div>
                  </div>
                </div>
              </div>
              <div className="basis-1/6 font-bold text-center">
                {data_produk.warehouse[0].warehouse}
              </div>

              <div className="basis-1/6">
                <div className="flex flex-wrap justify-center items-center h-full pt-2 md:pt-4 md:pb-[15px] px-4 ">
                  {/* {data_produk.countqty < 1 ? (
                    <>
                      <button
                        className="cursor-pointer text-red-600 font-bold hover:underline focus:underline"
                      >
                        <i>STOCK 0</i>
                      </button>
                    </>
                  ) : (
                    <> */}
                  <button
                    className={`cursor-pointer ${data_produk.countqty < 1 ? 'text-red-600' : 'text-green-600'} font-medium hover:underline focus:underline`}
                    onClick={() => {
                      toogleActive(index)
                      getstockpromo(data_produk.detail_variation)
                    }}
                  >
                    {data_produk.countqty < 1
                      ? 0
                      : data_produk.countqty}
                  </button>
                  {/* </>
                  )} */}
                </div>
              </div>
              {screenSize.width > 1200 ? (
                <>
                  {/* <div className="basis-1/6 text-center mt-2 mb-1">

                    {
                      "SUPER-ADMIN" === Cookies.get("auth_role") ||
                        "HEAD-AREA" === Cookies.get("auth_role") ? (
                        <>
                          <td className="p-0 pt-2 h-full w-[10%]">
                            <div className="h-full bg-white flex flex-col gap-1 justify-center items-center rounded-tr-lg">
                              <div className="flex flex-warp h-[full] text-xs font-bold gap-4 justify-center items-center px-4 border-b pb-1">
                                <button
                                  className="text-green-500"
                                  onClick={() =>
                                    showrepeatModal(
                                      data_produk.id,
                                      data_produk.produk,
                                      data_produk.id_produk,
                                      data_produk.id_brand,
                                      data_produk.id_category,
                                      data_produk.quality,
                                      data_produk.n_price,
                                      data_produk.img,
                                      data_produk.detail_variation.length,
                                      data_produk.warehouse[0].warehouse,
                                      data_produk.id_ware,
                                      index
                                    )
                                  }
                                >
                                  <i className="fi fi-rr-arrows-repeat text-center mt-1"> </i>
                                  <span className="-mt-2">RESTOCK</span>
                                </button>
                              </div>
                              <div className="flex justify-center items-center mb-0 border-b pb-1">
                                <button
                                  className="text-red-600 text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4"
                                  onClick={() => {
                                    getwarehouse(Role, area, data_produk.id_ware);
                                    showtransferdefectModal(
                                      data_produk.id,
                                      data_produk.produk,
                                      data_produk.id_produk,
                                      data_produk.id_brand,
                                      data_produk.id_category,
                                      data_produk.quality,
                                      data_produk.n_price,
                                      data_produk.img,
                                      data_produk.detail_variation.length,
                                      data_produk.warehouse[0].warehouse,
                                      data_produk.id_ware,
                                      index
                                    )
                                  }}
                                >
                                  <i className="fi fi-rs-move-to-folder-2 text-center mt-1"></i>
                                  <span>DEFECT</span>
                                </button>
                              </div>

                              <button
                                className="text-orange-500 text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4 border-b pb-1"
                                onClick={() =>
                                  showstockopname(
                                    data_produk.id,
                                    data_produk.produk,
                                    data_produk.id_produk,
                                    data_produk.id_brand,
                                    data_produk.id_category,
                                    data_produk.quality,
                                    data_produk.n_price,
                                    data_produk.img,
                                    data_produk.detail_variation.length,
                                    data_produk.warehouse[0].warehouse,
                                    data_produk.id_ware,
                                    index
                                  )
                                }
                              >
                                <i className="fi fi-br-rotate-right text-center mt-1"></i>
                                <div>STOK OPNAME</div>
                              </button>

                              <div className="flex justify-center items-center border-b pb-1 ">
                                <button
                                  className="text-blue-600 text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4"
                                  onClick={() => {
                                    getwarehouse(Role, area, data_produk.id_ware);
                                    showtransferModal(
                                      data_produk.id,
                                      data_produk.produk,
                                      data_produk.id_produk,
                                      data_produk.id_brand,
                                      data_produk.id_category,
                                      data_produk.quality,
                                      data_produk.n_price,
                                      data_produk.img,
                                      data_produk.detail_variation.length,
                                      data_produk.warehouse[0].warehouse,
                                      data_produk.id_ware,
                                      index
                                    )
                                  }}
                                >
                                  <i className="fi fi-rr-sign-in-alt text-center mt-1"></i>
                                  <span>TRANSFER</span>
                                </button>
                              </div>

                              <div className="flex justify-center items-center border-b pb-1 mb-2 ">
                                <button
                                  className="text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4 "
                                  onClick={() => {
                                    showaturnotif(
                                      data_produk.id,
                                      data_produk.produk,
                                      data_produk.id_produk,
                                      data_produk.detail_variation,
                                      data_produk.id_ware,
                                      index
                                    )
                                  }
                                  }
                                >
                                  <i className="fi fi-bs-paper-plane text-center text-xl mt-1"></i>
                                  <div className="text-left">
                                    <span>Atur Notif</span>
                                  </div>
                                </button>
                              </div>

                            </div>
                          </td>
                        </>
                      ) : null
                    }

                    {
                      "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                        <>

                          {data_produk.id_ware === Cookies.get("auth_store") ? (
                            <>
                              <div className="p-0 pt-2  h-full bg-white flex flex-col gap-1 justify-center items-center  rounded-tr-lg">
                                <div className="flex flex-warp h-[full] text-xs font-bold gap-4 justify-center items-center px-4 border-b pb-1">

                                  <button
                                    className="text-green-500"
                                    onClick={() =>
                                      showrepeatModal(
                                        data_produk.id,
                                        data_produk.produk,
                                        data_produk.id_produk,
                                        data_produk.id_brand,
                                        data_produk.id_category,
                                        data_produk.quality,
                                        data_produk.n_price,
                                        data_produk.img,
                                        data_produk.detail_variation.length,
                                        data_produk.warehouse[0].warehouse,
                                        data_produk.id_ware,
                                        index
                                      )
                                    }
                                  >
                                    <i className="fi fi-rr-arrows-repeat text-center mt-1"> </i>
                                    <span className="-mt-2">RESTOCK</span>
                                  </button>
                                </div>
                                <div className="flex justify-center items-center mb-0 border-b pb-1">
                                  <button
                                    className="text-red-600 text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4"
                                    onClick={() =>
                                      showtransferdefectModal(
                                        data_produk.id,
                                        data_produk.produk,
                                        data_produk.id_produk,
                                        data_produk.id_brand,
                                        data_produk.id_category,
                                        data_produk.quality,
                                        data_produk.n_price,
                                        data_produk.img,
                                        data_produk.detail_variation.length,
                                        data_produk.warehouse[0].warehouse,
                                        data_produk.id_ware,
                                        index
                                      )
                                    }
                                  >
                                    <i className="fi fi-rs-move-to-folder-2 text-center mt-1"></i>
                                    <span>DEFECT</span>
                                  </button>
                                </div>
                                <button
                                  className="text-orange-500 text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4 border-b pb-1"
                                  onClick={() =>
                                    showstockopname(
                                      data_produk.id,
                                      data_produk.produk,
                                      data_produk.id_produk,
                                      data_produk.id_brand,
                                      data_produk.id_category,
                                      data_produk.quality,
                                      data_produk.n_price,
                                      data_produk.img,
                                      data_produk.detail_variation.length,
                                      data_produk.warehouse[0].warehouse,
                                      data_produk.id_ware,
                                      index
                                    )
                                  }
                                >
                                  <i className="fi fi-br-rotate-right text-center mt-1"></i>
                                  <div>STOK OPNAME</div>
                                </button>
                                <div className="flex justify-center items-center">

                                  <button
                                    className="text-blue-600 text-xs mt-1 font-bold flex flex-warp gap-1 justify-center items-center px-4"
                                    onClick={() =>
                                      showtransferModal(
                                        data_produk.id,
                                        data_produk.produk,
                                        data_produk.id_produk,
                                        data_produk.id_brand,
                                        data_produk.id_category,
                                        data_produk.quality,
                                        data_produk.n_price,
                                        data_produk.img,
                                        data_produk.detail_variation.length,
                                        data_produk.warehouse[0].warehouse,
                                        data_produk.id_ware,
                                        index
                                      )
                                    }
                                  >
                                    <i className="fi fi-rr-sign-in-alt text-center mt-1"></i>
                                    <span>TRANSFER</span>
                                  </button>

                                </div>

                              </div>
                            </>
                          ) :
                            (
                              <>
                                <div className=" p-0 pt-2 h-full bg-white flex flex-col gap-1 justify-center items-center text-center rounded-tr-lg">
                                  <div className="flex flex-warp h-[full] text-xs font-bold gap-4 justify-center items-center px-4 ml-10">
                                    <span className="text-red-600"><i>NO ACCESS</i></span>

                                  </div>
                                </div>
                              </>
                            )}

                        </>
                      ) : null
                    }
                  </div> */}
                </>) : null}
            </div >

          </div>
          <div className="mb-2 group hover:shadow-lg rounded-lg -mt-2  transition-filter">

            <div className=" items-center basis-1/6">
              <Collapse isOpened={openSize === index} >

                <div className="flex justify-center space-x-6 bg-white p-2 rounded-tr-lg border-t-2">
                  {["SUPER-ADMIN", "HEAD-AREA"].includes(Cookies.get("auth_role")) && (
                    <>
                      <button
                        onClick={() => showrepeatModal(
                          data_produk.id, data_produk.produk, data_produk.id_produk,
                          data_produk.id_brand, data_produk.id_category, data_produk.quality,
                          data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                          data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                        )}
                        className="flex flex-col items-center text-green-500 text-xs font-bold"
                      >
                        <i className="fi fi-rr-arrows-repeat text-xl mb-1" />
                        <span>RESTOCK</span>
                      </button>
                      <button
                        onClick={() => {
                          getwarehouse(Role, area, data_produk.id_ware);
                          showtransferdefectModal(
                            data_produk.id, data_produk.produk, data_produk.id_produk,
                            data_produk.id_brand, data_produk.id_category, data_produk.quality,
                            data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                            data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                          );
                        }}
                        className="flex flex-col items-center text-red-600 text-xs font-bold"
                      >
                        <i className="fi fi-rs-move-to-folder-2 text-xl mb-1" />
                        <span>DEFECT</span>
                      </button>
                      <button
                        onClick={() => showstockopname(
                          data_produk.id, data_produk.produk, data_produk.id_produk,
                          data_produk.id_brand, data_produk.id_category, data_produk.quality,
                          data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                          data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                        )}
                        className="flex flex-col items-center text-orange-500 text-xs font-bold"
                      >
                        <i className="fi fi-br-rotate-right text-xl mb-1" />
                        <span>STOK OPNAME</span>
                      </button>
                      <button
                        onClick={() => {
                          getwarehouse(Role, area, data_produk.id_ware);
                          showtransferModal(
                            data_produk.id, data_produk.produk, data_produk.id_produk,
                            data_produk.id_brand, data_produk.id_category, data_produk.quality,
                            data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                            data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                          );
                        }}
                        className="flex flex-col items-center text-blue-600 text-xs font-bold"
                      >
                        <i className="fi fi-rr-sign-in-alt text-xl mb-1" />
                        <span>TRANSFER</span>
                      </button>
                      <button
                        onClick={() => showaturnotif(
                          data_produk.id, data_produk.produk, data_produk.id_produk,
                          data_produk.detail_variation, data_produk.id_ware, index
                        )}
                        className="flex flex-col items-center text-black text-xs font-bold"
                      >
                        <i className="fi fi-rr-bell-ring text-xl mb-1" />
                        <span>Atur Notif</span>
                      </button>
                    </>
                  )}
                  {Cookies.get("auth_role") === "HEAD-WAREHOUSE" && (
                    data_produk.id_ware === Cookies.get("auth_store") ? (
                      <>
                        <button
                          onClick={() => showrepeatModal(
                            data_produk.id, data_produk.produk, data_produk.id_produk,
                            data_produk.id_brand, data_produk.id_category, data_produk.quality,
                            data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                            data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                          )}
                          className="flex flex-col items-center text-green-500 text-xs font-bold"
                        >
                          <i className="fi fi-rr-arrows-repeat text-xl mb-1" />
                          <span>RESTOCK</span>
                        </button>
                        <button
                          onClick={() => showtransferdefectModal(
                            data_produk.id, data_produk.produk, data_produk.id_produk,
                            data_produk.id_brand, data_produk.id_category, data_produk.quality,
                            data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                            data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                          )}
                          className="flex flex-col items-center text-red-600 text-xs font-bold"
                        >
                          <i className="fi fi-rs-move-to-folder-2 text-xl mb-1" />
                          <span>DEFECT</span>
                        </button>
                        <button
                          onClick={() => showstockopname(
                            data_produk.id, data_produk.produk, data_produk.id_produk,
                            data_produk.id_brand, data_produk.id_category, data_produk.quality,
                            data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                            data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                          )}
                          className="flex flex-col items-center text-orange-500 text-xs font-bold"
                        >
                          <i className="fi fi-br-rotate-right text-xl mb-1" />
                          <span>STOK OPNAME</span>
                        </button>
                        <button
                          onClick={() => showtransferModal(
                            data_produk.id, data_produk.produk, data_produk.id_produk,
                            data_produk.id_brand, data_produk.id_category, data_produk.quality,
                            data_produk.n_price, data_produk.img, data_produk.detail_variation.length,
                            data_produk.warehouse[0].warehouse, data_produk.id_ware, index
                          )}
                          className="flex flex-col items-center text-blue-600 text-xs font-bold"
                        >
                          <i className="fi fi-rr-sign-in-alt text-xl mb-1" />
                          <span>TRANSFER</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-red-600 italic">NO ACCESS</span>
                    )
                  )}
                </div>

                <div className="flex flex-row  justify-center ">
                  <div className="border-b-0  rounded-br-lg rounded-bl-lg px-2 py-2 bg-white gap-2 w-[100%] border-t-2 mb-2">
                    <div className="flex flex-row">
                      <span className="pr-2 w-[80px]">Real Stok : </span>
                      {(function (rows: any, i, len) {
                        while (++i <= data_produk.detail_variation.length) {
                          rows.push(
                            <div key={i} className="grow flex flex-row w-[50px] item-center justify-center">
                              {data_produk.detail_variation[i - 1].sizes != null ? (
                                <>
                                  <div
                                    className={`${parseInt(data_produk.detail_variation[i - 1].qty) > 0 && data_produk.detail_variation[i - 1].size === data_produk.sizes
                                      ? "text-lime-600 bg-lime-50"
                                      : data_produk.detail_variation[i - 1].qty === '0'
                                        ? "text-red-600 bg-red-50"
                                        : "text-black"
                                      } font-semibold text-sm grow text-center border rounded-md w-[full]`}
                                  >
                                    {data_produk.detail_variation[i - 1].size} :{" "}
                                    <span
                                      className={`${parseInt(data_produk.detail_variation[i - 1].qty) > 0 && data_produk.detail_variation[i - 1].size === data_produk.sizes
                                        ? "text-lime-600 bg-lime-50"
                                        : data_produk.detail_variation[i - 1].qty === '0'
                                          ? "text-red-600 bg-red-50"
                                          : "text-black"
                                        } font-semibold text-sm grow text-center w-[full] `}
                                    >
                                      {data_produk.detail_variation[i - 1].qty}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={`${parseInt(data_produk.detail_variation[i - 1].qty) > 0 && data_produk.detail_variation[i - 1].size === data_produk.sizes
                                      ? "text-lime-600 bg-lime-50"
                                      : data_produk.detail_variation[i - 1].qty === '0'
                                        ? "text-red-600 bg-red-50"
                                        : "text-black"
                                      } font-semibold text-sm grow text-center border rounded-md w-[full]`}
                                  >
                                    {data_produk.detail_variation[i - 1].size} :{" "}
                                    <span
                                      className={`${parseInt(data_produk.detail_variation[i - 1].qty) > 0 && data_produk.detail_variation[i - 1].size === data_produk.sizes
                                        ? "text-lime-600 bg-lime-50"
                                        : data_produk.detail_variation[i - 1].qty === '0'
                                          ? "text-red-600 bg-red-50"
                                          : "text-black"
                                        } font-semibold text-sm grow text-center w-[full]`}
                                    >
                                      {data_produk.detail_variation[i - 1].qty}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        }
                        return rows;
                      })([], 0, index + 1)}


                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      {(function () {
                        const promoData = stockpromo.find(
                          (promo: any) =>
                            promo.masterSku === data_produk.id_produk
                        );

                        if (!promoData) {
                          return (
                            <div key="notfound" className="text-xs text-red-600 font-semibold">
                              No stock promo found.
                            </div>
                          );
                        }
                        const totalPromo = (promoData.stocks || []).reduce(
                          (sum: number, cur: any) => sum + (cur.promotionStock || 0), 0
                        );
                        if (totalPromo === 0) {
                          return (
                            <div key="notfound" className="text-xs text-red-600 font-semibold text-center">
                              No stock promo found.
                            </div>
                          );
                        }

                        const stocks = promoData.stocks || [];
                        return (
                          <>
                            <div className="flex flex-row mb-2 mt-1">
                              <span className="pr-2 w-[80px]">Promosi :</span>
                              {stocks.map((current: any, index: number) => (
                                <div
                                  key={`promo-${index}`}
                                  className="grow flex flex-row w-[50px] items-center justify-center"
                                >
                                  <div
                                    className={`${current.promotionStock === 0
                                      ? "text-red-600 bg-red-50"
                                      : "text-black"
                                      } font-semibold text-sm grow text-center border rounded-md w-full`}
                                  >
                                    <span
                                      className={`${current.promotionStock === 0
                                        ? "text-red-600 bg-red-50"
                                        : "text-black"
                                        } font-semibold text-sm grow text-center w-full`}
                                    >
                                      {current.size} : {current.promotionStock}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-row mb-2">
                              <span className="pr-2 w-[80px]">Tersedia : </span>
                              {stocks.map((current: any, index: number) => (
                                <div
                                  key={`avail-${index}`}
                                  className="grow flex flex-row w-[50px] items-center justify-center"
                                >
                                  <div
                                    className={`${current.availableStock === 0
                                      ? "text-red-600 bg-red-50"
                                      : "text-black"
                                      } font-semibold text-sm grow text-center border rounded-md w-full`}
                                  >
                                    <span
                                      className={`${current.availableStock === 0
                                        ? "text-red-600 bg-red-50"
                                        : "text-black"
                                        } font-semibold text-sm grow text-center w-full`}
                                    >
                                      {current.size} : {current.availableStock}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="border-t-2 mt-2 w-[100%] ">
                    </div>
                  </div><br />
                </div>
              </Collapse>
            </div>
          </div>
        </div >
      );
    });
  }



  async function loadmore(e: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `https://api.gudangsandal.com/v1/getproduk`,
      data: {
        id_ware: Warehouse,
        query: Query,
        area: area,
        role: Role,
        loadmorelimit: e,
        urutan: Urutan,
        brand: Brand,
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

  const [hitungdata, sethitungdata] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadmorelimit, setloadmore]: any = useState(0);
  const [nos_count, setno]: any = useState(1);
  const [gopage, setgopage]: any = useState(1);

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
      await axios({
        method: "POST",
        url: `https://api.gudangsandal.com/v1/print_stockopname`,
        data: {
          id_ware: warehouse_so,
        },
      })
        .then(function (response) {
          console.log(response.data.result);
          sethitungdata(response.data.result[0].total);
          blob_so(response.data.result)
          var hitungtotalqty = 0;
          for (let index = 0; index < response.data.result.length; index++) {
            hitungtotalqty = hitungtotalqty + parseInt(response.data.result[index].total_qty);
          }

          toast.warning("Total Data Produk Ada " + response.data.result[0].total + " Produk " + hitungtotalqty + " Pcs" + " & Akan Melakukan Open New Tab Sebanyak " + Math.ceil(response.data.result[0].total / 200) + " Kali", {
            position: toast.POSITION.BOTTOM_CENTER,
            pauseOnHover: true,
            autoClose: 3000,
          });

          setisLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  function chunkArray(array: any[], chunkSize: number): any[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }


  async function blob_so(items: any) {
    const chunkSize = 200; // Tentukan ukuran chunk
    const dataChunks = chunkArray(items, chunkSize);
    console.log(dataChunks);

    for (let i = 0; i < dataChunks.length; i++) {
      const chunk = dataChunks[i];

      await axios
        .post(`https://4mediakreatif.site/print_so_cloth`, {
          items: chunk,
          warehouse: items[0]['warehouse'],
        }, {
          withCredentials: false,
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          //Create a Blob from the PDF Stream
          setTimeout(function () {
            const file = new Blob(
              [response.data],
              { type: 'application/pdf' });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            window.open(fileURL);
          }, 2000);
        })
        .catch(function (error) {
          console.error('Error while sending chunk', error);
        });
    }
  }

  const [massQtyAlert, setMassQtyAlert] = useState<number>(0);

  return (
    <div className="p-2 h-[100%] max-h-full overflow-y-auto">
      {/* <div className="font-bold text-3xl">Products List</div> */}

      {/* <span> {JSON.stringify(datasize)}</span> */}

      <div className="">
        <ToastContainer className="mt-[50px]" />
        {"SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role") ||
          "HEAD-BRAND" === Cookies.get("auth_role") ||
          "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
          <>
            <div className="mt-0 mb-3 ">
              <div className=" flex flex-row mt-0 gap-3 text-black">
                <div className="basis-1/2 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
                  <div className="text-md font-semibold py-4  px-5 ">
                    Total Item
                  </div>
                  <div className="flex flex-row text-left  mt-2">
                    <div className="basis-full text-2xl font-semibold py-0 px-5">
                      {total_produk ? total_produk : 0}
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
                      {sum_produk ? sum_produk : 0}
                    </div>
                    <div className=" basis-auto mt-1 mx-5">
                      <Box className="h-10 w-10 -mt-3 text-black text-right" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="flex flex-wrap items-center content-center mb-3 mt-3 gap-1">

          <div className="shadow grow rounded-lg  flex flex-row text-center content-center">
            <input
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value === "") {
                  setQuery("all");
                  loaddataproduk(Warehouse, "all", area, Role, 0, Urutan, Brand);
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
                  loaddataproduk(Warehouse, Query, area, Role, 0, Urutan, Brand);
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
                    loaddataproduk(Warehouse, Query, area, Role, loadmorelimit - 20, Urutan, e.target.value);
                  }}
                  className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
                >
                  {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                    <>
                      <option value="all">All Brand</option>
                      {list_brand_all}
                    </>
                  ) : null}
                </select>
              </div>
            </>
          ) : null}

          <div className=" grow rounded-lg flex flex-row text-center content-center bg-red-200">
            <select
              value={Warehouse}
              onChange={(e) => {
                setWarehouse(e.target.value);
                loaddataproduk(e.target.value, Query, area, Role, loadmorelimit - 20, Urutan, Brand);
              }}
              className={`appearance-none grow border h-[45px] px-5 text-gray-700 focus:outline-none rounded-lg`}>
              {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                <>
                  <option value="all">All Warehouse</option>
                  {list_warehouse}
                </>
              ) : "HEAD-AREA" === Cookies.get("auth_role") || "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                <>
                  <option value="all_area">All Warehouse</option>
                  {list_warehouse}
                </>
              ) : (
                <>
                  {list_warehouse}
                </>
              )}
            </select>
          </div>

          <select
            value={Urutan}
            onChange={(e) => {
              setUrutan(e.target.value);
              loaddataproduk(Warehouse, Query, area, Role, 0, e.target.value, Brand);
            }}
            className={`appearance-none grow border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
          >
            <option value="all">Basic Stock</option>
            <option value="asc">Least Stock A - Z</option>
            <option value="desc">Most Stock Z - A</option>
          </select>

          {screenSize.width > 1200 ? (
            <>
              <div className="grow flex flex-row items-center justify-end"
              >
                {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                  "HEAD-AREA" === Cookies.get("auth_role") ||
                  "HEAD-BRAND" === Cookies.get("auth_role") ||
                  "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                  <>
                    <button
                      onClick={() => {
                        setwarehouse_so("");
                        setshowModalPrintSO(true);
                      }}
                      type="button"
                      className="ml-3 shadow rounded-lg w-[200px] bg-green-600 hover:bg-green-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center items-center justify-center"
                    >
                      Print Stock Opname<fa.FaBook size={13} className="text-white" />
                    </button>
                  </>
                ) : null}

                {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                  "HEAD-AREA" === Cookies.get("auth_role") ||
                  "HEAD-BRAND" === Cookies.get("auth_role") ||
                  "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
                  <>
                    <Link href="add_produk">
                      <button
                        type="button"
                        className="ml-3 shadow rounded-lg bg-black hover:bg-gray-600 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
                      >
                        Add Product
                        <div className="my-auto">
                          <fa.FaPlus size={13} className="text-white" />
                        </div>
                      </button>
                    </Link>
                  </>
                ) : null}
              </div>
            </>) : null}
        </div>
        <div className="items-center content-center mb-3 mt-3 gap-10 scroll-m-96">
          {"SUPER-ADMIN" === Cookies.get("auth_role") ||
            "HEAD-AREA" === Cookies.get("auth_role") ||
            "HEAD-BRAND" === Cookies.get("auth_role") ||
            "HEAD-WAREHOUSE" === Cookies.get("auth_role") ? (
            <>
              {screenSize.width > 1200 ? (
                <>
                  <div className="bg-[#323232] flex flex-row h-[40px] rounded-lg font-bold text-white items-center px-5">
                    {/* <div className="grow mr-5">No.</div> */}
                    <div className="grow">Product Detail</div>
                    <div className="basis-1/6 text-center">Warehouse</div>
                    <div className="basis-1/6 text-center">Stock</div>
                  </div>
                </>) :
                (<>
                  <div className="bg-[#323232] flex flex-row h-[40px] rounded-lg font-bold text-white items-center px-5">
                    <div className="grow mr-5">No.</div>
                    <div className="basis-8/12">Product Detail</div>
                    <div className="basis-1/6 text-center">Stock</div>
                    {/* <div className="basis-1/6 text-center">Act</div> */}
                  </div>
                </>)}
            </>) : (<>
              {screenSize.width > 1200 ? (
                <>
                  <div className="bg-[#323232] flex flex-row h-[40px] rounded-lg font-bold text-white items-center px-5">
                    {/* <div className="grow mr-5">No.</div> */}
                    <div className="basis-8/12">Product Detail</div>
                    <div className="basis-1/6 text-center">Stock</div>
                    {/* <div className="basis-1/6 text-center">Act</div> */}
                  </div>
                </>) :
                (<>
                  <div className="bg-[#323232] flex flex-row h-[40px] rounded-lg font-bold text-white items-center px-5">
                    {/* <div className="grow mr-5">No.</div> */}
                    <div className="basis-8/12">Product Detail</div>
                    <div className="basis-1/6 text-center">Stock</div>
                    {/* <div className="basis-1/6 text-center">Act</div> */}
                  </div>
                </>)}
            </>)}
        </div>
        <div className="items-center content-center mb-3 mt-3 gap-10">
          {(function () {
            if (product_counts < 1) {
              return (
                <div className="w-[100%] py-3 text-center mt-10">
                  Products are not yet available, please select a warehouse..
                </div>
              );
            } else {
              return list_produk;
            }
          })()}
        </div>

        {
          transferdefectModal ? (
            <>
              <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative mt-[50px] mb-[40px] mx-auto w-[60%]">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                    {/*header*/}
                    <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                      <span className="text-base font-semibold">
                        Defect Stock : {transferdefectproduct}
                      </span>
                    </div>

                    {/* ── Tipe Defect Toggle ── */}
                    <div className="px-6 pt-4 flex gap-3">

                      <button
                        type="button"
                        onClick={() => setDefectType("defect_reject")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${defectType === "defect_reject"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-600 border-gray-300 hover:border-red-400"}`}
                      >
                        ❌ Write-Off
                        <div className="text-[10px] font-normal mt-0.5 opacity-80">Potongan bayar production</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefectType("defect")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${defectType === "defect"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
                      >
                        🔄 Move to Defect
                        <div className="text-[10px] font-normal mt-0.5 opacity-80">Pindah qty ke produk lain</div>
                      </button>
                    </div>

                    {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                    {/*body*/}
                    <div className="p-6 gap-4 flex flex-auto h-[auto]">
                      <div className="w-[33%] text-sm flex flex-col pb-3">
                        <div className="grow">

                          {/* ── ID SPK Detail + Supplier ── hanya tampil untuk Defect Reject (wajib) ── */}
                          {defectType === "defect_reject" && (
                            <div className="text-xs mb-3">
                              <label className="font-semibold text-red-600">
                                ID SPK Detail (wajib) :
                              </label>
                              <input
                                type="text"
                                value={defectSpkDetail}
                                onChange={(e) => setDefectSpkDetail(e.target.value)}
                                placeholder="Wajib isi No. batch / ID SPK Detail..."
                                className="appearance-none border border-red-300 focus:border-red-500 h-[30px] mt-1 w-full pr-3 pl-3 text-gray-700 focus:outline-none rounded-lg"
                              />
                              <label className="font-semibold text-red-600 mt-2 block">
                                Supplier (wajib) :
                              </label>
                              <select
                                value={defectSupplier}
                                onChange={(e) => setDefectSupplier(e.target.value)}
                                className="appearance-none border border-red-300 focus:border-red-500 h-[30px] mt-1 w-full pr-3 pl-3 text-gray-700 focus:outline-none rounded-lg"
                              >
                                <option value="">Pilih Supplier</option>
                                {list_supplier}
                              </select>
                            </div>
                          )}

                          {/* ── Hanya tampil untuk Defect Biasa ── */}
                          {defectType === "defect" && (<>
                            <div className="text-xs mb-3">
                              <label>Produk:</label>
                              <div className="mt-1 flex flex-wrap items-center justify-end">
                                <Select
                                  className="w-full"
                                  options={options}
                                  onChange={(e: any) => {
                                    setdefectModelProduk(e.value.split("#")[0]);
                                    setdefectModelIDProduk(e.value.split("#")[1]);
                                  }}
                                  placeholder="Select Products.."
                                  required={true}
                                />
                              </div>
                            </div>

                            <div className="">
                              <label className="text-xs">Gudang Pengirim</label>
                              <input
                                readOnly
                                {...register("defect_gudangpengirim", { required: true })}
                                className={`${errors.defect_gudangpengirim
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } appearance-none border h-[30px] mt-2 w-[100%] pr-3 pl-5 text-gray-700 focus:outline-none rounded-lg`}
                              ></input>
                            </div>


                            {"HEAD-WAREHOUSE" === Cookies.get("auth_role") ?
                              (<>
                                <div className="mt-3">
                                  <label className="text-xs">Gudang Penerima</label>
                                  <div className="mt-2 flex flex-wrap items-center justify-end">
                                    <select
                                      value={gudangdefectawal}
                                      {...register("defect_transferwaretujuan", {
                                      })}
                                      className={`${errors.defect_transferwaretujuan
                                        ? "border-red-500 border-2"
                                        : "border"
                                        } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                    >
                                      <option value="">{gudangdefectawal}</option>

                                    </select>
                                    <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                  </div>
                                </div>
                              </>
                              )
                              :
                              (
                                <>
                                  <div className="mt-3">
                                    <label className="text-xs">Gudang Penerima</label>
                                    <div className="mt-2 flex flex-wrap items-center justify-end">
                                      <select
                                        {...register("defect_transferwaretujuan", {
                                        })}
                                        className={`${errors.defect_transferwaretujuan
                                          ? "border-red-500 border-2"
                                          : "border"
                                          } appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                      >
                                        <option value="">{gudangdefectawal}</option>
                                      </select>
                                      <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                    </div>
                                  </div>
                                </>
                              )}
                          </>)}

                          {/* ── Info untuk Defect Reject ── */}
                          {defectType === "defect_reject" && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                              <strong>Defect Reject</strong> mencatat qty potongan ke tb_spk_reject.<br />
                              Stok tidak dipindah. Data ini akan masuk ke perhitungan <em>SPK Payment</em> ketika status diubah ke <strong>Sudah Dikirim</strong>.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grow">
                        <table className="table table-auto bg-transparent text-sm w-full">
                          <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                            <tr className="">
                              <th className="py-2 rounded-l-lg">Size</th>
                              <th className="py-2">Stok Gudang</th>
                              <th className="py-2 rounded-r-lg">{defectType === "defect_reject" ? "Qty Reject" : "Stok Transfer"}</th>
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
                                          `variasitransferdefect.${index}.size`,
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
                                        {...register(
                                          `variasitransferdefect.${index}.stok_lama`,
                                          { required: true }
                                        )}
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
                                        //   `variasitransferdefect.${index}.stok_baru`,
                                        //   { required: true }
                                        // )}
                                        {...register(`variasitransferdefect.${index}.stok_baru`,
                                          {
                                            required: true, onChange: (e: any) => {
                                              if (e.target.value === "") {
                                                var n = 0;
                                              } else {
                                                var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                              }
                                              setValue(`variasitransferdefect.${index}.stok_baru`, n)
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
                              settransferdefectModal(false);
                              setValue("variasitransferdefect", "");
                            }}
                          >
                            Close
                          </button>
                          <button
                            className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleSubmit(onSubmitTransferdefect)}
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
          ) : null
        }

        {
          showModal ? (
            <>
              <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                  {/*content*/}
                  {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                    "HEAD-AREA" === Cookies.get("auth_role") ? (
                    <>
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100vh]">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <span className="text-xl font-semibold">Edit Product</span>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex flex-auto">
                          <div className="w-[40%] mr-4">
                            <label className="block mb-2 text-sm font-medium text-black">
                              Photo Product
                            </label>
                            <div className="flex items-center justify-start">
                              <input
                                className="absolute w-0 opacity-0"
                                accept="image/*"
                                type="file"
                                onChange={imageChange}
                                ref={inputRef}
                              />

                              {selectedImage ? (
                                <div className="">
                                  <img
                                    src={URL.createObjectURL(selectedImage)}
                                    className="w-[20rem] h-[20rem] rounded-lg cursor-pointer"
                                    onClick={handleClick}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="aspect-square m-auto w-[20rem] h-[20rem] border rounded-lg cursor-pointer"
                                  onClick={handleClick}
                                >
                                  <img
                                    src={img}
                                    className="w-[100%] h-[100%] rounded-lg cursor-pointer"
                                  />
                                </div>
                              )}
                            </div>

                            {/* <div className="text-xs italic text-gray-500 text-center mt-3">*Klik Foto untuk merubah Foto</div> */}
                          </div>

                          <div className="grow">
                            <div className="">
                              <label className="block mb-2 text-sm font-medium text-black">
                                Nama Produk
                              </label>
                              <input
                                className={`${errors.edit_produk
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                type="text"
                                defaultValue=""
                                {...register("edit_produk", { required: true })}
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
                              >
                                <option value="">Pilih Brand</option>
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
                                Kategori
                              </label>
                              <select
                                {...register("edit_kategori", { required: false })}
                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              >
                                <option value="">Pilih Kategori</option>
                                {list_category}
                              </select>
                              {errors.edit_kategori && (
                                <div className="mt-1 text-sm italic">
                                  This field is required
                                </div>
                              )}
                            </div>

                            <div className="mt-6">
                              <label className="block mb-2 text-sm font-medium text-black">
                                Kualitas
                              </label>
                              <select
                                {...register("edit_kualitas", { required: false })}
                                className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                              >
                                <option value="">Pilih Quality</option>
                                <option value="IMPORT">IMPORT</option>
                                <option value="LOKAL">LOKAL</option>
                                <option value="ORIGINAL">ORIGINAL</option>
                              </select>
                              {errors.edit_kualitas && (
                                <div className="mt-1 text-sm italic">
                                  This field is required
                                </div>
                              )}
                            </div>

                            <div className="mt-6">
                              <label className="block mb-2 text-sm font-medium text-black">
                                Harga Grosir
                              </label>
                              <CurrencyInput
                                className={`${errors.edit_g_price
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                placeholder="Masukan Harga Beli"
                                defaultValue={0}
                                decimalsLimit={2}
                                groupSeparator="."
                                decimalSeparator=","
                                prefix="Rp "
                                {...register("edit_g_price", {
                                  required: true,
                                  // onChange(event) {
                                  //     setValue("harga_beli_repeat", event.target.value.replace(/\D/g, ""))
                                  // },
                                })}
                              />

                              {errors.edit_g_price && (
                                <div className="mt-1 text-sm italic">
                                  This field is required
                                </div>
                              )}

                            </div>

                            <div className="mt-6">
                              <label className="block mb-2 text-sm font-medium text-black">
                                Harga Reseller
                              </label>
                              <CurrencyInput
                                className={`${errors.edit_r_price
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                placeholder="Masukan Harga Beli"
                                defaultValue={0}
                                decimalsLimit={2}
                                groupSeparator="."
                                decimalSeparator=","
                                prefix="Rp "
                                {...register("edit_r_price", {
                                  required: true,
                                  // onChange(event) {
                                  //     setValue("harga_beli_repeat", event.target.value.replace(/\D/g, ""))
                                  // },
                                })}
                              />

                              {errors.edit_r_price && (
                                <div className="mt-1 text-sm italic">
                                  This field is required
                                </div>
                              )}
                            </div>

                            <div className="mt-6">
                              <label className="block mb-2 text-sm font-medium text-black">
                                Harga Normal
                              </label>
                              <CurrencyInput
                                className={`${errors.edit_n_price
                                  ? "border-red-500 border-2"
                                  : "border"
                                  } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                placeholder="Masukan Harga Beli"
                                defaultValue={0}
                                decimalsLimit={2}
                                groupSeparator="."
                                decimalSeparator=","
                                prefix="Rp "
                                {...register("edit_n_price", {
                                  required: true,
                                  // onChange(event) {
                                  //     setValue("harga_beli_repeat", event.target.value.replace(/\D/g, ""))
                                  // },
                                })}
                              />

                              {errors.edit_n_price && (
                                <div className="mt-1 text-sm italic">
                                  This field is required
                                </div>
                              )}
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
                    </>) : (
                    <>
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100vh]">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <span className="text-xl font-semibold">Edit Product</span>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex flex-auto">
                          <div className="w-[40%] mr-4">
                            <label className="block mb-2 text-sm font-medium text-black">
                              Photo Product
                            </label>
                            <div className="flex items-center justify-start">
                              <input
                                className="absolute w-0 opacity-0"
                                accept="image/*"
                                type="file"
                                onChange={imageChange}
                                ref={inputRef}
                              />

                              {selectedImage ? (
                                <div className="">
                                  <img
                                    src={URL.createObjectURL(selectedImage)}
                                    className="w-[20rem] h-[20rem] rounded-lg cursor-pointer"
                                    onClick={handleClick}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="aspect-square m-auto w-[20rem] h-[20rem] border rounded-lg cursor-pointer"
                                  onClick={handleClick}
                                >
                                  <img
                                    src={img}
                                    className="w-[100%] h-[100%] rounded-lg cursor-pointer"
                                  />
                                </div>
                              )}
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
                    </>
                  )}
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null
        }

        {
          repeatModal ? (
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


                        {/* ── ID SPK Detail — hanya muncul saat Restock Production ── */}
                        {restockType === "production" && (
                          <div className="mb-3">
                            <input
                              type="text"
                              value={selectedSpkDetailRepeat}
                              onChange={e => setSelectedSpkDetailRepeat(e.target.value)}
                              placeholder="Masukan ID SPK Detail"
                              className={`border h-[30px] w-full px-3 text-gray-700 focus:outline-none rounded-lg text-sm ${!selectedSpkDetailRepeat ? "border-blue-300" : "border-green-400"
                                }`}
                            />
                          </div>
                        )}

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
                            {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
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
                                          Cookies.get("auth_role") ? (
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
                                        <div className="grid grid-cols-3">
                                          <span>ID SPK</span>
                                          <span className="col-span-2">
                                            : {datapo.id_spk_detail}
                                          </span>
                                        </div>
                                      </div>
                                      {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
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
          ) : null
        }

        {
          transferModal ? (
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
                                {list_warehouse_edit}
                              </select>
                              <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                            </div>
                            {errors.transferwaretujuan && (
                              <div className="mt-1 text-sm italic">
                                This field is required
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <label className="text-xs mb-1 block">Keterangan</label>
                            <textarea
                              {...register("keterangan")}
                              className="appearance-none border h-[100px] w-full px-3 py-2 text-sm text-gray-700 focus:outline-none rounded-lg resize-none"
                              placeholder="Masukkan keterangan tambahan"
                            ></textarea>
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
          ) : null
        }

        {
          delModal ? (
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
                        *Semua data dan Variasi Stok akan ikut terhapus
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

        {
          stockopname ? (
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
          ) : null
        }

        {
          showModalPrintSO ? (
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
          ) : null
        }

        {
          editstocksync ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="mb-[40px] mx-auto w-[25%] ">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none ">
                    {/*header*/}
                    <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t mb-1">
                      <span className="text-base font-semibold ">
                        Restock : {restockAPI_produk} | {gudang}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-red-600 pl-5 italic">
                        *Atur Stock manual ke marketplace..
                      </span>
                    </div>

                    {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                    <div className="flex flex-row p-5 gap-2 -mt-6">

                      <div className="grow p-2 gap-4 flex flex-auto h-[auto] self-center w-full">
                        <div className="w-auto text-sm flex flex-col">

                          <div className="grow mb-2 p-2">
                            <select
                              value={SelectwarehouseApi}
                              onChange={(e) => {
                                setSelectwarehouseapi(e.target.value);
                                // getstockpromo(e.target.value);
                              }}
                              className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                            >
                              <option value="non_select">All Marketplace</option>
                              {list_warehouseAPI}
                            </select>
                          </div>



                          <div className="grow w-full">
                            <table className="table w-full bg-transparent text-sm ">
                              <thead className="bg-black text-white text-xs">
                                <tr className="">
                                  <th className="py-2 rounded-l-lg text-center">Size</th>
                                  <th className="py-2 text-center">Stok Tersedia</th>
                                  <th className="py-2 rounded-r-lg text-center">Stok Baru</th>
                                </tr>
                              </thead>

                              <tbody className="group rounded-lg text-xs">
                                {datasize_sync.map((datasizes: any, index: any) => {
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
                                              `variasirestock_sync.${index}.size`,
                                              { required: true }
                                            )}
                                            className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg text-center"
                                            type="text"
                                          />
                                        </div>
                                      </td>
                                      <td className="pt-2 p-0">
                                        <div className="h-[30px] flex flex-wrap justify-center items-center">
                                          <input
                                            readOnly
                                            defaultValue={datasizes.qty}
                                            {...register(
                                              `variasirestock_sync.${index}.qty`,
                                              { required: true }
                                            )}
                                            className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg text-center"
                                            type="text"
                                          />
                                        </div>
                                      </td>
                                      <td className="pt-2 p-0">
                                        <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                          <input
                                            min={0}
                                            defaultValue={0}
                                            {...register(`variasirestock_sync.${index}.stok_baru`,
                                              {
                                                required: true, onChange: (e: any) => {
                                                  if (e.target.value === "") {
                                                    var n = 0;
                                                  } else {
                                                    var n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                  }
                                                  setValue(`variasirestock_sync.${index}.stok_baru`, n)
                                                }
                                              })}
                                            className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg text-center"
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
                          </div>

                          <div className="h-[10%] mt-8 mb-4 w-full grid grid-cols-2 items-end justify-start">
                            <button
                              className="bg-red-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => {
                                seteditstocksync(false);
                                setSelectwarehouseapi("non_select");
                                setstockpromo([]);
                              }}
                            >
                              Close
                            </button>
                            <button
                              className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={handleSubmit(onSubmiteditsync)}
                              disabled={isDisabled}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>


                      </div>

                      {/* <div className="grow p-2 gap-4 flex flex-auto h-[auto] self-center w-full border-l border-gray-200 bg-gray-50 rounded-r-lg shadow-inner">
                        {stockpromo.length === 0 ? (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-sm">
                            Belum sync
                          </div>
                        ) : (
                          stockpromo.slice(0, 1).map((promo: any) => (
                            <div key={promo.id} className="grow">
                              {stockpromo
                                .filter((promo: any) => promo.masterSku.split('.')[0] === restockAPI_id_produk)
                                .slice(0, 1)
                                .map((promo: any) => (
                                  <div key={promo.masterSku} className="grow">
                                    <>
                                      <div className="border-b-0 flex flex-row rounded-br-lg rounded-bl-lg bg-gray-100 gap-2 w-[100%] mt-2 p-2">
                                        <div className="flex flex-row basis-16">
                                          <div className="grow rounded-lg text-right">
                                            Tersedia :
                                          </div>
                                        </div>
                                        <div className="flex flex-row grow gap-2">
                                          {stockpromo
                                            .filter((varsync: any) => varsync.masterSku.split('.')[0] === restockAPI_id_produk)
                                            .map((varsync: any) => (
                                              <div key={varsync.masterSku} className="basis-1/6">
                                                <div
                                                  className={`${varsync.availableStock === 0
                                                    ? "text-gray-500 bg-gray-200"
                                                    : "text-gray-900"
                                                    } text-xs text-center font-bold border rounded-lg py-1 px-2 shadow-sm`}
                                                >
                                                  {varsync.masterSku.split('.')[1]} : {varsync.availableStock}
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                      <div className="border-b-0 flex flex-row rounded-br-lg rounded-bl-lg bg-gray-100 gap-2 w-[100%] mt-2 p-2">
                                        <div className="flex flex-row basis-16">
                                          <div className="grow rounded-lg text-right">
                                            Promosi :
                                          </div>
                                        </div>
                                        <div className="flex flex-row grow gap-2">
                                          {stockpromo
                                            .filter((varsync: any) => varsync.masterSku.split('.')[0] === restockAPI_id_produk)
                                            .map((varsync: any) => (
                                              <div key={varsync.masterSku} className="basis-1/6">
                                                <div
                                                  className={`${varsync.promotionStock === 0
                                                    ? "text-gray-500 bg-gray-200"
                                                    : "text-gray-900"
                                                    } text-xs text-center font-bold border rounded-lg py-1 px-2 shadow-sm`}
                                                >
                                                  {varsync.masterSku.split('.')[1]} : {varsync.promotionStock}
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                      <div className="border-b-0 flex flex-row rounded-br-lg rounded-bl-lg bg-gray-100 gap-2 w-[100%] mt-2 p-2">
                                        <div className="flex flex-row basis-16">
                                          <div className="grow rounded-lg text-right">
                                            Sisa :
                                          </div>
                                        </div>
                                        <div className="flex flex-row grow gap-2">
                                          {stockpromo
                                            .filter((varsync: any) => varsync.masterSku.split('.')[0] === restockAPI_id_produk)
                                            .map((varsync: any) => (
                                              <div key={varsync.masterSku} className="basis-1/6">
                                                <div
                                                  className={`${varsync.availableStock + varsync.promotionStock === 0
                                                    ? "text-gray-500 bg-gray-200"
                                                    : "text-gray-900"
                                                    } text-xs text-center font-bold border rounded-lg py-1 px-2 shadow-sm`}
                                                >
                                                  {varsync.masterSku.split('.')[1]} : {varsync.availableStock + varsync.promotionStock}
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  </div>
                                ))}
                            </div>
                          ))
                        )}
                      </div> */}

                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null
        }


        {showAturNotif && selectedNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] max-w-xl p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">Atur Notifikasi</h2>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Produk:</span> {selectedNotif.produk}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Jumlah variasi:</span> {selectedNotif.variation.length}
                </p>
              </div>

              <div className="gap-2 mb-4 flex flex-row">

                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-sm grow"
                  onClick={() => {
                    const updatedVariation = selectedNotif.variation.map((item: any) => ({
                      ...item,
                      qty_new: massQtyAlert,
                    }));
                    setSelectedNotif({ ...selectedNotif, variation: updatedVariation });
                  }}
                >
                  Edit Massal
                </button>
                <input
                  type="number"
                  min={0}
                  value={massQtyAlert}
                  onChange={(e) => setMassQtyAlert(parseInt(e.target.value) || 0)}
                  className="border px-2 py-1 rounded-md w-20 text-center basis-1/3"
                  placeholder="Qty Alert"
                />
              </div>
              <div className="mb-6 max-h-[500px] overflow-y-auto border rounded-lg shadow-sm">
                <table className="w-full text-sm text-center">
                  <thead className="bg-gray-100">
                    <tr className="text-center">
                      <th className="py-2 px-2 font-medium text-gray-700 text-center">Size</th>
                      <th className="py-2 px-2 font-medium text-gray-700 text-center">Qty Ready</th>
                      <th className="py-2 px-2 font-medium text-gray-700 text-center">Qty Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedNotif.variation.map((item: any, idx: number) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-2 w-[35%]">{item.size}</td>
                        <td className={`py-2 px-2 w-[35%] ${item.qty === '0' ? "text-red-500" : ""}`}>{item.qty}</td>
                        <td className="py-2 px-2 w-[35%] text-center">
                          <input
                            type="number"
                            min={0}
                            value={item.qty_new}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 0;
                              const updatedVariation = [...selectedNotif.variation];
                              updatedVariation[idx].qty_new = newQty;
                              setSelectedNotif({ ...selectedNotif, variation: updatedVariation });
                            }}
                            onFocus={(e) => e.currentTarget.addEventListener('wheel', handleWheel, { passive: false })}
                            onBlur={(e) => e.currentTarget.removeEventListener('wheel', handleWheel)}
                            style={{
                              WebkitAppearance: 'none',
                              MozAppearance: 'textfield',
                              margin: 0,
                            }}
                            disabled={item.qty_new === '0'}
                            className="border w-full border-gray-300 rounded-md text-center py-1 px-2 text-sm no-spinner"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitAturNotif();
                }}
              >
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAturNotif(false)}
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
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
    </div >

  );
}

// Shared wheel event handler for Atur Notifikasi modal inputs
const handleWheel = (evt: WheelEvent) => evt.preventDefault();

// At the top of the component (inside the function, after existing useState declarations), add:
// const [massQtyAlert, setMassQtyAlert] = useState<number>(0);

