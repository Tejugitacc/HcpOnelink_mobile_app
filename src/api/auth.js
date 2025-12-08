// app/src/api/auth.js
import { appianloginURL } from "../constants/apiConstants.js";
import { authHeader } from '../helpers/authHeader.js';

export async function loginToAppian(username, password) {
  const headers = await authHeader();
  if (!username || !password) {
    return { success: false, message: "Missing username or password" };
  }
console.log("Logging in to Appian with username:", username,password);
console.log("headers:",headers);
  try {
    const response = await fetch(appianloginURL, {
      method: "POST",
      headers,
      body: JSON.stringify({ username, password }),
    });

    const text = await response.text();

    // Try JSON parse
    try {
      return text ? JSON.parse(text) : { success: false, message: "Empty response from server" };
    } catch (e) {
      return {
        success: false,
        message: "Appian returned HTML, not JSON (likely login page or redirect)",
        raw: text,
      };
    }

  } catch (err) {
    console.log("Axios Login Error:", err?.response?.data || err.message);

    if (err.response && err.response.data) {
      return err.response.data;
    }

    return { success: false, message: "Login failed. Check network/Appian." };
  }
}

