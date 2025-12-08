import { WEBAPI_Key } from "../constants/webApiKey.js";

export async function authHeader() {
  console.log("WEBAPI_Key used in authHeader:", WEBAPI_Key);

   console.log("RAW VALUE:", JSON.stringify(WEBAPI_Key));
  return {
    "Appian-API-Key": WEBAPI_Key,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
}
