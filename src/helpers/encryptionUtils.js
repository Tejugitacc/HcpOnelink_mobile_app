import CryptoJS from 'react-native-crypto-js';

// ⚠️ DO NOT hardcode in production
const SECRET_KEY = CryptoJS.enc.Hex.parse(
  'e32307d4e37fcf6cde104510fc58db4772420804069e1d673dc4c70bd670eca2'
);

// Fixed IV (for demo). In real apps, store IV securely.
const IV = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

export const encryptData = (data) => {
  const plaintext =
    typeof data === 'object' ? JSON.stringify(data) : String(data);
  let encrypted = null;
  console.log("Plaintext to encrypt:", plaintext);
  try {
    encrypted = CryptoJS.AES.encrypt(plaintext, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  } catch (error) {
    console.error("Encryption error:", error);
  }

  console.log("Plaintext to encrypt:", encrypted);
  return encrypted.toString();
};

export const decryptData = (ciphertext) => {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(plaintext);
  } catch {
    return plaintext;
  }
};
