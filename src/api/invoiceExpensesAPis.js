// app/src/api/auth.js
import { backendURL } from '../constants/apiConstants.js';

export async function fetchHcpAllInvoicesExpenses(token,userId) {
  const url = backendURL + '/api/user/' + userId + '/invoicesExpenses';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({ username})
  });

  if (response.status === 401) {
    return { success: false, message: 'Invalid username or password' };
  }

  const data = await response.json();
  return data;
}
