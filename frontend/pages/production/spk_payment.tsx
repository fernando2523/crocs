import Head from "next/head";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

axios.defaults.withCredentials = true;

// ── Helpers Rupiah ────────────────────────────────────────────────
function formatRupiah(val: number | ""): string {
    if (val === "" || val === 0) return "";
    return Number(val).toLocaleString("id-ID");
}
function parseRupiah(str: string): number | "" {
    const cleaned = str.replace(/\./g, "").replace(/[^\d]/g, "");
    return cleaned === "" ? "" : Number(cleaned);
}
function rp(val: number) {
    return `Rp ${Number(val || 0).toLocaleString("id-ID")}`;
}

export default function SpkPayment() {
    const role = Cookies.get("auth_role");
    const area = Cookies.get("auth_store");

    const [isLoading, setIsLoading] = useState(true);
    const [dataSupplier, setDataSupplier] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [toastReady, setToastReady] = useState(false);

    // ── Detail modal ───────────────────────────────────────────────
    const [showDetail, setShowDetail] = useState(false);
    const [detailSup, setDetailSup] = useState<any>(null);       // row from main list
    const [detailData, setDetailData] = useState<any>(null);     // from get_supplier_payment_detail
    const [detailLoading, setDetailLoading] = useState(false);

    // ── Payment form ──────────────────────────────────────────────
    const [showPayForm, setShowPayForm] = useState(false);
    const [newPayAmount, setNewPayAmount] = useState<number | "">("");
    const [newPayTanggal, setNewPayTanggal] = useState(format(new Date(), "yyyy-MM-dd"));
    const [newPayKet, setNewPayKet] = useState("");
    const [newPaySpk, setNewPaySpk] = useState<string>("");

    // ── Size expand ────────────────────────────────────────────────
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [expandedSizeData, setExpandedSizeData] = useState<any[]>([]);
    const [sizeLoadingKey, setSizeLoadingKey] = useState<string | null>(null);

    useEffect(() => { setToastReady(true); }, []);
    useEffect(() => { loadSupplierList(); }, []);

    // ── Load main list ────────────────────────────────────────────
    async function loadSupplierList() {
        setIsLoading(true);
        try {
            const res = await axios.post("https://api.gudangsandal.com/v1/get_supplier_payment_list", {
                id_ware: "all",
            });
            setDataSupplier(res.data?.result?.data || []);
        } catch {
            toast.error("Gagal memuat data supplier");
        } finally {
            setIsLoading(false);
        }
    }

    // ── Open detail modal ─────────────────────────────────────────
    async function openDetail(row: any) {
        setDetailSup(row);
        setDetailData(null);
        setShowDetail(true);
        setShowPayForm(false);
        setExpandedKey(null);
        setExpandedSizeData([]);
        setDetailLoading(true);
        try {
            const res = await axios.post("https://api.gudangsandal.com/v1/get_supplier_payment_detail", {
                id_sup: row.id_sup,
            });
            setDetailData(res.data?.result?.data || null);
        } catch {
            toast.error("Gagal memuat detail supplier");
        } finally {
            setDetailLoading(false);
        }
    }

    // ── Add payment ────────────────────────────────────────────────
    async function handleAddPayment() {
        if (!newPayAmount || Number(newPayAmount) <= 0) {
            toast.warn("Jumlah pembayaran harus diisi");
            return;
        }
        try {
            const res = await axios.post("https://api.gudangsandal.com/v1/add_spk_payment", {
                id_spk: null,
                id_sup: detailSup?.id_sup,
                jumlah_bayar: Number(newPayAmount),
                tanggal_bayar: newPayTanggal || null,
                keterangan: newPayKet,
                users: Cookies.get("auth_username") || "Owner",
            });
            if (res.data?.result?.success) {
                toast.success("Pembayaran berhasil ditambahkan");
                setNewPayAmount("");
                setNewPayKet("");
                setNewPaySpk("");
                setShowPayForm(false);
                await openDetail(detailSup);
                await loadSupplierList();
            } else {
                toast.error(res.data?.result?.message || "Gagal menambahkan pembayaran");
            }
        } catch {
            toast.error("Error menambahkan pembayaran");
        }
    }

    // ── Delete payment ─────────────────────────────────────────────
    async function handleDeletePayment(id_payment: string) {
        if (!confirm("Hapus pembayaran ini?")) return;
        try {
            const res = await axios.post("https://api.gudangsandal.com/v1/delete_spk_payment", { id_payment });
            if (res.data?.result?.success) {
                toast.success("Pembayaran dihapus");
                await openDetail(detailSup);
                await loadSupplierList();
            } else {
                toast.error("Gagal menghapus pembayaran");
            }
        } catch {
            toast.error("Error menghapus pembayaran");
        }
    }

    // ── Toggle size expand ─────────────────────────────────────────
    async function toggleSizeExpand(prod: any) {
        const key = `${prod.id_spk}_${prod.id_produk}_${prod.id_ware}`;
        if (expandedKey === key) {
            setExpandedKey(null);
            setExpandedSizeData([]);
            return;
        }
        setSizeLoadingKey(key);
        try {
            const res = await axios.post("https://api.gudangsandal.com/v1/get_size_restock_by_spk", {
                id_spk: prod.id_spk,
                id_produk: prod.id_produk,
                id_ware: prod.id_ware,
                id_sup: prod.id_sup,
            });
            setExpandedSizeData(res.data?.result || []);
            setExpandedKey(key);
        } catch {
            toast.error("Gagal memuat rincian size");
        } finally {
            setSizeLoadingKey(null);
        }
    }

    // ── Filter ────────────────────────────────────────────────────
    const filtered = dataSupplier.filter(r =>
        r.supplier?.toLowerCase().includes(search.toLowerCase()) ||
        r.warehouse?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Grand totals ──────────────────────────────────────────────
    const grandBruto = filtered.reduce((s, r) => s + Number(r.total_bruto || 0), 0);
    const grandReject = filtered.reduce((s, r) => s + Number(r.total_reject || 0), 0);
    const grandNet = filtered.reduce((s, r) => s + Number(r.net_bayar || 0), 0);
    const grandSudah = filtered.reduce((s, r) => s + Number(r.sudah_bayar || 0), 0);
    const grandSisa = filtered.reduce((s, r) => s + Number(r.sisa_bayar || 0), 0);

    // ── format tanggal DD-MM-YYYY ──────────────────────────────────
    function fmtTgl(val: any): string {
        if (!val) return "–";
        try { return format(new Date(val), "dd-MM-yyyy"); } catch { return String(val).slice(0, 10); }
    }

    // ── Print PDF detail supplier ─────────────────────────────────
    function handlePrintDetail() {
        if (!detailData || !detailSup) return;

        const products = detailData.products || [];
        const payments = detailData.payments || [];
        const rejects = detailData.rejects || [];

        // shared colgroup — 6 kolom: 90 | 100 | auto | 65 | 105 | 120
        const colgroup = `<colgroup>
            <col style="width:90px"><col style="width:100px"><col>
            <col style="width:65px"><col style="width:105px"><col style="width:120px">
        </colgroup>`;

        // ── Detail Produk rows
        const totalQtyProd = products.reduce((s: number, p: any) => s + Number(p.qty || 0), 0);
        const prodRows = products.map((prod: any, i: number) => `
            <tr style="background:${i % 2 === 0 ? "#fff" : "#f9fafb"}">
                <td style="text-align:center;color:#9ca3af;">${fmtTgl(prod.last_restock_date)}</td>
                <td style="text-align:center;font-family:monospace;color:#4338ca;font-weight:700;">${prod.id_spk_detail || "–"}</td>
                <td>${prod.produk}</td>
                <td style="text-align:center;">${Number(prod.qty || 0).toLocaleString("id-ID")}</td>
                <td style="text-align:right;color:#2563eb;">${rp(prod.harga)}</td>
                <td style="text-align:right;">${rp(prod.subtotal)}</td>
            </tr>`).join("");
        const prodFooter = `
            <tr style="background:#e5e7eb;font-weight:700;">
                <td colspan="3" style="padding:5px 8px;">TOTAL</td>
                <td style="text-align:center;">${totalQtyProd.toLocaleString("id-ID")}</td>
                <td></td>
                <td style="text-align:right;">${rp(detailData.grandSubtotal)}</td>
            </tr>`;

        // ── Rincian Reject rows
        const totalQtyRej = rejects.reduce((s: number, r: any) => s + Number(r.total_qty || 0), 0);
        const rejectSection = rejects.length > 0 ? `
            <h3 style="color:#c2410c;">⚠ Rincian Reject</h3>
            <table style="table-layout:fixed;">
                ${colgroup}
                <thead><tr>
                    <th>Tgl Reject</th><th>ID SPK Detail</th><th>Produk</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;color:#93c5fd;">Harga</th>
                    <th style="text-align:right;color:#fb923c;">Nominal</th>
                </tr></thead>
                <tbody>
                    ${rejects.map((r: any, i: number) => `
                        <tr style="background:${i % 2 === 0 ? "#fff7ed" : "#fff"}">
                            <td style="text-align:center;color:#9ca3af;">${fmtTgl(r.tanggal_dikirim)}</td>
                            <td style="text-align:center;font-family:monospace;color:#4338ca;font-weight:700;">${r.id_spk_detail || "–"}</td>
                            <td>${r.produk_name || r.id_produk}</td>
                            <td style="text-align:center;">${r.total_qty}</td>
                            <td style="text-align:right;color:#2563eb;">${rp(r.harga)}</td>
                            <td style="text-align:right;color:#ea580c;font-weight:700;">${rp(r.total_nominal)}</td>
                        </tr>`).join("")}
                </tbody>
                <tfoot>
                    <tr style="background:#fef3c7;font-weight:700;">
                        <td colspan="3">TOTAL</td>
                        <td style="text-align:center;">${totalQtyRej}</td>
                        <td></td>
                        <td style="text-align:right;color:#ea580c;">${rp(detailData.grandRejectNominal)}</td>
                    </tr>
                </tfoot>
            </table>` : "";

        // ── History Pembayaran — hanya payments (reject sudah ada di Rincian Reject)
        const payOnlyRows = payments
            .slice()
            .sort((a: any, b: any) => (b.tanggal_bayar ? new Date(b.tanggal_bayar).getTime() : 0) - (a.tanggal_bayar ? new Date(a.tanggal_bayar).getTime() : 0))
            .map((p: any, i: number) => `
                <tr style="background:${i % 2 === 0 ? "#fff" : "#f9fafb"}">
                    <td style="text-align:center;color:#6b7280;">${p.tanggal_bayar ? fmtTgl(p.tanggal_bayar) : "–"}</td>
                    <td style="text-align:center;color:#9ca3af;">${p.users || "–"}</td>
                    <td>${p.keterangan || "–"}</td>
                    <td></td>
                    <td></td>
                    <td style="text-align:right;font-weight:700;color:#16a34a;">${rp(p.jumlah_bayar)}</td>
                </tr>`).join("");
        const totalNominalPay = payments.reduce((s: number, p: any) => s + Number(p.jumlah_bayar || 0), 0);
        const payBody = payOnlyRows || `<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:8px;">Belum ada pembayaran</td></tr>`;

        const sisaColor = detailData.grandSisa > 0 ? "#dc2626" : "#16a34a";
        const printWin = window.open("", "_blank", "width=1100,height=850");
        if (!printWin) return;
        printWin.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
            <title>Payment — ${detailSup.supplier}</title>
            <style>
                body{font-family:Arial,sans-serif;font-size:11px;margin:16px;color:#111;}
                h2{margin:0 0 2px;font-size:16px;}
                .sub{color:#9ca3af;font-size:11px;margin:0 0 16px;}
                .cards{display:flex;gap:10px;margin-bottom:18px;}
                .card{flex:1;border:1px solid #e5e7eb;border-radius:6px;padding:8px 12px;}
                .card-label{font-size:10px;color:#6b7280;margin-bottom:2px;}
                .card-val{font-size:15px;font-weight:700;}
                .card-sub{font-size:9px;color:#9ca3af;}
                h3{font-size:12px;margin:0 0 6px;color:#374151;}
                table{width:100%;border-collapse:collapse;margin-bottom:18px;table-layout:fixed;}
                th,td{border:1px solid #d1d5db;padding:4px 6px;vertical-align:middle;font-size:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                thead th{background:#1f2937;color:#fff;font-size:11px;}
                tfoot td{background:#e5e7eb;font-weight:700;}
                @media print{@page{size:A4 landscape;margin:10mm;} button{display:none;}}
            </style>
        </head><body>
            <h2> Payment — ${detailSup.supplier}</h2>
            <p class="sub">Supplier: ${detailSup.supplier} &nbsp;|&nbsp; Dicetak: ${format(new Date(), "dd/MM/yyyy HH:mm")}</p>

            <div class="cards">
                <div class="card"><div class="card-label">Total Bruto</div><div class="card-val">${rp(detailData.grandBruto)}</div><div class="card-sub">qty × harga</div></div>
                <div class="card" style="border-color:#fed7aa;background:#fff7ed;"><div class="card-label">Potongan Reject</div><div class="card-val" style="color:#ea580c;">${rp(detailData.grandRejectNominal)}</div><div class="card-sub">dari tb_spk_reject</div></div>
                <div class="card" style="border-color:#bfdbfe;background:#eff6ff;"><div class="card-label">Total Harus Bayar</div><div class="card-val" style="color:#1d4ed8;">${rp(detailData.grandBayar)}</div><div class="card-sub">bruto − reject</div></div>
                <div class="card" style="border-color:#bbf7d0;background:#f0fdf4;"><div class="card-label">Sudah Dibayar</div><div class="card-val" style="color:#16a34a;">${rp(detailData.totalSudahBayar)}</div><div class="card-sub">semua pembayaran</div></div>
                <div class="card" style="border-color:#fecaca;background:#fef2f2;"><div class="card-label">Sisa Bayar</div><div class="card-val" style="color:${sisaColor};">${rp(detailData.grandSisa)}</div><div class="card-sub">${detailData.grandSisa > 0 ? "belum lunas" : "lunas"}</div></div>
            </div>

            <h3>Detail Produk</h3>
            <table style="table-layout:fixed;">
                ${colgroup}
                <thead><tr>
                    <th>Tgl Restock</th><th>ID SPK Detail</th><th>Produk</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;color:#93c5fd;">Harga</th>
                    <th style="text-align:right;">Subtotal</th>
                </tr></thead>
                <tbody>${prodRows}</tbody>
                <tfoot>${prodFooter}</tfoot>
            </table>

            ${rejectSection}

            <h3>History Pembayaran</h3>
            <table style="table-layout:fixed;">
                ${colgroup}
                <thead><tr>
                    <th>Tanggal</th><th>By</th><th>Keterangan</th>
                    <th></th><th></th>
                    <th style="text-align:right;">Nominal</th>
                </tr></thead>
                <tbody>${payBody}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="5">TOTAL</td>
                        <td style="text-align:right;color:#16a34a;">${rp(totalNominalPay)}</td>
                    </tr>
                </tfoot>
            </table>
        </body></html>`);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); }, 400);
    }

    // ─────────────────────────────────────────────────────────────
    return (
        <>
            <Head><title>Payment Production</title></Head>
            {toastReady && <ToastContainer position="top-right" autoClose={3000} />}

            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <i className="fi fi-rr-credit-card text-xl leading-none"></i> Payment Production
                    </h1>
                    <button
                        onClick={loadSupplierList}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari supplier / warehouse..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded px-3 py-1.5 text-sm w-64"
                    />
                </div>

                {/* Summary cards */}
                {!isLoading && filtered.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                        {[
                            { label: "Total Bruto", val: grandBruto, color: "text-gray-800", bg: "bg-white", border: "border-gray-200", sub: `${filtered.length} supplier` },
                            { label: "Total Reject", val: grandReject, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", sub: "sudah dikirim" },
                            { label: "Total Harus Bayar", val: grandNet, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", sub: "bruto − reject" },
                            { label: "Sudah Dibayar", val: grandSudah, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", sub: "semua supplier" },
                            { label: "Sisa Bayar", val: grandSisa, color: grandSisa > 0 ? "text-red-600" : "text-green-600", bg: grandSisa > 0 ? "bg-red-50" : "bg-green-50", border: grandSisa > 0 ? "border-red-200" : "border-green-200", sub: grandSisa > 0 ? "belum lunas" : "lunas" },
                        ].map(card => (
                            <div key={card.label} className={`rounded-xl border ${card.border} ${card.bg} px-4 py-3 shadow-sm`}>
                                <p className="text-xs text-gray-400 mb-1 font-medium">{card.label}</p>
                                <p className={`text-base font-bold ${card.color} leading-tight`}>{rp(card.val)}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main table */}
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Memuat data...</div>
                ) : (
                    <div className="overflow-x-auto rounded border">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3 border text-center">No</th>
                                    <th className="p-3 border text-left">Supplier</th>
                                    <th className="p-3 border text-left">Warehouse</th>
                                    <th className="p-3 border text-right">Total SPK</th>
                                    <th className="p-3 border text-right">Total Qty</th>
                                    <th className="p-3 border text-right">Total Bruto</th>
                                    <th className="p-3 border text-right text-orange-600">Reject</th>
                                    <th className="p-3 border text-right text-blue-600">Net Bayar</th>
                                    <th className="p-3 border text-right text-green-600">Sudah Bayar</th>
                                    <th className="p-3 border text-right text-red-600">Sisa Bayar</th>
                                    <th className="p-3 border text-center w-[100px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="p-6 text-center text-gray-400">
                                            Tidak ada data supplier
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row: any, idx: number) => {
                                        const sisaColor = Number(row.sisa_bayar) > 0
                                            ? "text-red-600 font-bold"
                                            : "text-green-600 font-bold";
                                        return (
                                            <tr key={row.id_sup} className="hover:bg-gray-50 border-b">
                                                <td className="p-3 border text-center">{idx + 1}</td>
                                                <td className="p-3 border font-semibold">{row.supplier}</td>
                                                <td className="p-3 border text-gray-600">{row.warehouse || "–"}</td>
                                                <td className="p-3 border text-right">{row.total_spk}</td>
                                                <td className="p-3 border text-right font-semibold">
                                                    {Number(row.total_qty || 0).toLocaleString("id-ID")}
                                                </td>
                                                <td className="p-3 border text-right">
                                                    {rp(row.total_bruto)}
                                                </td>
                                                <td className="p-3 border text-right text-orange-600">
                                                    {row.total_reject > 0 ? rp(row.total_reject) : "–"}
                                                </td>
                                                <td className="p-3 border text-right text-blue-600 font-semibold">
                                                    {rp(row.net_bayar)}
                                                </td>
                                                <td className="p-3 border text-right text-green-600">
                                                    {rp(row.sudah_bayar)}
                                                </td>
                                                <td className={`p-3 border text-right ${sisaColor}`}>
                                                    {rp(row.sisa_bayar)}
                                                </td>
                                                <td className="p-3 border text-center">
                                                    <button
                                                        onClick={() => openDetail(row)}
                                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1.5"
                                                    >
                                                        <i className="fi fi-rr-document leading-none"></i> Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                            {filtered.length > 0 && (
                                <tfoot className="bg-gray-200 font-bold text-sm">
                                    <tr>
                                        <td colSpan={5} className="p-3 border">TOTAL ({filtered.length} Supplier)</td>
                                        <td className="p-3 border text-right">{rp(grandBruto)}</td>
                                        <td className="p-3 border text-right text-orange-600">
                                            {grandReject > 0 ? rp(grandReject) : "–"}
                                        </td>
                                        <td className="p-3 border text-right text-blue-600">{rp(grandNet)}</td>
                                        <td className="p-3 border text-right text-green-600">{rp(grandSudah)}</td>
                                        <td className="p-3 border text-right text-red-600">{rp(grandSisa)}</td>
                                        <td className="p-3 border" />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL (full-screen) ─────────────────────────────── */}
            {showDetail && typeof window !== "undefined" && createPortal(
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-0">
                    <div className="bg-white w-full h-full overflow-y-auto flex flex-col">
                        {/* Sticky header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <i className="fi fi-rr-credit-card leading-none text-gray-700"></i> Payment — {detailSup?.supplier}
                                </h2>
                                <p className="text-xs text-gray-400">Supplier: {detailSup?.supplier}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!detailLoading && detailData && (
                                    <button
                                        onClick={handlePrintDetail}
                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                                    >
                                        <i className="fi fi-rr-print leading-none"></i> Print PDF
                                    </button>
                                )}
                                <button
                                    onClick={() => { setShowDetail(false); setDetailData(null); setShowPayForm(false); }}
                                    className="text-gray-400 hover:text-gray-700 text-2xl font-light"
                                >×</button>
                            </div>
                        </div>

                        <div className="flex-1 p-6">
                            {detailLoading ? (
                                <div className="text-center py-20 text-gray-400">Memuat data...</div>
                            ) : !detailData ? (
                                <div className="text-center py-20 text-gray-400">Tidak ada data</div>
                            ) : (
                                <>
                                    {/* Grand summary cards — 5 kartu */}
                                    <div className="grid grid-cols-5 gap-3 mb-6">
                                        {[
                                            { label: "Total Bruto", val: detailData.grandBruto, color: "text-gray-800", bg: "bg-gray-50", sub: "qty × harga" },
                                            { label: "Potongan Reject", val: detailData.grandRejectNominal, color: "text-orange-600", bg: "bg-orange-50", sub: "dari tb_spk_reject" },
                                            { label: "Total Harus Bayar", val: detailData.grandBayar, color: "text-blue-600", bg: "bg-blue-50", sub: "bruto − reject" },
                                            { label: "Sudah Dibayar", val: detailData.totalSudahBayar, color: "text-green-600", bg: "bg-green-50", sub: "semua pembayaran" },
                                            { label: "Sisa Bayar", val: detailData.grandSisa, color: detailData.grandSisa > 0 ? "text-red-600" : "text-green-600", bg: detailData.grandSisa > 0 ? "bg-red-50" : "bg-green-50", sub: detailData.grandSisa > 0 ? "belum lunas" : "lunas" },
                                        ].map(item => (
                                            <div key={item.label} className={`${item.bg} rounded-lg p-3 border`}>
                                                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                                <p className={`text-lg font-bold ${item.color}`}>{rp(item.val)}</p>
                                                <p className="text-[10px] text-gray-400">{(item as any).sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── Flat product table ── */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Detail Produk</h3>
                                        <div className="overflow-x-auto border rounded-xl">
                                            <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
                                                <colgroup>
                                                    <col style={{ width: "150px" }} />
                                                    <col style={{ width: "200px" }} />
                                                    <col />
                                                    <col style={{ width: "100px" }} />
                                                    <col style={{ width: "300px" }} />
                                                    <col style={{ width: "300px" }} />
                                                </colgroup>
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="p-2 border text-center text-gray-500 text-xs">Tgl Restock</th>
                                                        <th className="p-2 border text-center text-indigo-600">ID SPK Detail</th>
                                                        <th className="p-2 border text-left">Produk</th>
                                                        <th className="p-2 border text-center">Qty</th>
                                                        <th className="p-2 border text-right text-blue-600">Harga</th>
                                                        <th className="p-2 border text-right">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(detailData.products || []).map((prod: any) => {
                                                        const key = `${prod.id_spk}_${prod.id_produk}_${prod.id_ware}`;
                                                        const isExp = expandedKey === key;
                                                        const isLoadSz = sizeLoadingKey === key;
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr className="border-b hover:bg-gray-50">
                                                                    <td className="p-2 border text-center text-xs text-gray-400">
                                                                        {fmtTgl(prod.last_restock_date)}
                                                                    </td>
                                                                    <td className="p-2 border text-center text-indigo-600 font-mono text-xs font-bold">
                                                                        {prod.id_spk_detail || "–"}
                                                                    </td>
                                                                    <td className="p-2 border">
                                                                        <button
                                                                            onClick={() => toggleSizeExpand(prod)}
                                                                            className="text-left font-medium text-blue-700 hover:underline flex items-center gap-1"
                                                                        >
                                                                            {isLoadSz ? <span className="text-gray-400 text-xs">⏳</span>
                                                                                : <span className="text-xs text-gray-400">{isExp ? "▲" : "▼"}</span>}
                                                                            {prod.produk}
                                                                        </button>
                                                                    </td>
                                                                    <td className="p-2 border text-center">{prod.qty}</td>
                                                                    <td className="p-2 border text-right text-blue-600">
                                                                        {rp(prod.harga)}
                                                                    </td>
                                                                    <td className="p-2 border text-right">
                                                                        {rp(prod.subtotal)}
                                                                    </td>
                                                                    {/* <td className="p-2 border text-right text-orange-600">
                                                                        {Number(prod.rejectNominal) > 0 ? rp(prod.rejectNominal) : "–"}
                                                                    </td>
                                                                    <td className="p-2 border text-right text-green-600 font-semibold">
                                                                        {rp(prod.netSubtotal)}
                                                                    </td> */}
                                                                </tr>
                                                                {/* Size expand */}
                                                                {isExp && (
                                                                    <tr>
                                                                        <td colSpan={6} className="bg-indigo-50 border px-6 py-3">
                                                                            <p className="text-xs font-semibold text-indigo-700 mb-2">
                                                                                Rincian Size — {prod.produk}
                                                                            </p>
                                                                            {expandedSizeData.length > 0 ? (
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {expandedSizeData.map((s: any, si: number) => (
                                                                                        <span key={si} className={`px-3 py-1 rounded-full text-xs font-bold border ${Number(s.qty) > 0 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-400 border-gray-300"}`}>
                                                                                            {s.size} = {s.qty}
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
                                                </tbody>
                                                {/* Grand footer flat table */}
                                                {(detailData.products || []).length > 0 && (
                                                    <tfoot className="bg-gray-200 font-bold text-sm">
                                                        <tr>
                                                            <td colSpan={3} className="p-2 border">TOTAL</td>
                                                            <td className="p-2 border text-center">
                                                                {(detailData.products || []).reduce((s: number, p: any) => s + Number(p.qty || 0), 0).toLocaleString("id-ID")}
                                                            </td>
                                                            <td className="p-2 border" />
                                                            <td className="p-2 border text-right">{rp(detailData.grandSubtotal)}</td>
                                                            {/* <td className="p-2 border text-right text-orange-600">
                                                                {detailData.grandRejectNominal > 0 ? rp(detailData.grandRejectNominal) : "–"}
                                                            </td>
                                                            <td className="p-2 border text-right text-green-600">{rp(detailData.grandBayar)}</td> */}
                                                        </tr>
                                                    </tfoot>
                                                )}
                                            </table>
                                        </div>
                                    </div>

                                    {/* ── Rincian Reject ── */}
                                    {(detailData.rejects || []).length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-semibold text-orange-700 mb-2">⚠ Rincian Reject</h3>
                                            <div className="overflow-x-auto border border-orange-200 rounded-xl">
                                                <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
                                                    <colgroup>
                                                        <col style={{ width: "150px" }} />
                                                        <col style={{ width: "200px" }} />
                                                        <col />
                                                        <col style={{ width: "100px" }} />
                                                        <col style={{ width: "300px" }} />
                                                        <col style={{ width: "300px" }} />
                                                    </colgroup>
                                                    <thead className="bg-orange-50 text-gray-700">
                                                        <tr>
                                                            <th className="p-2 border text-center text-gray-500 text-xs">Tgl Reject</th>
                                                            <th className="p-2 border text-center text-indigo-600">ID SPK Detail</th>
                                                            <th className="p-2 border text-left">Produk</th>
                                                            <th className="p-2 border text-center">Qty</th>
                                                            <th className="p-2 border text-right text-blue-600">Harga</th>
                                                            <th className="p-2 border text-right text-orange-600">Nominal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(detailData.rejects || []).map((r: any, idx: number) => (
                                                            <tr key={idx} className="border-b hover:bg-orange-50">
                                                                <td className="p-2 border text-center text-xs text-gray-400">{fmtTgl(r.tanggal_dikirim)}</td>
                                                                <td className="p-2 border text-center text-indigo-600 font-mono text-xs font-bold">{r.id_spk_detail || "–"}</td>
                                                                <td className="p-2 border font-medium text-gray-800">{r.produk_name || r.id_produk}</td>
                                                                <td className="p-2 border text-center">{r.total_qty}</td>
                                                                <td className="p-2 border text-right text-blue-600">{rp(r.harga)}</td>
                                                                <td className="p-2 border text-right text-orange-600 font-semibold">{rp(r.total_nominal)}</td>
                                                                {/* <td className="p-2 border text-xs text-gray-500">{r.keterangan || "–"}</td> */}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="bg-orange-100 font-bold text-sm">
                                                        <tr>
                                                            <td colSpan={3} className="p-2 border">TOTAL</td>
                                                            <td className="p-2 border text-center">
                                                                {(detailData.rejects || []).reduce((s: number, r: any) => s + Number(r.total_qty || 0), 0)}
                                                            </td>
                                                            <td className="p-2 border" />
                                                            <td className="p-2 border text-right text-orange-600">{rp(detailData.grandRejectNominal)}</td>
                                                            {/* <td className="p-2 border" /> */}
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* History pembayaran */}
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">History Pembayaran</p>
                                        {(() => {
                                            // Hanya payment rows (reject sudah tampil di Rincian Reject)
                                            const payRows = (detailData.payments || []).map((p: any) => ({
                                                tanggal: p.tanggal_bayar,
                                                keterangan: p.keterangan || "–",
                                                nominal: p.jumlah_bayar,
                                                by: p.users || "–",
                                                id_payment: p.id_payment as string | null,
                                            })).sort((a: any, b: any) => {
                                                const da = a.tanggal ? new Date(a.tanggal).getTime() : 0;
                                                const db = b.tanggal ? new Date(b.tanggal).getTime() : 0;
                                                return db - da;
                                            });
                                            if (payRows.length === 0) return <p className="text-xs text-gray-400 mb-3">Belum ada pembayaran</p>;
                                            const totalNominal = payRows.reduce((s: number, r: any) => s + Number(r.nominal || 0), 0);
                                            return (
                                                <table className="w-full text-sm border mb-3 rounded overflow-hidden" style={{ tableLayout: "fixed" }}>
                                                    <colgroup>
                                                        <col style={{ width: "150px" }} />
                                                        <col style={{ width: "200px" }} />
                                                        <col />
                                                        <col style={{ width: "100px" }} />
                                                        <col style={{ width: "300px" }} />
                                                        <col style={{ width: "300px" }} />
                                                    </colgroup>
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="p-2 border text-center">Tanggal</th>
                                                            <th className="p-2 border text-center">By</th>
                                                            <th className="p-2 border text-left">Keterangan</th>
                                                            <th className="p-2 border text-center">Hapus</th>
                                                            <th className="p-2 border"></th>
                                                            <th className="p-2 border text-right">Nominal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {payRows.map((row: any, idx: number) => (
                                                            <tr key={idx} className="border-b hover:bg-gray-50">
                                                                <td className="p-2 border text-center text-gray-500 text-xs">
                                                                    {row.tanggal ? fmtTgl(row.tanggal) : "–"}
                                                                </td>
                                                                <td className="p-2 border text-center text-xs text-gray-400">{row.by}</td>
                                                                <td className="p-2 border text-gray-700 text-xs">{row.keterangan}</td>
                                                                <td className="p-2 border text-center">
                                                                    <button
                                                                        onClick={() => handleDeletePayment(row.id_payment)}
                                                                        className="text-red-400 hover:text-red-600 text-lg leading-none"
                                                                    >🗑</button>
                                                                </td>
                                                                <td className="p-2 border"></td>
                                                                <td className="p-2 border text-right font-semibold text-green-600">
                                                                    {rp(row.nominal)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="bg-gray-200 font-bold text-sm">
                                                        <tr>
                                                            <td colSpan={5} className="p-2 border">TOTAL</td>
                                                            <td className="p-2 border text-right text-green-700">{rp(totalNominal)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            );
                                        })()}
                                    </div>

                                    {/* Form tambah pembayaran */}
                                    {showPayForm ? (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap gap-3 items-end">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
                                                <input
                                                    type="date"
                                                    value={newPayTanggal}
                                                    onChange={e => setNewPayTanggal(e.target.value)}
                                                    className="border rounded px-2 py-1.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Jumlah (Rp)</label>
                                                <input
                                                    type="text"
                                                    value={formatRupiah(newPayAmount)}
                                                    onChange={e => setNewPayAmount(parseRupiah(e.target.value))}
                                                    placeholder="0"
                                                    className="border rounded px-2 py-1.5 text-sm w-44 text-right"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-40">
                                                <label className="block text-xs text-gray-500 mb-1">Keterangan</label>
                                                <input
                                                    type="text"
                                                    value={newPayKet}
                                                    onChange={e => setNewPayKet(e.target.value)}
                                                    placeholder="Pembayaran 1..."
                                                    className="border rounded px-2 py-1.5 text-sm w-full"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleAddPayment}
                                                    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                >Simpan</button>
                                                <button
                                                    onClick={() => { setShowPayForm(false); setNewPaySpk(""); }}
                                                    className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                                                >Batal</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowPayForm(true)}
                                            className="w-full py-2 text-sm border-2 border-dashed border-blue-300 text-blue-500 hover:bg-blue-50 rounded-lg"
                                        >
                                            + Tambah Pembayaran ke {detailSup?.supplier}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
