"use client";
import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Print_so() {
  const params: any = useParams();
  const id_ware = params.slug[0];

  const [isLoading, setisLoading]: any = useState(true);
  const [dataProduk, setdataprint]: any = useState([]);

  // const componentRef: any = useRef(null);
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  async function print_Stockopname() {
    await axios({
      method: "POST",
      url: `http://localhost:4000/v1/print_Stockopname`,
      data: {
        id_cust: id_ware,
      },
    })
      .then(function (response) {
        setdataprint(response.data.result);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    print_Stockopname();
  }, []);

  return <div className="p-5">test</div>;
}
