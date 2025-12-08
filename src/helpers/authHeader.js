import { WEBAPI_Key } from "../constants/webApiKey.js";

export async function authHeader() {
  return {
    "Appian-API-Key": WEBAPI_Key,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
}
