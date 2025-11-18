// app/src/api/auth.js
import { backendURL } from '../constants/apiConstants.js';

export async function fetchProfile(username, password,userId) {
  const url = backendURL + '/:' + userId + '/profile';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });

  if (response.status === 401) {
    return { success: false, message: 'Invalid username or password' };
  }

  const data = await response.json();
  return data;
}
