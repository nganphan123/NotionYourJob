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

enum Domain {
  LINKEDIN = "linkedin",
  GLASSDOOR = "glassdoor",
  INDEED = "indeed",
}

const htmlTags = {
  // logged in
  [Domain.LINKEDIN]: {
    title: "div.job-details-jobs-unified-top-card__job-title>h1",
    company: "div.job-details-jobs-unified-top-card__company-name>a",
    location: "span.tvm__text tvm__text--low-emphasis",
  },
  // public
  [Domain.GLASSDOOR]: {
    title: "div.JobDetails_jobDetailsHeader__Hd9M3>h1",
    company: "div.EmployerProfile_employerNameContainer__tb7JV>h4",
    location: "div.JobDetails_location__mSg5h",
  },
  //public
  [Domain.INDEED]: {
    title: "h2.jobsearch-JobInfoHeader-title.css-1t78hkx.e1tiznh50>span",
    company: "div[data-company-name]>span>a",
    location: "div.css-waniwe eu4oa1w0>div",
  },
};
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
  let hostname: string = new URL(url).hostname;
  let tagObject = Object.entries(htmlTags).find(([key, _]) =>
    hostname.includes(key)
  );
  if (!tagObject) {
    // TODO: ui component to notify users to add values themselves
    console.log("No predefined tags for current domain.");
    return null;
  }
  let parser = parse(html);
  result.title = parser.querySelector(tagObject[1].title)?.text.trim();
  result.company = parser.querySelector(tagObject[1].company)?.text.trim();
  result.location = parser.querySelector(tagObject[1].location)?.text.trim();
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
