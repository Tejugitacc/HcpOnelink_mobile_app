// import api from "./axios";


// export async function loginToAppian(username, password) {
//   if (!username || !password) {
//     return { success: false, message: "Missing credentials" };
//   }

//   try {
//     // 1️⃣ Create Appian session
//     const formData = new URLSearchParams();
//     formData.append("un", username);
//     formData.append("pw", password);

//     await api.post(
//       "/suite/portal/login.jsp",
//       formData.toString(),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         withCredentials: true,
//       }
//     );

//     // 2️⃣ Verify login via secured Web API
//     const verify = await api.post("/suite/webapi/mobileuserlogin");

//     console.log("Login verification data:", verify.data);

//     return {
//       success: true,
//       ...verify.data, // userId, firstname, lastname, etc
//     };

//   } catch (error) {
//     console.log("Login error:", error?.response?.status);

//     if (error?.response?.status === 401) {
//       return { success: false, message: "Invalid username or password" };
//     }

//     return {
//       success: false,
//       message: "Login failed",
//     };
//   }
// }


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
        "Authorization": basicAuth,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const text = await response.text();

    try {
      console.log("Appian login response text:", text);
      return text ? JSON.parse(text) : { success: false, message: "Empty response from server" };
    } catch (e) {
      console.log("Failed to parse JSON:", e);
      return {
        success: false,
        message: "Failed to parse JSON",
        raw: text,
      };
    }

  } catch (err) {
    console.log("Failed to parse JSON:", err);
    return { success: false, message: err.message || "Network error" };
  }
}