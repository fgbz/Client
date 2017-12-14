define(['aes', 'sha256'], function () {
    'use strict';

    var key = 'Do not go gentle into that good night.';
    var sKey = key.substr(0, 16);
	    sKey = CryptoJS.enc.Utf8.parse(sKey);
    var iv = sKey;    

    var crypto_sha = require('sha256');
    var crypto_aes = require('aes');

    var getSHA256 = function (val) {

        var pwd = crypto_sha.SHA256(val).toString();

        return pwd;
    };

    var encrypt = function (val) {

        var encrypted = crypto_aes.AES.encrypt(val, key);

        return encrypted;
    };

    var decrypt = function (val) {
        var decrypted = undefined;

        try {
            decrypted = crypto_aes.AES.decrypt(val, key);
        } catch (e) {
            console.warn(e);
        }

        return decrypted.toString(crypto_aes.enc.Utf8);
    };
    var decrypt2 = function (val) {
        var decrypted = undefined;

        try {
            decrypted = decrypted = crypto_aes.AES.decrypt(val, sKey, {
	        iv: iv, mode: crypto_aes.mode.CBC, padding: crypto_aes.pad.Pkcs7
	    });;
        } catch (e) {
            console.warn(e);
        }

        return decrypted.toString(crypto_aes.enc.Utf8);
    };

    return {
        getSHA256: getSHA256,
        encrypt: encrypt,
        decrypt: decrypt,
        decrypt2: decrypt2
    };
});