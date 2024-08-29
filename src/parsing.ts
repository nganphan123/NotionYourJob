import { parse } from "node-html-parser";
export function parsePage(html: string) {
  let dummy = parse(html);
  const lis = dummy.querySelectorAll("li");
  let desc: string[] = [];
  lis.forEach((li) => {
    if (li.childNodes.length == 1) {
      desc.push(li.innerText);
    }
  });
  return desc;
}

// TODO: refactor parsePage()
export function parsePage2(html: string){
  let parser = parse(html);
  const h1 = parser.querySelector("h1");
  return h1? h1.text : "";
}

export async function extractCurrentPageHTML(activeTabId: number) {
  var extractedResult = await chrome.scripting.executeScript({
    target: { tabId: activeTabId },
    // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
    func: DOMtoString,
    // args: ["body"],
  });

  if (!extractedResult[0].result) {
    throw Error("Some error happened. Couldn't parse page.");
  }

  return extractedResult[0].result;
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
