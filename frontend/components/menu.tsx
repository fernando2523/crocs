// ─── CARA EDIT MENU ──────────────────────────────────────────────────────────
//
//  Setiap item menu hanya punya SATU field roles: []
//  Isi dengan siapa yang boleh lihat (role ATAU channel), contoh:
//    roles: ["SUPER-ADMIN", "HEAD-AREA"]
//    roles: ["SHOPEE", "TOKOPEDIA", "TIKTOK"]
//    roles: ["SUPER-ADMIN", "OFFLINE STORE"]   ← bisa campur role + channel
//
//  Role yang tersedia  : SUPER-ADMIN | HEAD-AREA | HEAD-BRAND | HEAD-WAREHOUSE
//                        HEAD-STORE  | CASHIER   | GUEST
//  Channel yang tersedia: SHOPEE | TOKOPEDIA | TIKTOK | OFFLINE STORE
//
//  Field lain yang bisa diedit:
//    title     → nama menu di sidebar
//    href      → link tujuan  (pakai "#" kalau ada children)
//    icon_item → class icon flaticon  (contoh: "fi fi-rr-home")
//    path      → (opsional) nama folder url untuk highlight active
//    children  → (opsional) sub-menu, format sama seperti induk
//
// ─────────────────────────────────────────────────────────────────────────────

