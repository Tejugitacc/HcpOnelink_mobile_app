// app/src/api/auth.js
import axios from "axios";
import CookieManager from 'react-native-cookies';
import { appianloginURL } from '../constants/apiConstants.js';

axios.defaults.withCredentials = true;


//NODEJS API CALL VERSION
// export async function loginToAppian(username, password) {
//   const url = backendURL + '/api/auth/login';

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username, password })
//   });

//   if (response.status === 401) {
//     return { success: false, message: 'Invalid username or password' };
//   }

//   const data = await response.json();
//   return data;
// }

// DIRECT APP API CALL VERSION
export async function loginToAppian(username, password) {
  console.log("loginToAppian called with", username);

  if (!username || !password) {
    return { success: false, message: "Missing username/password" };
  }

  try {
    const base64 = btoa(`${username}:${password}`);

    // const response = await fetch(appianloginURL, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Basic ${base64}`,
    //     Accept: "application/json",
    //   },
    //   body: JSON.stringify({ username, password }),
    // });

    const response = await axios.post(
       appianloginURL,
      { username, password },
      { withCredentials: true }
    );

    console.log("Axios headers:", response.headers);

    // Cookies returned by Appian
    const setCookie = response.headers['set-cookie'];
    console.log("Set-Cookie from Appian:", setCookie);

    if (setCookie) {
      await CookieManager.setFromResponse(APP_URL, setCookie);
      console.log("Cookies saved successfully");
    }

    const text = await response.text();
    // Capture session cookie
    // const cookies = response.headers.map["set-cookie"];

    console.log("RAW Appian Response:", text);
    console.log("RAW Appian cookies:", response.headers);
    // Try JSON parse
    try {
      const json = JSON.parse(text);
      return { json, cookies };
    } catch (e) {
      console.log("JSON PARSE FAILED!");
      return { success: false, raw: text, message: "Invalid JSON returned from Appian" };
    }

  } catch (err) {
    console.error("Login error", err);
    return { success: false, message: err.message };
  }
}



