import { useRef, useEffect, useState } from "react";
// import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/router";
import axios from "axios";

export default function Print_so() {
  const router = useRouter();

  const [isLoading, setisLoading]: any = useState(true);
  const [dataProduk, setdataprint]: any = useState([]);

  // const componentRef: any = useRef(null);
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  async function print_Stockopname(id_ware: any) {
    await axios({
      method: "POST",
      url: `http://localhost:4000/v1/print_stockopname`,
      data: {
        id_ware: id_ware,
      },
    })
      .then(function (response) {
        setdataprint(response.data.result);
        console.log(response.data.result);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!router.isReady) return;
    const id_ware: any = router.query.slug;
    print_Stockopname(id_ware);
  }, [router.isReady]);

  const list_produk: any = [];

  return (
    <div className="flex flex-row">
      <div className="basis-full">
        <div className="my-5 mx-5 font-bold">Stock Opname</div>
        <table className="border-2 border-black bg-slate-400 my-5 mx-5 w-full">
          <thead className="text-center">
            <tr>
              <td className="font-bold border-2 border-black w-[2%]">No.</td>
              <td className="font-bold border-2 border-black w-[7%]">BRAND</td>
              <td className="font-bold border-2 border-black w-[7%]">
                ID PRODUK
              </td>
              <td className="font-bold border-2 border-black w-[40%]">
                PRODUK
              </td>
              <td className="font-bold border-2 border-black w-[30%]">SIZE</td>
              <td className="font-bold border-2 border-black w-[5%]">QTY</td>
            </tr>
          </thead>
          {dataProduk.map((dataProduk: any, index: any) => (
            <tbody className="bg-white">
              <tr className="text-center" key={index}>
                <td
                  className="font-bold border-2 border-gray-500 w-[2%]"
                  rowSpan={3}
                >
                  {" "}
                  {index + 1}
                </td>
                <td
                  className="font-bold border-2 border-gray-500 w-[7%]"
                  rowSpan={3}
                >
                  {dataProduk.brand[0].brand}
                </td>
                <td
                  className="font-bold border-2 border-gray-500 w-[7%]"
                  rowSpan={3}
                >
                  {dataProduk.id_produk}
                </td>
                <td
                  className="font-bold border-2 border-gray-500 w-[40%]"
                  rowSpan={3}
                >
                  {dataProduk.produk}
                </td>
                <td className="font-bold border-2 border-gray-500 w-[30%]">
                  <div>
                    <td className="text-center flex flex-row">
                      {(function (rows: any, i, len) {
                        while (++i <= dataProduk.variation.length) {
                          rows.push(
                            <td className="font-bold border border-gray-500 grow bg-slate-300">
                              {dataProduk.variation[i - 1].size}
                            </td>
                          );
                        }
                        return rows;
                      })([], 0, index + 1)}
                    </td>
                    <td className="text-center flex flex-row">
                      {(function (rows: any, i, len) {
                        while (++i <= dataProduk.variation.length) {
                          if (dataProduk.variation[i - 1].qty > 0) {
                            rows.push(
                              <td className="font-bold border border-gray-500 bg-yellow-200 grow">
                                {dataProduk.variation[i - 1].qty}
                              </td>
                            );
                          } else {
                            rows.push(
                              <td className="font-bold border border-gray-500 bg-red-200 grow">
                                {dataProduk.variation[i - 1].qty}
                              </td>
                            );
                          }
                        }
                        return rows;
                      })([], 0, index + 1)}
                    </td>
                    <td className="text-center flex flex-row text-white">
                      {(function (rows: any, i, len) {
                        while (++i <= dataProduk.variation.length) {
                          rows.push(
                            <td className="font-bold border border-gray-500 grow text-white">
                              {dataProduk.variation[i - 1].size}
                            </td>
                          );
                        }
                        return rows;
                      })([], 0, index + 1)}
                    </td>
                  </div>
                </td>
                <td className="font-bold border-2 border-gray-500 w-[5%]">
                  <td className="text-center flex flex-row">
                    <td className="font-bold border border-gray-500  bg-slate-300 grow">
                      TOTAL
                    </td>
                  </td>
                  <td className="text-center flex flex-row">
                    <td className="font-bold border border-gray-500  bg-lime-200 grow">
                      {dataProduk.hitung_total}
                    </td>
                  </td>
                  <td className="text-center flex flex-row text-white">
                    <td className="font-bold border border-gray-500 grow">0</td>
                  </td>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
