import { Client } from "@notionhq/client";
document.addEventListener("DOMContentLoaded", function () {
  const form: HTMLElement = document.getElementById("form-data")!;
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const apiKey = (document.getElementById("api-key")! as HTMLInputElement)
      .value;
    const dbId = (document.getElementById("db-id")! as HTMLInputElement).value;
    const company = (document.getElementById("company")! as HTMLInputElement)
      .value;
    const role = (document.getElementById("role")! as HTMLInputElement).value;
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
      },
    });
    // log in backgroun file
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { data: response });
    });
  };

  form.addEventListener("submit", (e) => handleSubmit(e));
});
