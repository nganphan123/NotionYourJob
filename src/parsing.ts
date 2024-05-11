export function parsePage(html: string) {
  // dummy DOM element to query
  let dummy = document.createElement("html");
  dummy.innerHTML = html;
  const lis = dummy.querySelectorAll("li");
  let desc: string[] = [];
  lis.forEach((value) => {
    desc.push(value.innerText);
  });
  return desc;
}

export async function extractCurrentPageHTML() {
  let html: string;
  await chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
      var activeTab = tabs[0];
      var activeTabId = activeTab.id;

      if (!activeTabId) {
        throw Error("Couldn't find active tab id");
      }
      return chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
        func: DOMtoString,
        // args: ["body"],
      });
    })
    .then(function (results) {
      if (!results[0].result) {
        throw Error("Some error happened. Couldn't parse page.");
      }
      html = results[0].result;
    });
  return html!;
}

function DOMtoString(selector?: string) {
  let node;
  if (selector) {
    node = document.querySelector(selector);
    if (!node) throw Error("querySelector failed to find node");
  } else {
    node = document.documentElement;
  }
  return node.outerHTML;
}
