import { appianloginURL } from "../constants/apiConstants.js";

export async function loginToAppian(username, password) {
  if (!username || !password) {
    return { success: false, message: "Missing username or password" };
  }

  // Basic auth header
  const basicAuth = "Basic " + btoa(`${username}:${password}`);

  try {
    const response = await fetch(appianloginURL, {
      method: "POST",
      headers: {
        // "Appian-API-Key": WEBAPI_Key,
        "Authorization": basicAuth,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const text = await response.text();

    try {
      return text ? JSON.parse(text) : { success: false, message: "Empty response from server" };
    } catch (e) {
      return {
        success: false,
        message: "Failed to parse JSON",
        raw: text,
      };
    }

  } catch (err) {
    return { success: false, message: err.message || "Network error" };
  }
}
