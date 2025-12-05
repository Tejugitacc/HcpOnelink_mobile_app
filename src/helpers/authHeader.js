import { WEBAPI_Key as API_KEY } from "../constants/webApiKey.js";

export async function authHeader() {

  return {
    "Appian-API-Key": API_KEY,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
}
