// app/src/api/auth.js

// Demo: dummy login that resolves for a known credential.
// Replace with real API call (fetch/axios) when ready.

export async function apiLogin(email, password) {
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
// export async function apiLogin(email, password) {
//     const resp = await fetch('https://your-real-api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!resp.ok) {
//       const err = await resp.json();
//       return { success: false, message: err.message || 'Login failed' };
//     }

//     const json = await resp.json();
//     // expect json.token
//     return { success: true, token: json.token, user: json.user };
//   }
