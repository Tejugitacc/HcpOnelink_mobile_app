// app/src/api/auth.js
import { backendURL } from '../constants/apiConstants.js';

export async function fetchHcpAllInvoicesExpenses(username,userId) {
  console.log("=== from  fetchHcpAllEngagements",username,userId)
  const url = backendURL + '/api/cache/' + userId + '/invoices&expenses';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username})
  });

  if (response.status === 401) {
    return { success: false, message: 'Invalid username or password' };
  }

  const data = await response.json();
  return data;
}
