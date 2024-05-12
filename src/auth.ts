import { Buffer } from "buffer";
import { setAccessToken } from "./store";
const authUrl =
  "https://api.notion.com/v1/oauth/authorize?client_id=d69baf21-7711-4141-b13b-b73d026f1911&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fdfkecmdigbinodeabmogmmipioikkjjh.chromiumapp.org%2Fnotion-app";
const authRedirectUrl =
  "https://dfkecmdigbinodeabmogmmipioikkjjh.chromiumapp.org/notion-app";
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
    // exchange code for access token
    let encoded: string;
    try {
      const keys = fs.readFileSync("./.env", "utf-8").split(",");

      // encode in base 64
      encoded = Buffer.from(`${keys[0]}:${keys[1]}`).toString("base64");
    } catch (err) {
      console.log(err);
      throw err;
    }

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
    response.json().then((json) => {
      setAccessToken(json["access_token"]);
    });
  }
);
