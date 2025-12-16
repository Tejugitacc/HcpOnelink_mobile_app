import CryptoJS from "crypto-js";

/**
 * IMPORTANT:
 * - Never hardcode keys in real apps
 * - Use env variables or backend-provided keys
 */
const SECRET_KEY = "12345678901234567890123456789012"; // 32 chars (256-bit)

export const encryptData = (data) => {
  const plaintext =
    typeof data === "object" ? JSON.stringify(data) : String(data);

  const ciphertext = CryptoJS.AES.encrypt(
    plaintext,
    SECRET_KEY
  ).toString();

  return ciphertext;
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(plaintext);
  } catch {
    return plaintext;
  }
};
