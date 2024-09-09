import { Buffer } from "buffer";
import { getAcessToken as getAccessToken, setAccessToken } from "./store";

const NOTION_OAUTH_CLIENT = process.env.NOTION_OAUTH_CLIENT;
const NOTION_OAUTH_SECRET = process.env.NOTION_OAUTH_SECRET;
const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID;
const NOTION_AUTH_REDIRECT_URL = `https://${CHROME_EXTENSION_ID}.chromiumapp.org/notion-app`;
const NOTION_AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_OAUTH_CLIENT}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
  NOTION_AUTH_REDIRECT_URL!
)}`;

export function isUserLogin() {
  return getAccessToken().then((token) => {
    if (token != "") {
      return true;
    }
    return false;
  });
}

export function login() {
  chrome.identity.launchWebAuthFlow(
    { url: NOTION_AUTH_URL!, interactive: true },
    async function (redirect_uri) {
      if (!redirect_uri) {
        throw Error("Couldn't find redirect url");
      }
      const redirectURL = new URL(redirect_uri);
      const params = redirectURL.searchParams;
      let code = params.get("code");
      let error = params.get("error");
      if (error) {
        throw Error("Some error happened.");
      }
      if (!code) {
        throw Error("Missing code returned.");
      }

      let encoded: string;
      try {
        // encode in base 64
        encoded = Buffer.from(
          `${NOTION_OAUTH_CLIENT}:${NOTION_OAUTH_SECRET}`
        ).toString("base64");
      } catch (err) {
        console.log(err);
        throw err;
      }
      // exchange code for access token
      const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${encoded}`,
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: NOTION_AUTH_REDIRECT_URL,
        }),
      });
      let accessToken: string = await response.json().then((json) => {
        return json["access_token"];
      });
      // store access token to chrome storage
      await setAccessToken(accessToken);
    }
  );
}
