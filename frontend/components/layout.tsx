import * as fa from "react-icons/fa";
import Items from './menu';
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

// Helper: cek apakah user (berdasarkan role atau channel) bisa lihat item menu
const canSee = (roles: string[] | undefined): boolean => {
    if (!roles) return false;
    const role = Cookies.get("auth_role") ?? "";
    const channel = Cookies.get("auth_channel") ?? "";
    return roles.some(r => r === role || r === channel);
};

const Layout = (props: PropsWithChildren) => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    if (Cookies.get("auth_role") === "GUEST") {
        if (screenSize.width < 1200) {
            var [toggleViewMode, setToggleViewMode] = useState(false);
        } else {
            var [toggleViewMode, setToggleViewMode] = useState(false);
        }
    } else {
        if (screenSize.width < 1200) {
            var [toggleViewMode, setToggleViewMode] = useState(false);
        } else {
            var [toggleViewMode, setToggleViewMode] = useState(true);
        }
    }
    const router = useRouter();

    const [openBylink, setopenBylink] = useState(true);

    function toogleActiveStyles() {
        if (toggleViewMode === true) {
            setToggleViewMode(false);
        } else {
            setToggleViewMode(true);
        }
    }

    // State untuk toggle mobile sidebar
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [openMenumode, setopenMenumode] = useState(false);

    function openMenu() {
        if (openMenumode === true) {
            setopenMenumode(false);
        } else {
            setopenMenumode(true);
        }
    }

    const [toggleMenu, setToggleMenu] = useState({
        activeObject: null,
    });

    function toogleActive(index: any) {
        if (openBylink) {
            setopenBylink(false);
            if (index === toggleMenu.activeObject) {
                setToggleMenu({ ...toggleMenu, activeObject: null });
            } else {
                setToggleMenu({ ...toggleMenu, activeObject: index });
                // setToggleMenu({ ...toggleMenu, activeObject: index });
            }
        } else {
            if (index === toggleMenu.activeObject) {
                setToggleMenu({ ...toggleMenu, activeObject: null });
            } else {
                setToggleMenu({ ...toggleMenu, activeObject: index });
            }
        }
    }

    function toogleActiveCollapse(index: any) {
        if (index === toggleMenu.activeObject) {
            return true
        } else {
            return false
        }
    }

    function logout() {
        Cookies.remove('auth')
        Cookies.remove('auth_idusername')
        Cookies.remove('auth_username')
        Cookies.remove('auth_password')
        Cookies.remove('auth_role')
        Cookies.remove('auth_name')
        Cookies.remove('auth_store')
        Cookies.remove('auth_channel')
        router.reload();
    }

    const [Username, setUsername]: any = useState(null);

    //hook useEffect
    useEffect(() => {
        // set initial username once on mount
        const name = Cookies.get('auth') ? Cookies.get('auth_username') : '';
        setUsername(name || false);

        const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutes
        // const INACTIVITY_MS = 30 * 1000; // 30 seconds (testing)
        let timerId: ReturnType<typeof setTimeout> | null = null;

        const scheduleLogout = () => {
            if (timerId) clearTimeout(timerId);
            timerId = setTimeout(() => {
                // clear auth cookies and reload
                Cookies.remove('auth', { path: '/' });
                Cookies.remove('auth_idusername', { path: '/' });
                Cookies.remove('auth_username', { path: '/' });
                Cookies.remove('auth_password', { path: '/' });
                Cookies.remove('auth_role', { path: '/' });
                Cookies.remove('auth_name', { path: '/' });
                Cookies.remove('auth_store', { path: '/' });
                Cookies.remove('auth_channel', { path: '/' });
                router.reload();
            }, INACTIVITY_MS);
        };

        // Any of these events counts as activity
        const activityEvents: (keyof WindowEventMap)[] = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
            'click',
        ];

        const onActivity = () => {
            // Only reset timer if still authenticated
            if (Cookies.get('auth')) {
                scheduleLogout();
            }
        };

        // Attach listeners
        activityEvents.forEach((evt) => {
            window.addEventListener(evt, onActivity, { passive: true });
        });

        // Also listen for tab visibility change (when user comes back)
        const onVisible = () => {
            if (!document.hidden) onActivity();
        };
        document.addEventListener('visibilitychange', onVisible);

        // Kick off the initial timer
        scheduleLogout();

        // Cleanup on unmount
        return () => {
            if (timerId) clearTimeout(timerId);
            activityEvents.forEach((evt) => {
                window.removeEventListener(evt, onActivity);
            });
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);


    // Add showNotification state
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (Cookies.get("auth_store") != "AREA-185") {
            axios.get("https://api.gudangsandal.com/v1/getnotifikasi")
                .then((res) => {
                    setNotifications(res.data.result || []);
                })
                .catch((err) => {
                    console.error("Gagal memuat notifikasi:", err);
                });
        }
    }, []);

    return (
        <div className="grid min-h-screen grid-rows-[60px_1fr] text-sm max-w-screen-xxl">
            {/* header */}
            <div className="w-full h-[60px] fixed drop-shadow bg-white flex justify-start items-center z-20 max-w-screen-xxl">
                {Cookies.get("auth_role") === "GUEST" ? null : (
                    <>
                        {screenSize.width > 1200 ? (
                            <>
                                <div className="ml-4 flex cursor-pointer items-center h-10 w-auto px-2 " onClick={() => toogleActiveStyles()} >
                                    <i className="fi fi-sr-menu-burger w-[1.12rem] h-[1.12rem] text-center text-[1.12rem] leading-4"></i>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Tombol toggle sidebar di mobile */}
                                <div className="ml-3 flex cursor-pointer items-center h-10 w-auto px-2" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
                                    <i className="fi fi-sr-menu-burger w-[1.12rem] h-[1.12rem] text-center text-[1.12rem] leading-4"></i>
                                </div>
                            </>
                        )}
                    </>)}

                <div className="max-height-[80px] w-[130px] ml-5">
                    <Image
                        className="h-full ml-2"
                        src="/gudangsandallogo.png"
                        alt="Picture of the author"
                        width={500}
                        height={500}
                        placeholder="blur"
                        blurDataURL={'/gudangsandallogo.png'}
                    />
                    {/* <span className='font-medium text-2xl text-black'>OFFICIAL KITA Apps</span> */}
                </div>
                <div className="grow">
                </div>
                <div className="relative flex gap-2 items-center mr-5 justify-center">
                    <button
                        onClick={() => setShowNotification(!showNotification)}
                        style={{ display: screenSize.width < 1200 ? 'none' : undefined }}
                        className="relative flex items-center px-2 py-1 rounded hover:bg-gray-50"
                    >
                        <fa.FaBell className="text-xl text-gray-700" />
                        <span className="ml-1">Notifikasi</span>
                        {notifications.filter((n) => n.status_baca !== "READ").length > 0 && (
                            <span className="absolute -top-2 -left-0.5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {notifications.filter((n) => n.status_baca !== "READ").length}
                            </span>
                        )}
                    </button>

                    {showNotification && (
                        <div className="absolute right-0 top-10 w-[350px] bg-white shadow-xl rounded-lg z-50 border border-gray-200">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="font-bold text-lg text-gray-800">Notifikasi Stok</h3>
                                <button
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => {
                                        const unreadIds = notifications
                                            .filter((n) => n.status_baca !== "READ")
                                            .map((n) => n.id_notifikasi);
                                        axios.post("https://api.gudangsandal.com/v1/updatenotifall", {
                                            ids: unreadIds,
                                        }).then(() => {
                                            setNotifications((prev) =>
                                                prev.map((n) =>
                                                    unreadIds.includes(n.id_notifikasi) ? { ...n, status_baca: "READ" } : n
                                                )
                                            );
                                        });
                                    }}
                                >
                                    Tandai semua dibaca
                                </button>
                            </div>
                            <ul className="max-h-[500px] overflow-y-auto divide-y">
                                {notifications.map((notif, index) => (
                                    <li
                                        key={index}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notif.status_baca === null ? 'bg-red-50 hover:bg-red-100' : ''}`}
                                        onClick={() => {
                                            axios.post("https://api.gudangsandal.com/v1/updatenotif", {
                                                id_notifikasi: notif.id_notifikasi,
                                            }).then(() => {
                                                setNotifications((prev) =>
                                                    prev.map((n) =>
                                                        n.id_notifikasi === notif.id_notifikasi ? { ...n, status_baca: "READ" } : n
                                                    )
                                                );
                                                window.location.href = "/products/stock_management";
                                            });
                                        }}
                                    >
                                        <div className="font-semibold text-red-700">Stok Sisa {notif.qty}</div>
                                        <div className="text-sm text-gray-600">{notif.produk} {notif.size}</div>
                                        <div className="text-xs text-gray-400 text-right mt-1">
                                            {(() => {
                                                const date = new Date(notif.updated_at);
                                                const formatted = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}, ${date.getHours().toString().padStart(2, "0")}.${date.getMinutes().toString().padStart(2, "0")}`;
                                                return formatted;
                                            })()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 items-center mr-5 justify-center">
                    <span className="m-auto items-center">Hello <b>{String(Username)}</b>, <button onClick={() => logout()}>Logout</button></span>
                </div>
            </div>
            {/* end header */}

            <div className={`${toggleViewMode ? "left-0" : "left-[-300px]"} w-[15.3rem] fixed duration-200 grid grid-rows-[60px_1fr] h-screen group`}>
                <div></div>
                <ul className="bg-white h-auto mb-1 space-y-2 text-[0.9rem] font-medium overflow-y-auto pt-8 pb-4 px-2 scrollbar-thin scrollbar-thumb-zinc-200 group-hover:scrollbar-thumb-zinc-300 scrollbar-thumb-rounded scrollbar-track-rounded">
                    {Items.map((item: any, index) => {
                        if (canSee(item.roles)) {
                            var pathUrl = router.asPath.split("/");
                            const validasiMenu =
                                toggleMenu.activeObject === index
                                    ? true
                                    : pathUrl[1] == item.path
                                        ? openBylink
                                        : false;
                            if (item.title === "Pesanan Online" || item.title === "Pesanan Toko") {
                                if (Cookies.get("auth_role") === "SUPER-ADMIN" || Cookies.get("auth_role") === "HEAD-AREA" || Cookies.get("auth_role") === "HEAD-BRAND") {
                                    if (item.children) {
                                        return (
                                            <li key={index} className="h-auto rounded-lg cursor-pointer">
                                                <div
                                                    className="flex gap-3.5 items-center justify-start py-3 px-5"
                                                    onClick={() => toogleActive(index)}
                                                >
                                                    <i
                                                        className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                    ></i>
                                                    <span className="text-sm items-center font-normal grow">
                                                        {item.text}
                                                    </span>
                                                    <fa.FaChevronDown
                                                        id={String(index)}
                                                        className={`${validasiMenu ? "rotate-0" : "rotate-180"
                                                            } p-1 w-5 h-5 transition duration-500`}
                                                    />
                                                </div>

                                                <Collapse isOpened={validasiMenu}>
                                                    <ul className="bg-white text-[0.9rem] space-y-1.5 font-medium">
                                                        {item.children.map((child: any, index: any) => {
                                                            if (
                                                                canSee(child.roles)
                                                            ) {
                                                                return (
                                                                    <li
                                                                        key={index}
                                                                        className={`${router.asPath == child.href
                                                                            ? "bg-gray-100 text-black font-bold"
                                                                            : "hover:bg-gray-100 font-normal"
                                                                            } h-auto rounded-lg cursor-pointer pl-3`}
                                                                    >
                                                                        <a
                                                                            href={child.href}
                                                                            className="flex gap-3.5 items-center text-start py-3 px-5"
                                                                        >
                                                                            <i
                                                                                className={`${child.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center m-0 pt-[1.9px]`}
                                                                            ></i>
                                                                            <span className="text-sm items-center grow">
                                                                                {child.text}
                                                                            </span>
                                                                        </a>
                                                                    </li>
                                                                );
                                                            }
                                                        })}
                                                    </ul>
                                                </Collapse>
                                            </li>
                                        );
                                    } else {
                                        return (
                                            <li
                                                key={index}
                                                className={`${router.asPath == item.href
                                                    ? "bg-gray-200 text-gray-700 font-bold"
                                                    : "hover:bg-gray-100 font-normal"
                                                    } "h-auto rounded-lg cursor-pointer`}
                                            >
                                                <a
                                                    href={item.href}
                                                    className="flex gap-3.5 items-center text-center justify-start py-3 px-5"
                                                >
                                                    <i
                                                        className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                    ></i>
                                                    <span className="text-sm items-center">{item.text}</span>
                                                </a>
                                            </li>
                                        );
                                    }
                                } else {
                                    if (Cookies.get("auth_channel") === "OFFLINE STORE") {
                                        if (item.title === "Pesanan Toko") {
                                            if (item.children) {
                                                return (
                                                    <li key={index} className="h-auto rounded-lg cursor-pointer">
                                                        <div
                                                            className="flex gap-3.5 items-center justify-start py-3 px-5"
                                                            onClick={() => toogleActive(index)}
                                                        >
                                                            <i
                                                                className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                            ></i>
                                                            <span className="text-sm items-center font-normal grow">
                                                                {item.text}
                                                            </span>
                                                            <fa.FaChevronDown
                                                                id={String(index)}
                                                                className={`${validasiMenu ? "rotate-0" : "rotate-180"
                                                                    } p-1 w-5 h-5 transition duration-500`}
                                                            />
                                                        </div>

                                                        <Collapse isOpened={validasiMenu}>
                                                            <ul className="bg-white text-[0.9rem] space-y-1.5 font-medium">
                                                                {item.children.map((child: any, index: any) => {
                                                                    if (
                                                                        canSee(child.roles)
                                                                    ) {
                                                                        return (
                                                                            <li
                                                                                key={index}
                                                                                className={`${router.asPath == child.href
                                                                                    ? "bg-gray-100 text-black font-bold"
                                                                                    : "hover:bg-gray-100 font-normal"
                                                                                    } h-auto rounded-lg cursor-pointer pl-3`}
                                                                            >
                                                                                <a
                                                                                    href={child.href}
                                                                                    className="flex gap-3.5 items-center text-start py-3 px-5"
                                                                                >
                                                                                    <i
                                                                                        className={`${child.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center m-0 pt-[1.9px]`}
                                                                                    ></i>
                                                                                    <span className="text-sm items-center grow">
                                                                                        {child.text}
                                                                                    </span>
                                                                                </a>
                                                                            </li>
                                                                        );
                                                                    }
                                                                })}
                                                            </ul>
                                                        </Collapse>
                                                    </li>
                                                );
                                            } else {
                                                return (
                                                    <li
                                                        key={index}
                                                        className={`${router.asPath == item.href
                                                            ? "bg-gray-200 text-gray-700 font-bold"
                                                            : "hover:bg-gray-100 font-normal"
                                                            } "h-auto rounded-lg cursor-pointer`}
                                                    >
                                                        <a
                                                            href={item.href}
                                                            className="flex gap-3.5 items-center text-center justify-start py-3 px-5"
                                                        >
                                                            <i
                                                                className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                            ></i>
                                                            <span className="text-sm items-center">{item.text}</span>
                                                        </a>
                                                    </li>
                                                );
                                            }
                                        }
                                    } else {
                                        if (item.title === "Pesanan Online") {
                                            if (item.children) {
                                                return (
                                                    <li key={index} className="h-auto rounded-lg cursor-pointer">
                                                        <div
                                                            className="flex gap-3.5 items-center justify-start py-3 px-5"
                                                            onClick={() => toogleActive(index)}
                                                        >
                                                            <i
                                                                className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                            ></i>
                                                            <span className="text-sm items-center font-normal grow">
                                                                {item.text}
                                                            </span>
                                                            <fa.FaChevronDown
                                                                id={String(index)}
                                                                className={`${validasiMenu ? "rotate-0" : "rotate-180"
                                                                    } p-1 w-5 h-5 transition duration-500`}
                                                            />
                                                        </div>

                                                        <Collapse isOpened={validasiMenu}>
                                                            <ul className="bg-white text-[0.9rem] space-y-1.5 font-medium">
                                                                {item.children.map((child: any, index: any) => {
                                                                    if (
                                                                        canSee(child.roles)
                                                                    ) {
                                                                        return (
                                                                            <li
                                                                                key={index}
                                                                                className={`${router.asPath == child.href
                                                                                    ? "bg-gray-100 text-black font-bold"
                                                                                    : "hover:bg-gray-100 font-normal"
                                                                                    } h-auto rounded-lg cursor-pointer pl-3`}
                                                                            >
                                                                                <a
                                                                                    href={child.href}
                                                                                    className="flex gap-3.5 items-center text-start py-3 px-5"
                                                                                >
                                                                                    <i
                                                                                        className={`${child.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center m-0 pt-[1.9px]`}
                                                                                    ></i>
                                                                                    <span className="text-sm items-center grow">
                                                                                        {child.text}
                                                                                    </span>
                                                                                </a>
                                                                            </li>
                                                                        );
                                                                    }
                                                                })}
                                                            </ul>
                                                        </Collapse>
                                                    </li>
                                                );
                                            } else {
                                                return (
                                                    <li
                                                        key={index}
                                                        className={`${router.asPath == item.href
                                                            ? "bg-gray-200 text-gray-700 font-bold"
                                                            : "hover:bg-gray-100 font-normal"
                                                            } "h-auto rounded-lg cursor-pointer`}
                                                    >
                                                        <a
                                                            href={item.href}
                                                            className="flex gap-3.5 items-center text-center justify-start py-3 px-5"
                                                        >
                                                            <i
                                                                className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                            ></i>
                                                            <span className="text-sm items-center">{item.text}</span>
                                                        </a>
                                                    </li>
                                                );
                                            }
                                        }
                                    }
                                }

                            } else {
                                if (item.children) {
                                    return (
                                        <li key={index} className="h-auto rounded-lg cursor-pointer">
                                            <div
                                                className="flex gap-3.5 items-center justify-start py-3 px-5"
                                                onClick={() => toogleActive(index)}
                                            >
                                                <i
                                                    className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                ></i>
                                                <span className="text-sm items-center font-normal grow">
                                                    {item.text}
                                                </span>
                                                <fa.FaChevronDown
                                                    id={String(index)}
                                                    className={`${validasiMenu ? "rotate-0" : "rotate-180"
                                                        } p-1 w-5 h-5 transition duration-500`}
                                                />
                                            </div>

                                            <Collapse isOpened={validasiMenu}>
                                                <ul className="bg-white text-[0.9rem] space-y-1.5 font-medium">
                                                    {item.children.map((child: any, index: any) => {
                                                        if (
                                                            canSee(child.roles)
                                                        ) {
                                                            return (
                                                                <li
                                                                    key={index}
                                                                    className={`${router.asPath == child.href
                                                                        ? "bg-gray-100 text-black font-bold"
                                                                        : "hover:bg-gray-100 font-normal"
                                                                        } h-auto rounded-lg cursor-pointer pl-3`}
                                                                >
                                                                    <a
                                                                        href={child.href}
                                                                        className="flex gap-3.5 items-center text-start py-3 px-5"
                                                                    >
                                                                        <i
                                                                            className={`${child.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center m-0 pt-[1.9px]`}
                                                                        ></i>
                                                                        <span className="text-sm items-center grow">
                                                                            {child.text}
                                                                        </span>
                                                                    </a>
                                                                </li>
                                                            );
                                                        }
                                                    })}
                                                </ul>
                                            </Collapse>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li
                                            key={index}
                                            className={`${router.asPath == item.href
                                                ? "bg-gray-200 text-gray-700 font-bold"
                                                : "hover:bg-gray-100 font-normal"
                                                } "h-auto rounded-lg cursor-pointer`}
                                        >
                                            <a
                                                href={item.href}
                                                className="flex gap-3.5 items-center text-center justify-start py-3 px-5"
                                            >
                                                <i
                                                    className={`${item.icon_item} w-5 h-5 text-center text-[1.25rem] leading-5 items-center`}
                                                ></i>
                                                <span className="text-sm items-center">{item.text}</span>
                                            </a>
                                        </li>
                                    );
                                }
                            }
                        }
                    })}
                </ul>
            </div >

            {/* Mobile Sidebar - toggle open/hide, hanya 2 menu */}
            {screenSize.width < 1200 && (
                <div className={`${mobileSidebarOpen ? "left-0" : "left-[-5rem]"} fixed top-[60px] w-16 h-screen bg-white shadow-md z-10 flex flex-col pt-4 gap-1 pb-20 duration-200`}>
                    {/* Menu 1: Daftar Produk */}
                    <a href="/products/daftar_produk">
                        <div className={`flex flex-col items-center py-3 px-1 rounded-lg mx-1 cursor-pointer ${router.asPath.startsWith('/products/daftar_produk') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}>
                            <i className="fi fi-rr-box-alt text-lg leading-none"></i>
                            <span className="text-[9px] text-center mt-1 leading-tight">Produk</span>
                        </div>
                    </a>
                    {/* Menu 2: Picking List */}
                    <a href="/pickinglist">
                        <div className={`flex flex-col items-center py-3 px-1 rounded-lg mx-1 cursor-pointer ${router.asPath.startsWith('/pickinglist') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}>
                            <i className="fi fi-rr-clipboard-list text-lg leading-none"></i>
                            <span className="text-[9px] text-center mt-1 leading-tight">Picking</span>
                        </div>
                    </a>
                </div>
            )}

            {/* <div className="grid grid-cols-[16rem_1fr] h-full"> */}
            <div className="h-screen pt-[60px] " >
                <div className={`${screenSize.width < 1200 ? (mobileSidebarOpen ? "grid-cols-[4rem_1fr]" : "grid-cols-[0rem_1fr]") : toggleViewMode ? "grid-cols-[15.3rem_1fr]" : "grid-cols-[0rem_1fr]"} grid h-full duration-200`}>
                    <div className="h-full bg-[#F4F4F4] pt-5 px-4 ">
                    </div>

                    <main className={`${toggleViewMode ? "px-0" : "px-0"} h-full bg-[#F4F4F4] duration-200 overscroll-y-auto overflow-x-hidden scrollbar-none max-w-screen-xxl`}>
                        {props.children}
                    </main>
                </div>
            </div >
        </div >
    );
};

export default Layout;
