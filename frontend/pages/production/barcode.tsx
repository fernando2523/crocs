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
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useRouter } from "next/router";
import axios from "axios";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import Cookies from "js-cookie";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import bwipjs from 'bwip-js';

axios.defaults.withCredentials = true;

export default function Expense() {
  const [isLoading, setisLoading]: any = useState(true);
  const [data_produkbarcode, setdatabarcode] = useState([]);
  const [data_ware, setdataware] = useState([]);

  useEffect(() => {
    loaddatabarcode(Warehouse, area, Role);
    getwarehouse(Role, area);
  }, []);

  async function loaddatabarcode(warehouse: any, area: any, role: any) {
    setisLoading(true);
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getprodukbarcode`,
      data: {
        warehouse: warehouse,
        area: area,
        role: role,
      },
    })
      .then(function (response) {
        setdatabarcode(response.data.result);
        // console.log(response.data.result)
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const router = useRouter();


  if ("SUPER-ADMIN" === Cookies.get("auth_role")) {
    var [Warehouse, setWarehouse] = useState("all");
  } else if ("HEAD-AREA" === Cookies.get("auth_role")) {
    var [Warehouse, setWarehouse] = useState("all_area");
  } else {
    var [Warehouse, setWarehouse] = useState("wares");
  }

  const [area, setarea] = useState((Cookies.get("auth_store")));
  const [Role, setRole] = useState(Cookies.get("auth_role"));

  async function getwarehouse(role: any, area: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getarehousebarcode`,
      data: {
        role: role,
        area: area,
      },
    })
      .then(function (response) {
        setdataware(response.data.result);
        console.log(response.data.result)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://apitest.lokigudang.com/getwarehouse`, fetcher);
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

  const columns: any = [
    {
      name: "No",
      selector: (row: { id: any }) => row.id,
      width: "5%"
    },
    {
      name: "Nama Produk",
      selector: (row: { produk: any }) => row.produk,
      width: "65%",
    },
    {
      name: "ID Produk",
      selector: (row: { id_produk: any }) => row.id_produk,
      width: "10%"
    },
    {
      name: "Warehouse",
      selector: (row: { warehouse: any }) => row.warehouse,
      width: "10%"
    },
    {
      name: "Action",
      selector: (row: { action: any }) => row.action,
      width: "10%"
    },
  ];

  const list_produkbarcode: any = [];

  // const { data, error, isLoading, mutate } = useSWR(`https://apitest.lokigudang.com/get_produkbarcode/${Warehouse}`, fetcher);

  if (!isLoading) {
    data_produkbarcode.map((data_produkbarcode: any, index: number) => {
      return list_produkbarcode.push({
        id: index + 1,
        produk: data_produkbarcode.produk,
        id_produk: data_produkbarcode.id_produk,
        warehouse: data_produkbarcode.warehouse,
        action: (
          <div className="flex flex-warp gap-4">
            <button
              className="text-red-500"
              onClick={() =>
                showprintAct(
                  data_produkbarcode.produk,
                  data_produkbarcode.warehouse,
                  data_produkbarcode.id_produk,
                  data_produkbarcode.id_ware,
                  data_produkbarcode.n_price,
                )
              }
            >
              <i className="fi fi-rr-print text-center text-xl"></i>
            </button>
          </div>
        ),
      });
    });
  }

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = list_produkbarcode.filter((list_produkbarcode: any) => {
    return (
      list_produkbarcode.produk
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_produkbarcode.id_produk
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase())
    );
  });

  const CustomMaterialPagination = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    onChangeRowsPerPage,
    currentPage,
  }: any) => (
    <div className="bg-white border-t px-3 py-2 flex flex-wrap justify-start h-14 items-center">
      <div className="grow">
        Menampilkan {String(currentPage)}-{String(Math.ceil(rowCount / 10))}{" "}
        dari {String(rowCount)} items
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal"
          onClick={({ }) =>
            onChangePage(currentPage === 1 ? currentPage : currentPage - 1)
          }
        >
          Back
        </button>
        <button
          className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal"
          onClick={({ }) => onChangePage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );

  const [printModal, setprintModal]: any = useState(null);
  const [pilih_warehouse, setpilih_warehouse] = React.useState("close");
  const [datasize, setdatasize] = React.useState([]);

  const [sizeSelected, setsizeSelected] = React.useState(null); // legacy, tidak dipakai di print
  const [stokReady, setstokReady] = React.useState(0);          // legacy
  const [selectedSizes, setSelectedSizes] = React.useState<{ size: string; qty: number }[]>([]);

  const [PrintProduk, setPrintProduk] = React.useState("");
  const [PrintWare, setPrintWare] = React.useState("");
  const [PrintIDWare, setPrintIDWare] = React.useState("");
  const [PrintIDProduk, setPrintIDProduk] = React.useState("");
  const [PrintPrice, setPrintPrice]: any = React.useState("");
  const [POManual, setPOManual]: any = React.useState("");

  const [PrintIDPO, setPrintIDPO] = React.useState("");

  const [addmodal_submit, setaddmodal_submit] = React.useState(true);

  // SPK Detail (PO Manual) states
  const [spkDetailOptions, setSpkDetailOptions] = React.useState<string[]>([]);
  const [spkDetailSelected, setSpkDetailSelected] = React.useState("");
  // "po" | "spk" — source of size list currently shown
  const [sizeSource, setSizeSource] = React.useState<"po" | "spk">("po");

  async function get_size(e: any) {
    setpilih_warehouse("loading");
    setsizeSelected(null);
    setstokReady(0);
    setSelectedSizes([]);
    setaddmodal_submit(true);
    setSizeSource("po");
    // Reset SPK detail selection ketika pilih PO
    setSpkDetailSelected("");
    setPOManual("");

    if (e.target.value === "") {
      setpilih_warehouse("close");
    } else {
      await axios
        .post(`http://localhost:4000/v1/getsizebarcode`, {
          idware: PrintIDWare,
          idproduct: PrintIDProduk,
          idpo: e.target.value,
        })
        .then(function (response) {
          setpilih_warehouse("open");
          setdatasize(response.data.result);
        });
    }
  }

  const list_size: any = [];

  {
    for (let index = 0; index < datasize.length; index++) {
      const sz = datasize[index].size;
      const qty = parseInt(datasize[index].qty);
      const isSelected = selectedSizes.some((s: any) => s.size === sz);
      const isZero = qty === 0;

      if (qty >= 0) {
        list_size.push(
          <div
            onClick={() => {
              setSelectedSizes((prev: any) => {
                const exists = prev.some((s: any) => s.size === sz);
                const next = exists
                  ? prev.filter((s: any) => s.size !== sz)
                  : [...prev, { size: sz, qty }];
                // Kalau setelah toggle hanya 1 size → auto-fill custom qty
                if (next.length === 1) setstokReady(next[0].qty);
                else setstokReady(0);
                return next;
              });
              setaddmodal_submit(false);
            }}
            key={index}
            className={`font-medium py-2 text-center rounded-lg border cursor-pointer select-none
              ${isSelected
                ? isZero
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-blue-500 text-white border-blue-500"
                : isZero
                  ? "text-red-400 border-red-400 hover:bg-red-50"
                  : "text-blue-500 border-blue-500 hover:bg-blue-50"
              }`}
          >
            {sz} = {qty}
          </div>
        );
      } else {
        list_size.push(
          <div
            key={index}
            className="text-gray-500 font-medium py-2 text-center rounded-lg border border-gray-500"
          >
            {sz} = {qty}
          </div>
        );
      }
    }
  }

  const [datapo, setdatapo] = React.useState([]);
  const list_idpo: any = [];

  for (let index = 0; index < datapo.length; index++) {
    list_idpo.push(
      <option key={index} value={datapo[index].idpo}>
        {datapo[index].tanggal_receive} - {datapo[index].tipe_order} -{" "}
        {datapo[index].idpo}
      </option>
    );
  }

  async function showprintAct(
    produk: any,
    ware: any,
    idproduk: any,
    idware: any,
    n_price: any
  ) {
    setPrintProduk(produk);
    setPrintWare(ware);
    setPrintIDWare(idware);
    setPrintIDProduk(idproduk);
    setPrintPrice(n_price);
    setdatasize([]);
    setdatapo([]);
    setpilih_warehouse("close");
    setaddmodal_submit(true);
    setsizeSelected(null);
    setstokReady(0);
    setSelectedSizes([]);
    setPOManual("");
    setSpkDetailSelected("");
    setSpkDetailOptions([]);
    setSizeSource("po");

    // Load ID PO list dan SPK Detail list secara paralel
    const [poRes, spkDetailRes] = await Promise.all([
      axios.post(`http://localhost:4000/v1/getidpo`, { idware: idware, idproduct: idproduk }),
      axios.post(`http://localhost:4000/v1/get_spk_detail_list`, { idware: idware, idproduct: idproduk }),
    ]);
    setdatapo(poRes.data.result);
    const detailRows: any[] = spkDetailRes.data.result || [];
    setSpkDetailOptions(detailRows.map((r: any) => r.id_spk_detail));
    setprintModal(true);
  }

  async function get_size_by_spk_detail(detailValue: string) {
    if (!detailValue) {
      setpilih_warehouse("close");
      return;
    }
    setpilih_warehouse("loading");
    setsizeSelected(null);
    setstokReady(0);
    setSelectedSizes([]);
    setaddmodal_submit(true);
    setSizeSource("spk");
    const res = await axios.post(`http://localhost:4000/v1/get_size_by_spk_detail`, {
      idware: PrintIDWare,
      idproduct: PrintIDProduk,
      id_spk_detail: detailValue,
    });
    const rows: any[] = res.data.result || [];
    setdatasize(rows);
    setpilih_warehouse("open");
  }

  async function printAct() {
    // console.log("PrintIDWare", PrintIDWare);
    // console.log("POManual", POManual);
    const pdfDoc = await PDFDocument.create();
    // const pageWidth = 297.6; // 10.5 cm in pt (141.7 * 2.1)
    const labelWidth = 141.7;
    const marginLeft = 10;
    const marginRight = 10;
    const pageWidth = 2 * (labelWidth + marginLeft + marginRight);
    // const pageWidth = 148.8; // 10.5 cm in pt (141.7 * 2.1)
    const pageHeight = 63.75; // 6 cm in pt (85.0 * 2)
    const availableWidth = labelWidth - marginLeft - marginRight;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Kumpulkan semua label: tiap size × qty-nya
    // Jika tepat 1 size dipilih → gunakan stokReady (custom qty dari input)
    // Jika >1 size dipilih    → gunakan qty masing-masing size
    const printQueue: { size: string; qty: number }[] = selectedSizes.length === 1
      ? [{ size: selectedSizes[0].size, qty: stokReady }]
      : selectedSizes.length > 1
        ? selectedSizes
        : sizeSelected ? [{ size: sizeSelected, qty: stokReady }] : [];

    let globalLabelIndex = 0; // counter label global lintas semua size
    let page: any = null;

    for (const { size: currentSize, qty: currentQty } of printQueue) {
      const ctx = document.createElement("canvas");
      bwipjs.toCanvas(ctx, {
        bcid: 'qrcode',
        text: `${PrintIDProduk}.${currentSize}`,
        scale: 2,
        height: 2,
        includetext: false,
      });

      const barcodeDataUrl = ctx.toDataURL("image/png");
      const barcodeImage = await pdfDoc.embedPng(barcodeDataUrl);

      for (let i = 0; i < currentQty; i++) {
        const globalI = globalLabelIndex++;
        if (globalI % 2 === 0) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
        }
        const totalLabelWidth = labelWidth + marginLeft + marginRight;
        const xOffset = (globalI % 2) * totalLabelWidth + marginLeft;
        const { width, height } = page.getSize();

        page.drawImage(barcodeImage, {
          x: xOffset - 2,
          y: height - 50,
          width: 43,
          height: 43,
        });

        const idProdukText = `${PrintIDProduk}.${currentSize}`;
        let fixedFontSize: number;
        if (currentSize.length > 1 && currentSize.length < 3) {
          fixedFontSize = 6.1;
        } else if (currentSize.length > 2) {
          fixedFontSize = 5.7;
        } else {
          fixedFontSize = 6.7;
        }

        const rawWidth = font.widthOfTextAtSize(idProdukText, fixedFontSize);
        const extraSpacing = Math.floor((availableWidth - rawWidth) / (fixedFontSize / 2));
        const spacedText = idProdukText.split('').join(' '.repeat(extraSpacing > 0 ? 0.5 : 0));
        const spacedTextWidth = font.widthOfTextAtSize(spacedText, fixedFontSize);

        page.drawText(spacedText, {
          x: xOffset - 42 + (availableWidth - spacedTextWidth) / 2,
          y: height - 56,
          size: fixedFontSize,
          font: font,
          color: rgb(0, 0, 0),
        });

        // --- WRAP PRODUK TEXT (max 22 chars per line) ---
        const wrapProdukText = (
          text: string,
          maxCharsPerLine: number,
          maxLines: number = 3
        ) => {
          const words = (text || "").trim().split(/\s+/).filter(Boolean);
          const lines: string[] = [];

          let current = "";

          const pushCurrent = () => {
            if (current && lines.length < maxLines) lines.push(current);
            current = "";
          };

          for (const word of words) {
            if (lines.length >= maxLines) break;

            // If a single word is longer than the limit, split it across lines
            if (word.length > maxCharsPerLine) {
              // flush current line first
              pushCurrent();
              let start = 0;
              while (start < word.length && lines.length < maxLines) {
                lines.push(word.slice(start, start + maxCharsPerLine));
                start += maxCharsPerLine;
              }
              continue;
            }

            const candidate = current ? `${current} ${word}` : word;
            if (candidate.length <= maxCharsPerLine) {
              current = candidate;
            } else {
              pushCurrent();
              current = word;
            }
          }

          // push remainder
          if (lines.length < maxLines) pushCurrent();

          return lines;
        };

        const truncatedProdukLines = wrapProdukText(PrintProduk, 22, 3);
        for (let i = 0; i < truncatedProdukLines.length; i++) {
          page.drawText(truncatedProdukLines[i], {
            x: xOffset + 48,
            y: height - 15 - (i * 10),
            size: 9.5,
            font: font,
            color: rgb(0, 0, 0),
          });
        }

        let fixedFontHarga: number;
        if (currentSize.length > 1 && currentSize.length < 3) {
          fixedFontHarga = 11.5;
        } else if (currentSize.length > 2) {
          fixedFontHarga = 10;
        } else {
          fixedFontHarga = 12;
        }

        // Draw a rectangle and center the size text inside it
        const sizeText = `${currentSize}`;
        const sizeFontSize = 13;
        const sizeTextWidth = boldFont.widthOfTextAtSize(sizeText, sizeFontSize);
        const boxWidth = sizeTextWidth + 7;
        const boxHeight = 16;
        let boxX: number;
        const boxY: number = 8;

        if (currentSize.length > 1 && currentSize.length < 3) {
          boxX = xOffset + 104 - 3;
        } else if (currentSize.length > 2) {
          boxX = xOffset + 96 - 3;
        } else {
          boxX = xOffset + 110 - 3;
        }

        page.drawRectangle({
          x: boxX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5,
        });

        page.drawText(sizeText, {
          x: boxX + 3.7,
          y: boxY + 3.4,
          size: sizeFontSize,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
      } // end for i < currentQty
    } // end for printQueue

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);


  }

  return (
    <div className="p-5">
      <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
        Cetak Barcode
      </div>

      <div className="flex flex-wrap gap-4 items-center content-center mb-6">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Cari Produk"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <button
            type="button"
            className="rounded-r-lg bg-white h-[45px] text-gray-700 font-medium px-5"
          >
            <div className="my-auto">
              <fa.FaSearch size={17} className="text-gray-700" />
            </div>
          </button>
        </div>
        {"SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role") ? (
          <>
            <select
              value={Warehouse}
              onChange={(e) => {
                setWarehouse(e.target.value);
                loaddatabarcode(e.target.value, area, Role);
              }}
              className={`appearance-none border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
            >
              {"SUPER-ADMIN" === Cookies.get("auth_role") ? (
                <>
                  <option value="all">All Warehouse</option>
                </>
              ) : (
                <>
                  {/* {datawaress} */}
                  <option value="all_area">All Area</option>
                </>
              )}
              {list_warehouse}
            </select>
          </>
        ) : (
          <>
            <select
              value={Warehouse}
              onChange={(e) => {
                setWarehouse(e.target.value);
                loaddatabarcode(e.target.value, area, Role);
              }}
              className={`appearance-none border h-[45px] w-[20%] px-5 text-gray-700 focus:outline-none rounded-lg`}
            >
              {list_warehouse}
            </select>
          </>
        )}
      </div>

      <div className="mb-20 mt-6">
        <DataTable
          className="items-center"
          columns={columns}
          data={filteredItems}
          pagination
          paginationComponent={CustomMaterialPagination}
          paginationPerPage={20}
        />
      </div>

      {printModal ? (
        <>
          <div className="mt-2 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-xl font-semibold">Print Barcode</span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="">
                    <label className="block mb-2 text-sm font-medium text-black">
                      Nama Produk
                    </label>
                    <input
                      className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      type="text"
                      value={PrintProduk}
                      readOnly
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-black">
                      Warehouse
                    </label>
                    <input
                      className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      type="text"
                      value={PrintWare}
                      readOnly
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-black">
                      ID Purchase Order
                    </label>
                    <select
                      onChange={(e) => {
                        get_size(e);
                        setPrintIDPO(e.target.value);
                      }}
                      className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                    >
                      <option value="">Pilih ID Purchase Order</option>
                      {list_idpo}
                    </select>
                  </div>

                  <div className="text-sm mt-6">
                    <label className="block mb-2 text-sm font-medium text-black">
                      Size
                      {sizeSource === "spk" && (
                        <span className="ml-2 text-xs font-normal text-blue-500">(dari data produksi)</span>
                      )}
                      {sizeSource === "po" && pilih_warehouse === "open" && (
                        <span className="ml-2 text-xs font-normal text-green-500">(dari data PO)</span>
                      )}
                    </label>
                    {(function () {
                      if (pilih_warehouse === "close") {
                        return (
                          <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                            Mohon Pilih ID PO atau No. Batch SPK
                          </div>
                        );
                      } else if (pilih_warehouse === "loading") {
                        return (
                          <div className="w-[100%] py-3 text-center border rounded-lg mt-2 flex flex-auto items-center justify-center">
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-350 fill-blue-600"
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
                            <div className="mt-1 grid grid-cols-6 gap-2 text-xs content-start">
                              {list_size}
                            </div>
                          );
                        } else {
                          return (
                            <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                              Stok Tidak Ada
                            </div>
                          );
                        }
                      }
                    })()}
                  </div>

                  {/* Custom qty — hanya muncul jika tepat 1 size dipilih */}
                  {selectedSizes.length === 1 && (
                    <div className="mt-4">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Qty Print Barcode
                      </label>
                      <input
                        className="border h-[45px] w-[100%] pr-3 pl-5 text-gray-700 focus:outline-none rounded-lg"
                        type="number"
                        min={1}
                        value={stokReady}
                        onChange={(e) => setstokReady(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  )}

                  {/* Ringkasan multi-size — hanya muncul jika >1 size dipilih */}
                  {selectedSizes.length > 1 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs font-semibold text-blue-600 mb-1">
                        {selectedSizes.length} size dipilih — Total {selectedSizes.reduce((s: any, x: any) => s + x.qty, 0)} label
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSizes.map((s: any) => (
                          <span key={s.size} className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            {s.size} × {s.qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-black">
                      No. Batch / Detail SPK
                    </label>
                    <select
                      className={`appearance-none border h-[45px] w-[100%] pr-3 pl-5 text-gray-700 focus:outline-none rounded-lg`}
                      value={spkDetailSelected}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSpkDetailSelected(val);
                        setPOManual(val);
                        // Reset PO select & load size dari SPK detail
                        if (val) {
                          get_size_by_spk_detail(val);
                        } else {
                          setpilih_warehouse("close");
                          setSizeSource("po");
                        }
                      }}
                    >
                      <option value="">-- Pilih No. Batch / Detail SPK --</option>
                      {spkDetailOptions.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {sizeSource === "spk" && spkDetailSelected && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ Menampilkan size dari data produksi (SPK Detail: {spkDetailSelected})
                      </p>
                    )}
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setprintModal(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className={`${addmodal_submit === true || selectedSizes.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:shadow-lg"
                      } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow outline-none focus:outline-none mr-1 mb-1`}
                    type="button"
                    onClick={() => {
                      if (addmodal_submit === true || selectedSizes.length === 0) return;
                      printAct();
                    }}
                  >
                    Print Barcode {selectedSizes.length === 1
                      ? `(${stokReady})`
                      : selectedSizes.length > 1
                        ? `(${selectedSizes.reduce((s: any, x: any) => s + x.qty, 0)})`
                        : ""}
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
