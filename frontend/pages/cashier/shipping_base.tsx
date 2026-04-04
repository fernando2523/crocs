import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import axios from "axios";
import { PDFDocument } from 'pdf-lib';
import {
  compareAsc,
  format,
  subDays,
  lastDayOfMonth,
  startOfMonth,
  startOfWeek,
  lastDayOfWeek,
  startOfYear,
  startOfDay,
  endOfDay,
  parseISO,
  formatISO,
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import Cookies from "js-cookie";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
import { BeakerIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import {
  ChevronLeft,
  ChevronRight,
  ArchiveRestore,
  ArrowBigLeft,
  ArrowBigRight,
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
  PrinterIcon,
  MessageCircleX,
  CircleDashed,
  CircleEllipsis,
  CircleOff,
  CircleSlashed,
  AlertCircle,
  MessageCircleXIcon,
  ClipboardXIcon,
  XCircleIcon,
} from "lucide-react";
import { log } from "util";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import fetch from 'node-fetch';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { ThreeDots } from "react-loader-spinner"; // Import animasi spinner

export default function GetBaseorder() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_order, setsycnorder]: any = useState([]);
  const [countReadytoship, setcountReadytoship]: any = useState(0);
  const [countPending, setcountPending]: any = useState(0);
  const [countProcess, setcountProcess]: any = useState(0);
  const [countDikirim, setcountDikirim]: any = useState(0);
  const [countCancel, setcountCancel]: any = useState(0);
  const [list_getshopid, setgetshopid]: any = useState([]);
  const [totalamount, settotalamount]: any = useState([]);
  const [totalqty, settotalqty]: any = useState([]);
  const [store, setstore]: any = useState("");
  const [data_store, setdatastore] = useState([]);
  const [data_pending, setdatapending] = useState([]);
  const [count_data_pending, setcountdatapending] = useState([]);
  const router = useRouter();

  const [modalaturpengiriman, setmodalaturpengiriman]: any = useState(false);
  const [modalaturpengiriman_massal, setmodalaturpengiriman_massal]: any = useState(false);
  const [openaksiprint, setopenaksiprint]: any = useState(false);
  const [openaksiprint_massal, setopenaksiprint_massal]: any = useState(false);
  const [openaksiprint_data, setopenaksiprint_data]: any = useState(false);
  const [openaksiprint_data_massal, setopenaksiprint_data_massal]: any = useState(false);
  const [modalaturpengiriman_massal_printaja, setmodalaturpengiriman_massal_printaja]: any = useState(false);
  const [modalprint, setmodalprint]: any = useState(false);
  const [modalgetprint, setmodalgetprint]: any = useState(false);
  const [modalgetprintsatuan, setmodalgetprintsatuan]: any = useState(false);
  const [modalaturmassal, setmodalaturmassal]: any = useState(false);
  const [area, setarea] = useState((Cookies.get("auth_store")));
  const [data_brand, setdatabrand] = useState([]);
  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [Brand, setBrand] = useState("all");

  const [more, setmore]: any = useState(false);
  const [nextCursor, setnextCursor]: any = useState([]);
  const [loadMore, setloadMore]: any = useState(false);

  const [totalsubresi, settotalsubresi]: any = useState(0);
  const [dataPrint2, setdataPrint2]: any = useState(0);
  const [totalresiaturmassal, settotalresiaturmassal]: any = useState(0);
  const [rincianresimassal, setrincianresimassal]: any = useState(0);
  const [totalaturmassal, set_totalaturmassal]: any = useState(0);
  const [querymassal, setquerymassal]: any = useState([]);
  const [querysatuan, setquerysatuan]: any = useState([]);
  const [querysatuanakhir_export, setquerysatuanakhir_export]: any = useState([]);
  const [printproviderName, setproviderName]: any = useState([]);

  const [activetab, setActiveTab] = useState("PAID");
  const [tabs, setActiveTab2] = useState("READY_TO_SHIP");
  const { setValue, watch } = useForm();
  const isFetchingRef = useRef(false); // Ref untuk mencegah double fetch

  async function getdataorder(
    date_start: any,
    date_end: any,
    activetab: any,
    Query: any,
    first: any,
    StoreSync: any,
    tabs: any,
    StatusCetak: any,
    filteruser: any,
    area: any,
    Brand: any,
  ) {
    setisLoading(true)
    await axios({
      method: "POST",
      url: "/api/getorder2",
      data: {
        request_uri: "/openapi/v3/oms/order/list",
        params: {
          createSince: date_start,
          createTo: date_end,
          status: activetab,
          query: Query,
          first: first,
          shopIdList: StoreSync,
          tabs: tabs,
          StatusCetak: StatusCetak,
          filteruser: filteruser,
          area: area,
          brand: Brand,
        },
      },
    })
      .then(function (response) {
        console.log(response.data);
        setsycnorder(response.data.data_details_order);
        setmore(response.data.more);
        setnextCursor(response.data.next);
        setcountPending(response.data.tertunda);
        setcountProcess(response.data.lunas);
        setcountReadytoship(response.data.siap_kirim);
        setcountDikirim(response.data.sedang_dikirim);
        setcountCancel(response.data.cancelled);
        settotalamount(response.data.totalamount);
        settotalqty(response.data.totalqty);
        setisLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getstore() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getstore_api`,
    })
      .then(function (response) {
        setdatastore(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getpending() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getpendingapi`,
    })
      .then(function (response) {
        setdatapending(response.data.result.get_pending);
        setcountdatapending(response.data.result.count_pending.length);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getshopid(newbrand: any) {
    let kirim: any = [];
    let bacthstore: any = [];
    try {
      const shopResponse = await axios({
        method: "POST",
        url: "/api/getshopid",
        data: {
          request_uri: "/openapi/shop/v1/list",
        },
      });

      const shopData = shopResponse.data; // Data dari API pertama

      const storeResponse = await axios({
        method: "get",
        url: `http://localhost:4000/v1/getstore_api`,
      });

      const storeData = storeResponse.data.result; // Data dari API kedua

      // Gabungkan data berdasarkan kecocokan nama atau ID
      const mergedData = shopData.map((shop: any) => {
        const matchingStore = storeData.find(
          (store: any) => store.ip === shop.name
        );

        return {
          ...shop,
          externalShopId: matchingStore ? matchingStore.id_store : null,
          externalIdArea: matchingStore ? matchingStore.id_area : null,
          externalIdWare: matchingStore ? matchingStore.id_ware : null,
          externalShopName: matchingStore ? matchingStore.store : null,
          updateAt: matchingStore ? matchingStore.updated_at : null,
          createAt: matchingStore ? matchingStore.created_at : null,
        };
      });

      // Dapatkan role pengguna dari cookies
      const userRole = Cookies.get("auth_role");
      const userBrand = newbrand;

      let filteredData = mergedData;

      if (userRole === "HEAD-AREA") {
        filteredData = mergedData.filter((shop: any) => shop.externalIdArea === Cookies.get("auth_store"));
      } else if (userRole === "SUPER-ADMIN") {
        filteredData = mergedData;
      } else if (userRole === "HEAD-WAREHOUSE") {
        filteredData = mergedData.filter((shop: any) => shop.externalIdWare === Cookies.get("auth_store"));
      } else {
        filteredData = mergedData.filter((shop: any) => shop.externalShopId === Cookies.get("auth_store"));
      }
      if (userBrand === "all") {
        filteredData = mergedData;
      } else {
        filteredData = mergedData.filter((shop: any) => shop.externalIdArea === userBrand);
      }

      setgetshopid(filteredData); // Simpan hasil ke state
    } catch (error) {
      console.error(error);
    }
  }

  async function getbrand(role: any, area: any, Brand: any) {
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
        setdatabrand(response.data.result.data_brand);
      })
      .catch(function (error) {
        console.log(error);
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

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (isFetchingRef.current) return; // Jika sedang fetch, hentikan permintaan berikutnya
      isFetchingRef.current = true; // Tandai bahwa fetch sedang berlangsung

      try {
        await getshopid(Brand);
        await getstore();
        await getpending();
        await getbrand(Role, area, Brand);
        await getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        isFetchingRef.current = false; // Reset setelah selesai fetch
      }
    };

    fetchData();

    return () => {
      abortController.abort(); // Batalkan permintaan jika komponen di-unmount
    };
  }, [activetab, tabs]);

  function activeTab(select: any) {
    setActiveTab(select);
    setsycnorder([]); // Reset sinkronisasi order sebelum melakukan request baru

    let timer = setTimeout(() => {
      setActiveTab2((prevTabs) => {
        getdataorder(date_start, date_end, select, Query, true, StoreSync, prevTabs, StatusCetak, filteruser, area, Brand);
        return prevTabs; // Kembalikan nilai sebelumnya jika tidak diubah
      });
    }, 500); // Beri sedikit delay untuk menghindari request berulang

    return () => clearTimeout(timer); // Pastikan timer dihapus jika komponen berubah
  }
  const [isSyncing, setIsSyncing] = useState(false);

  async function syncmarketplace(currentItemsUtama: any) {
    setIsSyncing(true); // Tampilkan animasi loading

    let datasync: any = [];

    await axios({
      method: "get",
      url: `http://localhost:4000/v1/get_history_massal`,
    })
      .then(function (response) {
        console.log("Response:", response.data.result);

        currentItemsUtama.forEach((item: any) => {
          const matches = response.data.result.filter(
            (resItem: any) => resItem.orderId === item.orderId
          );
          if (matches.length > 0) {
            datasync.push(...matches);
          }
        });

        if (datasync.length > 0) {
          if (channelid != "TOKOPEDIA_ID") {
            const response = axios({
              method: "POST",
              url: "/api/aturshippingmassalmanual",
              data: {
                request_uri: "/openapi/v3/oms/order/rts",
                params: { batch: datasync },
              },
            });
          }
        } else {
          console.log("Tidak ada data yang cocok.");
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    // Mengelompokkan order berdasarkan shopId
    const groupedOrders = currentItemsUtama.reduce((acc: any, order: any) => {
      if (Array.isArray(order.items)) {
        if (!acc[order.shopId]) {
          acc[order.shopId] = [];
        }
        const externalId = order.channelId !== "TOKOPEDIA_ID"
          ? order.externalOrderId
          : order.externalOrderSn.includes("/")
            ? order.externalOrderSn.split("/")[3]
            : order.externalOrderSn;

        if (!acc[order.shopId].includes(externalId)) {
          acc[order.shopId].push(externalId);
        }
      }
      return acc;
    }, {});

    for (const shopId in groupedOrders) {
      datasync.push({
        shopsString: shopId,
        dataExternalOrderId: groupedOrders[shopId],
      });
    }

    await axios({
      method: "POST",
      url: "/api/syncmarketplace",
      data: {
        request_uri: "/openapi/v3/oms/order/sync",
        params: {
          syncDataType: "ORDER_HOT_NORMAL",
          syncAction: "SPECIFIC_ID",
          datasync: datasync,
        },
      },
    })
      .then(function (response) {
        const results = response.data.results;
        const allSuccess = results.every(
          (item: any) => item.response && item.response.code === "SUCCESS"
        );

        if (allSuccess) {
          setTimeout(function () {
            setsycnorder([]);
            getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
            toast.success(`SYNC TELAH SELESAI`, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: 2000,
            });
          }, 1000);
        } else {
          toast.error(`Tidak semua response sukses, silahkan refresh page`, {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
          });
          setTimeout(function () {
            setsycnorder([]);
            getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
          }, 1000);
        }
        setsycnorder([]);
      })
      .catch(function (error) {
        console.log("Error:", error);
      })
      .finally(() => {
        setIsSyncing(false); // Sembunyikan animasi loading setelah proses selesai
      });
  }

  async function showmodal(currentItemsUtama: any) {


    let dataAwal: any = [];
    let channelSet = new Set<string>(); // Use Set to ensure unique entries

    currentItemsUtama.forEach((vars: any) => {
      // 1. Kumpulkan semua data logistics dari vars.logisticsInfos
      let providerNames: string[] = [];
      let trackingNumbers: string[] = [];
      if (Array.isArray(vars.logisticsInfos)) {
        vars.logisticsInfos.forEach((logisticsInfo: any) => {
          // Ambil provider name
          providerNames.push(logisticsInfo.logisticsProviderName);
          // Ambil tracking number jika ada
          if (logisticsInfo.logisticsTrackingNumber) {
            trackingNumbers.push(logisticsInfo.logisticsTrackingNumber);
          }
        });
      }
      // Lakukan deduplikasi untuk menghindari duplikasi
      const uniqueProviderNames = Array.from(new Set(providerNames));
      const uniqueTrackingNumbers = Array.from(new Set(trackingNumbers));

      // 2. Ambil shopName dari list_getshopid berdasarkan shopId
      let shopName = "";
      list_getshopid.forEach((shops: any) => {
        if (shops.shopId === vars.shopId) {
          shopName = shops.name;
        }
      });

      // 3. Pastikan items adalah array, lalu proses order
      if (Array.isArray(vars.items)) {
        // Periksa apakah order (berdasarkan externalOrderId) sudah ada di dataAwal
        const existingIndex = dataAwal.findIndex(
          (entry: any) => entry.externalOrderId === vars.externalOrderId
        );

        if (existingIndex > -1) {
          // Jika order sudah ada, tambahkan items baru (misal jika ada update)
          vars.items.forEach((item: any) => {
            dataAwal[existingIndex].items.push({
              variationName: item.variationName.includes(",")
                ? item.variationName.split(",")[1].trim()
                : item.variationName.trim(),
              productImageUrl: item.productImageUrl,
              productName: item.productName,
              quantity: item.quantity,
              sku: item.masterSku || item.sku,
              spu: (item.masterSku || item.sku || "").split(".")[0],
            });
          });
          // Update flag morethan jika jumlah items > 1
          dataAwal[existingIndex].morethan = vars.items.length > 1 ? "true" : "false";
          // Perbarui data logistics dengan nilai yang sudah didedup
          dataAwal[existingIndex].logisticsProviderName = uniqueProviderNames.join(", ");
          dataAwal[existingIndex].logisticsTrackingNumber = uniqueTrackingNumbers.join(", ");
        } else {
          // Jika order belum ada, buat entri baru dengan semua data yang diperlukan
          dataAwal.push({
            orderId: vars.orderId,
            externalOrderId:
              vars.channelId !== "TOKOPEDIA_ID"
                ? vars.externalOrderId
                : vars.externalOrderSn.includes("/")
                  ? vars.externalOrderSn.split("/")[3]
                  : vars.externalOrderSn,
            externalCreateAt: formatISO(parseISO(vars.externalCreateAt), {
              representation: "date",
            }),
            shopId: vars.shopId,
            totalAmount:
              vars.channelId === "SHOPEE_ID"
                ? vars.paymentInfo.totalAmount
                : vars.channelId === "TOKOPEDIA_ID"
                  ? parseInt(vars.paymentInfo.subTotal) -
                  parseInt(vars.paymentInfo.subTotal) * 0.12
                  : vars.channelId === "TIKTOK_ID"
                    ? parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.175) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.03)
                    : 0,
            channel: vars.channel,
            shopName: shopName,
            // Gunakan nilai deduplikasi di sini
            logisticsProviderName: uniqueProviderNames.join(", "),
            logisticsTrackingNumber: uniqueTrackingNumbers.join(", "),
            externalOrderStatus: vars.externalOrderStatus,
            channelId: vars.channelId,
            items: vars.items.map((item: any) => ({
              variationName: item.variationName.includes(",")
                ? item.variationName.split(",")[1].trim()
                : item.variationName.trim(),
              productImageUrl: item.productImageUrl,
              productName: item.productName,
              quantity: item.quantity,
              sku: item.masterSku || item.sku,
              spu: (item.masterSku || item.sku || "").split(".")[0],
            })),
            morethan: vars.items.length > 1 ? "true" : "false",
          });
        }
      }

      // Tambahkan channelId ke dalam Set (untuk keperluan lain)
      channelSet.add(vars.channelId);
    });

    console.log("dataAwal", dataAwal);

    const channel = Array.from(channelSet);

    const groupedData: Record<string, number> = {};

    let hitungtotalresi: any = [];
    dataAwal.forEach((data: any) => {
      const providerName = data.logisticsProviderName;
      if (groupedData[providerName]) {
        groupedData[providerName] += 1;
      } else {
        groupedData[providerName] = 1;
      }
      hitungtotalresi.push({
        logisticsProviderName: groupedData,
      });
    });
    setchannelidmassal(channel)
    settotalsubresi(hitungtotalresi[0])
    // settotalresiaturmassal(hitungtotalresi[0])
    setrincianresimassal(dataAwal)
    setdataPrint2(dataAwal)
    setmodalgetprint(true)
  }

  async function showmodalsatuan(data: any) {
    let dataArray = Array.isArray(data) ? data : [data]; // Pastikan data selalu array
    let dataAwal: any = [];
    let channelSet = new Set<string>();

    console.log("data satuan", dataArray);

    dataArray.forEach((vars: any) => {
      if (Array.isArray(vars.logisticsInfos)) {
        vars.logisticsInfos.forEach((logisticsInfo: any) => {
          if (Array.isArray(vars.items)) {
            // Periksa apakah externalOrderId sudah ada di dataAwal
            const existingIndex = dataAwal.findIndex((entry: any) => entry.externalOrderId === vars.externalOrderId);

            if (existingIndex > -1) {
              // Jika externalOrderId sudah ada, gabungkan items
              vars.items.forEach((item: any) => {
                dataAwal[existingIndex].items.push({
                  variationName: item.variationName,
                  productImageUrl: item.productImageUrl,
                  productName: item.productName,
                  quantity: item.quantity,
                });
              });

              // Update morethan jika jumlah items lebih dari 1
              dataAwal[existingIndex].morethan = "true";
            } else {
              // Jika externalOrderId belum ada, buat entri baru
              list_getshopid.forEach((shops: any) => {
                if (shops.shopId === vars.shopId) {
                  dataAwal.push({
                    orderId: vars.orderId,
                    externalOrderId: vars.channelId != "TOKOPEDIA_ID"
                      ? vars.externalOrderId : vars.externalOrderSn.includes("/") ? vars.externalOrderSn.split('/')[3] : vars.externalOrderSn,
                    externalCreateAt: formatISO(parseISO(vars.externalCreateAt), { representation: "date" }),
                    shopId: vars.shopId,
                    totalAmount: vars.channelId === "SHOPEE_ID"
                      ? vars.paymentInfo.totalAmount
                      : vars.channelId === "TOKOPEDIA_ID"
                        ? parseInt(vars.paymentInfo.subTotal) - (parseInt(vars.paymentInfo.subTotal) * 0.12)
                        : vars.channelId === "TIKTOK_ID"
                          ? parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.175) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.03)
                          : 0, // Nilai default jika tidak ada channel yang cocok
                    channel: vars.channel,
                    shopName: shops.name,

                    logisticsProviderName: logisticsInfo.logisticsProviderName,
                    externalOrderStatus: vars.externalOrderStatus,
                    logisticsTrackingNumber: logisticsInfo.logisticsTrackingNumber,
                    channelId: vars.channelId,
                    items: vars.items.map((item: any) => ({
                      variationName: item.variationName.includes(",")
                        ? item.variationName.split(',')[1].trim()
                        : item.variationName.trim(),
                      productImageUrl: item.productImageUrl,
                      productName: item.productName,
                      quantity: item.quantity,
                      sku: item.masterSku || item.sku,
                      spu: (item.masterSku || item.sku || "").split(".")[0],
                    })),
                    morethan: vars.items.length > 1 ? "true" : "false", // Tentukan apakah lebih dari 1 item
                  });
                }
              });
            }
          }

        });
      }
      channelSet.add(vars.channelId); // Add channelId to the Set

    });

    const channel = Array.from(channelSet);

    const groupedData: Record<string, number> = {};

    let hitungtotalresi: any = [];
    dataAwal.forEach((data: any) => {
      const providerName = data.logisticsProviderName;
      if (groupedData[providerName]) {
        groupedData[providerName] += 1;
      } else {
        groupedData[providerName] = 1;
      }
      hitungtotalresi.push({
        logisticsProviderName: groupedData,
      });
    });
    setchannelidmassal(channel)
    settotalsubresi(hitungtotalresi[0])
    // settotalresiaturmassal(hitungtotalresi[0])
    setrincianresimassal(dataAwal)
    setdataPrint2(dataAwal)
    setmodalgetprintsatuan(true)
  }

  async function showmodalaturmassal(currentItemsUtama: any) {
    let dataAwal: any = [];
    let channelSet = new Set<string>(); // Use Set to ensure unique entries

    currentItemsUtama.forEach((vars: any) => {
      // 1. Kumpulkan semua providerName dan trackingNumbers dari logisticsInfos
      let providerNames: string[] = [];
      let trackingNumbers: string[] = [];
      if (Array.isArray(vars.logisticsInfos)) {
        vars.logisticsInfos.forEach((logisticsInfo: any) => {
          providerNames.push(logisticsInfo.logisticsProviderName);
          if (logisticsInfo.logisticsTrackingNumber) {
            trackingNumbers.push(logisticsInfo.logisticsTrackingNumber);
          }
        });
      }
      // Deduplikasi: Hanya ambil nilai unik
      const uniqueProviderNames = Array.from(new Set(providerNames));
      const uniqueTrackingNumbers = Array.from(new Set(trackingNumbers));

      // 2. Pastikan items adalah array, lalu proses order
      if (Array.isArray(vars.items)) {
        // Cek apakah order (berdasarkan externalOrderId) sudah ada di dataAwal
        const existingIndex = dataAwal.findIndex(
          (entry: any) => entry.externalOrderId === vars.externalOrderId
        );

        if (existingIndex > -1) {
          // Order sudah ada: tambahkan item baru ke properti items
          vars.items.forEach((item: any) => {
            dataAwal[existingIndex].items.push({
              variationName: item.variationName.includes(",")
                ? item.variationName.split(",")[1].trim()
                : item.variationName.trim(),
              productImageUrl: item.productImageUrl,
              productName: item.productName,
              quantity: item.quantity,
              sku: item.masterSku || item.sku,
              spu: (item.masterSku || item.sku || "").split(".")[0],
            });
          });

          // Update flag morethan jika jumlah items lebih dari 1
          dataAwal[existingIndex].morethan = "true";
          // Perbarui field logistics dengan nilai yang sudah didedup
          dataAwal[existingIndex].logisticsProviderName = uniqueProviderNames.join(", ");
          dataAwal[existingIndex].logisticsTrackingNumber = uniqueTrackingNumbers.join(", ");
        } else {
          // Order belum ada: buat entri baru
          dataAwal.push({
            orderId: vars.orderId,
            externalOrderId:
              vars.channelId !== "TOKOPEDIA_ID"
                ? vars.externalOrderId
                : vars.externalOrderSn.includes("/")
                  ? vars.externalOrderSn.split("/")[3]
                  : vars.externalOrderSn,
            externalCreateAt: formatISO(parseISO(vars.externalCreateAt), {
              representation: "date",
            }),
            shopId: vars.shopId,
            totalAmount:
              vars.channelId === "SHOPEE_ID"
                ? vars.paymentInfo.totalAmount
                : vars.channelId === "TOKOPEDIA_ID"
                  ? parseInt(vars.paymentInfo.subTotal) -
                  parseInt(vars.paymentInfo.subTotal) * 0.12
                  : vars.channelId === "TIKTOK_ID"
                    ? parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.175) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.03)
                    : 0, // Nilai default jika tidak ada channel yang cocok

            // Gabungkan nilai unik dari providerNames dan trackingNumbers
            logisticsProviderName: uniqueProviderNames.join(", "),
            logisticsTrackingNumber: uniqueTrackingNumbers.join(", "),

            externalOrderStatus: vars.externalOrderStatus,
            channelId: vars.channelId,

            // Tambahkan items satu kali saja
            items: vars.items.map((item: any) => ({
              variationName: item.variationName.includes(",")
                ? item.variationName.split(",")[1].trim()
                : item.variationName.trim(),
              productImageUrl: item.productImageUrl,
              productName: item.productName,
              quantity: item.quantity,
              sku: item.masterSku || item.sku,
              spu: (item.masterSku || item.sku || "").split(".")[0],
            })),

            morethan: vars.items.length > 1 ? "true" : "false",
          });
        }
      }
      // Masukkan channelId ke dalam Set (untuk keperluan lain)
      channelSet.add(vars.channelId);
    });

    const channel = Array.from(channelSet);

    const groupedData: Record<string, number> = {};

    let hitungtotalresi: any = [];
    dataAwal.forEach((data: any) => {
      const providerName = data.logisticsProviderName;
      if (groupedData[providerName]) {
        groupedData[providerName] += 1;
      } else {
        groupedData[providerName] = 1;
      }
      hitungtotalresi.push({
        logisticsProviderName: groupedData,
      });
    });
    setchannelidmassal(channel)

    settotalresiaturmassal(hitungtotalresi[0])
    setrincianresimassal(dataAwal)
    setmodalaturmassal(true)
  }

  // async function getprintsatuan(providerName: any, print: any) {
  //   console.log("providerName", providerName);
  //   console.log("print", print);

  //   let dataPrint: any = [];
  //   print.forEach((vars: any) => {
  //     if (vars.logisticsProviderName === providerName) {
  //       dataPrint.push({
  //         orderId: vars.orderId,
  //       });
  //     }
  //   });

  //   let toastId: any;
  //   let elapsedSeconds = 0;
  //   let interval;

  //   try {
  //     // Tampilkan toast saat proses dimulai
  //     toastId = toast.info(`Pdf sedang dibuat, tunggu sebentar... (0 detik)`, {
  //       position: toast.POSITION.TOP_RIGHT,
  //       pauseOnHover: false,
  //       autoClose: false, // Jangan auto-close saat proses berjalan
  //     });

  //     // Perbarui hitungan detik di dalam toast setiap detik
  //     interval = setInterval(() => {
  //       elapsedSeconds += 1;
  //       toast.update(toastId, {
  //         render: `Pdf sedang dibuat, tunggu sebentar... (${elapsedSeconds} detik)`,
  //       });
  //     }, 1000);

  //     const response = await axios({
  //       method: "POST",
  //       url: "/api/getprintmasal",
  //       data: {
  //         request_uri: "/openapi/v3/oms/order/print",
  //         params: {
  //           orderId: dataPrint,
  //           documentType: "SHIPPING_LABEL",
  //         },
  //       },
  //     });
  //     clearInterval(interval); // Hentikan hitungan setelah selesai

  //     if (response.statusText === "OK") {
  //       // Perbarui isi toast setelah sukses
  //       setmodalaturpengiriman_massal_printaja(false)
  //       toast.update(toastId, {
  //         render: `Pdf Berhasil dibuat dalam ${elapsedSeconds} detik`,
  //         type: toast.TYPE.SUCCESS,
  //         autoClose: 750, // Tutup setelah 750ms
  //       });
  //     } else {
  //       // Perbarui isi toast jika gagal
  //       toast.update(toastId, {
  //         render: `Pdf Gagal dibuat dalam ${elapsedSeconds} detik`,
  //         type: toast.TYPE.ERROR,
  //         autoClose: 750, // Tutup setelah 750ms
  //       });
  //     }

  //     console.log("response print", response.data);

  //     if (response.data.mergedPdfUrl) {
  //       window.open(response.data.mergedPdfUrl, "_blank");
  //       const now = new Date();
  //       const datePart = now.toISOString().slice(0, 10);
  //       const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ";");
  //       // **2. Tambahkan opsi untuk mengunduh dengan nama yang diubah**
  //       setTimeout(async () => {
  //         try {
  //           const fileResponse = await axios.get(response.data.mergedPdfUrl, {
  //             responseType: "blob",
  //           });

  //           const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
  //           const link = document.createElement("a");
  //           link.href = url;
  //           link.setAttribute("download", `Label-${providerName}-${datePart + ' ' + timePart}.pdf`); // Nama file yang diinginkan
  //           document.body.appendChild(link);
  //           link.click();
  //           document.body.removeChild(link);
  //           window.URL.revokeObjectURL(url);
  //         } catch (error) {
  //           console.error("Error downloading PDF:", error);
  //         }
  //       }, 3000); // Delay agar PDF terbuka lebih dulu sebelum download dimulai
  //     } else {
  //       console.error("Failed to get merged PDF URL.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);

  //     clearInterval(interval); // Hentikan hitungan pada error

  //     // Perbarui toast untuk menunjukkan error
  //     toast.update(toastId, {
  //       render: `Terjadi kesalahan saat membuat PDF dalam ${elapsedSeconds} detik`,
  //       type: toast.TYPE.ERROR,
  //       autoClose: 750, // Tutup setelah 750ms
  //     });
  //   }
  // }

  async function getprintsatuan(providerName: any, print: any) {
    console.log("providerName", providerName);
    console.log("print", print);

    let dataPrint: any = [];
    print.forEach((vars: any) => {
      if (vars.logisticsProviderName === providerName) {
        dataPrint.push({
          orderId: vars.orderId,
        });
      }
    });

    let toastId: any;
    let elapsedSeconds = 0;
    let interval;

    try {
      // Tampilkan toast saat proses dimulai
      toastId = toast.info(`Pdf sedang dibuat, tunggu sebentar... (0 detik)`, {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: false, // Jangan auto-close saat proses berjalan
      });

      // Perbarui hitungan detik di dalam toast setiap detik
      interval = setInterval(() => {
        elapsedSeconds += 1;
        toast.update(toastId, {
          render: `Pdf sedang dibuat, tunggu sebentar... (${elapsedSeconds} detik)`,
        });
      }, 1000);

      const response = await axios({
        method: "POST",
        url: "/api/getprintmasal",
        data: {
          request_uri: "/openapi/v3/oms/order/print",
          params: {
            orderId: dataPrint,
            documentType: "SHIPPING_LABEL",
          },
        },
      });

      clearInterval(interval); // Hentikan hitungan setelah selesai

      if (response.statusText === "OK") {
        // Perbarui isi toast setelah sukses
        setmodalaturpengiriman_massal_printaja(false);
        toast.update(toastId, {
          render: `Pdf Berhasil dibuat dalam ${elapsedSeconds} detik`,
          type: toast.TYPE.SUCCESS,
          autoClose: 750, // Tutup setelah 750ms
        });

        // **Reload data dengan filter StatusCetak "BELUM_CETAK" tanpa full reload**
        setsycnorder([]); // Kosongkan data lama
        getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, "NOT_PRINTED", filteruser, area, Brand);

      } else {
        // Perbarui isi toast jika gagal
        toast.update(toastId, {
          render: `Pdf Gagal dibuat dalam ${elapsedSeconds} detik`,
          type: toast.TYPE.ERROR,
          autoClose: 750, // Tutup setelah 750ms
        });
      }

      console.log("response print", response.data);

      if (response.data.mergedPdfUrl) {
        window.open(response.data.mergedPdfUrl, "_blank");
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10);
        const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ";");

        // **Tambahkan opsi untuk mengunduh dengan nama yang diubah**
        setTimeout(async () => {
          try {
            const fileResponse = await axios.get(response.data.mergedPdfUrl, {
              responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Label-${providerName}-${datePart + ' ' + timePart}.pdf`); // Nama file yang diinginkan
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error downloading PDF:", error);
          }
        }, 3000); // Delay agar PDF terbuka lebih dulu sebelum download dimulai
      } else {
        console.error("Failed to get merged PDF URL.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      clearInterval(interval); // Hentikan hitungan pada error

      // Perbarui toast untuk menunjukkan error
      toast.update(toastId, {
        render: `Terjadi kesalahan saat membuat PDF dalam ${elapsedSeconds} detik`,
        type: toast.TYPE.ERROR,
        autoClose: 750, // Tutup setelah 750ms
      });
    }
  }

  async function logisticmassalPrint(providerName: any, data: any, channelid: any) {
    let queryawal: any = [];

    data.filter((item: any) => item.logisticsProviderName === providerName)
      .forEach((item: any) => {
        queryawal.push({
          orderId: item.orderId,
        });
      });

    let datas: any = [];
    queryawal.forEach((vars: any) => {
      datas.push(data.find((query: any) => query.orderId === vars.orderId));
    });


    let toastId: any;
    let interval: any;
    let elapsedSeconds = 0;

    // Tampilkan toast saat proses dimulai
    toastId = toast.info(`Data sedang dipersiapkan, tunggu sebentar... (0 detik)`, {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: false, // Jangan auto-close saat proses berjalan
    });

    // Perbarui hitungan detik di dalam toast setiap detik
    interval = setInterval(() => {
      elapsedSeconds += 1;
      toast.update(toastId, {
        render: `Data sedang dipersiapkan, tunggu sebentar... (${elapsedSeconds} detik)`,
      });
    }, 1000);

    await axios({
      method: "POST",
      url: "/api/getparametershippingmassal",
      data: {
        request_uri: "/openapi/logistics/v1/get-shipping-parameter",
        params: {
          orderId: queryawal,
        },
      },
    })
      .then(function (response) {
        // Hentikan interval dan tutup toast setelah selesai
        clearInterval(interval);
        toast.dismiss(toastId);

        setmodalgetprint(false);
        setmodalgetprintsatuan(false);
        setchannelid(channelid);
        set_totalaturmassal(response.data.length);

        const filteredData: any = response.data[0].logistics.filter(
          (item: any) => item.logisticDetailList.length > 0
        );
        setaddresses(response.data[0].addresses);
        setproviderName(providerName);
        setlogistics(filteredData);
        setkurir(
          filteredData[0]["logisticDetailList"][0]["logisticsProviderName"]
        );
        setdeliveryType(filteredData[0]["logisticsDeliveryType"]);

        setquerymassal(datas);
        setmodalaturpengiriman_massal_printaja(true);
      })


      .catch(function (error) {
        // Hentikan interval dan tutup toast jika terjadi error
        clearInterval(interval);
        toast.dismiss(toastId);

        console.log(error);
        toast.error("Terjadi kesalahan saat memuat data.");
      });
  }

  async function logisticmassal(providerName: any, data: any, channelid: any) {
    // data = data.slice(0, 200);

    let queryawal: any = data
      .filter((item: any) => item.logisticsProviderName === providerName)
      .map((item: any) => ({ orderId: item.orderId }));

    let datas: any = queryawal.map((vars: any) =>
      data.find((query: any) => query.orderId === vars.orderId)
    );
    let toastId: any;
    let interval: any;
    let elapsedSeconds = 0;
    // datas = datas.slice(0, 200);

    // Tampilkan toast saat proses dimulai
    toastId = toast.info(`Data EXPORT sedang dipersiapkan, tunggu sebentar... (0 detik)`, {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: false, // Jangan auto-close saat proses berjalan
    });

    // Perbarui hitungan detik di dalam toast setiap detik
    interval = setInterval(() => {
      elapsedSeconds += 1;
      toast.update(toastId, {
        render: `Data EXPORT sedang dipersiapkan, tunggu sebentar... (${elapsedSeconds} detik)`,
      });
    }, 1000);

    try {
      const response = await axios({
        method: "POST",
        url: "/api/getparametershippingmassal",
        data: {
          request_uri: "/openapi/logistics/v1/get-shipping-parameter",
          params: {
            orderId: queryawal,
          },
        },
      });
      // Hentikan interval dan tutup toast setelah selesai
      clearInterval(interval);
      toast.dismiss(toastId);

      setmodalaturmassal(false);
      setchannelid(channelid);
      set_totalaturmassal(response.data.length);
      console.log("response.data", response.data);


      const filteredData: any = response.data[0].logistics.filter(
        (item: any) => item.logisticDetailList.length > 0
      );
      setquerymassal(datas);
      setaddresses(response.data[0].addresses);

      setlogistics(filteredData);
      setkurir(
        filteredData[0]["logisticDetailList"][0]["logisticsProviderName"]
      );
      setdeliveryType(filteredData[0]["logisticsDeliveryType"]);
      setmodalaturpengiriman_massal(true);
    } catch (error) {
      // Hentikan interval dan tutup toast jika terjadi error
      clearInterval(interval);
      toast.dismiss(toastId);

      console.log(error);
      toast.error("Terjadi kesalahan saat memuat data, mohon ulangi..");
    }
  }

  const list_shop: any = [];
  if (!isLoading && Array.isArray(list_getshopid)) {
    list_getshopid.forEach((shop: any, index: number) => {
      const channelKey = shop.channelId || shop.channel || shop.channelEnum || "";
      if (channelKey !== "TOKOPEDIA_ID") {
        list_shop.push(
          <option key={index} value={shop.shopId}>
            {(shop.channel || shop.channelId || shop.channelEnum || "")} | {shop.name}
          </option>
        );
      }
    });
  }

  const [Query, setQuery] = useState("all");
  function querySet(e: any) {
    if (e.target.value === "") {
      setQuery("all");
      getdataorder(date_start, date_end, activetab, "all", true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
    } else {
      setQuery(e.target.value);
      getdataorder(date_start, date_end, activetab, e.target.value, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
    }
  }

  async function keyDown(event: any) {
    if (event.key == "Enter") {
      if (Query != "all") {
        getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
      }
    }
  }

  const [orderId, setorderId]: any = useState("");
  const [externalOrderId, setexternalOrderId]: any = useState("");
  const [productName, setproductName]: any = useState("");
  const [variationName, setvariationName]: any = useState("");
  const [productImageUrl, setproductImageUrl]: any = useState("");
  const [externalcreatedat, setexternalcreatedat]: any = useState("");
  const [idshopexternal, setidshopexternal]: any = useState("");
  const [totalAmount, settotalAmount]: any = useState("");
  const [spu, setspu]: any = useState("");
  const [Users, setUsers] = useState(Cookies.get("auth_name"));
  const [quantity, setquantity]: any = useState("");
  const [noresi, setnoresi]: any = useState("");


  const [addresses, setaddresses]: any = useState([]);
  const [pickuptime_id, setpickuptime_id]: any = useState([]);
  const [logistics, setlogistics]: any = useState([]);

  const [alamat_pickup, setalamat_pickup]: any = useState("");
  const [timepickup, settimepickup]: any = useState("");
  const [datatimepickup, setdatatimepickup]: any = useState([]);
  const [deliveryType, setdeliveryType]: any = useState("");
  const [channelid, setchannelid]: any = useState("");
  const [channelidMassal, setchannelidmassal]: any = useState("");

  const [kurir, setkurir]: any = useState("");

  function gettimepickup(alamatid: any) {
    const result = alamatid.split("#");

    const data_pickup: any = addresses.filter(
      (item: any) => item.addressId === result[0]
    );
    setdatatimepickup(data_pickup);
  }

  async function aturPengiriman(
    data: any,
    externalOrderId: any,
    externalOrderSn: any,
    productName: any,
    variationName: any,
    productImageUrl: any,
    externalCreateAt: any,
    shopId: any,
    totalAmount: any,
    spu: any,
    quantity: any,
    channelId: any,
    sku: any,
    query: any,
  ) {

    let queryawal: any = [query];
    let dataAwal: any = [];

    queryawal.forEach((vars: any) => {
      if (Array.isArray(vars.logisticsInfos)) {
        vars.logisticsInfos.forEach((logisticsInfo: any) => {
          if (Array.isArray(vars.items)) {
            // Periksa apakah externalOrderId sudah ada di dataAwal
            const existingIndex = dataAwal.findIndex((entry: any) => entry.externalOrderId === vars.externalOrderId);

            if (existingIndex > -1) {
              // Jika externalOrderId sudah ada, gabungkan items
              vars.items.forEach((item: any) => {
                dataAwal[existingIndex].items.push({
                  variationName: item.variationName,
                  productImageUrl: item.productImageUrl,
                  productName: item.productName,
                  quantity: item.quantity,
                });
              });

              // Update morethan jika jumlah items lebih dari 1
              dataAwal[existingIndex].morethan = "true";
            } else {
              // Jika externalOrderId belum ada, buat entri baru
              dataAwal.push({
                orderId: vars.orderId,
                externalOrderId: vars.channelId != "TOKOPEDIA_ID"
                  ? vars.externalOrderId : vars.externalOrderSn.includes("/") ? vars.externalOrderSn.split('/')[3] : vars.externalOrderSn,
                externalCreateAt: formatISO(parseISO(vars.externalCreateAt), { representation: "date" }),
                shopId: vars.shopId,
                totalAmount: vars.channelId === "SHOPEE_ID"
                  ? vars.paymentInfo.totalAmount
                  : vars.channelId === "TOKOPEDIA_ID"
                    ? parseInt(vars.paymentInfo.subTotal) - (parseInt(vars.paymentInfo.subTotal) * 0.12)
                    : vars.channelId === "TIKTOK_ID"
                      ? parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.175) - (parseInt(vars.paymentInfo.subTotal + vars.paymentInfo.voucherPlatform) * 0.03)
                      : 0, // Nilai default jika tidak ada channel yang cocok

                logisticsProviderName: logisticsInfo.logisticsProviderName,
                externalOrderStatus: vars.externalOrderStatus,
                channelId: vars.channelId,
                items: vars.items.map((item: any) => ({
                  variationName: item.variationName.includes(",")
                    ? item.variationName.split(',')[1].trim()
                    : item.variationName.trim(),
                  productImageUrl: item.productImageUrl,
                  productName: item.productName,
                  quantity: item.quantity,
                  sku: item.masterSku || item.sku,
                  spu: (item.masterSku || item.sku || "").split(".")[0],
                })),
                morethan: vars.items.length > 1 ? "true" : "false", // Tentukan apakah lebih dari 1 item
              });
            }
          }

        });
      }
    });
    console.log("dataAwal satuan", dataAwal);

    setquerysatuan(dataAwal)

    setquantity(quantity);
    if (channelId === "SHOPEE_ID") {
      setspu(spu === "" || spu === null ? sku.split(".")[0] : spu);
    } else {
      setspu(sku.split('.')[0]);
    }

    setchannelid(channelId);
    settotalAmount(totalAmount);
    setidshopexternal(shopId);
    setorderId(data);
    {
      channelId != "TOKOPEDIA_ID"
        ? externalOrderId.externalOrderId : externalOrderSn.includes("/") ? externalOrderSn.split('/')[3] : externalOrderSn
    }

    if (channelId != "TOKOPEDIA_ID") {
      setexternalOrderId(externalOrderId);
    } else {
      setexternalOrderId(externalOrderSn.split('/')[3]);
    }

    setproductName(productName);
    setvariationName(variationName);
    setproductImageUrl(productImageUrl);
    setexternalcreatedat(externalCreateAt);

    settimepickup("");
    setalamat_pickup("");
    setdatatimepickup([]);
    setkurir("");
    setdeliveryType("");

    await axios({
      method: "POST",
      url: "/api/getparametershipping",
      data: {
        request_uri: "/openapi/logistics/v1/get-shipping-parameter",
        params: {
          orderid: data,
        },
      },
    })
      .then(function (response) {
        console.log("get shipping =", response.data);

        setmodalaturpengiriman(true);
        setaddresses(response.data.data.addresses);
        const filteredData: any = response.data.data.logistics.filter(
          (item: any) => item.logisticDetailList.length > 0
        );

        setlogistics(filteredData);
        setkurir(
          filteredData[0]["logisticDetailList"][0]["logisticsProviderName"]
        );
        setdeliveryType(filteredData[0]["logisticsDeliveryType"]);
        // getshopid();
        // getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function synctokped(orderId: any) {
    let datas: any = [];
    datas.push({
      "orderId": orderId,
      "channelEnum": "TOKOPEDIA_ID",
    })

    await axios({
      method: "POST",
      url: "/api/synctokped",
      data: {
        request_uri: "/openapi/order/v1/move-shipped",
        params: {
          orderInfoList: datas,
        },
      },
    })
      .then(function (response) {
        console.log("hasil sync tokped =", response.data);
        // getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const dateskrg = format(subDays(startOfDay(new Date()), 0), "yyyy-MM-dd");

  async function cekgetdetail(data: any) {
    let datas = [];
    datas.push(data)

    axios({
      method: "POST",
      url: "/api/apigetdetailorder",
      data: {
        request_uri: "/openapi/v3/oms/order/item/batch-get",
        params: {
          orderId: datas,
        },
      },
    })
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function submitAturPengiriman(channelid: any, querysatuan: any) {

    let result: any = [];
    let shopName: any = null;
    let idstore: any = null;
    let idware: any = null;
    let bacthshipping: any = [];
    let bacthorderId: any = [];
    let bacthorderId2: any = [];
    let skipHarga: any = [];
    let skipOrder: any = [];
    let skipOrder2: any = [];

    const result_address = alamat_pickup.split("#");

    querysatuan.forEach((order: any) => {
      // Temukan data toko berdasarkan shopId
      const shop = list_getshopid.find((shop: any) => shop.shopId === order.shopId);
      if (shop) {
        shopName = shop.name;
      }

      // Temukan data sinkronisasi toko berdasarkan nama toko
      const syncshope = data_store.find((syncshope: any) => syncshope.ip === shopName);
      if (syncshope) {
        idstore = syncshope.id_store;
        idware = syncshope.id_ware;
      }

      // Looping melalui setiap item dalam pesanan
      order.items.forEach((item: any) => {
        const skuParts = (item.sku || item.spu || "").split(".");
        result.push({
          id_produk: skuParts[0] || item.spu,
          size: skuParts[1] || item.variationName,
          id_store: idstore,
          id_ware: skuParts[2] || idware,
          quantity: item.quantity,
          no_pesanan: order.externalOrderId,
          total_amount: order.totalAmount,
          nama_produk: item.productName,
          gambar_produk: item.productImageUrl,
          morethan: order.externalOrderId + "-" + order.morethan,
        });
      });

      // Tambahkan ke batch pengiriman
      bacthshipping.push({
        orderId: order.orderId,
        deliveryType: deliveryType,
        addressId: result_address[0],
        address: result_address[1],
        timepickup: timepickup,
        kurir: order.logisticsProviderName,
        externalOrderId: order.externalOrderId,
      });
    });

    let rowsData: any = [];

    try {
      const response = await axios.post(`http://localhost:4000/v1/cekbeforeordermassal`, {
        result: result,
      });

      // console.log("response : cekbefore", response.data.result);

      response.data.result.forEach((pesanan: any) => {
        // 1. Cek status pesanan
        const isAllItemsValid = pesanan.items.every((item: any) => parseInt(item.qty_ready) > 0);

        // 2. Tentukan parameter berdasarkan status
        const parameter = isAllItemsValid ? "GO" : "SKIP";

        // 3. Push semua item dengan parameter yang sesuai
        pesanan.items.forEach((item: any) => {
          rowsData.push({
            produk: item.produk,
            idproduk: item.id_produk,
            size: item.size,
            harga_beli: 200000,
            qty_ready: item.qty_ready,
            qty: item.qtysales,
            img: item.img,
            source: item.source,
            id_ware: item.id_ware,
            id_store: item.id_store,
            harga_jual: item.harga_jual,
            payment: "PAID",
            id_pesanan: item.no_pesanan,
            total_amount: item.total_amount,
            morethan: item.morethan,
            parameter: parameter // Parameter sama untuk semua item dalam 1 pesanan
          });
        });
      });

      // 4. Filter data
      const dataQtyReady = rowsData.filter((data: any) => data.parameter === "GO");
      const dataQtyNotReady = rowsData.filter((data: any) => data.parameter === "SKIP");
      // console.log("dataQtyReady", dataQtyReady.length);
      // console.log("dataQtyNotReady", dataQtyNotReady.length);
      // console.log("dataQtyReady", dataQtyReady);
      // console.log("dataQtyNotReady", dataQtyNotReady);

      if (dataQtyNotReady.length > 0) {

        console.log("skipOrder1.length", dataQtyNotReady);
        skipOrder.push(dataQtyNotReady)

        toast.error(`Ada ${dataQtyNotReady.length} produk yang tidak ready`, {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 5000,
        });

        const notReadySheet = dataQtyNotReady.map((item: any) => ({
          "Order ID": item.id_pesanan,
          "Product ID": item.idproduk,
          "Product Name": item.produk,
          "Size": item.size,
          "Quantity Ready": item.qty_ready,
          "Quantity Requested": item.qty,
          "Selling Price": item.harga_jual,
          "Total Amount": item.total_amount,
          "Source": item.source,
          "Warehouse ID": item.id_ware,
        }));

        const workbook = XLSX.utils.book_new();
        const notReadyWs = XLSX.utils.json_to_sheet(notReadySheet);
        XLSX.utils.book_append_sheet(workbook, notReadyWs, "Not Ready Products");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileName = `Not_Ready_Products_${new Date().toISOString().slice(0, 10)}.xlsx`;

        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);

        toast.info("Excel file for not ready products has been exported.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 5000,
        });
      }

      if (
        channelid === "SHOPEE_ID" && (alamat_pickup === "" || timepickup === "" || kurir === "") && deliveryType === "PICK_UP"
      ) {
        alert("Mohon lengkapi data untuk Shopee: alamat pickup, waktu pickup, atau kurir.");
      } else if (channelid === "TIKTOK_ID" && kurir === "") {
        alert("Mohon lengkapi data untuk TikTok: kurir wajib diisi.");
      } else if (channelid === "TOKOPEDIA_ID" && kurir === "") {
        alert("Mohon lengkapi data untuk Tokopedia: kurir wajib diisi.");
      } else {
        let toastId: any;
        let interval: any;
        let elapsedSeconds = 0;

        // Tampilkan toast saat proses dimulai
        toastId = toast.info(`${parseInt(dataQtyReady.length) + parseInt(dataQtyNotReady.length)} PCS data sedang di input massal, tunggu sebentar... (0 detik)`, {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: false, // Jangan auto-close saat proses berjalan
        });

        // Perbarui hitungan detik di dalam toast setiap detik
        interval = setInterval(() => {
          elapsedSeconds += 1;
          toast.update(toastId, {
            render: `${parseInt(dataQtyReady.length) + parseInt(dataQtyNotReady.length)} PCS data sedang di input massal, tunggu sebentar... (${elapsedSeconds} detik)`,
          });
        }, 1000);

        if (dataQtyReady.length > 0) {
          const syncResponse = await axios.post(`http://localhost:4000/v1/syncordermassal`, {
            data: dataQtyReady,
            tanggal: dateskrg,
            id_store: idstore,
            users: Users,
            status_display: "display_false",
          });
          const { data } = syncResponse.data.result;
          // console.log("syncordermassal", data);


          if (syncResponse.data.status === "partially_processed") {
            toast.warning(syncResponse.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });
          } else if (syncResponse.data.status === "success") {
            toast.success(syncResponse.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });
          }

          if (data.skippedOrders.length > 0) {
            data.skippedOrders.forEach((order: any) => {
              toast.error(`Order ID ${order.id_pesanan} skipped: ${order.reason}`, {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: false,
              });
              dataQtyReady.forEach((ready: any) => {
                if (ready.id_pesanan === order.id_pesanan) {
                  skipOrder.push(ready)
                }
              });
            });
          }

          if (data.skippedPrices.length > 0) {
            data.skippedPrices.forEach((price: any) => {
              toast.error(`Order ID ${price.id_pesanan} skipped due to price issue: ${price.reason}`, {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: false,
              });
              dataQtyReady.forEach((ready: any) => {
                if (ready.id_pesanan === price.id_pesanan) {
                  skipHarga.push(ready)
                }
              });
            });
          }

          // Export to Excel jika ada skippedOrders atau skippedPrices
          if (data.skippedOrders.length > 0 || data.skippedPrices.length > 0) {
            const skippedOrdersSheet = data.skippedOrders.map((order: any) => ({
              "Order ID": order.id_pesanan,
              "Product ID": order.idproduk,
              Reason: order.reason,
            }
            ));

            const skippedPricesSheet = data.skippedPrices.map((price: any) => ({
              "Order ID": price.id_pesanan,
              "Product ID": price.idproduk,
              "Selling Price": price.frontendTotalAmount,
              "Minimum Price": price.requiredTotal,
              Reason: price.reason,
            }));

            // Buat workbook
            const workbook = XLSX.utils.book_new();

            if (skippedOrdersSheet.length > 0) {
              data.skippedOrders.forEach((order: any) => {
                toast.error(`Order ID ${order.id_pesanan} skipped: ${order.reason}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: false,
                });
                dataQtyReady.forEach((ready: any) => {
                  if (ready.id_pesanan === order.id_pesanan) {
                    skipOrder2.push(ready)
                  }
                });
              });

              const skippedOrdersWs = XLSX.utils.json_to_sheet(skippedOrdersSheet);
              XLSX.utils.book_append_sheet(workbook, skippedOrdersWs, "Skipped Orders");
            }

            if (skippedPricesSheet.length > 0) {
              const skippedPricesWs = XLSX.utils.json_to_sheet(skippedPricesSheet);
              XLSX.utils.book_append_sheet(workbook, skippedPricesWs, "Skipped Prices");
            }

            // Export workbook sebagai file Excel
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const fileName = `Skipped_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;

            saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);

            toast.info("Cek folder DOWNLOAD anda, file excel data yang gagal MASUK sudah di EXPORT !!", {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });
          }


          if (data.processedOrders.length > 0) {
            toast.success(`${data.processedOrders.length} order(s) successfully processed.`, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });

            const processShippingData = async () => {
              // Ambil data pesanan yang telah diproses dari response sebelumnya
              const processedOrders = syncResponse.data.result.data.processedOrders;
              const shippingInputData: any = [];
              const shippingTokopediaData: any = [];
              const collectedOrderIds: any = []; // Tetap digunakan untuk mengumpulkan orderId yang unik

              // Preprocessing: Buat mapping dari externalOrderId ke array batch shipping (akses O(1))
              const batchShippingMap = bacthshipping.reduce((map: Map<string, any[]>, batch: any) => {
                const key = batch.externalOrderId;
                if (!map.has(key)) {
                  map.set(key, []);
                }
                map.get(key)!.push(batch);
                return map;
              }, new Map());

              // (Delay per pesanan dihilangkan untuk meningkatkan kecepatan proses)
              for (const order of processedOrders) {
                const matchedBatches = batchShippingMap.get(order.id_pesanan) || [];
                matchedBatches.forEach((batch: any) => {
                  shippingInputData.push({
                    channelid: channelid,
                    orderId: batch.orderId,
                    deliveryType: deliveryType,
                    shipmentProvider: batch.kurir,
                    shipmentProviderId: "",
                    trackingNo: "",
                    addressId: batch.addressId,
                    address: batch.address,
                    pickupTimeId: timepickup.split('.')[0],
                    timeText: timepickup.split('.')[1],
                  });
                  shippingTokopediaData.push({ orderId: batch.orderId });
                });
              }

              // Panggil fungsi processShipping jika data shipping sudah terkumpul
              if (shippingInputData.length > 0) {
                processShippingSatuan(
                  channelid,
                  shippingInputData,
                  shippingTokopediaData,
                  querysatuan,
                  restartPageAndData,
                );
              } else {
                console.warn("Tidak ada data shipping yang terkumpul, proses shipping dibatalkan.");
              }
            };

            await processShippingData();

          } else {
            alert("Tidak ada pesanan yang bisa di proses, periksa kembali hasil EXPORT di folder DOWNLOAD anda.");
            setmodalaturpengiriman(false);
            restartPageAndData();
            setTimeout(function () {
              window.location.reload();
            }, 250);
            setTimeout(function () {
              window.location.reload();
            }, 250);
          }
          // Kumpulkan data shipping dari processedOrders dengan delay untuk memastikan semua data terkumpul

          // Panggil fungsi untuk memproses data shipping dengan delay
          clearInterval(interval);
          toast.dismiss(toastId);

          console.log("skipOrder.length", skipOrder);
          console.log("skipHarga.length", skipHarga);

          if (skipOrder.length > 0) {
            await axios.post("http://localhost:4000/v1/insertgagalinput", {
              data: dataQtyNotReady,
              params: "SKIP_ORDER",
            });
          }

          if (skipOrder2.length > 0) {
            await axios.post("http://localhost:4000/v1/insertgagalinput", {
              data: skipOrder2,
              params: "SKIP_ORDER2",
            });
          }

          if (skipHarga.length > 0) {
            await axios.post("http://localhost:4000/v1/insertgagalinput", {
              data: skipHarga,
              params: "SKIP_HARGA",
            });
          }
        } else {
          alert("Tidak ada pesanan yang bisa di proses, periksa kembali hasil EXPORT di folder DOWNLOAD anda.");
          setmodalaturpengiriman(false);
          restartPageAndData();
          setTimeout(function () {
            window.location.reload();
          }, 250);
          setTimeout(function () {
            window.location.reload();
          }, 250);
        }
      }
    } catch (error) {
      console.error("Error processing orders:", error);
    }
  }

  async function processShippingSatuan(
    channelid: string,
    shippingInputData: any[],
    shippingTokopediaData: any[],
    querysatuan: any[],
    restartPageAndData: () => void,
  ) {
    console.log("channelid", channelid);
    console.log("shippingInputData", shippingInputData);
    console.log("shippingTokopediaData", shippingTokopediaData);
    console.log("querysatuan", querysatuan);

    if (shippingInputData.length > 0) {
      try {
        let allResponses: any[] = []; // Kumpulkan semua response dalam satu array
        let data: any = []; // Array untuk menyimpan orderId hanya yang sukses
        let dataakhir: any = []; // Array untuk menyimpan orderId hanya yang sukses
        let dataGagal: any = []; // Array untuk menyimpan orderId hanya yang sukses

        let toastId: any;
        let interval: any;
        let elapsedSeconds = 0;
        // Tampilkan toast saat proses dimulai
        toastId = toast.info(`${shippingInputData.length}, Pcs sedang di atur massal ke marketplace, tunggu sebentar... (0 detik)`, {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: false, // Jangan auto-close saat proses berjalan
        });

        interval = setInterval(() => {
          elapsedSeconds += 1;
          toast.update(toastId, {
            render: `${shippingInputData.length}, Pcs sedang di atur massal ke marketplace, tunggu sebentar... (${elapsedSeconds} detik)`,
          });
        }, 1000);
        console.log("channelid", channelid);

        if (channelid != "TOKOPEDIA_ID") {
          const response = await axios({
            method: "POST",
            url: "/api/aturshippingmassalmanual",
            data: {
              request_uri: "/openapi/v3/oms/order/rts",
              params: { batch: shippingInputData },
            },
          });
          const finalResponse = response.data;
          console.log("Final aggregated response from backend:", finalResponse);

          // Misalnya, kita dapat menampilkan data ordersId ke UI:
          const ordersData = finalResponse.ordersId.map((orderId: any) => ({ orderId }));
          console.log("Orders data:", ordersData);

          if (finalResponse.ordersId && Array.isArray(finalResponse.ordersId)) {
            finalResponse.ordersId.forEach((orderId: any) => {
              // data.push({ orderId });
              data.push({
                orderId: orderId,
                shippingStatus: finalResponse.code,
              });
            });
          }
          console.log("Combined data", data);

        } else {
          const acceptResponse = await axios({
            method: "POST",
            url: "/api/acceptorder",
            data: {
              request_uri: "/openapi/order/v1/accept",
              params: {
                orderId: shippingTokopediaData,
              },
            },
          });
          console.log("cek acceptResponse :", acceptResponse.data);
          const response = await axios({
            method: "POST",
            url: "/api/aturshippingmassalmanual",
            data: {
              request_uri: "/openapi/v3/oms/order/rts",
              params: { batch: shippingInputData },
            },
          });
          const finalResponse = response.data;
          console.log("Final aggregated response from backend:", finalResponse);

          // Misalnya, kita dapat menampilkan data ordersId ke UI:
          const ordersData = finalResponse.ordersId.map((orderId: any) => ({ orderId }));
          console.log("Orders data:", ordersData);

          if (finalResponse.ordersId && Array.isArray(finalResponse.ordersId)) {
            finalResponse.ordersId.forEach((orderId: any) => {
              // data.push({ orderId });
              data.push({
                orderId: orderId,
                shippingStatus: finalResponse.code,
              });
            });
          }
          console.log("Combined data", data);
        }
        clearInterval(interval);
        toast.dismiss(toastId);

        // const axiosPromises: any = [];
        querysatuan.forEach((query: any) => {
          data.forEach((dats: any) => {
            if (query.orderId === dats.orderId) { // Periksa apakah orderId ada dalam array data[]
              if (dats.shippingStatus === "SUCCESS") {
                dataakhir.push(query);
              } else {
                dataGagal.push(query);
              }
            }
          });
        });

        console.log("data", data);
        console.log("dataakhir", dataakhir);
        console.log("dataGagal", dataGagal);

        const now = new Date();
        const datePart = now.toISOString().slice(0, 10);
        const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ";");
        const filename = `DATA SUCCESS ATUR SATUAN-${datePart + ' ' + timePart}.xlsx`;

        // Mengubah data menjadi Excel sheet
        const formattedData = dataakhir.flatMap((order: any, orderIndex: any) =>
          order.items.map((item: any, itemIndex: any) => ({
            No: orderIndex + 1,
            "Channel": order.channelId,
            "No Pesanan": order.externalOrderId,
            "Jasa Kirim": order.logisticsProviderName,
            Produk: item.productName,
            Size: `${item.spu}.${item.variationName}`,
            Qty: item.quantity,
            Amount: order.totalAmount,
          }))
        );
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, filename);

        setmodalaturpengiriman(false);
        setTimeout(function () {
          getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
        }, 1500);
        restartPageAndData();
        setTimeout(function () {
          window.location.reload();
        }, 350);
        setTimeout(function () {
          window.location.reload();
        }, 350);
      } catch (error) {
        console.error("Error processing shipping:", error);
      }
    } else {
      alert("Tidak ada pesanan yang bisa di proses, periksa kembali hasil EXPORT di folder DOWNLOAD anda.");
      setmodalaturpengiriman(false);
      restartPageAndData();
      setTimeout(function () {
        window.location.reload();
      }, 250);
      setTimeout(function () {
        window.location.reload();
      }, 250);
    }
  }

  // Function to restart data and page
  function restartPageAndData(): void {
    setTimeout(() => {
      setsycnorder([]);
      getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
    }, 1000);
  }

  async function fetchAndFinalizeShipping_massal(bacthorderId: any, querymassal: any) {
    try {
      setquerysatuanakhir_export(querymassal);
      setmodalaturpengiriman_massal(false);
      setopenaksiprint_data_massal(bacthorderId);
      setopenaksiprint_massal(true);
    } catch (error) {
      console.error("Error in fetchAndFinalizeShipping:", error);
    }
  }

  async function submitAturPengirimanMassal(querymassal: any) {
    let result: any = [];
    let shopName: any = null;
    let idstore: any = null;
    let idware: any = null;
    let bacthshipping: any = [];
    let bacthorderId: any = [];
    let bacthorderId2: any = [];
    let skipHarga: any = [];
    let skipOrder: any = [];
    let skipOrder2: any = [];
    // querymassal = querymassal.slice(0, 200);

    const result_address = alamat_pickup.split("#");

    querymassal.forEach((order: any) => {
      // Temukan data toko berdasarkan shopId
      const shop = list_getshopid.find((shop: any) => shop.shopId === order.shopId);
      if (shop) {
        shopName = shop.name;
      }

      // Temukan data sinkronisasi toko berdasarkan nama toko
      const syncshope = data_store.find((syncshope: any) => syncshope.ip === shopName);
      if (syncshope) {
        idstore = syncshope.id_store;
        idware = syncshope.id_ware;
      }

      // Looping melalui setiap item dalam pesanan
      order.items.forEach((item: any) => {
        const skuParts = (item.sku || item.spu || "").split(".");
        result.push({
          id_produk: skuParts[0] || item.spu,
          size: skuParts[1] || item.variationName,
          id_store: idstore,
          id_ware: skuParts[2] || idware,
          quantity: item.quantity,
          no_pesanan: order.externalOrderId,
          total_amount: order.totalAmount,
          nama_produk: item.productName,
          gambar_produk: item.productImageUrl,
          morethan: order.externalOrderId + "-" + order.morethan,
        });
      });

      // Tambahkan ke batch pengiriman
      bacthshipping.push({
        orderId: order.orderId,
        deliveryType: deliveryType,
        addressId: result_address[0],
        address: result_address[1],
        pickupTimeId: timepickup.split('.')[0],
        timeText: timepickup.split('.')[1],
        kurir: order.logisticsProviderName,
        externalOrderId: order.externalOrderId,
      });
    });


    console.log("result", result);

    let rowsData: any = [];

    try {
      const response = await axios.post(`http://localhost:4000/v1/cekbeforeordermassal`, {
        result: result,
      });

      // console.log("response : cekbefore", response.data.result);

      response.data.result.forEach((pesanan: any) => {
        // 1. Cek status pesanan
        const isAllItemsValid = pesanan.items.every((item: any) => parseInt(item.qty_ready) > 0);

        // 2. Tentukan parameter berdasarkan status
        const parameter = isAllItemsValid ? "GO" : "SKIP";

        // 3. Push semua item dengan parameter yang sesuai
        pesanan.items.forEach((item: any) => {
          rowsData.push({
            produk: item.produk,
            idproduk: item.id_produk,
            size: item.size,
            harga_beli: 200000,
            qty_ready: item.qty_ready,
            qty: item.qtysales,
            img: item.img,
            source: item.source,
            id_ware: item.id_ware,
            id_store: item.id_store,
            harga_jual: item.harga_jual,
            payment: "PAID",
            id_pesanan: item.no_pesanan,
            total_amount: item.total_amount,
            morethan: item.morethan,
            parameter: parameter // Parameter sama untuk semua item dalam 1 pesanan
          });
        });
      });

      // 4. Filter data
      const dataQtyReady = rowsData.filter((data: any) => data.parameter === "GO");
      const dataQtyNotReady = rowsData.filter((data: any) => data.parameter === "SKIP");
      // console.log("dataQtyReady", dataQtyReady);
      // console.log("dataQtyNotReady", dataQtyNotReady);

      if (dataQtyNotReady.length > 0) {

        // console.log("skipOrder1.length", dataQtyNotReady);
        skipOrder.push(dataQtyNotReady)

        toast.error(`Ada ${dataQtyNotReady.length} produk yang tidak ready`, {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 5000,
        });

        const notReadySheet = dataQtyNotReady.map((item: any) => ({
          "Order ID": item.id_pesanan,
          "Product ID": item.idproduk,
          "Product Name": item.produk,
          "Size": item.size,
          "Quantity Ready": item.qty_ready,
          "Quantity Requested": item.qty,
          "Selling Price": item.harga_jual,
          "Total Amount": item.total_amount,
          "Source": item.source,
          "Warehouse ID": item.id_ware,
        }));

        const workbook = XLSX.utils.book_new();
        const notReadyWs = XLSX.utils.json_to_sheet(notReadySheet);
        XLSX.utils.book_append_sheet(workbook, notReadyWs, "Not Ready Products");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileName = `Not_Ready_Products_${new Date().toISOString().slice(0, 10)}.xlsx`;

        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);

        toast.info("Excel file for not ready products has been exported.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: 5000,
        });
      }

      if (
        querymassal[0].channelId === "SHOPEE_ID" && (alamat_pickup === "" || timepickup === "" || kurir === "") && deliveryType === "PICK_UP"
      ) {
        alert("Mohon lengkapi data untuk Shopee: alamat pickup, waktu pickup, atau kurir.");
      } else if (querymassal[0].channelId === "TIKTOK_ID" && kurir === "") {
        alert("Mohon lengkapi data untuk TikTok: kurir wajib diisi.");
      } else if (querymassal[0].channelId === "TOKOPEDIA_ID" && kurir === "") {
        alert("Mohon lengkapi data untuk Tokopedia: kurir wajib diisi.");
      } else {
        let toastId: any;
        let interval: any;
        let elapsedSeconds = 0;

        // Tampilkan toast saat proses dimulai
        toastId = toast.info(`${parseInt(dataQtyReady.length) + parseInt(dataQtyNotReady.length)} PCS data sedang di input massal, tunggu sebentar... (0 detik)`, {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: false, // Jangan auto-close saat proses berjalan
        });

        // Perbarui hitungan detik di dalam toast setiap detik
        interval = setInterval(() => {
          elapsedSeconds += 1;
          toast.update(toastId, {
            render: `${parseInt(dataQtyReady.length) + parseInt(dataQtyNotReady.length)} PCS data sedang di input massal, tunggu sebentar... (${elapsedSeconds} detik)`,
          });
        }, 1000);

        if (dataQtyReady.length > 0) {
          const syncResponse = await axios.post(`http://localhost:4000/v1/syncordermassal`, {
            data: dataQtyReady,
            tanggal: dateskrg,
            id_store: idstore,
            users: Users,
            status_display: "display_false",
          });
          const { data } = syncResponse.data.result;
          // console.log("syncordermassal", data);

          if (syncResponse.data.status === "partially_processed") {
            toast.warning(syncResponse.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });
          } else if (syncResponse.data.status === "success") {
            toast.success(syncResponse.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });
          }

          if (data.skippedOrders.length > 0) {
            data.skippedOrders.forEach((order: any) => {
              toast.error(`Order ID ${order.id_pesanan} skipped: ${order.reason}`, {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: false,
              });
              dataQtyReady.forEach((ready: any) => {
                if (ready.id_pesanan === order.id_pesanan) {
                  skipOrder.push(ready)
                }
              });
            });
          }

          if (data.skippedPrices.length > 0) {
            data.skippedPrices.forEach((price: any) => {
              toast.error(`Order ID ${price.id_pesanan} skipped due to price issue: ${price.reason}`, {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: false,
              });
              dataQtyReady.forEach((ready: any) => {
                if (ready.id_pesanan === price.id_pesanan) {
                  skipHarga.push(ready)
                }
              });
            });
          }

          // Export to Excel jika ada skippedOrders atau skippedPrices
          if (data.skippedOrders.length > 0 || data.skippedPrices.length > 0) {
            const skippedOrdersSheet = data.skippedOrders.map((order: any) => ({
              "Order ID": order.id_pesanan,
              "Product ID": order.idproduk,
              Reason: order.reason,
            }
            ));

            const skippedPricesSheet = data.skippedPrices.map((price: any) => ({
              "Order ID": price.id_pesanan,
              "Product ID": price.idproduk,
              "Selling Price": price.frontendTotalAmount,
              "Minimum Price": price.requiredTotal,
              Reason: price.reason,
            }));

            // Buat workbook
            const workbook = XLSX.utils.book_new();

            if (skippedOrdersSheet.length > 0) {
              data.skippedOrders.forEach((order: any) => {
                toast.error(`Order ID ${order.id_pesanan} skipped: ${order.reason}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: false,
                });
                dataQtyReady.forEach((ready: any) => {
                  if (ready.id_pesanan === order.id_pesanan) {
                    skipOrder2.push(ready)
                  }
                });
              });

              const skippedOrdersWs = XLSX.utils.json_to_sheet(skippedOrdersSheet);
              XLSX.utils.book_append_sheet(workbook, skippedOrdersWs, "Skipped Orders");
            }

            if (skippedPricesSheet.length > 0) {
              const skippedPricesWs = XLSX.utils.json_to_sheet(skippedPricesSheet);
              XLSX.utils.book_append_sheet(workbook, skippedPricesWs, "Skipped Prices");
            }

            // Export workbook sebagai file Excel
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const fileName = `Skipped_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;

            saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);

            toast.info("Cek folder DOWNLOAD anda, file excel data yang gagal MASUK sudah di EXPORT !!", {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });
          }

          if (data.processedOrders.length > 0) {
            toast.success(`${data.processedOrders.length} order(s) successfully processed.`, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnHover: false,
              autoClose: false,
            });

            const processShippingData = async () => {
              // Ambil data pesanan yang telah diproses dari response sebelumnya
              const processedOrders = syncResponse.data.result.data.processedOrders;
              const shippingInputData: any = [];
              const shippingTokopediaData: any = [];
              const collectedOrderIds: any = []; // Tetap digunakan untuk mengumpulkan orderId yang unik

              // Preprocessing: Buat mapping dari externalOrderId ke array batch shipping (akses O(1))
              const batchShippingMap = bacthshipping.reduce((map: Map<string, any[]>, batch: any) => {
                const key = batch.externalOrderId;
                if (!map.has(key)) {
                  map.set(key, []);
                }
                map.get(key)!.push(batch);
                return map;
              }, new Map());

              // (Delay per pesanan dihilangkan untuk meningkatkan kecepatan proses)
              for (const order of processedOrders) {
                const matchedBatches = batchShippingMap.get(order.id_pesanan) || [];
                matchedBatches.forEach((batch: any) => {
                  shippingInputData.push({
                    channelid: channelid[0],
                    orderId: batch.orderId,
                    deliveryType: deliveryType,
                    shipmentProvider: batch.kurir,
                    shipmentProviderId: "",
                    trackingNo: "",
                    addressId: batch.addressId,
                    address: batch.address,
                    pickupTimeId: timepickup.split('.')[0],
                    timeText: timepickup.split('.')[1],
                    id_pesanan: order.id_pesanan,
                  });
                  shippingTokopediaData.push({ orderId: batch.orderId });
                });
              }

              // Panggil fungsi processShipping jika data shipping sudah terkumpul
              if (shippingInputData.length > 0) {
                processShippingMassal(
                  channelid,
                  shippingInputData,
                  shippingTokopediaData,
                  collectedOrderIds,
                  querymassal,
                  restartPageAndData,
                  fetchAndFinalizeShipping_massal
                );
              } else {
                console.warn("Tidak ada data shipping yang terkumpul, proses shipping dibatalkan.");
              }
            };

            await processShippingData();

          } else {
            alert("Tidak ada pesanan yang bisa di proses, periksa kembali hasil EXPORT di folder DOWNLOAD anda.");
            setmodalaturpengiriman_massal(false);
            restartPageAndData();
            setTimeout(function () {
              window.location.reload();
            }, 250);
            setTimeout(function () {
              window.location.reload();
            }, 250);
          }

          clearInterval(interval);
          toast.dismiss(toastId);

          // console.log("skipOrder.length", skipOrder);
          // console.log("skipHarga.length", skipHarga);

          if (skipOrder.length > 0) {
            await axios.post("http://localhost:4000/v1/insertgagalinput", {
              data: dataQtyNotReady,
              params: "SKIP_ORDER",
            });
          }

          if (skipOrder2.length > 0) {
            await axios.post("http://localhost:4000/v1/insertgagalinput", {
              data: skipOrder2,
              params: "SKIP_ORDER2",
            });
          }

          if (skipHarga.length > 0) {
            await axios.post("http://localhost:4000/v1/insertgagalinput", {
              data: skipHarga,
              params: "SKIP_HARGA",
            });
          }
        } else {
          alert("Tidak ada pesanan yang bisa di proses, periksa kembali hasil EXPORT di folder DOWNLOAD anda.");
          setmodalaturpengiriman_massal(false);
          restartPageAndData();
          setTimeout(function () {
            window.location.reload();
          }, 250);
          setTimeout(function () {
            window.location.reload();
          }, 250);
        }
      }
    } catch (error) {
      console.error("Error processing orders:", error);
    }
  }

  const [Name, setName] = useState(Cookies.get("auth_name"));

  async function processShippingMassal(
    channelid: string,
    shippingInputData: any[],
    shippingTokopediaData: any[],
    collectedOrderIds: any[],
    querymassal: any[],
    restartPageAndData: () => void,
    fetchAndFinalizeShipping_massal: (collectedOrderIds: any[], querymassal: any[]) => void
  ) {
    console.log("shippingInputData", shippingInputData);
    console.log("shippingInputData", shippingInputData.length);

    axios
      .post("http://localhost:4000/v1/history_massal", shippingInputData)
      .then(function (response) {
      });

    if (shippingInputData.length > 0) {
      try {
        let data: any = []; // Array untuk menyimpan orderId hanya yang sukses
        let dataakhir: any = []; // Array untuk menyimpan orderId hanya yang sukses
        let dataGagal: any = []; // Array untuk menyimpan orderId hanya yang sukses

        let toastId: any;
        let interval: any;
        let elapsedSeconds = 0;
        // Tampilkan toast saat proses dimulai
        toastId = toast.info(`${shippingInputData.length}, Pcs sedang di atur massal ke marketplace, tunggu sebentar... (0 detik)`, {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
          autoClose: false, // Jangan auto-close saat proses berjalan
        });

        interval = setInterval(() => {
          elapsedSeconds += 1;
          toast.update(toastId, {
            render: `${shippingInputData.length}, Pcs sedang di atur massal ke marketplace, tunggu sebentar... (${elapsedSeconds} detik)`,
          });
        }, 1000);

        if (channelid != "TOKOPEDIA_ID") {
          const response = await axios({
            method: "POST",
            url: "/api/aturshippingmassalmanual",
            data: {
              request_uri: "/openapi/v3/oms/order/rts",
              params: { batch: shippingInputData },
            },
          });
          const finalResponse = response.data;
          console.log("Final aggregated response from backend:", finalResponse);

          // Misalnya, kita dapat menampilkan data ordersId ke UI:
          const ordersData = finalResponse.ordersId.map((orderId: any) => ({ orderId }));
          console.log("Orders data:", ordersData);

          if (finalResponse.ordersId && Array.isArray(finalResponse.ordersId)) {
            finalResponse.ordersId.forEach((orderId: any) => {
              // data.push({ orderId });
              data.push({
                orderId: orderId,
                shippingStatus: finalResponse.code,
              });
            });
          }
          console.log("Combined data", data);

        } else {
          const acceptResponse = await axios({
            method: "POST",
            url: "/api/acceptorder",
            data: {
              request_uri: "/openapi/order/v1/accept",
              params: {
                orderId: shippingTokopediaData,
              },
            },
          });
          console.log("cek acceptResponse :", acceptResponse.data);
          const response = await axios({
            method: "POST",
            url: "/api/aturshippingmassalmanual",
            data: {
              request_uri: "/openapi/v3/oms/order/rts",
              params: { batch: shippingInputData },
            },
          });
          const finalResponse = response.data;
          console.log("Final aggregated response from backend:", finalResponse);

          // Misalnya, kita dapat menampilkan data ordersId ke UI:
          const ordersData = finalResponse.ordersId.map((orderId: any) => ({ orderId }));
          console.log("Orders data:", ordersData);

          if (finalResponse.ordersId && Array.isArray(finalResponse.ordersId)) {
            finalResponse.ordersId.forEach((orderId: any) => {
              // data.push({ orderId });
              data.push({
                orderId: orderId,
                shippingStatus: finalResponse.code,
              });
            });
          }
          console.log("Combined data", data);
        }
        clearInterval(interval);
        toast.dismiss(toastId);

        // const axiosPromises: any = [];
        querymassal.forEach((query: any) => {
          data.forEach((dats: any) => {
            if (query.orderId === dats.orderId) { // Periksa apakah orderId ada dalam array data[]
              if (dats.shippingStatus === "SUCCESS") {
                dataakhir.push(query);
              } else {
                dataGagal.push(query);
              }
            }
          });
        });

        console.log("data", data);
        console.log("dataakhir", dataakhir);
        console.log("dataGagal", dataGagal);

        const now = new Date();
        const datePart = now.toISOString().slice(0, 10);
        const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ";");
        const filename = `DATA SUCCESS ATUR MASSAL-${datePart + ' ' + timePart}.xlsx`;

        // Mengubah data menjadi Excel sheet
        const formattedData = dataakhir.flatMap((order: any, orderIndex: any) =>
          order.items.map((item: any, itemIndex: any) => ({
            No: orderIndex + 1,
            "Channel": order.channelId,
            "No Pesanan": order.externalOrderId,
            "Jasa Kirim": order.logisticsProviderName,
            Produk: item.productName,
            Size: `${item.spu}.${item.variationName}`,
            Qty: item.quantity,
            Amount: order.totalAmount,
          }))
        );
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, filename);

        setmodalaturpengiriman_massal(false);
        setTimeout(function () {
          setsycnorder([]);
          getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);

          // Reset modal dan state ke kondisi awal
          setmodalaturmassal(false);
          settotalresiaturmassal({ logisticsProviderName: {} });
          setrincianresimassal([]); // <-- tambahkan ini untuk reset dataAwal
        }, 2000);
      } catch (error) {
        console.error("Error processing shipping:", error);
      }
    } else {
      alert("Tidak ada pesanan yang bisa di proses, periksa kembali hasil EXPORT di folder DOWNLOAD anda.");
      setmodalaturpengiriman_massal(false);
      restartPageAndData();
      setTimeout(function () {
        window.location.reload();
      }, 250);
      setTimeout(function () {
        window.location.reload();
      }, 250);
    }
  }

  async function submitprintresi() {
    await axios({
      method: "POST",
      url: "/api/getprint",
      data: {
        request_uri: "/openapi/order/v1/print",
        params: {
          orderId: orderId,
          documentType: "LABEL"
        },
      },
    })
      .then(function (response) {
        window.open(response.data.data.pdfUrl, '_blank');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function submitprintresitest(orderid: any) {

    await axios({
      method: "POST",
      url: "/api/getprint",
      data: {
        request_uri: "/openapi/order/v1/print",
        params: {
          orderId: orderid,
          documentType: "LABEL"
        },
      },
    })
      .then(function (response) {
        window.open(response.data.data.pdfUrl, '_blank');
        getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function submitprintInstant(orderid: any) {
    axios({
      method: "POST",
      url: "/api/getprint",
      data: {
        request_uri: "/openapi/order/v1/print",
        params: {
          orderId: orderid,
          documentType: "LABEL"
        },
      },
    })
      .then(function (response) {
        window.open(response.data.data.pdfUrl, '_blank');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function AccCancelOrder(orderId: any, items: any) {
    let datas: any = [];
    items.forEach((element: any) => {
      datas.push(element.itemId)
    });

    await axios({
      method: "POST",
      url: "/api/apicancelorder",
      data: {
        request_uri: "/openapi/v3/oms/order/cancel",
        params: {
          orderId: orderId,
          orderItemIds: datas,
          cancelId: "OUT_OF_STOCK",
          cancelNote: "out of stock",
        },
      },
    })
      .then(function (response) {
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [value, setValues]: any = useState({
    startDate: format(subDays(startOfDay(new Date()), 4), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
  });

  const startDate = format(subDays(startOfDay(new Date()), 4), "yyyy-MM-dd");
  const lastDate = format(endOfDay(new Date()), "yyyy-MM-dd");
  const [date_start, setDate_start] = useState(
    new Date(startDate + " 00:00:00").toISOString()
  );
  const [date_end, setDate_end] = useState(
    new Date(lastDate + " 23:59:59").toISOString()
  );

  const today: any = "Hari Ini";
  const yesterday: any = "Kemarin";
  const currentMonth: any = "Bulan ini";
  const pastMonth: any = "Bulan Kemarin";
  const mingguinistart: any = format(startOfWeek(new Date()), "yyyy-MM-dd");
  const mingguiniend: any = format(lastDayOfWeek(new Date()), "yyyy-MM-dd");
  const break2month: any = format(
    subDays(lastDayOfWeek(new Date()), 66),
    "yyyy-MM-dd"
  );
  const minggukemarinstart: any = format(
    subDays(startOfWeek(new Date()), 7),
    "yyyy-MM-dd"
  );
  const minggukemarinend: any = format(
    subDays(lastDayOfWeek(new Date()), 7),
    "yyyy-MM-dd"
  );
  const todayDate: any = format(new Date(), "yyyy-MM-dd");
  var [StoreSync, setStoreSync] = useState("all");
  var [StatusCetak, setStatusCetak] = useState("all");
  var [filteruser, setfilteruser] = useState(Cookies.get("auth_role"));

  const handleValueChange = (newValue: any) => {
    setsycnorder([]);
    if (newValue.startDate === null || newValue.endDate === null) {
      setDate_start(new Date(startDate + " 00:00:00").toISOString());
      setDate_end(new Date(lastDate + " 23:59:59").toISOString());
      getdataorder(
        new Date(startDate + " 00:00:00").toISOString(),
        new Date(lastDate + " 23:59:59").toISOString(),
        activetab,
        Query,
        true,
        StoreSync,
        tabs,
        StatusCetak,
        filteruser,
        area,
        Brand
      );
    } else {
      setDate_start(new Date(newValue.startDate + " 00:00:00").toISOString());
      setDate_end(new Date(newValue.endDate + " 23:59:59").toISOString());
      getdataorder(
        new Date(newValue.startDate + " 00:00:00").toISOString(),
        new Date(newValue.endDate + " 23:59:59").toISOString(),
        activetab,
        Query,
        true,
        StoreSync,
        tabs,
        StatusCetak,
        filteruser,
        area,
        Brand
      );
    }
    setValues(newValue);
  };

  const scrollableDivRef = useRef(null);

  // Fungsi untuk memeriksa apakah pengguna sudah mencapai bagian bawah
  const handleScroll = () => {
    const div = scrollableDivRef.current;
    if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
      if (loadMore === false) {
        if (more) {
        }
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah item per halaman
  const totalPages = Math.ceil(querymassal.length / itemsPerPage);

  const [currentPagePending, setCurrentPagePending] = useState(1);
  const itemsPerPagePending = 20; // Sesuaikan dengan jumlah item per halaman
  const totalPagesPending = Math.ceil(data_pending.length / itemsPerPagePending);

  const handleNextPagePending = () => {
    setCurrentPagePending((prev) => Math.min(prev + 1, totalPagesPending)); // Pastikan tidak melewati total halaman
  };

  const handlePrevPagePending = () => {
    setCurrentPagePending((prev) => Math.max(prev - 1, 1)); // Pastikan tidak kurang dari halaman 1
  };

  const currentDataPending = data_pending.slice(
    (currentPagePending - 1) * itemsPerPagePending,
    currentPagePending * itemsPerPagePending
  );

  const handleExportToExcelPending = () => {
    // Mendapatkan waktu saat ini
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/T/, "_") // Ganti T dengan _
      .replace(/\..+/, "") // Hapus bagian milidetik
      .replace(/:/g, "-"); // Ganti ":" dengan "-"

    const filename = `data-pending-${timestamp}.xlsx`;

    // Mengubah data menjadi Excel sheet
    const formattedData = data_pending.map((order: any, orderIndex: any) => ({
      No: orderIndex + 1,
      Tanggal: order.tanggal,
      "No Pesanan": order.id_pesanan,
      "ID Produk": order.id_produk,
      Produk: order.produk,
      Size: order.size,
      "Qty Order": order.qtyOrder,
      "Qty Available": order.qtyReady,
      Amount: order.total_amount,
      "Selling Price": order.harga_jual_app,
      Desc: order.ket,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Simpan file Excel dengan nama yang sudah diformat
    XLSX.writeFile(workbook, filename);
  };

  const paginatedDataPending = currentDataPending.slice(
    (currentPagePending - 1) * itemsPerPagePending,
    currentPagePending * itemsPerPagePending
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Data untuk halaman saat ini
  const currentData = querymassal.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentData2 = querysatuan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Data untuk halaman saat ini
  // const currentData3 = querysatuanakhir_export.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  const handleExportToExcel = () => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ";");
    const filename = `data-export-sebelum-atur-massal-${datePart + ' ' + timePart}.xlsx`;

    // Mengubah data menjadi Excel sheet
    const formattedData = querymassal.flatMap((order: any, orderIndex: any) =>
      order.items.map((item: any, itemIndex: any) => ({
        No: orderIndex + 1,
        "No Pesanan": order.externalOrderId,
        Produk: item.productName,
        Size: `${item.spu}.${item.variationName}`,
        Qty: item.quantity,
        Amount: order.totalAmount,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Simpan file Excel
    XLSX.writeFile(workbook, filename);
  };

  const [currentPagePrintmassal, setCurrentPagePrintmassal] = useState(1);
  const itemsPerPagePrintmassal = 10; // Jumlah item per halaman
  const totalPagesPrintmassal = Math.ceil(querymassal.length / itemsPerPagePrintmassal);

  const currentDataPrintmassal = querymassal.slice(
    (currentPagePrintmassal - 1) * itemsPerPagePrintmassal,
    currentPagePrintmassal * itemsPerPagePrintmassal
  );

  const handlePrevPagePrintmassal = () => {
    if (currentPagePrintmassal > 1) setCurrentPagePrintmassal((prev) => prev - 1);
  };

  const handleNextPagePrintmassal = () => {
    if (currentPagePrintmassal < totalPagesPrintmassal) setCurrentPagePrintmassal((prev) => prev + 1);
  };

  const handleExportToExcelMassal = async () => {
    let datas: any = [];
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/cek_namaproduk`,
    })
      .then(function (response) {
        datas.push(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ";");
    const filename = `data-export-massal-${datePart + ' ' + timePart}.xlsx`;

    // Buat workbook dan worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Definisikan header
    const headers = [
      "No", "Channel", "Store", "No Pesanan", "Jasa Kirim",
      "Resi", "Produk", "Size", "Qty", "Amount"
    ];

    // Tambahkan header ke worksheet
    worksheet.addRow(headers);

    const formattedData: any = [];
    // Pastikan kita mengambil array data yang sebenarnya dari datas
    const flattenedDatas = datas.length > 0 ? datas[0] : [];

    querymassal.forEach((order: any, orderIndex: number) => {
      order.items.forEach((item: any) => {
        let matchingProduct: any = null;

        flattenedDatas.forEach((dataItem: any) => {
          // console.log("Comparing:", String(dataItem.id_produk).trim(), "==", String(item.spu).trim());
          if (String(dataItem.id_produk).trim() === String(item.spu).trim()) {
            matchingProduct = dataItem;
          }
        });

        formattedData.push({
          No: orderIndex + 1,
          Channel: order.channelId,
          Store: order.shopName,
          NoPesanan: order.externalOrderId,
          JasaKirim: order.logisticsProviderName,
          Resi: order.logisticsTrackingNumber,
          Produk: matchingProduct ? matchingProduct.produk : item.productName, // Gunakan nama dari datas jika ada
          Size: `${item.spu}.${item.variationName}`,
          Qty: item.quantity,
          Amount: order.totalAmount,
        });
      });
    });

    formattedData.forEach((row: Record<string, any>) => {
      worksheet.addRow(Object.values(row));
    });

    // Hitung duplikasi berdasarkan "No Pesanan"
    const orderIdCounts: Record<string, number> = {};
    formattedData.forEach((row: Record<string, any>) => {
      const orderId = row.NoPesanan as string;
      orderIdCounts[orderId] = (orderIdCounts[orderId] || 0) + 1;
    });

    // Terapkan styling pada header
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "000000" }
      };
    });

    // Terapkan styling pada duplikat "No Pesanan"
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        const noPesananCell = row.getCell(4);
        const noPesananValue = noPesananCell.value as string;

        if (orderIdCounts[noPesananValue] > 1) {
          row.eachCell(cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF99" } // Warna kuning
            };
          });
        }
      }
    });

    // Simpan workbook ke file
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(data, filename);
  };

  const handleExportToExcel2 = () => {
    // Mendapatkan waktu saat ini
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/T/, "_") // Ganti T dengan _
      .replace(/\..+/, "") // Hapus bagian milidetik
      .replace(/:/g, "-"); // Ganti ":" dengan "-"

    const filename = `data-export-massal-${timestamp}.xlsx`;
    // Mengubah data menjadi Excel sheet
    const formattedData = querymassal.flatMap((order: any, orderIndex: any) =>
      order.items.map((item: any, itemIndex: any) => ({
        No: orderIndex + 1,
        Produk: item.productName,
        Size: `${item.spu}.${item.variationName}`,
        Qty: item.quantity,
        Amount: order.totalAmount,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Simpan file Excel dengan nama yang sudah diformat
    XLSX.writeFile(workbook, filename);
  };

  const handleExportToExcel3 = () => {
    // Mengubah data menjadi Excel sheet
    const formattedData = querysatuanakhir_export.flatMap((order: any, orderIndex: any) =>
      order.items.map((item: any, itemIndex: any) => ({
        No: orderIndex + 1,
        "No Pesanan": order.externalOrderId,
        "Jasa Kirim": order.logisticsProviderName,
        "Resi": order.resi,
        Produk: item.productName,
        Size: `${item.spu}.${item.variationName}`,
        Qty: item.quantity,
        Amount: order.totalAmount,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Simpan file Excel
    XLSX.writeFile(workbook, "data-export.xlsx");
  };
  const [openpending, setopenpending] = React.useState(false);

  // Di bagian atas komponen (import React, useState, dll.)
  const [itemsPerPageUtama, setItemsPerPageUtama] = useState(100);
  const [currentPageUtama, setCurrentPageUtama] = useState(1);
  const [gopage, setGopage] = useState("");

  // Hitung total halaman berdasarkan itemsPerPageUtama
  const totalPagesUtama = Math.ceil(data_order.length / itemsPerPageUtama);

  // Pagination logic
  const indexOfLastItemUtama = currentPageUtama * itemsPerPageUtama;
  const indexOfFirstItemUtama = indexOfLastItemUtama - itemsPerPageUtama;
  const currentItemsUtama = data_order.slice(
    indexOfFirstItemUtama,
    indexOfLastItemUtama
  );

  const handleNextPageUtama = () => {
    if (currentPageUtama < totalPagesUtama) {
      setCurrentPageUtama(currentPageUtama + 1);
    }
  };

  const handlePrevPageUtama = () => {
    if (currentPageUtama > 1) {
      setCurrentPageUtama(currentPageUtama - 1);
    }
  };

  const DeletePendingData = async () => {
    try {
      const response = await axios.delete("http://localhost:4000/v1/deletependingdata");
      console.log("Pending data deleted successfully:", response.data);

      toast.success("Pending data deleted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 3000,
      });

      getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
    } catch (error) {
      console.error("Error deleting pending data:", error);

      toast.error("Failed to delete pending data.", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-5 pb-2 max-h-full overflow-y-auto">
      {/* ANIMASI LOADING */}
      {isSyncing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 flex flex-col items-center space-y-4 animate-fade-in">
            <ThreeDots
              height="100"
              width="100"
              color="#3b82f6"
              ariaLabel="loading"
            />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mt-4">
              Sedang Sinkronisasi...
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-300">
              Mohon tunggu sebentar, proses sedang berlangsung.
            </p>
          </div>
        </div>
      )}
      <div className="mb-3">
        <div className="grow content-center font-bold text-2xl pl-2 mb-1">
          API Orders
        </div>

        <div className=" flex flex-row mt-0 gap-3 text-black">
          <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
            <div className="text-md font-semibold py-4  px-5">Total Order</div>
            <div className="flex flex-row text-left  mt-2">
              <div className="basis-full text-lg font-semibold py-0 px-5">
                {/* {countReadytoship + countProcess + countCancel} Pesanan */}
                {(() => {
                  if (tabs === "READY_TO_SHIP") {
                    return (
                      <>
                        {countProcess} Pesanan
                      </>
                    );
                  } else if (tabs === "PROCESSED") {
                    return (
                      <>
                        {countReadytoship} Pesanan
                      </>
                    );
                  } else if (tabs === "PENDING") {
                    return (
                      <>
                        {countPending} Pesanan
                      </>
                    );
                  } else if (tabs === "IN_CANCEL") {
                    return (
                      <>
                        {countCancel} Pesanan
                      </>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
              <div className=" basis-auto mt-1 mx-5">
                <ClipboardDocumentIcon className="h-6 w-6 text-black text-right" />
              </div>
            </div>
          </div>
          <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
            <div className="text-md font-semibold py-4  px-5">Qty Order</div>
            <div className="flex flex-row text-left  mt-2">
              <div className="basis-full text-lg font-semibold py-0 px-5">
                {totalqty} Pcs
              </div>
              <div className=" basis-auto mt-1 mx-5">
                <Box className="h-6 w-6 text-black text-right" />
              </div>
            </div>
          </div>
          <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">
            <div className="text-md font-semibold py-4  px-5">Omzet</div>
            <div className="flex flex-row text-left  mt-2">
              <div className="basis-full text-lg font-semibold py-0 px-5">
                {Rupiah.format(totalamount)}
              </div>
              <div className=" basis-auto mt-1 mx-5">
                <DollarSignIcon className="h-6 w-6 text-black text-right" />
              </div>
            </div>
          </div>
          {data_pending.length > 0 ?
            (<>
              <div
                onClick={() => {
                  setopenpending(true);
                }}
                className="basis-1/3 bg-red-500 border border-gray-300 h-[110px] rounded-lg shadow-md hover:shadow-[0px_10px_11px_1px_#2125291A]">

                <div className="text-md font-semibold py-4  px-5">Pending</div>
                <div className="flex flex-row text-left mt-2">
                  <div className="basis-full text-lg font-semibold py-0 px-5">
                    {count_data_pending} Pesanan
                  </div>
                  <div className=" basis-auto mt-1 mx-5">
                    <ClipboardXIcon className="h-6 w-6 text-black text-right" />
                  </div>
                </div>
              </div>
            </>) : null}
        </div>
      </div>
      <div className="flex flex-row font-bold border-[#2125291A] mb-3 gap-3">
        <div className="grow content-center">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setQuery("all");
                getdataorder(date_start, date_end, activetab, "all", true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
              }
            }}
            onKeyDown={keyDown}
            className="h-[34px] w-[100%] font-medium py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-lg border"
            type="text"
            placeholder="Search..."
          />
        </div>

        {/* {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
          <>
            <div className="flex text-sm flex-row items-center w-[20%] justify-end">
              <select
                value={Brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  getdataorder(date_start, date_end, activetab, "all", true, StoreSync, tabs, StatusCetak, filteruser, area, e.target.value);
                  getbrand(Role, area, e.target.value);
                  getshopid(e.target.value);
                }}
                className={`appearance-none border h-[35px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}
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
        ) : null} */}
        {"SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role") || "HEAD-WAREHOUSE" === Cookies.get("auth_role") ?
          (
            <>
              <div className="basis-1/6">
                <div className="flex flex-wrap items-center justify-end text-sm">

                  <select
                    value={StoreSync}
                    onChange={(e) => {
                      setStoreSync(e.target.value);
                      getdataorder(date_start, date_end, activetab, "all", true, e.target.value, tabs, StatusCetak, filteruser, area, Brand);
                      // getCountData(date_start, date_end, Query, activetab, e.target.value, filteruser);
                    }}
                    className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                  >
                    <option value="all">All Marketplace</option>
                    {list_shop}
                  </select>


                </div>
              </div>
            </>
          )
          :
          null
        }

        <div className="basis-1/6 text-sm font-base ">
          <Datepicker
            displayFormat="DD-MM-YYYY"
            primaryColor="blue"
            value={value}
            onChange={handleValueChange}
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
            inputClassName="text-gray-500 h-[35px] font-medium py-2 px-4 w-full rounded-lg focus:outline-none border"
          />
        </div>

        <div className="basis-1/8">
          <button className=" bg-blue-500 font-medium text-white py-2 px-2 rounded-lg mr-2"
            onClick={() => {
              syncmarketplace(currentItemsUtama);
            }}
          >
            Sync Marketplace
          </button>
        </div>
      </div>

      <ToastContainer className="mt-[50px]" />
      <div className="bg-white pb-2 shadow-sm rounded-lg overflow-hidden mb-3 font-medium">
        <div className=" justify-between items-center border-b p-4 flex flex-row">
          <div className="flex space-x-4 mb-3 grow mt-2">
            <button
              className={`text-gray-600 ${tabs === "PENDING"
                ? "text-blue-600 border-b-2 border-black"
                : ""
                }`}
              onClick={() => {
                activeTab("PAID")
                setActiveTab2("PENDING")
              }}
            >
              Tertunda ({countPending})
            </button>
            <button
              className={`text-gray-600 ${tabs === "READY_TO_SHIP"
                ? "text-blue-600 border-b-2 border-black"
                : ""
                }`}
              onClick={() => {
                activeTab("PAID")
                setActiveTab2("READY_TO_SHIP")
              }}
            >
              Perlu Diproses ({countProcess})
            </button>
            <button
              className={`text-gray-600 ${tabs === "PROCESSED" || tabs === "400"
                ? "text-blue-600 border-b-2 border-black"
                : ""
                }`}
              onClick={() => {
                activeTab("READY_TO_SHIP")
                setActiveTab2("PROCESSED")
              }}
            >
              Telah Diproses ({countReadytoship})
            </button>
            <button
              className={`text-gray-600 ${tabs === "IN_CANCEL"
                ? "text-blue-600 border-b-2 border-black"
                : ""
                }`}
              onClick={() => {
                activeTab("READY_TO_SHIP")
                setActiveTab2("IN_CANCEL")
              }}
            >
              Pembatalan ({countCancel})
            </button>
            {/* <button
              className={`text-gray-600 ${tabs === "SHIPPING"
                ? "text-blue-600 border-b-2 border-black"
                : ""
                }`}
              onClick={() => {
                activeTab("SHIPPING")
                setActiveTab2("SHIPPING")
              }}
            >
              Dikirim ({countCancel})
            </button> */}
          </div>

          {StoreSync != "all" ?
            (
              <>
                <div className="text-gray-600 basis-1/12 flex space-x-4  justify-center">

                  {/* {activetab === "SHIPPIN / GPAID" ? ( */}
                  {activetab === "PAID" && tabs != "PENDING" ? (
                    <>
                      <button className=" bg-black font-medium text-white py-2 px-2 rounded-lg"
                        onClick={() => {
                          showmodalaturmassal(currentItemsUtama);
                        }}
                      >
                        Atur Pengiriman Massal
                      </button>
                    </>
                  ) : null}
                  {activetab === "READY_TO_SHIP" && StatusCetak != "all" ? (
                    <>
                      <button className=" bg-orange-500 font-medium text-white py-2 px-2 rounded-lg"
                        onClick={() => {
                          showmodal(currentItemsUtama);
                          // getprint();
                        }}
                      >
                        Cetak Label Massal
                      </button>
                    </>
                  ) : null}


                </div>
              </>
            ) : null}

          {StoreSync != "all" && "HEAD-STORE" === Cookies.get("auth_role") || "CASHIER" === Cookies.get("auth_role") ?
            (
              <>
                <div className="text-gray-600 basis-1/12 flex space-x-4  justify-center">

                  {activetab === "PAID" ? (
                    <>
                      <button className=" bg-black font-medium text-white py-2 px-2 rounded-lg"
                        onClick={() => {
                          showmodalaturmassal(currentItemsUtama);
                        }}
                      >
                        Atur Pengiriman Massal
                      </button>
                    </>
                  ) : null}
                  {activetab === "READY_TO_SHIP" && StatusCetak != "all" ? (
                    <>
                      <button className=" bg-orange-500 font-medium text-white py-2 px-2 rounded-lg"
                        onClick={() => {
                          showmodal(currentItemsUtama);
                          // getprint();
                        }}
                      >
                        Cetak Label Massal
                      </button>
                    </>
                  ) : null}

                </div>
              </>
            ) : null}


          {tabs === "PROCESSED" ?
            (<>
              <div className="text-gray-600 basis-2/12 text-right  pr-3">
                <select
                  value={StatusCetak}
                  onChange={(e) => {
                    setStatusCetak(e.target.value);
                    getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, e.target.value, filteruser, area, Brand);
                  }}
                  className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                >
                  <option value="all">Status Print</option>
                  <option value="PRINTED">Label SUDAH di cetak</option>
                  <option value="NOT_PRINTED">Label BELUM di cetak</option>
                </select>
              </div>
            </>)
            : null}

          <div className="text-gray-600 basis-28 text-center">
            {countReadytoship + countProcess} Show Order
          </div>
        </div>
      </div>


      <div
        ref={scrollableDivRef}
        onScroll={handleScroll}
        className="items-center rounded-md h-full overflow-y-auto scrollbar-none"
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : currentItemsUtama.length < 1 ? (
          <div className="text-center mt-10">Belum ada pesanan terbaru..</div>
        ) : (
          currentItemsUtama.map((data_order: any, index: any) => {
            return (
              <div key={index}>
                <div className="p-4 bg-white rounded-lg text-xs border mb-3">
                  {/* <div id="loading" style="display: none;">Loading...</div> */}
                  {/* {no_urut++} */}

                  <div className="flex flex-row items-center border-b py-2 -mt-3">
                    <div className="basis-1/2 text-left">
                      <span>{index + 1}) </span>
                      <span className="text-blue-600">
                        {data_order.channelId === "TOKOPEDIA_ID"
                          ? data_order.externalOrderSn.includes("/") ? data_order.externalOrderSn.split('/')[3] : data_order.externalOrderSn : data_order.externalOrderId
                        }
                      </span>
                    </div>
                    <div
                      className={`${data_order.externalOrderStatus === "CANCELLED"
                        ? "text-red-600"
                        : data_order.externalOrderStatus === "SHIPPING"
                          ? "text-blue-600"
                          : data_order.externalOrderStatus === "COMPLETED"
                            ? "text-lime-600"
                            : data_order.externalOrderStatus === "TO_CONFIRM_RECEIVE"
                              ? "text-purple-600"
                              : ""
                        } basis-1/2 text-right font-medium`}
                    >
                      {data_order.externalOrderStatus === "READY_TO_SHIP" ? (
                        <>
                          <span>Perlu Diproses</span>
                        </>
                      ) : data_order.externalOrderStatus === "PENDING" ? (
                        <>
                          <span>Pending / Tertunda</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {data_order.items.map((data_items: any, index3: number) => {
                    const totalActualPrice = data_order.items.reduce(
                      (sum: number, item: any) => {
                        return sum + parseInt(item.actualPrice); // Pastikan data_items.actualPrice adalah angka
                      },
                      0
                    );

                    const totalqtyorder = data_order.items.reduce(
                      (sum: number, item: any) => {
                        return sum + parseInt(item.quantity); // Pastikan data_items.actualPrice adalah angka
                      },
                      0
                    );
                    return (
                      <div key={index3}>
                        <div className="flex flex-row items-center border-b py-2">
                          <div className="basis-1/3 flex items-center">
                            <img
                              src={data_items.productImageUrl}
                              alt="Product image with 60% off label"
                              className="w-12 h-12 mr-5"
                            />
                            <div>
                              <div className="text-gray-800">
                                {data_items.productName}
                              </div>
                              <div className="text-gray-600">
                                Variasi, {data_items.variationName}
                              </div>
                              <div className="text-gray-600">
                                [SKU:{data_items.sku}]
                              </div>
                              <div className="text-blue-600">
                                <span className="text-gray-600">Harga Awal,</span>{" "}
                                {Rupiah.format(data_items.actualPrice)} x{" "}
                                {data_items.quantity}
                              </div>
                            </div>
                          </div>
                          {index3 === 0 ? (
                            <>
                              <div className="grow text-center">
                                <div className="text-gray-800">
                                  <img
                                    src={data_order.channelId === "SHOPEE_ID" ? 'http://localhost:4000/public/images/icon_shopee.png' : data_order.channelId === "TIKTOK_ID" ? 'http://localhost:4000/public/images/icon_tiktok.png' : data_order.channelId === "TOKOPEDIA_ID" ? 'http://localhost:4000/public/images/icon_tokopedia.png' : null}
                                    // className="w-7 -mb-5 -mr-5"
                                    className={data_order.channelId === "SHOPEE_ID" ? 'w-7 -mb-5 -mr-5' : data_order.channelId === "TIKTOK_ID" ? 'w-7 -mb-5 -mr-5' : data_order.channelId === "TOKOPEDIA_ID" ? 'w-5 -mb-5 -mr-5' : null}
                                  />
                                  Total Produk: {totalqtyorder}
                                </div>
                              </div>
                              <div className="grow text-center">

                                {list_getshopid.map(
                                  (data_shop: any, index2: number) => {
                                    return (
                                      <div key={index2}>
                                        {data_order.shopId === data_shop.shopId ? (
                                          <>{data_shop.name}</>
                                        ) : null}
                                      </div>
                                    );
                                  }
                                )}
                                <div className="text-gray-800">
                                  {data_order.logisticsInfos[0].logisticsProviderName}
                                </div>
                                <div className="text-gray-800">
                                  {
                                    data_order.logisticsInfos[0]
                                      .logisticsTrackingNumber
                                  }
                                </div>
                              </div>
                              <div className="grow text-center">
                                <div className="text-gray-800">
                                  {data_order.paymentMethod}
                                </div>
                                <div className="text-blue-800 font-semibold">
                                  {/* {Rupiah.format(data_order.totalAmount)} */}
                                  {Rupiah.format(data_order.channelId === "SHOPEE_ID"
                                    ? data_order.paymentInfo.totalAmount
                                    : data_order.channelId === "TOKOPEDIA_ID"
                                      ? parseInt(data_order.paymentInfo.subTotal) - (parseInt(data_order.paymentInfo.subTotal) * 0.12)
                                      : data_order.channelId === "TIKTOK_ID"
                                        ? parseInt(data_order.paymentInfo.subTotal + data_order.paymentInfo.voucherPlatform) - (parseInt(data_order.paymentInfo.subTotal + data_order.paymentInfo.voucherPlatform) * 0.175) - (parseInt(data_order.paymentInfo.subTotal + data_order.paymentInfo.voucherPlatform) * 0.03)
                                        : 0)}
                                </div>

                                {data_order.externalOrderStatus === "CANCELLED" ? (
                                  <>
                                    <div className="text-red-600 font-light italic">
                                      {Rupiah.format(0)}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-red-600 font-light italic">
                                      -
                                      {Rupiah.format(
                                        parseInt(totalActualPrice) -
                                        parseInt(data_order.totalAmount)
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="grow text-center">
                                <div className="text-gray-800">Waktu Pembuatan</div>
                                <div className="text-gray-600">
                                  {format(
                                    parseISO(data_order.externalCreateAt),
                                    "yyyy-MM-dd HH:mm"
                                  )}
                                </div>
                                <div className="text-gray-800">Waktu Pembayaran</div>
                                <div className="text-gray-600">
                                  {data_order.payAt ? (
                                    (() => {
                                      try {
                                        return format(parseISO(data_order.payAt), "yyyy-MM-dd HH:mm");
                                      } catch {
                                        return "Format tanggal salah";
                                      }
                                    })()
                                  ) : (
                                    "Tanggal tidak tersedia"
                                  )}
                                </div>
                              </div>
                              <div className="basis-36 text-center">
                                {data_order.externalOrderStatus != "IN_CANCEL" ? (
                                  <>
                                    {data_order.orderStatus ===
                                      "PAID" && tabs != "PENDING" ? (
                                      <>
                                        {data_order.externalOrderStatus === "220" ?
                                          (
                                            <>
                                              <button
                                                disabled={
                                                  orderId === data_order.orderId
                                                    ? true
                                                    : false
                                                }
                                                onClick={() => {
                                                  aturPengiriman(
                                                    data_order.orderId,
                                                    data_order.externalOrderId,
                                                    data_order.externalOrderSn,
                                                    data_items.productName,
                                                    data_items.variationName,
                                                    data_items.productImageUrl,
                                                    formatISO(parseISO(data_order.externalCreateAt), { representation: "date" }),
                                                    data_order.shopId,
                                                    data_order.totalAmount,
                                                    data_items.spu,
                                                    data_items.quantity,
                                                    data_order.channelId,
                                                    data_items.sku,
                                                    data_order
                                                  );
                                                  // cekgetdetail(data_order.orderId)
                                                }}
                                                className={`${orderId === data_order.orderId
                                                  ? "bg-green-800"
                                                  : "bg-green-500"
                                                  } font-medium  text-white py-2 px-2 rounded-lg`}
                                              >
                                                {orderId === data_order.orderId
                                                  ? "Loading.."
                                                  : "Terima Pesanan"}
                                              </button>
                                            </>
                                          ) :
                                          (
                                            <>
                                              <button
                                                disabled={
                                                  orderId === data_order.orderId
                                                    ? true
                                                    : false
                                                }
                                                onClick={() => {
                                                  aturPengiriman(
                                                    data_order.orderId,
                                                    data_order.externalOrderId,
                                                    data_order.externalOrderSn,
                                                    data_items.productName,
                                                    data_items.variationName,
                                                    data_items.productImageUrl,
                                                    formatISO(parseISO(data_order.externalCreateAt), { representation: "date" }),
                                                    data_order.shopId,
                                                    data_order.totalAmount,
                                                    data_items.spu,
                                                    data_items.quantity,
                                                    data_order.channelId,
                                                    data_items.sku,
                                                    data_order
                                                  );
                                                  // cekgetdetail(data_order.orderId)
                                                }}
                                                className={`${orderId === data_order.orderId
                                                  ? "bg-gray-600"
                                                  : "bg-[#323232]"
                                                  } font-medium  text-white py-2 px-2 rounded-lg`}
                                              >
                                                {orderId === data_order.orderId
                                                  ? "Loading.."
                                                  : "Atur Pengiriman"}
                                              </button>
                                            </>
                                          )}

                                        {data_order.logisticsInfos[0].logisticsProviderName === "SPX Instant" || data_order.logisticsInfos[0].logisticsProviderName === "GoSend Instant" ?
                                          (<>
                                            <button className="font-medium bg-orange-500 text-white py-2 px-2 rounded-lg mt-2"
                                              onClick={() => {
                                                submitprintInstant(data_order.orderId)
                                              }}
                                            >
                                              Cetak Label
                                            </button>
                                          </>) : null}
                                      </>
                                    ) : data_order.externalOrderStatus ===
                                      "PROCESSED" || data_order.externalOrderStatus ===
                                      "400" || data_order.externalOrderStatus ===
                                      "AWAITING_COLLECTION" || data_order.logisticsInfos[0].logisticsTrackingNumber != null ? (
                                      <>
                                        {data_order.logisticsInfos[0].logisticsTrackingNumber != "" ?
                                          (
                                            <>
                                              <button className="font-medium bg-orange-500 text-white py-2 px-2 rounded-lg"
                                                onClick={() => {
                                                  // repeatsubmitprintresi(data_order.orderId);
                                                  // submitprintresitest(data_order.orderId)
                                                  showmodalsatuan(data_order)
                                                }}
                                              >
                                                Cetak Label
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                disabled={
                                                  orderId === data_order.orderId
                                                    ? true
                                                    : false
                                                }
                                                onClick={() => {
                                                  synctokped(
                                                    data_order.orderId,
                                                  );
                                                  // cekgetdetail(data_order.orderId)
                                                }}
                                                className={`${orderId === data_order.orderId
                                                  ? "bg-gray-600"
                                                  : "bg-green-500"
                                                  } font-medium  text-white py-2 px-2 rounded-lg`}
                                              >
                                                {orderId === data_order.orderId
                                                  ? "Loading.."
                                                  : "Sync Tokopedia"}
                                              </button>
                                            </>
                                          )}
                                        <div>
                                          {data_order.printInfo?.labelPrintStatus === "PRINTED" ? (
                                            <div className="font-semibold"> {data_order.printInfo.labelPrintStatus}</div>
                                          ) : (
                                            <span>Resi Belum Di Print {data_order.printInfo?.labelPrintStatus}</span>
                                          )}
                                        </div>
                                      </>
                                    ) : data_order.externalOrderStatus ===
                                      "IN_CANCEL" ? (
                                      <>
                                        <button className="font-medium bg-red-600 semi-bold text-white py-2 px-2 rounded-lg"
                                          onClick={() => {
                                            AccCancelOrder(data_order.orderId, data_order)
                                          }}
                                        >
                                          Approved
                                        </button>
                                        <div>
                                          <span className="font-semibold">CANCEL BY :  {data_order.cancelInfo.cancelBy}</span>
                                        </div>
                                      </>
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    <button className="font-medium bg-red-600 semi-bold text-white py-2 px-2 rounded-lg"
                                      onClick={() => {
                                        AccCancelOrder(data_order.orderId, data_order.items)
                                      }}
                                    >
                                      Approved
                                    </button>
                                    <div>
                                      <span className="font-semibold">CANCEL BY :  {data_order.cancelInfo.cancelBy}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex flex-row items-center py-2">
                    <div className="basis-1/2 text-left -mb-3">
                      <span className="text-black">
                        Batas Kirim :{" "}
                        <span className="text-red-600">
                          {data_order.promisedToShipBefore != null
                            ? format(
                              parseISO(data_order.promisedToShipBefore),
                              "yyyy-MM-dd HH:mm"
                            )
                            : "-"}
                        </span>{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div >
            );
          })
        )}
      </div>

      {/* Tampilan Pagination */}
      {/* Tampilan Pagination */}
      {/* Dropdown untuk mengubah jumlah item per halaman (pojok kanan bawah) */}
      <div className="flex justify-end mb-4">
        <select
          className="border border-gray-300 rounded-md px-2 py-1 text-gray-700"
          value={itemsPerPageUtama}
          onChange={(e) => {
            setItemsPerPageUtama(Number(e.target.value));
            setCurrentPageUtama(1); // reset ke halaman 1 tiap ganti jumlah
          }}
        >
          <option value={50}>50 / halaman</option>
          <option value={100}>100 / halaman</option>
          <option value={150}>150 / halaman</option>
        </select>
      </div>

      <div className="grow mb-2 font-medium text-center text-gray-500 justify-center items-center">
        {currentPageUtama === 1 ? (
          <>Show Page {1} - From Page {totalPagesUtama}</>
        ) : (
          <>Show Page {currentPageUtama} - From Page {totalPagesUtama}</>
        )}
      </div>

      <div className="mt-3 text-center flex flex-row mb-4 justify-center items-center">
        <div className="flex flex-row shadow-2xl">
          <ul className="basis-1/6">
            <li className="grow font-medium bg-white hover:bg-gray-100 cursor-pointer h-[35px] w-[70px] text-md pt-1 text-gray-500 rounded-l-3xl">
              <button className="pt-0.5" onClick={handlePrevPageUtama}>
                {"< Prev"}
              </button>
            </li>
          </ul>

          {(() => {
            let rows = [];
            const startPage = Math.max(1, currentPageUtama - 2);
            const endPage = Math.min(totalPagesUtama, currentPageUtama + 2);
            for (let page = startPage; page <= endPage; page++) {
              rows.push(
                <ul key={page} className="flex flex-row basis-1/6 items-center">
                  <li
                    className={`basis-1/8 font-medium bg-white hover:bg-gray-100 cursor-pointer h-[35px] w-[35px] text-gray-500 ${page === currentPageUtama ? "bg-gray-200" : ""
                      }`}
                  >
                    <button className="pt-1.5" onClick={() => setCurrentPageUtama(page)}>
                      {page}
                    </button>
                  </li>
                </ul>
              );
            }
            return rows;
          })()}

          <ul className="basis-1/6">
            <li className="grow font-medium bg-white hover:bg-gray-100 cursor-pointer h-[35px] w-[70px] text-md pt-1 text-gray-500 rounded-r-3xl">
              <button className="pt-0.5" onClick={handleNextPageUtama}>
                {"Next >"}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 text-center flex flex-row mb-4 justify-center items-center">
        <div className="flex flex-row text-center justify-center items-center text-gray-500">
          <span className="font-medium mr-2">
            in total {totalPagesUtama} pages to
          </span>
          <input
            type="text"
            className="w-[75px] border rounded-md px-3 py-1 text-center"
            value={gopage}
            onChange={(e) => {
              const n = e.target.value === "" ? "" : e.target.value.replace(/\D/g, "");
              setGopage(n);
            }}
          />
          <span className="font-medium ml-2">page</span>
          <button
            className="bg-white px-3 py-1 ml-2 border rounded-md font-bold hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const targetPage = parseInt(gopage, 10);
              if (targetPage > totalPagesUtama) {
                toast.warning("Number of pages more than available", {
                  position: toast.POSITION.TOP_RIGHT,
                  pauseOnHover: false,
                  autoClose: 500,
                });
              } else if (targetPage < 1 || isNaN(targetPage)) {
                setCurrentPageUtama(1);
              } else {
                setCurrentPageUtama(targetPage);
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>



      {modalaturpengiriman ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">Atur Pengiriman Satuan</span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">Details</span>
                    <span className="">No Pesanan : {externalOrderId}</span>
                    <span className="">Product : {productName}</span>
                    <span className="">Variation : {variationName}</span>
                    <img
                      src={productImageUrl}
                      alt="Product image with 60% off label"
                      className="w-12 h-12 mr-5"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span>
                      Marketplace : {channelid}
                    </span>
                    <span>
                      Delivery Type: {logistics[0]["logisticsDeliveryType"]}
                    </span>
                    <span>
                      Kurir:{" "}
                      {
                        logistics[0]["logisticDetailList"][0][
                        "logisticsProviderName"
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex flex-row gap-1 -mt-3">
                    <div className="sm:overflow-x-auto overflow-hidden grow">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
                        <thead>
                          <tr className="bg-gray-100 text-xs">
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[5%]">NO</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[15%]">NO PESANAN</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[15%]">Jasa Kirim</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center">PRODUK</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[15%]">SIZE</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[5%]">QTY</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[10%]">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData2.map((order: any, index: any) => (
                            <React.Fragment key={index}>
                              {order.items.map((item: any, itemIndex: any) => (
                                <tr
                                  key={`${index}-${itemIndex}`}
                                  className={index % 2 === 0 ? "bg-white text-center" : "bg-gray-50 text-center"}
                                >
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs font-semibold">
                                    {(currentPage - 1) * itemsPerPage + index * order.items.length + itemIndex + 1}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.externalOrderId}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.logisticsProviderName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.productName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.spu}.{item.variationName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.quantity}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {Rupiah.format(order.totalAmount)}
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination and Export Controls */}
                      <div className="flex justify-between items-center mt-4">
                        {/* Pagination Controls */}
                        <div className="flex space-x-4">
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>
                          <span className=" content-center">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>

                        {/* Export to Excel Button */}
                        <button
                          className="px-4 py-2 bg-lime-700 font-bold text-white rounded hover:bg-blue-600"
                          onClick={handleExportToExcel2}
                        >
                          Export to Excel
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="">Kurir</span>
                    <select
                      value={kurir}
                      onChange={(e) => {
                        setkurir(e.target.value);
                      }}
                      className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                    >
                      {logistics.map((data: any, index: number) => {
                        return (
                          <option
                            key={index}
                            value={
                              data.logisticDetailList[0][
                              "logisticsProviderName"
                              ]
                            }
                          >
                            {
                              data.logisticDetailList[0][
                              "logisticsProviderName"
                              ]
                            }
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {channelid === "SHOPEE_ID" && logistics[0]["logisticsDeliveryType"] !== "DROP_OFF" ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="">Alamat Pickup</span>
                        <select
                          value={alamat_pickup}
                          onChange={(e) => {
                            gettimepickup(e.target.value);
                            setalamat_pickup(e.target.value);
                            settimepickup("");
                          }}
                          className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                        >
                          <option value="">Pilih Alamat</option>
                          {addresses.map((data: any, index: number) => {
                            return (
                              <option
                                key={index}
                                value={data.addressId + "#" + data.address}
                              >
                                {data.address}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="">Waktu Pickup</span>
                        <select
                          value={timepickup}
                          onChange={(e) => {
                            settimepickup(e.target.value);
                          }}
                          className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                        >
                          <option value="">Pilih Waktu Pickup</option>
                          {datatimepickup.length > 0
                            ? datatimepickup[0]["pickupTimeList"].map(
                              (data: any, index: number) => {
                                return (
                                  <option key={index} value={data.pickupTimeId}>
                                    {data.timeText}
                                  </option>
                                );
                              }
                            )
                            : null}
                        </select>
                      </div>
                    </>
                  ) : null}

                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalaturpengiriman(false);
                      setorderId("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`bg-[#323232] text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    // disabled={tukermodel_submit}
                    onClick={() => {
                      submitAturPengiriman(channelid, querysatuan);
                    }}
                  >
                    Atur Pengiriman
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {modalaturpengiriman_massal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">Atur Pengiriman Massal text</span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-3 flex flex-col gap-4">
                  <div className="flex flex-row text-center font-semibold gap-3 mt-1">
                    <div className="grow rounded-lg py-3 border border-gray-300 shadow-sm">
                      Marketplace&nbsp;: &nbsp;
                      {channelid.map((order: any, index: number) => (
                        <span key={index}>
                          {order} {/* Langsung tampilkan tanpa JSON.stringify */}
                          {index < channelid.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row text-center font-semibold mb-3  gap-3">
                    <div className="basis-1/3 rounded-lg py-3 border border-gray-300 shadow-sm">
                      Total Pesanan : {totalaturmassal}
                    </div>
                    <div className="basis-1/3 rounded-lg py-3 border border-gray-300 shadow-sm">
                      Delivery Type: {logistics[0]["logisticsDeliveryType"]}
                    </div>
                    <div className="basis-1/3 rounded-lg py-3 border border-gray-300 shadow-sm">
                      Kurir:{" "}
                      {
                        logistics[0]["logisticDetailList"][0][
                        "logisticsProviderName"
                        ]
                      }
                    </div>
                  </div>
                  <div className="flex flex-row gap-1 -mt-3 h-[600]">
                    <div className="sm:overflow-x-auto overflow-hidden grow">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
                        <thead>
                          <tr className="bg-gray-100 text-xs">
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[5%]">NO</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[15%]">NO PESANAN</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center">PRODUK</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[15%]">SIZE</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[5%]">QTY</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[10%]">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((order: any, index: number) => {
                            return order.items.map((item: any, itemIndex: number) => {
                              const isFirstItem = itemIndex === 0;
                              const rowspanCount = order.items.length;
                              const rowNumber = (currentPage - 1) * itemsPerPage + index + 1; // Nomor Urut

                              return (
                                <tr key={`${index}-${itemIndex}`} className={index % 2 === 0 ? "bg-white text-center" : "bg-gray-50 text-center"}>
                                  {/* Nomor Urut - hanya di baris pertama dengan rowspan */}
                                  {isFirstItem && (
                                    <td
                                      className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs font-semibold align-middle"
                                      rowSpan={rowspanCount}
                                    >
                                      {rowNumber}
                                    </td>
                                  )}

                                  {/* NO PESANAN - hanya di baris pertama dengan rowspan */}
                                  {isFirstItem && (
                                    <td
                                      className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs font-semibold align-middle"
                                      rowSpan={rowspanCount}
                                    >
                                      {order.externalOrderId}
                                    </td>
                                  )}

                                  {/* Produk */}
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.productName}
                                  </td>

                                  {/* Size */}
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.spu}.{item.variationName}
                                  </td>

                                  {/* Quantity */}
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.quantity}
                                  </td>

                                  {/* Amount - hanya di baris pertama dengan rowspan */}
                                  {isFirstItem && (
                                    <td
                                      className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs font-semibold align-middle"
                                      rowSpan={rowspanCount}
                                    >
                                      {Rupiah.format(order.totalAmount)}
                                    </td>
                                  )}
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>

                      {/* Pagination and Export Controls */}

                    </div>

                  </div>
                  <div className="flex justify-between items-center mt-4">
                    {/* Pagination Controls */}
                    <div className="flex space-x-4">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <span className=" content-center">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>

                    {/* Export to Excel Button */}
                    <button
                      className="px-4 py-2 bg-lime-700 font-bold text-white rounded hover:bg-blue-600"
                      onClick={handleExportToExcel}
                    >
                      Export to Excel
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="">Kurir</span>
                    <select
                      value={kurir}
                      onChange={(e) => {
                        setkurir(e.target.value);
                      }}
                      className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                    >
                      {logistics.map((data: any, index: number) => {
                        return (
                          <option
                            key={index}
                            value={
                              data.logisticDetailList[0][
                              "logisticsProviderName"
                              ]
                            }
                          >
                            {
                              data.logisticDetailList[0][
                              "logisticsProviderName"
                              ]
                            }
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {channelid[0] === "SHOPEE_ID" && logistics[0]["logisticsDeliveryType"] !== "DROP_OFF" ?
                    (
                      <>
                        <div className="flex flex-col gap-1">
                          <span className="">Alamat Pickup</span>
                          <select
                            value={alamat_pickup}
                            onChange={(e) => {
                              gettimepickup(e.target.value);
                              setalamat_pickup(e.target.value);
                              settimepickup("");
                            }}
                            className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                          >
                            <option value="">Pilih Alamat</option>
                            {addresses.map((data: any, index: number) => {
                              return (
                                <option
                                  key={index}
                                  value={data.addressId + "#" + data.address}
                                >
                                  {data.address}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="">Waktu Pickup</span>
                          <select
                            value={timepickup}
                            onChange={(e) => {
                              settimepickup(e.target.value);
                            }}
                            className={`border h-[35px] w-[100%] px-5 font-medium text-gray-700 focus:outline-none rounded-lg`}
                          >
                            <option value="">Pilih Waktu Pickup</option>
                            {datatimepickup.length > 0
                              ? datatimepickup[0]["pickupTimeList"].map(
                                (data: any, index: number) => {
                                  return (
                                    <option key={index} value={data.pickupTimeId + '.' + data.timeText}>
                                      {data.timeText}
                                    </option>
                                  );
                                }
                              )
                              : null}
                          </select>
                        </div>
                      </>
                    ) : null
                  }
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-600 text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalaturpengiriman_massal(false);
                      setquerymassal("");
                      setalamat_pickup("");
                      settimepickup("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`bg-[#323232] text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    onClick={() => {
                      submitAturPengirimanMassal(querymassal);
                    }}
                  >
                    Atur Pengiriman Massal
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {modalaturpengiriman_massal_printaja ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className=" ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold">Print Resi ss</span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-3 flex flex-col gap-4">
                  <div className="flex flex-row text-center font-semibold gap-3 mt-1">
                    <div className="grow rounded-lg py-3 border border-gray-300 shadow-sm">
                      Marketplace&nbsp;: &nbsp;
                      {channelid.map((order: any, index: number) => (
                        <span key={index}>
                          {order}
                          {index < channelid.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row text-center font-semibold mb-3  gap-3">
                    <div className="basis-1/3 rounded-lg py-3 border border-gray-300 shadow-sm">
                      Total Pesanan : {totalaturmassal}
                    </div>
                    <div className="basis-1/3 rounded-lg py-3 border border-gray-300 shadow-sm">
                      Delivery Type: {logistics[0]["logisticsDeliveryType"]}
                    </div>
                    <div className="basis-1/3 rounded-lg py-3 border border-gray-300 shadow-sm">
                      Kurir:{" "}
                      {
                        logistics[0]["logisticDetailList"][0][
                        "logisticsProviderName"
                        ]
                      }
                    </div>
                  </div>
                  <div className="flex flex-row gap-1 -mt-3">
                    <div className="sm:overflow-x-auto overflow-hidden grow">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base h-[600px]">
                        <thead>
                          <tr className="bg-gray-100 text-xs">
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[2%]">NO</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center">CHANNEL</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center">STORE</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[15%]">NO PESANAN</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[10%]">JASA KIRIM</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[10%]">RESI</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center">PRODUK</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[10%]">SIZE</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[2%]">QTY</th>
                            <th className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-center w-[7%]">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDataPrintmassal.map((order: any, index: any) => (
                            <React.Fragment key={index}>
                              {order.items.map((item: any, itemIndex: any) => (
                                <tr
                                  key={`${index}-${itemIndex}`}
                                  className={index % 2 === 0 ? "bg-white text-center" : "bg-gray-50 text-center"}
                                >
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs font-semibold">
                                    {(currentPagePrintmassal - 1) * itemsPerPagePrintmassal + index + 1}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.channelId}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.shopName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.externalOrderId}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.logisticsProviderName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {order.logisticsTrackingNumber}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.productName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.spu}.{item.variationName}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {item.quantity}
                                  </td>
                                  <td className="border border-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-xs">
                                    {Rupiah.format(order.totalAmount)}
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination and Export Controls */}

                    </div>

                  </div>
                  <div className="flex justify-between items-center mt-4">
                    {/* Pagination Controls */}
                    <div className="flex space-x-4">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                        onClick={handlePrevPagePrintmassal}
                        disabled={currentPagePrintmassal === 1}
                      >
                        Prev
                      </button>
                      <span className=" content-center">
                        Page {currentPagePrintmassal} of {totalPagesPrintmassal}
                      </span>
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                        onClick={handleNextPagePrintmassal}
                        disabled={currentPagePrintmassal === totalPagesPrintmassal}
                      >
                        Next
                      </button>
                    </div>

                    {/* Export to Excel Button */}
                    <button
                      className="px-4 py-2 bg-lime-700 font-bold text-white rounded hover:bg-blue-600"
                      onClick={handleExportToExcelMassal}
                    >
                      Export to Excel
                    </button>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-600 text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalaturpengiriman_massal_printaja(false);
                      setquerymassal("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`bg-orange-600 text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    onClick={() => {
                      getprintsatuan(printproviderName, querymassal);
                      handleExportToExcelMassal()
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {modalprint ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[400px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold ">Cetak Label Pengiriman</span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-center text-2xl">{noresi}</span>
                    <span className="text-xs text-center">{externalOrderId}</span>
                    <span className="text-xs text-center">{productName} : {variationName}</span>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalprint(false);
                      setorderId("");
                      getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
                      // getCountData(date_start, date_end, Query, activetab, StoreSync, filteruser);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`bg-orange-500 text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    // disabled={tukermodel_submit}
                    onClick={() => {
                      submitprintresi();
                    }}
                  >
                    Cetak Label
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {modalgetprint ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[400px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold ">Cetak Massal Label Pengiriman</span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    {Object.entries(totalsubresi.logisticsProviderName as Record<string, number>).map(
                      ([providerName, count], index) => (
                        <div key={index}>
                          <button
                            className={`bg-orange-500 text-white font-bold uppercase text-sm px-3 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                            type="button"
                            onClick={() => {
                              // getprintsatuan(providerName, dataPrint2);
                              logisticmassalPrint(providerName, dataPrint2, channelidMassal);
                            }}
                          >
                            {providerName}{" : "} {count}
                          </button>
                        </div>
                      )
                    )}


                  </div>
                  {/* <div className="flex flex-col gap-1">
                    <button
                      className={`bg-orange-500 text-white font-bold uppercase text-sm px-3 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                      type="button"
                      onClick={() => {
                        getprint();
                      }}
                    >
                      Print All
                    </button>
                  </div> */}

                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalgetprint(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {modalgetprintsatuan ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[400px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold ">Cetak Label Pengiriman</span>
                </div>
                {/*body*/}
                <div className="relative text-sm p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    {Object.entries(totalsubresi.logisticsProviderName as Record<string, number>).map(
                      ([providerName, count], index) => (
                        <div key={index}>
                          <button
                            className={`bg-orange-500 text-white font-bold uppercase text-sm px-3 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                            type="button"
                            onClick={() => {
                              // getprintsatuan(providerName, dataPrint2);
                              logisticmassalPrint(providerName, dataPrint2, channelidMassal);
                            }}
                          >
                            {providerName}{" : "} {count}
                          </button>
                        </div>
                      )
                    )}


                  </div>
                  {/* <div className="flex flex-col gap-1">
                    <button
                      className={`bg-orange-500 text-white font-bold uppercase text-sm px-3 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                      type="button"
                      onClick={() => {
                        getprint();
                      }}
                    >
                      Print All
                    </button>
                  </div> */}

                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalgetprintsatuan(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {modalaturmassal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[700px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-sm font-semibold ">Atur Pengiriman Massal</span>
                </div>
                {/*body*/}
                <div className=" text-sm p-6 flex flex-row gap-4 ">
                  {Object.entries(totalresiaturmassal.logisticsProviderName as Record<string, number>).map(
                    ([providerName, count], index) => (
                      <div key={index} >
                        <div className="basis-1/4 bg-red flex flex-col gap-1 ">
                          <button
                            className={`bg-orange-500 text-white w-full font-bold uppercase text-sm px-3 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                            type="button"
                            onClick={() => {
                              logisticmassal(providerName, rincianresimassal, channelidMassal
                              );
                            }}
                          >
                            {providerName}{" : "} {count}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  <div className="grow bg-red flex flex-col gap-1">
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      setmodalaturmassal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {openaksiprint ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
                {/*header*/}
                <div className="flex flex-row items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t mt-3">
                  <div className="grow">
                    <span className="text-sm font-semibold ">Atur satuan telah selesai..</span>
                  </div>

                  <div className="basis-1/12  text-right">
                    <button
                      className="font-bold text-red-600   text-xl cursor-pointer  rounded-full hover:shadow-[1px_2px_2px_1px_#727272]"
                      type="button"
                      onClick={() => {
                        setopenaksiprint(false);
                        restartPageAndData();
                        setTimeout(function () {
                          window.location.reload();
                        }, 250);
                        setTimeout(function () {
                          window.location.reload();
                        }, 250);
                        setquerysatuan("");
                      }}
                    >
                      <XCircleIcon className="h-6 w-6 text-black text-right" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {openaksiprint_massal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
                {/*header*/}
                <div className="flex flex-row items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t mt-3">
                  <div className="grow">
                    <span className="text-sm font-semibold ">Data Berhasil di Atur Pengiriman Massal</span>
                  </div>
                  <div className="basis-1/12">
                    <button
                      className="font-bold text-red-600  text-xl cursor-pointer  rounded-full hover:shadow-[1px_2px_2px_1px_#727272]"
                      type="button"
                      onClick={() => {
                        setsycnorder([]);
                        getdataorder(date_start, date_end, activetab, Query, true, StoreSync, tabs, StatusCetak, filteruser, area, Brand);
                        // getCountData(date_start, date_end, Query, activetab, StoreSync, filteruser);
                        setquerymassal("");
                        setopenaksiprint_massal(false);
                      }}
                    >
                      <XCircleIcon className="h-6 w-6 text-black text-right" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {openpending ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-[90vw] h-[45vw] bg-white rounded-lg shadow-lg overflow-auto">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <span className="text-lg font-semibold">Pending Pesanan</span>
                <button
                  className="text-red-500 font-bold text-sm"
                  type="button"
                  onClick={() => setopenpending(false)}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 flex-grow overflow-auto">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-xs">
                        <th className="border border-gray-300 px-2 py-2 text-center w-[2%]">NO</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[6%]">TANGGAL</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[5%]">NO PESANAN</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[5%]">ID PRODUK</th>
                        <th className="border border-gray-300 px-2 py-2 text-center">PRODUK</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[3%]">SIZE</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[3%]">QTY ORDER</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[3%]">QTY AVAILABLE</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[7%]">AMOUNT</th>
                        <th className="border border-gray-300 px-2 py-2 text-center w-[7%]">SELLING</th>
                        <th className="border border-gray-300 px-2 py-2 text-center">DESC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDataPending.map((order: any, index: any) => (
                        <tr
                          key={order.id}
                          className={index % 2 === 0 ? "bg-white text-center" : "bg-gray-50 text-center"}
                        >
                          {/* No */}
                          <td className="border border-gray-300 px-2 py-2 text-xs font-semibold">
                            {(currentPagePending - 1) * itemsPerPagePending + index + 1}
                          </td>

                          {/* Tanggal */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.tanggal || "-"}</td>

                          {/* ID Pesanan */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.id_pesanan || "-"}</td>

                          {/* ID Produk */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.id_produk || "-"}</td>

                          {/* Produk */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.produk || "-"}</td>

                          {/* Size */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.size || "-"}</td>

                          {/* QTY Order */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.qtyOrder || 0}</td>

                          {/* QTY Available */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.qtyReady || 0}</td>

                          {/* Total Amount */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{Rupiah.format(order.total_amount || 0)}</td>

                          {/* Harga Jual di App */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{Rupiah.format(order.harga_jual_app || 0)}</td>

                          {/* Keterangan */}
                          <td className="border border-gray-300 px-2 py-2 text-xs">{order.ket || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-solid border-slate-200 flex justify-between items-center">
                {/* Pagination */}
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                    onClick={handlePrevPagePending}
                    disabled={currentPagePending === 1}
                  >
                    Prev
                  </button>
                  <span className="pt-2">Page {currentPagePending} of {totalPagesPending}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                    onClick={handleNextPagePending}
                    disabled={currentPagePending === totalPagesPending}
                  >
                    Next
                  </button>
                </div>

                <div className="flex space-x-4">
                  {/* Delete Button */}
                  <button
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700"
                    onClick={DeletePendingData}
                  >
                    Delete
                  </button>

                  {/* Export to Excel */}
                  <button
                    className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                    onClick={handleExportToExcelPending}
                  >
                    Export to Excel
                  </button>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : null}
    </div>
  );
}
