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

    async function getmore(nextCursor, data) {

        await axios({
            method: http_method,
            url: request_host + request_uri,
            data: {
                createSince: params.createSince,
                createTo: params.createTo,
                shopIdList: [params.shopIdList],
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
                    }, 1000);
                } else {
                    res.status(200).json(combined)
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
            shopIdList: [params.shopIdList],
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
                }, 1000);
            } else {
                res.status(200).json(content)
            }

        })
        .catch(function (error) {
            res.status(200).json(error)
        });
}
