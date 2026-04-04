import CryptoJS  from 'crypto-js';

function getToken(http_method, request_uri, access_key, secret_key) {
  var signatureHeaderInfo = http_method + "$" + request_uri + "$";
  var hash = CryptoJS.HmacSHA256(signatureHeaderInfo, secret_key);
  var signature = access_key+":"+CryptoJS.enc.Base64.stringify(hash);

  return signature;
}

export default getToken;