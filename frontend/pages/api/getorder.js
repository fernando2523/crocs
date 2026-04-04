import getToken from "../../components/gettoken";
import axios from "axios";


export default async function handler(req, res) {
  var request_host = 'https://api.ginee.com';
  var request_uri = req.body.request_uri;
  var http_method = req.method;
  var params = req.body.params;
  var access_key = '24149de32ca192a5';
  var secret_key = 'd06535d93ed71299';

  var token = await getToken(http_method, request_uri, access_key, secret_key)
  var token2 = await getToken(http_method, '/openapi/v3/oms/order/item/batch-get', access_key, secret_key)

  async function getmore(nextCursor, data) {

    await axios({
      method: http_method,
      url: request_host + request_uri,
      data: {
        createSince: params.createSince,
        createTo: params.createTo,
        // shopIdList: [params.shopIdList],
        size: 100,
        nextCursor: nextCursor,
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Advai-Country': 'ID',
        'Authorization': token
      },
    })
      .then(function (response) {
        var more = response.data.data.more;
        var nextCursor = response.data.data.nextCursor;
        var content = response.data.data.content;
        var combined = data.concat(content)
        if (more === true) {
          setTimeout(function () {
            getmore(nextCursor, combined);
          }, 100);
        } else {
          // call 2
          getDetailsOrder(combined, token2)
        }

      })
      .catch(function (error) {
        res.status(200).json(error)
      });
  }

  await axios({
    method: http_method,
    url: request_host + request_uri,
    data: {
      createSince: params.createSince,
      createTo: params.createTo,
      // shopIdList: [params.shopIdList],
      size: 100,
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Advai-Country': 'ID',
      'Authorization': token
    },
  })
    .then(function (response) {
      var more = response.data.data.more;
      var nextCursor = response.data.data.nextCursor;
      var content = response.data.data.content;
      if (more === true) {
        setTimeout(function () {
          getmore(nextCursor, content);
        }, 100);
      } else {
        // call 1
        getDetailsOrder(content, token2)
      }

    })
    .catch(function (error) {
      res.status(200).json(error)
    });
  // pemganggilan details
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getDetailsOrder(data) {
    let combinedDetail = [];
    let hitungpaid = [];
    let hitungproses = [];
    let hitungdikirim = [];
    let totalamount_paid = 0;
    let totalamount_proses = 0;
    let totalamount_dikirim = 0;
    let qty_paid = 0;
    let qty_proses = 0;
    let qty_dikirim = 0;


    const result = data.map(item => Object.values(item)[0]);
    const midPoint = 100
    for (let i = 0; i < result.length; i += midPoint) {
      const dataids = result.slice(i, i + midPoint)
      axios({
        method: "POST",
        url: request_host + '/openapi/v3/oms/order/item/batch-get',
        headers: {
          'X-Advai-Country': 'ID',
          'Authorization': token2,
          'Content-Type': 'application/json',
        },
        data: {
          orderIds: dataids,
        },
      })
        .then((response) => {
          response.data.data.forEach((item) => {
            if (item.externalOrderStatus === params.status) {
              if (params.query === "all") {
                combinedDetail = combinedDetail.concat(item);
              } else if (new RegExp(params.query, "i").test(item.externalOrderId)) {
                combinedDetail = combinedDetail.concat(item);
              }
            }

            if (item.externalOrderStatus === "READY_TO_SHIP") {
              hitungpaid.push(item); // Memasukkan item ke hitungpaid
              totalamount_paid += item.totalAmount || 0;
              if (item.items && Array.isArray(item.items)) {
                item.items.forEach(i => {
                  if (typeof i.quantity === 'number') {
                    qty_paid += i.quantity; // Accumulate quantity for READY_TO_SHIP
                  }
                });
              }
            }
            if (item.externalOrderStatus === "PROCESSED") {
              hitungproses.push(item); // Memasukkan item ke hitungproses
              totalamount_proses += item.totalAmount || 0;
              if (item.items && Array.isArray(item.items)) {
                item.items.forEach(i => {
                  if (typeof i.quantity === 'number') {
                    qty_proses += i.quantity; // Accumulate quantity for PROCESSED
                  }
                });
              }
            }
            if (item.externalOrderStatus === "SHIPPED") {
              hitungdikirim.push(item); // Memasukkan item ke hitungproses
              totalamount_dikirim += item.totalAmount || 0;
              if (item.items && Array.isArray(item.items)) {
                item.items.forEach(i => {
                  if (typeof i.quantity === 'number') {
                    qty_dikirim += i.quantity; // Accumulate quantity for PROCESSED
                  }
                });
              }
            }
          });
        })
        .catch((error) => {
          res.status(500).json(error);
        })
      await delay(1000);
    }

    res.status(200).json({
      data_order: data,
      data_details_order: combinedDetail,
      hitungpaid: hitungpaid.length,
      hitungproses: hitungproses.length,
      hitungdikirim: hitungdikirim.length,
      totalamount: parseInt(totalamount_paid) + parseInt(totalamount_proses) + parseInt(totalamount_dikirim),
      totalqty: parseInt(qty_paid) + parseInt(qty_proses) + parseInt(qty_dikirim),
    });
  }
}


