import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import Link from "next/link";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import Cookies from "js-cookie";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import bwipjs from 'bwip-js';
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
    endOfMonth,
    isToday,
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";

axios.defaults.withCredentials = true;

export default function StockManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [isLoading, setisLoading]: any = useState(true);
    const [data_stock, setDataStock] = useState([]);
    const [data_stock_minumum, setDataStock_minimum] = useState<number[]>([]);
    const [data_ware, setdataware] = useState([]);

    // Modal Edit State
    const [editModal, setEditModal] = useState(false);
    const [editStokMinModal, setEditStokMinModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [newStatus, setNewStatus] = useState("");
    const [newStokMin, setNewStokMin] = useState("");

    const [showEditStokDefault, setShowEditStokDefault] = useState(false);
    const [newStokDefault, setNewStokDefault] = useState(() => {
        return Array.isArray(data_stock_minumum) && data_stock_minumum.length > 0
            ? data_stock_minumum[0].toString()
            : "";
    });

    // Mass Edit State
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const toggleRowSelection = (row: any) => {
        setSelectedRows((prev) => {
            const exists = prev.find((r) => r.id_notifikasi === row.id_notifikasi);
            if (exists) return prev.filter((r) => r.id_notifikasi !== row.id_notifikasi);
            return [...prev, row];
        });
    };
    const [showMassEditStokMin, setShowMassEditStokMin] = useState(false);
    const [showMassEditStatus, setShowMassEditStatus] = useState(false);
    const [massStokMin, setMassStokMin] = useState("");
    const [massStatus, setMassStatus] = useState("");

    const [value, setValue]: any = useState();
    const handleValueChange = (newValue: any) => {
        if (newValue.startDate === null || newValue.endDate === null) {
        } else {
            setDate(newValue.startDate + " to " + newValue.endDate);
        }
        setValue(newValue);
    };

    const cektoday = new Date();
    const cekHariIni = format(cektoday, 'yyyy-MM-dd');
    const [datatoday, setdatatoday] = useState(cekHariIni);

    const startDate = format(startOfDay(new Date()), "yyyy-MM-dd");
    const lastDate = format(endOfDay(new Date()), "yyyy-MM-dd");
    const [date, setDate] = useState(startDate + " to " + lastDate);

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

    function showOpenModalEdit(row: any) {
        setSelectedRow(row);
        setNewStatus(row.status || "");
        setEditModal(true);
    }

    function showOpenModalEditStokMin(row: any) {
        setSelectedRow(row);
        setNewStokMin(row.stok_min);
        setEditStokMinModal(true);
    }
    async function onSubmitStokMin() {
        if (!selectedRow) return;

        if (!newStokMin || isNaN(parseInt(newStokMin))) {
            toast.error("Masukkan nilai stok minimal yang valid", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 500,
            });
            return;
        }

        await axios
            .post("http://localhost:4000/v1/stokmin_update", {
                id_notifikasi: selectedRow.id_notifikasi,
                stok_min: parseInt(newStokMin)
            })
            .then(() => {
                setDataStock((prev: any) =>
                    prev.map((n: any) =>
                        n.id_notifikasi === selectedRow.id_notifikasi
                            ? { ...n, stok_min: parseInt(newStokMin) }
                            : n
                    )
                );
                setEditStokMinModal(false);
            })
            .catch((err) => {
                console.error("Gagal update stok_min:", err);
            });
    }

    async function onSubmitEdit() {
        if (!selectedRow) return;

        if (!newStatus || newStatus.trim().length === 0) {
            toast.error("Silahkan Pilih Status", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 500,
            });
            return;
        } else {
            await axios
                .post("http://localhost:4000/v1/updatestatus_stokmarket", {
                    id_notifikasi: selectedRow?.id_notifikasi,
                    status: newStatus
                })
                .then(() => {
                    setDataStock((prev: any) =>
                        prev.map((n: any) =>
                            n.id_notifikasi === selectedRow.id_notifikasi
                                ? { ...n, status: newStatus }
                                : n
                        )
                    );
                    setEditModal(false);
                    loadDataStock();
                })
                .catch((err) => {
                    console.error("Gagal update status:", err);
                });
        }
    }

    async function onSubmitEditStokDefault() {
        if (!newStokDefault || isNaN(parseInt(newStokDefault))) {
            toast.error("Masukkan nilai stok minimal yang valid", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 500,
            });
            return;
        }
        console.log("newStokDefault", newStokDefault);

        await axios
            .post("http://localhost:4000/v1/stokminimum_update_default", {
                stok_min: parseInt(newStokDefault)
            })
            .then(() => {
                setDataStock_minimum([parseInt(newStokDefault)]);
                setShowEditStokDefault(false);
            })
            .catch((err) => {
                console.error("Gagal update stok minimum default:", err);
            });
    }

    useEffect(() => {
        if (Cookies.get("auth_store") != "AREA-185") {
            loadDataStock();
        }
    }, []);

    async function loadDataStock() {
        setisLoading(true);
        await axios
            .get("http://localhost:4000/v1/getnotifikasi_stok")
            .then((res) => {
                console.log("res.data.result", res.data.result);
                setDataStock(res.data.result.datas || []);
                setDataStock_minimum(res.data.result.datas2[0].min || []);
                if (res.data.result.datas2.length > 0) {
                    setNewStokDefault(
                        typeof res.data.result.datas2[0].min === "number"
                            ? res.data.result.datas2[0].min.toString()
                            : Array.isArray(res.data.result.datas2[0].min) && res.data.result.datas2[0].min.length > 0
                                ? res.data.result.datas2[0].min[0].toString()
                                : ""
                    );
                }
                setisLoading(false);
            })
            .catch((err) => {
                console.error("Gagal memuat notifikasi:", err);
                setisLoading(false);
            });
    }

    const router = useRouter();

    if ("SUPER-ADMIN" === Cookies.get("auth_role")) {
        var [Warehouse, setWarehouse] = useState("all");
    } else if ("HEAD-AREA" === Cookies.get("auth_role")) {
        var [Warehouse, setWarehouse] = useState("all_area");
    } else {
        var [Warehouse, setWarehouse] = useState("wares");
    }

    const columns: any = [
        {
            name: "No",
            selector: (row: { id: any }) => row.id,
            width: "5%",
        },
        {
            name: "Tanggal",
            selector: (row: { updated_at: any }) => row.updated_at,
            width: "15%",
        },
        {
            name: "Produk",
            selector: (row: { produk: any }) => row.produk,
            width: "30%",
        },
        {
            name: "ID Produk",
            selector: (row: { id_produk: any }) => row.id_produk,
            width: "15%",
        },
        {
            name: "Size",
            selector: (row: { size: any }) => row.size,
            width: "10%",
        },
        {
            name: "Qty",
            selector: (row: { qty: any }) => row.qty,
            width: "10%",
        },
        {
            name: "Waktu",
            selector: (row: { created_at: any }) =>
                new Date(row.created_at).toLocaleString("id-ID"),
            width: "20%",
        },
    ];

    const list_stock: any = [];

    if (!isLoading) {
        data_stock.map((notif: any, index: number) => {
            return list_stock.push({
                id: index + 1,
                id_notifikasi: notif.id_notifikasi, // ✅ tambahkan ini
                produk: notif.produk,
                id_produk: notif.id_produk,
                size: notif.size,
                qty: notif.qty,
                status: notif.status, // ✅ Tambahkan ini
                status_baca: notif.status_baca,
                stok_min: notif.stok_min,
                created_at: notif.created_at,
                updated_at: notif.updated_at,
            });
        });
    }

    const [filterText, setFilterText] = React.useState("");

    // Sorting state
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });

    // Sort handler
    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            } else {
                return { key, direction: 'asc' };
            }
        });
    };

    const filteredItems = list_stock.filter((list_stock: any) => {
        return (
            list_stock.produk
                .toLocaleLowerCase()
                .includes(filterText.toLocaleLowerCase()) ||
            list_stock.id_produk
                .toLocaleLowerCase()
                .includes(filterText.toLocaleLowerCase())
        );
    });

    // Apply sorting
    let sortedItems = [...filteredItems];
    if (sortConfig.key) {
        sortedItems.sort((a: any, b: any) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Items shown on current page
    const pageItems = sortedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filterText]);

    async function exportToExcelByDateRange() {
        const { startDate, endDate } = value || {};
        const start = startOfDay(new Date(startDate));
        const end = endOfDay(new Date(endDate));

        const filtered = data_stock.filter((item: any) => {
            const updatedAt = new Date(item.updated_at);
            return updatedAt >= start && updatedAt <= end;
        });

        // 1) Jika ada baris yang dipilih, export hanya selectedRows
        if (selectedRows.length > 0) {
            const rows = selectedRows.map((item: any) => ({
                Updated_At: format(new Date(item.updated_at), "yyyy-MM-dd HH:mm:ss"),
                ID_Produk: item.id_produk,
                Produk: item.produk,
                Size: item.size,
                Qty: item.qty,
                Status: item.status,
            }));

            const XLSX = await import("xlsx");
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Stok");
            XLSX.writeFile(workbook, `stok_selected_${startDate}_to_${endDate}.xlsx`);
            return;
        }

        // 2) Jika tidak ada data hasil filter tanggal
        if (filtered.length === 0) {
            toast.info("Tidak ada data dalam rentang tanggal tersebut.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 800,
            });
            return;
        }

        // 3) Jika tidak ada selectedRows tapi ada data filtered
        const rows = filtered.map((item: any) => ({
            ID: item.id_notifikasi,
            Produk: item.produk,
            ID_Produk: item.id_produk,
            Size: item.size,
            Qty: item.qty,
            Stok_Min: item.stok_min,
            Status: item.status,
            Updated_At: format(new Date(item.updated_at), "yyyy-MM-dd HH:mm:ss"),
        }));

        const XLSX = await import("xlsx");
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stok");
        XLSX.writeFile(workbook, `stok_filtered_${startDate}_to_${endDate}.xlsx`);
    }

    return (
        <div className="p-5">
            <div className="font-bold text-3xl border-b border-[#2125291A] h-12 mb-2">
                Notifikasi Stok
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex items-center shadow rounded-lg w-full lg:w-auto">
                    <input
                        className="h-[45px] border-0 w-[280px] pr-3 pl-5 text-gray-700 focus:outline-none rounded-l-lg"
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

                <div className="flex flex-wrap items-center gap-2 ml-auto">


                    {selectedRows.length > 0 && (
                        <>
                            <span className="text-gray-700 font-semibold text-sm">
                                Checklist: {selectedRows.length} data
                            </span>
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowMassEditStokMin(true)}
                            >
                                Edit Massal Stok Alert
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowMassEditStatus(true)}
                            >
                                Edit Massal Status
                            </button>

                        </>
                    )}
                    <button
                        onClick={() => setShowEditStokDefault(true)}
                        className="bg-black text-white hover:bg-gray-500 transition font-semibold rounded-md px-4 py-2 shadow"
                    >
                        Stok Minimum: {data_stock_minumum}
                    </button>
                    <button
                        onClick={exportToExcelByDateRange}
                        className="bg-green-600 text-white hover:bg-green-700 transition font-semibold rounded-md px-4 py-2 shadow"
                    >
                        Export Excel
                    </button>
                </div>

                <div className="w-full lg:w-[230px]">
                    <Datepicker
                        displayFormat="DD-MM-YYYY"
                        primaryColor="blue"
                        value={value}
                        onChange={handleValueChange}
                        showShortcuts={true}
                        showFooter={true}
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
                                        start: "2023-01-01",
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
                </div>
            </div>

            {/* Mass Edit Buttons */}


            <div className="mb-20 mt-0">
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white shadow-md border border-gray-500 border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-left text-sm font-semibold text-white">
                                <th className="px-4 py-3 text-center w-[1%]">
                                    <input
                                        type="checkbox"
                                        checked={
                                            pageItems.length > 0 &&
                                            pageItems.every((row: any) =>
                                                selectedRows.some((r) => r.id_notifikasi === row.id_notifikasi)
                                            )
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                // Select all visible rows
                                                const newRows = pageItems.filter(
                                                    (row: any) =>
                                                        !selectedRows.some(
                                                            (r) => r.id_notifikasi === row.id_notifikasi
                                                        )
                                                );
                                                setSelectedRows((prev) => [...prev, ...newRows]);
                                            } else {
                                                // Deselect all visible rows
                                                setSelectedRows((prev) =>
                                                    prev.filter(
                                                        (r) =>
                                                            !pageItems.some(
                                                                (row: any) => row.id_notifikasi === r.id_notifikasi
                                                            )
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-6 py-3 text-center w-[7%]">No</th>
                                <th className="px-6 py-3 text-center w-[15%]">Tanggal</th>
                                <th className="px-6 py-3">Produk</th>
                                <th className="px-6 py-3 text-center w-[5%]">Code</th>
                                <th className="px-6 py-3 text-center w-[3%]">Size</th>
                                <th
                                    className="px-6 py-3 text-center cursor-pointer w-[3%]"
                                    onClick={() => handleSort('qty')}
                                >
                                    Qty {sortConfig.key === 'qty' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th
                                    className="px-6 py-3 text-center cursor-pointer w-[3%]"
                                    onClick={() => handleSort('stok_min')}
                                >
                                    Stok Alert {sortConfig.key === 'stok_min' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th className="px-6 py-3 text-center w-[10%]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="border border-gray-500 divide-y divide-gray-200">
                            {pageItems.map((row: any, index: any) => (
                                <tr
                                    key={index}
                                    className={`border-b text-xs text-gray-700 ${row.status === null ||
                                        row.status === undefined ||
                                        row.status === "" ||
                                        row.status?.toString().toUpperCase() === "NULL"
                                        ? "bg-red-100"
                                        : ""
                                        }`}
                                >
                                    <td className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.some((r) => r.id_notifikasi === row.id_notifikasi)}
                                            onChange={() => toggleRowSelection(row)}
                                        />
                                    </td>
                                    <td className="px-6 py-3 text-center font-semibold">{row.id}</td>
                                    <td className="px-6 py-3 text-center ">{format(new Date(row.updated_at), "yyyy-MM-dd HH:mm:ss")}</td>
                                    <td className="px-6 py-3">{row.produk}</td>
                                    <td className="px-6 py-3 text-center ">{row.id_produk}</td>
                                    <td className="px-6 py-3 text-center">{row.size}</td>
                                    <td className="px-6 py-3 text-center">{row.qty}</td>
                                    <td className="px-6 py-3 text-center">
                                        <button
                                            onClick={() => showOpenModalEditStokMin(row)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            {row.stok_min}
                                        </button>
                                    </td>
                                    <td className="px-6 py-3 text-center w-[10%]">
                                        <button
                                            onClick={() => showOpenModalEdit(row)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            {row.status === null || row.status === undefined || row.status === "" || row.status?.toString().toUpperCase() === "NULL"
                                                ? "ALL MARKETPLACE"
                                                : row.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center px-4 py-3 bg-white border-t">
                        <div className="text-sm text-gray-600">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                            {Math.min(currentPage * itemsPerPage, filteredItems.length)} dari {filteredItems.length} data
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                Sebelumnya
                            </button>
                            <button
                                disabled={currentPage * itemsPerPage >= filteredItems.length}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className={`px-3 py-1 rounded border ${currentPage * itemsPerPage >= filteredItems.length ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mass Edit StokMin Modal */}
            {showMassEditStokMin && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Massal Stok Alert</h2>
                        <input
                            type="number"
                            value={massStokMin}
                            onChange={(e) => setMassStokMin(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                            placeholder="Masukkan nilai stok alert baru"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowMassEditStokMin(false);
                                    setMassStokMin("");
                                }}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    if (!massStokMin || isNaN(parseInt(massStokMin))) {
                                        toast.error("Masukkan nilai stok minimal yang valid", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 500,
                                        });
                                        return;
                                    }
                                    try {
                                        await axios.post("http://localhost:4000/v1/massalUpdate_stokAlert", {
                                            items: selectedRows.map((row) => ({
                                                id_notifikasi: row.id_notifikasi,
                                                stok_min: parseInt(massStokMin),
                                            })),
                                        });
                                        setDataStock((prev: any) =>
                                            prev.map((n: any) =>
                                                selectedRows.some((sel) => sel.id_notifikasi === n.id_notifikasi)
                                                    ? { ...n, stok_min: parseInt(massStokMin) }
                                                    : n
                                            )
                                        );
                                        setShowMassEditStokMin(false);
                                        setMassStokMin("");
                                        setSelectedRows([]);
                                        toast.success("Berhasil update stok alert massal", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 800,
                                        });
                                    } catch (err) {
                                        toast.error("Gagal update stok alert massal", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 800,
                                        });
                                    }
                                }}
                                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mass Edit Status Modal */}
            {showMassEditStatus && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Massal Status</h2>
                        <select
                            value={massStatus}
                            onChange={(e) => setMassStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        >
                            <option value="">Pilih Status</option>
                            <option value="ALL_MARKETPLACE">ALL MARKETPLACE</option>
                            <option value="SHOPEE">SHOPEE</option>
                            <option value="TIKTOK">TIKTOK</option>
                        </select>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowMassEditStatus(false);
                                    setMassStatus("");
                                }}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    if (!massStatus || massStatus.trim().length === 0) {
                                        toast.error("Silahkan Pilih Status", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 500,
                                        });
                                        return;
                                    }
                                    try {
                                        await axios.post("http://localhost:4000/v1/massalUpdate_status_stokmarket", {
                                            items: selectedRows.map((row) => ({
                                                id_notifikasi: row.id_notifikasi,
                                                status: massStatus,
                                            })),
                                        });
                                        setDataStock((prev: any) =>
                                            prev.map((n: any) =>
                                                selectedRows.some((sel) => sel.id_notifikasi === n.id_notifikasi)
                                                    ? { ...n, status: massStatus }
                                                    : n
                                            )
                                        );
                                        setShowMassEditStatus(false);
                                        setMassStatus("");
                                        setSelectedRows([]);
                                        toast.success("Berhasil update status massal", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 800,
                                        });
                                    } catch (err) {
                                        toast.error("Gagal update status massal", {
                                            position: toast.POSITION.TOP_RIGHT,
                                            pauseOnHover: false,
                                            autoClose: 800,
                                        });
                                    }
                                }}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Status */}
            {editModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Status</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        >
                            <option value="">Pilih Status</option>
                            <option value="ALL_MARKETPLACE">ALL MARKETPLACE</option>
                            <option value="SHOPEE">SHOPEE</option>
                            <option value="TIKTOK">TIKTOK</option>
                        </select>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setEditModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onSubmitEdit}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editStokMinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Stok Minimal</h2>
                        <input
                            type="number"
                            value={newStokMin}
                            onChange={(e) => setNewStokMin(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setEditStokMinModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onSubmitStokMin}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditStokDefault && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Stok Minimum Default</h2>
                        <input
                            type="number"
                            value={newStokDefault}
                            onChange={(e) => setNewStokDefault(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowEditStokDefault(false);
                                    setNewStokDefault(
                                        Array.isArray(data_stock_minumum) && data_stock_minumum.length > 0
                                            ? String(data_stock_minumum[0])
                                            : ""
                                    );
                                }}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onSubmitEditStokDefault}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}