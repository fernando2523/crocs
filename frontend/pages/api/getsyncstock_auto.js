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
    // res.status(200).json(token)
    // console.log("params", params);
    console.log(JSON.stringify(params, null, 2));

    try {
        const results = [];

        for (const entry of params.groupedStockList) {
            const response = await axios({
                method: http_method,
                url: request_host + request_uri,
                data: {
                    stockList: entry.stockList,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'X-Advai-Country': 'ID',
                    'Authorization': token
                },
            });
            results.push({ warehouseId: entry.warehouseId, response: response.data });
        }

        res.status(200).json({ status: "success", results });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}
