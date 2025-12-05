// app/src/api/auth.js
import { appianloginURL } from "../constants/apiConstants.js";


export async function loginToAppian(username, password) {

  if (!username || !password) {
    return { success: false, message: "Missing username or password" };
  }

  try {
    const base64 = btoa(`${username}:${password}`);
    const response = await fetch(appianloginURL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    });


    const text = await response.text();


    // Try JSON parse
    try {
      return  text ? JSON.parse(text) : { success: false, message: "Empty response from server" };
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

