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
    await axios({
        method: http_method,
        url: request_host + request_uri,
        data: {
            page: 0,
            size: 200
        },
        headers: {
            'Content-Type': 'application/json',
            'X-Advai-Country': 'ID',
            'Authorization': token
        },
    })
        .then(function (response) {
            res.status(200).json(response.data.data.content)
        })
        .catch(function (error) {
            res.status(200).json(error)
        });
}
