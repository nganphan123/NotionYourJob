import { Buffer } from "buffer";
import { getAcessToken, setAccessToken } from "./store";
const authUrl =
  "https://api.notion.com/v1/oauth/authorize?client_id=d69baf21-7711-4141-b13b-b73d026f1911&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fdfkecmdigbinodeabmogmmipioikkjjh.chromiumapp.org%2Fnotion-app";
const authRedirectUrl =
  "https://dfkecmdigbinodeabmogmmipioikkjjh.chromiumapp.org/notion-app";

getAcessToken().then((accessToken) => {
  // if user is not logged in
  if (accessToken == "") {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
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
          const NOTION_OAUTH_CLIENT = process.env.NOTION_OAUTH_CLIENT;
          const NOTION_OAUTH_SECRET = process.env.NOTION_OAUTH_SECRET;
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
            redirect_uri: authRedirectUrl,
          }),
        });
        accessToken = await response
          .json()
          .then((json) => json["access_token"]);
        // store access token to chrome storage
        await setAccessToken(accessToken);
      }
    );
  }
});
