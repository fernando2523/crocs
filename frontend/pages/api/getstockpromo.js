import { log } from "node:console";
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

    // Group rincian strings by warehouseId from frontend params
    const skuMap = {};
    params.combined.forEach(({ id, rincian }) => {
        if (!skuMap[id]) skuMap[id] = [];
        skuMap[id].push(rincian);
    });

    const allInventory = [];

    for (const [warehouseId, masterSkuList] of Object.entries(skuMap)) {
        try {
            const response = await axios({
                method: http_method,
                url: request_host + request_uri,
                data: {
                    page: 0,
                    size: 200,
                    warehouseId,
                    masterSkuList
                },
                headers: {
                    'Content-Type': 'application/json',
                    'X-Advai-Country': 'ID',
                    'Authorization': token
                },
            });
            if (response.data?.data?.content) {
                allInventory.push({
                    content: response.data.data.content
                        .filter(item => {
                            const promo = item.warehouseInventory?.promotionStock ?? 0;
                            const avail = item.warehouseInventory?.availableStock ?? 0;
                            return promo > 0 || avail > 0;
                        })
                        .map(item => ({
                            masterSku: item.masterVariation?.masterSku ? item.masterVariation.masterSku.slice(0, 10) : null,
                            size: item.masterVariation?.masterSku ? item.masterVariation.masterSku.split(".")[1] : null,
                            availableStock: item.warehouseInventory?.availableStock ?? null,
                            promotionStock: item.warehouseInventory?.promotionStock ?? null
                        }))
                });
            }
        } catch (error) {
            console.error(`Error for warehouseId ${warehouseId}:`, error.response?.data || error.message);
        }
    }

    // Merge content across warehouses by size
    const sizeMap = {};
    allInventory.forEach(({ content }) => {
        content.forEach(item => {
            if (!sizeMap[item.size]) sizeMap[item.size] = [];
            sizeMap[item.size].push(item);
        });
    });

    const mergedContent = Object.values(sizeMap).map(items => {
        // If any item has promotion stock, return that item
        if (items.some(i => i.promotionStock > 0)) {
            return items.find(i => i.promotionStock > 0);
        }
        // Otherwise, return first item with its original availableStock
        return {
            masterSku: items[0].masterSku,
            size: items[0].size,
            availableStock: items[0].availableStock,
            promotionStock: 0
        };
    });

    res.status(200).json(mergedContent);
}