const Items = [

    // ── Dashboard ──────────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "HEAD-WAREHOUSE", "CASHIER"],
        title: "Dashboard",
        href: "/",
        text: "Dashboard",
        icon_item: "fi fi-rr-home",
    },

    // ── Cashier (Admin / Warehouse) ────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
        title: "Cashier",
        href: "cashier",
        text: "Cashier",
        icon_item: "fi fi-rr-calculator",
        path: "cashier",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "API Orders",
                href: "/cashier/shipping_base",
                icon_item: "fi fi-rr-box-alt",
                text: "API Orders",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Online Sales",
                href: "/cashier/add_order",
                icon_item: "fi fi-rr-shopping-cart",
                text: "Online Sales",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Offline Sales",
                href: "/cashier/add_order_reseller",
                icon_item: "fi fi-rr-shop",
                text: "Offline Sales",
            },
        ],
    },

    // ── Sales Reports (Admin / Warehouse) ───────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
        title: "Sales Reports",
        href: "#",
        text: "Sales Reports",
        icon_item: "fi fi-rr-bags-shopping",
        path: "report",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Online Sales",
                href: "/report/shipping",
                icon_item: "fi fi-rr-shopping-cart",
                text: "Online Sales",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Offline Sales",
                href: "/report/shipping_reseller",
                icon_item: "fi fi-rr-shop",
                text: "Offline Sales",
            },
        ],
    },

    // ── Cashier (channel: SHOPEE / TOKOPEDIA / TIKTOK) ────────────────────────
    {
        roles: ["SHOPEE", "TOKOPEDIA", "TIKTOK"],
        title: "Cashier",
        href: "cashier",
        text: "Cashier",
        icon_item: "fi fi-rr-calculator",
        path: "cashier",
        children: [
            {
                roles: ["HEAD-STORE", "CASHIER"],
                title: "API Orders",
                href: "/report/shipping_base",
                icon_item: "fi fi-rr-box-alt",
                text: "API Orders",
            },
            {
                roles: ["HEAD-STORE", "CASHIER"],
                title: "Online Sales",
                href: "/cashier/add_order",
                icon_item: "fi fi-rr-shopping-cart",
                text: "Online Sales",
            },
        ],
    },

    // ── Sales Reports (channel: SHOPEE / TOKOPEDIA / TIKTOK) ──────────────────
    {
        roles: ["SHOPEE", "TOKOPEDIA", "TIKTOK"],
        title: "Sales Reports",
        href: "#",
        text: "Sales Reports",
        icon_item: "fi fi-rr-bags-shopping",
        path: "report",
        children: [
            {
                roles: ["HEAD-STORE", "CASHIER"],
                title: "Online Sales",
                href: "/report/shipping",
                icon_item: "fi fi-rr-shopping-cart",
                text: "Online Sales",
            },
        ],
    },

    // ── Cashier (channel: OFFLINE STORE) ──────────────────────────────────────
    {
        roles: ["OFFLINE STORE"],
        title: "Cashier",
        href: "cashier",
        text: "Cashier",
        icon_item: "fi fi-rr-calculator",
        path: "cashier",
        children: [
            {
                roles: ["HEAD-STORE", "CASHIER"],
                title: "Offline Sales",
                href: "/cashier/add_order_reseller",
                icon_item: "fi fi-rr-shop",
                text: "Offline Sales",
            },
        ],
    },

    // ── Sales Reports (channel: OFFLINE STORE) ─────────────────────────────────
    {
        roles: ["OFFLINE STORE"],
        title: "Sales Reports",
        href: "#",
        text: "Sales Reports",
        icon_item: "fi fi-rr-bags-shopping",
        path: "report",
        children: [
            {
                roles: ["HEAD-STORE", "CASHIER"],
                title: "Offline Sales",
                href: "/report/shipping_reseller",
                icon_item: "fi fi-rr-shop",
                text: "Offline Sales",
            },
        ],
    },

    // ── Picking List ────────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE", "HEAD-STORE", "CASHIER"],
        title: "Picking List",
        href: "/pickinglist",
        text: "Picking List",
        icon_item: "fi fi-rr-clipboard-list",
        path: "pickinglist",
    },

    // ── Inventory (Admin / Warehouse) ───────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
        title: "Inventory",
        href: "#",
        text: "Inventory",
        icon_item: "fi fi-rr-box",
        path: "products",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Products",
                href: "/products/daftar_produk",
                icon_item: "fi fi-rr-box-alt",
                text: "Products",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Stock Management",
                href: "/products/stock_management",
                icon_item: "fi fi-rr-clipboard-list",
                text: "Stock Management",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "OFFLINE STORE"],
                title: "Store Display",
                href: "/products/display_produk",
                icon_item: "fi fi-rr-shop",
                text: "Store Display",
            },
        ],
    },

    // ── Inventory (HEAD-STORE / CASHIER) ────────────────────────────────────────
    {
        roles: ["HEAD-STORE", "CASHIER"],
        title: "Inventory",
        href: "#",
        text: "Inventory",
        icon_item: "fi fi-rr-box",
        path: "products",
        children: [
            {
                roles: ["HEAD-WAREHOUSE", "HEAD-STORE", "CASHIER"],
                title: "Products",
                href: "/products/daftar_produk",
                icon_item: "fi fi-rr-box-alt",
                text: "Products",
            },
            {
                roles: ["OFFLINE STORE"],
                title: "Store Display",
                href: "/products/display_produk",
                icon_item: "fi fi-rr-shop",
                text: "Store Display",
            },
        ],
    },

    // ── Reports (Admin / Warehouse) ────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
        title: "Inventory Reports",
        href: "#",
        text: "Inventory Reports",
        icon_item: "fi fi-rr-clipboard-list",
        path: "reports",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Purchase Orders",
                href: "/reports/pagepo",
                icon_item: "fi fi-rr-file-invoice",
                text: "Purchase Orders",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Defect Movements",
                href: "/reports/pagedefect",
                icon_item: "fi fi-rr-file-invoice",
                text: "Defect Movements",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA"],
                title: "Defect Write-Offs",
                href: "/reports/pagedefectReject",
                icon_item: "fi fi-rr-folder-times",
                text: "Defect Write-Offs",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Warehouse Transfers",
                href: "/reports/pagetransfer",
                icon_item: "fi fi-rr-truck-side",
                text: "Warehouse Transfers",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Stock Opname",
                href: "/reports/pageso",
                icon_item: "fi fi-rr-search",
                text: "Stock Opname",
            },
        ],
    },

    // ── Reports (HEAD-STORE / CASHIER) ────────────────────────────────────────
    {
        roles: ["HEAD-STORE", "CASHIER"],
        title: "Inventory Reports",
        href: "#",
        text: "Inventory Reports",
        icon_item: "fi fi-rr-clipboard-list",
        path: "reports",
        children: [
            {
                roles: ["HEAD-WAREHOUSE"],
                title: "Purchase Orders",
                href: "/products/pagepo",
                icon_item: "fi fi-rr-file-invoice",
                text: "Purchase Orders",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Defect Movements",
                href: "/products/pagedefect",
                icon_item: "fi fi-rr-file-invoice",
                text: "Defect Movements",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA"],
                title: "Defect Write-Offs",
                href: "/reports/pagedefectReject",
                icon_item: "fi fi-rr-folder-times",
                text: "Defect Write-Offs",
            },
            {
                roles: ["HEAD-WAREHOUSE"],
                title: "Warehouse Transfers",
                href: "/products/pagetransfer",
                icon_item: "fi fi-rr-truck-side",
                text: "Warehouse Transfers",
            },
            {
                roles: ["HEAD-WAREHOUSE"],
                title: "Stock Opname",
                href: "/products/pageso",
                icon_item: "fi fi-rr-search",
                text: "Stock Opname",
            },
        ],
    },

    // ── Inventory (GUEST) ───────────────────────────────────────────────────────
    {
        roles: ["GUEST"],
        title: "Inventory",
        href: "#",
        text: "Inventory",
        icon_item: "fi fi-rr-box",
        path: "products",
        children: [
            {
                roles: ["GUEST"],
                title: "Products",
                href: "/products/daftar_produk",
                icon_item: "fi fi-rr-box-alt",
                text: "Products",
            },
        ],
    },

    // ── Transactions ───────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "HEAD-WAREHOUSE"],
        title: "Transactions",
        href: "#",
        text: "Transactions",
        icon_item: "fi fi-rr-time-past",
        path: "histories",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER", "HEAD-WAREHOUSE"],
                title: "Activity Log",
                href: "/histories/histories",
                icon_item: "fi fi-rr-notebook",
                text: "Activity Log",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER", "HEAD-WAREHOUSE"],
                title: "Stock Movements",
                href: "/histories/mutasi_stock",
                icon_item: "fi fi-rr-notebook",
                text: "Stock Movements",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER"],
                title: "Refunds",
                href: "/histories/histori_refund",
                icon_item: "fi fi-rr-cross",
                text: "Refunds",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER"],
                title: "Size Exchanges",
                href: "/histories/histori_retur",
                icon_item: "fi fi-rr-shuffle",
                text: "Size Exchanges",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER"],
                title: "Product Exchanges",
                href: "/histories/histori_tukar_model",
                icon_item: "fi fi-rr-replace",
                text: "Product Exchanges",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER"],
                title: "Deleted Orders",
                href: "/histories/histori_delete",
                icon_item: "fi fi-rr-trash",
                text: "Deleted Orders",
            },
        ],
    },

    // ── Production ─────────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA"],
        title: "Production",
        href: "#",
        text: "Production",
        icon_item: "fi fi-rr-document",
        path: "production",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA"],
                title: "Production Planning",
                href: "/production/dataspk",
                icon_item: "fi fi-rr-clipboard-list",
                text: "Production Planning",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-WAREHOUSE"],
                title: "Barcode Printing",
                href: "/production/barcode",
                icon_item: "fi fi-rr-print",
                text: "Barcode Printing",
            },
            {
                roles: ["SUPER-ADMIN"],
                title: "Vendor Payments",
                href: "/production/spk_payment",
                icon_item: "fi fi-rr-wallet",
                text: "Vendor Payments",
            },
        ],
    },

    // ── Finance ────────────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN"],
        title: "Finance",
        href: "#",
        text: "Finance",
        icon_item: "fi fi-rr-sack-dollar",
        path: "finance",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Store Expenses",
                href: "/finance/expanses",
                icon_item: "fi fi-rr-receipt",
                text: "Store Expenses",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Assets",
                href: "/finance/assets",
                icon_item: "fi fi-rs-sack-dollar",
                text: "Assets",
            },
        ],
    },

    // ── Master Data ────────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN"],
        title: "Master Data",
        href: "#",
        text: "Master Data",
        icon_item: "fi fi-rr-folder",
        path: "datamaster",
        children: [
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Regions",
                href: "/datamaster/area",
                icon_item: "fi fi-rs-map-marker",
                text: "Regions",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Warehouses",
                href: "/datamaster/warehouse",
                icon_item: "fi fi-rr-garage-open",
                text: "Warehouses",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Stores",
                href: "/datamaster/store",
                icon_item: "fi fi-rr-shop",
                text: "Stores",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Brands",
                href: "/datamaster/brand",
                icon_item: "fi fi-rr-tags",
                text: "Brands",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Categories",
                href: "/datamaster/category",
                icon_item: "fi fi-rr-cube",
                text: "Categories",
            },
            {
                roles: ["SUPER-ADMIN", "HEAD-WAREHOUSE"],
                title: "Vendors",
                href: "/datamaster/supplier",
                icon_item: "fi fi-rr-handshake",
                text: "Vendors",
            },
            {
                roles: ["SUPER-ADMIN"],
                title: "Staff",
                href: "/datamaster/karyawan",
                icon_item: "fi fi-rr-user",
                text: "Staff",
            },
        ],
    },



    // ── Settings ───────────────────────────────────────────────────────────────
    {
        roles: ["SUPER-ADMIN", "HEAD-AREA", "HEAD-BRAND", "HEAD-STORE", "CASHIER", "HEAD-WAREHOUSE"],
        title: "Settings",
        href: "/settings/setting",
        text: "Settings",
        icon_item: "fi fi-rr-settings",
    },
];

export default Items;
