import getToken from "../../components/gettoken";
import axios from "axios";

export default async function handler(req, res) {
  var request_host = "https://api.ginee.com";
  var request_uri = req.body.request_uri;
  var http_method = req.method;
  var params = req.body.params;
  var access_key = "24149de32ca192a5";
  var secret_key = "d06535d93ed71299";

  var token = await getToken(http_method, request_uri, access_key, secret_key);
  var token2 = await getToken(
    http_method,
    "/openapi/v3/oms/order/item/batch-get",
    access_key,
    secret_key
  );

  const shopIdList = params.shopIdList === 'all' ? null : [params.shopIdList];
  // console.log("params", params);

  await axios({
    method: http_method,
    url: request_host + request_uri,
    data: {
      createSince: params.createSince,
      createTo: params.createTo,
      orderStatus: params.status,
      size: 100,
      nextCursor: params.nextCursor,
      // nextCursor: shopIdList,
    },
    headers: {
      "Content-Type": "application/json",
      "X-Advai-Country": "ID",
      Authorization: token,
    },
  })
    .then(function (response) {
      var more = response.data.data.more;
      var nextCursor = response.data.data.nextCursor;
      var content = response.data.data.content;

      getDetailsOrder(content, more, nextCursor);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });

  // pemganggilan details
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getDetailsOrder(data, more, next) {
    let combinedDetail = [];
    let dataAwal = [];

    const result = data.map((item) => Object.values(item)[0]);
    const midPoint = 100;
    for (let i = 0; i < result.length; i += midPoint) {
      const dataids = result.slice(i, i + midPoint);
      axios({
        method: "POST",
        url: request_host + "/openapi/v3/oms/order/item/batch-get",
        headers: {
          "X-Advai-Country": "ID",
          Authorization: token2,
          "Content-Type": "application/json",
        },
        data: {
          orderIds: dataids,
        },
      })
        .then((response) => {
          combinedDetail = response.data.data;

          // combinedDetail = response.data.data;
          response.data.data.forEach((items) => {

            if (items.externalOrderStatus === params.tabs) {
              dataAwal.push(items)
            }
          });
          console.log(dataAwal.length);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
      await delay(1000);
    }
    console.log(combinedDetail.length);


    res.status(200).json({
      data_order: data,
      data_details_order: combinedDetail,
      more: more,
      next: next,
    });
  }
}
