import { isUserLogin, login } from "./auth";
import { getDBId } from "./store";
import { DB_CREATED, DB_NOT_AVAILABLE } from "./background";

isUserLogin().then((loggedIn) => {
  if (!loggedIn) {
    login();
  }
});

getDBId().then((dbId) => {
  if (dbId == "") {
    // trigger background event to execute database creating script
    chrome.runtime.sendMessage({ data: DB_NOT_AVAILABLE });
  } else {
    // trigger background event to execute main page script
    chrome.runtime.sendMessage({ data: DB_CREATED });
  }
});
