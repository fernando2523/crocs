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

    // pemganggilan details
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let combinedDetail = [];
    const data = [params.orderId];
    console.log(data);

    const result = data.map((item) => Object.values(item)[0]);
    const midPoint = 100;
    for (let i = 0; i < result.length; i += midPoint) {
        const dataids = result.slice(i, i + midPoint);
        axios({
            method: "POST",
            url: request_host + "/openapi/v3/oms/order/item/batch-get",
            headers: {
                "X-Advai-Country": "ID",
                Authorization: token,
                "Content-Type": "application/json",
            },
            data: {
                orderIds: dataids,
            },
        })
            .then((response) => {
                console.log(response.data.data);

                combinedDetail = response.data.data;
            })
            .catch((error) => {
                res.status(500).json(error);
            });
        await delay(1000);
    }


    res.status(200).json({
        data: combinedDetail,
    });
}
