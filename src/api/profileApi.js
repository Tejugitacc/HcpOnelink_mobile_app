// src/api/profileApi.js
import { viewProfileURL } from '../constants/apiConstants';
import { authHeader } from '../helpers/apiHeader.js';

export async function fetchProfile(userId) {
  const url = viewProfileURL + '?userId=' + userId;

  const headers = await authHeader();

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const text = await response.text();

  console.log("RAW Appian response:", text);

  if (response.status === 401) {
    return { success: false, message: "Unauthorized" };
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
