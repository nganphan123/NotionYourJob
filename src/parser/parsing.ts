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

export interface ParseObject {
  company: string | undefined;
  title: string | undefined;
  location: string | undefined;
}

// TODO: refactor parsePage()
export function parsePage2(html: string, url: string) {
  if (url == "") {
    // TODO: throw error if url is empty
    console.log("Url is empty");
    return null;
  }
  const result: ParseObject = {
    company: "",
    title: "",
    location: "",
  };
  let parser = parse(html);
  result.title = parser.querySelector("h1")?.text.trim();
  result.company = parser
    .querySelector('a[href*="linkedin.com/company"]')
    ?.text.trim();
  result.location = parser
    .querySelector("span.tvm__text tvm__text--low-emphasis")
    ?.text.trim();
  return result;
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
