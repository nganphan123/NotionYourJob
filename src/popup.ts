import { Client } from "@notionhq/client";
import { extractCurrentPageHTML, parsePage } from "./parsing";
const form: HTMLElement | null = document.getElementById("notion-form-data");
const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault();
  const apiKey = (document.getElementById("api-key")! as HTMLInputElement)
    .value;
  const dbId = (document.getElementById("db-id")! as HTMLInputElement).value;
  const descId = (document.getElementById("desc-id")! as HTMLInputElement)
    .value;
  const company = (document.getElementById("company")! as HTMLInputElement)
    .value;
  const role = (document.getElementById("role")! as HTMLInputElement).value;
  const link = (document.getElementById("job-link")! as HTMLInputElement).value;
  const errorMessage = document.getElementById(
    "error-message"
  )! as HTMLInputElement;
  const notion = new Client({ auth: apiKey });

  // parse page
  let description: string[] = [];
  try {
    description = parsePage(await extractCurrentPageHTML());
  } catch (e) {
    if (e instanceof Error) {
      errorMessage.innerText = e.message;
    }
    return;
  }

  // create description page
  let createDescResp = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: descId,
    },
    properties: {
      title: [
        {
          text: {
            content: "Job 1",
          },
        },
      ],
    },

    children: description.map((line: string) => ({
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: {
              content: line,
              link: null,
            },
          },
        ],
      },
    })),
  });
  // add new job to db
  createDescResp = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: dbId,
    },
    properties: {
      Company: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: company,
            },
          },
        ],
      },
      Role: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: role,
            },
          },
        ],
      },
      Link: {
        type: "url",
        url: link,
      },
      Description: {
        type: "rich_text",
        rich_text: [
          {
            type: "mention",
            mention: {
              page: {
                id: createDescResp.id,
              },
            },
          },
        ],
      },
    },
  });
  errorMessage.innerText = "success";
};

if (form) {
  form.addEventListener("submit", (e) => handleSubmit(e));
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab: chrome.tabs.Tab = tabs[0];
    let tabUrl = activeTab.url;
    let jobLink = document.getElementById("job-link");
    (jobLink as HTMLInputElement).value = tabUrl ?? "";
  });
});
