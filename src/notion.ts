import { Client } from "@notionhq/client";
import { getAcessToken } from "./store";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

let apiKey: string = "";
let notion: Client;
getAcessToken().then((key) => {
  if (key != "") {
    apiKey = key;
    notion = new Client({ auth: apiKey });
  }
});

export async function addDescriptionPage(
  descId: string,
  description: string[]
) {
  const response = await notion.pages.create({
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
  return response.id;
}

export async function addJob(
  dbId: string,
  company: string,
  role: string,
  link: string,
  descriptionPageId: string
) {
  await notion.pages.create({
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
                id: descriptionPageId,
              },
            },
          },
        ],
      },
    },
  });
}

export async function getAccessiblePages() {
  const response = await notion.search({
    filter: {
      value: "page",
      property: "object",
    },
  });
  return response.results;
}
