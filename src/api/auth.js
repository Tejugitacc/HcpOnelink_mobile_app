// app/src/api/auth.js

// Demo: dummy login that resolves for a known credential.
// Replace with real API call (fetch/axios) when ready.
// https://dsi-hcp-dev.appiancloud.com/suite/webapi/mobileuserlogin

export async function loginToAppian(email, password) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 700));

  // Dummy check
  if (email === 'test@example.com' && password === '1234') {
    return {
      success: true,
      token: 'dummy_token_abcdef123456',
      user: { name: 'Test User', email }
    };
  }

  // Could return helpful server-style errors:
  return { success: false, message: 'Invalid credentials' };
}

//real api code
// auth.js
// export async function loginToAppian(username, password) {
//   const url =
//     'https://dsi-hcp-dev.appiancloud.com/suite/webapi/mobileuserlogin';

//   // Basic Auth header → base64(username:password)
//   // const token = btoa(`${username}:${password}`);

//   const response = await fetch(url, {
//     method: 'POST', // or POST: depends on your API, Appian accepts both
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Basic ' + btoa(username + ':' + password),
//       Origin: 'http://localhost:8081'
//     }
//   });

//   if (response.status === 401) {
//     return { success: false, message: 'Invalid username or password' };
//   }

//   const data = await response.json();
//   return data;
// }
