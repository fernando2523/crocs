import Image from "next/image";

function TableRows({
  rowsData,
  deleteTableRows,
  handleChangeharga,
  handleChange2harga,
  handleChange,
  handleChange2,
  editTools,
  editToolsButton,
  editButton,
}) {
  return rowsData.map((data, index) => {
    const { produk, size, harga, discount_item, qty, subtotal, img } = data;
    return (
      <tr key={index}>
        <td className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-[70px] w-[70px] rounded-lg shadow mr-2">
              <Image
                className="m-auto max-w-[100%] rounded-lg max-h-[100%]"
                src={`https://lokigudang.com/apiupload/${img}`}
                alt="product-1"
                height="500"
                width="500"
                priority
              />
            </div>
            {produk}
          </div>
        </td>
        <td className="py-3">{size}</td>
        <td className="py-3 text-start">{qty}</td>
        <td className="py-3">
          <div className="flex ">
            <div>Rp</div>
            <div className="grow">
              <input
                className="w-full focus:outline-none"
                value={harga}
                onChange={(e) => handleChangeharga(index, e)}
                onBlur={(e) => handleChange2harga(index, e)}
              />
            </div>
          </div>
        </td>
        <td className="py-3">
          <div className="flex ">
            <div>Rp</div>
            <div className="grow">
              <input
                className="w-full focus:outline-none"
                value={discount_item}
                onChange={(e) => handleChange(index, e)}
                onBlur={(e) => handleChange2(index, e)}
              />
            </div>
          </div>
        </td>
        <td className="py-3 text-end">Rp{subtotal}</td>
        <td className="py-3 px-3 text-end w-[7%]">
          <div className="flex flex-wrap items-center justify-end relative">
            <div
              ref={(element) => {
                editTools.current[index] = element;
              }}
              className="hidden absolute"
            >
              <div className="w-auto bg-white border shadow-lg  -left-auto mr-7 rounded-lg flex items-center gap-2 justify-center p-3">
                {/* <button
                  className="border w-20 p-1 rounded border-green-600 text-green-600"
                  onClick={() => handleChange(index)}
                >
                  Diskon
                </button> */}

                <button className="border w-20 p-1 rounded border-orange-400 text-orange-400">
                  Edit
                </button>

                <button
                  className="border p-1 w-20 rounded border-red-600 text-red-600"
                  onClick={() => deleteTableRows(index)}
                >
                  Hapus
                </button>
              </div>
            </div>
            <button
              ref={(element) => {
                editButton.current[index] = element;
              }}
              className=""
              onClick={() => editToolsButton(index)}
            >
              <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  });
}
export default TableRows;
