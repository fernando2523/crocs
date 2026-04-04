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

export default function Store() {
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

  const [isLoading, setisLoading]: any = useState(true);
  const [data_store, setdatastore] = useState([]);
  const [data_area, setdataarea] = useState([]);
  const [data_warehouse, setdatawarehouse] = useState([]);

  useEffect(() => {
    loaddatastore();
    getstore_area();
    getstore_warehouse();
  }, []);

  async function loaddatastore() {
    setisLoading(true);
    await axios({
      method: "get",
      url: `https://api.gudangsandal.com/v1/getstores`,
    })
      .then(function (response) {
        setdatastore(response.data.data_store);
        setisLoading(false);
        // console.log(response.data.data_store);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getstore_area() {
    await axios({
      method: "get",
      url: `https://api.gudangsandal.com/v1/getstore_area`,
    })
      .then(function (response) {
        setdataarea(response.data.data_area);
        // console.log(response.data.data_area);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getstore_warehouse() {
    await axios({
      method: "get",
      url: `https://api.gudangsandal.com/v1/getstore_warehouse`,
    })
      .then(function (response) {
        setdatawarehouse(response.data.data_warehouse);
        // console.log(response.data.data_warehouse);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const onSubmit = async (data: any) => {
    await axios
      .post("https://api.gudangsandal.com/v1/addstore", data)
      .then(function (response) {
        loaddatastore();
      });

    toast.success("Data telah disimpan", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    resetField("id_area");
    setValue("id_area", "");
    resetField("channel");
    setValue("channel", "");
    resetField("store");
    resetField("alamat");
    resetField("ip");
    setShowModal(false);
  };

  function showeditModal(
    id: any,
    id_ware: any,
    id_area: any,
    store: any,
    channel: any,
    address: any,
    ip: any,
    index: number
  ) {
    setid(id);
    resetField("edit_store");
    resetField("edit_alamat");
    setValue("edit_store", store);
    setValue("edit_channel", channel);
    setValue("edit_alamat", address);
    setValue("edit_id_ware", id_ware);
    setValue("edit_id_area", id_area);
    setValue("edit_ip", ip);
    seteditModal(true);
  }

  const onSubmitUpdate = async (data: any) => {
    await axios
      .post(`https://api.gudangsandal.com/v1/editstore`, { data, id })
      .then(function (response) {
        loaddatastore();
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
  const [Store, setStore] = React.useState(null);
  const [id, setid] = React.useState(null);

  function showdeleteModal(id: any, index: number) {
    setid(id);
    setStore(list_store[index].store);
    setdelModal(true);
  }

  async function deleteData() {
    await axios
      .post(`https://api.gudangsandal.com/v1/deletestore`, { id })
      .then(function (response) {
        // console.log(response.data);
        loaddatastore();
      });

    toast.success("Data berhasil dihapus", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setdelModal(false);
  }

  const list_store: any = [];

  if (!isLoading) {
    data_store.map((data_store: any, index: number) => {
      return list_store.push({
        id: index,
        id_store: data_store.id_store,
        id_ware: data_store.id_ware,
        id_area: data_store.id_area,
        store: data_store.store,
        channel: data_store.channel,
        address: data_store.address,
        ip: data_store.ip,
        action: (
          <div className="flex flex-warp gap-4">
            <button
              className="text-blue-500"
              onClick={() =>
                showeditModal(
                  data_store.id,
                  data_store.id_ware,
                  data_store.id_area,
                  data_store.store,
                  data_store.channel,
                  data_store.address,
                  data_store.ip,
                  index
                )
              }
            >
              <i className="fi fi-rr-edit text-center text-xl"></i>
            </button>
            <button
              className="text-red-500"
              onClick={() => showdeleteModal(data_store.id, index)}
            >
              <i className="fi fi-rr-trash text-center text-xl"></i>
            </button>
          </div>
        ),
      });
    });
  }

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = list_store.filter((list_store: any) => {
    return (
      list_store.id_store
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_store.id_ware
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_store.id_area
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_store.store
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_store.channel
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_store.address
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase())
    );
  });

  const columns: any = [
    // {
    //   name: "ID Store",
    //   selector: (row: { id_store: any }) => row.id_store,
    // },
    {
      name: "ID Area",
      selector: (row: { id_area: any }) => row.id_area,
    },
    // {
    //   name: "ID Ware",
    //   selector: (row: { id_ware: any }) => row.id_ware,
    // },
    {
      name: "Store",
      selector: (row: { store: any }) => row.store,
    },
    {
      name: "Channel",
      selector: (row: { channel: any }) => row.channel,
    },
    {
      name: "Alamat",
      selector: (row: { address: any }) => row.address,
    },
    {
      name: "Api Access",
      selector: (row: { ip: any }) => row.ip,
    },
    {
      name: "Action",
      selector: (row: { action: any }) => row.action,
    },
  ];

  const list_ware: any = [];
  if (!isLoading) {
    data_warehouse.map((warehouse: any, index: number) => {
      list_ware.push(
        <option key={index} value={warehouse.id_ware}>
          {warehouse.warehouse}
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
      id_ware: "",
      id_area: "",
      store: "",
      alamat: "",
      channel: "",
      ip: "",
      edit_store: "",
      edit_alamat: "",
      edit_channel: "",
      edit_id_ware: "",
      edit_id_area: "",
      edit_ip: "",
    },
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
        Menampilkan {String(currentPage)}-{String(Math.ceil(rowCount / 20))}{" "}
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
        Data Store
      </div>

      <ToastContainer className="mt-[50px]" />

      <div className="flex flex-wrap items-center content-center mb-6">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Cari data Store"
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
          className="items-center"
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
                    Tambah Data Store
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Warehouse
                      </label>
                      <select
                        className={`${errors.id_ware ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("id_ware", { required: true })}
                      >
                        <option value="">Pilih Warehouse</option>
                        {list_ware}
                      </select>
                      {errors.id_ware && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Channel
                      </label>
                      <select
                        className={`${errors.channel ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("channel", { required: true })}
                      >
                        <option value="">Pilih Channel</option>
                        <option value="SHOPEE">SHOPEE</option>
                        <option value="TOKOPEDIA">TOKOPEDIA</option>
                        <option value="BLIBLI">BLIBLI</option>
                        <option value="LAZADA">LAZADA</option>
                        <option value="TIKTOK">TIKTOK</option>
                        <option value="OFFLINE STORE">OFFLINE STORE</option>
                      </select>
                      {errors.channel && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Api Access **<span className="text-xs italic text-red-500">Nama Toko Di Marketplace, Harus Sesuai !!!</span>
                      </label>
                      <input
                        className={`${errors.ip ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Nama Toko Di Marketplace"
                        // ref={req_store}
                        defaultValue=""
                        {...register("ip")}
                      />
                      {errors.ip && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Store
                      </label>
                      <input
                        className={`${errors.store ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Store"
                        // ref={req_store}
                        defaultValue=""
                        {...register("store", { required: true })}
                      />
                      {errors.store && (
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
                      resetField("channel");
                      setValue("channel", "");
                      resetField("store");
                      resetField("alamat");
                      resetField("ip");
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
                  <span className="text-xl font-semibold">Edit Data Store</span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmitUpdate)}>
                    <div className="">
                      {/* <div className="mb-4">
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
                      </div> */}
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Warehouse
                        </label>
                        <select
                          className={`${errors.edit_id_ware
                            ? "border-red-500 border-2"
                            : "border"
                            } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                          {...register("edit_id_ware", { required: true })}
                        >
                          <option value="">Pilih Warehouse</option>
                          {list_ware}
                        </select>
                        {errors.edit_id_ware && (
                          <div className="mt-1 text-sm italic">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Api Access **<span className="text-xs italic text-red-500">Nama Toko Di Marketplace, Harus Sesuai !!!</span>
                      </label>
                      <input
                        className={`${errors.edit_ip ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Nama Toko Di Marketplace"
                        // ref={req_store}
                        defaultValue=""
                        {...register("edit_ip")}
                      />
                      {errors.ip && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Store
                      </label>
                      <input
                        className={`${errors.edit_store
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Store"
                        // ref={req_Warehouse}
                        {...register("edit_store", { required: true })}
                      />
                      {errors.edit_store && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Channel
                      </label>
                      <select
                        className={`${errors.edit_channel
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("edit_channel", { required: true })}
                      >
                        <option value="">Pilih Channel</option>
                        <option value="SHOPEE">SHOPEE</option>
                        <option value="TOKOPEDIA">TOKOPEDIA</option>
                        <option value="BLIBLI">BLIBLI</option>
                        <option value="LAZADA">LAZADA</option>
                        <option value="TIKTOK">TIKTOK</option>
                        <option value="OFFLINE STORE">OFFLINE STORE</option>
                      </select>
                      {errors.edit_channel && (
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
                    Store {Store} akan dihapus?
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
