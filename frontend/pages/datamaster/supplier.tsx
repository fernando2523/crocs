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
import { json } from "body-parser";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Warehouse() {
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));
  const list_supplier: any = [];
  const [isLoading, setisLoading]: any = useState(true);
  const [data_supplier, setdatasupplier] = useState([]);

  useEffect(() => {
    loaddatasupplier();
  }, []);

  async function loaddatasupplier() {
    setisLoading(true);
    await axios({
      method: "get",
      url: `http://localhost:4000/v1/getsupplier`,
    })
      .then(function (response) {
        setdatasupplier(response.data.data_supplier);
        setisLoading(false);
        // console.log(response.data.data_supplier);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const onSubmit = async (data: any) => {
    await axios
      .post("http://localhost:4000/v1/addsupplier", data)
      .then(function (response) {
        // console.log(response.data);
        loaddatasupplier();
      });

    toast.success("Data telah disimpan", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    resetField("supplier");
    resetField("contact");
    setShowModal(false);
  };

  function showeditModal(id: any, supplier: any, contact: any, index: number) {
    setid(id);
    setValue("edit_supplier", supplier);
    setValue("edit_contact", contact);
    seteditModal(true);
  }

  const onSubmitUpdate = async (data: any) => {
    await axios
      .post(`http://localhost:4000/v1/editsupplier`, { data, id })
      .then(function (response) {
        // console.log(response.data);
        loaddatasupplier();
      });

    toast.success("Data telah diupdate", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    seteditModal(false);
  };

  function showdeleteModal(id: any, index: number) {
    setid(id);
    setSupplier(list_supplier[index].supplier);
    setdelModal(true);
  }

  async function deleteData() {
    await axios
      .post(`http://localhost:4000/v1/deletesupplier`, { id })
      .then(function (response) {
        // console.log(response.data);
        loaddatasupplier();
      });

    toast.success("Data berhasil dihapus", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    setdelModal(false);
  }

  // async function deleteData() {
  //     await axios.post(`https://apitest.lokigudang.com/deletesupplier/${id}`)
  //         .then(function (response) {
  //             // console.log(response.data);
  //             // mutate();
  //         });

  //     toast.success("Data berhasil dihapus", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         pauseOnHover: false,
  //         autoClose: 2000,
  //     });

  //     setdelModal(false)
  // }

  if (!isLoading) {
    data_supplier.map((data_supplier: any, index: number) => {
      return list_supplier.push({
        id: index,
        id_sup: data_supplier.id_sup,
        supplier: data_supplier.supplier,
        contact: data_supplier.contact,
        action: (
          <div className="flex flex-warp gap-4">
            <button
              className="text-blue-500"
              onClick={() =>
                showeditModal(
                  data_supplier.id,
                  data_supplier.supplier,
                  data_supplier.contact,
                  index
                )
              }
            >
              <i className="fi fi-rr-edit text-center text-xl"></i>
            </button>
            <button
              className="text-red-500"
              onClick={() => showdeleteModal(data_supplier.id, index)}
            >
              <i className="fi fi-rr-trash text-center text-xl"></i>
            </button>
          </div>
        ),
      });
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
      supplier: "",
      contact: "",
      edit_supplier: "",
      edit_contact: "",
    },
  });

  const [showModal, setShowModal] = React.useState(false);
  const [delModal, setdelModal] = React.useState(false);
  const [editModal, seteditModal] = React.useState(false);
  const [Supplier, setSupplier] = React.useState(null);
  const [id, setid] = React.useState(null);

  const columns: any = [
    {
      name: "ID Supplier",
      selector: (row: { id_sup: any }) => row.id_sup,
    },
    {
      name: "Supplier",
      selector: (row: { supplier: any }) => row.supplier,
    },
    {
      name: "Contact",
      selector: (row: { contact: any }) => row.contact,
    },
    {
      name: "Action",
      selector: (row: { action: any }) => row.action,
    },
  ];

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = list_supplier.filter((list_supplier: any) => {
    return (
      list_supplier.id_sup
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_supplier.supplier
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase()) ||
      list_supplier.contact
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
        Data Supplier
      </div>

      <div className="flex flex-wrap items-center content-center mb-6">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input
            className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg"
            type="text"
            placeholder="Cari data Supplier"
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
                    Tambah Data Supplier
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Supplier
                      </label>
                      <input
                        className={`${errors.supplier ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Supplier"
                        // ref={req_brand}
                        defaultValue=""
                        {...register("supplier", { required: true })}
                      />
                      {errors.supplier && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Contact
                      </label>
                      <input
                        className={`${errors.contact ? "border-red-500 border-2" : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Contact"
                        // ref={req_brand}
                        defaultValue=""
                        {...register("contact", { required: true })}
                      />
                      {errors.contact && (
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
                      resetField("supplier");
                      resetField("contact");
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
                    Edit Data Supplier
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmitUpdate)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Supplier
                      </label>
                      <input
                        className={`${errors.edit_supplier
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Category"
                        // ref={req_brand}
                        defaultValue=""
                        {...register("edit_supplier", { required: true })}
                      />
                      {errors.edit_supplier && (
                        <div className="mt-1 text-sm italic">
                          This field is required
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">
                        Contact
                      </label>
                      <input
                        className={`${errors.edit_contact
                          ? "border-red-500 border-2"
                          : "border"
                          } h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Category"
                        // ref={req_brand}
                        defaultValue=""
                        {...register("edit_contact", { required: true })}
                      />
                      {errors.edit_contact && (
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
                    Supplier {Supplier} akan dihapus?
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
