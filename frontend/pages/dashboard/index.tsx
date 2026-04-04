import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from 'date-fns'

export default function Home() {
  // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

  const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy')
  );

  return (
    <div className="p-5">
      <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">Dashboard</div>

      <div className="grid grid-cols-2 items-center content-center mb-7">
        <div className="grow font-normal italic text-sm">Menampilkan Data : {String(date)} </div>
        <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end">
          <Flatpickr
            className="text-gray-500 h-[50px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
            value={date}
            placeholder="Select Date Range"
            options={{
              mode: "range",
              dateFormat: "d/m/Y",
              enableTime: false,
              // disable: [
              //   function (date) {
              //     return !(date.getDate() % 8);
              //   }
              // ]
              onClose: function (selectedDates, dateStr, instance) {
                setDate(dateStr);
              },
            }}
          />

          <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-4"></i>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 grow h-auto content-start">
        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

          <div className="grid grid-rows-3 gap-2 items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/sell.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
              </div>
            </div>

            <div className="font-medium text-base text-gray-400">
              Gross Sales
            </div>

            <div className="font-bold text-xl text-black">
              Rp 2.345.312
            </div>
          </div>

        </a>

        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

          <div className="grid grid-rows-3 gap-2 items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/expenses.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
              </div>
            </div>

            <div className="font-medium text-base text-gray-400">
              Expenses
            </div>

            <div className="font-bold text-xl text-black">
              Rp 2.345.312
            </div>
          </div>

        </a>

        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

          <div className="grid grid-rows-3 gap-2 items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/money-bag.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
              </div>
            </div>

            <div className="font-medium text-base text-gray-400">
              Net Sales
            </div>

            <div className="font-bold text-xl text-black">
              Rp 2.345.312
            </div>
          </div>

        </a>

        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

          <div className="grid grid-rows-3 gap-2 items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/shopping-cart.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
              </div>
            </div>

            <div className="font-medium text-base text-gray-400">
              Transactions
            </div>

            <div className="font-bold text-xl text-black">
              99
            </div>
          </div>

        </a>

        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group col-span-2">
          <div className="grid grid-rows-3 gap-2 items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/warehouse.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
              </div>
            </div>

            <div className="font-medium text-base text-gray-400">
              Products Stock Sold
            </div>

            <div className="font-bold text-xl text-black">
              102
            </div>
          </div>
        </a>

        <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group col-span-2">
          <div className="grid grid-rows-3 gap-2 items-center">
            <div className="flex content-center items-center justify-start">
              <div className="grow">
                <Image
                  className="w-[36px] h-[36px] max-w-full max-h-full"
                  src="/delivery-box.png"
                  alt="Picture of the author"
                  width={100}
                  height={100}
                />
              </div>

              <div>
                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
              </div>
            </div>

            <div className="font-medium text-base text-gray-400">
              Product External Sold
            </div>

            <div className="font-bold text-xl text-black">
              87
            </div>
          </div>
        </a>

      </div>

    </div>
  );
}
