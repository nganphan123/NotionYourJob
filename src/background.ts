// let active = false;

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

chrome.runtime.onMessage.addListener(function (message) {
  // in both cases, user is already logged in and log in info is in local storage
  if (message.data == DB_CREATED) {
    // if database is available
    chrome.tabs.executeScript({ file: "main.js" });
  } else if (message.data == DB_NOT_AVAILABLE) {
    // set up database if not available
    chrome.tabs.executeScript({ file: "setupDB.ts" });
  }
});
