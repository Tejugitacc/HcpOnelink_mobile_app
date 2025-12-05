// app/src/api/auth.js
import { getEngagementsURL } from '../constants/apiConstants';
import { authHeader } from '../constants/apiHeader';

export async function fetchHcpAllEngagements(userId) {

  const url = getEngagementsURL + '?userId=' + userId;
    const headers = await authHeader();
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const text = await response.text();

  console.log("RAW INVOices expenses:", text);
  if (response.status === 401) {
    return { success: false, message: 'Invalid username or password' };
  }
  // If HTML returned, stop
  if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
    return {
      success: false,
      message: "Appian returned HTML (authentication failed)",
      rawHtml: text,
    };
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return { success: false, message: "JSON Parse error", raw: text };
  }
}

export async function updateHcpProfile(token, userId, payload) {
  console.log("in api token,userId,payload", token, userId, payload)

  const url = backendURL + '/api/user/' + userId + '/updateProfile';

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    return { success: false, message: 'Invalid username or password' };
  }

  const data = await response.json();
  return data;
}
