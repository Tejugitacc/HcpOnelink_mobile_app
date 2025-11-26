// app/src/api/auth.js
import { backendURL } from '../constants/apiConstants.js';

export async function fetchHcpAllEngagements(token,userId) {

  const url = backendURL + '/api/user/' + userId + '/engagements';

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

export async function updateHcpProfile(token,userId,payload) {
  console.log("in api token,userId,payload",token,userId,payload)

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
