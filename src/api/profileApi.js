// app/src/api/auth.js
import { viewProfileURL } from '../constants/apiConstants.js';
import { authHeader } from '../constants/apiHeader.js';

export async function fetchProfile(userId) {

  // https://dsi-hcp-dev.appiancloud.com/suite/webapi/viewHCPProfile?userId=
  const url = viewProfileURL + '?userId=' + userId;
  const response = await fetch(url, {
    method: 'GET',
    headers: await authHeader(),
  });

  const text = await response.text();
  console.log("RAW Appian profile Body:", text);
  if (response.status === 401) {
    return { success: false, message: 'Invalid username or password' };
  }

  // Try JSON parse
  try {
    return text ? JSON.parse(text) : { success: false, message: "Empty response from server" };
  } catch (e) {
    return {
      success: false,
      message: e.message || "Failed to parse response",
      raw: text,
    };
  }

}
