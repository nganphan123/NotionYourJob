import { Client } from "@notionhq/client";
const form: HTMLElement | null = document.getElementById("notion-form-data");
const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault();
  const apiKey = (document.getElementById("api-key")! as HTMLInputElement)
    .value;
  const dbId = (document.getElementById("db-id")! as HTMLInputElement).value;
  const company = (document.getElementById("company")! as HTMLInputElement)
    .value;
  const role = (document.getElementById("role")! as HTMLInputElement).value;
  const link = (document.getElementById("job-link")! as HTMLInputElement).value;
  const notion = new Client({ auth: apiKey });
  const response = await notion.pages.create({
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
    },
  });
  // log in backgroun file
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id!, { data: response });
  });
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
