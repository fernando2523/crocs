import Head from "next/head";
import React, { useState, useEffect } from "react";
import {
    format,
    subDays,
    lastDayOfMonth,
    startOfMonth,
    startOfWeek,
    lastDayOfWeek,
    endOfDay,
    startOfDay,
} from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { Container, Banknote } from "lucide-react";

let Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
let Numbering = new Intl.NumberFormat("id-ID");

export default function PageDefectReject() {
    // ── State ──────────────────────────────────────────────────────────
    const [isLoading, setisLoading] = useState(true);
    const [data_reject, setDataReject] = useState<any[]>([]);
    const [total_reject, setTotalReject] = useState(0);
    const [total_qty, setTotalQty] = useState(0);
    const [data_users, setDataUsers] = useState<any[]>([]);
    const [data_brand, setDataBrand] = useState<any[]>([]);

    const [Brand, setBrand] = useState("all");
    const [Filter_Tipe_user, setFilter_Tipe_user] = useState<any>(
        "SUPER-ADMIN" === Cookies.get("auth_role") || "HEAD-AREA" === Cookies.get("auth_role")
            ? "all"
            : Cookies.get("auth_name")
    );
    const [Filter_Tipe_warehouse, setFilter_Tipe_warehouse] = useState("all");

    const user_login = Cookies.get("auth_name");
    const user_role = Cookies.get("auth_role");
    const user_store = Cookies.get("auth_store");

    // ── Status & bulk ──────────────────────────────────────────────────
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
    const [bulkUpdating, setBulkUpdating] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterTglDikirim, setFilterTglDikirim] = useState<string>("all");
    const [filterSupplier, setFilterSupplier] = useState<string>("all");

    // ── Delete ─────────────────────────────────────────────────────────
    const [delModal, setDelModal] = useState(false);
    const [delGroup, setDelGroup] = useState<{ id_spk_detail: string; id_produk: string; tanggal_dikirim: string; users: string; produk?: string } | null>(null);
    const [delLoading, setDelLoading] = useState(false);

    // ── Edit Harga ─────────────────────────────────────────────────────
    const [editHargaModal, setEditHargaModal] = useState(false);
    const [editHargaGroup, setEditHargaGroup] = useState<{ id_spk_detail: string; id_produk: string; tanggal_dikirim: string; produk?: string } | null>(null);
    const [editHargaValue, setEditHargaValue] = useState<string>("");
    const [originalHarga, setOriginalHarga] = useState<number>(0);
    const [editHargaSizes, setEditHargaSizes] = useState<{ size: string; qty_reject: number; newQty: number; originalQty: number }[]>([]);
    const [editHargaSizeLoading, setEditHargaSizeLoading] = useState(false);

    // ── Print menu ────────────────────────────────────────────────────
    const [showPrintMenu, setShowPrintMenu] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);

    // ── Size inline expand ─────────────────────────────────────────────
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [expandedSizeData, setExpandedSizeData] = useState<any[]>([]);
    const [sizeLoadingKey, setSizeLoadingKey] = useState<string | null>(null);

    // ── Date range ────────────────────────────────────────────────────
    const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const lastDate = format(lastDayOfMonth(new Date()), "yyyy-MM-dd");
    const [date, setDate] = useState(startDate + " to " + lastDate);
    const [value, setValues] = useState<any>(null);

    const today: any = "Hari Ini";
    const yesterday: any = "Kemarin";
    const currentMonth: any = "Bulan ini";
    const pastMonth: any = "Bulan Kemarin";
    const todayDate: any = format(new Date(), "yyyy-MM-dd");
    const mingguinistart = format(startOfWeek(new Date()), "yyyy-MM-dd");
    const mingguiniend = format(lastDayOfWeek(new Date()), "yyyy-MM-dd");
    const minggukemarinstart = format(subDays(startOfWeek(new Date()), 7), "yyyy-MM-dd");
    const minggukemarinend = format(subDays(lastDayOfWeek(new Date()), 7), "yyyy-MM-dd");
    const break2month = format(subDays(lastDayOfWeek(new Date()), 66), "yyyy-MM-dd");

    const handleValueChange = (newValue: any) => {
        if (!newValue.startDate || !newValue.endDate) {
            setDate(startDate + " to " + lastDate);
        } else {
            const d = newValue.startDate + " to " + newValue.endDate;
            setDate(d);
            loadData(d, Filter_Tipe_user, Filter_Tipe_warehouse, Brand);
        }
        setValues(newValue);
    };

    // ── Load data ──────────────────────────────────────────────────────
    async function loadData(
        tanggal = date,
        fUser = Filter_Tipe_user,
        fWare = Filter_Tipe_warehouse,
        brand = Brand
    ) {
        setisLoading(true);
        try {
            const res = await axios.post("http://localhost:4000/v1/get_spk_reject_list", {
                date: tanggal,
                query: "all",
                Filter_Tipe_user: fUser,
                Filter_Tipe_warehouse: fWare,
                Brand: brand,
                user_role,
                user_store,
            });
            setDataReject(res.data?.result?.datas || []);
            setTotalReject(res.data?.result?.total_reject || 0);
            setTotalQty(res.data?.result?.total_qty || 0);
        } catch (e) {
            toast.error("Gagal memuat data reject", { autoClose: 2000 });
        } finally {
            setisLoading(false);
        }
    }

    async function getUsers() {
        try {
            const res = await axios.post("http://localhost:4000/v1/getusertransfer", {
                user_login, user_role, user_store,
            });
            setDataUsers(res.data?.result?.get_user || []);
            setDataBrand(res.data?.result?.get_brand || []);
            if (user_role !== "SUPER-ADMIN" && user_role !== "HEAD-AREA") {
                const firstUser = res.data?.result?.get_user?.[0]?.users;
                if (firstUser) {
                    setFilter_Tipe_user(firstUser);
                    loadData(date, firstUser, Filter_Tipe_warehouse, Brand);
                }
            }
        } catch { /* silent */ }
    }

    useEffect(() => {
        loadData();
        getUsers();
    }, []);

    // Tutup print menu kalau klik di luar
    useEffect(() => {
        if (!showPrintMenu) return;
        function handleOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-print-menu]")) setShowPrintMenu(false);
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [showPrintMenu]);

    // ── Group key helper ───────────────────────────────────────────────
    function groupKey(item: any): string {
        return `${item.tanggal_dikirim}|${item.id_spk_detail}|${item.id_produk}`;
    }

    function getCheckedIdRejects(): string[] {
        const allIds: string[] = [];
        data_reject.forEach((group: any) => {
            (group.detail || []).forEach((item: any) => {
                if (checkedIds.has(groupKey(item))) {
                    allIds.push(...(item.id_rejects || []));
                }
            });
        });
        return allIds;
    }

    // ── Status toggle ──────────────────────────────────────────────────
    async function toggleStatus(item: any) {
        const newStatus = item.status === "SUDAH DIKIRIM" ? "BELUM DIKIRIM" : "SUDAH DIKIRIM";
        const key = groupKey(item);
        setUpdatingStatusId(key);
        try {
            await axios.post("http://localhost:4000/v1/bulk_update_spk_reject_status", {
                ids: item.id_rejects || [],
                status: newStatus,
            });
            loadData();
        } catch {
            toast.error("Gagal update status", { autoClose: 1500 });
        } finally {
            setUpdatingStatusId(null);
        }
    }

    async function bulkChangeStatus(newStatus: string) {
        if (!checkedIds.size) return;
        const allIdRejects = getCheckedIdRejects();
        if (!allIdRejects.length) return;
        setBulkUpdating(true);
        try {
            await axios.post("http://localhost:4000/v1/bulk_update_spk_reject_status", {
                ids: allIdRejects,
                status: newStatus,
            });
            setCheckedIds(new Set());
            loadData();
        } catch {
            toast.error("Gagal update status massal", { autoClose: 1500 });
        } finally {
            setBulkUpdating(false);
        }
    }

    // ── Edit Harga ─────────────────────────────────────────────────────
    async function handleSaveHarga() {
        if (!editHargaGroup) return;
        const harga = Number(editHargaValue.replace(/\./g, "").replace(/[^\d]/g, ""));
        if (isNaN(harga) || harga <= 0) { toast.warn("Masukkan harga yang valid"); return; }

        // ── Deteksi apakah harga benar-benar berubah ─────────────────
        const hargaChanged = harga !== originalHarga;

        // ── Deteksi apakah qty benar-benar berubah ────────────────────
        // Hanya size yang returnQty (qty_reject - newQty) berbeda dari originalQty yang masuk sizeAdjustments
        const sizeAdjustments = editHargaSizes
            .filter(s => {
                const returnQty = s.qty_reject - s.newQty;
                return returnQty !== s.originalQty;     // qty berubah dari nilai awal modal dibuka
            })
            .map(s => ({ size: s.size, qty_reject: s.qty_reject - s.newQty }));
        const qtyChanged = sizeAdjustments.length > 0;

        // Tidak ada perubahan sama sekali
        if (!hargaChanged && !qtyChanged) {
            toast.info("Tidak ada perubahan yang perlu disimpan");
            setEditHargaModal(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/v1/update_spk_reject_harga_group", {
                ...editHargaGroup,
                harga,
                hargaChanged,   // flag: apakah harga perlu diupdate di tb_spk_reject + tb_purchaseorder
                sizeAdjustments, // kosong jika qty tidak berubah
                users: user_login,
            });
            if (res.data?.result?.success) {
                toast.success("Data berhasil disimpan", { autoClose: 1500 });
                loadData();
            } else {
                toast.error(res.data?.result?.message || "Gagal menyimpan");
            }
        } catch {
            toast.error("Error menyimpan data");
        } finally {
            setEditHargaModal(false);
            setEditHargaGroup(null);
            setEditHargaValue("");
            setOriginalHarga(0);
            setEditHargaSizes([]);
        }
    }

    // ── Size inline expand ─────────────────────────────────────────────
    async function loadSizes(item: any) {
        const key = groupKey(item);
        // toggle collapse
        if (expandedKey === key) {
            setExpandedKey(null);
            setExpandedSizeData([]);
            return;
        }
        setSizeLoadingKey(key);
        setExpandedKey(key);
        setExpandedSizeData([]);
        try {
            const res = await axios.post("http://localhost:4000/v1/get_spk_reject_sizes", {
                id_spk_detail: item.id_spk_detail,
                id_produk: item.id_produk,
                tanggal_dikirim: item.tanggal_dikirim,
            });
            setExpandedSizeData(res.data?.result?.sizes || []);
        } catch {
            toast.error("Gagal memuat rincian size");
            setExpandedKey(null);
        } finally {
            setSizeLoadingKey(null);
        }
    }

    // ── Delete ─────────────────────────────────────────────────────────
    function openDeleteModal(item: any) {
        setDelGroup({
            id_spk_detail: item.id_spk_detail,
            id_produk: item.id_produk,
            tanggal_dikirim: item.tanggal_dikirim,
            users: user_login || "",
            produk: item.produk,
        });
        setDelModal(true);
    }

    async function deleteItem() {
        if (!delGroup) return;
        setDelLoading(true);
        try {
            // Tidak kirim rejects → backend proses semua size dari DB
            await axios.post("http://localhost:4000/v1/delete_spk_reject_group", { ...delGroup });
            toast.success("Data berhasil dihapus, semua stok dikembalikan", { autoClose: 1500 });
            loadData();
        } catch {
            toast.error("Gagal menghapus data", { autoClose: 1500 });
        } finally {
            setDelLoading(false);
            setDelModal(false);
            setDelGroup(null);
        }
    }

    // ── Check / uncheck ────────────────────────────────────────────────
    function toggleCheck(id: string) {
        setCheckedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function toggleCheckAll(ids: string[]) {
        setCheckedIds(prev => {
            if (ids.every(id => prev.has(id))) {
                const next = new Set(prev);
                ids.forEach(id => next.delete(id));
                return next;
            }
            return new Set([...Array.from(prev), ...ids]);
        });
    }

    // ── Collect all visible IDs (for bulk) ─────────────────────────────
    function getAllVisibleIds(): string[] {
        return data_reject.flatMap((group: any) =>
            (group.detail || [])
                .filter((item: any) => applyItemFilter(item))
                .map((item: any) => groupKey(item))
        );
    }

    // Hanya item BELUM DIKIRIM yang boleh di-ceklis
    function getCheckableIds(): string[] {
        return data_reject.flatMap((group: any) =>
            (group.detail || [])
                .filter((item: any) => applyItemFilter(item) && item.status !== "SUDAH DIKIRIM")
                .map((item: any) => groupKey(item))
        );
    }

    function applyItemFilter(item: any): boolean {
        if (filterStatus !== "all" && item.status !== filterStatus) return false;
        if (filterTglDikirim !== "all" && item.tanggal_dikirim !== filterTglDikirim) return false;
        if (filterSupplier !== "all" && item.supplier !== filterSupplier) return false;
        return true;
    }

    // ── All unique tanggal_dikirim from loaded data ────────────────────
    const allTglDikirim = Array.from(new Set(
        data_reject.flatMap((g: any) =>
            (g.detail || []).map((d: any) => d.tanggal_dikirim).filter(Boolean)
        )
    )).sort().reverse() as string[];

    // ── All unique suppliers from loaded data ──────────────────────────
    const allSuppliers = Array.from(new Set(
        data_reject.flatMap((g: any) =>
            (g.detail || []).map((d: any) => d.supplier).filter(Boolean)
        )
    )).sort() as string[];

    // ── Build table rows ───────────────────────────────────────────────
    const isAdmin = user_role === "SUPER-ADMIN" || user_role === "HEAD-AREA" || user_role === "HEAD-WAREHOUSE";
    const isSuperAdmin = user_role === "SUPER-ADMIN";
    const isHeadArea = user_role === "HEAD-AREA";

    // ── Summary values — dihitung dari data yang sudah difilter ────────
    const filteredItems = data_reject.flatMap((g: any) =>
        (g.detail || []).filter((item: any) => applyItemFilter(item))
    );
    const filtered_total_reject = filteredItems.length;
    const filtered_total_qty = filteredItems.reduce((s: number, it: any) => s + (Number(it.qty_reject) || 0), 0);
    const filtered_total_amount = filteredItems.reduce((s: number, it: any) => s + (Number(it.subtotal) || 0), 0);

    // ── Print PDF ──────────────────────────────────────────────────────
    async function handlePrint(withSize: boolean) {
        setShowPrintMenu(false);
        setPrintLoading(true);

        try {
            // Jika ada yang diceklis → print hanya yang diceklis; jika tidak → print semua yang tampil
            const hasBulk = checkedIds.size > 0;

            // Kumpulkan semua item yang akan diprint
            const allItems: any[] = [];
            data_reject.forEach((group: any) => {
                (group.detail || []).filter(applyItemFilter).forEach((item: any) => {
                    if (hasBulk && !checkedIds.has(groupKey(item))) return;
                    allItems.push(item);
                });
            });

            // Kalau withSize → fetch sizes semua item sekaligus
            const sizesMap: Record<string, any[]> = {};
            if (withSize) {
                await Promise.all(allItems.map(async (item: any) => {
                    const key = groupKey(item);
                    try {
                        const res = await axios.post("http://localhost:4000/v1/get_spk_reject_sizes", {
                            id_spk_detail: item.id_spk_detail,
                            id_produk: item.id_produk,
                            tanggal_dikirim: item.tanggal_dikirim,
                        });
                        sizesMap[key] = res.data?.result?.sizes || [];
                    } catch {
                        sizesMap[key] = [];
                    }
                }));
            }

            const rows: any[] = [];
            let grandQty = 0;
            let grandSubtotal = 0;

            data_reject.forEach((group: any, groupIdx: number) => {
                const filteredDetail = (group.detail || []).filter((item: any) => {
                    if (!applyItemFilter(item)) return false;
                    if (hasBulk && !checkedIds.has(groupKey(item))) return false;
                    return true;
                });
                if (filteredDetail.length === 0) return;

                const tglLabel = group.tanggal && group.tanggal !== "unknown"
                    ? group.tanggal.split("-").reverse().join("-")
                    : (group.tanggal || "–");

                rows.push(`
                    <tr>
                        <td colspan="${isSuperAdmin ? 9 : 7}" style="padding:6px 10px;font-weight:700;background:#f3f4f6;border-bottom:1px solid #ccc;">
                            ${groupIdx + 1}) ${tglLabel} &nbsp;&nbsp; <span style="font-weight:400;color:#666;">Users: ${group.users || "–"}</span>
                        </td>
                    </tr>`);

                let groupQty = 0;
                let groupSubtotal = 0;

                filteredDetail.forEach((item: any, ri: number) => {
                    const qty = Number(item.qty_reject || 0);
                    const sub = Number(item.subtotal || 0);
                    groupQty += qty;
                    groupSubtotal += sub;
                    const statusBadge = item.status === "SUDAH DIKIRIM"
                        ? `<span style="background:#d1fae5;color:#065f46;padding:1px 6px;border-radius:99px;font-size:10px;">SUDAH DIKIRIM</span>`
                        : `<span style="background:#fed7aa;color:#92400e;padding:1px 6px;border-radius:99px;font-size:10px;">BELUM DIKIRIM</span>`;
                    const tglDikirim = item.tanggal_dikirim
                        ? item.tanggal_dikirim.split("-").reverse().join("-")
                        : "–";

                    rows.push(`
                        <tr style="background:${ri % 2 === 0 ? "#fff" : "#f9fafb"}">
                            <td style="text-align:center;">${ri + 1}</td>
                            <td style="text-align:center;font-family:monospace;color:#1d4ed8;">${item.id_spk_detail || "–"}</td>
                            <td>${item.produk} <span style="color:#9ca3af;font-size:10px;">${item.id_produk}</span></td>
                            <td style="text-align:center;">${item.warehouse}</td>
                            <td style="text-align:center;">${item.supplier}</td>
                            <td style="text-align:center;color:#dc2626;font-weight:700;">${qty}</td>
                            ${isSuperAdmin ? `<td style="text-align:right;">${item.harga > 0 ? "Rp " + Number(item.harga).toLocaleString("id-ID") : "–"}</td>` : ""}
                            ${isSuperAdmin ? `<td style="text-align:right;">${sub > 0 ? "Rp " + sub.toLocaleString("id-ID") : "–"}</td>` : ""}
                            <td style="text-align:center;">${statusBadge}<br/><span style="font-size:9px;color:#6b7280;">${tglDikirim}</span></td>
                        </tr>`);

                    // ── Size breakdown row — badge/pill style (hanya kalau withSize) ──
                    if (withSize) {
                        const sizes: any[] = sizesMap[groupKey(item)] || [];
                        const badgesHtml = sizes.map((s: any) => {
                            const hasQty = Number(s.qty_reject) > 0;
                            const bg = hasQty ? "#4338ca" : "#ffffff";
                            const color = hasQty ? "#ffffff" : "#9ca3af";
                            const border = hasQty ? "#4338ca" : "#d1d5db";
                            return `<span style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:10px;font-weight:700;background:${bg};color:${color};border:1.5px solid ${border};margin:2px 3px;">${s.size} = ${s.qty_reject}</span>`;
                        }).join("");

                        rows.push(`
                            <tr>
                                <td colspan="${isSuperAdmin ? 9 : 7}" style="background:#eef2ff;padding:5px 16px 7px;border-top:none;">
                                    <span style="font-size:10px;font-weight:700;color:#4338ca;display:block;margin-bottom:4px;">Rincian Size — ${item.produk}</span>
                                    <div style="line-height:1.8;">${badgesHtml}</div>
                                </td>
                            </tr>`);
                    }
                });

                grandQty += groupQty;
                grandSubtotal += groupSubtotal;

                rows.push(`
                    <tr style="background:#fef2f2;font-weight:700;">
                        <td colspan="5" style="text-align:right;padding:4px 8px;font-size:11px;">Subtotal grup:</td>
                        <td style="text-align:center;color:#dc2626;">${groupQty}</td>
                        ${isSuperAdmin ? `<td></td><td style="text-align:right;">Rp ${groupSubtotal.toLocaleString("id-ID")}</td>` : ""}
                        <td colspan="1"></td>
                    </tr>`);
            });

            const headers = `<tr style="background:#1f2937;color:#fff;">
                <th>No</th><th>ID SPK</th><th>Produk</th><th>Gudang</th><th>Supplier</th>
                <th>Qty</th>
                ${isSuperAdmin ? "<th>Harga</th><th>Subtotal</th>" : ""}
                <th>Status</th>
            </tr>`;

            const grandRow = `<tr style="background:#111827;color:#fff;font-weight:700;">
                <td colspan="5" style="text-align:right;padding:6px 10px;">GRAND TOTAL</td>
                <td style="text-align:center;">${grandQty}</td>
                ${isSuperAdmin ? `<td></td><td style="text-align:right;">Rp ${grandSubtotal.toLocaleString("id-ID")}</td>` : ""}
                <td colspan="1"></td>
            </tr>`;

            const [dateFrom, dateTo] = date.includes(" to ") ? date.split(" to ") : [date, date];
            const printWin = window.open("", "_blank", "width=1100,height=800");
            if (!printWin) return;
            printWin.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
                <title>Defect Reject — ${dateFrom} s/d ${dateTo}</title>
                <style>
                    body{font-family:Arial,sans-serif;font-size:11px;margin:16px;}
                    h2{margin:0 0 4px;font-size:14px;}
                    p{margin:0 0 10px;color:#6b7280;font-size:11px;}
                    table{width:100%;border-collapse:collapse;}
                    th,td{border:1px solid #d1d5db;padding:4px 6px;vertical-align:middle;}
                    th{font-size:11px;}
                    @media print{@page{size:A4 landscape;margin:10mm;}}
                </style>
            </head><body>
                <h2>Laporan Defect Reject${withSize ? " — Dengan Rincian Size" : ""}</h2>
                <p>Periode: ${dateFrom} s/d ${dateTo}${filterSupplier !== "all" ? " &nbsp;|&nbsp; Supplier: " + filterSupplier : ""}${filterStatus !== "all" ? " &nbsp;|&nbsp; Status: " + filterStatus : ""}</p>
                <table>${headers}${rows.join("")}${grandRow}</table>
            </body></html>`);
            printWin.document.close();
            printWin.focus();
            setTimeout(() => { printWin.print(); }, 400);
        } finally {
            setPrintLoading(false);
        }
    }

    const list_rows: any[] = [];
    if (!isLoading) {
        data_reject.forEach((group: any, groupIdx: number) => {
            const filteredDetail = (group.detail || []).filter(applyItemFilter);
            if (filteredDetail.length === 0) return;

            list_rows.push(
                <tbody key={groupIdx} className="group text-xs">
                    {/* Group header row */}
                    <tr>
                        <td className="p-0 pt-4 h-full text-sm font-semibold" colSpan={isSuperAdmin ? 11 : 9}>
                            <div className="flex flex-row h-full bg-white pb-3 pt-5 pl-5 rounded-t-lg">
                                <div className="basis-1/2 font-semibold">
                                    {groupIdx + 1} ) {(() => {
                                        const raw = group.created_at || group.detail?.[0]?.created_at;
                                        if (!raw) return "–";
                                        const d = new Date(raw);
                                        const dd = String(d.getDate()).padStart(2, "0");
                                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                                        const yyyy = d.getFullYear();
                                        return `${dd}-${mm}-${yyyy}`;
                                    })()}
                                </div>
                                <div className="basis-1/2 text-right -mb-2 mr-5">
                                    Users : <span className="font-semibold">{group.users || "–"}</span>
                                </div>
                            </div>
                        </td>
                    </tr>

                    {filteredDetail.map((item: any, rowIdx: number) => {
                        const gKey = groupKey(item);
                        const isChecked = checkedIds.has(gKey);
                        const isExp = expandedKey === gKey;
                        const isExpLoading = sizeLoadingKey === gKey;
                        return (
                            <React.Fragment key={rowIdx}>
                                <tr className={`py-2 ${isChecked ? "bg-red-50" : ""}`}>
                                    {/* Checkbox */}
                                    {isAdmin ? (
                                        <td className="p-0 bg-white h-full w-[2%]">
                                            <div className="flex justify-center items-center h-full border">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    disabled={item.status === "SUDAH DIKIRIM"}
                                                    onChange={() => item.status !== "SUDAH DIKIRIM" && toggleCheck(gKey)}
                                                    className={`w-3.5 h-3.5 accent-red-500 ${item.status === "SUDAH DIKIRIM" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                                                />
                                            </div>
                                        </td>
                                    ) : null}

                                    {/* No */}
                                    <td className="p-0 pl-2 bg-white h-full w-[3%]">
                                        <div className="flex flex-wrap justify-center items-center h-full border font-bold">
                                            {rowIdx + 1}
                                        </div>
                                    </td>

                                    {/* ID SPK Detail */}
                                    <td className="p-0 h-full w-[8%]">
                                        <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border text-center">
                                            <span className="font-mono text-xs text-blue-700">{item.id_spk_detail || "–"}</span>
                                        </div>
                                    </td>

                                    {/* Produk — clickable for size breakdown */}
                                    <td className="p-0 h-full w-[24%]">
                                        <div
                                            className="flex flex-wrap justify-center items-center h-full bg-white px-4 border cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => loadSizes(item)}
                                            title="Klik untuk lihat rincian size"
                                        >
                                            <span className="text-blue-700 font-medium underline decoration-dotted">{item.produk}</span>
                                            <span className="text-gray-400 ml-1">{item.id_produk}</span>
                                        </div>
                                    </td>

                                    {/* Gudang */}
                                    <td className="p-0 h-full w-[10%]">
                                        <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border">
                                            {item.warehouse}
                                        </div>
                                    </td>

                                    {/* Supplier */}
                                    <td className="p-0 h-full w-[12%]">
                                        <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border">
                                            {item.supplier}
                                        </div>
                                    </td>

                                    {/* Qty Reject (total summed) */}
                                    <td className="p-0 h-full w-[6%]">
                                        <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border font-semibold text-red-600">
                                            {item.qty_reject}
                                        </div>
                                    </td>

                                    {/* Harga — SUPER-ADMIN only */}
                                    {isSuperAdmin ? (
                                        <td className="p-0 h-full w-[8%]">
                                            <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border text-xs gap-1">
                                                {item.harga > 0
                                                    ? Rupiah.format(item.harga)
                                                    : <span className="text-gray-300">–</span>
                                                }
                                            </div>
                                        </td>
                                    ) : null}

                                    {/* Sub Total — SUPER-ADMIN only */}
                                    {isSuperAdmin ? (
                                        <td className="p-0 h-full w-[10%]">
                                            <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border text-xs">
                                                {item.subtotal > 0 ? Rupiah.format(item.subtotal) : <span className="text-gray-300">–</span>}
                                            </div>
                                        </td>
                                    ) : null}

                                    {/* Status — klik kolom untuk toggle (admin only) */}
                                    <td className="p-0 h-full w-[10%]">
                                        <div
                                            className={`flex flex-col justify-center items-center h-full bg-white px-2 py-2 border gap-0.5
                                                ${isAdmin ? "cursor-pointer hover:brightness-95 active:brightness-90" : ""}
                                                ${updatingStatusId === gKey ? "opacity-50 cursor-wait" : ""}`}
                                            title={isAdmin ? (item.status === "SUDAH DIKIRIM" ? "Tandai Belum Dikirim" : "Tandai Sudah Dikirim") : ""}
                                            onClick={() => isAdmin && updatingStatusId !== gKey && toggleStatus(item)}
                                        >
                                            {updatingStatusId === gKey ? (
                                                <span className="text-[10px] text-gray-400">...</span>
                                            ) : (
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${item.status === "SUDAH DIKIRIM"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                                    }`}>
                                                    {item.status === "SUDAH DIKIRIM" ? "SUDAH DIKIRIM" : "BELUM DIKIRIM"}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Act — edit harga + delete (SUPER-ADMIN / HEAD-AREA) */}
                                    {(user_role === "SUPER-ADMIN" || user_role === "HEAD-AREA") ? (
                                        <td className="p-0 h-full w-[5%]">
                                            <div className="flex justify-center items-center gap-2 h-full bg-white px-2 border">
                                                {(user_role === "SUPER-ADMIN" || user_role === "HEAD-AREA") && (
                                                    <button
                                                        onClick={async () => {
                                                            setEditHargaGroup({
                                                                id_spk_detail: item.id_spk_detail,
                                                                id_produk: item.id_produk,
                                                                tanggal_dikirim: item.tanggal_dikirim,
                                                                produk: item.produk,
                                                            });
                                                            setEditHargaValue(item.harga > 0 ? Rupiah.format(item.harga) : "");
                                                            setOriginalHarga(item.harga || 0); // simpan harga awal untuk deteksi perubahan
                                                            setEditHargaSizes([]);
                                                            setEditHargaModal(true);
                                                            setEditHargaSizeLoading(true);
                                                            try {
                                                                const res = await axios.post("http://localhost:4000/v1/get_spk_reject_sizes", {
                                                                    id_spk_detail: item.id_spk_detail,
                                                                    id_produk: item.id_produk,
                                                                    tanggal_dikirim: item.tanggal_dikirim,
                                                                });
                                                                const sizes: any[] = res.data?.result?.sizes || [];
                                                                setEditHargaSizes(sizes.map((s: any) => ({
                                                                    size: s.size,
                                                                    qty_reject: Number(s.qty_reject),
                                                                    newQty: Number(s.qty_reject), // default: tidak ada yg dikembalikan (returnQty = 0)
                                                                    originalQty: 0,               // originalQty = returnQty awal = 0
                                                                })));
                                                            } catch {
                                                                toast.error("Gagal memuat rincian size");
                                                            } finally {
                                                                setEditHargaSizeLoading(false);
                                                            }
                                                        }}
                                                        className="text-blue-400 hover:text-blue-600 text-sm"
                                                        title="Edit Harga"
                                                    >
                                                        <i className="fi fi-rr-edit text-center text-sm"></i>
                                                    </button>
                                                )}
                                                {(user_role === "SUPER-ADMIN" || (user_role === "HEAD-AREA" && item.status !== "SUDAH DIKIRIM")) && (
                                                    <button
                                                        onClick={() => openDeleteModal(item)}
                                                        className="text-red-400 hover:text-red-600 text-sm"
                                                        title="Hapus"
                                                    >
                                                        <i className="fi fi-rr-trash text-center"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    ) : null}
                                </tr>
                                {/* ── Inline size expand row ── */}
                                {isExp && (
                                    <tr>
                                        <td colSpan={isSuperAdmin ? 11 : 9} className="bg-indigo-50 border px-6 py-3">
                                            <p className="text-xs font-semibold text-indigo-700 mb-2">
                                                Rincian Size — {item.produk}
                                            </p>
                                            {isExpLoading ? (
                                                <p className="text-xs text-gray-400">Memuat...</p>
                                            ) : expandedSizeData.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {expandedSizeData.map((s: any, si: number) => (
                                                        <span
                                                            key={si}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold border ${Number(s.qty_reject) > 0 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-400 border-gray-300"}`}
                                                        >
                                                            {s.size} = {s.qty_reject}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">Tidak ada data size</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Group footer — totals */}
                    <tr className="py-2 font-bold">
                        <td className="p-0 bg-white h-full" colSpan={6}>
                            <div className="flex flex-wrap justify-center items-center h-full"></div>
                        </td>
                        <td className="p-0 h-full">
                            <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border py-2 font-bold text-red-600">
                                {filteredDetail.reduce((s: number, it: any) => s + (it.qty_reject || 0), 0)}
                            </div>
                        </td>
                        {isSuperAdmin ? (
                            <td className="p-0 bg-white h-full">
                                <div className="flex flex-wrap justify-center items-center h-full"></div>
                            </td>
                        ) : null}
                        {isSuperAdmin ? (
                            <td className="p-0 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white px-2 border py-2 text-xs font-semibold">
                                    {Rupiah.format(filteredDetail.reduce((s: number, it: any) => s + (it.subtotal || 0), 0))}
                                </div>
                            </td>
                        ) : null}
                        <td className="p-0 bg-white h-full" colSpan={2}>
                            <div className="flex flex-wrap justify-center items-center h-full"></div>
                        </td>
                    </tr>

                    <tr>
                        <td className="p-0 h-full" colSpan={isSuperAdmin ? 11 : 9}>
                            <div className="flex flex-wrap items-center h-full bg-white pb-10 pl-[0.8%] rounded-b-lg"></div>
                        </td>
                    </tr>
                </tbody>
            );
        });
    }

    // ── JSX ────────────────────────────────────────────────────────────
    return (
        <div className="p-5">
            <div className="font-bold text-2xl border-b border-[#2125291A] h-10 mb-5">
                Defect Detail Report
            </div>

            {/* ── Summary cards (SUPER-ADMIN & HEAD-AREA) ── */}
            {(isSuperAdmin || isHeadArea) && (
                <div className="mt-3 mb-5">
                    <div className="flex flex-row mt-0 gap-3 text-black">
                        <div className={`${isSuperAdmin ? "basis-1/3" : "basis-1/2"} bg-white border border-gray-300 h-[110px] rounded-lg shadow-md`}>
                            <div className="text-md font-semibold py-4 px-5">Total Defect Cases</div>
                            <div className="flex flex-row text-left mt-2">
                                <div className="basis-full text-2xl font-semibold py-0 px-5">
                                    {Numbering.format(filtered_total_reject)} Entri
                                </div>
                                <div className="basis-auto mt-1 mx-5">
                                    <ClipboardDocumentIcon className="h-10 w-10 -mt-3 text-black" />
                                </div>
                            </div>
                        </div>
                        <div className={`${isSuperAdmin ? "basis-1/3" : "basis-1/2"} bg-white border border-gray-300 h-[110px] rounded-lg shadow-md`}>
                            <div className="text-md font-semibold py-4 px-5">Total Defect Qty</div>
                            <div className="flex flex-row text-left mt-2">
                                <div className="basis-full text-2xl font-semibold py-0 px-5">
                                    {Numbering.format(filtered_total_qty)}
                                </div>
                                <div className="basis-auto mt-1 mx-5">
                                    <Container className="h-10 w-10 -mt-3 text-black" />
                                </div>
                            </div>
                        </div>
                        {isSuperAdmin && (
                            <div className="basis-1/3 bg-white border border-gray-300 h-[110px] rounded-lg shadow-md">
                                <div className="text-md font-semibold py-4 px-5">Total Amount</div>
                                <div className="flex flex-row text-left mt-2">
                                    <div className="basis-full text-2xl font-semibold py-0 px-5">
                                        {Rupiah.format(filtered_total_amount)}
                                    </div>
                                    <div className="basis-auto mt-1 mx-5">
                                        <Banknote className="h-10 w-10 -mt-3 text-black" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ToastContainer className="mt-[50px]" />

            {/* ── Filters row ── */}
            <div className="flex flex-row items-center content-center mb-3 gap-3">
                {isSuperAdmin && (
                    <div className="h-[45px] grow text-sm w-[200px]">
                        <select
                            value={Brand}
                            onChange={e => {
                                setBrand(e.target.value);
                                loadData(date, Filter_Tipe_user, Filter_Tipe_warehouse, e.target.value);
                            }}
                            className="appearance-none border h-[45px] w-full px-5 text-gray-700 focus:outline-none rounded-lg"
                        >
                            <option value="all">All Brand</option>
                            {data_brand.map((b: any, i: number) => (
                                <option key={i} value={b.id_area}>{b.brand}</option>
                            ))}
                        </select>
                    </div>
                )}

                {(user_role === "SUPER-ADMIN" || user_role === "HEAD-AREA") && (
                    <div className="h-[45px] grow text-sm w-[200px]">
                        <select
                            value={Filter_Tipe_user}
                            onChange={e => {
                                setFilter_Tipe_user(e.target.value);
                                loadData(date, e.target.value, Filter_Tipe_warehouse, Brand);
                            }}
                            className="appearance-none border h-[45px] w-full px-5 text-gray-700 focus:outline-none rounded-lg"
                        >
                            <option value="all">All Users</option>
                            {data_users.map((u: any, i: number) => (
                                <option key={i} value={u.users}>{u.users}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className=" border px-2 py-1.5 h-[45px] rounded-lg focus:outline-none"
                    >
                        <option value="all">Status Pengiriman</option>
                        <option value="BELUM DIKIRIM">Belum Dikirim</option>
                        <option value="SUDAH DIKIRIM">Sudah Dikirim</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={filterSupplier}
                        onChange={e => setFilterSupplier(e.target.value)}
                        className="border px-2 py-1.5 h-[45px] rounded-lg focus:outline-none"
                    >
                        <option value="all">All Supplier</option>
                        {allSuppliers.map((sup, i) => (
                            <option key={i} value={sup}>{sup}</option>
                        ))}
                    </select>
                    {/* ── Print dropdown ── */}
                    <div className="relative" data-print-menu="1">
                        <button
                            onClick={() => setShowPrintMenu(prev => !prev)}
                            disabled={printLoading}
                            className="h-[45px] px-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                        >
                            {printLoading ? "⏳ Memuat..." : "🖨 Print PDF ▾"}
                        </button>
                        {showPrintMenu && (
                            <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[210px]">
                                <button
                                    onClick={() => handlePrint(false)}
                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 border-b border-gray-100 rounded-t-lg"
                                >
                                    🖨 Tanpa Rincian Size
                                </button>
                                <button
                                    onClick={() => handlePrint(true)}
                                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 rounded-b-lg"
                                >
                                    📋 Dengan Rincian Size
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="shadow basis-1/4 rounded-lg ml-auto w-[250px] flex flex-row items-center justify-end bg-white">
                    {isSuperAdmin ? (
                        <Datepicker
                            displayFormat="DD-MM-YYYY"
                            primaryColor="blue"
                            value={value}
                            onChange={handleValueChange}
                            showShortcuts={true}
                            showFooter={true}
                            configs={{
                                shortcuts: {
                                    today, yesterday,
                                    mingguini: { text: "Minggu Ini", period: { start: mingguinistart, end: mingguiniend } },
                                    minggukemarin: { text: "Minggu Kemarin", period: { start: minggukemarinstart, end: minggukemarinend } },
                                    currentMonth, pastMonth,
                                    alltime: { text: "Semua", period: { start: "2023-01-01", end: todayDate } },
                                },
                                footer: { cancel: "Close", apply: "Apply" },
                            }}
                            placeholder="Pilih Tanggal"
                            inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
                        />
                    ) : (
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
                                    today, yesterday,
                                    mingguini: { text: "Minggu Ini", period: { start: mingguinistart, end: mingguiniend } },
                                    minggukemarin: { text: "Minggu Kemarin", period: { start: minggukemarinstart, end: minggukemarinend } },
                                    currentMonth, pastMonth,
                                },
                                footer: { cancel: "Close", apply: "Apply" },
                            }}
                            placeholder="Pilih Tanggal"
                            inputClassName="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
                        />
                    )}
                </div>
            </div>

            {/* ── Filter status + tanggal dikirim + Bulk action bar ── */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                {/* Filter Status */}


                {/* Filter Tgl Dikirim */}
                {/* <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-semibold whitespace-nowrap">Tgl Dikirim:</span>
                    <select
                        value={filterTglDikirim}
                        onChange={e => setFilterTglDikirim(e.target.value)}
                        className="text-xs border rounded px-2 py-1.5 focus:outline-none"
                    >
                        <option value="all">Semua</option>
                        {allTglDikirim.map((tgl) => {
                            const [y, m, d] = tgl.split("-");
                            return <option key={tgl} value={tgl}>{d}-{m}-{y}</option>;
                        })}
                    </select>
                </div> */}

                {/* Bulk action bar */}
                {checkedIds.size > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded px-3 py-1.5">
                        <span className="text-xs font-semibold text-red-700">{checkedIds.size} dipilih</span>
                        <button
                            disabled={bulkUpdating}
                            onClick={() => bulkChangeStatus("SUDAH DIKIRIM")}
                            className="text-xs bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600 disabled:opacity-50"
                        >✓ Kirim</button>
                        {/* <button
                            disabled={bulkUpdating}
                            onClick={() => bulkChangeStatus("BELUM DIKIRIM")}
                            className="text-xs bg-orange-400 text-white px-2 py-0.5 rounded hover:bg-orange-500 disabled:opacity-50"
                        >↩ Tandai Belum Dikirim</button> */}
                        <button
                            onClick={() => setCheckedIds(new Set())}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >✕</button>
                    </div>
                )}
            </div>

            {/* ── Table ── */}
            <table className="table bg-transparent h-px mb-4 text-sm w-full">
                <thead className="bg-[#323232] text-white">
                    <tr className="rounded-lg">
                        {isAdmin && (
                            <th className="py-3 px-2 rounded-l-lg w-[2%]">
                                <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 accent-white cursor-pointer"
                                    onChange={() => toggleCheckAll(getCheckableIds())}
                                    checked={
                                        getCheckableIds().length > 0 &&
                                        getCheckableIds().every(id => checkedIds.has(id))
                                    }
                                />
                            </th>
                        )}
                        {!isAdmin && <th className="py-3 px-2 rounded-l-lg w-[2%]"></th>}
                        <th className="py-3">No</th>
                        <th className="py-3">ID SPK Detail</th>
                        <th className="py-3">Produk</th>
                        <th className="py-3">Gudang</th>
                        <th className="py-3">Supplier</th>
                        <th className="py-3">Qty Reject</th>
                        {isSuperAdmin && <th className="py-3">Harga</th>}
                        {isSuperAdmin && <th className="py-3">Sub Total</th>}
                        <th className="py-3">Status</th>
                        {isAdmin && <th className="py-3 rounded-r-lg">Act</th>}
                        {!isAdmin && <th className="py-3 rounded-r-lg"></th>}
                    </tr>
                </thead>

                {isLoading ? (
                    <tbody>
                        <tr>
                            <td colSpan={isSuperAdmin ? 11 : 9} className="text-center py-10 text-gray-400 text-sm">
                                Memuat data...
                            </td>
                        </tr>
                    </tbody>
                ) : list_rows.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={isSuperAdmin ? 11 : 9} className="text-center py-10 text-gray-400 text-sm">
                                Tidak ada data Defect Reject
                            </td>
                        </tr>
                    </tbody>
                ) : list_rows}
            </table>

            {/* ── Delete modal — pilih size & qty ── */}
            {delModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[360px]">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                                    <p className="text-sm font-bold text-red-600">Hapus Reject</p>
                                    <button onClick={() => { setDelModal(false); setDelGroup(null); }}
                                        className="text-gray-400 hover:text-gray-700 text-xl font-light">×</button>
                                </div>

                                {/* Body */}
                                <div className="p-5">
                                    <p className="text-sm text-gray-700 mb-1">
                                        Yakin ingin menghapus semua data reject untuk:
                                    </p>
                                    {delGroup?.produk && (
                                        <p className="text-sm font-bold text-gray-900 mb-3">{delGroup.produk}</p>
                                    )}
                                    <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-3 py-2">
                                        Semua size dan qty akan dikembalikan ke stok utama.
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-end px-5 py-4 border-t border-slate-200 gap-3">
                                    <button
                                        className="text-gray-500 font-bold uppercase px-5 py-2 text-xs outline-none focus:outline-none hover:text-gray-700"
                                        onClick={() => { setDelModal(false); setDelGroup(null); }}
                                        disabled={delLoading}
                                    >Batal</button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-xs px-5 py-2.5 rounded shadow outline-none focus:outline-none disabled:opacity-40"
                                        disabled={delLoading}
                                        onClick={deleteItem}
                                    >{delLoading ? "Menghapus…" : "Hapus Semua"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}

            {/* ── Modal Edit Harga ──────────────────────────────────────── */}
            {editHargaModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[380px]">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-semibold">Edit Defect Write-offs</span>
                                        {editHargaGroup && (
                                            <span className="text-xs text-gray-500">
                                                {editHargaGroup.id_produk}
                                                {editHargaGroup.produk ? ` | ${editHargaGroup.produk}` : ""}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => { setEditHargaModal(false); setEditHargaGroup(null); setEditHargaValue(""); }}
                                        className="text-gray-400 hover:text-gray-700 text-xl font-light ml-4"
                                    >×</button>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    {/* Input Harga */}
                                    <label className="block text-xs text-gray-500 mb-2">Harga per pcs (Rp)</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={editHargaValue}
                                        onChange={e => {
                                            const raw = e.target.value.replace(/[^\d]/g, "");
                                            setEditHargaValue(raw ? Rupiah.format(Number(raw)) : "");
                                        }}
                                        onKeyDown={e => { if (e.key === "Enter") handleSaveHarga(); }}
                                        placeholder="Rp 0"
                                        className="w-full border rounded px-3 py-2 text-right text-sm font-semibold"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Subtotal akan dihitung otomatis: qty × harga</p>

                                    {/* Tabel edit qty per size */}
                                    <div className="mt-4 border-t pt-3">
                                        <p className="text-xs font-semibold text-gray-600 mb-2">Edit Qty per Size</p>
                                        {editHargaSizeLoading ? (
                                            <p className="text-xs text-gray-400 text-center py-3">Memuat rincian size…</p>
                                        ) : editHargaSizes.length === 0 ? (
                                            <p className="text-xs text-gray-400 text-center py-3">Tidak ada data size</p>
                                        ) : (
                                            <div className="max-h-52 overflow-y-auto pr-1">
                                                <table className="w-full text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100 text-gray-600">
                                                            <th className="px-3 py-1.5 text-left font-semibold">Size</th>
                                                            <th className="px-3 py-1.5 text-center font-semibold">Stok Tersedia</th>
                                                            <th className="px-3 py-1.5 text-center font-semibold">Qty Dikembalikan</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {editHargaSizes.map((s, i) => {
                                                            const returnQty = s.qty_reject - s.newQty;
                                                            return (
                                                                <tr key={s.size} className={`border-b border-gray-100 ${returnQty > 0 ? "bg-orange-50" : ""}`}>
                                                                    <td className="px-3 py-2 font-bold text-gray-700">{s.size}</td>
                                                                    <td className="px-3 py-2 text-center text-gray-500">tersedia: {s.qty_reject}</td>
                                                                    <td className="px-3 py-2 text-center">
                                                                        <input
                                                                            type="number"
                                                                            min={0}
                                                                            max={s.qty_reject}
                                                                            value={returnQty}
                                                                            onChange={e => {
                                                                                const rv = Math.min(Math.max(0, Number(e.target.value)), s.qty_reject);
                                                                                setEditHargaSizes(prev => prev.map((x, xi) =>
                                                                                    xi === i ? { ...x, newQty: x.qty_reject - rv } : x
                                                                                ));
                                                                            }}
                                                                            className="w-16 border rounded px-2 py-1 text-xs text-center font-semibold"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                {editHargaSizes.some(s => s.newQty < s.qty_reject) && (
                                                    <div className="mt-2 p-2 bg-orange-50 rounded text-xs text-orange-700 border border-orange-200">
                                                        <span className="font-semibold">Dikembalikan ke stok: </span>
                                                        {editHargaSizes
                                                            .filter(s => s.newQty < s.qty_reject)
                                                            .map(s => `${s.size} (${s.qty_reject - s.newQty})`)
                                                            .join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end p-4 border-t border-solid border-slate-200 rounded-b gap-3">
                                    <button
                                        className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none"
                                        type="button"
                                        onClick={() => { setEditHargaModal(false); setEditHargaGroup(null); setEditHargaValue(""); }}
                                    >Cancel</button>
                                    <button
                                        className="bg-blue-600 text-white font-bold text-sm px-6 py-2 rounded shadow hover:bg-blue-700 outline-none focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                        type="button"
                                        disabled={!editHargaValue || Number(editHargaValue.replace(/\./g, "").replace(/[^\d]/g, "")) <= 0}
                                        onClick={handleSaveHarga}
                                    >Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}

        </div>
    );
}
