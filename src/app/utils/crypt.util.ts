import { environment } from '@env/environment';
import * as CryptoJS from 'crypto-js';
//import CryptoJS from "crypto-js";

export class CryptUtil {

    constructor() {
    }

    public static cryptData(data: Object) {
        let _key = CryptoJS.enc.Utf8.parse(environment.SECRET_KEY_CRYPTO);
        let _iv = CryptoJS.enc.Utf8.parse(environment.SECRET_KEY_CRYPTO);

        const dataEncrypt = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            _key,
            {
                keySize: 16,
                iv: _iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        return dataEncrypt.toString();
    }

    public static decryptData(data: string) {
        const keyBytes = CryptoJS.enc.Utf8.parse(environment.SECRET_KEY_CRYPTO);
        const dataDecrypt = CryptoJS.AES.decrypt(data, keyBytes, {
            iv: keyBytes,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return JSON.parse(dataDecrypt.toString(CryptoJS.enc.Utf8));
    }
}