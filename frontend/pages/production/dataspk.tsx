import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
import * as XLSX from "xlsx";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import Cookies from "js-cookie";
import {
    compareAsc,
    format,
    startOfDay,
    endOfDay,
    startOfWeek,
    lastDayOfWeek,
    subDays,
    startOfMonth,
    endOfMonth
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
axios.defaults.withCredentials = true;
import { subMonths } from "date-fns";

export default function Expense() {
    const [isLoading, setisLoading]: any = useState(true);
    const [data_produkbarcode, setdatabarcode] = useState([]);
    const [data_ware, setdataware] = useState([]);
    const [showAddSpk, setShowAddSpk] = useState(false);
    const [toastReady, setToastReady] = useState(false);
    const [data_category, setdatacategory] = useState([]);
    const [area, setarea] = useState((Cookies.get("auth_store")));
    const [Role, setRole] = useState(Cookies.get("auth_role"));
    const role = Cookies.get("auth_role");
    const defaultWarehouse =
        role === "SUPER-ADMIN"
            ? "WARE-0001"
            : "all"; // HEAD-AREA boleh pilih bebas
    const [Warehouse, setWarehouse] = useState<string>(defaultWarehouse);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailItem, setDetailItem] = useState<any>(null);
    const [spkMultiplier, setSpkMultiplier] = useState<number>(1);
    const [spkMultiplierId, setSpkMultiplierId] = useState<number | null>(null);
    const [data_supplier, setdatasupplier] = useState([]);


    useEffect(() => {
        setToastReady(true);
    }, []);
    useEffect(() => {
        if (!Warehouse || !Role) return;

        loaddatabarcode(
            Warehouse,
            area,
            Role,
            sortMode,
            Category,
            dateRange,
            false // ⬅️ FIRST LOAD
        );
        getwarehouse(Role, area);
        getcategory();
        getDateSelected();
        getsupplier();
    }, [Warehouse, Role, area]);


    async function loaddatabarcode(warehouse: any, area: any, role: any, sortMode: any, Category: any, dateRange: any, isManualDate: boolean = false) {
        setisLoading(true);
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/get_spk`,
            data: {
                warehouse: warehouse,
                area: area,
                role: role,
                sortMode: sortMode,
                Category: Category,
                dateRange: dateRange,
                isManualDate: isManualDate,
            },
        })
            .then(function (response) {
                const result = response.data.result;
                console.log("result", result);

                setdatabarcode(result.data);
                setSpkMultiplier(result.multiplier[0].multiplier);
                setSpkMultiplierId(result.multiplier[0].id);

                setisLoading(false);
            })
            .catch(function (error) {
                console.log(error);
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

    async function getDateSelected() {
        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/getSelectedDate"
            );

            const dateFromDB = res.data.result?.dateSelected;

            console.log("DATE FROM DB:", dateFromDB);

            // cukup return
            return dateFromDB || null;

        } catch (error) {
            console.error("Gagal ambil dateSelected:", error);
            return null;
        }
    }

    const startDate = format(
        startOfDay(subMonths(new Date(), 1)),
        "yyyy-MM-dd"
    );

    const endDate = format(
        endOfDay(new Date()),
        "yyyy-MM-dd"
    );

    const [dateRange, setDateRange] = useState(
        startDate + " to " + endDate
    );

    useEffect(() => {
        async function initDate() {
            const dbDate = await getDateSelected();

            if (dbDate) {
                setDateRange(dbDate);

                const split = dbDate.split(" to ");

                if (split.length === 2) {
                    setValue({
                        startDate: split[0],
                        endDate: split[1],
                    });
                }
            }
        }

        initDate();
    }, []);

    // console.log("dates", startDate + " to " + endDate);


    const [dateSelected, setDateSelected] = useState(dateRange);


    const [value, setValue] = useState<any>({
        startDate,
        endDate,
    });

    const handleValueChange = (newValue: any) => {
        setValue(newValue);

        if (!newValue?.startDate || !newValue?.endDate) {
            setDateRange(startDate + " to " + endDate);
            return;
        }

        const range =
            newValue.startDate + " to " + newValue.endDate;

        setDateRange(range);

        // ⬇️ AUTO LOAD DATA BERDASARKAN TANGGAL
        loaddatabarcode(
            Warehouse,
            area,
            Role,
            sortMode,
            Category,
            range,
            true
        );
    };

    const dateShortcuts: any = {
        bulanIni: {
            text: "Bulan Ini",
            period: {
                start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
                end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
            },
        },

        bulanKemarin: {
            text: "Bulan Kemarin",
            period: {
                start: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
                end: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
            },
        },

        duaBulan: {
            text: "2 Bulan Terakhir",
            period: {
                start: format(startOfDay(subMonths(new Date(), 2)), "yyyy-MM-dd"),
                end: format(endOfDay(new Date()), "yyyy-MM-dd"),
            },
        },

        tigaBulan: {
            text: "3 Bulan Terakhir",
            period: {
                start: format(startOfDay(subMonths(new Date(), 3)), "yyyy-MM-dd"),
                end: format(endOfDay(new Date()), "yyyy-MM-dd"),
            },
        },

        empatBulan: {
            text: "4 Bulan Terakhir",
            period: {
                start: format(startOfDay(subMonths(new Date(), 4)), "yyyy-MM-dd"),
                end: format(endOfDay(new Date()), "yyyy-MM-dd"),
            },
        },

        enamBulan: {
            text: "6 Bulan Terakhir",
            period: {
                start: format(startOfDay(subMonths(new Date(), 6)), "yyyy-MM-dd"),
                end: format(endOfDay(new Date()), "yyyy-MM-dd"),
            },
        },

        satuTahun: {
            text: "1 Tahun Terakhir",
            period: {
                start: format(startOfDay(subMonths(new Date(), 12)), "yyyy-MM-dd"),
                end: format(endOfDay(new Date()), "yyyy-MM-dd"),
            },
        },

        alltime: {
            text: "Semua",
            period: {
                start: "2023-01-01",
                end: format(endOfDay(new Date()), "yyyy-MM-dd"),
            },
        },
    };

    async function getcategory() {
        await axios({
            method: "get",
            url: `https://api.gudangsandal.com/v1/getcategory`,
        })
            .then(function (response) {
                setdatacategory(response.data.data_category);
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

    async function getwarehouse(role: any, area: any) {
        await axios({
            method: "post",
            url: `https://api.gudangsandal.com/v1/getwarehouseSPK`,
            data: {
                role: role,
                area: area,
            },
        })
            .then(function (response) {
                setdataware(response.data.result);
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

    // --- Normalisasi data ---
    const normalizedData = React.useMemo(() => {
        const map = new Map<string, any>();

        data_produkbarcode.forEach((row: any) => {
            const key = `${row.id_produk}-${row.id_ware}`;

            if (!map.has(key)) {
                map.set(key, {
                    id_produk: row.id_produk,
                    id_ware: row.id_ware, // ✅ TAMBAH
                    warehouse: row.warehouse, // ✅ TAMBAH
                    produk: row.produk,
                    stock: row.stock,
                    peak_sales: row.peak_sales ?? 0, // ✅ TAMBAHKAN INI
                    peak_sales_utama: row.peak_sales_utama ?? 0,
                    peak_sales_utama_variation: row.peak_sales_utama_variation ?? 0,
                    Rincian_variasi: row.Rincian_variasi ?? 0,
                    Rincian_variasi_sold: row.Rincian_variasi_sold ?? 0,
                    stokSPK_UTAMA: row.spkUTAMA ?? {},
                    spk: {},
                    spkUTAMA: row.spkUTAMA ?? {},
                    arrival_stok: row.arrival_stok ?? {}
                });
            }

            if (row.spk && Object.keys(row.spk).length > 0) {
                Object.entries(row.spk).forEach(([spkName, spkObj]: any) => {

                    // ✅ JANGAN SHARE SPK KE PRODUK LAIN
                    if (
                        row.id_produk === map.get(key).id_produk &&
                        row.id_ware === map.get(key).id_ware
                    ) {
                        map.get(key).spk[spkName] = spkObj;
                    }

                });
            }
        });

        return Array.from(map.values());
    }, [data_produkbarcode]);

    const spkColumns = React.useMemo(() => {
        const map = new Map<
            string,
            { name: string; created_at: number }
        >();

        normalizedData.forEach((item: any) => {
            Object.entries(item.spk || {}).forEach(([name, obj]: any) => {
                if (!map.has(name)) {
                    map.set(name, {
                        name,
                        // ✅ AMAN — convert ke timestamp
                        created_at: obj.created_at
                            ? new Date(obj.created_at).getTime()
                            : 0
                    });
                }
            });
        });

        return Array.from(map.values())
            // ✅ SORT PALING LAMA → PALING BARU
            .sort((a, b) => a.created_at - b.created_at)
            .map(v => v.name);
    }, [normalizedData]);

    // --- Filter & Pagination berbasis normalizedData ---
    const [filterText, setFilterText] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState<number>(50);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = React.useMemo(() => {
        return normalizedData.filter((item: any) => {
            return (
                item.produk?.toLowerCase().includes(filterText.toLowerCase()) ||
                item.id_produk?.toLowerCase().includes(filterText.toLowerCase())
            );
        });
    }, [normalizedData, filterText]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginatedItems = React.useMemo(() => {
        return filteredItems.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredItems, currentPage, itemsPerPage]);

    const [newSpkSupplier, setNewSpkSupplier] = useState("");

    async function handleAddSpk() {
        const spkName = newSpkName.trim();

        // 1️⃣ VALIDASI CEPAT (TIDAK ADA STATE CHANGE LAIN)
        if (!spkName) {
            toast.warning("Nama PO wajib diisi", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        // if (!newSpkSupplier) {
        //     toast.warning("Supplier wajib dipilih", {
        //         position: "top-right",
        //         autoClose: 2000,
        //     });
        //     return;
        // }

        // ==============================
        // ✅ TENTUKAN WAREHOUSE SEBENARNYA
        // ==============================
        let targetWarehouse = Warehouse;

        // 🔥 JIKA MASIH "all" → AMBIL WAREHOUSE PERTAMA
        if (Warehouse === "all") {
            targetWarehouse = data_ware?.[0]?.id_ware;
        }

        if (!targetWarehouse) {
            toast.error("Warehouse tidak ditemukan");
            return;
        }

        try {
            // 2️⃣ HIT API
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/create_column_spk",
                {
                    nama: spkName,
                    warehouse: targetWarehouse,
                    // id_sup: newSpkSupplier,
                }
            );

            const apiResult = res.data?.result;

            if (apiResult?.success) {
                toast.success(apiResult.message || "PO berhasil ditambahkan", {
                    position: "top-right",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            } else {
                toast.warning(apiResult?.message || "Gagal menambahkan PO", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }

            // 4️⃣ TUNDA OPERASI BERAT (REFETCH + TUTUP MODAL)
            setTimeout(() => {
                loaddatabarcode(Warehouse, area, Role, sortMode, Category, dateRange);
            }, 500);

            setTimeout(() => {
                setShowAddSpk(false);
                setNewSpkName("");
                setNewSpkSupplier("");
            }, 1200);

        } catch (error: any) {
            // 5️⃣ ERROR TOAST
            toast.error(
                error?.response?.data?.message || "Terjadi kesalahan server",
                {
                    position: "top-right",
                    autoClose: 2000,
                }
            );

            // 6️⃣ TUTUP MODAL SETELAH TOAST SEMPAT TAMPIL
            setTimeout(() => {
                setShowAddSpk(false);
                setNewSpkName("");
                setNewSpkSupplier("");
            }, 1200);
        }
    }

    const [editingCell, setEditingCell] = useState<{
        id_produk: string;
        id_ware: string;
        spk_nama: string;
        id_spk?: string;
        id_sup?: string;
    } | null>(null);

    const [editingValue, setEditingValue] = useState("");
    const [spkDetailInput, setSpkDetailInput] = useState("");

    const [showEditSpk, setShowEditSpk] = useState(false);
    const [editSpkData, setEditSpkData] = useState<any>(null);
    const [editQty, setEditQty] = useState("");

    async function submitInlineSpkQty() {
        if (!editingCell) return;

        const payload: any = {
            id_spk: editingCell.id_spk,
            id_sup: editingCell.id_sup,
            spk_nama: editingCell.spk_nama,
            id_produk: editingCell.id_produk,
            id_ware: editingCell.id_ware,
            id_spk_detail: spkDetailInput.trim() || null,
        };

        // =============================
        // MODE 1 → INPUT PER SIZE
        // =============================
        if (sizeInputs && Object.keys(sizeInputs).length > 0) {
            const cleanVariations = Object.entries(sizeInputs).map(
                ([size, qty]) => ({
                    size: String(size),
                    qty: Number(qty) || 0
                })
            );

            payload.variations = cleanVariations;
        }

        // =============================
        // MODE 2 → INLINE EDIT NORMAL
        // =============================
        else {
            payload.qty = Number(editingValue) || 0;
        }

        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/edit_qty_spk",
                payload
            );

            const result = res.data;

            if (result.result?.success) {
                toast.success(
                    result.result.message || "Qty PO diperbarui",
                    { autoClose: 1200 }
                );

                // ✅ RESET SEMUA
                setEditingCell(null);
                setEditingValue("");
                setSizeInputs({});
                setSpkDetailInput("");
                setShowSizeModal(false);

                loaddatabarcode(
                    Warehouse,
                    area,
                    Role,
                    sortMode,
                    Category,
                    dateRange
                );
            } else {
                toast.warning(result?.message || "Gagal memperbarui Qty PO");

                setEditingCell(null);
                setEditingValue("");
            }

        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Terjadi kesalahan server"
            );

            setEditingCell(null);
            setEditingValue("");
        }
    }

    const [editingSpkHeader, setEditingSpkHeader] = useState<{
        id_spk: string;
        old_name: string;
    } | null>(null);

    // ➕ tambah kolom
    const [newSpkName, setNewSpkName] = useState("");
    const [newSpkMonth, setNewSpkMonth] = useState<number>(new Date().getMonth());
    const [newSpkYear, setNewSpkYear] = useState<number>(new Date().getFullYear());
    // ✏️ rename kolom
    const [renameSpkName, setRenameSpkName] = useState("");


    const openRenameSpk = (colName: string) => {
        // ambil id_spk dari data pertama yang memiliki kolom PO tsb
        const firstRow: any = normalizedData.find((d: any) => d.spk?.[colName]);
        const id_spk = firstRow?.spk?.[colName]?.id_spk;

        // simpan object (bukan string) supaya editingSpkHeader.id_spk tidak undefined
        setEditingSpkHeader({
            id_spk: String(id_spk || ""),
            old_name: colName,
        });

        setRenameSpkName(colName || "");
    };

    async function submitRenameSpk() {
        const finalName = renameSpkName.trim();
        console.log("finalName", finalName);
        console.log("editingSpkHeader.id_spk", editingSpkHeader?.id_spk);

        if (!editingSpkHeader) return;

        if (!finalName) {
            toast.error("Nama PO tidak boleh kosong");
            return;
        }

        if (!editingSpkHeader?.id_spk) {
            toast.error("ID SPK tidak ditemukan (kolom PO belum ter-mapping)");
            return;
        }

        await axios.post("https://api.gudangsandal.com/v1/edit_spk_name", {
            id_spk: editingSpkHeader.id_spk,
            nama: finalName,
        });

        toast.success("Nama PO diperbarui");
        setEditingSpkHeader(null);
        setRenameSpkName(""); // reset
        loaddatabarcode(Warehouse, area, Role, sortMode, Category, dateRange);
    }

    function resolveIdSpkFromName(spkName: string): string | null {
        const firstRow: any = normalizedData.find((d: any) => d.spk?.[spkName]);
        if (!firstRow) return null;
        const spkObj = firstRow.spk?.[spkName];
        const supplierEntries = Object.values(spkObj?.Variasi_list || {}) as any[];
        return supplierEntries?.[0]?.id_spk || null;
    }

    async function confirmDeleteSpk(spkName: string) {
        const id_spk = resolveIdSpkFromName(spkName);
        if (!id_spk) {
            toast.error("ID SPK tidak ditemukan");
            return;
        }

        const choice = window.confirm(
            `Pilih jenis hapus untuk PO "${spkName}":\n\n` +
            `OK = DELETE PERMANENT (hapus dari database)\n` +
            `Cancel = batalkan`
        );
        if (!choice) return;

        const isPermanent = window.confirm(
            `⚠️ DELETE PERMANENT\n\nData PO "${spkName}" akan dihapus permanen dari database beserta semua reject & payment terkait.\n\nLanjutkan?`
        );
        if (!isPermanent) return;

        try {
            await axios.post("https://api.gudangsandal.com/v1/delete_spk", { id_spk });
            toast.success("PO berhasil dihapus permanen");
        } catch {
            toast.error("Gagal menghapus PO");
        }
        loaddatabarcode(Warehouse, area, Role, sortMode, Category, dateRange);
    }

    async function confirmDeleteSpkTemp(spkName: string) {
        const id_spk = resolveIdSpkFromName(spkName);
        if (!id_spk) {
            toast.error("ID SPK tidak ditemukan");
            return;
        }

        if (!confirm(`Sembunyikan PO "${spkName}" dari semua halaman?\n\nData tetap tersimpan di database (bisa dipulihkan).`)) return;

        try {
            await axios.post("https://api.gudangsandal.com/v1/delete_spk_temp", { id_spk });
            toast.success("PO berhasil disembunyikan");
        } catch {
            toast.error("Gagal menyembunyikan PO");
        }
        loaddatabarcode(Warehouse, area, Role, sortMode, Category, dateRange);
    }

    const spkUtamaColumns = React.useMemo(() => {
        const available = new Set<string>();

        normalizedData.forEach((item: any) => {
            Object.keys(item.spkUTAMA || {}).forEach(k => available.add(k));
        });

        const SPK_UTAMA_ORDER = [
            "Stock Maret",
            "Sell Puasa",
            "Stock April",
        ];

        return SPK_UTAMA_ORDER.filter(col => available.has(col));
    }, [normalizedData]);

    const [editingSpkUtama, setEditingSpkUtama] = useState<{
        id_produk: string;
        id_ware: string;
        col: string;
    } | null>(null);

    const [editingSpkUtamaValue, setEditingSpkUtamaValue] = useState("");

    async function submitInlineSpkUtamaQty() {
        if (!editingSpkUtama) return;

        const payload = {
            id_produk: editingSpkUtama.id_produk,
            id_ware: editingSpkUtama.id_ware,
            nama: editingSpkUtama.col, // contoh: "Sell Puasa"
            qty: Number(editingSpkUtamaValue) || 0,
        };

        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/edit_qty_spk_utama",
                payload
            );

            if (res.data?.result?.success) {
                toast.success("Qty PO Utama diperbarui", { autoClose: 1200 });

                setEditingSpkUtama(null);
                setEditingSpkUtamaValue("");

                // refresh data
                loaddatabarcode(Warehouse, area, Role, sortMode, Category, dateRange);
            } else {
                toast.warning(res.data?.message || "Gagal update PO Utama");

                setEditingSpkUtama(null);
                setEditingSpkUtamaValue("");
            }
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Terjadi kesalahan server"
            );

            setEditingSpkUtama(null);
            setEditingSpkUtamaValue("");
        }
    }

    const [sortMode, setSortMode] = useState<string>("sales_desc");
    const [Category, setCategory] = useState<string>("all");

    const [showSizeModal, setShowSizeModal] = useState(false);
    const [sizeModalItem, setSizeModalItem] = useState<any>(null);
    const [sizeInputs, setSizeInputs] = useState<Record<string, number>>({});
    const [selectedSpk, setSelectedSpk] = useState<any>(null);

    const totalSizeQty = Object.values(sizeInputs || {}).reduce(
        (sum: number, val: any) => sum + (Number(val) || 0),
        0
    );

    const [showXMountModal, setShowXMountModal] = useState(false);
    const [xMountItem, setXMountItem] = useState<any>(null);

    const [showPeakModal, setShowPeakModal] = useState(false);
    const [peakItem, setPeakItem] = useState<any>(null);

    // NOTE: xMountTotal & xMountVariation dihitung per-row (di dalam map paginatedItems)

    // --- X Month Multiplier Edit Modal State ---
    const [showEditMultiplier, setShowEditMultiplier] = useState(false);
    const [editMultiplierValue, setEditMultiplierValue] = useState<number>(1);
    // Function to submit edit multiplier
    async function submitEditMultiplier() {

        console.log("SEND MULTIPLIER:", {
            id_spk_month: spkMultiplierId,
            multiplier: Number(editMultiplierValue)
        });
        try {
            await axios.post("https://api.gudangsandal.com/v1/x_month", {
                id_spk_month: spkMultiplierId,
                multiplier: Number(editMultiplierValue)
            });

            toast.success("Multiplier berhasil diperbarui");

            setShowEditMultiplier(false);

            loaddatabarcode(
                Warehouse,
                area,
                Role,
                sortMode,
                Category,
                dateRange
            );
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Gagal update multiplier"
            );
        }
    }

    useEffect(() => {
        if (showEditMultiplier) {
            setEditMultiplierValue(spkMultiplier);
        }
    }, [showEditMultiplier, spkMultiplier]);

    const [showSisaModal, setShowSisaModal] = useState(false);
    const [sisaItem, setSisaItem] = useState<any>(null);

    // ── PAYMENT MODAL ───────────────────────────────────────────────
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentModalIdSpk, setPaymentModalIdSpk] = useState<string>("");
    const [paymentModalSpkName, setPaymentModalSpkName] = useState<string>("");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [newPaymentAmount, setNewPaymentAmount] = useState<number | "">("");
    const [newPaymentTanggal, setNewPaymentTanggal] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [newPaymentKet, setNewPaymentKet] = useState<string>("");
    // supplier yang sedang aktif form pembayarannya
    const [activePaymentSup, setActivePaymentSup] = useState<string>("");

    // ── Expand supplier breakdown per PO cell ─────────────────────
    const [expandedPoCells, setExpandedPoCells] = useState<string | null>(null);
    function togglePoCell(key: string) {
        setExpandedPoCells(prev => prev === key ? null : key);
    }

    // ── Rupiah input helpers ───────────────────────────────────────
    // Tampilkan angka dengan titik ribuan, kembalikan angka mentah ke state
    function formatRupiah(val: number | ""): string {
        if (val === "" || val === 0) return "";
        return Number(val).toLocaleString("id-ID");
    }
    function parseRupiah(str: string): number | "" {
        const cleaned = str.replace(/\./g, "").replace(/[^\d]/g, "");
        return cleaned === "" ? "" : Number(cleaned);
    }

    async function loadPaymentSummary(id_spk: string) {
        setPaymentLoading(true);
        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/get_spk_payment_summary",
                { id_spk }
            );
            setPaymentData(res.data?.result?.data || null);
        } catch (err) {
            toast.error("Gagal memuat data payment");
        } finally {
            setPaymentLoading(false);
        }
    }

    async function submitPayment(id_sup: string) {
        if (!newPaymentAmount || Number(newPaymentAmount) <= 0) {
            toast.warning("Masukkan jumlah bayar yang valid");
            return;
        }
        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/add_spk_payment",
                {
                    id_spk: paymentModalIdSpk,
                    id_sup,
                    jumlah_bayar: Number(newPaymentAmount),
                    tanggal_bayar: newPaymentTanggal || null,
                    keterangan: newPaymentKet || null,
                }
            );
            if (res.data?.result?.success) {
                toast.success("Pembayaran berhasil ditambahkan");
                setNewPaymentAmount("");
                setNewPaymentKet("");
                setActivePaymentSup("");
                await loadPaymentSummary(paymentModalIdSpk);
            } else {
                toast.warning(res.data?.result?.message || "Gagal menambah pembayaran");
            }
        } catch {
            toast.error("Terjadi kesalahan server");
        }
    }

    async function deletePayment(id_payment: string) {
        if (!confirm("Hapus pembayaran ini?")) return;
        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/delete_spk_payment",
                { id_payment }
            );
            if (res.data?.result?.success) {
                toast.success("Pembayaran dihapus");
                await loadPaymentSummary(paymentModalIdSpk);
            } else {
                toast.warning(res.data?.result?.message || "Gagal hapus pembayaran");
            }
        } catch {
            toast.error("Terjadi kesalahan server");
        }
    }

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [showExportMenu, setShowExportMenu] = useState(false);
    // 0 = angka saja, 1 = + supplier breakdown, 2 = + grand sum row
    const [footerSpkMode, setFooterSpkMode] = useState(0);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                exportRef.current &&
                !exportRef.current.contains(event.target as Node)
            ) {
                setShowExportMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function exportForecastExcel(itemsToExport: any[]) {
        const rowsSummary: any[] = [];
        const rowsTotalIn: any[] = [];
        const rowsPeak: any[] = [];
        const rowsXMount: any[] = [];
        const rowsSisa: any[] = [];
        const rowsTotalInDetail: any[] = [];
        const rowsSupplierDetail: any[] = [];  // per produk+PO+supplier
        const rowsPaymentSummary: any[] = [];  // ringkasan bayar per PO+supplier
        const rowsPaymentDetail: any[] = [];   // rincian transaksi bayar

        // ──────────────────────────────────────────────────────────────────
        // STEP 1: Kumpulkan semua id_spk unik → fetch payment summary
        // ──────────────────────────────────────────────────────────────────
        const spkIdMap: Record<string, string> = {}; // spkName → id_spk
        itemsToExport.forEach((item: any) => {
            Object.entries(item.spk || {}).forEach(([spkName, spk]: any) => {
                if (spk?.id_spk && !spkIdMap[spkName]) {
                    spkIdMap[spkName] = spk.id_spk;
                }
            });
        });

        // Fetch payment summaries in parallel
        const paymentByIdSpk: Record<string, any> = {}; // id_spk → data
        await Promise.all(
            Object.entries(spkIdMap).map(async ([spkName, id_spk]) => {
                try {
                    const res = await axios.post(
                        "https://api.gudangsandal.com/v1/get_spk_payment_summary",
                        { id_spk }
                    );
                    const data = res.data?.result?.data || null;
                    if (data) paymentByIdSpk[id_spk] = { spkName, ...data };
                } catch { /* skip jika error */ }
            })
        );

        // ──────────────────────────────────────────────────────────────────
        // STEP 2: Build PAYMENT sheets dari data yang sudah di-fetch
        // ──────────────────────────────────────────────────────────────────
        Object.entries(paymentByIdSpk).forEach(([id_spk, data]: any) => {
            const spkName = data.spkName;
            (data.suppliers || []).forEach((sup: any) => {
                rowsPaymentSummary.push({
                    PO: spkName,
                    Supplier: sup.supplier || sup.id_sup,
                    Total_Bruto: sup.totalBruto || 0,
                    Total_Reject: sup.totalRejectAmount || 0,
                    Net_Bayar: sup.totalBayar || 0,
                    Sudah_Bayar: sup.totalSudahBayar || 0,
                    Sisa_Bayar: sup.sisaBayar || 0,
                });
                (sup.payments || []).forEach((pay: any) => {
                    rowsPaymentDetail.push({
                        PO: spkName,
                        Supplier: sup.supplier || sup.id_sup,
                        Tanggal: pay.tanggal_bayar || "",
                        Jumlah_Bayar: pay.jumlah_bayar || 0,
                        Keterangan: pay.keterangan || "",
                        Users: pay.users || "",
                    });
                });
            });
        });

        itemsToExport.forEach((item: any) => {
            const multiplier = Number(spkMultiplier) || 1;

            // ==================================================
            // TOTAL IN PER SIZE = STOCK REAL + SPK
            // ==================================================
            const totalInSizeMap: Record<string, number> = {};

            // ✅ 1. STOCK REAL
            item.Rincian_variasi?.list?.forEach((v: any) => {
                totalInSizeMap[v.size] =
                    (totalInSizeMap[v.size] || 0) + Number(v.qty || 0);
            });

            // ✅ 2. SPK (sisa = SPK qty - arrival per supplier, sama seperti tampilan tabel)
            Object.entries(item.spk || {}).forEach(([spkName, spk]: any) => {
                const arrivalBySup: Record<string, { list: any[]; total: number }> =
                    item.arrival_stok?.[spkName] || {};

                Object.entries(spk?.Variasi_list || {}).forEach(([supId, supplierItem]: any) => {
                    const supArrival = arrivalBySup[String(supId)] || { list: [], total: 0 };

                    // arrival per size untuk supplier ini
                    const supArrivalSizeMap: Record<string, number> = {};
                    (supArrival?.list || []).forEach((a: any) => {
                        supArrivalSizeMap[String(a.size)] = Number(a.qty) || 0;
                    });

                    (supplierItem?.list || []).forEach((v: any) => {
                        const spkQty = Number(v.qty) || 0;
                        const arrQty = Number(supArrivalSizeMap[String(v.size)]) || 0;
                        const remaining = Math.max(0, spkQty - arrQty);
                        totalInSizeMap[v.size] = (totalInSizeMap[v.size] || 0) + remaining;
                    });

                    // ── rowsSupplierDetail ──────────────────────────────
                    const qtyOrdered = Number(supplierItem?.total || 0);
                    const arrivalQty = Number(supArrival?.total || 0);
                    const qtySisa = Math.max(0, qtyOrdered - arrivalQty);
                    const hargaSatuan = Number(supplierItem?.harga || 0);

                    // reject dari payment data (jika sudah ada)
                    const id_spkThis = spk?.id_spk || "";
                    const payDataThis = paymentByIdSpk[id_spkThis] || null;
                    let rejectQtySupProd = 0;
                    let rejectAmtSupProd = 0;
                    if (payDataThis) {
                        const supPayData = (payDataThis.suppliers || []).find(
                            (s: any) => s.id_sup === supId
                        );
                        if (supPayData) {
                            const prodPayData = (supPayData.products || []).find(
                                (p: any) => p.id_produk === item.id_produk && p.id_ware === item.id_ware
                            );
                            if (prodPayData) {
                                rejectQtySupProd = Number(prodPayData.rejectQty || 0);
                                rejectAmtSupProd = Number(prodPayData.rejectAmount || 0);
                            }
                        }
                    }

                    rowsSupplierDetail.push({
                        PO: spkName,
                        Supplier: supplierItem?.supplier || supId,
                        Produk: item.produk,
                        Warehouse: item.warehouse,
                        Qty_SPK: qtyOrdered,
                        Arrival_Qty: arrivalQty,
                        Qty_Sisa: qtySisa,
                        Harga_Satuan: hargaSatuan,
                        Subtotal_Bruto: qtyOrdered * hargaSatuan,
                        Reject_Qty: rejectQtySupProd,
                        Reject_Amount: rejectAmtSupProd,
                        Net_Bayar: Math.max(0, (qtySisa - rejectQtySupProd) * hargaSatuan),
                    });
                });
            });

            // ==================================================
            // TOTAL IN DETAIL (SAMA SEPERTI MODAL)
            // ==================================================
            Object.entries(totalInSizeMap).forEach(([size, qty]) => {
                rowsTotalInDetail.push({
                    Produk: item.produk,
                    Warehouse: item.warehouse,
                    Size: size,
                    Qty: qty
                });
            });

            // ==================================================
            // TOTAL IN SIZE (UNTUK SHEET TOTAL_IN_SIZE)
            // ==================================================
            Object.entries(totalInSizeMap).forEach(([size, qty]) => {
                rowsTotalIn.push({
                    Produk: item.produk,
                    Warehouse: item.warehouse,
                    Size: size,
                    Total_In: qty
                });
            });

            // TOTAL PER PRODUK
            rowsTotalInDetail.push({
                Produk: item.produk,
                Warehouse: item.warehouse,
                Size: "TOTAL",
                Qty: Object.values(totalInSizeMap).reduce(
                    (s: number, q: any) => s + Number(q || 0),
                    0
                )
            });

            // ==================================================
            // PEAK SALES PER SIZE (WAJIB FULL SIZE)
            // ==================================================
            const peakSizeMap: Record<string, number> = {};

            // ambil semua size dari TOTAL IN
            Object.keys(totalInSizeMap).forEach(size => {
                peakSizeMap[size] = 0;
            });

            // isi peak jika ada datanya
            item.peak_sales_utama_variation?.list?.forEach((v: any) => {
                peakSizeMap[v.size] = Number(v.qty || 0);
            });

            // push semua size
            Object.entries(peakSizeMap).forEach(([size, qty]) => {
                rowsPeak.push({
                    Produk: item.produk,
                    Warehouse: item.warehouse,
                    Size: size,
                    Peak: qty
                });
            });

            // ==================================================
            // X MOUNT PER SIZE
            // ==================================================
            Object.entries(peakSizeMap).forEach(([size, peakQty]) => {
                rowsXMount.push({
                    Produk: item.produk,
                    Warehouse: item.warehouse,
                    Size: size,
                    Peak: peakQty,
                    Multiplier: multiplier,
                    X_Mount: peakQty * multiplier
                });
            });

            // ==================================================
            // SISA STOCK
            // ==================================================
            const sizeSet = new Set([
                ...Object.keys(totalInSizeMap),
                ...Object.keys(peakSizeMap)
            ]);

            let totalIn = 0;
            let totalPeak = 0;
            let totalX = 0;
            let totalSisa = 0;

            sizeSet.forEach(size => {
                const stockIn = totalInSizeMap[size] || 0;
                const peak = peakSizeMap[size] || 0;
                const used = peak * multiplier;
                const sisa = stockIn - used;

                totalIn += stockIn;
                totalPeak += peak;
                totalX += used;
                totalSisa += sisa;

                rowsSisa.push({
                    Produk: item.produk,
                    Warehouse: item.warehouse,
                    Size: size,
                    Total_In: stockIn,
                    Peak_X: used,
                    Sisa: sisa
                });
            });

            // ==================================================
            // SUMMARY (SAMA PERSIS SEPERTI TABLE)
            // ==================================================
            rowsSummary.push({
                Produk: item.produk,
                Warehouse: item.warehouse,
                Stock_Real: Number(item.Rincian_variasi?.total || 0),
                Total_SPK: Object.entries(item.spk || {}).reduce(
                    (total: number, [spkName, spk]: any) => {
                        const arrivalBySup = item.arrival_stok?.[spkName] || {};
                        return total + Object.entries(spk?.Variasi_list || {}).reduce(
                            (s: number, [supId, supplierItem]: any) => {
                                const supArrival = arrivalBySup[String(supId)] || { list: [], total: 0 };
                                const remaining = Math.max(
                                    0,
                                    Number(supplierItem?.total || 0) - Number(supArrival?.total || 0)
                                );
                                return s + remaining;
                            },
                            0
                        );
                    },
                    0
                ),
                Total_In: totalIn,
                Peak_Sales: totalPeak,
                X_Month: multiplier,
                Total_X_Mount: totalX,
                Target_Stock: totalSisa
            });
        });

        // ==================================================
        // GRAND TOTAL TOTAL IN DETAIL (SEMUA PRODUK)
        // ==================================================
        rowsTotalInDetail.push({
            Produk: "TOTAL ALL PRODUK",
            Warehouse: "",
            Size: "",
            Qty: rowsTotalInDetail.reduce(
                (sum, r) =>
                    r.Size !== "TOTAL" &&
                        r.Produk !== "TOTAL ALL PRODUK"
                        ? sum + Number(r.Qty || 0)
                        : sum,
                0
            )
        });

        rowsSummary.push({
            Produk: "TOTAL",
            Warehouse: "",
            Stock_Real: rowsSummary.reduce((s, r) => s + (r.Stock_Real || 0), 0),
            Total_SPK: rowsSummary.reduce((s, r) => s + (r.Total_SPK || 0), 0),
            Total_In: rowsSummary.reduce((s, r) => s + (r.Total_In || 0), 0),
            Peak_Sales: rowsSummary.reduce((s, r) => s + (r.Peak_Sales || 0), 0),
            X_Month: "",
            Total_X_Mount: rowsSummary.reduce((s, r) => s + (r.Total_X_Mount || 0), 0),
            Target_Stock: rowsSummary.reduce((s, r) => s + (r.Target_Stock || 0), 0),
        });

        rowsTotalIn.push({
            Produk: "TOTAL",
            Warehouse: "",
            Size: "",
            Total_In: rowsTotalIn.reduce((s, r) => s + (r.Total_In || 0), 0)
        });

        rowsPeak.push({
            Produk: "TOTAL",
            Warehouse: "",
            Size: "",
            Peak: rowsPeak.reduce((s, r) => s + (r.Peak || 0), 0)
        });

        rowsXMount.push({
            Produk: "TOTAL",
            Warehouse: "",
            Size: "",
            Peak: "",
            Multiplier: "",
            X_Mount: rowsXMount.reduce((s, r) => s + (r.X_Mount || 0), 0)
        });

        rowsSisa.push({
            Produk: "TOTAL",
            Warehouse: "",
            Size: "",
            Total_In: rowsSisa.reduce((s, r) => s + (r.Total_In || 0), 0),
            Peak_X: rowsSisa.reduce((s, r) => s + (r.Peak_X || 0), 0),
            Sisa: rowsSisa.reduce((s, r) => s + (r.Sisa || 0), 0)
        });

        // Grand total rowsSupplierDetail
        if (rowsSupplierDetail.length > 0) {
            rowsSupplierDetail.push({
                PO: "TOTAL",
                Supplier: "", Produk: "", Warehouse: "",
                Qty_SPK: rowsSupplierDetail.reduce((s, r) => s + (r.Qty_SPK || 0), 0),
                Arrival_Qty: rowsSupplierDetail.reduce((s, r) => s + (r.Arrival_Qty || 0), 0),
                Qty_Sisa: rowsSupplierDetail.reduce((s, r) => s + (r.Qty_Sisa || 0), 0),
                Harga_Satuan: "",
                Subtotal_Bruto: rowsSupplierDetail.reduce((s, r) => s + (r.Subtotal_Bruto || 0), 0),
                Reject_Qty: rowsSupplierDetail.reduce((s, r) => s + (r.Reject_Qty || 0), 0),
                Reject_Amount: rowsSupplierDetail.reduce((s, r) => s + (r.Reject_Amount || 0), 0),
                Net_Bayar: rowsSupplierDetail.reduce((s, r) => s + (r.Net_Bayar || 0), 0),
            });
        }

        // Grand total rowsPaymentSummary
        if (rowsPaymentSummary.length > 0) {
            rowsPaymentSummary.push({
                PO: "TOTAL", Supplier: "",
                Total_Bruto: rowsPaymentSummary.reduce((s, r) => s + (r.Total_Bruto || 0), 0),
                Total_Reject: rowsPaymentSummary.reduce((s, r) => s + (r.Total_Reject || 0), 0),
                Net_Bayar: rowsPaymentSummary.reduce((s, r) => s + (r.Net_Bayar || 0), 0),
                Sudah_Bayar: rowsPaymentSummary.reduce((s, r) => s + (r.Sudah_Bayar || 0), 0),
                Sisa_Bayar: rowsPaymentSummary.reduce((s, r) => s + (r.Sisa_Bayar || 0), 0),
            });
        }

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(rowsSummary),
            "REKAP_FORECAST"
        );

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(rowsTotalIn),
            "TOTAL_IN_SIZE"
        );

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(rowsTotalInDetail),
            "TOTAL_IN_DETAIL"
        );

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(rowsPeak),
            "PEAK_SALES_SIZE"
        );

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(rowsXMount),
            "X_MOUNT_SIZE"
        );

        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(rowsSisa),
            "SISA_STOCK_SIZE"
        );

        if (rowsSupplierDetail.length > 0) {
            XLSX.utils.book_append_sheet(
                wb, XLSX.utils.json_to_sheet(rowsSupplierDetail), "DETAIL_SUPPLIER"
            );
        }

        if (rowsPaymentSummary.length > 0) {
            XLSX.utils.book_append_sheet(
                wb, XLSX.utils.json_to_sheet(rowsPaymentSummary), "PAYMENT_SUMMARY"
            );
        }

        if (rowsPaymentDetail.length > 0) {
            XLSX.utils.book_append_sheet(
                wb, XLSX.utils.json_to_sheet(rowsPaymentDetail), "PAYMENT_DETAIL"
            );
        }

        XLSX.writeFile(
            wb,
            `Forecast-PO-${format(new Date(), "yyyy-MM-dd-HHmm")}.xlsx`
        );
    }

    async function save_dateSelected(dateSelected: string) {
        try {
            const res = await axios.post(
                "https://api.gudangsandal.com/v1/save_dateSelected",
                {
                    dateSelected: dateSelected
                }
            );

            toast.success("Tanggal berhasil disimpan", {
                position: "top-right",
                autoClose: 1500,
                pauseOnHover: false,
            });

        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Gagal menyimpan tanggal",
                {
                    position: "top-right",
                    autoClose: 2000,
                    pauseOnHover: false,
                }
            );
        }
    }

    return (
        <>
            <div className="p-5">
                <div className="font-bold text-3xl  border-[#2125291A] h-16 -mb-4">
                    Data Production
                </div>

                <div className="flex items-center gap-3 mb-5 flex-wrap border-b">

                    {/* SEARCH */}
                    <div className="shadow rounded-lg flex items-center bg-white">
                        <input
                            className="h-[45px] w-[280px] px-5 text-gray-700 focus:outline-none rounded-l-lg"
                            type="text"
                            placeholder="Search product..."
                            value={filterText}
                            onChange={(e) => {
                                setFilterText(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                        <button
                            type="button"
                            className="h-[45px] px-4 text-gray-500 rounded-r-lg hover:bg-gray-100"
                        >
                            <fa.FaSearch size={16} />
                        </button>
                    </div>

                    {/* WAREHOUSE */}
                    <select
                        value={Warehouse}
                        // disabled={role === "SUPER-ADMIN"}
                        onChange={(e) => {
                            setWarehouse(e.target.value);
                            setCurrentPage(1);
                            loaddatabarcode(e.target.value, area, Role, sortMode, Category, dateRange);
                        }}
                        className="h-[45px] min-w-[180px] px-4 border rounded-lg text-gray-700 focus:outline-none"
                    >
                        {list_warehouse}
                    </select>

                    {/* SORT */}
                    <select
                        value={sortMode}
                        onChange={(e) => {
                            setSortMode(e.target.value);
                            setCurrentPage(1);
                            loaddatabarcode(Warehouse, area, Role, e.target.value, Category, dateRange);
                        }}
                        className="h-[45px] min-w-[160px] px-4 border rounded-lg text-gray-700 focus:outline-none"
                    >
                        <option value="sales_desc">Best Selling</option>
                        <option value="stock_desc">Most Stock</option>
                        <option value="stock_asc">Least Stock</option>
                    </select>

                    {/* CATEGORY */}
                    <select
                        value={Category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCurrentPage(1);
                            loaddatabarcode(Warehouse, area, Role, sortMode, e.target.value, dateRange);
                        }}
                        className="h-[45px] min-w-[160px] px-4 border rounded-lg text-gray-700 focus:outline-none"
                    >
                        <option value="all">All Category</option>
                        {list_category}
                    </select>

                    {/* ADD SPK */}
                    <button
                        onClick={() => {
                            const m = new Date().getMonth();
                            const y = new Date().getFullYear();
                            setNewSpkName("");
                            setShowAddSpk(true);
                        }}
                        className="h-[45px] px-5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 whitespace-nowrap"
                    >
                        + Add PO Column
                    </button>

                    <div className="relative" ref={exportRef}>
                        <button
                            onClick={() => setShowExportMenu(v => !v)}
                            className="h-[45px] px-5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
                        >
                            Export Excel ▼
                        </button>

                        {showExportMenu && (
                            <div className="absolute mt-1 bg-white border rounded shadow z-50 w-[250px]">

                                {/* EXPORT CHECKED */}
                                <button
                                    onClick={() => {
                                        const selected = filteredItems.filter(
                                            i => checkedItems[`${i.id_produk}-${i.id_ware}`]
                                        );

                                        if (selected.length === 0) {
                                            alert("Tidak ada data yang dicentang");
                                            return;
                                        }

                                        exportForecastExcel(selected);
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    ✅ Export Selected
                                </button>

                                {/* EXPORT CURRENT PAGE */}
                                <button
                                    onClick={() => {
                                        exportForecastExcel(paginatedItems);
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    📄 Export Current Page ({itemsPerPage})
                                </button>

                                {/* EXPORT ALL */}
                                <button
                                    onClick={() => {
                                        exportForecastExcel(filteredItems);
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-green-700 font-bold"
                                >
                                    🌍 Export All Data
                                </button>

                            </div>
                        )}
                    </div>

                    <button
                        onClick={async () => {
                            setisLoading(true);

                            setDateSelected(dateRange);

                            // ✅ SIMPAN RANGE TANGGAL
                            await save_dateSelected(dateRange);

                            // ✅ LOAD DATA
                            loaddatabarcode(
                                Warehouse,
                                area,
                                Role,
                                sortMode,
                                Category,
                                dateRange,
                                true
                            );
                        }}
                        disabled={isLoading}
                        className="h-[45px] px-5 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-800 flex items-center gap-2"
                    >
                        <fa.FaSyncAlt
                            className={isLoading ? "animate-spin-slow" : ""}
                        />
                    </button>

                    <div className="sticky top-[110px] z-[999999] ml-auto">
                        <Datepicker
                            displayFormat="DD-MM-YYYY"
                            primaryColor="blue"
                            value={value}
                            readOnly
                            onChange={handleValueChange}
                            showShortcuts
                            showFooter
                            configs={{
                                shortcuts: dateShortcuts,
                                footer: {
                                    cancel: "Close",
                                    apply: "Apply",
                                },
                            }}
                            inputClassName="
                                h-[45px]
                                w-[260px]
                                px-4
                                border
                                rounded-lg
                                bg-white
                                text-gray-700
                                focus:outline-none
                            "
                        />
                    </div>
                </div>

                <div className="mb-20 mt-2 border rounded-lg">

                    {/* TABLE */}
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-max w-full border-collapse text-xs">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-white text-center font-bold">
                                    <th className="p-2 border bg-white">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                const next: any = {};
                                                paginatedItems.forEach((i: any) => {
                                                    next[`${i.id_produk}-${i.id_ware}`] = checked;
                                                });
                                                setCheckedItems(prev => ({ ...prev, ...next }));
                                            }}
                                        />
                                    </th>
                                    <th className="p-2 border bg-white">No</th>
                                    <th className="p-2 border bg-white">Artikel</th>
                                    <th className="p-2 border">Stock</th>

                                    {spkColumns.map((col) => {
                                        // ambil id_spk dari kolom ini (dari baris pertama yang punya data)
                                        const firstRowWithSpk: any = normalizedData.find(
                                            (d: any) => d.spk?.[col]
                                        );
                                        const colIdSpk: string =
                                            firstRowWithSpk?.spk?.[col]?.id_spk ||
                                            (Object.values(firstRowWithSpk?.spk?.[col]?.Variasi_list || {}) as any[])[0]?.id_spk ||
                                            "";

                                        return (
                                            <th key={col} className="group p-2 border bg-red-500 text-white relative w-[80px]">
                                                <div className="flex items-center justify-center min-h-[20px]">
                                                    {/* Nama SPK — hilang saat hover */}
                                                    <span className="whitespace-nowrap group-hover:hidden">
                                                        {col}
                                                    </span>

                                                    {/* Icon actions — muncul saat hover */}
                                                    <div className="hidden group-hover:flex gap-2 items-center justify-center w-full z-10">
                                                        <button
                                                            type="button"
                                                            title="Rename"
                                                            onClick={() => openRenameSpk(col)}
                                                            className="hover:scale-110 transition-transform"
                                                        >
                                                            <i className="fi fi-rr-edit text-base leading-none" style={{ color: "#93c5fd" }}></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Sembunyikan (Temporary)"
                                                            onClick={() => confirmDeleteSpkTemp(col)}
                                                            className="hover:scale-110 transition-transform"
                                                        >
                                                            <i className="fi fi-rr-eye-crossed text-base leading-none" style={{ color: "#d1d5db" }}></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Hapus Permanen"
                                                            onClick={() => confirmDeleteSpk(col)}
                                                            className="hover:scale-110 transition-transform"
                                                        >
                                                            <i className="fi fi-rr-trash text-base leading-none" style={{ color: "#fca5a5" }}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}

                                    <th className="p-2 border bg-gray-200">Total in</th>
                                    <th className="p-2 border bg-lime-200">Peak sales</th>
                                    <th
                                        className="p-2 border bg-yellow-200 cursor-pointer hover:bg-yellow-300"
                                        onClick={() => setShowEditMultiplier(true)}
                                    >
                                        Sales {spkMultiplier} Month
                                    </th>
                                    <th className="p-2 border bg-blue-200">Planned Stock</th>

                                </tr>
                            </thead>

                            <tbody>
                                {paginatedItems.map((item: any, idx: number) => {
                                    // ==============================
                                    // TOTAL SPK
                                    // ==============================
                                    // ✅ TOTAL SPK (SISA PO) = SPK - ARRIVAL
                                    const totalSpk = spkColumns.reduce((sum: number, col: string) => {
                                        const spkObj = item.spk?.[col];
                                        const spkQty =
                                            spkObj?.Variasi_list?.total ??
                                            spkObj?.totalqty ??
                                            0;

                                        // arrival_stok[col] sekarang nested by id_sup → jumlah semua supplier
                                        const arrBySup = item.arrival_stok?.[col] || {};
                                        const arrTotal = Object.values(arrBySup).reduce(
                                            (s: number, a: any) => s + (a?.total || 0), 0
                                        );

                                        return sum + Math.max(0, Number(spkQty || 0) - arrTotal);
                                    }, 0);

                                    // ==============================
                                    // STOCK AWAL (REAL STOCK)
                                    // ==============================
                                    const stockAwal =
                                        Number(item.Rincian_variasi?.total) || 0;

                                    // ==============================
                                    // TOTAL IN = STOCK + SPK
                                    // ==============================
                                    const totalIn = stockAwal + totalSpk;

                                    const peakSales = Number(item.peak_sales_utama) || 0;

                                    // 🔥 total masuk - peak sales
                                    const sisaStock = totalIn - (peakSales * spkMultiplier);

                                    // ✅ X MOUNT (default multiplier 3)
                                    const peakTotalRow = Number(item.peak_sales_utama_variation?.total || 0);
                                    const multiplier = Number(spkMultiplier) || 1;

                                    const xMountTotal = peakTotalRow * multiplier;

                                    const xMountVariation = {
                                        list:
                                            item.peak_sales_utama_variation?.list?.map((v: any) => ({
                                                size: v.size,
                                                qty: (Number(v.qty) || 0) * multiplier,
                                            })) || [],
                                        total: xMountTotal,
                                    };

                                    return (
                                        <tr
                                            key={`${item.id_produk}-${item.id_ware}-${idx}`}
                                            className="bg-white hover:bg-gray-50 text-center"
                                        >
                                            <td className="p-2 border">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        !!checkedItems[`${item.id_produk}-${item.id_ware}`]
                                                    }
                                                    onChange={(e) => {
                                                        setCheckedItems(prev => ({
                                                            ...prev,
                                                            [`${item.id_produk}-${item.id_ware}`]: e.target.checked
                                                        }));
                                                    }}
                                                />
                                            </td>
                                            <td className="p-2 border font-bold">
                                                {(currentPage - 1) * itemsPerPage + idx + 1}
                                            </td>

                                            <td
                                                className={`p-2 border text-left font-medium ${item.stock === 0 ? "bg-red-500 text-white" : ""
                                                    }`}
                                            >
                                                <span>
                                                    {item.produk}
                                                </span>
                                            </td>

                                            <td
                                                className={`p-2 border text-center font-medium ${item.stock === 0 ? "bg-red-500 text-white" : ""
                                                    }`}
                                            >
                                                <span
                                                    onClick={() => {
                                                        setDetailItem({
                                                            ...item,
                                                            mode: "STOCK"   // ✅ TAMBAHAN PENTING
                                                        });
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="cursor-pointer  hover:underline font-bold"
                                                    title="Lihat rincian size"
                                                >
                                                    {item.stock}
                                                </span>
                                            </td>

                                            {spkColumns.map((col: string) => {
                                                const spkObj = item.spk?.[col];

                                                // ✅ ARRIVAL (restock yang sudah masuk) untuk PO ini
                                                // arrival_stok[col] = { [id_sup]: { list, total } }
                                                const arrivalBySupMap: Record<string, { list: any[]; total: number }> =
                                                    item.arrival_stok?.[col] || {};

                                                // total arrival gabungan semua supplier (untuk total cell)
                                                const arrivalCombinedTotal = Object.values(arrivalBySupMap).reduce(
                                                    (s: number, a: any) => s + (a?.total || 0), 0
                                                );

                                                // combined arrivalSizeMap lintas semua supplier (legacy: total cell modal)
                                                const arrivalSizeMap: Record<string, number> = {};
                                                Object.values(arrivalBySupMap).forEach((a: any) => {
                                                    (a?.list || []).forEach((v: any) => {
                                                        arrivalSizeMap[String(v.size)] =
                                                            (arrivalSizeMap[String(v.size)] || 0) + (Number(v.qty) || 0);
                                                    });
                                                });

                                                const supplierEntries = Object.values(spkObj?.Variasi_list || {}) as any[];

                                                // cellValue: hitung sisa per size (hanya kurangi jika size sama)
                                                const cellValue = supplierEntries.reduce((total: number, sup: any) => {
                                                    const supArrival = arrivalBySupMap[String(sup?.id_sup || "NO_SUPPLIER")] || { list: [], total: 0 };
                                                    const supArrivalSizeMap: Record<string, number> = {};
                                                    (supArrival?.list || []).forEach((a: any) => {
                                                        supArrivalSizeMap[String(a.size)] = (supArrivalSizeMap[String(a.size)] || 0) + Number(a.qty || 0);
                                                    });
                                                    const sisaSup = (sup?.list || []).reduce((s: number, v: any) => {
                                                        const spkQty = Number(v.qty || 0);
                                                        const arrQty = Number(supArrivalSizeMap[String(v.size)] || 0);
                                                        return s + Math.max(0, spkQty - arrQty);
                                                    }, 0);
                                                    return total + sisaSup;
                                                }, 0);

                                                const isEditing =
                                                    editingCell &&
                                                    editingCell.id_produk === item.id_produk &&
                                                    editingCell.spk_nama === col;

                                                const cellKey = `${item.id_produk}-${item.id_ware}-${col}`;
                                                const isExpanded = expandedPoCells === cellKey;

                                                return (
                                                    <td
                                                        key={col}
                                                        className={`p-2 border ${isEditing ? "bg-blue-100" : "bg-red-50 font-bold"
                                                            } cursor-pointer hover:bg-blue-50`}
                                                    >
                                                        {supplierEntries.length > 0 ? (
                                                            <div className="flex flex-col items-center gap-1 py-0.5">

                                                                {/* Supplier badges — hanya muncul saat expanded */}
                                                                {isExpanded && (
                                                                    <div className="flex flex-wrap justify-center gap-1">
                                                                        {supplierEntries.map((supplierItem: any) => {
                                                                            const supArrival = arrivalBySupMap[String(supplierItem?.id_sup || "NO_SUPPLIER")] || { list: [], total: 0 };
                                                                            // supplierCellValue: hitung sisa per size (hanya kurangi jika size sama)
                                                                            const supArrivalSizeMapBadge: Record<string, number> = {};
                                                                            (supArrival?.list || []).forEach((a: any) => {
                                                                                supArrivalSizeMapBadge[String(a.size)] = (supArrivalSizeMapBadge[String(a.size)] || 0) + Number(a.qty || 0);
                                                                            });
                                                                            const supplierCellValue = (supplierItem?.list || []).reduce((s: number, v: any) => {
                                                                                const spkQty = Number(v.qty || 0);
                                                                                const arrQty = Number(supArrivalSizeMapBadge[String(v.size)] || 0);
                                                                                return s + Math.max(0, spkQty - arrQty);
                                                                            }, 0);
                                                                            const hasQty = supplierCellValue > 0;

                                                                            return (
                                                                                <div
                                                                                    key={supplierItem?.id_sup || supplierItem?.id_spk}
                                                                                    className={`flex items-center gap-0 rounded-full text-[11px] leading-none overflow-hidden border ${hasQty ? "border-red-300" : "border-gray-200"}`}
                                                                                >
                                                                                    {/* Label supplier */}
                                                                                    <span className={`px-2 py-1 font-bold ${hasQty ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                                                                        {supplierItem?.supplier || supplierItem?.id_sup || "SUP"}
                                                                                    </span>

                                                                                    {/* Qty — klik buka size modal */}
                                                                                    <span
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setEditingCell({
                                                                                                id_produk: item.id_produk,
                                                                                                id_ware: item.id_ware,
                                                                                                spk_nama: col,
                                                                                                id_spk: supplierItem?.id_spk,
                                                                                                id_sup: supplierItem?.id_sup
                                                                                            });
                                                                                            setSelectedSpk({
                                                                                                id_produk: item.id_produk,
                                                                                                id_ware: item.id_ware,
                                                                                                spk_nama: col,
                                                                                                id_spk: supplierItem?.id_spk,
                                                                                                id_sup: supplierItem?.id_sup,
                                                                                                supplier: supplierItem?.supplier
                                                                                            });
                                                                                            const init: any = {};
                                                                                            const existingMap: Record<string, number> = {};
                                                                                            const supArrivalSizeMap: Record<string, number> = {};
                                                                                            (supArrival?.list || []).forEach((a: any) => {
                                                                                                supArrivalSizeMap[String(a.size)] = Number(a.qty) || 0;
                                                                                            });
                                                                                            (supplierItem?.list || []).forEach((v: any) => {
                                                                                                const spkQty = Number(v.qty) || 0;
                                                                                                const arrQty = Number(supArrivalSizeMap[String(v.size)]) || 0;
                                                                                                existingMap[v.size] = Math.max(0, spkQty - arrQty);
                                                                                            });
                                                                                            item.Rincian_variasi?.list?.forEach((v: any) => {
                                                                                                init[v.size] = existingMap[v.size] ?? 0;
                                                                                            });
                                                                                            setSizeInputs(init);
                                                                                            setSizeModalItem(item);
                                                                                            setSpkDetailInput(supplierItem?.id_spk_detail || "");
                                                                                            setShowSizeModal(true);
                                                                                        }}
                                                                                        className={`px-2 py-1 font-bold cursor-pointer transition-colors ${hasQty ? "bg-white text-gray-900 hover:bg-blue-50 hover:text-blue-600" : "bg-white text-gray-300"}`}
                                                                                    >
                                                                                        {supplierCellValue}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}

                                                                {/* Total — selalu tampil, klik toggle expand */}
                                                                <div
                                                                    className="flex items-center gap-1 text-[11px] cursor-pointer select-none"
                                                                    onClick={(e) => { e.stopPropagation(); togglePoCell(cellKey); }}
                                                                >
                                                                    {/* <span className="text-gray-400">Total</span> */}
                                                                    <span className="font-bold text-red-600 text-[13px]">
                                                                        {cellValue}
                                                                    </span>
                                                                    <span className="text-gray-300 text-[10px]">{isExpanded ? "▲" : "▼"}</span>
                                                                </div>

                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center">
                                                                <span className="text-gray-300 text-sm">—</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            <td
                                                className="p-2 border font-bold bg-gray-100 cursor-pointer hover:bg-gray-200"
                                                onClick={() => {
                                                    // ===========================
                                                    // TOTAL IN PER SIZE
                                                    // STOCK REAL + SPK (SISA PO)
                                                    // ===========================
                                                    const totalInSizeMap: Record<string, number> = {};

                                                    // 1️⃣ STOCK REAL
                                                    item.Rincian_variasi?.list?.forEach((v: any) => {
                                                        totalInSizeMap[v.size] =
                                                            (totalInSizeMap[v.size] || 0) + Number(v.qty || 0);
                                                    });

                                                    // 2️⃣ SPK (SISA PO) = SPK - ARRIVAL per size
                                                    Object.entries(item.spk || {}).forEach(([spkName, spk]: any) => {
                                                        // arrival_stok[spkName] = { [id_sup]: { list, total } }
                                                        const arrivalBySup = item.arrival_stok?.[spkName] || {};

                                                        // gabungkan arrival semua supplier per size
                                                        const arrivalBySize: Record<string, number> = {};
                                                        Object.values(arrivalBySup).forEach((a: any) => {
                                                            (a?.list || []).forEach((v: any) => {
                                                                arrivalBySize[String(v.size)] =
                                                                    (arrivalBySize[String(v.size)] || 0) + Number(v.qty || 0);
                                                            });
                                                        });

                                                        spk?.Variasi_list?.list?.forEach((v: any) => {
                                                            const spkQty = Number(v.qty || 0);
                                                            const arrQty = Number(arrivalBySize[String(v.size)] || 0);
                                                            const remaining = Math.max(0, spkQty - arrQty);

                                                            totalInSizeMap[v.size] =
                                                                (totalInSizeMap[v.size] || 0) + remaining;
                                                        });
                                                    });

                                                    const list = Object.entries(totalInSizeMap).map(
                                                        ([size, qty]) => ({
                                                            size,
                                                            qty
                                                        })
                                                    );

                                                    const total = list.reduce(
                                                        (s: number, v: any) => s + Number(v.qty || 0),
                                                        0
                                                    );

                                                    setDetailItem({
                                                        produk: item.produk,
                                                        list,
                                                        total,
                                                        mode: "TOTAL_IN"
                                                    });

                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                {totalIn.toLocaleString("id-ID")}
                                            </td>

                                            <td
                                                className="p-2 border font-bold bg-lime-50 cursor-pointer hover:bg-lime-100"
                                                onClick={() => {
                                                    setPeakItem(item);
                                                    setShowPeakModal(true);
                                                }}
                                            >
                                                {item.peak_sales_utama ?? ""}
                                            </td>

                                            {/* X MOUNT */}
                                            <td
                                                className="p-2 border font-bold bg-yellow-50 cursor-pointer hover:bg-yellow-100"
                                                onClick={() => {
                                                    setXMountItem({
                                                        ...item,
                                                        xMountVariation
                                                    });
                                                    setShowXMountModal(true);
                                                }}
                                            >
                                                {xMountTotal.toLocaleString("id-ID")}
                                            </td>

                                            <td
                                                className="p-2 border font-bold cursor-pointer hover:bg-blue-50"
                                                onClick={() => {

                                                    const multiplier = Number(spkMultiplier) || 1;

                                                    // ===========================
                                                    // TOTAL IN PER SIZE
                                                    // ===========================
                                                    // ===========================
                                                    // TOTAL IN PER SIZE
                                                    // STOCK REAL + SPK
                                                    // ===========================
                                                    const totalInSizeMap: Record<string, number> = {};

                                                    // ✅ 1. MASUKKAN STOCK REAL DULU
                                                    item.Rincian_variasi?.list?.forEach((v: any) => {
                                                        totalInSizeMap[v.size] =
                                                            (totalInSizeMap[v.size] || 0) + Number(v.qty || 0);
                                                    });

                                                    // ✅ 2. TAMBAHKAN SPK KE STOCK
                                                    Object.values(item.spk || {}).forEach((spk: any) => {
                                                        spk?.Variasi_list?.list?.forEach((v: any) => {
                                                            totalInSizeMap[v.size] =
                                                                (totalInSizeMap[v.size] || 0) + Number(v.qty || 0);
                                                        });
                                                    });

                                                    // ===========================
                                                    // PEAK PER SIZE
                                                    // ===========================
                                                    const peakSizeMap: Record<string, number> = {};

                                                    item.peak_sales_utama_variation?.list?.forEach((v: any) => {
                                                        peakSizeMap[v.size] = Number(v.qty || 0);
                                                    });

                                                    // ===========================
                                                    // FINAL SISA PER SIZE
                                                    // ===========================
                                                    const sizeSet = new Set([
                                                        ...Object.keys(totalInSizeMap),
                                                        ...Object.keys(peakSizeMap)
                                                    ]);

                                                    const list = Array.from(sizeSet).map(size => {
                                                        const totalIn = totalInSizeMap[size] || 0;
                                                        const peak = peakSizeMap[size] || 0;

                                                        const used = peak * multiplier;
                                                        const sisa = totalIn - used;

                                                        return {
                                                            size,
                                                            totalIn,
                                                            peak: used,
                                                            sisa
                                                        };
                                                    });

                                                    const total = list.reduce(
                                                        (sum: number, v: any) => sum + v.sisa,
                                                        0
                                                    );

                                                    setSisaItem({
                                                        produk: item.produk,
                                                        list,
                                                        total
                                                    });

                                                    setShowSisaModal(true);
                                                }}
                                            >
                                                {sisaStock.toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot>
                                {(() => {
                                    let totalStock = 0;
                                    let totalTotalIn = 0;
                                    let totalPeak = 0;
                                    let totalXMount = 0;
                                    let totalTarget = 0;

                                    const spkTotals: Record<string, number> = {};

                                    spkColumns.forEach(col => {
                                        spkTotals[col] = 0;
                                    });

                                    paginatedItems.forEach((item: any) => {
                                        const stockAwal = Number(item.Rincian_variasi?.total || 0);

                                        const totalSpk = spkColumns.reduce((s: number, col: string) => {
                                            const spkObj = item.spk?.[col];
                                            const spkQty =
                                                spkObj?.Variasi_list?.total ??
                                                spkObj?.totalqty ??
                                                0;

                                            // arrival nested by id_sup → sum semua supplier
                                            const arrBySup2 = item.arrival_stok?.[col] || {};
                                            const arrTotal = Object.values(arrBySup2).reduce(
                                                (s2: number, a: any) => s2 + (a?.total || 0), 0
                                            );

                                            return s + Math.max(0, Number(spkQty || 0) - arrTotal);
                                        }, 0);

                                        const totalIn = stockAwal + totalSpk;
                                        const peak = Number(item.peak_sales_utama || 0);
                                        const multiplier = Number(spkMultiplier) || 1;
                                        const xMount = peak * multiplier;
                                        const target = totalIn - xMount;

                                        totalStock += stockAwal;
                                        totalTotalIn += totalIn;
                                        totalPeak += peak;
                                        totalXMount += xMount;
                                        totalTarget += target;

                                        spkColumns.forEach(col => {
                                            const spkObj = item.spk?.[col];
                                            const spkQty =
                                                spkObj?.Variasi_list?.total ??
                                                spkObj?.totalqty ??
                                                0;

                                            // arrival nested by id_sup → sum semua supplier
                                            const arrBySup3 = item.arrival_stok?.[col] || {};
                                            const arrTotal = Object.values(arrBySup3).reduce(
                                                (s3: number, a: any) => s3 + (a?.total || 0), 0
                                            );
                                            const remaining = Math.max(0, Number(spkQty || 0) - arrTotal);

                                            spkTotals[col] += remaining;
                                        });
                                    });

                                    // ── GRAND TOTAL dari semua halaman (filteredItems) ──
                                    let gtStock = 0, gtTotalIn = 0, gtPeak = 0, gtXMount = 0, gtTarget = 0;
                                    const gtSpkTotals: Record<string, number> = {};
                                    const gtSpkSupplierTotals: Record<string, Record<string, number>> = {};
                                    spkColumns.forEach(col => {
                                        gtSpkTotals[col] = 0;
                                        gtSpkSupplierTotals[col] = {};
                                    });

                                    filteredItems.forEach((item: any) => {
                                        const stockAwal = Number(item.Rincian_variasi?.total || 0);

                                        // Hitung tSpk dari per-supplier (sama persis dengan cellValue di row)
                                        let tSpk = 0;
                                        spkColumns.forEach(col => {
                                            const spkObj = item.spk?.[col];
                                            const arrBySup = item.arrival_stok?.[col] || {};
                                            const supplierEntries = Object.values(spkObj?.Variasi_list || {}).filter(
                                                (v: any) => v && typeof v === "object" && "id_sup" in v
                                            ) as any[];

                                            let colTotal = 0;
                                            supplierEntries.forEach((sup: any) => {
                                                const supKey = sup?.supplier || sup?.id_sup || "–";
                                                const supArrival = arrBySup[String(sup?.id_sup || "NO_SUPPLIER")] || { list: [], total: 0 };
                                                const supArrivalSizeMap: Record<string, number> = {};
                                                (supArrival?.list || []).forEach((a: any) => {
                                                    supArrivalSizeMap[String(a.size)] = (supArrivalSizeMap[String(a.size)] || 0) + Number(a.qty || 0);
                                                });
                                                const sisaSup = (sup?.list || []).reduce((s: number, v: any) => {
                                                    return s + Math.max(0, Number(v.qty || 0) - Number(supArrivalSizeMap[String(v.size)] || 0));
                                                }, 0);
                                                colTotal += sisaSup;
                                                if (!gtSpkSupplierTotals[col][supKey]) gtSpkSupplierTotals[col][supKey] = 0;
                                                gtSpkSupplierTotals[col][supKey] += sisaSup;
                                            });

                                            gtSpkTotals[col] += colTotal;
                                            tSpk += colTotal;
                                        });

                                        const tIn = stockAwal + tSpk;
                                        const peak = Number(item.peak_sales_utama || 0);
                                        const mult = Number(spkMultiplier) || 1;
                                        const xm = peak * mult;
                                        gtStock += stockAwal;
                                        gtTotalIn += tIn;
                                        gtPeak += peak;
                                        gtXMount += xm;
                                        gtTarget += tIn - xm;
                                    });

                                    // jumlah total semua SPK column (untuk merge)
                                    const gtSpkSum = Object.values(gtSpkTotals).reduce(
                                        (s: number, v: any) => s + (v || 0), 0
                                    );

                                    return (
                                        <>
                                            {/* ── Row 1: total per SPK kolom + kolom lain rowSpan ── */}
                                            <tr className="bg-gray-700 text-white font-bold text-center text-[12px]">
                                                <td colSpan={3} rowSpan={footerSpkMode === 2 ? 2 : 1} className="p-2 border border-gray-600 sticky bottom-0 z-20">
                                                    GRAND TOTAL ({filteredItems.length} produk)
                                                </td>
                                                {/* Stock */}
                                                <td rowSpan={footerSpkMode === 2 ? 2 : 1} className="p-2 border border-gray-600 sticky bottom-0 z-20">
                                                    {gtStock.toLocaleString("id-ID")}
                                                </td>
                                                {/* SPK — mode 0: angka saja | mode 1: + supplier breakdown | mode 2: sama dengan mode 1 */}
                                                {spkColumns.map((col: string) => {
                                                    const supBreakdown = gtSpkSupplierTotals[col] || {};
                                                    const supEntries = Object.entries(supBreakdown).filter(([, v]) => (v as number) > 0);
                                                    return (
                                                        <td
                                                            key={col}
                                                            className="p-2 border border-red-900 bg-red-600 text-white cursor-pointer select-none"
                                                            title={footerSpkMode === 0 ? "Klik untuk lihat supplier detail" : footerSpkMode === 1 ? "Klik untuk lihat grand sum" : "Klik untuk reset"}
                                                            onClick={() => setFooterSpkMode(m => (m + 1) % 3)}
                                                        >
                                                            {footerSpkMode >= 1 && supEntries.length > 0 && (
                                                                <div className="text-[10px] font-normal opacity-90 mb-1 leading-tight">
                                                                    {supEntries.map(([sup, qty], i) => (
                                                                        <span key={sup}>
                                                                            {i > 0 && <span className="opacity-60">, </span>}
                                                                            <span className="font-semibold">{sup}</span>
                                                                            {": "}
                                                                            {(qty as number).toLocaleString("id-ID")}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {(gtSpkTotals[col] || 0).toLocaleString("id-ID")}
                                                        </td>
                                                    );
                                                })}
                                                {/* Total In */}
                                                <td rowSpan={footerSpkMode === 2 ? 2 : 1} className="p-2 border border-gray-600 bg-gray-600 sticky bottom-0 z-20">
                                                    {gtTotalIn.toLocaleString("id-ID")}
                                                </td>
                                                {/* Peak */}
                                                <td rowSpan={footerSpkMode === 2 ? 2 : 1} className="p-2 border border-gray-600 bg-lime-800 sticky bottom-0 z-20">
                                                    {gtPeak.toLocaleString("id-ID")}
                                                </td>
                                                {/* X Month */}
                                                <td rowSpan={footerSpkMode === 2 ? 2 : 1} className="p-2 border border-gray-600 bg-yellow-700 sticky bottom-0 z-20">
                                                    {gtXMount.toLocaleString("id-ID")}
                                                </td>
                                                {/* Target */}
                                                <td rowSpan={footerSpkMode === 2 ? 2 : 1} className="p-2 border border-gray-600 bg-blue-800 sticky bottom-0 z-20">
                                                    {gtTarget.toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                            {/* ── Row 2: grand total semua SPK di-merge — tampil hanya jika mode 2 ── */}
                                            {footerSpkMode === 2 && (
                                                <tr className="bg-gray-700 text-white font-bold text-center text-[12px]">
                                                    <td
                                                        colSpan={spkColumns.length}
                                                        className="p-1 border border-red-900 bg-red-800 text-white text-[11px] cursor-pointer select-none"
                                                        onClick={() => setFooterSpkMode(0)}
                                                    >
                                                        {gtSpkSum.toLocaleString("id-ID")}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })()}
                            </tfoot>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-between items-center mt-4 px-2 bg-white">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span className="text-sm text-gray-600">rows</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages} • Total {filteredItems.length} items
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                className="px-3 py-1 border rounded disabled:opacity-40"
                            >
                                Prev
                            </button>

                            {[...Array(totalPages)].slice(0, 5).map((_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 border rounded ${currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : ""
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                                }
                                className="px-3 py-1 border rounded disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {showAddSpk && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000]">
                            <div className="bg-white rounded-lg p-6 w-[400px]">
                                <h2 className="text-lg font-bold mb-4">Tambah Kolom PO</h2>
                                <input
                                    className="w-full border px-3 py-2 rounded mb-4"
                                    value={newSpkName}
                                    onChange={(e) => setNewSpkName(e.target.value)}
                                    autoFocus
                                />

                                {/* <select
                                    className="w-full border px-3 py-2 rounded mb-4"
                                    value={newSpkSupplier}
                                    onChange={(e) => setNewSpkSupplier(e.target.value)}
                                >
                                    <option value="">Pilih Supplier</option>
                                    {list_supplier}
                                </select> */}

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowAddSpk(false)}
                                        className="px-4 py-2 border rounded"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleAddSpk}
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {editingSpkHeader && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000]">
                            <div className="bg-white rounded-lg p-6 w-[400px]">
                                <h2 className="text-lg font-bold mb-4">Rename PO</h2>

                                <input
                                    className="w-full border px-3 py-2 rounded mb-4"
                                    placeholder="Contoh: PO Mar 2026"
                                    value={renameSpkName}
                                    onChange={(e) => setRenameSpkName(e.target.value)}
                                    autoFocus
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditingSpkHeader(null)}
                                        className="px-4 py-2 border rounded"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        onClick={submitRenameSpk}
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {showDetailModal && detailItem && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999999]">
                            <div className="bg-white rounded-lg w-[700px] p-6">

                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">
                                        {detailItem.mode === "TOTAL_IN"
                                            ? "Rincian Total In (Stock + SPK)"
                                            : "Rincian Variasi"}
                                        — {detailItem.produk}
                                    </h2>

                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </div>
                                {detailItem.mode === "TOTAL_IN" && (
                                    <div className="mb-6">
                                        <table className="w-full border text-center text-sm">
                                            <thead>
                                                <tr className="bg-blue-100">
                                                    {detailItem.list.map((v: any) => (
                                                        <th key={v.size} className="border p-2">
                                                            {v.size}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    {detailItem.list.map((v: any) => (
                                                        <td
                                                            key={v.size}
                                                            className="border p-2 font-bold text-blue-700"
                                                        >
                                                            {Number(v.qty).toLocaleString("id-ID")}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="text-right text-sm mt-2 font-bold text-blue-700">
                                            Total In:{" "}
                                            {Number(detailItem.total || 0).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                )}

                                {detailItem.mode === "STOCK" && (
                                    <>
                                        {/* ===================== */}
                                        {/* STOCK REAL */}
                                        {/* ===================== */}
                                        <div className="mb-6">
                                            <h3 className="font-bold mb-2 text-green-700">
                                                STOCK REAL
                                            </h3>

                                            <table className="w-full border text-center text-sm">
                                                <thead>
                                                    <tr className="bg-green-100">
                                                        {detailItem.Rincian_variasi?.list?.map((v: any) => (
                                                            <th key={v.size} className="border p-2">
                                                                {v.size}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr>
                                                        {detailItem.Rincian_variasi?.list?.map((v: any) => (
                                                            <td
                                                                key={v.size}
                                                                className={`border p-2 font-bold ${v.qty === 0 ? "text-gray-400" : ""
                                                                    }`}
                                                            >
                                                                {Number(v.qty).toLocaleString("id-ID")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <div className="text-right text-sm mt-1 font-bold">
                                                Total: {Number(detailItem.Rincian_variasi?.total).toLocaleString("id-ID") ?? 0}
                                            </div>
                                        </div>

                                        {/* ===================== */}
                                        {/* STOCK SOLD */}
                                        {/* ===================== */}
                                        <div>
                                            <h3 className="font-bold mb-2 text-red-700">
                                                STOCK SOLD
                                            </h3>

                                            <table className="w-full border text-center text-sm">
                                                <thead>
                                                    <tr className="bg-red-100">
                                                        {detailItem.Rincian_variasi_sold?.list?.map((v: any) => (
                                                            <th key={v.size} className="border p-2">
                                                                {v.size}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr>
                                                        {detailItem.Rincian_variasi_sold?.list?.map((v: any) => (
                                                            <td
                                                                key={v.size}
                                                                className="border p-2 font-bold"
                                                            >
                                                                {Number(v.qty).toLocaleString("id-ID")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <div className="text-right text-sm mt-1 font-bold">
                                                Total: {Number(detailItem.Rincian_variasi_sold?.total).toLocaleString("id-ID") ?? 0}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>,
                        document.body
                    )
                }

                {showSizeModal && sizeModalItem &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999999]">
                            <div className="bg-white rounded-lg w-[420px] p-6">

                                <h2 className="font-bold text-lg mb-1">
                                    Input Qty per Size — <span className="text-blue-600">{selectedSpk?.spk_nama}</span>
                                </h2>

                                <div className="text-sm font-semibold text-gray-600 mb-1">
                                    Supplier: <span className="text-gray-800">{selectedSpk?.supplier || selectedSpk?.id_sup || "-"}</span>
                                </div>

                                <div className="text-gray-500 mb-6 font-bold text-lg">
                                    Produk: {sizeModalItem.produk}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                        No. Detail / Batch Production
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border px-3 py-2 rounded text-sm"
                                        placeholder="Contoh: BATCH-001, LOT-A, dll..."
                                        value={spkDetailInput}
                                        onChange={(e) => setSpkDetailInput(e.target.value)}
                                    />
                                </div>

                                <table className="w-full border text-sm mb-4">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2">Size</th>
                                            <th className="border p-2">Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeModalItem.Rincian_variasi?.list?.map((v: any) => (
                                            <tr key={v.size}>
                                                <td className="border p-2 text-center font-bold">
                                                    {v.size}
                                                </td>
                                                <td className="border p-2">
                                                    <input
                                                        type="number"
                                                        className="w-full border px-2 py-1 text-center"
                                                        value={sizeInputs[v.size] ?? ""}
                                                        onChange={(e) =>
                                                            setSizeInputs(prev => ({
                                                                ...prev,
                                                                [v.size]: Number(e.target.value)
                                                            }))
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* TOTAL QTY */}
                                <div className="mt-4 border-t pt-4 flex justify-between items-center mb-4">
                                    <span className="text-sm font-semibold text-gray-600">
                                        Total Qty
                                    </span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {totalSizeQty.toLocaleString("id-ID")}
                                    </span>
                                </div>

                                {/* ID SPK DETAIL */}


                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setShowSizeModal(false);
                                            setSpkDetailInput("");
                                        }}
                                        className="px-4 py-2 border rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={submitInlineSpkQty}
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {showPeakModal && peakItem && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999999]">
                            <div className="bg-white rounded-lg w-[700px] p-6">

                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-lime-700">
                                        Peak Sales

                                        <span className="block text-sm text-gray-500 mb-4">
                                            Produk:{" "}
                                            <span className="font-semibold text-gray-800">
                                                {peakItem?.produk}
                                            </span>
                                        </span>
                                    </h2>

                                    <button
                                        onClick={() => setShowPeakModal(false)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* ===================== */}
                                {/* PEAK SALES VARIATION */}
                                {/* ===================== */}
                                <div>
                                    <table className="w-full border text-center text-sm">
                                        <thead>
                                            <tr className="bg-lime-100">
                                                {peakItem.peak_sales_utama_variation?.list?.map(
                                                    (v: any) => (
                                                        <th
                                                            key={v.size}
                                                            className="border p-2"
                                                        >
                                                            {v.size}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                {peakItem.peak_sales_utama_variation?.list?.map(
                                                    (v: any) => (
                                                        <td
                                                            key={v.size}
                                                            className={`border p-2 font-bold ${v.qty === 0
                                                                ? "text-gray-400"
                                                                : "text-lime-700"
                                                                }`}
                                                        >
                                                            {Number(v.qty).toLocaleString(
                                                                "id-ID"
                                                            )}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="text-right text-sm mt-2 font-bold text-lime-700">
                                        Total Peak Sales:{" "}
                                        {Number(
                                            peakItem.peak_sales_utama_variation?.total
                                        ).toLocaleString("id-ID")}
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {showXMountModal && xMountItem && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999999]">
                            <div className="bg-white rounded-lg w-[700px] p-6">

                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-yellow-700">
                                        X Mount (×{spkMultiplier})

                                        <span className="block text-sm text-gray-500 mb-4">
                                            Produk:{" "}
                                            <span className="font-semibold text-gray-800">
                                                {xMountItem?.produk}
                                            </span>
                                        </span>
                                    </h2>

                                    <button
                                        onClick={() => setShowXMountModal(false)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* TABLE */}
                                <table className="w-full border text-center text-sm">
                                    <thead>
                                        <tr className="bg-yellow-100">
                                            {xMountItem.xMountVariation.list.map((v: any) => (
                                                <th key={v.size} className="border p-2">
                                                    {v.size}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            {xMountItem.xMountVariation.list.map((v: any) => (
                                                <td
                                                    key={v.size}
                                                    className={`border p-2 font-bold ${v.qty === 0
                                                        ? "text-gray-400"
                                                        : "text-yellow-700"
                                                        }`}
                                                >
                                                    {Number(v.qty).toLocaleString("id-ID")}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="text-right text-sm mt-2 font-bold text-yellow-700">
                                    Total X Mount:{" "}
                                    {Number(xMountItem.xMountVariation.total).toLocaleString("id-ID")}
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {/* EDIT X MONTH MULTIPLIER MODAL */}
                {showEditMultiplier && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999999]">
                            <div className="bg-white rounded-lg p-6 w-[360px]">

                                <h2 className="text-lg font-bold mb-4 text-yellow-700">
                                    Edit X Month Multiplier
                                </h2>

                                <label className="block text-sm mb-2">
                                    Multiplier (contoh: 2, 3, 4)
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    className="w-full border px-3 py-2 rounded mb-4 text-center text-lg font-bold"
                                    value={editMultiplierValue}
                                    onChange={(e) =>
                                        setEditMultiplierValue(Number(e.target.value))
                                    }
                                />

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowEditMultiplier(false)}
                                        className="px-4 py-2 border rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={submitEditMultiplier}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {showSisaModal && sisaItem && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999999]">
                            <div className="bg-white rounded-lg w-[750px] p-6">

                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-blue-700">
                                        Sisa Stock Forecast (×{spkMultiplier})

                                        <span className="block text-sm text-gray-500 mt-1">
                                            Produk:{" "}
                                            <span className="font-semibold text-gray-800">
                                                {sisaItem.produk}
                                            </span>
                                        </span>
                                    </h2>

                                    <button
                                        onClick={() => setShowSisaModal(false)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* TABLE */}
                                <table className="w-full border text-center text-sm">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            {sisaItem.list.map((v: any) => (
                                                <th key={v.size} className="border p-2">
                                                    {v.size}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            {sisaItem.list.map((v: any) => (
                                                <td
                                                    key={v.size}
                                                    className="border p-2 font-bold text-blue-700"
                                                >
                                                    {v.sisa.toLocaleString("id-ID")}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="text-right text-sm mt-3 font-bold text-blue-700">
                                    Total Sisa Stock:{" "}
                                    {Number(sisaItem.total).toLocaleString("id-ID")}
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                }

                {/* ═══════════════════════════════════════════════════════
                    PAYMENT MODAL — Rincian Total Bayar ke Supplier
                ═══════════════════════════════════════════════════════ */}
                {showPaymentModal && typeof window !== "undefined" &&
                    createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999999]">
                            <div className="bg-white w-full h-full overflow-y-auto p-6 shadow-2xl flex flex-col">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-4 border-b pb-3">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            💰 Payment — {paymentModalSpkName}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            ID SPK: {paymentModalIdSpk}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="text-gray-400 hover:text-black text-xl font-bold"
                                    >✕</button>
                                </div>

                                {paymentLoading ? (
                                    <div className="text-center py-10 text-gray-400">Memuat data…</div>
                                ) : paymentData ? (
                                    <>
                                        {/* ── GRAND TOTAL RINGKASAN ── */}
                                        <div className="grid grid-cols-3 gap-2 mb-5 p-3 bg-gray-50 rounded-lg border">
                                            <div>
                                                <div className="text-xs text-gray-400">Total Bruto</div>
                                                <div className="font-bold text-gray-700">
                                                    Rp {Number(paymentData.grandBruto).toLocaleString("id-ID")}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-blue-400">Total Harus Bayar</div>
                                                <div className="font-bold text-blue-700">
                                                    Rp {Number(paymentData.grandBayar).toLocaleString("id-ID")}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Sisa (semua supplier)</div>
                                                <div className={`font-bold text-lg ${Number(paymentData.grandSisa) > 0 ? "text-red-600" : "text-green-600"}`}>
                                                    Rp {Number(paymentData.grandSisa).toLocaleString("id-ID")}
                                                    {Number(paymentData.grandSisa) <= 0 && " ✅"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── PER SUPPLIER SECTION ── */}
                                        {paymentData.suppliers?.map((sup: any) => (
                                            <div key={sup.id_sup} className="border rounded-xl mb-5 overflow-hidden">

                                                {/* Header Supplier */}
                                                <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between">
                                                    <div className="font-bold">
                                                        🏭 Supplier: {sup.supplier}
                                                    </div>
                                                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${Number(sup.sisaBayar) > 0 ? "bg-red-700" : "bg-green-500"}`}>
                                                        Sisa: Rp {Number(sup.sisaBayar).toLocaleString("id-ID")}
                                                        {Number(sup.sisaBayar) <= 0 && " ✅"}
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    {/* Tabel produk supplier ini */}
                                                    <table className="w-full border text-xs mb-3">
                                                        <thead>
                                                            <tr className="bg-gray-100 text-center">
                                                                <th className="border p-2 text-left">Produk</th>
                                                                <th className="border p-2">Qty</th>
                                                                <th className="border p-2">Harga</th>
                                                                <th className="border p-2">Subtotal</th>
                                                                <th className="border p-2">Net</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sup.products?.map((p: any, i: number) => (
                                                                <tr key={i} className="text-center hover:bg-gray-50">
                                                                    <td className="border p-2 text-left font-medium">{p.produk}</td>
                                                                    <td className="border p-2 font-bold">{Number(p.qty).toLocaleString("id-ID")}</td>
                                                                    <td className="border p-2 text-blue-600">
                                                                        {Number(p.harga) > 0
                                                                            ? `Rp ${Number(p.harga).toLocaleString("id-ID")}`
                                                                            : <span className="text-gray-300">—</span>
                                                                        }
                                                                    </td>
                                                                    <td className="border p-2">Rp {Number(p.subtotal).toLocaleString("id-ID")}</td>
                                                                    <td className="border p-2 font-bold text-green-700">
                                                                        Rp {Number(p.netSubtotal).toLocaleString("id-ID")}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {/* Ringkasan supplier */}
                                                    <div className="flex gap-3 mb-3 text-xs">
                                                        <div className="flex-1 bg-gray-50 border rounded p-2 text-center">
                                                            <div className="text-gray-400">Bruto</div>
                                                            <div className="font-bold">Rp {Number(sup.totalBruto).toLocaleString("id-ID")}</div>
                                                        </div>
                                                        <div className="flex-1 bg-blue-50 border border-blue-200 rounded p-2 text-center">
                                                            <div className="text-blue-400">Harus Bayar</div>
                                                            <div className="font-bold text-blue-700">Rp {Number(sup.totalBayar).toLocaleString("id-ID")}</div>
                                                        </div>
                                                        <div className="flex-1 bg-green-50 border border-green-200 rounded p-2 text-center">
                                                            <div className="text-green-400">Sudah Bayar</div>
                                                            <div className="font-bold text-green-700">Rp {Number(sup.totalSudahBayar).toLocaleString("id-ID")}</div>
                                                        </div>
                                                    </div>


                                                    {/* History pembayaran supplier ini */}
                                                    {sup.payments?.length > 0 && (
                                                        <div className="mb-3">
                                                            <div className="text-xs font-semibold text-gray-500 mb-1">History Pembayaran</div>
                                                            <table className="w-full border text-xs">
                                                                <thead>
                                                                    <tr className="bg-gray-50 text-center">
                                                                        <th className="border p-1.5">Tanggal</th>
                                                                        <th className="border p-1.5">Jumlah</th>
                                                                        <th className="border p-1.5">Keterangan</th>
                                                                        <th className="border p-1.5">Hapus</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {sup.payments.map((pay: any) => (
                                                                        <tr key={pay.id_payment} className="text-center">
                                                                            <td className="border p-1.5">
                                                                                {pay.tanggal_bayar
                                                                                    ? format(new Date(pay.tanggal_bayar), "dd/MM/yyyy")
                                                                                    : "—"}
                                                                            </td>
                                                                            <td className="border p-1.5 font-bold text-green-700">
                                                                                Rp {Number(pay.jumlah_bayar).toLocaleString("id-ID")}
                                                                            </td>
                                                                            <td className="border p-1.5 text-gray-500">{pay.keterangan || "—"}</td>
                                                                            <td className="border p-1.5">
                                                                                <button
                                                                                    onClick={() => deletePayment(pay.id_payment)}
                                                                                    className="text-red-500 hover:text-red-700"
                                                                                    title="Hapus"
                                                                                >🗑️</button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}

                                                    {/* Form Tambah Pembayaran per supplier */}
                                                    {activePaymentSup === sup.id_sup ? (
                                                        <div className="border rounded-lg p-3 bg-blue-50">
                                                            <div className="grid grid-cols-3 gap-2 mb-2">
                                                                <div>
                                                                    <label className="text-xs text-gray-500 block mb-1">Jumlah Bayar (Rp)</label>
                                                                    <div className="relative">
                                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">Rp</span>
                                                                        <input
                                                                            type="text"
                                                                            inputMode="numeric"
                                                                            className="w-full border pl-7 pr-2 py-1 rounded text-right font-bold text-sm"
                                                                            placeholder="0"
                                                                            value={formatRupiah(newPaymentAmount)}
                                                                            onChange={(e) => setNewPaymentAmount(parseRupiah(e.target.value))}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs text-gray-500 block mb-1">Tanggal</label>
                                                                    <input
                                                                        type="date"
                                                                        className="w-full border px-2 py-1 rounded text-sm"
                                                                        value={newPaymentTanggal}
                                                                        onChange={(e) => setNewPaymentTanggal(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs text-gray-500 block mb-1">Keterangan</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full border px-2 py-1 rounded text-sm"
                                                                        placeholder="DP, Pelunasan, dll"
                                                                        value={newPaymentKet}
                                                                        onChange={(e) => setNewPaymentKet(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    onClick={() => { setActivePaymentSup(""); setNewPaymentAmount(""); setNewPaymentKet(""); }}
                                                                    className="px-3 py-1 border rounded text-sm"
                                                                >Batal</button>
                                                                <button
                                                                    onClick={() => submitPayment(sup.id_sup)}
                                                                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                                                                >Simpan Pembayaran</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setActivePaymentSup(sup.id_sup);
                                                                setNewPaymentAmount("");
                                                                setNewPaymentKet("");
                                                            }}
                                                            className="w-full py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-500 text-sm hover:bg-blue-50 font-semibold"
                                                        >
                                                            + Tambah Pembayaran ke {sup.supplier}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {paymentData.suppliers?.length === 0 && (
                                            <div className="text-center py-6 text-gray-400 text-sm">
                                                Belum ada produk dengan qty &gt; 0 di PO ini
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        Tidak ada data untuk PO ini
                                    </div>
                                )}
                            </div>
                        </div>,
                        document.body
                    )
                }


            </div >

            {toastReady &&
                createPortal(
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        pauseOnHover={false}
                        newestOnTop
                        closeOnClick
                        style={{ zIndex: 999999 }}
                    />,
                    document.body
                )
            }
        </>

    );


}
