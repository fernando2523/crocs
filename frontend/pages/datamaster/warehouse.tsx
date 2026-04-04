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
import axios from "axios";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Warehouse() {
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

  const [isLoading, setisLoading]: any = useState(true);
  const [data_ware, setdatawarehouse] = useState([]);
  const [data_area, setdataarea] = useState([]);
  const [data_brand, setdatabrand] = useState([]);

  useEffect(() => {
    loaddatawarehouse();
    getstore_area();
  }, []);

  async function loaddatawarehouse() {
    setisLoading(true);
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getwarehouse`,
    })
      .then(function (response) {
        setdatawarehouse(response.data.data_warehouse)
        const loggedBrands = new Set();
        let hasil_brand: any = [];

        response.data.data_warehouse.forEach((brands: any) => {
          if (!loggedBrands.has(brands.brand)) {
            loggedBrands.add(brands.brand);
            hasil_brand.push({
              id_brand: brands.brand,
              brand: brands.brand,
            });
          }
        });
        setdatabrand(hasil_brand);

        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const onSubmit = async (data: any) => {
    await axios
      .post("http://localhost:4000/v1/addwarehouse", data)
      .then(function (response) {
        loaddatawarehouse();
      });
    toast.success("Data telah disimpan", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    resetField("warehouse");
    resetField("alamat");
    setShowModal(false);
  };

  async function getstore_area() {
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getstore_area`,
    })
      .then(function (response) {
        setdataarea(response.data.data_area);
        // console.log(response.data.data_area);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [id, setid] = React.useState(null);

  function showeditModal(
    id: any,
    id_area: any,
    warehouse: any,
    address: any,
    brand: any,
    index: number
  ) {
    setid(id);
    resetField("edit_warehouse");
    resetField("edit_alamat");
    setValue("edit_warehouse", warehouse);
    setValue("edit_alamat", address);
    setValue("edit_id_area", id_area);
    setValue("edit_brand", brand);
    seteditModal(true);
  }

  const onSubmitUpdate = async (data: any) => {
    console.log(data);

    await axios
      .post(`http://localhost:4000/v1/editwarehouse`, { data, id })
      .then(function (response) {
        // console.log(response.data);
        loaddatawarehouse();
      });

    toast.success("Data telah diupdate", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    seteditModal(false);
  };

  const [showModal, setShowModal] = React.useState(false);
  const [delModal, setdelModal] = React.useState(false);
  const [editModal, seteditModal] = React.useState(false);

  const [Warehouse, setWarehouse] = React.useState(null);

  function showdeleteModal(id: any, index: number) {
    setid(id);
    setWarehouse(list_ware[index].warehouse);
    setdelModal(true);
  }

  async function deleteData() {
    await axios
      .post(`http://localhost:4000/v1/deletewarehouse`, { id })
      .then(function (response) {
        console.log(response.data);
        loaddatawarehouse();
      });

    toast.success("Data berhasil dihapus", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setdelModal(false);
  }

  const list_ware: any = [];

  if (!isLoading) {
    data_ware.map((data_ware: any, index: number) => {
      return list_ware.push({
        id: index,
        id_ware: data_ware.id_ware,
        id_area: data_ware.id_area,
        warehouse: data_ware.warehouse,
        alamat: data_ware.address,
        brand: data_ware.brand,
        action: (
          <div className="flex flex-warp gap-4">
            <button
              className="text-blue-500"
              onClick={() =>
                showeditModal(
                  data_ware.id,
                  data_ware.id_area,
                  data_ware.warehouse,
                  data_ware.address,
                  data_ware.brand,
                  index
                )
              }
            >
              <i className="fi fi-rr-edit text-center text-xl"></i>
            </button>
            <button
              className="text-red-500"
              onClick={() => showdeleteModal(data_ware.id, index)}
            >
              <i className="fi fi-rr-trash text-center text-xl"></i>
            </button>
          </div>
        ),
      });
    });
  }

  const list_brand: any = [];

  if (!isLoading) {
    data_brand.map((brand: any, index: number) => {
      list_brand.push(
        <option key={index} value={brand.id_brand}>
          {brand.brand}
        </option>
      );
    });
  }

  const list_area: any = [];

  if (!isLoading) {
    data_area.map((area: any, index: number) => {
      list_area.push(
        <option key={index} value={area.id_area}>
          {area.kota}
        </option>
      );
    });
  } else {
    var data_store: any = [];
  }

  const {
    register,
    resetField,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id_area: "",
      warehouse: "",
      alamat: "",
      brand: "",
      edit_warehouse: "",
      edit_alamat: "",
      edit_id_area: "",
      edit_brand: "",
    },
  });

  const columns: any = [
    {
      name: "ID Warehouse",
      selector: (row: { id_ware: any }) => row.id_ware,
    },
    {
      name: "ID Area",
      selector: (row: { id_area: any }) => row.id_area,
    },
    {
      name: "Warehouse",
      selector: (row: { warehouse: any }) => row.warehouse,
    },
    {
      name: "Alamat",
      selector: (row: { alamat: any }) => row.alamat,
    },
    {
      name: "Brand",
      selector: (row: { brand: any }) => row.brand,
    },
    {
      name: "Action",
      selector: (row: { action: any }) => row.action,
    },
  ];

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = list_ware.filter((list_ware: any) => {
    return (
      list_ware.id_ware
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_ware.id_area
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_ware.warehouse
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_ware.alamat
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_ware.brand
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

  return (
    <div className="p-5">
      <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
        Data Warehouse
      </div>

      <ToastContainer className="mt-[50px]" />

      <div className="flex flex-wrap items-center content-center mb-6">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Cari data Warehouse"
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

        <div className="ml-auto flex flex-row items-center justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center"
          >
            Tambah Data
            <div className="my-auto">
              <fa.FaPlus size={13} className="text-white" />
            </div>
          </button>
        </div>
      </div>

      <div className="mb-20">
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationComponent={CustomMaterialPagination}
          paginationPerPage={20}
        />
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-xl font-semibold">
                    Tambah Data Warehouse
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Area
                      </label>
                      <select
                        className={`${errors.id_area ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("id_area", { required: true })}
                      >
                        <option value="">Pilih Area Warehouse</option>
                        {list_area}
                      </select>
                      {errors.id_area && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Warehouse
                      </label>
                      <input
                        className={`${errors.warehouse
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Warehouse"
                        defaultValue=""
                        {...register("warehouse", { required: true })}
                      />
                      {errors.warehouse && (
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
                        className={`${errors.brand ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("brand", { required: true })}
                      >
                        <option value="">Pilih Brand</option>
                        {list_brand}
                      </select>
                      {errors.brand && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Alamat
                      </label>
                      <input
                        className={`${errors.alamat ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Alamat"
                        // ref={req_Alamat}
                        defaultValue=""
                        {...register("alamat", { required: true })}
                      />
                      {errors.alamat && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      resetField("id_area");
                      setValue("id_area", "");
                      resetField("warehouse");
                      resetField("alamat");
                      resetField("brand");
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {editModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <span className="text-xl font-semibold">
                    Edit Data Warehouse
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmitUpdate)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Area
                      </label>
                      <select
                        className={`${errors.edit_id_area
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("edit_id_area", { required: true })}
                      >
                        <option value="">Pilih Area Warehouse</option>
                        {list_area}
                      </select>
                      {errors.edit_id_area && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Warehouse
                      </label>
                      <input
                        className={`${errors.edit_warehouse
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Warehouse"
                        // ref={req_Warehouse}
                        {...register("edit_warehouse", { required: true })}
                      />
                      {errors.edit_warehouse && (
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
                        className={`${errors.edit_brand
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("edit_brand", { required: true })}
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
                        Alamat
                      </label>
                      <input
                        className={`${errors.edit_alamat
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Alamat"
                        // ref={req_Alamat}
                        {...register("edit_alamat", { required: true })}
                      />
                      {errors.edit_alamat && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      seteditModal(false);
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
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {delModal ? (
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
                  <span className="text-sm font-semibold">
                    Warehouse {Warehouse} akan dihapus?
                  </span>
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
      ) : null}
    </div>
  );
}
