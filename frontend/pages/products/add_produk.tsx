import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import { AnyCnameRecord } from "dns";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
let Numbering = new Intl.NumberFormat("id-ID");
import Cookies from "js-cookie";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function AddProduk() {
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));
  const [isLoading, setisLoading]: any = useState(true);
  const [data_ware, setdatawares] = useState([]);
  const [data_brand, setdatabrand] = useState([]);
  const [data_category, setdatacategory] = useState([]);
  const [data_supplier, setdatasupplier] = useState([]);
  const [data_historypo, setdatahistorypo] = useState([]);
  const [data_so, setdataso] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getwarehouse(Role, area);
    getbrand(Role, area);
    getcategory();
    getsupplier(Role, area);
    gethistoripo();
  }, []);

  const [Role, setRole] = useState(Cookies.get("auth_role"));
  const [area, setarea] = useState(Cookies.get("auth_store"));
  const [isDisabled, setIsDisabled] = useState(false);

  async function getwarehouse(role: any, area: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getwarehouseselected`,
      data: {
        role: role,
        store: area,
      },
    })
      .then(function (response) {
        setdatawares(response.data.data_warehouse);
        if (
          "SUPER-ADMIN" === Cookies.get("auth_role") ||
          "HEAD-AREA" === Cookies.get("auth_role")
        ) {
        } else {
          setValue("warehouse", response.data.data_warehouse[0].id_ware);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_warehouses: any = [];
  if (isLoading) {
    data_ware.map((data_ware: any, index: number) => {
      list_warehouses.push(
        <option key={index} value={data_ware.id_ware}>
          {data_ware.warehouse}
        </option>
      );
    });
  }

  async function getbrand(Role: any, area: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getbrandarea`,
      data: {
        role: Role,
        store: area,
      },
    })
      .then(function (response) {
        setdatabrand(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_brand_produk: any = [];
  if (isLoading) {
    data_brand.map((brand: any, index: number) => {
      list_brand_produk.push(
        <option key={index} value={brand.id_brand}>
          {brand.brand}
        </option>
      );
    });
  }

  async function gethistoripo() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/gethistoripo`,
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
  if (isLoading) {
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
      url: `http://localhost:4000/v1/gethistoriso`,
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
      url: `http://localhost:4000/v1/getcategory`,
    })
      .then(function (response) {
        setdatacategory(response.data.data_category);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_category: any = [];
  if (isLoading) {
    data_category.map((area: any, index: number) => {
      list_category.push(
        <option key={index} value={area.id_category}>
          {area.category}
        </option>
      );
    });
  }

  async function getsupplier(Role: any, area: any) {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/getsupplierarea`,
      data: {
        role: Role,
        store: area,
      },
    })
      .then(function (response) {
        setdatasupplier(response.data.result);
        // console.log(response.data.data_supplier)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const list_supplier: any = [];
  if (isLoading) {
    data_supplier.map((area: any, index: number) => {
      list_supplier.push(
        <option key={index} value={area.id_sup}>
          {area.supplier}
        </option>
      );
    });
  }

  const [Name, setName] = useState(Cookies.get("auth_name"));
  const [Count, setCount] = useState(1);

  const {
    register,
    unregister,
    control,
    resetField,
    reset,
    setValue,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //     produk: '',
    //     brand: '',
    //     warehouse: '',
    //     supplier: '', 
    //     harga_beli: '',
    //     harga_jual: '',
    //     quality: '',
    //     kategori: '',
    //     deskripsi: '',
    //     img: '',
    // }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variasi",
  });

  const [tipevariasi, settipevariasi] = useState("");

  function ubahtipevariasi(e: any) {
    settipevariasi(e.target.value);

    if (e.target.value === "sneakers35-45") {
      unregister("variasi");
      reset({
        variasi: [
          {
            size: "35",
            stok: "0",
          },
          {
            size: "36",
            stok: "0",
          },
          {
            size: "37",
            stok: "0",
          },
          {
            size: "38",
            stok: "0",
          },
          {
            size: "39",
            stok: "0",
          },
          {
            size: "40",
            stok: "0",
          },
          {
            size: "41",
            stok: "0",
          },
          {
            size: "42",
            stok: "0",
          },
          {
            size: "43",
            stok: "0",
          },
          {
            size: "44",
            stok: "0",
          },
          {
            size: "45",
            stok: "0",
          },
        ],
      });
    } else if (e.target.value === "celana") {
      unregister("variasi");
      reset({
        variasi: [
          {
            size: "28",
            stok: "0",
          },
          {
            size: "29",
            stok: "0",
          },
          {
            size: "30",
            stok: "0",
          },
          {
            size: "31",
            stok: "0",
          },
          {
            size: "32",
            stok: "0",
          },
          {
            size: "33",
            stok: "0",
          },
          {
            size: "34",
            stok: "0",
          },
          {
            size: "36",
            stok: "0",
          },
          {
            size: "38",
            stok: "0",
          },
          {
            size: "40",
            stok: "0",
          },
        ],
      });
    } else if (e.target.value === "apparel") {
      unregister("variasi");
      reset({
        variasi: [
          {
            size: "XS",
            stok: "0",
          },
          {
            size: "S",
            stok: "0",
          },
          {
            size: "M",
            stok: "0",
          },
          {
            size: "L",
            stok: "0",
          },
          {
            size: "XL",
            stok: "0",
          },
          {
            size: "XXL",
            stok: "0",
          },
        ],
      });
    } else if (e.target.value === "caps") {
      unregister("variasi");
      reset({
        variasi: [
          {
            size: "CAPS",
            stok: "0",
          },
        ],
      });
    } else {
      setCount(1);
      unregister("variasi");
      reset({
        variasi: [
          {
            size: "",
            stok: 0,
          },
        ],
      });
    }
  }

  const [tipepo, settipepo] = React.useState("");
  const [list_hargabeli, setlist_hargabeli]: any = React.useState([]);

  let list_variasi: any = [];

  if (tipevariasi === "sneakers35-45") {
    for (let index = 0; index < 11; index++) {
      list_variasi.push(
        <tr key={index} className="rounded-lg h-auto mt-7">
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                readOnly
                defaultValue={35 + index}
                {...register(`variasi.${index}.size`, { required: true })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="Size"
              />
            </div>
          </td>
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                {...register(`variasi.${index}.stok`, {
                  required: true,
                  onChange: (e: any) => {
                    if (e.target.value === "") {
                      var n = 0;
                    } else {
                      var n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    }
                    setValue(`variasi.${index}.stok`, n);
                  },
                })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="0"
              />
            </div>
          </td>
        </tr>
      );
    }
  } else if (tipevariasi === "celana") {
    for (let index = 0; index < 10; index++) {
      list_variasi.push(
        <tr key={index} className="rounded-lg h-auto mt-7">
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                readOnly
                defaultValue={28 + index}
                {...register(`variasi.${index}.size`, { required: true })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="Size"
              />
            </div>
          </td>
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                {...register(`variasi.${index}.stok`, {
                  required: true,
                  onChange: (e: any) => {
                    if (e.target.value === "") {
                      var n = 0;
                    } else {
                      var n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    }
                    setValue(`variasi.${index}.stok`, n);
                  },
                })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="0"
              />
            </div>
          </td>
        </tr>
      );
    }
  } else if (tipevariasi === "apparel") {
    for (let index = 0; index < 6; index++) {
      list_variasi.push(
        <tr key={index} className="rounded-lg h-auto mt-7">
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                readOnly
                defaultValue={1 + index}
                {...register(`variasi.${index}.size`, { required: true })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="Size"
              />
            </div>
          </td>
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                {...register(`variasi.${index}.stok`, {
                  required: true,
                  onChange: (e: any) => {
                    if (e.target.value === "") {
                      var n = 0;
                    } else {
                      var n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    }
                    setValue(`variasi.${index}.stok`, n);
                  },
                })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="0"
              />
            </div>
          </td>
        </tr>
      );
    }
  } else if (tipevariasi === "caps") {
    for (let index = 0; index < 1; index++) {
      list_variasi.push(
        <tr key={index} className="rounded-lg h-auto mt-7">
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                readOnly
                defaultValue={1 + index}
                {...register(`variasi.${index}.size`, { required: true })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="Size"
              />
            </div>
          </td>
          <td className="pt-2">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                {...register(`variasi.${index}.stok`, {
                  required: true,
                  onChange: (e: any) => {
                    if (e.target.value === "") {
                      var n = 0;
                    } else {
                      var n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    }
                    setValue(`variasi.${index}.stok`, n);
                  },
                })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="0"
              />
            </div>
          </td>
        </tr>
      );
    }
  } else if (tipevariasi === "custom") {
    for (let index = 0; index < Count; index++) {
      list_variasi.push(
        <tr key={index} className="rounded-lg h-auto mt-7">
          <td className="pt-2 p-0">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                {...register(`variasi.${index}.size`, { required: true })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="text"
                placeholder="Size"
              />
            </div>
          </td>
          <td className="pt-2 p-0">
            <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
              <input
                // {...register(`variasi.${index}.stok`, { required: true })}
                {...register(`variasi.${index}.stok`, {
                  required: true,
                  onChange: (e: any) => {
                    if (e.target.value === "") {
                      var n = 0;
                    } else {
                      var n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    }
                    setValue(`variasi.${index}.stok`, n);
                  },
                })}
                className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg"
                type="number"
                step={".01"}
                min={0}
                placeholder="Size"
              />
            </div>
          </td>
          <td className="pt-2 p-0">
            {(function () {
              if (index < 1) {
                return (
                  <button
                    onClick={() => {
                      append({ size: "", stok: 0 });
                      setCount(Count + 1);
                    }}
                    type="button"
                    className="mx-2 m-auto border-none rounded-lg bg-blue-600 hover:bg-blue-800 h-[30px] text-white px-4 flex flex-wrap gap-2 content-center"
                  >
                    <div className="my-auto">
                      <fa.FaPlus size={13} className="text-white" />
                    </div>
                  </button>
                );
              } else {
                return (
                  <button
                    onClick={() => {
                      remove(index);
                      setCount(Count - 1);
                    }}
                    type="button"
                    className="mx-2 m-auto border-none rounded-lg bg-red-600 hover:bg-red-800 h-[30px] text-white px-4 flex flex-wrap gap-2 content-center"
                  >
                    <div className="my-auto">
                      <fa.FaMinus size={13} className="text-white" />
                    </div>
                  </button>
                );
              }
            })()}
          </td>
        </tr>
      );
    }
  }

  const [selectedImage, setSelectedImage] = useState(null);

  const onSubmit = async (data: any) => {
    setIsDisabled(true);
    var qty_all = 0;
    var hargabeli = data.harga_beli.replace(/\D/g, "");
    var g_price = data.g_price.replace(/\D/g, "");
    var r_price = data.r_price.replace(/\D/g, "");
    var n_price = data.n_price.replace(/\D/g, "");
    for (let index = 0; index < data.variasi.length; index++) {
      qty_all = qty_all + parseInt(data.variasi[index].stok);
    }
    var total_amount = qty_all * parseInt(hargabeli);

    let formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("produk", data.produk);
    formData.append("brand", data.brand);
    formData.append("warehouse", data.warehouse);
    formData.append("quality", "ORIGINAL");
    formData.append("kategori", data.kategori);
    formData.append("g_price", g_price);
    formData.append("r_price", r_price);
    formData.append("n_price", n_price);
    formData.append("hargabeli", hargabeli);
    formData.append("supplier", data.supplier_pobaru);
    formData.append("tipe_po", data.tipe_po);
    formData.append("history_po", data.history_po);
    formData.append("users", Name);
    formData.append("qty_all", JSON.stringify(qty_all));
    formData.append("total_amount", JSON.stringify(total_amount));
    formData.append("variasi", JSON.stringify(data.variasi));
    // if (qty_all < 1) {
    //   toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     pauseOnHover: false,
    //     autoClose: 2000,
    //   });
    // } else {
    await axios({
      method: "post",
      url: `http://localhost:4000/v1/addproduk`,
      headers: {
        "content-type": "multipart/form-data",
      },
      data: formData,
    }).then(function (response) {
      // console.log(response.data);
    });

    toast.success("Data telah disimpan", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
      onClose: () => router.replace("/products/daftar_produk"),
    });
    // }
  };

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

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="p-5">
      <div className="border-b border-[#2125291A] h-16 mb-4">
        <div className="flex flex-wrap items-center">
          <button
            className="bg-gray-200 p-3 rounded-lg mr-6 "
            onClick={() => router.back()}
          >
            <fa.FaChevronLeft size={13} />
          </button>
          <span className="font-bold text-xl">Add Product</span>
        </div>

      </div>

      <ToastContainer className="mt-[50px]" />

      <div className="w-full h-[auto] pb-5 gap-5">
        <div className="bg-white p-8 pb-14 rounded-lg gap-3">
          <span className="font-bold text-lg">Product Information</span>

          <div className="flex flex-1 gap-5">
            <div className="flex pt-8 items-start justify-center w-[400px]">
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
                  // onDoubleClick={removeSelectedImage}
                  />
                </div>
              ) : (
                <div
                  className="aspect-square w-[20rem] h-[20rem] border rounded-lg cursor-pointer"
                  onClick={handleClick}
                >
                  <fa.FaPlus size={13} className="m-auto h-full" color="grey" />
                </div>
              )}
            </div>

            <div className="grow text-sm">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-row gap-5 justify-center content-center items-center">
                  <div className="basis-1/2">
                    <div className="mb-3">Name Product</div>
                    <input
                      className={`${errors.produk ? "border-red-400" : ""
                        } border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      type="text"
                      placeholder="Masukan Produk"
                      {...register("produk", { required: true })}
                    />
                  </div>
                  <div className="basis-1/2">
                    <div className="mb-3">Brand</div>
                    <select
                      {...register("brand", { required: true })}
                      className={`${errors.brand ? "border-red-400" : ""
                        } appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                    >
                      <option value="">Select Brand</option>
                      {list_brand_produk}
                    </select>
                  </div>
                </div>

                <div className="flex flex-row gap-5 justify-center content-center items-center mt-4">

                  <div className="grow">
                    <div className="mb-3">Warehouse</div>
                    {"SUPER-ADMIN" === Cookies.get("auth_role") ||
                      "HEAD-AREA" === Cookies.get("auth_role") ? (
                      <>
                        <select
                          {...register("warehouse", { required: true })}
                          className={`${errors.warehouse ? "border-red-400" : ""
                            } appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        >
                          <option value="">Select Warehouse</option>
                          {list_warehouses}
                        </select>
                      </>
                    ) : (
                      <>
                        <select
                          {...register("warehouse", { required: true })}
                          className={`${errors.warehouse ? "border-red-400" : ""
                            } appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        >
                          {list_warehouses}
                        </select>
                      </>
                    )}
                  </div>

                  <div className="grow">
                    <div className="mb-3">Category</div>
                    <select
                      {...register("kategori", { required: true })}
                      className={`${errors.kategori ? "border-red-400" : ""
                        } appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                    >
                      <option value="">Select Category</option>
                      {list_category}
                    </select>
                  </div>

                  {/* <div className="basis-1/3">
                    <div className="mb-3">Quality</div>
                    <select
                      {...register("quality", { required: true })}
                      className={`${errors.quality ? "border-red-400" : ""
                        } appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                    >
                      <option value="">Select Quality</option>
                      <option value="IMPORT">IMPORT</option>
                      <option value="LOKAL">LOKAL</option>
                      <option value="ORIGINAL">ORIGINAL</option>
                    </select>
                  </div> */}
                </div>

                <div className="flex flex-row gap-5 justify-center content-center items-center mt-4">

                  <div className="grow">
                    <div className="mb-3">Cost</div>
                    <CurrencyInput
                      className={`${errors.harga_beli ? "border-red-400" : ""
                        } border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      placeholder="Masukan Harga Beli"
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      {...register("harga_beli", {
                        required: true,
                      })}
                    />
                  </div>

                  <div className="grow">
                    <div className="mb-3">Grosir</div>
                    <CurrencyInput
                      className={`${errors.g_price ? "border-red-400" : ""
                        } border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      placeholder="Masukan Harga Beli"
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      {...register("g_price", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="grow">
                    <div className="mb-3">Reseller</div>
                    <CurrencyInput
                      className={`${errors.r_price ? "border-red-400" : ""
                        } border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      placeholder="Masukan Harga Beli"
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      {...register("r_price", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="grow">
                    <div className="mb-3">Normal</div>
                    <CurrencyInput
                      className={`${errors.n_price ? "border-red-400" : ""
                        } border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                      placeholder="Masukan Harga Beli"
                      defaultValue={0}
                      decimalsLimit={2}
                      groupSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      {...register("n_price", {
                        required: true,
                      })}
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-4 gap-4">
                  <div className="basis-1/2 flex flex-wrap items-center justify-end">
                    <select
                      {...register("supplier_pobaru", { required: true })}
                      className={`${errors.supplier_pobaru
                        ? "border-red-500 border-2"
                        : "border"
                        } appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                    >
                      <option value="">Select Supplier</option>
                      {list_supplier}
                    </select>

                  </div>
                  <div className="basis-1/2 flex flex-wrap items-center justify-end">

                    <select
                      onChange={(e) => {
                        ubahtipevariasi(e);
                      }}
                      className={`appearance-none border h-[45px] w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                    >
                      <option value="">Select Variation Type</option>
                      <option value="celana">
                        ( 28 - 40 )
                      </option>
                      <option value="apparel">
                        ( XS - XXXL )
                      </option>
                      <option value="caps">
                        All Size
                      </option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>


              </form>
            </div>


            <div className="flex text-sm flex-2 gap-5">
              <div className="w-[100%]">
                {(function () {
                  if (tipevariasi === "custom") {
                    return (
                      <table className="table table-auto bg-transparent text-sm w-full">
                        <thead className="bg-[#DDE4F0] text-gray-800">
                          <tr className="">
                            <th className="py-1 rounded-l-lg">Size</th>
                            <th className="py-1">Stok</th>
                            <th className="py-1 rounded-r-lg">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="group rounded-lg">
                          {list_variasi}
                        </tbody>
                      </table>
                    );
                  } else if (tipevariasi === "sneakers35-45") {
                    return (
                      <table className="table table-auto bg-transparent text-sm w-full">
                        <thead className="bg-[#DDE4F0] text-gray-800">
                          <tr className="">
                            <th className="py-1 rounded-l-lg">Size</th>
                            <th className="py-1 rounded-r-lg">Stok</th>
                          </tr>
                        </thead>
                        <tbody className="group rounded-lg">
                          {list_variasi}
                        </tbody>
                      </table>
                    );
                  } else if (tipevariasi === "celana") {
                    return (
                      <table className="table table-auto bg-transparent text-sm w-full">
                        <thead className="bg-[#DDE4F0] text-gray-800">
                          <tr className="">
                            <th className="py-1 rounded-l-lg">Size</th>
                            <th className="py-1 rounded-r-lg">Stok</th>
                          </tr>
                        </thead>
                        <tbody className="group rounded-lg">
                          {list_variasi}
                        </tbody>
                      </table>
                    );
                  } else if (tipevariasi === "apparel") {
                    return (
                      <table className="table table-auto bg-transparent text-sm w-full">
                        <thead className="bg-[#DDE4F0] text-gray-800">
                          <tr className="">
                            <th className="py-1 rounded-l-lg">Size</th>
                            <th className="py-1 rounded-r-lg">Stok</th>
                          </tr>
                        </thead>
                        <tbody className="group rounded-lg">
                          {list_variasi}
                        </tbody>
                      </table>
                    );
                  } else if (tipevariasi === "caps") {
                    return (
                      <table className="table table-auto bg-transparent text-sm w-full">
                        <thead className="bg-[#DDE4F0] text-gray-800">
                          <tr className="">
                            <th className="py-1 rounded-l-lg">Size</th>
                            <th className="py-1 rounded-r-lg">Stok</th>
                          </tr>
                        </thead>
                        <tbody className="group rounded-lg">
                          {list_variasi}
                        </tbody>
                      </table>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          <div className="pt-11 rounded-lg flex justify-end">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isDisabled}
              className="cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap content-center"
            >
              Save Product
            </button>
          </div>
        </div>
      </div >
    </div >
  );
}

const styles = {
  preview: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
  },
  delete: {
    cursor: "pointer",
    padding: 15,
    background: "red",
    color: "white",
    border: "none",
  },
};
