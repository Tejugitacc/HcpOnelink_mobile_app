import CryptoJS from "crypto-js";

/**
 * IMPORTANT:
 * - Never hardcode keys in real apps
 * - Use env variables or backend-provided keys
 */
const SECRET_KEY = "e32307d4e37fcf6cde104510fc58db4772420804069e1d673dc4c70bd670eca2"; // 32 chars (256-bit)

export const encryptData = (data) => {
  console.log("Encrypting data:", data);
  const plaintext =
    typeof data === "object" ? JSON.stringify(data) : String(data);
  let ciphertext;
  console.log("plaintext:", plaintext);
  try {
    ciphertext = CryptoJS.AES.encrypt(
      plaintext,
      SECRET_KEY
    ).toString();
  } catch (error) {
    console.error("Encryption error:", error);
  }


  console.log("ciphertext:", ciphertext);
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
