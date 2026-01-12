// import { WEBAPI_Key } from "../constants/webApiKey.js";

// export async function authHeader() {
//   return {
//     "Appian-API-Key": WEBAPI_Key,
//     "Accept": "application/json",
//     "Content-Type": "application/json",
//   };
// }

import { getOAuthToken } from "./oauthToken";

export async function authHeader() {
   console.log("OAuth headers:",);
  const token = await getOAuthToken();

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

