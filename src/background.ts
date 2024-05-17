// let active = false;

import { isUserLogin, login } from "./auth";

// function makeOrange(color: string): void {
//   document.body.style.backgroundColor = color;
// }

// chrome.action.onClicked.addListener((tab) => {
//   active = !active;
//   const color = active ? "orange" : "white";
//   chrome.scripting
//     .executeScript({
//       target: { tabId: tab.id ? tab.id : -1 },
//       func: makeOrange,
//       args: [color],
//     })
//     .then();
// });

export const DB_CREATED = "db_created";
export const DB_NOT_AVAILABLE = "db_not_available";
export const USER_IS_LOGGED_IN = "user_is_logged_in";

// isUserLogin().then((loggedIn) => {
//   if (!loggedIn) {
//     chrome.action.setPopup({ popup: "home.html" });
//     login();
//   } else {
//     chrome.action.setPopup({ popup: "index.html" });
//   }
// });

// chrome.runtime.onMessage.addListener(function (message) {
//   // if (message.data == USER_IS_LOGGED_IN) {
//   //   chrome.action.setPopup({ popup: "index.html" });
//   // }
//   // in both cases, user is already logged in and log in info is in local storage
//   if (message.data == DB_CREATED) {
//     // if database is available
//     chrome.tabs.executeScript({ file: "main.js" });
//   } else if (message.data == DB_NOT_AVAILABLE) {
//     // set up database if not available
//     chrome.tabs.executeScript({ file: "setupDB.ts" });
//   }
// });
