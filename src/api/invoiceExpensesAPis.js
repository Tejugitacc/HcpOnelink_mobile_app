// src\api\invoiceExpensesAPis.js
import { invoicesExpensesURL } from '../constants/apiConstants';
import { authHeader } from '../helpers/apiHeader.js';

export async function fetchHcpAllInvoicesExpenses(userId) {
  const url = invoicesExpensesURL + '?userId=' + userId;
  const headers = await authHeader();

  const response = await fetch(url, {
    method: 'POST',
    headers,
  });

  const text = await response.text();

  console.log("RAW INVOices expenses:", text);

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
