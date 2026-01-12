import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_URL =
  "https://dsi-hcp-dev.appiancloud.com/suite/authorization/oauth/token";

const CLIENT_ID = "_G-nxucYngOrMdF6lOXdIs7l8JIESuOnYAK0DrjMY_Q";
const CLIENT_SECRET = "cXmlp3CPXpniJ0klkxKendcbK4QH0beLOBorARzH_2PUszohS6XM5pwHvnD5o5h2vG1nWON5UOEIz90NwEsDSCNNU-uwBxAF_ssenxk_6Bez3Z_OvxMhNcGGM38R_eWXCHw8APtk3jGgg4vwlBQiAqz0KE9nL5fWL4CUnJ_cYfO-bNDStZTkt9VUS_xQL_4CknWCpGdlL8mDnpxa7hb5VpBbwnFcPlZAVcP-8FGwJxdFpU05__hwDDu3ClIDlrG2t31MpGfm7rpBSkcK4-i_VeZ87KvuouNhBd1SoN7faAcfK82GflTAfcIX6AJ7ldm4HKh5Rz8JICJq_uL2EhOetQ==";

const TOKEN_KEY = "APPIAN_OAUTH_TOKEN";


/**
 * Get valid OAuth token (reuse if not expired)
 */
export async function getOAuthToken() {
  const stored = await getStoredToken();

  if (stored) {
    // still valid (refresh 5 min early)
    if (Date.now() < stored.expiresAt - 300000) {
      return stored.accessToken;
    }
  }

  // Request new token
  const body =
    "grant_type=client_credentials" +
    `&client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&client_secret=${encodeURIComponent(CLIENT_SECRET)}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error("OAuth token request failed: " + errText);
  }

  const data = await response.json();

  const tokenData = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  await storeToken(tokenData);

  return tokenData.accessToken;
}

/**
 * Read token from AsyncStorage
 */
export async function getStoredToken() {
  const value = await AsyncStorage.getItem(TOKEN_KEY);
  return value ? JSON.parse(value) : null;
}

/**
 * Save token to AsyncStorage
 */
export async function storeToken(tokenData) {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
}

/**
 * Optional: clear token (manual logout)
 */
export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
