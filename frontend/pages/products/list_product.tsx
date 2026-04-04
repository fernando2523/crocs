import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";




export default function ListProduk() {
    // const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const columns: any = [
        {
            name: 'Image',
            selector: (row: { img: any }) => row.img,
            width: "10%",
        },
        {
            name: 'Produk',
            selector: (row: { produk: any }) => row.produk,
            width: "35%",
        },
        {
            name: 'Size',
            selector: (row: { stok: any }) => row.stok,
            width: "40%",
        },
        {
            name: 'Action',
            selector: (row: { action: any }) => row.action,
            width: "10%",
        },

    ];

    const data: any = [];

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (index === openSize) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

    const size: any = [];

    for (let index = 0; index < 10; index++) {
        size.push(
            <div key={index} className="py-1 px-2 rounded border border-gray-800 text-xs">{index + 34}=10</div>
        )

    }

    for (let index = 0; index < 100; index++) {
        data.push(
            {
                id: index,
                img: (
                    <div className="flex flex-wrap justify-center gap-1">
                        <Image
                            className="m-auto max-w-[90px] rounded-lg max-h-[90px]"
                            src="/produk.jpg"
                            alt="product-1"
                            height="500"
                            width="500"
                            priority
                        />
                    </div>
                ),
                produk: (
                    <div className="flex flex-col h-[150px] w-[300px] items-start justify-center gap-2">
                        <div className="text-base">Adidas Broomfield Green</div>
                        <div className="text-xs">Adidas | #22736289</div>
                        <div>Rp550.000</div>
                    </div>
                ),
                stok: (
                    <div className="flex flex-col h-[150px] w-[100%] items-center justify-center gap-2">
                        {/* <div className="grid grid-cols-4 auto-cols-auto gap-2 justify-center items-center content-center w-[80%]"> */}
                        <div className="flex flex-wrap gap-2 justify-center items-center content-center w-[80%]">
                            {size}
                        </div>
                        <div>Total Stock = {index + 210}</div>
                    </div>
                ),
                action: (
                    <div className="flex flex-warp gap-4">
                        <button className="text-blue-500">
                            <i className="fi fi-rr-edit text-center text-xl"></i>
                        </button>
                        <button className="text-red-500">
                            <i className="fi fi-rr-trash text-center text-xl"></i>
                        </button>
                    </div>
                ),
            },
        )
    }

    const CustomMaterialPagination = ({ rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage }: any) => (
        <div>
            asd
        </div>
    );

    const handleChange = ({ selectedRows }: any) => {
        // You can set state or dispatch with something like Redux so we can use the retrieved data
        console.log('Selected Rows: ', selectedRows);
    };

    const [currentRow, setCurrentRow] = useState(null);

    const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
        return (
            <>
                <p>{data.produk}</p>
                <p>{data.harga}</p>
                <p>{data.sku}</p>
            </>
        );
    };
    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Daftar Produk
            </div>

            <DataTable
                className="h-fit scrollbar-none"
                columns={columns}
                data={data}
                selectableRows
                onSelectedRowsChange={handleChange}
                // expandableRows
                // expandableRowExpanded={(row) => (row === currentRow)}
                // expandOnRowClicked
                // onRowClicked={(row) => toogleActive(row)}
                // onRowExpandToggled={(bool, row) => setCurrentRow(row)}
                expandableRowsComponent={ExpandedComponent}
                defaultSortFieldId={1}
            // pagination
            // paginationComponent={CustomMaterialPagination}
            // fixedHeader={true}
            />

        </>
    );
}
